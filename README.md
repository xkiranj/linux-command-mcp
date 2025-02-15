# Linux Command MCP (Model Context Protocol)

## Overview

Linux Command MCP is a remote command execution system built using the Model Context Protocol (MCP), allowing secure and standardized execution of Linux commands.

## Configuration for Claude Desktop MCP Servers

### Understanding the Configuration

The MCP servers are configured in the `claude_desktop_config.json` file, typically located at `~/.config/Claude/claude_desktop_config.json`.

#### Configuration Structure

```json
"mcpServers": {
  "server-name": {
    "command": "node|npx|uvx",
    "args": ["server-specific-arguments"],
    "env": {
      "OPTIONAL_ENVIRONMENT_VARIABLES": "value"
    }
  }
}
```

### Linux Command MCP Server Configuration

```json
"linux-command": {
  "command": "node",
  "args": [
    "/full/path/to/linux-command-mcp/server/dist/index.js"
  ]
}
```

#### Configuration Explained
- `"command"`: Specifies the executor (`node`, `npx`, `uvx`)
- `"args"`: Full path to the server's executable
- Ensure the path is an absolute path to your `index.js`

### Important Configuration Tips
- Always use full, absolute paths
- Verify file permissions
- Ensure the specified file is executable

## Prerequisites

- Node.js (v18.x or later)
- npm
- PM2 (for process management)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd linux-command-mcp
```

2. Install server dependencies
```bash
cd server
npm install
npm run build
```

3. Install client dependencies
```bash
cd ../client
npm install
npm run build
```

## Usage

### Starting the Server

1. Navigate to the server directory
```bash
cd server
```

2. Start with PM2
```bash
npm run pm2:start
```

### Using the Client

Available Commands:
1. exec <command>   - Execute a Linux command
2. list [directory] - List directory contents
3. help             - Show this help
4. exit             - Exit the client

Execute commands directly:
```bash
# In the client directory
npm start 
exec "ls -l"
exec "list /home"
exec "uname -a"
```

### Sudo Commands

**Important Note**: The Linux Command MCP server CANNOT execute interactive commands like `sudo`. 

When you need to run a sudo command:
1. Execute the command manually on the server
2. Copy and paste the output
3. Share the results

## Troubleshooting

- Ensure PM2 is running: `pm2 list`
- Check server logs: `pm2 logs linux-command-mcp-server`
- Verify server and client builds

## Using Linux Commands in Claude Desktop

### Example Interactions

Here are some safe, generic examples of how you can ask Claude to run Linux commands:

1. **Check System Information**
   - "Can you show me the Linux kernel version?"
   ```
   $ uname -r
   ```

2. **List Directory Contents**
   - "Show me the contents of the home directory"
   ```
   $ ls ~
   ```

3. **Check Available Disk Space**
   - "What's the disk usage on this system?"
   ```
   $ df -h
   ```

4. **View System Uptime**
   - "How long has this system been running?"
   ```
   $ uptime
   ```

5. **Check Network Interfaces**
   - "What network interfaces are available?"
   ```
   $ ip addr
   ```

6. **System Memory Information**
   - "Can you show me the memory usage?"
   ```
   $ free -h
   ```

### Important Usage Guidelines

- **Privacy**: Only run commands that do not reveal sensitive information
- **Safety**: Avoid commands that modify system configuration
- **Scope**: Focus on informational and diagnostic commands

### What to Avoid

❌ Do NOT run commands that:
- Reveal personal file names or paths
- Contain sensitive system configurations
- Modify system settings
- Require sudo or root permissions

### Example Conversation

**User**: "Can you check the Linux kernel version?"

**Claude**: Certainly! I'll run the command to show the Linux kernel version.

```
$ uname -r
5.15.0-91-generic
```

This kernel is running Ubuntu 22.04.3 LTS.

## Security Considerations

- Only run this on trusted networks
- Limit access to the server
- Be cautious with command execution

## Security and Best Practices

- Always be mindful of the information you're requesting
- Use commands that provide system-level, non-sensitive information
- When in doubt, ask Claude to clarify the command's purpose

## Contributing

Improve and expand the Linux Command MCP by:
- Adding more safe, generic command examples
- Enhancing documentation
- Suggesting improvements to command execution

## License

MIT license

## Contact

- Email: xkiranj.1980@gmail.com
- Blockchain: 0xkiran.eth

	- Ethereum: 0x67F367edb83d8fdF48E7E7Cfcb35183e746c292c	
	- Bitcoin: bc1q688np092y8raxag5e6573chrcgck5756yv476v
