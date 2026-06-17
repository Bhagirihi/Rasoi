import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'fcm-service-account.json');
const project = process.env.FIREBASE_PROJECT_ID || 'rasoi-app-prod';

const configPath = path.join(os.homedir(), '.config/configstore/firebase-tools.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const refreshToken = config.tokens?.refresh_token;
if (!refreshToken) {
  console.error('Firebase CLI not logged in. Run: npx firebase-tools login --reauth');
  process.exit(1);
}

function request(method, url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = body == null ? null : typeof body === 'string' ? body : JSON.stringify(body);
    const req = https.request(
      {
        method,
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          ...(payload
            ? {
                'Content-Type':
                  typeof body === 'string' && body.includes('=')
                    ? 'application/x-www-form-urlencoded'
                    : 'application/json',
                'Content-Length': Buffer.byteLength(payload),
              }
            : {}),
          ...headers,
        },
      },
      (res) => {
        let out = '';
        res.on('data', (chunk) => {
          out += chunk;
        });
        res.on('end', () => resolve({ status: res.statusCode, body: out }));
      },
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function getAccessToken() {
  const res = await request(
    'POST',
    'https://oauth2.googleapis.com/token',
    new URLSearchParams({
      client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
      client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  );
  const json = JSON.parse(res.body);
  if (!json.access_token) {
    throw new Error(`Token refresh failed: ${res.body}`);
  }
  return json.access_token;
}

async function main() {
  const access = await getAccessToken();
  const list = await request(
    'GET',
    `https://iam.googleapis.com/v1/projects/${project}/serviceAccounts`,
    null,
    { Authorization: `Bearer ${access}` },
  );
  const accounts = JSON.parse(list.body).accounts || [];
  const firebaseSa = accounts.find((a) => a.email?.includes('firebase-adminsdk'));
  if (!firebaseSa) {
    throw new Error(`No firebase-adminsdk account in ${project}`);
  }

  const keyRes = await request(
    'POST',
    `https://iam.googleapis.com/v1/${firebaseSa.name}/keys`,
    {
      keyAlgorithm: 'KEY_ALG_RSA_2048',
      privateKeyType: 'TYPE_GOOGLE_CREDENTIALS_FILE',
    },
    { Authorization: `Bearer ${access}` },
  );

  if (keyRes.status !== 200) {
    throw new Error(`Key creation failed (${keyRes.status}): ${keyRes.body}`);
  }

  const keyJson = JSON.parse(keyRes.body);
  const decoded = Buffer.from(keyJson.privateKeyData, 'base64').toString('utf8');
  fs.writeFileSync(outPath, decoded);
  console.log(`Saved: ${outPath}`);
  console.log(`Service account: ${firebaseSa.email}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
