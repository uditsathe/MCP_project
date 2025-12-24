# MCP Twitter Analytics Server

A Model Context Protocol (MCP) server implementation that provides Twitter/X analytics tools, demonstrating how to build MCP servers with external API integrations.

## Overview

This project implements an MCP server that exposes Twitter analytics capabilities as tools. It serves as a reference implementation for building MCP servers that integrate with external APIs, handle structured data validation, and organize channel-specific functionality.

## What It Implements

The server provides three Twitter analytics tools:

1. **`getUserAnalytics`** - Retrieves comprehensive user metrics (followers, following, tweet count, verification status)
2. **`getUserTweetPerformance`** - Analyzes tweet engagement metrics (likes, retweets, replies) with performance summaries
3. **`getTopicTweetCount`** - Tracks tweet volume for topics/hashtags over time with trend analysis

## Technologies Demonstrated

- **Model Context Protocol (MCP)** - Protocol for AI applications to interact with external tools
- **TypeScript** - Type-safe development with decorators and metadata
- **Twitter API v2** - Integration with Twitter/X platform via `twitter-api-v2`
- **Zod** - Runtime schema validation for tool inputs/outputs
- **Inversify** - Dependency injection container (configured but minimal usage)
- **Node.js** - Runtime environment with stdio transport for MCP communication

## Project Structure

```
src/
├── index.ts                 # Entry point, initializes MCP server
├── mcpServer.ts            # MCP server setup and tool registration
├── types.ts                # Type definitions and symbols
├── channels/
│   └── twitter/
│       ├── twitter.ts       # TwitterClient wrapper for API calls
│       └── analyticsTools.ts # Tool registration functions
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Twitter API Bearer Token

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file with your Twitter API credentials:

```env
TWITTER_API_BEARER_TOKEN=your_bearer_token_here
```

### Running the Server

```bash
npm run build
npm start
```

The server runs on stdio transport, ready to communicate with MCP clients.

## Usage as a Reference

This project demonstrates several implementation patterns:

### 1. MCP Server Setup
- Creating an MCP server instance with `@modelcontextprotocol/sdk`
- Using stdio transport for client communication
- Tool registration with input/output schemas

### 2. Tool Registration Pattern
- Modular tool registration via `registerAnalyticsTools()`
- Zod schema validation for type-safe inputs/outputs
- Structured content responses with both text and structured formats

### 3. External API Integration
- Wrapping third-party APIs (Twitter) in client classes
- Handling API responses and transforming data
- Error handling and data normalization

### 4. Code Organization
- Channel-based architecture (`channels/twitter/`)
- Separation of concerns (client logic vs. tool registration)
- Reusable tool registration functions

### Key Implementation Details

- **Tool Schemas**: Each tool defines input/output schemas using Zod for validation
- **Structured Responses**: Tools return both text and structured content for flexible consumption
- **Error Handling**: Basic error handling with fallback responses
- **Type Safety**: Full TypeScript coverage with proper type definitions

## Example Tool Usage

Once connected to an MCP client, tools can be invoked:

- "Get analytics for @username"
- "Show tweet performance for @username with 20 tweets"
- "How many tweets about #AI in the last 24 hours?"

## Reference Use Cases

This implementation is useful as a reference for:

- Building MCP servers from scratch
- Integrating social media APIs into MCP tools
- Implementing analytics tools with structured data
- Organizing multi-channel MCP servers
- Validating tool inputs/outputs with Zod
- Handling API responses and error cases

## License

ISC

