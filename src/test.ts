import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import process from 'node:process'
import unzipper from 'unzipper'

const rename = promisify(fs.rename)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

export function get(templateName: string, targetName: string) {
  if (fs.existsSync(targetName)) {
    deleteFile(targetName)
  }
  return new Promise((resolve, reject) => {
    const url = `https://codeload.github.com/zhuddan/${templateName}/zip/refs/heads/master`
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      }
      res
        .pipe(unzipper.Extract({ path: `./${templateName}` }))
        .on('close', async () => {
          try {
            await moveFiles(templateName)
            console.log(targetName)
            rename(templateName, targetName)
            resolve('')
          }
          catch (error) {
            reject(error)
          }
        })
        .on('error', reject)
    }).on('error', reject)
  })
}

async function moveFiles(name: string) {
  const nestedDir = path.join(`./${name}`, `${name}-master`)
  const files = await readdir(nestedDir)

  for (const file of files) {
    const oldPath = path.join(nestedDir, file)
    const newPath = path.join(`./${name}`, file)

    const stats = await stat(oldPath)
    if (stats.isDirectory()) {
      await moveDir(oldPath, newPath)
    }
    else {
      await rename(oldPath, newPath)
    }
  }

  fs.rmdirSync(nestedDir, { recursive: true })
}

async function moveDir(src: string, dest: string) {
  const files = await readdir(src)
  await fs.promises.mkdir(dest, { recursive: true })

  for (const file of files) {
    const oldPath = path.join(src, file)
    const newPath = path.join(dest, file)

    const stats = await stat(oldPath)
    if (stats.isDirectory()) {
      await moveDir(oldPath, newPath)
    }
    else {
      await rename(oldPath, newPath)
    }
  }

  fs.rmdirSync(src, { recursive: true })
}

const o = `output-1722702872026`
console.log(123456)
get('template-vanilla', o)
  .then(() => {
    changePackageName(o)
  })
  .catch((err) => {
    console.error('Error:', err)
  })

function changePackageName(target: string) {
  const cwd = process.cwd()
  const packageFilePath = `${cwd}\\${target}\\package.json`
  const s = fs.readFileSync(packageFilePath, 'utf-8')
  console.log(s)
  const packageName = JSON.parse(s)
  packageName.name = target
  fs.writeFileSync(packageFilePath, JSON.stringify(packageName, null, 2))
  console.log('Download, extraction, and reorganization complete')
}

// 删除文件
async function deleteFile(filePath: string) {
  try {
    await fs.unlinkSync(filePath)
    console.log('File deleted successfully.')
  }
  catch (error) {
    console.error('Error deleting file:', error)
  }
}
