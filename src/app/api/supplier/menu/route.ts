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
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !requireSupplier(user.userType)) {
    return NextResponse.json({ error: 'Supplier access required.' }, { status: 403 });
  }

  try {
    await ensureSupplierTables();
    const result = await pool.query(
      `SELECT id, name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags
       FROM food_menu_items
       ORDER BY id DESC`
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
  if (!user || !requireSupplier(user.userType)) {
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
      `INSERT INTO food_menu_items (name, price, delivery_fee, kitchen, prep_time, rating, image_url, tags)
       VALUES ($1, $2, $3, $4, $5, 5.0, $6, $7::jsonb)`,
      [
        name,
        price,
        Number.isFinite(deliveryFee) ? deliveryFee : 0,
        user.university || `${user.firstName} ${user.lastName}`.trim() || 'Platform Kitchen',
        prepTime,
        imageUrl,
        JSON.stringify(tags),
      ]
    );

    return GET(request);
  } catch (error) {
    console.error('Supplier menu create error:', error);
    return NextResponse.json({ error: 'Failed to create menu item.' }, { status: 500 });
  }
}
