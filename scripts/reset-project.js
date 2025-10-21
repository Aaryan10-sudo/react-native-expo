#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathExists = async (p) => {
  try {
    await fs.promises.access(p);
    return true;
  } catch (e) {
    return false;
  }
};

// Copy directory recursively (Node >=16.7 has fs.cp; fallback to manual copy)
const copyDir = async (src, dest) => {
  if (!(await pathExists(src))) return;
  await fs.promises.mkdir(dest, { recursive: true });
  if (fs.promises.cp) {
    // Prefer native cp when available
    return fs.promises.cp(src, dest, { recursive: true });
  }

  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

// Copy directory but exclude specific absolute paths (useful to avoid copying the running script)
const copyDirExclude = async (src, dest, excludeAbsPaths = []) => {
  if (!(await pathExists(src))) return;
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    if (excludeAbsPaths.includes(srcPath)) continue;
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirExclude(srcPath, destPath, excludeAbsPaths);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

const moveWithFallback = async (oldDirPath, newDirPath, options = {}) => {
  // Ensure destination doesn't partially exist
  if (await pathExists(newDirPath)) {
    await fs.promises.rm(newDirPath, { recursive: true, force: true });
  }

  try {
    await fs.promises.rename(oldDirPath, newDirPath);
  } catch (err) {
    // On Windows, rename can fail with EPERM if files are locked or the directory is in use.
    // Fall back to copy + remove for robustness. Also handle cross-device EXDEV.
    if (err.code === "EPERM" || err.code === "EXDEV" || err.code === "EINVAL") {
      if (options.excludePaths && options.excludePaths.length) {
        await copyDirExclude(oldDirPath, newDirPath, options.excludePaths);
        // Don't remove source if it contains running script
        if (!options.skipRemove) {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
        }
      } else {
        await copyDir(oldDirPath, newDirPath);
        await fs.promises.rm(oldDirPath, { recursive: true, force: true });
      }
    } else {
      throw err;
    }
  }
};

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);

          // If the script being executed lives inside the directory we're trying to move (e.g. scripts),
          // avoid renaming/removing it as that will cause EPERM on Windows. Instead, copy contents except the running file
          // and leave the original in place so the running process isn't disturbed.
          if (dir === "scripts" && __filename.startsWith(oldDirPath)) {
            console.log(`⚠️ Detected running script inside /${dir}. Copying contents and skipping removal to avoid lock issues.`);
            const excludePaths = [__filename];
            await moveWithFallback(oldDirPath, newDirPath, { excludePaths, skipRemove: true });
            console.log(`➡️ /${dir} copied to /${exampleDir}/${dir}. Please remove /${dir} manually when it's safe.`);
          } else {
            await moveWithFallback(oldDirPath, newDirPath);
            console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
          }
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
