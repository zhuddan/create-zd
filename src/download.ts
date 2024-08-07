import https from 'node:https'
import fs from 'node:fs'
import { promisify } from 'node:util'
import unzipper from 'unzipper'
import { moveFiles } from './file'

// const rename = promisify(fs.rename)
// const readdir = promisify(fs.readdir)
// const stat = promisify(fs.stat)

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
