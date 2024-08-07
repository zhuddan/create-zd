import fs from 'node:fs'
import path from 'node:path'

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

export function moveFiles(from: string, to: string) {
  const files = fs.readdirSync(from)
  for (const file of files) {
    const oldPath = path.join(from, file)
    const newPath = path.join(to, file)
    const stats = fs.statSync(oldPath)
    if (stats.isDirectory()) {
      moveDir(oldPath, newPath)
    }
    else {
      fs.renameSync(oldPath, newPath)
    }
  }

  fs.rmdirSync(from)
}

function moveDir(src: string, dest: string) {
  const files = fs.readdirSync(src)
  try {
    fs.mkdirSync(dest, { recursive: true })
  }
  catch (error) {
    console.log('error', error)
  }

  for (const file of files) {
    const oldPath = path.join(src, file)
    const newPath = path.join(dest, file)
    const stats = fs.statSync(oldPath)
    if (stats.isDirectory()) {
      moveDir(oldPath, newPath)
    }
    else {
      fs.renameSync(oldPath, newPath)
    }
  }
  fs.rmdirSync(src)
}
