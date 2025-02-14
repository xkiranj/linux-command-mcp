module.exports = {
  apps: [{
    name: "linux-command-mcp-server",
    script: "./dist/index.js",
    watch: false,
    env: {
      NODE_ENV: "production"
    },
    // Ensure the interpreter is set to node
    interpreter: "/usr/bin/node"
  }]
};
