const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DEFAULT_MONGODB_URI = "mongodb+srv://sajolbd:sajolBD-222@cluster0.wug67yz.mongodb.net/?appName=Cluster0";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

const websiteDir = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Website');
const dashboardDir = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Dashboard');
const backendDir = __dirname;

// Helper to extract exported array from TS file
function parseTsArray(code, varName) {
  const startIdx = code.indexOf(`export const ${varName}`);
  const equalIdx = code.indexOf('=', startIdx);
  const bracketStart = code.indexOf('[', equalIdx);
  let count = 0;
  let bracketEnd = -1;
  for (let i = bracketStart; i < code.length; i++) {
    if (code[i] === '[') count++;
    else if (code[i] === ']') {
      count--;
      if (count === 0) { bracketEnd = i; break; }
    }
  }
  const str = code.substring(bracketStart, bracketEnd + 1);
  return eval('(' + str + ')');
}

// 1. Read current servicesData (with exact text)
const currentServicesPath = path.join(websiteDir, 'data', 'servicesData.ts');
const currentServicesRaw = fs.readFileSync(currentServicesPath, 'utf8');
const currentServices = parseTsArray(currentServicesRaw, 'servicesData');

// 2. Read old servicesData from commit b41ce71
const oldServicesRaw = execSync('git show b41ce71:data/servicesData.ts', { cwd: websiteDir, maxBuffer: 50 * 1024 * 1024 }).toString();
const oldServices = parseTsArray(oldServicesRaw, 'servicesData');

console.log(`Current Categories: ${currentServices.length}, Old Categories: ${oldServices.length}`);

// Merge images from old to current
let restoredCount = 0;
currentServices.forEach((curCat, cIdx) => {
  // Find matching old category by slug or index
  const oldCat = oldServices.find(o => o.slug === curCat.slug) || oldServices[cIdx];
  if (oldCat) {
    if (oldCat.image && oldCat.image.startsWith('data:image')) {
      curCat.image = oldCat.image;
      restoredCount++;
    }
    if (oldCat.featuredImage && oldCat.featuredImage.startsWith('data:image')) {
      curCat.featuredImage = oldCat.featuredImage;
      restoredCount++;
    }
    if (oldCat.bgImage && oldCat.bgImage.startsWith('data:image')) {
      curCat.bgImage = oldCat.bgImage;
      restoredCount++;
    }

    // Merge sub-service images
    if (curCat.services && oldCat.services) {
      curCat.services.forEach((curSub, sIdx) => {
        const oldSub = oldCat.services.find(o => o.slug === curSub.slug) || oldCat.services[sIdx];
        if (oldSub && oldSub.image && oldSub.image.startsWith('data:image')) {
          curSub.image = oldSub.image;
          restoredCount++;
        }
      });
    }
  }
});

console.log(`Restored ${restoredCount} base64 images into servicesData!`);

// Format TS code for servicesData
const newServicesTsContent = `export interface SubService {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  image?: string;
  description: string;
  longDescription?: string;
  features?: string[];
  benefits?: string[];
  process?: string[];
  processHeading?: string;
  processSubheading?: string;
  processSteps?: { step: string; title: string; description: string }[];
  targetSpacesHeading?: string;
  targetSpacesSubheading?: string;
  targetSpaces?: { title: string; subtitle: string; description: string; points: string[]; image?: string }[];
  whyChooseHeading?: string;
  whyChooseSubheading?: string;
  whyChoosePoints?: { title: string; description: string }[];
  serviceAreasHeading?: string;
  serviceAreasSubheading?: string;
  serviceAreas?: { region: string; areas: string[] }[];
  faqHeading?: string;
  faqSubheading?: string;
  faqs?: { question: string; answer: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceCategory {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  longDescription: string;
  image: string;
  featuredImage: string;
  bgImage: string;
  icon: string;
  services: SubService[];
  features?: string[];
  benefits?: string[];
  process?: string[];
  processHeading?: string;
  processSubheading?: string;
  processSteps?: { step: string; title: string; description: string }[];
  faqs?: FAQItem[];
  __v?: number;
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(currentServices, null, 2)};
`;

