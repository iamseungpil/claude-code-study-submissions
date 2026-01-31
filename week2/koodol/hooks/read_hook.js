async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

async function main() {
  const input = await readInput();

  const readPath =
    input.tool_input?.file_path || input.tool_input?.path || "";

  // Block access to .env files
  if (readPath.includes(".env")) {
    console.error("Blocked: Cannot read .env");
    process.exit(2);
  }

  process.exit(0);
}

main();
