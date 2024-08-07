import fs from 'node:fs'

export async function deleteFileOrDir(path: string) {
  const stat = fs.statSync(path)
  if (stat.isDirectory()) {
    fs.readdirSync(path)
      .forEach((e) => {
        deleteFileOrDir(`${path}/${e}`)
      })
    deleteDir(path)
  }
  else {
    deleteFile(path)
  }
}
function deleteFile(filePath: string) {
  fs.unlinkSync(filePath)
}

function deleteDir(dirPath: string) {
  fs.rmdirSync(dirPath)
}
