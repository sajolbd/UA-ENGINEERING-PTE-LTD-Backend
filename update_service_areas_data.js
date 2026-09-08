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

const updatedRegions = [
  {
    region: "Central Region",
    name: "Central Region",
    areas: ["Orchard", "Bugis", "Marina Bay", "Raffles Place", "Tanjong Pagar", "Bishan", "Toa Payoh", "Bukit Merah"]
  },
  {
    region: "East Region",
    name: "East Region",
    areas: ["Marine Parade", "Katong", "Joo Chiat", "Bedok", "Tampines", "Pasir Ris", "Changi", "Geylang"]
  },
  {
    region: "North Region",
    name: "North Region",
    areas: ["Woodlands", "Yishun", "Sembawang", "Mandai", "Sungei Kadut"]
  },
  {
    region: "North-East Region",
    name: "North-East Region",
    areas: ["Hougang", "Punggol", "Sengkang", "Serangoon", "Ang Mo Kio"]
  },
  {
    region: "West Region",
    name: "West Region",
    areas: ["Jurong East", "Jurong West", "Bukit Batok", "Clementi", "Boon Lay", "Choa Chu Kang"]
  }
];

const heading = "Reliable Engineering & Renovation Solutions Near You";
const subheading = "UA ENGINEERING proudly provides renovation and upgrading services across Singapore, covering all major residential and commercial areas.";

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

// 1. Update servicesData.ts
const websiteServicesPath = path.join(websiteDir, 'data', 'servicesData.ts');
const websiteServicesRaw = fs.readFileSync(websiteServicesPath, 'utf8');
const servicesData = parseTsArray(websiteServicesRaw, 'servicesData');

servicesData.forEach(cat => {
  cat.serviceAreasHeading = heading;
  cat.serviceAreasSubheading = subheading;
  cat.serviceAreas = updatedRegions.map(r => ({ region: r.region, areas: r.areas }));
});

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
  serviceAreasBadge?: string;
  serviceAreasHeading?: string;
  serviceAreasSubheading?: string;
  serviceAreas?: { region: string; areas: string[] }[];
  faqs?: FAQItem[];
  __v?: number;
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(servicesData, null, 2)};
`;

fs.writeFileSync(path.join(websiteDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
fs.writeFileSync(path.join(dashboardDir, 'data', 'servicesData.ts'), newServicesTsContent, 'utf8');
console.log('Saved updated servicesData.ts to Website and Dashboard!');

// 2. Update cmsData.json
const cmsPath = path.join(websiteDir, 'data', 'cmsData.json');
const cmsData = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));

if (cmsData.home && cmsData.home.content) {
  cmsData.home.content.areaHeading = heading;
  cmsData.home.content.areaSubheading = subheading;
  cmsData.home.content.regions = updatedRegions;
}
if (cmsData.services && cmsData.services.content) {
  cmsData.services.content.serviceAreasTitle = heading;
  cmsData.services.content.serviceAreasSubtitle = subheading;
  cmsData.services.content.regions = updatedRegions;
}

const cmsJsonStr = JSON.stringify(cmsData, null, 2);
fs.writeFileSync(path.join(websiteDir, 'data', 'cmsData.json'), cmsJsonStr, 'utf8');
fs.writeFileSync(path.join(dashboardDir, 'data', 'cmsData.json'), cmsJsonStr, 'utf8');
console.log('Saved updated cmsData.json to Website and Dashboard!');

// 3. Update Dashboard cmsData.ts
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
  Object.keys(cmsData).reduce((acc, pageId) => {
    acc[pageId] = {
      pageId,
      content: cmsData[pageId].content,
      seo: cmsData[pageId].seo
    };
    return acc;
  }, {}),
  null,
  2
)};
`;
fs.writeFileSync(cmsTsPath, cmsTsContent, 'utf8');

// 4. Update local db.json
const dbJsonPath = path.join(backendDir, 'data', 'db.json');
let dbData = {};
try { dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8')); } catch (e) {}
dbData.services = servicesData;
dbData.cms = cmsData;
fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Updated local db.json!');

// 5. Update MongoDB Atlas
async function syncMongo() {
  console.log('\nConnecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 10000 });

  const CmsSchema = new mongoose.Schema({ pageId: String, content: Object, seo: Object }, { strict: false });
  const ServiceSchema = new mongoose.Schema({ categories: Array }, { strict: false });

  const Cms = mongoose.models.Cms || mongoose.model('Cms', CmsSchema);
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

  await Cms.deleteMany({});
  for (const pageId of Object.keys(cmsData)) {
    await Cms.create({ pageId, content: cmsData[pageId].content, seo: cmsData[pageId].seo });
  }
  console.log(`MongoDB 'Cms' collection updated.`);

  await Service.deleteMany({});
  await Service.create({ categories: servicesData });
  console.log(`MongoDB 'Service' collection updated.`);

  await mongoose.disconnect();
  console.log('\n==================================================');
  console.log('   SUCCESS! Service Areas Updated Everywhere      ');
  console.log('==================================================');
}

syncMongo().catch(err => {
  console.error('Mongo sync error:', err);
  process.exit(1);
});
