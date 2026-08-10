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
});

// 2. Blog Posts Schema
const BlogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
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
});

// 3. Contact Inquiries Schema
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  service: { type: String, default: "General Inquiry" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 4. Custom Completed Projects Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "" },
  client: { type: String, default: "" },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// 5. Dynamic Services Schema
const ServiceSchema = new mongoose.Schema({
  categories: { type: Array, default: [] }
});

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
      for (const pageId of Object.keys(parsedData.cms)) {
        const doc = await Cms.findOne({ pageId });
        if (doc) {
          const contentUpdated = { ...parsedData.cms[pageId].content, ...doc.content };
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

    // Seed services list if empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log("   MongoDB is empty. Seeding default services list...");
      if (parsedData.services) {
        await Service.create({ categories: parsedData.services });
        console.log("   Successfully seeded default services list to MongoDB!");
      }
    } else {
      const servicesDoc = await Service.findOne();
      if (!servicesDoc && parsedData.services) {
        await Service.create({ categories: parsedData.services });
      }
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
