#!/usr/bin/env node
/** Point com.bhagihiri.rasoiapp production builds at the Play-registered upload keystore. */
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

const accountName = process.env.EAS_ACCOUNT || 'takeyshi';
const projectName = process.env.EAS_PROJECT || 'rasoi';
const androidPackage = process.env.ANDROID_PACKAGE || 'com.bhagihiri.rasoiapp';
const profileName = process.env.EAS_BUILD_PROFILE || 'production';
/** Keystore Play Console expects (from com.rasoi.app production). */
const playUploadKeystoreId =
  process.env.PLAY_UPLOAD_KEYSTORE_ID || 'def8a336-40b7-46f1-a6f9-a61bcfc89cc1';

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
  const buildCreds = await androidApi.getAndroidAppBuildCredentialsByNameAsync(
    graphqlClient,
    appLookup,
    profileName,
  );
  if (!buildCreds) {
    throw new Error(`No build credentials for profile "${profileName}" on ${androidPackage}`);
  }

  const current = buildCreds.androidKeystore;
  if (current?.id === playUploadKeystoreId) {
    console.log(`Already using Play upload keystore ${playUploadKeystoreId}`);
    console.log(`SHA1: ${formatSha1(current.sha1CertificateFingerprint)}`);
    return;
  }

  console.log(`Switching ${androidPackage} / ${profileName} keystore:`);
  if (current) {
    console.log(`  from ${current.id} (SHA1 ${formatSha1(current.sha1CertificateFingerprint)})`);
  }
  console.log(`  to   ${playUploadKeystoreId}`);

  await androidApi.updateAndroidAppBuildCredentialsAsync(graphqlClient, buildCreds, {
    androidKeystoreId: playUploadKeystoreId,
  });

  const updated = await androidApi.getAndroidAppBuildCredentialsByNameAsync(
    graphqlClient,
    appLookup,
    profileName,
  );
  console.log(`Done. SHA1: ${formatSha1(updated.androidKeystore.sha1CertificateFingerprint)}`);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
