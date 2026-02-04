const fs = require('fs');

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = Buffer.concat(chunks).toString();
  const hookData = JSON.parse(input);
  
  const toolName = hookData.tool;
  const filePath = hookData.tool_input?.filePath || 
                  hookData.tool_input?.file_path || 
                  hookData.tool_input?.path;
  
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${toolName}: ${filePath}\n`;
  
  fs.appendFileSync('changes.log', logEntry);
  
  process.exit(0);
}

main().catch(() => process.exit(0));