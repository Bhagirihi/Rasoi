#!/usr/bin/env node
/** Generate Android keystore on EAS and attach to the production build profile. */
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
const { generateRandomKeystoreAsync } = require(path.join(
  easCliRoot,
  'build/credentials/android/utils/keystore',
));

const accountName = process.env.EAS_ACCOUNT || 'takeyshi';
const projectName = process.env.EAS_PROJECT || 'rasoi';
const androidPackage = process.env.ANDROID_PACKAGE || 'com.rasoi.app';
const profileName = process.env.EAS_BUILD_PROFILE || 'production';
const projectId =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID ||
  process.env.EAS_PROJECT_ID ||
  '01de1672-85ce-4ad7-83d7-7fc958fc5659';

const analytics = { logEvent() {} };

async function main() {
  const sessionManager = new SessionManager(analytics);
  const sessionSecret = sessionManager.getSessionSecret();
  const accessToken = sessionManager.getAccessToken();

  if (!sessionSecret && !accessToken) {
    console.error('Not logged in to Expo. Run: npx eas login');
    process.exit(1);
  }

  const graphqlClient = createGraphqlClient({ accessToken, sessionSecret });
  const actor = await UserQuery.currentUserAsync(graphqlClient);
  const account = actor?.accounts?.find((a) => a.name === accountName) || actor?.accounts?.[0];

  if (!account) {
    console.error(`Expo account not found: ${accountName}`);
    process.exit(1);
  }

  const appLookup = {
    account,
    projectName,
    androidApplicationIdentifier: androidPackage,
  };

  const existing = await androidApi.getAndroidAppBuildCredentialsByNameAsync(
    graphqlClient,
    appLookup,
    profileName,
  );

  if (existing?.androidKeystore) {
    console.log(`Keystore already configured for profile "${profileName}" (${existing.androidKeystore.id})`);
    return;
  }

  console.log(`Generating Android keystore for @${account.name}/${projectName}...`);
  const keystore = await generateRandomKeystoreAsync(graphqlClient, analytics, projectId);
  const uploaded = await androidApi.createKeystoreAsync(graphqlClient, account, keystore);

  await androidApi.createOrUpdateAndroidAppBuildCredentialsByNameAsync(
    graphqlClient,
    appLookup,
    profileName,
    { androidKeystoreId: uploaded.id },
  );

  console.log(`Keystore created and linked to profile "${profileName}": ${uploaded.id}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