// Write servicesData.ts to Website & Dashboard
fs.writeFileSync(path.join(websiteDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
fs.writeFileSync(path.join(dashboardDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
console.log('Saved servicesData.ts to Website and Dashboard!');

// Read current cmsData.json
const websiteCmsPath = path.join(websiteDir, 'data', 'cmsData.json');
const currentCms = JSON.parse(fs.readFileSync(websiteCmsPath, 'utf8'));

// Check old cmsData.json from b41ce71
const oldCmsRaw = execSync('git show b41ce71:data/cmsData.json', { cwd: websiteDir, maxBuffer: 50 * 1024 * 1024 }).toString();
const oldCms = JSON.parse(oldCmsRaw);

let cmsRestoredCount = 0;
Object.keys(currentCms).forEach(page => {
  if (oldCms[page] && oldCms[page].content) {
    Object.keys(oldCms[page].content).forEach(key => {
      const oldVal = oldCms[page].content[key];
      if (typeof oldVal === 'string' && oldVal.startsWith('data:image')) {
        currentCms[page].content[key] = oldVal;
        cmsRestoredCount++;
      }
    });
  }
});
console.log(`Restored ${cmsRestoredCount} base64 images into cmsData.json!`);

// Save cmsData.json to Website and Dashboard
const cmsJsonStr = JSON.stringify(currentCms, null, 2);
fs.writeFileSync(path.join(websiteDir, 'data', 'cmsData.json'), cmsJsonStr, 'utf8');
fs.writeFileSync(path.join(dashboardDir, 'data', 'cmsData.json'), cmsJsonStr, 'utf8');

// Also update Dashboard cmsData.ts
const cmsTsPath = path.join(dashboardDir, 'data', 'cmsData.ts');
const cmsTsContent = `export interface CmsPage {
  pageId: string;
  content: Record<string, any>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    schemaJson: string;
  };
}

export const initialCmsData: Record<string, CmsPage> = ${JSON.stringify(
  Object.keys(currentCms).reduce((acc, pageId) => {
    acc[pageId] = {
      pageId,
      content: currentCms[pageId].content,
      seo: currentCms[pageId].seo
    };
    return acc;
  }, {}),
  null,
  2
)};
`;
fs.writeFileSync(cmsTsPath, cmsTsContent, 'utf8');

// Update local db.json
const dbJsonPath = path.join(backendDir, 'data', 'db.json');
let dbData = {};
try { dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8')); } catch (e) {}
dbData.services = currentServices;
dbData.cms = currentCms;
fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Updated local db.json with merged images and exact text!');

// Update MongoDB Atlas
async function syncMongo() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 10000 });
  
  const CmsSchema = new mongoose.Schema({ pageId: String, content: Object, seo: Object }, { strict: false });
  const ServiceSchema = new mongoose.Schema({ categories: Array }, { strict: false });

  const Cms = mongoose.models.Cms || mongoose.model('Cms', CmsSchema);
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

  await Cms.deleteMany({});
  for (const pageId of Object.keys(currentCms)) {
    await Cms.create({ pageId, content: currentCms[pageId].content, seo: currentCms[pageId].seo });
  }
  console.log(`MongoDB 'Cms' updated (${Object.keys(currentCms).length} pages).`);

  await Service.deleteMany({});
  await Service.create({ categories: currentServices });
  console.log(`MongoDB 'Service' updated (${currentServices.length} categories).`);

  await mongoose.disconnect();
  console.log('\n==================================================');
  console.log('   SUCCESS! All Images Restored & Text Preserved   ');
  console.log('==================================================');
}

syncMongo().catch(err => {
  console.error('Mongo sync error:', err);
  process.exit(1);
});
