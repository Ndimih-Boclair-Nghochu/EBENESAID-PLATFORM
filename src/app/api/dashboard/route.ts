import { NextRequest, NextResponse } from 'next/server';

import {
  getStudentOnboardingProfile,
  getSessionByToken,
  getStudentDashboardData,
  type StudentProgramDurationBand,
  getUserById,
  saveStudentOnboardingSelection,
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

function getDashboardErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (
    lower.includes('connect') ||
    lower.includes('connection') ||
    lower.includes('database') ||
    lower.includes('pool') ||
    lower.includes('timeout')
  ) {
    return {
      error: 'Dashboard database connection failed.',
      detail: message,
      source: 'database',
    };
  }

  if (lower.includes('student_dashboard_tasks') || lower.includes('relation')) {
    return {
      error: 'Dashboard table is missing or not ready.',
      detail: message,
      source: 'schema',
    };
  }

  return {
    error: 'Dashboard failed to load.',
    detail: message,
    source: 'unknown',
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const dashboard = await getStudentDashboardData(user);
    const onboarding = await getStudentOnboardingProfile(user.id);
    return NextResponse.json({ user, onboarding, ...dashboard }, { status: 200 });
  } catch (error: unknown) {
    console.error('Dashboard load error:', error);
    return NextResponse.json(getDashboardErrorDetails(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const body = await request.json();
    const requestedBand = String(body.programDurationBand ?? '').trim();
    const programDurationBand: StudentProgramDurationBand =
      requestedBand === 'under_3_months' || requestedBand === 'over_3_months' || requestedBand === 'already_in_latvia'
        ? requestedBand
        : 'over_3_months';

    const dashboard = await saveStudentOnboardingSelection(user.id, programDurationBand);
    const onboarding = await getStudentOnboardingProfile(user.id);
    return NextResponse.json({ onboarding, ...dashboard }, { status: 200 });
  } catch (error: unknown) {
    console.error('Dashboard onboarding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save onboarding selection.' },
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
