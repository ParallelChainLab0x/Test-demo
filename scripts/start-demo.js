const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const nodeOptions = [process.env.NODE_OPTIONS, "--openssl-legacy-provider"]
  .filter(Boolean)
  .join(" ");

const children = [];

function run(command, args, extraEnv) {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
    windowsHide: true,
  });
  children.push(child);
  child.on("exit", (code, signal) => {
    if (signal) return;
    shutdown(code || 0);
  });
  return child;
}

function shutdown(code) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run(process.execPath, ["app/index.js"]);
run(process.execPath, [path.join("node_modules", "react-scripts", "scripts", "start.js")], {
  NODE_OPTIONS: nodeOptions,
  BROWSER: "none",
  SKIP_PREFLIGHT_CHECK: "true",
});
