import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

//method to get MCP server instance
export const getServerInstance = async (name: string): Promise<McpServer> => {
  const server = new McpServer({
    name: name,
    version: "1.0.0",
  });

  server.registerTool(
    "sayHello",
    {
      title: "Greetings tool",
      description: "Says hello greetings when client says hello",
      inputSchema: { text: z.string().describe("Greeting saying hello or hi") },
      outputSchema: {
        helloText: z.string(),
      },
    },
    async ({ text }) => {
      const num = Math.floor(Math.random() * 100);
      const output = {
        helloText: `Hi there, this is the new MCP server speaking here is a random number ${JSON.stringify(
          num
        )}!!!!`,
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(output),
          },
        ],
        structuredContent: output,
      };
    }
  );

  const transport = new StdioServerTransport();

  //connecting STDIO transport to let MCP server communicate with local STDIO communication
  await server.connect(transport).catch((err) => {
    console.log("Error in server.connect:: ", err);
  });

  return server && server;
};
