import { NextRequest, NextResponse } from 'next/server';

import {
  getSessionByToken,
  getStudentDashboardData,
  getUserById,
  toSafeUser,
  updateStudentDashboardTask,
} from '@/lib/db';

async function getAuthenticatedUser(request: NextRequest) {
  const sessionToken = request.cookies.get('eb_session')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await getSessionByToken(sessionToken);
  if (!session) {
    return null;
  }

  const dbUser = await getUserById(session.user_id);
  if (!dbUser || !dbUser.is_active) {
    return null;
  }

  return toSafeUser(dbUser);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const dashboard = await getStudentDashboardData(user);
    return NextResponse.json({ user, ...dashboard }, { status: 200 });
  } catch (error: unknown) {
    console.error('Dashboard load error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const body = await request.json();
    const taskId = Number(body.taskId);
    const done = Boolean(body.done);

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return NextResponse.json({ error: 'Valid taskId is required.' }, { status: 400 });
    }

    const updatedTask = await updateStudentDashboardTask(user.id, taskId, done);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    const dashboard = await getStudentDashboardData(user);
    return NextResponse.json({ task: updatedTask, ...dashboard }, { status: 200 });
  } catch (error: unknown) {
    console.error('Dashboard update error:', error);
    return NextResponse.json(
      { error: 'Failed to update dashboard task.' },
      { status: 500 }
    );
  }
}
