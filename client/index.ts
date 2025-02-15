import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Hardcoded absolute path to the server executable
const SERVER_PATH = '/home/kiran/linux-command-mcp/server/dist/index.js';

async function executeCommand(client: Client, command: string) {
  try {
    const execResult = await client.callTool({
      name: 'execute-command',
      arguments: { 
        command: command 
      }
    });
    
    if (execResult && typeof execResult === 'object' && 'content' in execResult) {
      const output = (execResult.content as Array<{type: string, text: string}>)
        .filter(c => c.type === 'text')
        .map(c => c.text)
        .join('\n');
      
      console.log(output);
    }
  } catch (error) {
    console.error('Error executing command:', error);
  }
}

async function listDirectory(client: Client, directory?: string) {
  try {
    const listResult = await client.readResource({
      uri: `directory://${directory || ''}`,
      arguments: { 
        path: directory || process.cwd() 
      }
    });
    
    if (listResult && 'contents' in listResult) {
      console.log(
        (listResult.contents as Array<{text: string}>)
          .map(c => c.text)
          .join('\n')
      );
    }
  } catch (error) {
    console.error('Error listing directory:', error);
  }
}

async function main() {
  // Verify server file exists and is executable
  try {
    fs.accessSync(SERVER_PATH, fs.constants.F_OK | fs.constants.X_OK);
  } catch (error) {
    console.error(`Server executable not found or not executable at: ${SERVER_PATH}`, error);
    process.exit(1);
  }

  const transport = new StdioClientTransport({ 
    command: SERVER_PATH 
  });

  const client = new Client({
    name: 'linux-command-client',
    version: '1.0.0'
  });

  try {
    await client.connect(transport);
  } catch (error) {
    console.error('Failed to connect to server:', error);
    process.exit(1);
  }

  // If arguments are provided, execute them directly
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    const command = args.join(' ');
    
    if (command.startsWith('list ')) {
      // If command starts with 'list ', treat it as a directory listing
      const directory = command.slice(5).trim();
      await listDirectory(client, directory);
    } else {
      // Otherwise, execute as a shell command
      await executeCommand(client, command);
    }
    
    process.exit(0);
  } else {
    console.log('Linux Command MCP Client');
    console.log('Usage:');
    console.log('- Execute commands: npm start "<command>"');
    console.log('- List directory: npm start "list [directory]"');
    console.log('Example:');
    console.log('- npm start "ls -l"');
    console.log('- npm start "list /home"');
  }
}

main().catch(console.error);
