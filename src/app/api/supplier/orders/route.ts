import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { recordPartnerTransaction } from '@/lib/db';
import { dbPool as pool } from '@/lib/postgres';
import { hasAnyRole } from '@/lib/rbac';

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

  await pool.query(`
    ALTER TABLE student_food_orders
    ADD COLUMN IF NOT EXISTS item_id INTEGER REFERENCES food_menu_items(id) ON DELETE SET NULL
  `);

  await pool.query(`
    ALTER TABLE student_food_orders
    ADD COLUMN IF NOT EXISTS supplier_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['supplier', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    await ensureSupplierTables();
    const scopedToOwner = user.userType === 'supplier';
    const result = await pool.query(
      `SELECT o.id, o.item_name, o.total, o.fulfillment, o.status, o.created_at,
              u.first_name, u.last_name, u.phone, u.email
       FROM student_food_orders o
       JOIN users u ON u.id = o.user_id
       WHERE ($1::boolean = false OR o.supplier_user_id = $2)
       ORDER BY o.created_at DESC, o.id DESC`
      ,
      [scopedToOwner, user.id]
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
  if (!user || !hasAnyRole(user.userType, ['supplier', 'admin', 'staff'])) {
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

    const scopedToOwner = user.userType === 'supplier';
    const result = await pool.query(
      `UPDATE student_food_orders
       SET status = $3
       WHERE id = $1 AND ($4::boolean = false OR supplier_user_id = $2)
       RETURNING id, supplier_user_id, total`,
      [orderId, user.id, status, scopedToOwner]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const row = result.rows[0];
    if (status === 'Delivered' && row.supplier_user_id) {
      await recordPartnerTransaction({
        partnerUserId: Number(row.supplier_user_id),
        grossAmountEur: Number(row.total),
        provider: 'food_order',
        reference: `food-order-${row.id}`,
      });
    }

    return GET(request);
  } catch (error) {
    console.error('Supplier order update error:', error);
    return NextResponse.json({ error: 'Failed to update supplier order.' }, { status: 500 });
  }
}
