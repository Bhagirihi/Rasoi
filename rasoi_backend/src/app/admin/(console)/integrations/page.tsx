import EasUpdatePanel from '@/app/admin/_components/EasUpdatePanel';
import SupabaseSyncPanel from '@/app/admin/_components/SupabaseSyncPanel';
import AdminPageHeader from '@/app/admin/_components/AdminPageHeader';
import AdminPageLayout from '@/app/admin/_components/AdminPageLayout';
import AdminPanel from '@/app/admin/_components/AdminPanel';
import {
  AdminCard,
  Badge,
  GhostButton,
} from '@/app/admin/_components/ui';
import { getAppConfig } from '@/lib/app-settings';
import {
  getBackendEnvStatus,
  getIntegrationStatusLabel,
  getIntegrationStatusTone,
  groupIntegrationsByCategory,
  INTEGRATION_EMAIL_ACCOUNTS,
  INTEGRATION_EMAIL_EXCLUSIONS,
  INTEGRATION_SERVICES,
} from '@/lib/integrations-catalog';
import {
  getEasOtaAdminDisabledReason,
  getEasOtaBranch,
  isEasOtaAdminConfigured,
} from '@/lib/eas-updates';

export default async function IntegrationsAdminPage() {
  const [envStatus, appConfig] = await Promise.all([Promise.resolve(getBackendEnvStatus()), getAppConfig()]);
  const grouped = groupIntegrationsByCategory(INTEGRATION_SERVICES);
  const easStatus = {
    configured: isEasOtaAdminConfigured(),
    branch: getEasOtaBranch(),
    disabledReason: getEasOtaAdminDisabledReason() ?? undefined,
  };

  return (
    <AdminPageLayout>
      <AdminPageHeader
        href="/admin/integrations"
        description="Services, accounts, and env vars used across Rasoi mobile, backend, and marketing. Reference for operators — no secrets are shown here."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminCard className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">Backend env</p>
          <p className="mt-2 text-sm text-admin-ink">
            Supabase {envStatus.supabase ? '✓' : '✗'} · DB {envStatus.database ? '✓' : '✗'} · JWT{' '}
            {envStatus.jwt ? '✓' : '✗'} · Cron {envStatus.cron ? '✓' : '✗'}
          </p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">Site</p>
          <p className="mt-2 text-sm text-admin-ink">
            {envStatus.siteUrl ? process.env.NEXT_PUBLIC_SITE_URL : 'NEXT_PUBLIC_SITE_URL not set'}
          </p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">Admin login</p>
          <p className="mt-2 text-sm font-medium text-admin-ink">{envStatus.adminEmail}</p>
        </AdminCard>
        <AdminCard className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">Payments</p>
          <p className="mt-2 text-sm text-admin-ink">
            {appConfig.paymentsEnabled ? 'RevenueCat path enabled in app' : 'Stub / early access (toggle at Payment)'}
          </p>
        </AdminCard>
      </div>

      <AdminPanel title="Mobile OTA (EAS Update)" description="Production JS updates without a new APK.">
        <EasUpdatePanel initialStatus={easStatus} />
      </AdminPanel>

      <AdminPanel title="Supabase data sync" description="Mirror auth users and content into Rasoi tables.">
        <SupabaseSyncPanel />
      </AdminPanel>

      <AdminPanel
        title="Email & accounts"
        description="Gmail addresses and service accounts tied to Rasoi. OTP mail is sent through Supabase SMTP, not the backend directly."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-admin-border text-[11px] font-semibold uppercase tracking-wide text-admin-muted">
                <th className="px-3 py-3">Account</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Used for</th>
              </tr>
            </thead>
            <tbody>
              {INTEGRATION_EMAIL_ACCOUNTS.map((row) => (
                <tr key={row.email} className="border-b border-admin-border/60 align-top">
                  <td className="px-3 py-4 font-medium text-admin-ink">{row.email}</td>
                  <td className="px-3 py-4 text-admin-muted">{row.role}</td>
                  <td className="px-3 py-4 text-admin-muted">
                    <ul className="space-y-1">
                      {row.usedFor.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                    {row.notes ? <p className="mt-2 text-xs text-admin-muted/90">{row.notes}</p> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-xl border border-admin-border/80 bg-admin-surface/40 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">
            Intentionally unchanged
          </p>
          <p className="mt-2 text-sm text-admin-muted">
            Public contact is <span className="font-medium text-admin-ink">{INTEGRATION_EMAIL_ACCOUNTS[0]?.email}</span>.
            These accounts were not replaced when that address was rolled out:
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {INTEGRATION_EMAIL_EXCLUSIONS.map((item) => (
              <li key={item.label} className="border-l-2 border-admin-border pl-4">
                <p className="font-medium text-admin-ink">{item.label}</p>
                <p className="mt-1 text-admin-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </AdminPanel>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-admin-muted">{category}</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <AdminCard key={item.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-admin-ink">{item.name}</h3>
                    <p className="mt-1 text-xs text-admin-muted">{item.account}</p>
                  </div>
                  <Badge tone={getIntegrationStatusTone(item.status)}>
                    {getIntegrationStatusLabel(item.status)}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-admin-muted">{item.purpose}</p>
                <p className="mt-3 text-xs leading-relaxed text-admin-ink">{item.statusNote}</p>
                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-admin-muted">Used in</p>
                  <ul className="mt-2 space-y-1 text-xs text-admin-muted">
                    {item.usedIn.map((path) => (
                      <li key={path}>· {path}</li>
                    ))}
                  </ul>
                </div>
                {item.envVars.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-admin-muted">Env / config</p>
                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-admin-ink">
                      {item.envVars.join(' · ')}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {item.consoleUrl ? (
                    <GhostButton href={item.consoleUrl.startsWith('/') ? item.consoleUrl : item.consoleUrl}>
                      Open console
                    </GhostButton>
                  ) : null}
                  {item.docsPath ? (
                    <span className="self-center text-xs text-admin-muted">Docs: {item.docsPath}</span>
                  ) : null}
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      ))}
    </AdminPageLayout>
  );
}
