import fs from "fs";

async function main() {
  const input = await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(JSON.parse(data)));
  });

  const filePath =
    input.tool_response?.filePath || input.tool_input?.file_path || "unknown";
  const timestamp = new Date().toISOString();

  // Log the change
  const logEntry = `[${timestamp}] Modified: ${filePath}\n`;
  fs.appendFileSync("post-log.json", logEntry);

  console.log(`Logged change to ${filePath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});