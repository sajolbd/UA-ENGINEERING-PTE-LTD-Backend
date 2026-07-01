const fs = require("fs");
const path = require("path");

const TS_PATH = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/data/servicesData.ts";
const DB_PATH = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Backend/data/db.json";

try {
  if (fs.existsSync(TS_PATH)) {
    const rawCode = fs.readFileSync(TS_PATH, "utf8");
    
    // Extract everything from the "export const servicesData" array assignment
    const arrayStartIdx = rawCode.indexOf("export const servicesData");
    if (arrayStartIdx === -1) {
      throw new Error("Could not locate servicesData array in TS file.");
    }
    
    const bracketStart = rawCode.indexOf("[", arrayStartIdx);
    if (bracketStart === -1) {
      throw new Error("Could not find start of array bracket.");
    }
    
    // Extract the raw text from '[' to the end of the file
    let rawArrayText = rawCode.substring(bracketStart);
    
    // Trim trailing exports or semicolons if any
    const lastBracketIdx = rawArrayText.lastIndexOf("]");
    if (lastBracketIdx === -1) {
      throw new Error("Could not find end of array bracket.");
    }
    rawArrayText = rawArrayText.substring(0, lastBracketIdx + 1);

    // Evaluate the raw array safely in node context
    const parsedArray = eval(rawArrayText);
    
    // Read current db.json
    let db = { cms: {}, blogs: [], inquiries: [], projects: [], services: [] };
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    }
    
    db.services = parsedArray;
    
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    console.log("===============================================");
    console.log("   Services extracted and written to db.json!  ");
    console.log("   Total Core Categories:", parsedArray.length);
    console.log("===============================================");
  } else {
    console.error("Website servicesData.ts file not found at:", TS_PATH);
  }
} catch (err) {
  console.error("Extraction failed:", err);
}
