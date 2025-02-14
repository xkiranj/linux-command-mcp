#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function main() {
  const server = new McpServer({
    name: 'linux-command-server',
    version: '1.0.0'
  });

  // Tool for executing Linux commands
  server.tool(
    'execute-command', 
    {
      command: z.string(),
      cwd: z.string().optional(),
      timeout: z.number().optional().default(30000)
    },
    async (input) => {
      try {
        const { command, cwd, timeout } = input;
        const { stdout, stderr } = await execAsync(command, {
          cwd: cwd || process.cwd(),
          timeout
        });

        return {
          content: [
            { type: 'text', text: stdout.trim() },
            { type: 'text', text: stderr.trim() }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            { 
              type: 'text', 
              text: `Error executing command: ${error.message || String(error)}` 
            }
          ]
        };
      }
    }
  );

  // Resource for listing directory contents
  server.resource(
    'list-directory',
    new ResourceTemplate('directory://{path?}', {
      list: async () => ({
        resources: [{
          name: 'Directory List',
          uri: 'directory://.',
          description: 'List of files and directories'
        }],
        nextCursor: undefined
      })
    }),
    async (uri, params: { path?: string }) => {
      try {
        const dirPath = params.path ? path.resolve(params.path) : process.cwd();
        const files = await fs.readdir(dirPath, { withFileTypes: true });

        const fileList = files.map(file => ({
          uri: `file://${path.join(dirPath, file.name)}`,
          text: file.isDirectory() ? `📁 ${file.name}` : `📄 ${file.name}`
        }));

        return { 
          contents: fileList,
          _meta: { path: dirPath }
        };
      } catch (error: any) {
        return {
          contents: [{
            uri: uri.href,
            text: `Error listing directory: ${error.message || String(error)}`
          }]
        };
      }
    }
  );

  // Transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Linux Command MCP Server is running...');
}

main().catch(console.error);
