import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import chokidar from "chokidar";

console.log("👀 Bun watcher running...");

chokidar.watch("./src", { ignoreInitial: true }).on("add", (filePath) => {
  if (!filePath.endsWith(".tsx")) return;

  const content = readFileSync(filePath, "utf-8");

  // Only fill empty files
  if (content.trim().length === 0) {
    const fileName = path.basename(filePath, ".tsx");

    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

    const template = `export default function ${componentName}() {
  return <div>${fileName}</div>
}
`;
    writeFileSync(filePath, template);
    console.log(`✅ Generated: ${fileName}.tsx`);
  }
});
