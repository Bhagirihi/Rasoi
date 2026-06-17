#!/usr/bin/env node
/* Upload FCM v1 service account to EAS using the local Expo session. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const keyPath = path.join(root, process.env.FCM_SERVICE_ACCOUNT_FILE || 'fcm-service-account.json');
const accountName = process.env.EAS_ACCOUNT || 'takeyshi';
const projectName = process.env.EAS_PROJECT || 'rasoi';
const androidPackage = process.env.ANDROID_PACKAGE || 'com.rasoi.app';

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
    console.error('Run: node scripts/generate-fcm-service-account.mjs');
    process.exit(1);
  }

  const sessionManager = new SessionManager({ setActor() {} });
  const sessionSecret = sessionManager.getSessionSecret();
  const accessToken = sessionManager.getAccessToken();

  if (!sessionSecret && !accessToken) {
    console.error('Not logged in to Expo. Run: npx eas login');
    process.exit(1);
  }

  const graphqlClient = createGraphqlClient({
    accessToken,
    sessionSecret,
  });

  const actor = await UserQuery.currentUserAsync(graphqlClient);
  if (!actor) {
    console.error('Could not load Expo user. Run: npx eas login');
    process.exit(1);
  }

  const account = actor.accounts?.find((a) => a.name === accountName) || actor.accounts?.[0];
  if (!account) {
    console.error(`Expo account not found: ${accountName}`);
    process.exit(1);
  }

  const appLookup = {
    account,
    projectName,
    androidApplicationIdentifier: androidPackage,
  };

  const jsonKey = readAndValidateServiceAccountKey(keyPath);
  console.log(`Uploading service account for ${jsonKey.client_email}...`);

  const uploadedKey = await androidApi.createGoogleServiceAccountKeyAsync(graphqlClient, account, jsonKey);
  console.log(`Uploaded Google Service Account Key: ${uploadedKey.id}`);

  const appCredentials = await androidApi.createOrGetExistingAndroidAppCredentialsWithBuildCredentialsAsync(
    graphqlClient,
    appLookup,
  );

  await androidApi.updateAndroidAppCredentialsAsync(graphqlClient, appCredentials, {
    googleServiceAccountKeyForFcmV1Id: uploadedKey.id,
  });

  console.log(`FCM V1 credentials linked to ${androidPackage} on @${account.name}/${projectName}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
