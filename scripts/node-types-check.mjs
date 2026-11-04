// Fails when the @types/node major differs from the Node major pinned in mise.toml.
//
// Mismatched, the type-checker accepts APIs the runtime lacks. Dependabot only ever proposes the
// @types/node half of a Node upgrade, so its major bumps fail here until mise.toml moves with them.

import { readFile } from 'node:fs/promises'

const miseToml = await readFile('mise.toml', 'utf-8')
const packageJson = JSON.parse(await readFile('package.json', 'utf-8'))

const miseNodeMajor = miseToml.match(/^node\s*=\s*"(\d+)/m)?.[1]
const typesNodeMajor = packageJson.devDependencies?.['@types/node']?.match(/^\D*(\d+)/)?.[1]

if (!miseNodeMajor || !typesNodeMajor) {
  console.error(`Could not read both majors: mise.toml node ${miseNodeMajor}, @types/node ${typesNodeMajor}.`)
  process.exit(1)
}

if (miseNodeMajor !== typesNodeMajor) {
  console.error(
    `@types/node is on ${typesNodeMajor} but mise.toml pins Node ${miseNodeMajor}. Move both in one pull request, and only once the Node that runs the tool in CI pipelines has moved too.`
  )
  process.exit(1)
}

console.log(`PASS: @types/node and mise.toml are both on Node ${miseNodeMajor}.`)
