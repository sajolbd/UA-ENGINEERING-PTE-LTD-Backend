const fs = require("fs");
const path = require("path");

const TS_PATH = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Website/components/projects/ProjectsSection.tsx";
const DB_PATH = "D:/Projects/UA ENGINEERING PTE. LTD/UA ENGINEERING PTE. LTD -Backend/data/db.json";

try {
  if (fs.existsSync(TS_PATH)) {
    const rawCode = fs.readFileSync(TS_PATH, "utf8");
    
    const arrayStartIdx = rawCode.indexOf("const PROJECTS =");
    if (arrayStartIdx === -1) {
      throw new Error("Could not locate PROJECTS array in TS file.");
    }
    
    const bracketStart = rawCode.indexOf("[", arrayStartIdx);
    if (bracketStart === -1) {
      throw new Error("Could not find start of array bracket.");
    }
    
    // Match brackets to extract just the array
    let bracketCount = 0;
    let bracketEnd = -1;
    for (let i = bracketStart; i < rawCode.length; i++) {
      if (rawCode[i] === '[') bracketCount++;
      if (rawCode[i] === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          bracketEnd = i;
          break;
        }
      }
    }
    
    if (bracketEnd === -1) {
      throw new Error("Could not find matching closing bracket.");
    }
    
    const rawArrayText = rawCode.substring(bracketStart, bracketEnd + 1);
    const parsedArray = eval(rawArrayText);
    
    let db = { cms: {}, blogs: [], inquiries: [], projects: [], services: [] };
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    }
    
    db.projects = parsedArray;
    
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    console.log("===============================================");
    console.log("   Projects extracted and written to db.json!  ");
    console.log("   Total Projects:", parsedArray.length);
    console.log("===============================================");
  } else {
    console.error("Website ProjectsSection.tsx file not found at:", TS_PATH);
  }
} catch (err) {
  console.error("Extraction failed:", err);
}
