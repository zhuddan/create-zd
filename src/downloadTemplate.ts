import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'
import process from 'node:process'
import unzipper from 'unzipper'

const rename = promisify(fs.rename)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

export function downloadTemplate(templateName: string, targetName: string) {
  console.log(templateName, targetName)
  templateName = `template-${templateName}`
  return new Promise((resolve, reject) => {
    const url = `https://codeload.github.com/zhuddan/${templateName}/zip/refs/heads/master`
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      }
      const downloadPath = `${templateName}-${Date.now()}`
      res
        .pipe(unzipper.Extract({ path: `./${downloadPath}` }))
        .on('close', async () => {
          try {
            await moveFiles(`./${downloadPath}/${templateName}-master`, `./${targetName}`)
            fs.rmdirSync(downloadPath)
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

async function moveFiles(from: string, to: string) {
  const files = await readdir(from)
  for (const file of files) {
    const oldPath = path.join(from, file)
    const newPath = path.join(to, file)
    const stats = await stat(oldPath)
    if (stats.isDirectory()) {
      await moveDir(oldPath, newPath)
    }
    else {
      await rename(oldPath, newPath)
    }
  }

  fs.rmdirSync(from)
}

async function moveDir(src: string, dest: string) {
  const files = await readdir(src)
  try {
    fs.mkdirSync(dest, { recursive: true })
  }
  catch (error) {
    console.log('error', error)
  }

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
  fs.rmdirSync(src)
}

// function changePackageName(target: string) {
//   const cwd = process.cwd()
//   const packageFilePath = `${cwd}\\${target}\\package.json`
//   const s = fs.readFileSync(packageFilePath, 'utf-8')
//   console.log(s)
//   const packageName = JSON.parse(s)
//   packageName.name = target
//   fs.writeFileSync(packageFilePath, JSON.stringify(packageName, null, 2))
//   console.log('Download, extraction, and reorganization complete')
// }

// // 删除文件
// async function deleteFile(filePath: string) {
//   try {
//     fs.unlinkSync(filePath)
//     console.log('File deleted successfully.')
//   }
//   catch (error) {
//     console.error('Error deleting file:', error)
//   }
// }
