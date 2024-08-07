import fs from 'node:fs'

export function changePackageName(packagePath: string, name: string) {
  const raw = fs.readFileSync(packagePath).toString()
  const json = raw.replace(/("name"\s*:\s*").+(")/, `$1${name}$2`)
  fs.writeFileSync(packagePath, json)
}
