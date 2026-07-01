const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");

// Load Environment variables
dotenv.config();

// Load Mongoose DB connection module
const dbConnection = require("./db");
const Cms = dbConnection.Cms;
const Blog = dbConnection.Blog;
const Inquiry = dbConnection.Inquiry;
const Project = dbConnection.Project;
const getUseMongo = dbConnection.getUseMongo;
const Service = dbConnection.Service;

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, "data", "db.json");

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());

// Serve uploaded images statically from the backend's own public folder
const publicImagesDir = path.join(__dirname, "public", "images");
if (!require("fs").existsSync(publicImagesDir)) {
  require("fs").mkdirSync(publicImagesDir, { recursive: true });
}
app.use("/images", express.static(publicImagesDir));

// Helper function to read database (local fallback)
function readDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  return { cms: {}, blogs: [], inquiries: [], projects: [] };
}

// Helper function to write database (local fallback)
function writeDatabase(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Helper to sync changes to the website static json config
function syncToWebsite(pageId, formType, data) {
  try {
    const websiteCmsJsonPath = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/cmsData.json";
    let currentCms = {};
    if (fs.existsSync(websiteCmsJsonPath)) {
      currentCms = JSON.parse(fs.readFileSync(websiteCmsJsonPath, "utf8"));
    }
    if (!currentCms[pageId]) {
      currentCms[pageId] = { content: {}, seo: {} };
    }
    currentCms[pageId][formType] = data;
    fs.writeFileSync(websiteCmsJsonPath, JSON.stringify(currentCms, null, 2), "utf8");
    console.log(`[Sync] Successfully synchronized CMS configuration to website data file: ${websiteCmsJsonPath}`);
  } catch (err) {
    console.error("[Sync Error] Failed to synchronize CMS changes to website folder:", err.message);
  }
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "UA Engineering Express API Backend",
    database: getUseMongo() ? "MongoDB" : "Local db.json File System"
  });
});

