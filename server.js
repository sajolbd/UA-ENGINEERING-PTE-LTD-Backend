const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const os = require("os");
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

// Ensure MongoDB connection is initialized for serverless requests
app.use(async (req, res, next) => {
  await dbConnection.connectDB().catch(() => {});
  next();
});

// Serve uploaded images statically
const publicImagesDir = path.join(__dirname, "public", "images");
try {
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
  }
  app.use("/images", express.static(publicImagesDir));
} catch (e) {
  // Read-only filesystem on Vercel
}

// Fallback to serve website's static public images if they exist locally (local dev environment)
try {
  const websitePublicImagesDir = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "public", "images");
  if (fs.existsSync(websitePublicImagesDir)) {
    app.use("/images", express.static(websitePublicImagesDir));
  }
} catch (e) {
  // Non-fatal
}

let inMemoryDb = null;

// Helper function to read database (local fallback with in-memory caching)
function readDatabase() {
  if (inMemoryDb) {
    return inMemoryDb;
  }
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf8");
      inMemoryDb = JSON.parse(data);
      return inMemoryDb;
    }
  } catch (error) {
    console.error("Error reading database:", error.message);
  }
  inMemoryDb = { cms: {}, blogs: [], inquiries: [], projects: [], services: [] };
  return inMemoryDb;
}

// Helper function to write database (local fallback with in-memory caching)
function writeDatabase(data) {
  inMemoryDb = data;
  try {
    if (process.env.VERCEL) return true;
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing database:", error.message);
    return true;
  }
}

// Production-safe local sync helper functions
function syncToWebsite(pageId, formType, data) {
  if (process.env.VERCEL) return;
  try {
    const websiteCmsJsonPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "cmsData.json");
    if (!fs.existsSync(path.dirname(websiteCmsJsonPath))) return;
    
    let currentCms = {};
    if (fs.existsSync(websiteCmsJsonPath)) {
      currentCms = JSON.parse(fs.readFileSync(websiteCmsJsonPath, "utf8"));
    }
    if (!currentCms[pageId]) {
      currentCms[pageId] = { content: {}, seo: {} };
    }
    currentCms[pageId][formType] = data;
    fs.writeFileSync(websiteCmsJsonPath, JSON.stringify(currentCms, null, 2), "utf8");
  } catch (err) {
    // Non-fatal in production
  }
}

function syncBlogsToWebsite(blogs) {
  if (process.env.VERCEL) return;
  try {
    let tsPath = path.join(__dirname, "..", "UA-ENGINEERING-PTE-LTD-Website", "data", "blogData.ts");
    if (!fs.existsSync(path.dirname(tsPath))) {
      tsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "blogData.ts");
    }
    if (!fs.existsSync(path.dirname(tsPath))) return;

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
  popular?: boolean;
  views?: number;
  content: string;
}

export const blogPosts: BlogPost[] = ${JSON.stringify(blogs, null, 2)};
`;
    fs.writeFileSync(tsPath, tsCode, "utf8");
  } catch (err) {
    // Non-fatal in production
  }
}

function syncProjectsToWebsite(projects) {
  if (process.env.VERCEL) return;
  try {
    let tsPath = path.join(__dirname, "..", "UA-ENGINEERING-PTE-LTD-Website", "data", "projectsData.ts");
    if (!fs.existsSync(path.dirname(tsPath))) {
      tsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "projectsData.ts");
    }
    if (!fs.existsSync(path.dirname(tsPath))) return;

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
  } catch (err) {
    // Non-fatal in production
  }
}

function syncServicesToWebsite(categories) {
  if (process.env.VERCEL) return;
  try {
    let tsPath = path.join(__dirname, "..", "UA-ENGINEERING-PTE-LTD-Website", "data", "servicesData.ts");
    if (!fs.existsSync(path.dirname(tsPath))) {
      tsPath = path.join(__dirname, "..", "UA ENGINEERING PTE. LTD -Website", "data", "servicesData.ts");
    }
    if (!fs.existsSync(path.dirname(tsPath))) return;

    const tsCode = `export interface SubService {
  slug: string;
  title: string;
  image: string;
  breadcrumbTitle?: string;
  breadcrumbBg?: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  process: string[];
}

