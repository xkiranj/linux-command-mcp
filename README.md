# Linux Command MCP (Model Context Protocol)

## Overview

Linux Command MCP is a remote command execution system built using the Model Context Protocol (MCP), allowing secure and standardized execution of Linux commands.

## Components

### Server (linux-command-mcp-server)
The server component responsible for executing Linux commands.

#### Features
- Execute shell commands
- List directory contents
- Secure command execution
- Stdio-based transport

#### Limitations
- Cannot execute interactive commands (e.g., sudo)
- Requires manual intervention for commands needing authentication

### Client (linux-command-mcp-client)
The client component for interacting with the Linux Command MCP server.

#### Features
- Direct command execution
- Support for shell commands
- Directory listing
- Simple and intuitive interface

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

Execute commands directly:
```bash
# In the client directory
npm start "ls -l"
npm start "list /home"
npm start "uname -a"
```

### Sudo Commands

**Important Note**: The Linux Command MCP server CANNOT execute interactive commands like `sudo`. 

When you need to run a sudo command:
1. Execute the command manually on the server
2. Copy and paste the output
3. Share the results with Claude

Example workflow:
- You: "Run sudo apt update"
- You would need to:
  1. SSH into the server
  2. Run `sudo apt update`
  3. Copy the output
  4. Share the output with Claude

## Security Considerations

- Only run this on trusted networks
- Limit access to the server
- Be cautious with command execution

## Troubleshooting

- Ensure PM2 is running: `pm2 list`
- Check server logs: `pm2 logs linux-command-mcp-server`
- Verify server and client builds

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Contact

xkiranj.1980@gmail.com
=======
# linux-command-mcp
MCP server and client for running Linux commands

