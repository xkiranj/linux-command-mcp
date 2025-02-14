import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';

// Path to the server executable
const SERVER_PATH = '/home/kiran/linux-command-mcp/server/dist/index.js';

// Define schemas for input and result validation
const ExecuteCommandSchema = z.object({
  command: z.string(),
  timeout: z.number().optional(),
  cwd: z.string().optional()
});

const ResultContentSchema = z.object({
  type: z.literal('text'),
  text: z.string()
});

async function main() {
  // Create stdio transport 
  const transport = new StdioClientTransport({
    command: SERVER_PATH
  });

  // Create the client
  const client = new Client({
    name: 'linux-command-client',
    version: '1.0.0'
  });

  // Connect to the server
  await client.connect(transport);

  // Execute a command
  async function executeCommand(command: string, options?: { 
    timeout?: number, 
    cwd?: string 
  }) {
    try {
      const result = await client.callTool({
        name: 'execute-command',
        method: 'execute-command',
        arguments: {
          command,
          ...(options?.timeout && { timeout: options.timeout }),
          ...(options?.cwd && { cwd: options.cwd })
        }
      });

      // Validate and extract text content
      if (typeof result === 'object' && result !== null && 'content' in result) {
        const content = result.content;
        if (Array.isArray(content)) {
          return content
            .filter(item => ResultContentSchema.safeParse(item).success)
            .map(item => (item as { text: string }).text)
            .join('\n');
        }
      }

      return 'No text content found';
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  // List directory contents
  async function listDirectory(directory?: string) {
    try {
      const uri = new URL(`file://${directory || '.'}`);
      
      const result = await client.readResource({
        uri: uri.href
      });

      // Validate and extract text content
      if (result && 'contents' in result && Array.isArray(result.contents)) {
        return result.contents
          .filter(item => typeof item === 'object' && item !== null && 'text' in item)
          .map(item => (item as { text: string }).text)
          .join('\n');
      }

      return 'No directory contents found';
    } catch (error) {
      console.error('Error listing directory:', error);
      throw error;
    }
  }

  // Example usage and REPL-like interaction
  async function runInteractiveSession() {
    try {
      console.log('Linux Command MCP Client');
      console.log('Available commands:');
      console.log('1. execute <command>');
      console.log('2. list [directory]');
      console.log('3. exit');

      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'MCP> '
      });

      rl.prompt();

      rl.on('line', async (line) => {
        const [command, ...args] = line.trim().split(' ');
        
        try {
          switch (command) {
            case 'execute':
              const executeResult = await executeCommand(args.join(' '));
              console.log(executeResult);
              break;
            case 'list':
              const listResult = await listDirectory(args[0]);
              console.log(listResult);
              break;
            case 'exit':
              rl.close();
              return;
            default:
              console.log('Unknown command. Use "execute", "list", or "exit".');
          }
        } catch (error) {
          console.error('Error:', error);
        }

        rl.prompt();
      }).on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
      });
    } catch (error) {
      console.error('Failed to start interactive session:', error);
    }
  }

  // Run the interactive session
  await runInteractiveSession();
}

// Run the main function
main().catch(console.error);
