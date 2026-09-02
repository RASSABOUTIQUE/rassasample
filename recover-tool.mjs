
import fs from "fs";

const lines = fs.readFileSync(`C:\\Users\\abhishekh\\.gemini\\antigravity-ide\\brain\\cce8dcac-b3e9-475f-98b6-6958baac154f\\.system_generated\\logs\\transcript_full.jsonl`, "utf8").split("\n");

let bestContent = "";
let maxLines = 0;

for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
       for (const tc of obj.tool_calls) {
          if ((tc.function.name === "default_api:replace_file_content" || tc.function.name === "default_api:write_to_file") && tc.function.arguments && tc.function.arguments.includes("shop.tsx")) {
             const args = JSON.parse(tc.function.arguments);
             if (args.TargetFile && args.TargetFile.endsWith("shop.tsx")) {
                const content = args.ReplacementContent || args.CodeContent;
                if (content) {
                  const numLines = content.split("\n").length;
                  if (numLines > maxLines) {
                     maxLines = numLines;
                     bestContent = content;
                  }
                }
             }
          }
       }
    }
  } catch(e) {}
}

if (bestContent) {
  fs.writeFileSync("restored-shop-from-tool.tsx", bestContent);
  console.log("Found best tool call shop.tsx with " + maxLines + " lines!");
} else {
  console.log("No tool call found");
}

