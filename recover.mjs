
import fs from "fs";

const lines = fs.readFileSync(`C:\\Users\\abhishekh\\.gemini\\antigravity-ide\\brain\\cce8dcac-b3e9-475f-98b6-6958baac154f\\.system_generated\\logs\\transcript_full.jsonl`, "utf8").split("\n");

let bestContent = "";
let maxLines = 0;

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    // Looking for a tool call to default_api:run_command which runs a patch
    // Or view_file
    if (obj.content && obj.content.includes("File Path: ") && obj.content.includes("shop.tsx")) {
       const match = obj.content.match(/Showing lines 1 to (\d+)/);
       if (match && parseInt(match[1]) > 300) {
          const code = obj.content.substring(obj.content.indexOf("1: "));
          const parsed = code.split("\n").map(l => l.replace(/^[0-9]+:\s/, "")).join("\n");
          if (parsed.split("\n").length > maxLines) {
            maxLines = parsed.split("\n").length;
            bestContent = parsed;
          }
       }
    }
  } catch(e) {}
}

if (bestContent) {
  fs.writeFileSync("restored-shop.tsx", bestContent);
  console.log("Found best shop.tsx with " + maxLines + " lines!");
} else {
  console.log("No tool call found");
}

