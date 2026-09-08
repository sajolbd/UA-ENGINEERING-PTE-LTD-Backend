const fs = require('fs');
const path = require('path');

const websiteServicesPath = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Website', 'data', 'servicesData.ts');
const dashboardServicesPath = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Dashboard', 'data', 'servicesData.ts');

function updateHeader(filePath, isDashboard = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace SubService interface
  const newSubService = `export interface SubService {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  image?: string;
  description: string;
  longDescription?: string;
  breadcrumbTitle?: string;
  breadcrumbBg?: string;
  features?: string[];
  benefits?: string[];
  process?: string[];
  processHeading?: string;
  processSubheading?: string;
  processSteps?: { step?: string; title: string; description: string }[];
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
}`;

  // Replace ServiceCategory interface
  const newServiceCategory = `export interface ServiceCategory {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  longDescription?: string;
  image?: string;
  featuredImage?: string;
  bgImage?: string;
  icon?: string;
  breadcrumbTitle?: string;
  breadcrumbBg?: string;
  detailTitle?: string;
  subServicesTitle?: string;
  subServicesSubheading?: string;
  processText?: string;
  targetBadge?: string;
  targetHeading?: string;
  targetSubheading?: string;
  targetSpaces?: any;
  services: SubService[];
  features?: string[];
  benefits?: string[];
  process?: string[];
  processHeading?: string;
  processSubheading?: string;
  processSteps?: { step?: string; title: string; description: string }[];
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
}`;

  // Find boundaries of export const servicesData
  const arrayStart = content.indexOf('export const servicesData');
  const arrayCode = content.substring(arrayStart);

  const fullHeader = `${newSubService}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step?: string;
  title: string;
  description: string;
}

${newServiceCategory}

${arrayCode}`;

  let finalContent = fullHeader;
  if (isDashboard && !finalContent.includes('export const initialServicesData')) {
    finalContent += '\nexport const initialServicesData = servicesData;\n';
  }

  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`Updated interfaces in ${path.basename(filePath)}!`);
}

updateHeader(websiteServicesPath, false);
updateHeader(dashboardServicesPath, true);
