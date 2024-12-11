import fs from 'node:fs'
import path from 'node:path'

export function deleteFileOrDir(filePath: string) {
  try {
    const stat = fs.lstatSync(filePath) // 使用 lstat 来获取符号链接的状态

    if (stat.isDirectory()) {
      const files = fs.readdirSync(filePath)
      for (const file of files) {
        const fullPath = path.join(filePath, file)
        deleteFileOrDir(fullPath)
      }
      fs.rmdirSync(filePath)
    }
    else if (stat.isSymbolicLink()) {
      // 如果是符号链接，直接删除它
      fs.unlinkSync(filePath)
    }
    else {
      fs.unlinkSync(filePath)
    }
  }
  catch (error) {
    console.error(`删除 ${filePath} 时出错:`, (error as any).message)
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  }
  else {
    fs.copyFileSync(src, dest)
  }
}

/**
 * 检查 目标目录 是不是空目录？
 */
export function isEmpty(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }

  if (files.length === 1 && files[0] === '.git') {
    return true
  }
  return false
}
