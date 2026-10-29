#!/usr/bin/env node
/**
 * Validate store/play-console/manifest.json against manifest.schema.json.
 * Usage: npm run validate:play-manifest
 */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const playConsoleDir = path.join(__dirname, '../store/play-console');
const manifestPath = path.join(playConsoleDir, 'manifest.json');
const schemaPath = path.join(playConsoleDir, 'manifest.schema.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);
const ok = validate(manifest);

if (!ok) {
  console.error('manifest.json failed schema validation:\n');
  for (const err of validate.errors ?? []) {
    const where = err.instancePath || '/';
    const extra = err.params ? ` (${JSON.stringify(err.params)})` : '';
    console.error(`  ${where}: ${err.message}${extra}`);
  }
  process.exit(1);
}

const crossCheckErrors = crossCheckManifest(manifest);
if (crossCheckErrors.length > 0) {
  console.error('manifest.json failed cross-checks:\n');
  for (const message of crossCheckErrors) {
    console.error(`  ${message}`);
  }
  process.exit(1);
}

console.log(`manifest.json OK (schema v${manifest.schemaVersion})`);

function crossCheckManifest(data) {
  const errors = [];

  if (data.application?.packageName !== 'com.bhagihiri.rasoiapp') {
    errors.push('application.packageName must stay com.bhagihiri.rasoiapp');
  }

  if (data.storeListing?.title !== data.titleExperimentVariants?.active) {
    errors.push('storeListing.title must match titleExperimentVariants.active');
  }

  const productIds = new Set(
    (data.monetization?.products ?? []).map((product) => product.productId),
  );
  const paidTier = data.monetization?.tiers?.paid;
  for (const productId of paidTier?.productIds ?? []) {
    if (!productIds.has(productId)) {
      errors.push(`monetization.tiers.paid.productIds references missing product ${productId}`);
    }
  }

  for (const product of data.monetization?.products ?? []) {
    const tier = data.monetization?.tiers?.[product.tierId];
    if (!tier) {
      errors.push(`monetization.products.${product.productId} references unknown tier ${product.tierId}`);
    }
  }

  const manualLocales = new Set(data.localization?.requiresManualConsoleEnable ?? []);
  for (const locale of Object.keys(data.localizedListings ?? {})) {
    if (manualLocales.has(locale) && !(data.localization?.apiPushed ?? []).includes(locale)) {
      // expected: gu-IN / bn-IN defined but not apiPushed until Console enables them
    }
  }

  return errors;
}
