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

// 1. Read current servicesData from Website
const websiteServicesPath = path.join(websiteDir, 'data', 'servicesData.ts');
const websiteServicesRaw = fs.readFileSync(websiteServicesPath, 'utf8');
const servicesData = parseTsArray(websiteServicesRaw, 'servicesData');

console.log(`Processing ${servicesData.length} categories...`);

// Swap whyChooseLeftTitle and whyChooseRightTitle for each category
servicesData.forEach((cat, idx) => {
  const oldLeft = cat.whyChooseLeftTitle;
  const oldRight = cat.whyChooseRightTitle;

  cat.whyChooseLeftTitle = oldRight;
  cat.whyChooseRightTitle = oldLeft;

  console.log(`\nCategory ${idx} (${cat.title}):`);
  console.log(`  New whyChooseLeftTitle (Positive): "${cat.whyChooseLeftTitle}"`);
  console.log(`  New whyChooseRightTitle (Negative): "${cat.whyChooseRightTitle}"`);
});

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
  whyChooseBadge?: string;
  whyChooseHeading?: string;
  whyChooseLeftTitle?: string;
  whyChooseRightTitle?: string;
  whyChooseAdvantages?: { title: string; description: string }[];
  whyChooseChallenges?: { title: string; description: string }[];
  faqs?: FAQItem[];
  __v?: number;
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(servicesData, null, 2)};
`;

// Save to Website and Dashboard
fs.writeFileSync(path.join(websiteDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
fs.writeFileSync(path.join(dashboardDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
console.log('\nSaved updated servicesData.ts to Website and Dashboard!');

// Update local db.json
const dbJsonPath = path.join(backendDir, 'data', 'db.json');
let dbData = {};
try { dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8')); } catch (e) {}
dbData.services = servicesData;
fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Updated local db.json!');

// Update MongoDB Atlas
async function syncMongo() {
  console.log('\nConnecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 10000 });
  
  const ServiceSchema = new mongoose.Schema({ categories: Array }, { strict: false });
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

  await Service.deleteMany({});
  await Service.create({ categories: servicesData });
  console.log(`MongoDB 'Service' collection updated with swapped titles.`);

  await mongoose.disconnect();
  console.log('\n==================================================');
  console.log('   SUCCESS! Comparison Card Titles Swapped Everywhere ');
  console.log('==================================================');
}

syncMongo().catch(err => {
  console.error('Mongo sync error:', err);
  process.exit(1);
});
