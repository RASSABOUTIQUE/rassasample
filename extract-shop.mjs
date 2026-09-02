
import fs from "fs";
const log = fs.readFileSync(String.raw`C:\Users\abhishekh\.gemini\antigravity-ide\brain\cce8dcac-b3e9-475f-98b6-6958baac154f\.system_generated\logs\transcript_full.jsonl`, "utf8");
const lines = log.split("\n");
let lastShopContent = "";
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      for (const tc of obj.tool_calls) {
        if (tc.tool_name === "default_api:write_to_file" && tc.tool_args.TargetFile && tc.tool_args.TargetFile.endsWith("shop.tsx")) {
          lastShopContent = tc.tool_args.CodeContent;
        }
        if (tc.tool_name === "default_api:replace_file_content" && tc.tool_args.TargetFile && tc.tool_args.TargetFile.endsWith("shop.tsx")) {
          // It is a replace, maybe we can reconstruct it. But it is harder.
        }
      }
    }
    // Also check if any step is a view_file response that showed the ENTIRE file
    if (obj.content && obj.content.includes("File Path: ") && obj.content.includes("shop.tsx")) {
       const match = obj.content.match(/Showing lines 1 to (\d+)/);
       if (match && parseInt(match[1]) > 300) {
          const code = obj.content.substring(obj.content.indexOf("1: "));
          lastShopContent = code.split("\n").map(l => l.replace(/^[0-9]+:\s/, "")).join("\n");
       }
    }
  } catch (e) {}
}
if (lastShopContent) {
  fs.writeFileSync("src/routes/shop.tsx", lastShopContent);
  console.log("Restored shop.tsx with length:", lastShopContent.length);
} else {
  console.log("Could not find full shop.tsx in transcript");
}

