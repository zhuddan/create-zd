import fs from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

export async function deleteFileOrDir(path: string) {
  const stat = await fs.stat(path)
  if (stat.isDirectory()) {
    (await fs.readdir(path))
      .forEach((e) => {
        deleteFileOrDir(`${path}/${e}`)
      })
    await deleteDir(path)
  }
  else {
    await deleteFile(path)
  }
}
async function deleteFile(filePath: string) {
  await fs.unlink(filePath)
}

async function deleteDir(dirPath: string) {
  await fs.rmdir(dirPath)
}

export async function moveFiles(from: string, to: string) {
  const files = await fs.readdir(from)
  for (const file of files) {
    const oldPath = path.join(from, file)
    const newPath = path.join(to, file)
    const stats = await fs.stat(oldPath)
    if (stats.isDirectory()) {
      await moveDir(oldPath, newPath)
    }
    else {
      await fs.rename(oldPath, newPath)
    }
  }

  await fs.rmdir(from)
}

async function moveDir(src: string, dest: string) {
  const files = await fs.readdir(src)
  try {
    await fs.mkdir(dest, { recursive: true })
  }
  catch (error) {
    console.log('error', error)
  }

  for (const file of files) {
    const oldPath = path.join(src, file)
    const newPath = path.join(dest, file)
    const stats = await fs.stat(oldPath)
    if (stats.isDirectory()) {
      await moveDir(oldPath, newPath)
    }
    else {
      await fs.rename(oldPath, newPath)
    }
  }
  await fs.rmdir(src)
}

/**
 * 检查 目标目录 是不是空目录？
 */
export function isEmpty(dir: string) {
  if (!existsSync(dir)) {
    return true
  }

  const files = readdirSync(dir)
  if (files.length === 0) {
    return true
  }

  if (files.length === 1 && files[0] === '.git') {
    return true
  }
  return false
}
