import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DEFAULT_EAS_PROJECT_ID = '01de1672-85ce-4ad7-83d7-7fc958fc5659';
const DEFAULT_OTA_BRANCH = 'production';

export type EasUpdateSummary = {
  group: string;
  message: string;
  runtimeVersion: string;
  platforms: string;
  createdAtLabel: string;
};

type EasUpdateListResponse = {
  name: string;
  id: string;
  currentPage: Array<{
    branch: string;
    message: string;
    runtimeVersion: string;
    group: string;
    platforms: string;
    isRollBackToEmbedded?: boolean;
  }>;
};

export type EasRollbackResult = {
  ok: boolean;
  message: string;
  republishedGroup?: string;
  previousHeadGroup?: string;
};

function requireExpoToken(): string {
  const token = process.env.EXPO_TOKEN?.trim();
  if (!token) {
    throw new Error(
      'EXPO_TOKEN is not configured on the backend. Create a token at expo.dev → Access tokens and add it to Vercel env.',
    );
  }
  return token;
}

function resolveMobileRoot(): string {
  const candidates = [
    path.join(process.cwd(), 'rasoi_mobile'),
    path.join(process.cwd(), '..', 'rasoi_mobile'),
  ];

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'app.json'))) {
      return candidate;
    }
  }

  throw new Error('rasoi_mobile directory not found (expected app.json beside backend).');
}

async function runEasCli(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const mobileRoot = resolveMobileRoot();
  const env = {
    ...process.env,
    EXPO_TOKEN: requireExpoToken(),
  };

  try {
    return await execFileAsync('npx', ['eas-cli@16', ...args], {
      cwd: mobileRoot,
      env,
      maxBuffer: 10 * 1024 * 1024,
      timeout: 180_000,
    });
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string; message?: string };
    const detail = [execError.stderr, execError.stdout, execError.message]
      .filter(Boolean)
      .join('\n')
      .trim();
    throw new Error(detail || 'EAS CLI command failed');
  }
}

function parseUpdateList(stdout: string): EasUpdateSummary[] {
  const payload = JSON.parse(stdout) as EasUpdateListResponse;
  const seen = new Set<string>();
  const updates: EasUpdateSummary[] = [];

  for (const row of payload.currentPage ?? []) {
    if (!row.group || seen.has(row.group)) continue;
    seen.add(row.group);
    updates.push({
      group: row.group,
      message: row.message,
      runtimeVersion: row.runtimeVersion,
      platforms: row.platforms,
      createdAtLabel: row.message,
    });
  }

  return updates;
}

export function getEasProjectId(): string {
  return process.env.EAS_PROJECT_ID?.trim() || DEFAULT_EAS_PROJECT_ID;
}

export function getEasOtaBranch(): string {
  return process.env.EAS_OTA_BRANCH?.trim() || DEFAULT_OTA_BRANCH;
}

export function isEasOtaAdminConfigured(): boolean {
  return Boolean(process.env.EXPO_TOKEN?.trim());
}

export async function listEasProductionUpdates(limit = 8): Promise<EasUpdateSummary[]> {
  const branch = getEasOtaBranch();
  const { stdout } = await runEasCli([
    'update:list',
    '--branch',
    branch,
    '--limit',
    String(limit),
    '--json',
    '--non-interactive',
  ]);

  return parseUpdateList(stdout);
}

/**
 * Republish the update group that was live before the current head — functional rollback.
 */
export async function rollbackLastEasOtaUpdate(): Promise<EasRollbackResult> {
  const branch = getEasOtaBranch();
  const updates = await listEasProductionUpdates(12);

  if (updates.length === 0) {
    return {
      ok: false,
      message: `No OTA updates found on branch "${branch}".`,
    };
  }

  if (updates.length === 1) {
    return {
      ok: false,
      message:
        `Only one update exists on "${branch}" (${updates[0].group.slice(0, 8)}…). ` +
        'Publish another OTA first, or use `eas update:rollback` locally to return to the APK embedded bundle.',
      previousHeadGroup: updates[0].group,
    };
  }

  const currentHead = updates[0];
  const rollbackTarget = updates.find(
    (row, index) => index > 0 && row.runtimeVersion === currentHead.runtimeVersion,
  );

  if (!rollbackTarget) {
    return {
      ok: false,
      message:
        `No earlier OTA with runtime ${currentHead.runtimeVersion} on "${branch}". ` +
        'Rollback only works within the same runtime version as installed APKs. ' +
        'Ship a fix OTA or use `eas update:rollback` locally to return to the embedded APK bundle.',
      previousHeadGroup: currentHead.group,
    };
  }
  const rollbackMessage = `Admin rollback — restore ${rollbackTarget.group.slice(0, 8)} (was after ${currentHead.group.slice(0, 8)})`;

  await runEasCli([
    'update:republish',
    '--group',
    rollbackTarget.group,
    '--message',
    rollbackMessage,
    '--platform',
    'android',
    '--non-interactive',
  ]);

  return {
    ok: true,
    message: `Rolled back production OTA to ${rollbackTarget.message}`,
    republishedGroup: rollbackTarget.group,
    previousHeadGroup: currentHead.group,
  };
}
