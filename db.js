const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

let useMongo = false;
let cachedPromise = null;

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI || MONGODB_URI.includes("YOUR_PASSWORD")) {
    useMongo = false;
    return false;
  }

  if (mongoose.connection.readyState >= 1) {
    useMongo = true;
    return true;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then(async () => {
        console.log("===============================================");
        console.log("   Connected to MongoDB Database Successfully! ");
        console.log("===============================================");
        useMongo = true;
        await seedDefaultData().catch((err) =>
          console.error("   Seeding notice:", err.message)
        );
        return true;
      })
      .catch((err) => {
        console.error("===============================================");
        console.error("   MongoDB Connection Failed!                  ");
        console.error("   Error:", err.message);
        console.error("===============================================");
        useMongo = false;
        cachedPromise = null;
        return false;
      });
  }

  return cachedPromise;
}

// Proactively initiate connection on module load if MONGODB_URI exists
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes("YOUR_PASSWORD")) {
  connectDB().catch(() => {});
}

// 1. CMS Page Schema
const CmsSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  seo: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { strict: false });

// 2. Blog Posts Schema
const BlogSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: "Renovation & Upgrading" },
  categorySlug: { type: String, default: "renovation-upgrading" },
  date: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
  author: { type: String, default: "UA Administrator" },
  image: { type: String, default: "/images/layout/breadcrumb-bg.png" },
  bgColor: { type: String, default: "bg-slate-100" },
  readTime: { type: String, default: "5 mins read" },
  popular: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  content: { type: String, default: "" }
}, { strict: false });

