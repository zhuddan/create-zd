import fs from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

export async function deleteFileOrDir(filePath: string) {
  try {
    const stat = await fs.lstat(filePath) // 使用 lstat 来获取符号链接的状态

    if (stat.isDirectory()) {
      const files = await fs.readdir(filePath)
      for (const file of files) {
        const fullPath = path.join(filePath, file)
        await deleteFileOrDir(fullPath)
      }
      await fs.rmdir(filePath)
    }
    else if (stat.isSymbolicLink()) {
      // 如果是符号链接，直接删除它
      await fs.unlink(filePath)
    }
    else {
      await fs.unlink(filePath)
    }
  }
  catch (error) {
    console.error(`删除 ${filePath} 时出错:`, (error as any).message)
  }
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
