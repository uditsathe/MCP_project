import { getServerInstance } from "./mcpServer";
import express from "express";
import { z } from "zod";
import { TwitterClient } from "./channels/twitter";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const serverPort = 8080;

// app.get("/", (req, res) => {
//   res.send("Hello from Express!");
// });

// app.listen(serverPort, () => {
//   console.log("Server up and running at localhost:8080");
// });

async function main() {
  console.log("Paused MCP for test API for a while");
  const twitterClient = await new TwitterClient();
  const userDetails = await twitterClient.getUserDetails("SatheUdit");
  console.log("Successfully retrieved data from the X.com API here it is:");
  console.log(JSON.stringify(userDetails));
  // //creating mcp server instance
  // const serverInstance = await getServerInstance("socials");
  // if (serverInstance) {
  //   console.error("MCP Server running on stdio");
  // }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
