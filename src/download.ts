import https from 'node:https'
import fs from 'node:fs'
import unzipper from 'unzipper'
import { moveFiles } from './file'

export function downloadTemplate(templateName: string, targetName: string) {
  templateName = `template-${templateName}`
  return new Promise((resolve, reject) => {
    const url = `https://codeload.github.com/zhuddan/${templateName}/zip/refs/heads/master?t=${Date.now()}`
    const _req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request Failed. Status Code: ${res.statusCode}`))
      }

      const downloadPath = `${templateName}-${Date.now()}-${Math.random()}`
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

    _req.setTimeout(30000, () => { // 设置超时时间为30秒
      _req.destroy() // 终止请求
      reject(new Error('Request timed out'))
    })
  })
}
