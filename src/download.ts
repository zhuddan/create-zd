import https from 'node:https'
import fs from 'node:fs'
import unzipper from 'unzipper'
import { deleteFileOrDir, moveFiles } from './file'

export function downloadTemplate(templateName: string, targetName: string) {
  return new Promise((resolve, reject) => {
    const url = `https://codeload.github.com/zhuddan/${templateName}/zip/refs/heads/master?t=${Date.now()}`
    const _req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      }
      const downloadPath = `${templateName}-${Date.now()}-${Math.random()}`
      const zipFilePath = `${templateName}-${Date.now()}-${Math.random()}.zip`
      const file = fs.createWriteStream(zipFilePath)
      res.pipe(file)
      res.on('close', async () => {
        const directory = await unzipper.Open.file(zipFilePath)
        await directory.extract({ path: `./${downloadPath}` })
        await moveFiles(`./${downloadPath}/${templateName}-master`, `./${targetName}`)
        await deleteFileOrDir(zipFilePath)
        await deleteFileOrDir(downloadPath)
        resolve('')
      })
    }).on('error', reject)
    _req.setTimeout(30000, () => { // 设置超时时间为30秒
      _req.destroy() // 终止请求
      reject(new Error('Request timed out'))
    })
  })
}
