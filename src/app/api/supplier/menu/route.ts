import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { dbPool as pool } from '@/lib/postgres';
import { hasAnyRole } from '@/lib/rbac';

async function ensureSupplierTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS food_menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      delivery_fee NUMERIC(10,2) NOT NULL,
      kitchen TEXT NOT NULL,
      prep_time TEXT NOT NULL,
      rating NUMERIC(3,1) NOT NULL,
      image_url TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]'::jsonb
    )
  `);

  await pool.query(`
    ALTER TABLE food_menu_items
    ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `);

  await pool.query(`
    ALTER TABLE food_menu_items
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE
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
      `SELECT id, name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags, is_active
       FROM food_menu_items
       WHERE ($1::boolean = false OR created_by_user_id = $2)
       ORDER BY id DESC`,
      [scopedToOwner, user.id]
    );

    return NextResponse.json(
      {
        items: result.rows.map(row => ({
          id: row.id,
          name: row.name,
          price: Number(row.price),
          deliveryFee: Number(row.delivery_fee),
          kitchen: row.kitchen,
          prepTime: row.prep_time,
          rating: Number(row.rating),
          imageUrl: row.image_url,
          tags: Array.isArray(row.tags) ? row.tags : [],
          isActive: row.is_active,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Supplier menu load error:', error);
    return NextResponse.json({ error: 'Failed to load menu items.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['supplier', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    await ensureSupplierTables();
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const price = Number(body.price);
    const deliveryFee = Number(body.deliveryFee ?? 0);
    const prepTime = String(body.prepTime ?? '').trim();
    const imageUrl = String(body.imageUrl ?? '').trim() || 'https://picsum.photos/seed/food-item/400/300';
    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
      : String(body.tags ?? '')
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);

    if (!name || !Number.isFinite(price) || price <= 0 || !prepTime) {
      return NextResponse.json(
        { error: 'Name, positive price, and prep time are required.' },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO food_menu_items (name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags, created_by_user_id, is_active)
       VALUES ($1, $2, $3, $4, $5, 5.0, $6, $7::jsonb, $8, TRUE)`,
      [
        name,
        price,
        Number.isFinite(deliveryFee) ? deliveryFee : 0,
        user.university || `${user.firstName} ${user.lastName}`.trim() || 'Platform Kitchen',
        prepTime,
        imageUrl,
        JSON.stringify(tags),
        user.id,
      ]
    );

    return GET(request);
  } catch (error) {
    console.error('Supplier menu create error:', error);
    return NextResponse.json({ error: 'Failed to create menu item.' }, { status: 500 });
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
    const itemId = Number(body.itemId);
    const isActive = Boolean(body.isActive);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json({ error: 'Valid item id is required.' }, { status: 400 });
    }

    const scopedToOwner = user.userType === 'supplier';
    const result = await pool.query(
      `UPDATE food_menu_items
       SET is_active = $3
       WHERE id = $1 AND ($4::boolean = false OR created_by_user_id = $2)
       RETURNING id`,
      [itemId, user.id, isActive, scopedToOwner]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
    }

    return GET(request);
  } catch (error) {
    console.error('Supplier menu update error:', error);
    return NextResponse.json({ error: 'Failed to update menu item.' }, { status: 500 });
  }
}
