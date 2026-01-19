/**
 * Script om Unsplash afbeeldingen te zoeken en downloaden met Jina.ai
 * Gebruik: npx tsx scripts/fetch-unsplash-images.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const JINA_API_KEY = 'jina_87f2d697e60a4f93b5b0b7576da1a857shcct21CGvGd4dbCBSyCUHLfKodA';

// Mapping van blog posts naar zoektermen en bestandsnamen
const blogImages: Record<string, { searchTerm: string; filename: string }> = {
  'welk-slot-kiezen': {
    searchTerm: 'door lock security home',
    filename: 'voordeurslot.jpg'
  },
  'buitengesloten': {
    searchTerm: 'locked out door keys',
    filename: 'buitengesloten.jpg'
  },
  'inbraakpreventie': {
    searchTerm: 'home security lock protection',
    filename: 'inbraakpreventie.jpg'
  },
  'autosleutel': {
    searchTerm: 'car key automotive',
    filename: 'autosleutel.jpg'
  },
  'elektronisch-slot': {
    searchTerm: 'smart lock electronic keypad',
    filename: 'elektronisch-slot.jpg'
  },
  'slotenmaker': {
    searchTerm: 'locksmith tools professional',
    filename: 'slotenmaker.jpg'
  }
};

// Curated Unsplash image IDs voor slotenmaker-gerelateerde onderwerpen
const curatedImages: Record<string, string[]> = {
  sloten: [
    'photo-1558618666-fcd25c85cd64', // Deurslot
    'photo-1621905252507-b35492cc74b4', // Slot en sleutel
    'photo-1582139329536-e7284fece509', // Voordeur
    'photo-1506905925346-21bda4d32df4', // Veilig huis
  ],
  sleutels: [
    'photo-1609770231080-e321deccc34c', // Sleutels
    'photo-1593510987046-1f8fcfc1a02b', // Sleutelbos
    'photo-1544636331-e26879cd4d9b', // Autosleutel
  ],
  beveiliging: [
    'photo-1558002038-1055907df827', // Beveiliging
    'photo-1563013544-824ae1b704d3', // Alarm systeem
    'photo-1486406146926-c627a92ad1ab', // Modern gebouw
  ],
  noodgeval: [
    'photo-1582139329536-e7284fece509', // Deur
    'photo-1560518883-ce09059eeffa', // Huis
  ]
};

async function searchUnsplashWithJina(query: string): Promise<string[]> {
  const searchUrl = `https://s.jina.ai/?q=unsplash+${encodeURIComponent(query)}`;

  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'X-Respond-With': 'no-content'
      }
    };

    https.get(searchUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Extract Unsplash photo IDs from response
        const photoIdRegex = /unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/g;
        const matches = [...data.matchAll(photoIdRegex)];
        const photoIds = matches.map(m => m[1]);
        resolve(photoIds);
      });
    }).on('error', reject);
  });
}

function downloadImage(photoId: string, outputPath: string): Promise<void> {
  const imageUrl = `https://images.unsplash.com/${photoId}?w=1200&h=630&fit=crop&q=80`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(imageUrl, (response) => {
      // Handle redirect
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve();
            });
          }).on('error', reject);
        }
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

async function downloadUnsplashImage(photoId: string, filename: string): Promise<boolean> {
  const outputDir = path.join(process.cwd(), 'public', 'images', 'blog');
  const outputPath = path.join(outputDir, filename);

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    await downloadImage(photoId, outputPath);
    const stats = fs.statSync(outputPath);

    if (stats.size < 1000) {
      console.log(`❌ ${filename}: Bestand te klein (${stats.size} bytes), mogelijk ongeldig`);
      return false;
    }

    console.log(`✅ ${filename}: Gedownload (${Math.round(stats.size / 1024)} KB)`);
    return true;
  } catch (error) {
    console.error(`❌ ${filename}: Download mislukt`, error);
    return false;
  }
}

async function main() {
  console.log('🖼️  Unsplash Afbeeldingen Ophalen voor Blog\n');

  // Download curated images voor blog posts
  const downloads = [
    { photoId: 'photo-1558618666-fcd25c85cd64', filename: 'voordeurslot.jpg' },
    { photoId: 'photo-1609770231080-e321deccc34c', filename: 'buitengesloten.jpg' },
    { photoId: 'photo-1558002038-1055907df827', filename: 'inbraakpreventie.jpg' },
    { photoId: 'photo-1544636331-e26879cd4d9b', filename: 'autosleutel.jpg' },
    { photoId: 'photo-1621905252507-b35492cc74b4', filename: 'elektronisch-slot.jpg' },
    { photoId: 'photo-1582139329536-e7284fece509', filename: 'na-inbraak.jpg' },
    { photoId: 'photo-1563013544-824ae1b704d3', filename: 'betrouwbare-slotenmaker.jpg' },
    { photoId: 'photo-1593510987046-1f8fcfc1a02b', filename: 'kosten-slotenmaker.jpg' },
    { photoId: 'photo-1506905925346-21bda4d32df4', filename: 'skg-keurmerk.jpg' },
    { photoId: 'photo-1560518883-ce09059eeffa', filename: 'meerpuntsluiting.jpg' },
  ];

  for (const { photoId, filename } of downloads) {
    await downloadUnsplashImage(photoId, filename);
  }

  console.log('\n📝 Unsplash Attributie (verplicht bij gebruik):');
  console.log("   Foto's van Unsplash - https://unsplash.com");
  console.log('   Gratis te gebruiken met vermelding van de fotograaf\n');
}

// Export functies voor gebruik in andere scripts
export { downloadUnsplashImage, searchUnsplashWithJina, curatedImages };

// Run indien direct aangeroepen
main().catch(console.error);
