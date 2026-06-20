#!/usr/bin/env node
/** List EAS Android keystores + SHA-1 for Play Console matching. */
const path = require('path');

const easCliRoot = (() => {
  try {
    return path.dirname(require.resolve('eas-cli/package.json'));
  } catch {
    return '/usr/local/lib/node_modules/eas-cli';
  }
})();

const { createGraphqlClient } = require(path.join(
  easCliRoot,
  'build/commandUtils/context/contextUtils/createGraphqlClient',
));
const SessionManager = require(path.join(easCliRoot, 'build/user/SessionManager')).default;
const { UserQuery } = require(path.join(easCliRoot, 'build/graphql/queries/UserQuery'));
const androidApi = require(path.join(easCliRoot, 'build/credentials/android/api/GraphqlClient'));
const { displayAndroidKeystore } = require(path.join(
  easCliRoot,
  'build/credentials/android/utils/printCredentials',
));

const accountName = process.env.EAS_ACCOUNT || 'takeyshi';
const projectName = process.env.EAS_PROJECT || 'rasoi';
const androidPackage = process.env.ANDROID_PACKAGE || 'com.bhagihiri.rasoiapp';

function formatSha1(raw) {
  if (!raw) return 'unknown';
  const hex = raw.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  return hex.match(/.{1,2}/g).join(':');
}

async function main() {
  const sessionManager = new SessionManager({ logEvent() {} });
  const graphqlClient = createGraphqlClient({
    accessToken: sessionManager.getAccessToken(),
    sessionSecret: sessionManager.getSessionSecret(),
  });
  const actor = await UserQuery.currentUserAsync(graphqlClient);
  const account = actor?.accounts?.find((a) => a.name === accountName) || actor?.accounts?.[0];
  if (!account) throw new Error(`Account not found: ${accountName}`);

  const appLookup = { account, projectName, androidApplicationIdentifier: androidPackage };
  const creds = await androidApi.getAndroidAppCredentialsWithCommonFieldsAsync(graphqlClient, appLookup);
  if (!creds) {
    console.log('No Android credentials configured.');
    return;
  }

  console.log(`Android credentials for ${androidPackage}\n`);
  for (const profile of creds.androidAppBuildCredentialsList) {
    const ks = profile.androidKeystore;
    console.log(`Profile: ${profile.name}${profile.isDefault ? ' (default)' : ''}`);
    if (!ks) {
      console.log('  Keystore: none\n');
      continue;
    }
    console.log(`  Keystore ID: ${ks.id}`);
    console.log(`  Key alias:   ${ks.keyAlias}`);
    console.log(`  SHA1:        ${formatSha1(ks.sha1CertificateFingerprint)}`);
    console.log('');
  }

  const playExpected = '99:E3:73:6F:BA:9F:12:B0:2F:99:E9:70:4D:DA:85:15:E6:14:72:4A';
  const easUsed = 'FE:47:52:10:4C:D8:F7:78:C1:94:FE:B8:AF:D7:75:75:1E:31:A9:30';
  const match = creds.androidAppBuildCredentialsList.find(
    (p) => formatSha1(p.androidKeystore?.sha1CertificateFingerprint) === playExpected,
  );
  const current = creds.androidAppBuildCredentialsList.find(
    (p) => p.name === 'production',
  )?.androidKeystore;

  console.log('Play expects upload key SHA1:', playExpected);
  console.log('Last EAS AAB used SHA1:       ', easUsed);
  if (match) {
    console.log(`\nMatch found on profile "${match.name}" (keystore ${match.androidKeystore.id})`);
  } else {
    console.log('\nNo EAS keystore matches Play upload key — first upload likely used a different key.');
  }
  if (current) {
    console.log(`Production profile uses keystore ${current.id} → SHA1 ${formatSha1(current.sha1CertificateFingerprint)}`);
  }
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
