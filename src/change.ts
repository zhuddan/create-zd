import fs from 'node:fs'

export function changePackageName(packageJsonFilePath: string, name: string) {
  const raw = fs.readFileSync(packageJsonFilePath).toString()
  const res = raw.replace(/("name"\s*:\s*").+(")/, `$1${name}$2`)
  fs.writeFileSync(packageJsonFilePath, res)
}

export function changePackageTitle(envPath: string, name: string) {
  const raw = fs.readFileSync(envPath).toString()
  const res = raw.replace(/(VITE_APP_TILE\s*=\s*').+(')/, `$1${name}$2`)
  fs.writeFileSync(envPath, res)
}