// 1. GET CMS Section Data
app.get("/api/cms", async (req, res) => {
  if (getUseMongo()) {
    try {
      const cmsDocs = await Cms.find();
      const cmsMap = {};
      cmsDocs.forEach((doc) => {
        cmsMap[doc.pageId] = {
          content: doc.content || {},
          seo: doc.seo || {}
        };
      });
      // Merge with default initial config if some pages are missing in MongoDB
      const localDb = readDatabase();
      const mergedCms = { ...localDb.cms, ...cmsMap };
      return res.json({ success: true, data: mergedCms });
    } catch (err) {
      console.error("[Mongo Error] GET /api/cms failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  res.json({ success: true, data: db.cms || {} });
});

// 2. POST / UPDATE CMS Page Content or SEO
app.post("/api/cms", async (req, res) => {
  const { pageId, formType, data } = req.body;
  
  if (!pageId || !formType || !data) {
    return res.status(400).json({ success: false, error: "Missing required fields (pageId, formType, data)" });
  }

  if (getUseMongo()) {
    try {
      const updateField = formType === "content" ? { content: data } : { seo: data };
      await Cms.findOneAndUpdate(
        { pageId },
        { $set: updateField },
        { upsert: true, new: true }
      );
      syncToWebsite(pageId, formType, data);
      return res.json({ success: true, message: `CMS ${formType} settings saved successfully to MongoDB for page: ${pageId}` });
    } catch (err) {
      console.error("[Mongo Error] POST /api/cms failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  if (!db.cms[pageId]) {
    db.cms[pageId] = { content: {}, seo: {} };
  }
  db.cms[pageId][formType] = data;
  
  const saved = writeDatabase(db);
  if (saved) {
    syncToWebsite(pageId, formType, data);
    res.json({ success: true, message: `CMS ${formType} settings saved successfully for page: ${pageId}` });
  } else {
    res.status(500).json({ success: false, error: "Failed to write data to database" });
  }
});

// 3. GET Blog Posts
app.get("/api/blogs", async (req, res) => {
  if (getUseMongo()) {
    try {
      const blogs = await Blog.find().sort({ _id: -1 });
      return res.json({ success: true, data: blogs });
    } catch (err) {
      console.error("[Mongo Error] GET /api/blogs failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  res.json({ success: true, data: db.blogs || [] });
});

// 4. POST / CREATE Blog Post
app.post("/api/blogs", async (req, res) => {
  const newPost = req.body;
  
  if (!newPost.title || !newPost.slug) {
    return res.status(400).json({ success: false, error: "Title and slug are required to post a blog." });
  }

  if (getUseMongo()) {
    try {
      const exists = await Blog.findOne({ slug: newPost.slug });
      if (exists) {
        return res.status(400).json({ success: false, error: "A blog post with this slug already exists." });
      }
      
      const blogDoc = new Blog(newPost);
      await blogDoc.save();
      const allBlogs = await Blog.find().sort({ _id: -1 });
      syncBlogsToWebsite(allBlogs);
      return res.json({ success: true, data: blogDoc, message: "Blog post published successfully to MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/blogs failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  if (!db.blogs) db.blogs = [];
  
  const exists = db.blogs.find(post => post.slug === newPost.slug);
  if (exists) {
    return res.status(400).json({ success: false, error: "A blog post with this slug already exists." });
  }

  newPost.views = newPost.views || 0;
  newPost.date = newPost.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  newPost.author = newPost.author || "Administrator";
  newPost.bgColor = newPost.bgColor || "bg-slate-100";
  newPost.readTime = newPost.readTime || "5 mins read";
  newPost.id = Date.now().toString();

  db.blogs.unshift(newPost);
  
  const saved = writeDatabase(db);
  if (saved) {
    syncBlogsToWebsite(db.blogs);
    res.json({ success: true, data: newPost, message: "Blog post published successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to write data to database" });
  }
});

// 4.2. DELETE Blog Post
app.delete("/api/blogs/:id", async (req, res) => {
  const { id } = req.params;

  if (getUseMongo()) {
    try {
      await Blog.findByIdAndDelete(id);
      const allBlogs = await Blog.find().sort({ _id: -1 });
      syncBlogsToWebsite(allBlogs);
      return res.json({ success: true, message: "Blog post deleted successfully from MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] DELETE /api/blogs failed:", err.message);
    }
  }

  const db = readDatabase();
  if (db.blogs) {
    db.blogs = db.blogs.filter((b) => b.id !== id && b._id !== id);
    const saved = writeDatabase(db);
    if (saved) {
      syncBlogsToWebsite(db.blogs);
      res.json({ success: true, message: "Blog post deleted successfully!" });
    } else {
      res.status(500).json({ success: false, error: "Failed to update database file" });
    }
  } else {
    res.status(404).json({ success: false, error: "No blogs found" });
  }
});

function syncBlogsToWebsite(blogs) {
  try {
    const tsPath = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/blogData.ts";
    if (!fs.existsSync(path.dirname(tsPath))) return; // Skip on Railway/production
    const tsCode = `export interface BlogPost {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string;
  author: string;
  image: string;
  bgColor: string;
  readTime: string;
  popular: boolean;
  content: string;
  views: number;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(blogs, null, 2)};
`;
    fs.writeFileSync(tsPath, tsCode, "utf8");
    console.log(`[Sync] Successfully synchronized dynamic blog posts to website TS file: ${tsPath}`);
  } catch (err) {
    console.error("[Sync Error] Failed to synchronize blogs to website folder:", err.message);
  }
}


// 5. GET Contact Inquiries
app.get("/api/inquiries", async (req, res) => {
  if (getUseMongo()) {
    try {
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: inquiries });
    } catch (err) {
      console.error("[Mongo Error] GET /api/inquiries failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  res.json({ success: true, data: db.inquiries || [] });
});

// 6. POST / SUBMIT Contact Inquiry
app.post("/api/inquiries", async (req, res) => {
  const newInquiry = req.body;

  if (!newInquiry.name || !newInquiry.phone) {
    return res.status(400).json({ success: false, error: "Name and Phone number are required to submit an inquiry." });
  }

  if (getUseMongo()) {
    try {
      const inquiryDoc = new Inquiry(newInquiry);
      await inquiryDoc.save();
      return res.json({ success: true, data: inquiryDoc, message: "Inquiry registered successfully to MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/inquiries failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  if (!db.inquiries) db.inquiries = [];

  newInquiry.id = Date.now().toString();
  newInquiry.date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  db.inquiries.unshift(newInquiry);

  const saved = writeDatabase(db);
  if (saved) {
    res.json({ success: true, data: newInquiry, message: "Inquiry registered successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to submit inquiry" });
  }
});

// 7. GET Projects
app.get("/api/projects", async (req, res) => {
  if (getUseMongo()) {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: projects });
    } catch (err) {
      console.error("[Mongo Error] GET /api/projects failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  res.json({ success: true, data: db.projects || [] });
});

// 8. POST / CREATE Project
app.post("/api/projects", async (req, res) => {
  const newProject = req.body;

  if (!newProject.title) {
    return res.status(400).json({ success: false, error: "Project Title is required." });
  }

  if (getUseMongo()) {
    try {
      const projectDoc = new Project(newProject);
      await projectDoc.save();
      const allProjects = await Project.find().sort({ createdAt: -1 });
      syncProjectsToWebsite(allProjects);
      return res.json({ success: true, data: projectDoc, message: "Project added successfully to MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/projects failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  if (!db.projects) db.projects = [];

  newProject.id = Date.now().toString();
  db.projects.unshift(newProject);

  const saved = writeDatabase(db);
  if (saved) {
    syncProjectsToWebsite(db.projects);
    res.json({ success: true, data: newProject, message: "Project added successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to save project" });
  }
});

// 8.2. DELETE Completed Project
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  if (getUseMongo()) {
    try {
      await Project.findByIdAndDelete(id);
      const allProjects = await Project.find().sort({ createdAt: -1 });
      syncProjectsToWebsite(allProjects);
      return res.json({ success: true, message: "Project deleted successfully from MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] DELETE /api/projects failed:", err.message);
    }
  }

  // Fallback to Local JSON
  const db = readDatabase();
  if (db.projects) {
    db.projects = db.projects.filter((p) => p.id !== id);
    const saved = writeDatabase(db);
    if (saved) {
      syncProjectsToWebsite(db.projects);
      res.json({ success: true, message: "Project deleted successfully!" });
    } else {
      res.status(500).json({ success: false, error: "Failed to update local database" });
    }
  } else {
    res.status(404).json({ success: false, error: "No projects found" });
  }
});


function syncProjectsToWebsite(projects) {
  try {
    const tsPath = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/projectsData.ts";
    const tsCode = `export interface ProjectItem {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  location: string;
  gallery: string[];
}

export const projectsData: ProjectItem[] = ${JSON.stringify(projects, null, 2)};
`;
    fs.writeFileSync(tsPath, tsCode, "utf8");
    console.log(`[Sync] Successfully synchronized dynamic projects to website TS file: ${tsPath}`);
  } catch (err) {
    console.error("[Sync Error] Failed to synchronize projects to website folder:", err.message);
  }
}


// 8.5. Serve/Modify Services List
app.get("/api/services", async (req, res) => {
  if (getUseMongo()) {
    try {
      const doc = await Service.findOne();
      if (doc) {
        return res.json({ success: true, data: doc.categories || [] });
      }
    } catch (err) {
      console.error("[Mongo Error] GET /api/services failed:", err.message);
    }
  }
  const db = readDatabase();
  res.json({ success: true, data: db.services || [] });
});

app.post("/api/services", async (req, res) => {
  const { categories } = req.body;
  if (!categories || !Array.isArray(categories)) {
    return res.status(400).json({ success: false, error: "Categories array is required." });
  }

  if (getUseMongo()) {
    try {
      await Service.findOneAndUpdate(
        {},
        { $set: { categories } },
        { upsert: true, new: true }
      );
      syncServicesToWebsite(categories);
      return res.json({ success: true, message: "Services list successfully updated in MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/services failed:", err.message);
    }
  }

  const db = readDatabase();
  db.services = categories;
  const saved = writeDatabase(db);
  if (saved) {
    syncServicesToWebsite(categories);
    res.json({ success: true, message: "Services list successfully updated locally!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to write data to database" });
  }
});

function syncServicesToWebsite(categories) {
  try {
    const tsPath = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/servicesData.ts";
    const tsCode = `export interface SubService {
  slug: string;
  title: string;
  image: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  process: string[];
}

export interface ServiceCategory {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  bgImage: string;
  services: SubService[];
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(categories, null, 2)};
`;
    fs.writeFileSync(tsPath, tsCode, "utf8");
    console.log(`[Sync] Successfully synchronized dynamic services to website TS file: \${tsPath}`);
  } catch (err) {
    console.error("[Sync Error] Failed to synchronize services to website folder:", err.message);
  }
}


// 9. Reset database to default presets (seeder action)
app.post("/api/reset", async (req, res) => {
  const defaultCms = require("./data/db.json").cms;

  if (getUseMongo()) {
    try {
      await Blog.deleteMany({});
      await Inquiry.deleteMany({});
      await Project.deleteMany({});
      await Cms.deleteMany({});
      
      // Seed default cms configuration to Mongo
      for (const pageId of Object.keys(defaultCms)) {
        await Cms.create({
          pageId,
          content: defaultCms[pageId].content,
          seo: defaultCms[pageId].seo
        });
      }
      
      // Also rewrite the website static file
      fs.writeFileSync("D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/cmsData.json", JSON.stringify(defaultCms, null, 2), "utf8");
      
      return res.json({ success: true, message: "MongoDB tables cleared and reset successfully!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/reset failed:", err.message);
    }
  }

  // Fallback to Local JSON reset
  const db = {
    cms: defaultCms,
    blogs: [],
    inquiries: [],
    projects: []
  };
  
  const saved = writeDatabase(db);
  if (saved) {
    fs.writeFileSync("D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/cmsData.json", JSON.stringify(defaultCms, null, 2), "utf8");
    res.json({ success: true, message: "Database reset to 0 blogs / empty tables successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to reset database" });
  }
});

// 10. POST / UPLOAD Image file
const uploadDir = path.join(__dirname, "public", "images", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image file provided" });
  }

  const filename = req.file.filename;
  const relativePath = "/images/uploads/" + filename;

  // Attempt to also copy to local Website folder if running locally
  try {
    const localWebsiteDir = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/public/images/uploads";
    if (fs.existsSync(path.dirname(localWebsiteDir))) {
      if (!fs.existsSync(localWebsiteDir)) fs.mkdirSync(localWebsiteDir, { recursive: true });
      fs.copyFileSync(req.file.path, path.join(localWebsiteDir, filename));
    }
    const localDashboardDir = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Dashboard/public/images/uploads";
    if (fs.existsSync(path.dirname(localDashboardDir))) {
      if (!fs.existsSync(localDashboardDir)) fs.mkdirSync(localDashboardDir, { recursive: true });
      fs.copyFileSync(req.file.path, path.join(localDashboardDir, filename));
    }
  } catch (err) {
    // Non-fatal - local sync only works in dev environment
  }

  res.json({
    success: true,
    imagePath: relativePath,
    message: "Image uploaded successfully!"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`   UA Engineering REST Backend API Server      `);
  console.log(`   Running on: http://localhost:${PORT}        `);
  console.log(`   Mode: ${getUseMongo() ? "MongoDB connected" : "Local db.json File"} `);
  console.log(`===============================================`);

  // Asynchronous startup sync after mongoose finishes connecting
  setTimeout(async () => {
    try {
      if (getUseMongo()) {
        const servicesDoc = await Service.findOne();
        if (servicesDoc && servicesDoc.categories) {
          syncServicesToWebsite(servicesDoc.categories);
        }
        const projects = await Project.find().sort({ createdAt: -1 });
        if (projects && projects.length > 0) {
          syncProjectsToWebsite(projects);
        }
        const blogs = await Blog.find().sort({ _id: -1 });
        if (blogs && blogs.length > 0) {
          syncBlogsToWebsite(blogs);
        }
      } else {
        const db = readDatabase();
        if (db.services) syncServicesToWebsite(db.services);
        if (db.projects) syncProjectsToWebsite(db.projects);
        if (db.blogs) syncBlogsToWebsite(db.blogs);
      }
    } catch (err) {
      console.error("Failed to execute startup file compilation:", err.message);
    }
  }, 2000);
});
