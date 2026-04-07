import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetComponents = [
  "AnimatedIcon",
  "ThemeToggle",
  "MiniBarChart",
  "BottomNav",
  "SplashScreen",
  "CircularProgress",
  "WaterFlowAnimation",
  "NavLink"
];

function fixImports() {
  const root = "./src";
  walk(root, (filepath) => {
    if (filepath.endsWith(".tsx") || filepath.endsWith(".ts")) {
      let content = fs.readFileSync(filepath, 'utf8');
      let changed = false;
      targetComponents.forEach(comp => {
        const regex = new RegExp(`@/components/${comp}`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, `@/components/ui/${comp}`);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log("Fixed", filepath);
      }
    }
  });
}

fixImports();
