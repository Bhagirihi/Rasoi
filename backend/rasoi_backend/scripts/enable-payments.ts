import { setPaymentsEnabled } from '../src/lib/app-settings';

async function main() {
  const config = await setPaymentsEnabled(true);
  console.log('paymentsEnabled:', config.paymentsEnabled);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
