'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function updateFeedbackStatusAction(id: string, status: string) {
  await requireAdminSession();

  const valid = status === 'pending' || status === 'reviewed' || status === 'resolved';
  if (!valid) throw new Error('Invalid status');

  await db.userFeedback.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/feedback');
  revalidatePath('/admin');
}

export async function deleteFeedbackAction(id: string) {
  await requireAdminSession();
  await db.userFeedback.delete({ where: { id } });
  revalidatePath('/admin/feedback');
  revalidatePath('/admin');
}
