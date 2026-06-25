'use server';

import { revalidatePath } from 'next/cache';

import { getAdminFromCookies } from '@/lib/auth';
import {
  formatSyncMembersSummary,
  syncAllSupabaseData,
  syncAuthUserToRasoi,
  syncKitchenStylesToPublic,
  syncRecipesToPublic,
  syncSupabaseMembersToRasoi,
  type SupabaseDataSyncSummary,
  type SyncKitchenStylesSummary,
  type SyncMemberResult,
  type SyncMembersSummary,
  type SyncRecipesSummary,
} from '@/lib/sync-supabase-data';

async function requireAdminSession() {
  const admin = await getAdminFromCookies();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

function revalidateAdminSyncPaths() {
  revalidatePath('/admin');
  revalidatePath('/admin/users');
  revalidatePath('/admin/integrations');
  revalidatePath('/admin/recipes');
}

export async function syncSupabaseMemberAction(
  supabaseUserId: string,
): Promise<SyncMemberResult> {
  await requireAdminSession();
  const result = await syncAuthUserToRasoi(supabaseUserId);
  if (result.status === 'created' || result.status === 'updated' || result.status === 'linked') {
    revalidateAdminSyncPaths();
  }
  return result;
}

export async function syncSupabaseMembersAction(): Promise<SyncMembersSummary> {
  await requireAdminSession();
  const summary = await syncSupabaseMembersToRasoi();
  revalidateAdminSyncPaths();
  return summary;
}

export async function syncSupabaseRecipesAction(): Promise<SyncRecipesSummary> {
  await requireAdminSession();
  const summary = await syncRecipesToPublic();
  revalidatePath('/admin/recipes');
  return summary;
}

export async function syncSupabaseKitchenStylesAction(): Promise<SyncKitchenStylesSummary> {
  await requireAdminSession();
  const summary = await syncKitchenStylesToPublic();
  revalidatePath('/admin/kitchen-styles');
  return summary;
}

export async function syncAllSupabaseDataAction(): Promise<SupabaseDataSyncSummary> {
  await requireAdminSession();
  const summary = await syncAllSupabaseData();
  revalidateAdminSyncPaths();
  return summary;
}

export async function syncSupabaseMembersActionMessage(): Promise<string> {
  const summary = await syncSupabaseMembersAction();
  return formatSyncMembersSummary(summary);
}
