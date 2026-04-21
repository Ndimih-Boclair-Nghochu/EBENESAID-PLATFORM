import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireTransport(userType?: string) {
  return userType === 'transport' || userType === 'admin' || userType === 'staff';
}

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
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireTransport(user.userType)) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    await ensureTransportTables();
    const result = await pool.query(
      `SELECT b.id, b.airport_code, b.destination, b.pickup_status, b.pickup_booked, b.notes, b.updated_at,
              u.id AS user_id, u.first_name, u.last_name, u.phone, u.email, u.country_of_origin
       FROM student_arrival_bookings b
       JOIN users u ON u.id = b.user_id
       ORDER BY b.updated_at DESC, b.id DESC`
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
  if (!user || !requireTransport(user.userType)) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    await ensureTransportTables();
    const body = await request.json();
    const bookingId = Number(body.bookingId);
    const pickupStatus = String(body.pickupStatus ?? '').trim();

    if (!Number.isInteger(bookingId) || bookingId <= 0 || !pickupStatus) {
      return NextResponse.json({ error: 'Valid bookingId and pickupStatus are required.' }, { status: 400 });
    }

    await pool.query(
      `UPDATE student_arrival_bookings
       SET pickup_status = $2,
           pickup_booked = CASE WHEN $2 IN ('Assigned', 'In Transit', 'Completed') THEN TRUE ELSE pickup_booked END,
           updated_at = NOW()
       WHERE id = $1`,
      [bookingId, pickupStatus]
    );

    return GET(request);
  } catch (error) {
    console.error('Transport pickup update error:', error);
    return NextResponse.json({ error: 'Failed to update pickup job.' }, { status: 500 });
  }
}