// 3. Contact Inquiries Schema
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  service: { type: String, default: "General Inquiry" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// 4. Custom Completed Projects Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  category: { type: String, default: "" },
  client: { type: String, default: "" },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  gallery: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

// 5. Dynamic Services Schema
const ServiceSchema = new mongoose.Schema({
  categories: { type: Array, default: [] }
}, { strict: false });

// Register models safely (prevent overwrite error if model registered)
const Cms = mongoose.models.Cms || mongoose.model("Cms", CmsSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

async function seedDefaultData() {
  try {
    const fs = require("fs");
    const path = require("path");
    const DB_PATH = path.join(__dirname, "data", "db.json");
    if (!fs.existsSync(DB_PATH)) return;

    const rawData = fs.readFileSync(DB_PATH, "utf8");
    const parsedData = JSON.parse(rawData);
    if (!parsedData.cms) return;

    const count = await Cms.countDocuments();
    if (count === 0) {
      console.log("   MongoDB is empty. Seeding default CMS configurations...");
      for (const pageId of Object.keys(parsedData.cms)) {
        await Cms.create({
          pageId,
          content: parsedData.cms[pageId].content,
          seo: parsedData.cms[pageId].seo
        });
      }
      console.log("   Successfully seeded default CMS pages data to MongoDB!");
    } else {
      // Migrate missing keys to existing MongoDB documents
      const DEFAULT_ABOUT_FIELDS = {
        sectionTag: "About Our Company",
        overviewHeading: "Why Choose UA Engineering For Renovation & Upgrading Services in Singapore",
        overviewText: "Looking for a dependable renovation and upgrading contractor in Singapore? UA ENGINEERING PTE. LTD. provides renovation, construction, and engineering services for HDB, BTO, condos, landed homes, commercial, and industrial properties.",
        experienceYears: "15",
        experienceTitle: "Years of Excellence",
        experienceSubtitle: "Renovation & Upgrading Services",
        trustHeading: "Why Property Owners Trust UA Engineering",
        highlightsJson: JSON.stringify([
          { text: "15+ Years of Industry Experience", icon: "Clock" },
          { text: "Highly Skilled & Certified Workers", icon: "Wrench" },
          { text: "BCA & HDB Compliant Workmanship", icon: "Award" },
          { text: "Transparent & Competitive Pricing", icon: "DollarSign" },
          { text: "Premium Quality Materials", icon: "ShieldCheck" },
          { text: "Safety-First Construction Practices", icon: "ShieldCheck" },
          { text: "On-Time Project Completion", icon: "Clock" },
          { text: "100% Commitment to Client Satisfaction", icon: "ThumbsUp" }
        ]),
        processBadge: "HOW WE WORK",
        processHeading: "Our Process",
        processSubheading: "Every successful renovation begins with proper planning and professional execution. At UA Engineering, we follow a proven project management process that ensures efficiency, quality, and complete customer confidence from the initial consultation through project completion.",
        processStepsJson: JSON.stringify([
          {
            id: 1,
            tag: "STEP 01",
            title: "Consultation & Site Assessment",
            description: "We discuss your renovation goals, inspect the property, take accurate measurements, assess technical requirements, and recommend practical solutions to develop a clear and efficient project plan.",
            milestones: [
              "Free consultation and site inspection",
              "Detailed technical assessment",
              "Structural and feasibility evaluation",
              "Accurate measurements"
            ]
          },
          {
            id: 2,
            tag: "STEP 02",
            title: "Proposal & Project Planning",
            description: "We prepare a transparent quotation covering scope, materials, pricing, and timeline. After approval, we organise resources, scheduling, and project planning for smooth execution.",
            milestones: [
              "Detailed itemised quotation",
              "Transparent pricing",
              "Material recommendations",
              "Project scheduling"
            ]
          },
          {
            id: 3,
            tag: "STEP 03",
            title: "Professional Execution & Quality Control",
            description: "Our skilled team completes every project safely under experienced supervision, following BCA and HDB standards while maintaining strict quality control throughout every stage.",
            milestones: [
              "Experienced project supervisors",
              "Certified skilled workers",
              "Premium construction materials",
              "Continuous quality inspections"
            ]
          },
          {
            id: 4,
            tag: "STEP 04",
            title: "Completion, Handover & After-Sales Support",
            description: "After final inspections and site cleaning, we hand over the completed project with warranty information, maintenance guidance, and responsive after-sales support for your peace of mind.",
            milestones: [
              "Final quality inspection",
              "Complete project walkthrough",
              "Site cleaning and finishing",
              "Warranty documentation"
            ]
          }
        ]),
        residentialBadge: "WHAT WE DO",
        residentialHeading: "Complete Renovation, Engineering & Property Improvement Services",
        residentialSubheading: "UA Engineering provides complete renovation, structural, waterproofing, electrical, plumbing, aluminium, and solar panel solutions for residential, commercial, and industrial properties across Singapore.",
        faqBadge: "FAQ'S"
      };

      for (const pageId of Object.keys(parsedData.cms)) {
        const doc = await Cms.findOne({ pageId });
        if (doc) {
          const defaultsForPage = pageId === "about" ? DEFAULT_ABOUT_FIELDS : {};
          const contentUpdated = { ...defaultsForPage, ...parsedData.cms[pageId].content, ...doc.content };
          const seoUpdated = { ...parsedData.cms[pageId].seo, ...doc.seo };
          
          if (Object.keys(contentUpdated).length !== Object.keys(doc.content).length || 
              Object.keys(seoUpdated).length !== Object.keys(doc.seo).length) {
            doc.content = contentUpdated;
            doc.seo = seoUpdated;
            doc.markModified("content");
            doc.markModified("seo");
            await doc.save();
            console.log(`   [Migration] Patched missing schema fields for page: ${pageId}`);
          }
        } else {
          await Cms.create({
            pageId,
            content: parsedData.cms[pageId].content,
            seo: parsedData.cms[pageId].seo
          });
          console.log(`   [Migration] Seeded missing page document: ${pageId}`);
        }
      }
    }

    // Seed / Sync services list to MongoDB
    if (parsedData.services && parsedData.services.length > 0) {
      await Service.findOneAndUpdate(
        {},
        { $set: { categories: parsedData.services } },
        { upsert: true, new: true }
      );
      console.log("   Successfully synced default services list to MongoDB!");
    }

    // Seed projects list if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && parsedData.projects && Array.isArray(parsedData.projects)) {
      console.log("   MongoDB is empty. Seeding default projects portfolio...");
      for (const proj of parsedData.projects) {
        const slug = proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await Project.create({
          slug,
          title: proj.title,
          category: proj.category,
          image: proj.image,
          description: proj.description || "",
          location: proj.location || "Singapore",
          gallery: proj.gallery || []
        });
      }
      console.log("   Successfully seeded default projects portfolio to MongoDB!");
    }
  } catch (err) {
    console.error("   Failed to seed/migrate database values:", err.message);
  }
}

module.exports = {
  mongoose,
  connectDB,
  getUseMongo: () => useMongo || mongoose.connection.readyState === 1,
  Cms,
  Blog,
  Inquiry,
  Project,
  Service
};
