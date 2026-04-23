import { NextRequest, NextResponse } from 'next/server';

import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import {
  createTransportFleetVehicle,
  getTransportFleetVehicles,
  updateTransportFleetVehicleStatus,
} from '@/lib/student-account';
import { hasAnyRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    const vehicles = await getTransportFleetVehicles(user);
    return NextResponse.json({ vehicles }, { status: 200 });
  } catch (error) {
    console.error('Transport fleet load error:', error);
    return NextResponse.json({ error: 'Failed to load fleet vehicles.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const model = String(body.model ?? '').trim();
    const plate = String(body.plate ?? '').trim();
    const capacity = String(body.capacity ?? '').trim();

    if (!model || !plate || !capacity) {
      return NextResponse.json({ error: 'Model, plate, and capacity are required.' }, { status: 400 });
    }

    await createTransportFleetVehicle(user, {
      model,
      plate,
      capacity,
      status: String(body.status ?? 'Active'),
      serviceStatus: String(body.serviceStatus ?? 'Passed'),
      imageUrl: String(body.imageUrl ?? ''),
      lastServiceDate: String(body.lastServiceDate ?? ''),
      insuranceStatus: String(body.insuranceStatus ?? 'Verified'),
    });

    const vehicles = await getTransportFleetVehicles(user);
    return NextResponse.json({ vehicles }, { status: 201 });
  } catch (error) {
    console.error('Transport fleet create error:', error);
    return NextResponse.json({ error: 'Failed to register fleet vehicle.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['transport', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'Transport access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const vehicleId = Number(body.vehicleId);
    const status = String(body.status ?? '').trim();

    if (!Number.isInteger(vehicleId) || vehicleId <= 0 || !status) {
      return NextResponse.json({ error: 'Valid vehicle and status are required.' }, { status: 400 });
    }

    const updated = await updateTransportFleetVehicleStatus(user, vehicleId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
    }

    const vehicles = await getTransportFleetVehicles(user);
    return NextResponse.json({ vehicles }, { status: 200 });
  } catch (error) {
    console.error('Transport fleet update error:', error);
    return NextResponse.json({ error: 'Failed to update fleet vehicle.' }, { status: 500 });
  }
}
