import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function requireSupplier(userType?: string) {
  return userType === 'supplier' || userType === 'admin' || userType === 'staff';
}

async function ensureSupplierTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_food_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item_name TEXT NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      fulfillment TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Initialized',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireSupplier(user.userType)) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    await ensureSupplierTables();
    const result = await pool.query(
      `SELECT o.id, o.item_name, o.total, o.fulfillment, o.status, o.created_at,
              u.first_name, u.last_name, u.phone, u.email
       FROM student_food_orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC, o.id DESC`
    );

    return NextResponse.json(
      {
        orders: result.rows.map(row => ({
          id: row.id,
          itemName: row.item_name,
          total: Number(row.total),
          fulfillment: row.fulfillment,
          status: row.status,
          createdAt: row.created_at,
          studentName: `${row.first_name} ${row.last_name}`.trim(),
          phone: row.phone ?? '',
          email: row.email,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Supplier orders load error:', error);
    return NextResponse.json({ error: 'Failed to load supplier orders.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireSupplier(user.userType)) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    await ensureSupplierTables();
    const body = await request.json();
    const orderId = Number(body.orderId);
    const status = String(body.status ?? '').trim();

    if (!Number.isInteger(orderId) || orderId <= 0 || !status) {
      return NextResponse.json({ error: 'Valid orderId and status are required.' }, { status: 400 });
    }

    await pool.query(
      `UPDATE student_food_orders
       SET status = $2
       WHERE id = $1`,
      [orderId, status]
    );

    return GET(request);
  } catch (error) {
    console.error('Supplier order update error:', error);
    return NextResponse.json({ error: 'Failed to update supplier order.' }, { status: 500 });
  }
}
