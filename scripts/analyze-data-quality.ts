import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface Slotenmaker {
  name: string;
  city: string;
  province: string;
  province_abbr: string;
  municipality: string;
  slug: string;
  service_types: string[];
  brands: string[];
  website?: string;
  phone?: string;
  address?: string;
  is_24_hour?: boolean;
}

async function analyzeDataQuality() {
  console.log(chalk.bold.blue('\n🔍 Slotenmaker Data Kwaliteitsanalyse\n'));

  // Load data
  const dataFile = path.join(__dirname, '..', 'public', 'data', 'slotenmakers.json');
  let slotenmakers: Slotenmaker[];

  try {
    slotenmakers = JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  } catch (error) {
    console.error(chalk.red('❌ Kon slotenmakers.json niet laden'));
    process.exit(1);
  }

  console.log(chalk.cyan(`Totaal aantal entries: ${slotenmakers.length}`));

  // Analyze generic names
  const genericNames = ['slotenmaker', 'sleutelservice', 'slotendienst', 'locksmith'];
  const genericEntries = slotenmakers.filter(s =>
    genericNames.some(g => s.name.toLowerCase().trim() === g)
  );

  console.log(chalk.yellow(`\n📊 Generieke naam entries: ${genericEntries.length}`));
  if (genericEntries.length > 0) {
    console.log(chalk.gray('\nGenerieke entries per stad:'));
    genericEntries.forEach(entry => {
      console.log(chalk.gray(`  - "${entry.name}" in ${entry.city}, ${entry.province}`));
    });
  }

  // Analyze suspicious patterns
  console.log(chalk.yellow('\n🚨 Verdachte patronen:'));

  // Entries without proper names
  const shortNames = slotenmakers.filter(s => s.name.length < 5);
  console.log(chalk.gray(`\nZeer korte namen (< 5 karakters): ${shortNames.length}`));
  shortNames.slice(0, 10).forEach(entry => {
    console.log(chalk.gray(`  - "${entry.name}" in ${entry.city}, ${entry.province}`));
  });

  // Entries missing key data
  const missingPhone = slotenmakers.filter(s => !s.phone);
  const missingAddress = slotenmakers.filter(s => !s.address);
  const missingWebsite = slotenmakers.filter(s => !s.website);

  console.log(chalk.gray(`\nOntbrekend telefoonnummer: ${missingPhone.length}`));
  console.log(chalk.gray(`Ontbrekend adres: ${missingAddress.length}`));
  console.log(chalk.gray(`Ontbrekende website: ${missingWebsite.length}`));

  // Analyze duplicates
  const nameCityPairs = slotenmakers.map(s => `${s.name}|${s.city}|${s.province}`);
  const duplicates = nameCityPairs.filter((item, index) => nameCityPairs.indexOf(item) !== index);
  console.log(chalk.gray(`\nDuplicaat entries: ${duplicates.length}`));

  // Province analysis
  console.log(chalk.cyan('\n📍 Verdeling per provincie:'));
  const provinceCounts: Record<string, number> = {};
  slotenmakers.forEach(s => {
    provinceCounts[s.province] = (provinceCounts[s.province] || 0) + 1;
  });

  Object.entries(provinceCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([province, count]) => {
      console.log(chalk.gray(`  - ${province}: ${count} entries`));
    });

  // Service type analysis
  console.log(chalk.cyan('\n🔧 Dienst types:'));
  const serviceCounts: Record<string, number> = {};
  slotenmakers.forEach(s => {
    (s.service_types || []).forEach(type => {
      serviceCounts[type] = (serviceCounts[type] || 0) + 1;
    });
  });

  Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .forEach(([type, count]) => {
      console.log(chalk.gray(`  - ${type}: ${count} entries`));
    });

  // 24-hour availability
  const has24Hour = slotenmakers.filter(s => s.is_24_hour === true);
  console.log(chalk.cyan(`\n⏰ 24-uurs beschikbaarheid: ${has24Hour.length} slotenmakers`));

  // Brand analysis
  console.log(chalk.cyan('\n🏷️ Merken:'));
  const brandCounts: Record<string, number> = {};
  slotenmakers.forEach(s => {
    (s.brands || []).forEach(brand => {
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });
  });

  Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .forEach(([brand, count]) => {
      console.log(chalk.gray(`  - ${brand}: ${count} entries`));
    });

  // Recommendations
  console.log(chalk.bold.green('\n✅ Aanbevelingen:'));
  console.log('1. Filter entries met generieke namen');
  console.log('2. Verifieer provincie-toewijzingen voor grensgevallen');
  console.log('3. Verwijder of voeg duplicaat entries samen');
  console.log(`4. Overweeg ${genericEntries.length} generieke entries te verwijderen voor verrijking`);
  console.log(`5. Verrijk ${missingPhone.length} entries zonder telefoonnummer`);
  console.log(`6. Verrijk ${missingWebsite.length} entries zonder website`);

  // Export problematic entries
  const problematicEntries = {
    genericNames: genericEntries,
    shortNames: shortNames.slice(0, 20),
    missingData: {
      phone: missingPhone.length,
      address: missingAddress.length,
      website: missingWebsite.length,
    },
    totalEntries: slotenmakers.length,
    cleanEntries: slotenmakers.length - genericEntries.length
  };

  const outputFile = path.join(__dirname, '..', 'data', 'data-quality-report.json');
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(problematicEntries, null, 2));

  console.log(chalk.magenta(`\n📄 Volledig rapport opgeslagen in: ${outputFile}`));
}

analyzeDataQuality().catch(console.error);
