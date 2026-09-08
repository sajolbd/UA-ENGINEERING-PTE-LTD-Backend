const fs = require('fs');
const path = require('path');

const websiteDir = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Website');
const dashboardDir = path.join(__dirname, '..', 'UA ENGINEERING PTE. LTD -Dashboard');

// 1. Fix Dashboard servicesData.ts
const websiteServicesPath = path.join(websiteDir, 'data', 'servicesData.ts');
let servicesTsContent = fs.readFileSync(websiteServicesPath, 'utf8');

// Ensure export const initialServicesData = servicesData; is added
if (!servicesTsContent.includes('initialServicesData')) {
  servicesTsContent += '\nexport const initialServicesData = servicesData;\n';
}

fs.writeFileSync(path.join(dashboardDir, 'data', 'servicesData.ts'), servicesTsContent, 'utf8');
console.log('Fixed Dashboard servicesData.ts with initialServicesData export!');

// 2. Fix Dashboard cmsData.ts
const cmsJsonPath = path.join(websiteDir, 'data', 'cmsData.json');
const cmsJsonData = JSON.parse(fs.readFileSync(cmsJsonPath, 'utf8'));

const fullCmsTsContent = `export interface PageSeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  schemaJson: string;
}

export interface SiteContent {
  siteLogo: string;
  footerLogo: string;
  companyName: string;
  welcomeMessage: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  appointmentButtonText: string;
  footerAboutText: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
  [key: string]: any;
}

export interface HomeContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  heroImageAlt?: string;
  heroCtaText?: string;
  aboutHeading?: string;
  aboutSubheading?: string;
  whyChooseBadge?: string;
  whyChooseHeading?: string;
  [key: string]: any;
}

export interface AboutContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  overviewHeading?: string;
  overviewText?: string;
  ehsHeading?: string;
  ehsText?: string;
  processHeading?: string;
  processSubheading?: string;
  residentialHeading?: string;
  faqHeading?: string;
  [key: string]: any;
}

export interface ServicesContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  servicesHeading?: string;
  servicesSubheading?: string;
  [key: string]: any;
}

export interface ProjectsContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  portfolioHeading?: string;
  portfolioSubheading?: string;
  [key: string]: any;
}

export interface BlogContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  blogHeading?: string;
  blogSubheading?: string;
  [key: string]: any;
}

export interface ContactContent {
  heroHeading: string;
  heroSubheading: string;
  heroImage: string;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactHours?: string;
  [key: string]: any;
}

export type CmsContentUnion =
  | SiteContent
  | HomeContent
  | AboutContent
  | ServicesContent
  | ProjectsContent
  | BlogContent
  | ContactContent;

export interface PageCmsData {
  content: CmsContentUnion;
  seo: PageSeo;
}

export interface CmsDatabase {
  site: { content: SiteContent; seo: PageSeo };
  home: { content: HomeContent; seo: PageSeo };
  about: { content: AboutContent; seo: PageSeo };
  services: { content: ServicesContent; seo: PageSeo };
  projects: { content: ProjectsContent; seo: PageSeo };
  blog: { content: BlogContent; seo: PageSeo };
  contact: { content: ContactContent; seo: PageSeo };
}

export const initialCmsData: CmsDatabase = ${JSON.stringify(cmsJsonData, null, 2)};
`;

fs.writeFileSync(path.join(dashboardDir, 'data', 'cmsData.ts'), fullCmsTsContent, 'utf8');
console.log('Fixed Dashboard cmsData.ts with all interface definitions and CmsDatabase!');
