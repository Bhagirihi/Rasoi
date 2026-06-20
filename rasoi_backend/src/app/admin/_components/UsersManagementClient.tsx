'use client';

import { useMemo, useState } from 'react';

import AdminDrawer from '@/app/admin/_components/AdminDrawer';
import BulkMealNotificationBar from '@/app/admin/_components/BulkMealNotificationBar';
import { DataTable } from '@/app/admin/_components/DataTable';
import SendCustomNotificationControl from '@/app/admin/_components/SendCustomNotificationControl';
import SendMealNotificationControl from '@/app/admin/_components/SendMealNotificationControl';
import UserAccountStatusControl from '@/app/admin/_components/UserAccountStatusControl';
import type { AdminUserRow } from '@/app/admin/_components/admin-users-types';
import { formatAdminJoinedAt } from '@/app/admin/_components/admin-users-types';
import { Badge } from '@/app/admin/_components/ui';

type DrawerTab = 'profile' | 'notifications' | 'account';

const TAB_LABELS: Record<DrawerTab, string> = {
  profile: 'Profile',
  notifications: 'Notifications',
  account: 'Account',
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-admin-border/70 py-3 last:border-b-0">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-admin-muted">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-admin-ink">{value}</span>
    </div>
  );
}

export default function UsersManagementClient({ users }: { users: AdminUserRow[] }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('profile');

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  );

  const openDrawer = (userId: string) => {
    setSelectedUserId(userId);
    setDrawerTab('profile');
  };

  return (
    <div className="space-y-5">
      <BulkMealNotificationBar users={users} />

      <DataTable
        columns={['Name', 'Email', 'Account', 'Joined', 'Location', 'Status', 'Diet', 'Plan', 'Push', '']}
        emptyMessage="No members match these filters."
      >
        {users.map((user) => (
          <tr
            key={user.id}
            className="cursor-pointer transition hover:bg-[#f7f2ea]"
            onClick={() => openDrawer(user.id)}
          >
            <td className="px-5 py-4">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openDrawer(user.id);
                }}
                className="font-medium text-admin-ink transition hover:text-admin-gold hover:underline"
              >
                {user.name}
              </button>
            </td>
            <td className="px-5 py-4 text-sm text-admin-muted">{user.email ?? '—'}</td>
            <td className="px-5 py-4">
              <Badge tone={user.isGuest ? 'neutral' : 'gold'}>{user.accountLabel}</Badge>
            </td>
            <td className="px-5 py-4 text-sm text-admin-muted">{formatAdminJoinedAt(user.createdAt)}</td>
            <td className="px-5 py-4 text-sm text-admin-muted">
              {user.city ? `${user.city}${user.state ? `, ${user.state}` : ''}` : '—'}
            </td>
            <td className="px-5 py-4">
              <Badge tone={user.isActive ? 'success' : 'warning'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </td>
            <td className="px-5 py-4">
              <Badge tone="gold">{user.dietLabel}</Badge>
            </td>
            <td className="px-5 py-4">
              <Badge tone="neutral">{user.planTier}</Badge>
            </td>
            <td className="px-5 py-4 text-sm text-admin-muted">
              {user.pushTokenCount > 0
                ? `${user.pushTokenCount} device${user.pushTokenCount === 1 ? '' : 's'}`
                : '—'}
            </td>
            <td className="px-5 py-4 text-right">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  openDrawer(user.id);
                }}
                className="rounded-full border border-admin-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-admin-muted transition hover:border-admin-gold/50"
              >
                Open
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      <AdminDrawer
        open={selectedUser !== null}
        title={selectedUser?.name ?? ''}
        subtitle={selectedUser?.email ?? selectedUser?.phone ?? 'Member profile'}
        eyebrow="Member details"
        onClose={() => setSelectedUserId(null)}
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 border-b border-admin-border pb-1">
              {(Object.keys(TAB_LABELS) as DrawerTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDrawerTab(tab)}
                  className={
                    drawerTab === tab
                      ? 'border-b-2 border-admin-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-admin-ink'
                      : 'px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-admin-muted transition hover:text-admin-ink'
                  }
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {drawerTab === 'profile' && (
              <>
                <section className="admin-card rounded-2xl px-4 py-2">
                  <DetailRow
                    label="Status"
                    value={selectedUser.isActive ? 'Active' : 'Deactivated'}
                  />
                  <DetailRow label="Email" value={selectedUser.email ?? '—'} />
                  <DetailRow label="Phone" value={selectedUser.phone ?? '—'} />
                  <DetailRow label="Account type" value={selectedUser.accountLabel} />
                  <DetailRow label="Joined" value={formatAdminJoinedAt(selectedUser.createdAt)} />
                  <DetailRow
                    label="Terms accepted"
                    value={
                      selectedUser.termsAcceptedAt
                        ? formatAdminJoinedAt(selectedUser.termsAcceptedAt)
                        : selectedUser.isGuest
                          ? 'Not required (guest)'
                          : '—'
                    }
                  />
                  <DetailRow
                    label="Location"
                    value={
                      selectedUser.city
                        ? `${selectedUser.city}${selectedUser.state ? `, ${selectedUser.state}` : ''}`
                        : 'Not set'
                    }
                  />
                  {selectedUser.latitude != null && selectedUser.longitude != null && (
                    <DetailRow
                      label="Coordinates"
                      value={`${selectedUser.latitude.toFixed(4)}, ${selectedUser.longitude.toFixed(4)}`}
                    />
                  )}
                  {selectedUser.locationUpdatedAt && (
                    <DetailRow
                      label="Location updated"
                      value={new Date(selectedUser.locationUpdatedAt).toLocaleString('en-IN')}
                    />
                  )}
                  <DetailRow label="Region" value={selectedUser.regionalCuisine} />
                  <DetailRow
                    label="Cuisines"
                    value={
                      selectedUser.favoriteCuisines.length > 0
                        ? selectedUser.favoriteCuisines.join(', ')
                        : '—'
                    }
                  />
                  <DetailRow label="Timezone" value={selectedUser.timezone} />
                  <DetailRow
                    label="Onboarding"
                    value={selectedUser.hasCompletedOnboarding ? 'Complete' : 'Pending'}
                  />
                  <DetailRow
                    label="Notifications"
                    value={selectedUser.notificationsEnabled ? 'On' : 'Off'}
                  />
                  <DetailRow
                    label="Push devices"
                    value={
                      selectedUser.pushTokenCount > 0
                        ? `${selectedUser.pushTokenCount} active`
                        : 'None registered'
                    }
                  />
                </section>

                {selectedUser.ineligibleReasons.length > 0 && (
                  <div className="rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                    <p className="font-semibold">Delivery notes</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {selectedUser.ineligibleReasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                    {selectedUser.pushTokenCount > 0 && (
                      <p className="mt-2 text-xs text-amber-900/80">
                        Admin can still send when a push token exists.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {drawerTab === 'notifications' && (
              <div className="space-y-6">
                <section className="space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
                      Meal pick notification
                    </p>
                    <p className="mt-1 text-sm text-admin-muted">
                      Pick a meal slot and preview or send a personalized recipe push.
                    </p>
                  </div>

                  <SendMealNotificationControl
                    userId={selectedUser.id}
                    userName={selectedUser.name}
                    pushTokenCount={selectedUser.pushTokenCount}
                    ineligibleReasons={selectedUser.ineligibleReasons}
                    layout="drawer"
                  />
                </section>

                <section className="space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
                      Custom message
                    </p>
                    <p className="mt-1 text-sm text-admin-muted">
                      Send a one-off push with your own title and body.
                    </p>
                  </div>

                  <SendCustomNotificationControl
                    userId={selectedUser.id}
                    userName={selectedUser.name}
                    pushTokenCount={selectedUser.pushTokenCount}
                  />
                </section>
              </div>
            )}

            {drawerTab === 'account' && (
              <section className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-admin-muted">
                    Account access
                  </p>
                  <p className="mt-1 text-sm text-admin-muted">
                    Deactivated members cannot sign in or use the app. You can reactivate them anytime.
                  </p>
                </div>

                <UserAccountStatusControl
                  userId={selectedUser.id}
                  userName={selectedUser.name}
                  isActive={selectedUser.isActive}
                />
              </section>
            )}
          </div>
        )}
      </AdminDrawer>
    </div>
  );
}
