import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

// Promisify exec for async/await
const execAsync = promisify(exec);

// Create a new MCP server
const server = new McpServer({
  name: "Linux Command Server",
  version: "1.0.0",
  description: "Unrestricted MCP server for executing Linux commands"
});

// Define a tool for executing commands
server.tool("execute-command", 
  { 
    command: z.string(),
    timeout: z.number().optional().default(10000),
    cwd: z.string().optional().default(process.cwd())
  },
  async ({ command, timeout, cwd }) => {
    try {
      // Execute the command without restrictions
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        cwd
      });

      // Return the result in a standardized format
      return {
        content: [
          { 
            type: "text", 
            text: stdout.trim() || stderr.trim() || "Command executed successfully" 
          }
        ]
      };
    } catch (error) {
      // Handle execution errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Command execution failed";
      
      return {
        content: [
          { 
            type: "text", 
            text: errorMessage 
          }
        ]
      };
    }
  }
);

// Define a resource for listing directory contents
server.resource(
  "list-directory",
  "file://{directory}",
  async (uri, parameters) => {
    try {
      // Use a parameter schema to validate and extract the directory
      const DirectorySchema = z.object({
        directory: z.string().optional().default(process.cwd())
      });

      // Parse the parameters
      const { directory } = DirectorySchema.parse(parameters);

      // Execute ls command to list directory contents
      const { stdout } = await execAsync(`ls -la "${directory}"`);

      return {
        contents: [
          {
            uri: uri.href,
            text: stdout.trim()
          }
        ]
      };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to list directory";
      
      return {
        contents: [
          {
            uri: uri.href,
            text: errorMessage
          }
        ]
      };
    }
  }
);

// Async main function to start the server
async function main() {
  try {
    // Use stdio transport to start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    // Log server start (this will be sent to stderr)
    console.error("Linux Command MCP Server started successfully");
  } catch (error) {
    // Log any startup errors
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Run the server
main();
