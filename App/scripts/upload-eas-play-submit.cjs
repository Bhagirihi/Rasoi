#!/usr/bin/env node
/** Upload Google service account to EAS for Play Store submissions (eas submit). */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const keyPath = path.join(root, process.env.PLAY_SERVICE_ACCOUNT_FILE || 'fcm-service-account.json');
const accountName = process.env.EAS_ACCOUNT || 'takeyshi';
const projectName = process.env.EAS_PROJECT || 'rasoi';
const androidPackage = process.env.ANDROID_PACKAGE || 'com.bhagihiri.rasoiapp';

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
const { readAndValidateServiceAccountKey } = require(path.join(
  easCliRoot,
  'build/credentials/android/utils/googleServiceAccountKey',
));

async function main() {
  if (!fs.existsSync(keyPath)) {
    console.error(`Missing service account key: ${keyPath}`);
    process.exit(1);
  }

  const sessionManager = new SessionManager({ logEvent() {} });
  const graphqlClient = createGraphqlClient({
    accessToken: sessionManager.getAccessToken(),
    sessionSecret: sessionManager.getSessionSecret(),
  });
  const actor = await UserQuery.currentUserAsync(graphqlClient);
  const account = actor?.accounts?.find((a) => a.name === accountName) || actor?.accounts?.[0];
  if (!account) throw new Error(`Expo account not found: ${accountName}`);

  const appLookup = { account, projectName, androidApplicationIdentifier: androidPackage };
  const jsonKey = readAndValidateServiceAccountKey(keyPath);
  console.log(`Uploading Play submissions key for ${jsonKey.client_email}...`);

  const uploadedKey = await androidApi.createGoogleServiceAccountKeyAsync(graphqlClient, account, jsonKey);
  const appCredentials = await androidApi.createOrGetExistingAndroidAppCredentialsWithBuildCredentialsAsync(
    graphqlClient,
    appLookup,
  );

  await androidApi.updateAndroidAppCredentialsAsync(graphqlClient, appCredentials, {
    googleServiceAccountKeyForSubmissionsId: uploadedKey.id,
  });

  console.log(`Play submissions credentials linked to ${androidPackage}`);
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
