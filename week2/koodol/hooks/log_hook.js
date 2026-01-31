import fs from "fs";
import path from "path";

async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

async function main() {
  const input = await readInput();

  const filePath =
    input.tool_response?.filePath || input.tool_input?.file_path || "";

  if (!filePath) {
    process.exit(0);
  }

  const toolName = input.tool_name || "unknown";
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${toolName}: ${filePath}\n`;

  const logFile = path.resolve(process.cwd(), "changes.log");
  fs.appendFileSync(logFile, logEntry);

  process.exit(0);
}

main().catch((err) => {
  console.error(`Log hook error: ${err.message}`);
  process.exit(0);
});
