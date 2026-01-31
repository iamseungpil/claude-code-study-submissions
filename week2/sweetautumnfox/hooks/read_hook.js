// Read JSON from stdin
const input = await new Promise((resolve) => {
  let data = ""
  process.stdin.on("data", (chunk) => (data += chunk))
  process.stdin.on("end", () => resolve(JSON.parse(data)))
})

const filePath = input.tool_input?.file_path || ""

// Check if trying to read .env file
if (filePath.includes(".env")) {
  console.error("Blocked: Cannot read .env file")
  process.exit(2)  // Block the operation
}

process.exit(0)  // Allow the operation
