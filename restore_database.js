const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const DEFAULT_MONGODB_URI = "mongodb+srv://sajolbd:sajolBD-222@cluster0.wug67yz.mongodb.net/?appName=Cluster0";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

const WEBSITE_DATA_DIR = path.join(__dirname, "..", "UA-ENGINEERING-PTE-LTD-Website", "data");
const DB_JSON_PATH = path.join(__dirname, "data", "db.json");

// Helper to extract exported array from TS file
function extractArrayFromTs(filePath, exportName) {
  const code = fs.readFileSync(filePath, "utf8");
  const startIdx = code.indexOf(`export const ${exportName}`);
  if (startIdx === -1) {
    throw new Error(`Could not find ${exportName} in ${filePath}`);
  }
  const equalIdx = code.indexOf("=", startIdx);
  if (equalIdx === -1) {
    throw new Error(`Could not find '=' after ${exportName} in ${filePath}`);
  }
  const bracketStart = code.indexOf("[", equalIdx);
  if (bracketStart === -1) {
    throw new Error(`Could not find start bracket '[' after '=' in ${filePath}`);
  }

  // Count matching brackets
  let bracketCount = 0;
  let bracketEnd = -1;
  for (let i = bracketStart; i < code.length; i++) {
    if (code[i] === "[") bracketCount++;
    else if (code[i] === "]") {
      bracketCount--;
      if (bracketCount === 0) {
        bracketEnd = i;
        break;
      }
    }
  }

  if (bracketEnd === -1) {
    throw new Error(`Could not find matching end bracket ']' in ${filePath}`);
  }

  const arrayString = code.substring(bracketStart, bracketEnd + 1);
  return eval("(" + arrayString + ")");
}

async function restoreDatabase() {
  console.log("==================================================");
  console.log("   Starting Full Database Restore from Website... ");
  console.log("==================================================");

  // 1. Load data from Website/data files
  console.log("\n1. Loading website data files...");

  // CMS
  const cmsPath = path.join(WEBSITE_DATA_DIR, "cmsData.json");
  const cmsData = JSON.parse(fs.readFileSync(cmsPath, "utf8"));
  console.log(` - CMS pages loaded: ${Object.keys(cmsData).join(", ")}`);

  // Services
  const servicesPath = path.join(WEBSITE_DATA_DIR, "servicesData.ts");
  const servicesData = extractArrayFromTs(servicesPath, "servicesData");
  console.log(` - Services loaded: ${servicesData.length} core categories`);

  // Projects
  const projectsPath = path.join(WEBSITE_DATA_DIR, "projectsData.ts");
  const projectsData = extractArrayFromTs(projectsPath, "projectsData");
  console.log(` - Projects loaded: ${projectsData.length} project items`);

  // Blogs
  const blogsPath = path.join(WEBSITE_DATA_DIR, "blogData.ts");
  const blogsData = extractArrayFromTs(blogsPath, "blogPosts");
  console.log(` - Blog posts loaded: ${blogsData.length} blog items`);

  if (servicesData.length === 0 || projectsData.length === 0) {
    console.error("\n❌ ERROR: Extracted empty datasets! Aborting DB restore.");
    process.exit(1);
  }

  // 2. Write to db.json
  console.log("\n2. Updating local db.json...");
  let existingDb = { cms: {}, blogs: [], inquiries: [], projects: [], services: [] };
  if (fs.existsSync(DB_JSON_PATH)) {
    try {
      existingDb = JSON.parse(fs.readFileSync(DB_JSON_PATH, "utf8"));
    } catch (e) {}
  }

  existingDb.cms = cmsData;
  existingDb.services = servicesData;
  existingDb.projects = projectsData;
  existingDb.blogs = blogsData;

  fs.writeFileSync(DB_JSON_PATH, JSON.stringify(existingDb, null, 2), "utf8");
  console.log("   Successfully updated local data/db.json!");

  // 3. Update MongoDB
  console.log("\n3. Connecting to MongoDB Atlas...");
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("   Connected to MongoDB successfully!");

    // Schemas
    const CmsSchema = new mongoose.Schema({ pageId: String, content: Object, seo: Object }, { strict: false });
    const BlogSchema = new mongoose.Schema({ slug: String, title: String }, { strict: false });
    const ProjectSchema = new mongoose.Schema({ title: String, category: String }, { strict: false });
    const ServiceSchema = new mongoose.Schema({ categories: Array }, { strict: false });

    const Cms = mongoose.models.Cms || mongoose.model("Cms", CmsSchema);
    const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
    const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
    const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

    // Restore CMS
    console.log("\n   Restoring MongoDB 'Cms' collection...");
    await Cms.deleteMany({});
    for (const pageId of Object.keys(cmsData)) {
      await Cms.create({
        pageId,
        content: cmsData[pageId].content,
        seo: cmsData[pageId].seo,
      });
    }
    console.log(`   -> CMS collection restored with ${Object.keys(cmsData).length} pages.`);

    // Restore Services
    console.log("   Restoring MongoDB 'Service' collection...");
    await Service.deleteMany({});
    await Service.create({ categories: servicesData });
    console.log(`   -> Service collection restored with ${servicesData.length} core categories.`);

    // Restore Projects
    console.log("   Restoring MongoDB 'Project' collection...");
    await Project.deleteMany({});
    if (projectsData.length > 0) {
      await Project.insertMany(projectsData);
    }
    console.log(`   -> Project collection restored with ${projectsData.length} projects.`);

    // Restore Blogs
    console.log("   Restoring MongoDB 'Blog' collection...");
    await Blog.deleteMany({});
    if (blogsData.length > 0) {
      await Blog.insertMany(blogsData);
    }
    console.log(`   -> Blog collection restored with ${blogsData.length} blogs.`);

    console.log("\n==================================================");
    console.log("   SUCCESS! All database data fully restored.     ");
    console.log("==================================================");
  } catch (err) {
    console.error("   MongoDB restore encountered error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

restoreDatabase();