export interface ServiceCategory {
  slug: string;
  title: string;
  breadcrumbTitle?: string;
  shortDescription: string;
  description: string;
  featuredImage: string;
  bgImage: string;
  services: SubService[];
}

export const servicesData: ServiceCategory[] = ${JSON.stringify(categories, null, 2)};
`;
    fs.writeFileSync(tsPath, tsCode, "utf8");
  } catch (err) {
    // Non-fatal in production
  }
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Root Status Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UA Engineering Backend API is running",
    status: "online"
  });
});

// Health Check Endpoint
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
      const localDb = readDatabase();
      const mergedCms = { ...localDb.cms, ...cmsMap };
      return res.json({ success: true, data: mergedCms });
    } catch (err) {
      console.error("[Mongo Error] GET /api/cms failed:", err.message);
    }
  }

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

  const db = readDatabase();
  if (!db.cms[pageId]) {
    db.cms[pageId] = { content: {}, seo: {} };
  }
  db.cms[pageId][formType] = data;
  
  const saved = writeDatabase(db);
  if (saved || process.env.VERCEL) {
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

      return res.json({ success: true, data: blogDoc, message: "Blog published successfully to MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/blogs failed:", err.message);
    }
  }

  const db = readDatabase();
  if (!db.blogs) db.blogs = [];

  const exists = db.blogs.find((b) => b.slug === newPost.slug);
  if (exists) {
    return res.status(400).json({ success: false, error: "A blog post with this slug already exists." });
  }

  newPost.id = Date.now().toString();
  db.blogs.unshift(newPost);
  
  const saved = writeDatabase(db);
  if (saved || process.env.VERCEL) {
    syncBlogsToWebsite(db.blogs);
    res.json({ success: true, data: newPost, message: "Blog published successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to write blog to database" });
  }
});

// 4.1. DELETE Blog Post
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
    if (saved || process.env.VERCEL) {
      syncBlogsToWebsite(db.blogs);
      res.json({ success: true, message: "Blog post deleted successfully!" });
    } else {
      res.status(500).json({ success: false, error: "Failed to update local database" });
    }
  } else {
    res.status(404).json({ success: false, error: "No blogs found" });
  }
});

// 5. GET Single Blog Post by Slug
app.get("/api/blogs/:slug", async (req, res) => {
  const { slug } = req.params;

  if (getUseMongo()) {
    try {
      const blog = await Blog.findOne({ slug });
      if (blog) {
        blog.views = (blog.views || 0) + 1;
        await blog.save();
        return res.json({ success: true, data: blog });
      }
    } catch (err) {
      console.error("[Mongo Error] GET /api/blogs/:slug failed:", err.message);
    }
  }

  const db = readDatabase();
  const blog = (db.blogs || []).find((b) => b.slug === slug);

  if (blog) {
    blog.views = (blog.views || 0) + 1;
    writeDatabase(db);
    return res.json({ success: true, data: blog });
  }

  res.status(404).json({ success: false, error: "Blog post not found" });
});

// 6. POST Contact Form Inquiry
app.post("/api/inquiries", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Name, email, and message are required." });
  }

  const newInquiry = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || "",
    service: service || "General Inquiry",
    message,
    date: new Date().toISOString()
  };

  if (getUseMongo()) {
    try {
      const inquiryDoc = new Inquiry(newInquiry);
      await inquiryDoc.save();
      return res.json({ success: true, message: "Thank you! Your inquiry has been submitted successfully to MongoDB." });
    } catch (err) {
      console.error("[Mongo Error] POST /api/inquiries failed:", err.message);
    }
  }

  const db = readDatabase();
  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(newInquiry);

  const saved = writeDatabase(db);
  if (saved || process.env.VERCEL) {
    res.json({ success: true, message: "Thank you! Your inquiry has been submitted successfully." });
  } else {
    res.status(500).json({ success: false, error: "Failed to save inquiry" });
  }
});

// 7. GET Completed Projects
app.get("/api/projects", async (req, res) => {
  if (getUseMongo()) {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: projects });
    } catch (err) {
      console.error("[Mongo Error] GET /api/projects failed:", err.message);
    }
  }

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

  const db = readDatabase();
  if (!db.projects) db.projects = [];

  newProject.id = Date.now().toString();
  db.projects.unshift(newProject);

  const saved = writeDatabase(db);
  if (saved || process.env.VERCEL) {
    syncProjectsToWebsite(db.projects);
    res.json({ success: true, data: newProject, message: "Project added successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to save project" });
  }
});

// 8.1. PUT / UPDATE Project
app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!updatedData.title) {
    return res.status(400).json({ success: false, error: "Project Title is required." });
  }

  if (getUseMongo()) {
    try {
      const projectDoc = await Project.findByIdAndUpdate(
        id,
        { $set: updatedData },
        { new: true }
      );
      const allProjects = await Project.find().sort({ createdAt: -1 });
      syncProjectsToWebsite(allProjects);
      return res.json({ success: true, data: projectDoc, message: "Project updated successfully in MongoDB!" });
    } catch (err) {
      console.error("[Mongo Error] PUT /api/projects/:id failed:", err.message);
    }
  }

  const db = readDatabase();
  if (db.projects) {
    let index = db.projects.findIndex((p) => p.id === id || p._id === id);
    if (index !== -1) {
      db.projects[index] = { ...db.projects[index], ...updatedData };
      const saved = writeDatabase(db);
      if (saved || process.env.VERCEL) {
        syncProjectsToWebsite(db.projects);
        return res.json({ success: true, data: db.projects[index], message: "Project updated successfully!" });
      }
    }
  }

  res.status(500).json({ success: false, error: "Failed to update project" });
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

  const db = readDatabase();
  if (db.projects) {
    db.projects = db.projects.filter((p) => p.id !== id && p._id !== id);
    const saved = writeDatabase(db);
    if (saved || process.env.VERCEL) {
      syncProjectsToWebsite(db.projects);
      res.json({ success: true, message: "Project deleted successfully!" });
    } else {
      res.status(500).json({ success: false, error: "Failed to update local database" });
    }
  } else {
    res.status(404).json({ success: false, error: "No projects found" });
  }
});

// 8.5. GET & UPDATE Services List
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
  if (saved || process.env.VERCEL) {
    syncServicesToWebsite(categories);
    res.json({ success: true, message: "Services list successfully updated locally!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to write data to database" });
  }
});

// 9. Reset database to default presets
app.post("/api/reset", async (req, res) => {
  let defaultCms = {};
  try {
    defaultCms = readDatabase().cms;
  } catch (e) {}

  if (getUseMongo()) {
    try {
      await Blog.deleteMany({});
      await Inquiry.deleteMany({});
      await Project.deleteMany({});
      await Cms.deleteMany({});
      
      for (const pageId of Object.keys(defaultCms)) {
        await Cms.create({
          pageId,
          content: defaultCms[pageId].content,
          seo: defaultCms[pageId].seo
        });
      }
      
      syncToWebsite("reset", "content", defaultCms);
      return res.json({ success: true, message: "MongoDB tables cleared and reset successfully!" });
    } catch (err) {
      console.error("[Mongo Error] POST /api/reset failed:", err.message);
    }
  }

  const db = {
    cms: defaultCms,
    blogs: [],
    inquiries: [],
    projects: [],
    services: []
  };
  
  const saved = writeDatabase(db);
  if (saved || process.env.VERCEL) {
    syncToWebsite("reset", "content", defaultCms);
    res.json({ success: true, message: "Database reset successfully!" });
  } else {
    res.status(500).json({ success: false, error: "Failed to reset database" });
  }
});

// 10. POST / UPLOAD Image file (Multer)
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.join(__dirname, "public", "images", "uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Non-fatal on serverless
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

  res.json({
    success: true,
    imagePath: relativePath,
    message: "Image uploaded successfully!"
  });
});

// Server execution logic (Avoid calling app.listen when imported by Vercel serverless entry point)
if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(`   UA Engineering REST Backend API Server      `);
    console.log(`   Running on: http://0.0.0.0:${PORT} (Accessible via LAN IP)`);
    console.log(`   Mode: ${getUseMongo() ? "MongoDB connected" : "Local db.json File"} `);
    console.log(`===============================================`);

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
        }
      } catch (err) {
        console.error("Failed to execute startup file compilation:", err.message);
      }
    }, 2000);
  });
}

module.exports = app;
