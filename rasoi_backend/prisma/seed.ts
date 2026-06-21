import 'dotenv/config';
import bcrypt from 'bcryptjs';

import { db } from '../src/lib/db';
import { DEFAULT_KITCHEN_STYLES } from '../src/lib/kitchen-style-data';
import { ensureReferenceData } from '../src/lib/reference-data';
import { ensurePromoCodes } from '../src/lib/promo-seed';
import { DEFAULT_PARTNER_LINKS } from '../src/lib/partners';
import { syncPublicKitchenStyle } from '../src/lib/sync-public-kitchen-style';
import { syncPublicRecipe } from '../src/lib/sync-public-recipe';
import { KITCHEN_STYLE_RECIPES } from './kitchen-style-recipes';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@rasoi.app';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'rasoi-admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Rasoi Admin' },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Rasoi Admin',
    },
  });

  const recipeIds = KITCHEN_STYLE_RECIPES.map((recipe) => recipe.id);
  await db.recipe.deleteMany({
    where: { id: { notIn: recipeIds } },
  });

  for (const recipe of KITCHEN_STYLE_RECIPES) {
    const saved = await db.recipe.upsert({
      where: { id: recipe.id },
      update: {
        title: recipe.title,
        prepTime: recipe.prepTime,
        calories: recipe.calories,
        region: recipe.region,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        difficulty: recipe.difficulty,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        tags: JSON.stringify(recipe.tags),
        ingredients: JSON.stringify(recipe.ingredients),
        steps: JSON.stringify(recipe.steps),
        published: true,
      },
      create: {
        id: recipe.id,
        title: recipe.title,
        prepTime: recipe.prepTime,
        calories: recipe.calories,
        region: recipe.region,
        kitchenStyleId: recipe.kitchenStyleId,
        dietType: recipe.dietType,
        difficulty: recipe.difficulty,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
        tags: JSON.stringify(recipe.tags),
        ingredients: JSON.stringify(recipe.ingredients),
        steps: JSON.stringify(recipe.steps),
        published: true,
      },
    });
    try {
      await syncPublicRecipe(saved);
    } catch (error) {
      console.error(`[syncPublicRecipe] seed failed for ${recipe.id}`, error);
    }
  }

  console.log(`Seeded ${KITCHEN_STYLE_RECIPES.length} kitchen-style recipes.`);

  const sponsorSeeds = [
    {
      id: 'seed-sponsor-recipes-amul',
      placement: 'recipes',
      brandName: 'Amul',
      productLabel: "Amul Paneer — tonight's dinner sorted",
      tagline: 'Fresh block paneer, perfect for curries',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Amul_Logo.svg/120px-Amul_Logo.svg.png',
      cta: 'View deal',
      searchQuery: 'Amul',
      active: true,
      priority: 10,
    },
    {
      id: 'seed-sponsor-pantry-tata',
      placement: 'pantry',
      brandName: 'Tata Sampann',
      productLabel: 'Restock dal & spices in one order',
      tagline: 'Sponsored pantry essentials bundle',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/120px-Tata_logo.svg.png',
      cta: 'Shop now',
      searchQuery: 'Tata Sampann',
      active: true,
      priority: 10,
    },
  ];

  for (const sponsor of sponsorSeeds) {
    await db.sponsor.upsert({
      where: { id: sponsor.id },
      update: {
        placement: sponsor.placement,
        brandName: sponsor.brandName,
        productLabel: sponsor.productLabel,
        tagline: sponsor.tagline,
        logoUrl: sponsor.logoUrl,
        cta: sponsor.cta,
        searchQuery: sponsor.searchQuery,
        active: sponsor.active,
        priority: sponsor.priority,
      },
      create: sponsor,
    });
  }

  for (const link of DEFAULT_PARTNER_LINKS) {
    await db.partnerLink.upsert({
      where: { partnerId: link.partnerId },
      update: {
        label: link.label,
        category: link.category,
        deepLinkUrl: link.deepLinkUrl,
        webUrl: link.webUrl,
        active: true,
      },
      create: link,
    });
  }

  for (const style of DEFAULT_KITCHEN_STYLES) {
    const saved = await db.kitchenStyle.upsert({
      where: { id: style.id },
      update: {
        label: style.label,
        tagline: style.tagline,
        mood: style.mood,
        region: style.region,
        heroImage: style.heroImage,
        sortOrder: style.sortOrder,
      },
      create: style,
    });
    try {
      await syncPublicKitchenStyle(saved);
    } catch (error) {
      console.error(`[syncPublicKitchenStyle] seed failed for ${style.id}`, error);
    }
  }

  await ensureReferenceData();
  await ensurePromoCodes();

  console.log('Seed complete.');
  console.log(`Admin account ready for ${adminEmail}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
