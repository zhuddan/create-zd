import fs, { copyFileSync } from 'node:fs'

export function changePackageName(packageJsonFilePath: string, name: string) {
  const raw = fs.readFileSync(packageJsonFilePath).toString()
  const res = raw.replace(/("name"\s*:\s*").+(")/, `$1${name}$2`)
  fs.writeFileSync(packageJsonFilePath, res)
}

export function changeHtmlTitle(html: string, name: string) {
  console.log({ html, name })
  const raw = fs.readFileSync(html).toString()
  const res = raw.replace(/<title>.*?<\/title>/i, `<title>${name}</title>`)
  fs.writeFileSync(html, res)
}
