import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserFromRequest } from '@/lib/auth';
import { getPartnerFinanceSummary, getPartnerProfile, getPlatformPricingSettings } from '@/lib/db';
import { dbPool as pool } from '@/lib/postgres';
import { hasAnyRole } from '@/lib/rbac';

function getUniversityFilter(user: { university?: string }) {
  return String(user.university ?? '').trim();
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUserFromRequest(request);
  if (!user || !hasAnyRole(user.userType, ['university', 'admin', 'staff'])) {
    return NextResponse.json({ error: 'University access required.' }, { status: 403 });
  }

  try {
    const university = getUniversityFilter(user);
    if (!university) {
      return NextResponse.json(
        {
          students: [],
          metrics: {
            totalStudents: 0,
            paidStudents: 0,
            activeStudents: 0,
            onboardingCompleted: 0,
          },
          universityName: '',
        },
        { status: 200 }
      );
    }

    const [studentsResult, partnerProfile, finance, pricing] = await Promise.all([
      pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.country_of_origin, u.created_at, u.is_active, u.has_paid,
              COALESCE(profile.onboarding_completed, false) AS onboarding_completed,
              COALESCE(task_counts.total_tasks, 0) AS total_tasks,
              COALESCE(task_counts.completed_tasks, 0) AS completed_tasks
       FROM users u
       LEFT JOIN student_onboarding_profiles profile ON profile.user_id = u.id
       LEFT JOIN (
         SELECT user_id,
                COUNT(*) AS total_tasks,
                COUNT(*) FILTER (WHERE done = TRUE) AS completed_tasks
         FROM student_dashboard_tasks
         GROUP BY user_id
       ) task_counts ON task_counts.user_id = u.id
       WHERE u.user_type = 'student' AND u.university = $1
       ORDER BY u.created_at DESC, u.id DESC`,
      [university]
      ),
      getPartnerProfile(user.id),
      getPartnerFinanceSummary(user.id),
      getPlatformPricingSettings(),
    ]);

    const students = studentsResult.rows.map(row => ({
      id: row.id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      email: row.email,
      country: row.country_of_origin ?? '',
      isActive: row.is_active,
      hasPaid: row.has_paid,
      onboardingCompleted: row.onboarding_completed,
      totalTasks: Number(row.total_tasks ?? 0),
      completedTasks: Number(row.completed_tasks ?? 0),
      createdAt: row.created_at,
    }));

    return NextResponse.json(
      {
        students,
        universityName: university,
        metrics: {
          totalStudents: students.length,
          paidStudents: students.filter(student => student.hasPaid).length,
          activeStudents: students.filter(student => student.isActive).length,
          onboardingCompleted: students.filter(student => student.onboardingCompleted).length,
        },
        partnerProfile,
        finance,
        commissionPercent: partnerProfile?.commissionPercent ?? pricing.partnerDeductionPercent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('University summary load error:', error);
    return NextResponse.json({ error: 'Failed to load university dashboard.' }, { status: 500 });
  }
}
