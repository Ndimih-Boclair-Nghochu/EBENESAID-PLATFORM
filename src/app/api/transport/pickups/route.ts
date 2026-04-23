import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { dbPool as pool } from '@/lib/postgres';
import { hasAnyRole } from '@/lib/rbac';

async function ensureTransportTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_arrival_bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      airport_code TEXT NOT NULL,
      destination TEXT NOT NULL,
      pickup_status TEXT NOT NULL,
      pickup_booked BOOLEAN NOT NULL DEFAULT FALSE,
      notes TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE student_arrival_bookings
    ADD COLUMN IF NOT EXISTS assigned_transport_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);

  await pool.query(`
    ALTER TABLE student_arrival_bookings
    ADD COLUMN IF NOT EXISTS assigned_vehicle_id INTEGER
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transport_fleet_vehicles (
      id SERIAL PRIMARY KEY,
      created_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      model TEXT NOT NULL,
      plate TEXT NOT NULL,
      capacity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      service_status TEXT NOT NULL DEFAULT 'Passed',
      image_url TEXT NOT NULL DEFAULT '',
      last_service_date TEXT NOT NULL DEFAULT '',
      insurance_status TEXT NOT NULL DEFAULT 'Verified',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (created_by_user_id, plate)
    )
  `);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    await ensureTransportTables();
    const scopedToOwner = user.userType === 'transport';
    const result = await pool.query(
      `SELECT b.id, b.airport_code, b.destination, b.pickup_status, b.pickup_booked, b.notes, b.updated_at,
              b.assigned_transport_user_id, b.assigned_vehicle_id,
              v.model AS vehicle_model, v.plate AS vehicle_plate,
              u.id AS user_id, u.first_name, u.last_name, u.phone, u.email, u.country_of_origin
       FROM student_arrival_bookings b
       JOIN users u ON u.id = b.user_id
       LEFT JOIN transport_fleet_vehicles v ON v.id = b.assigned_vehicle_id
       WHERE ($1::boolean = false OR b.assigned_transport_user_id = $2 OR b.assigned_transport_user_id IS NULL)
       ORDER BY b.updated_at DESC, b.id DESC`,
      [scopedToOwner, user.id]
    );

    return NextResponse.json(
      {
        pickups: result.rows.map(row => ({
          id: row.id,
          userId: row.user_id,
          airportCode: row.airport_code,
          destination: row.destination,
          pickupStatus: row.pickup_status,
          pickupBooked: row.pickup_booked,
          notes: row.notes,
          updatedAt: row.updated_at,
          assignedTransportUserId: row.assigned_transport_user_id ?? null,
          assignedVehicleId: row.assigned_vehicle_id ?? null,
          vehicleLabel: row.vehicle_model && row.vehicle_plate ? `${row.vehicle_model} (${row.vehicle_plate})` : '',
          studentName: `${row.first_name} ${row.last_name}`.trim(),
          phone: row.phone ?? '',
          email: row.email,
          country: row.country_of_origin ?? '',
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Transport pickups load error:', error);
    return NextResponse.json({ error: 'Failed to load pickup jobs.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    await ensureTransportTables();
    const body = await request.json();
    const bookingId = Number(body.bookingId);
    const pickupStatus = String(body.pickupStatus ?? '').trim();
    const vehicleId = body.vehicleId === undefined || body.vehicleId === null || body.vehicleId === '' ? null : Number(body.vehicleId);

    if (!Number.isInteger(bookingId) || bookingId <= 0 || !pickupStatus) {
      return NextResponse.json({ error: 'Valid bookingId and pickupStatus are required.' }, { status: 400 });
    }

    if (vehicleId !== null && (!Number.isInteger(vehicleId) || vehicleId <= 0)) {
      return NextResponse.json({ error: 'Valid vehicle id is required.' }, { status: 400 });
    }

    if (user.userType === 'transport' && vehicleId !== null) {
      const vehicle = await pool.query(
        `SELECT id FROM transport_fleet_vehicles WHERE id = $1 AND created_by_user_id = $2`,
        [vehicleId, user.id]
      );

      if (!vehicle.rows[0]) {
        return NextResponse.json({ error: 'Vehicle not found for this transport account.' }, { status: 404 });
      }
    }

    const scopedToOwner = user.userType === 'transport';
    const result = await pool.query(
      `UPDATE student_arrival_bookings
       SET pickup_status = $2,
           pickup_booked = CASE WHEN $2 IN ('Assigned', 'In Transit', 'Completed') THEN TRUE ELSE pickup_booked END,
           assigned_transport_user_id = CASE WHEN $5::boolean = TRUE THEN $3 ELSE assigned_transport_user_id END,
           assigned_vehicle_id = COALESCE($4, assigned_vehicle_id),
           updated_at = NOW()
       WHERE id = $1 AND ($5::boolean = false OR assigned_transport_user_id = $3 OR assigned_transport_user_id IS NULL)
       RETURNING id`,
      [bookingId, pickupStatus, user.id, vehicleId, scopedToOwner]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Pickup job not found.' }, { status: 404 });
    }

    return GET(request);
  } catch (error) {
    console.error('Transport pickup update error:', error);
    return NextResponse.json({ error: 'Failed to update pickup job.' }, { status: 500 });
  }
}
