export default {
  apps: [{
    name: "linux-command-mcp-server",
    script: "./dist/index.js",
    watch: false,
    env: {
      NODE_ENV: "production"
    }
  }]
};
