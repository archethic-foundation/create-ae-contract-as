#!/usr/bin/env node

import prompts from 'prompts'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

//
// === Args parser ===
//
function parseArgs() {
  const args = process.argv.slice(2)
  const result = {
    yes: false,
    name: "ae-contract",
    path: null,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "-y" || arg === "--yes") {
      result.yes = true
    } else if (arg === "--name" && args[i + 1]) {
      result.name = args[i + 1]
      i++
    } else if (arg === "--path" && args[i + 1]) {
      result.path = args[i + 1]
      i++
    }
  }

  if (!result.path) {
    result.path = path.join(process.cwd(), kebabCase(result.name))
  }

  return result
}

const args = parseArgs()
const TPL_DIR = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "tpl")

let projectName, root, confirmation

if (args.yes) {
  projectName = args.name
  root = args.path
  confirmation = true
} else {
  ({ projectName, root, confirmation } = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'Enter a project\'s name',
      initial: args.name
    },
    {
      type: "text",
      name: 'root',
      initial: prev => projectNameToPath(prev),
      message: 'Enter a path'
    },
    {
      type: 'confirm',
      name: 'confirmation',
      message: `Is this OK?`,
      initial: true
    }
  ]))
}

if (!confirmation) {
  console.log("Not OK. Aborting.")
  process.exit(-1)
}

createRoot(root)
createGitIgnore(root)
createPackageJSON(root, projectName)
createAssemblyDir(root)
createTestsDir(root)
createConfigFiles(root)

console.log(`

Done. Now run:

    cd ${root}
    npm install
    npm test
`)
process.exit(0)

//
// === Functions ===
//

function createRoot(root) {
  if (fs.existsSync(root)) {
    console.log("Path already existing. Aborting.")
    process.exit(-1)
  } else {
    fs.mkdirSync(root, { recursive: true })
  }
}

function createGitIgnore(root) {
  fs.writeFileSync(
    path.join(root, ".gitignore"),
    ["node_modules", ".DS_Store", "dist"].join("\n"),
  )
}

function createPackageJSON(root, projectName) {
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      "name": path.basename(root),
      "description": projectName,
      "version": "0.1.0",
      "type": "module",
      "scripts": {
        "build": "aewasm build",
        "test": "npm run build && vitest",
      },
      "dependencies": {
        "@archethicjs/ae-contract-as": "^1.0.0",
        "@archethicjs/ae-contract-test": "^1.0.0",
        "assemblyscript": "^0.27.29"
      },
      "devDependencies": {
        "visitor-as": "^0.11.4",
        "@types/node": "^22.1.0",
        "vitest": "^2.1.1",
        "typescript": "^5.5.4"
      },
      "overrides": {
        "assemblyscript": "$assemblyscript"
      }
    }, null, 2),
  )
}

function createAssemblyDir(root) {
  fs.mkdirSync(path.join(root, "assembly"))
  fs.writeFileSync(
    path.join(root, "assembly", "index.ts"),
    fs.readFileSync(path.join(TPL_DIR, "assembly", "index.ts")),
  )
  fs.writeFileSync(
    path.join(root, "assembly", "tsconfig.json"),
    fs.readFileSync(path.join(TPL_DIR, "assembly", "tsconfig.json")),
  )
}

function createTestsDir(root) {
  fs.mkdirSync(path.join(root, "tests"))
  fs.writeFileSync(
    path.join(root, "tests", "index.test.ts"),
    fs.readFileSync(path.join(TPL_DIR, "tests", "index.test.ts")),
  )
}

function createConfigFiles(root) {
  fs.writeFileSync(
    path.join(root, "asconfig.json"),
    fs.readFileSync(path.join(TPL_DIR, "asconfig.json")),
  )
  fs.writeFileSync(
    path.join(root, "tsconfig.json"),
    fs.readFileSync(path.join(TPL_DIR, "tsconfig.json")),
  )
}

function projectNameToPath(projectName) {
  return path.join(process.cwd(), kebabCase(projectName)).toString()
}

function kebabCase(string) {
  return string
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
