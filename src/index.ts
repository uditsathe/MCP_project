import { getServerInstance } from "./mcpServer";
import express from "express";
import { z } from "zod";

const app = express();

const serverPort = 8080;

// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

// app.listen(serverPort, () => {
//   console.log("Server up and running at localhost:8080");
// });

async function main() {
  //creating mcp server instance
  const serverInstance = await getServerInstance("socials");
  if (serverInstance) {
    console.error("MCP Server running on stdio");
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
