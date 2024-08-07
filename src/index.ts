#!/usr/bin/env node
import process from 'node:process'
import path from 'node:path'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import prompts from 'prompts'
import { bold, gray, lightCyan, red } from 'kolorist'
import figures from 'prompts/lib/util/figures.js'
import { type Ora, ora } from './ora'
import { downloadTemplate } from './download'
import { onCancel } from './cancel'
import { deleteFileOrDir } from './file'

export const instructions = gray('使用↑↓选择，空格或←→选中，a全选，回车确认')
export const hint = '使用↑↓选择，回车确认'

function init() {
  const text = 'ZD-CREATOR'

  let colorText = ''

  const startColor = { r: 0xE6, g: 0x7E, b: 0x22 }
  const endColor = { r: 0x34, g: 0x98, b: 0xDB }

  for (let i = 0; i < text.length; i++) {
    const ratio = i / (text.length - 1)
    const red = Math.round(startColor.r + (endColor.r - startColor.r) * ratio)
    const green = Math.round(startColor.g + (endColor.g - startColor.g) * ratio)
    const blue = Math.round(startColor.b + (endColor.b - startColor.b) * ratio)
    colorText += bold(`\x1B[38;2;${red};${green};${blue}m${text[i]}\x1B[0m`)
  }
  const output = process.stdout.isTTY && process.stdout.getColorDepth() > 8
    ? colorText
    : lightCyan(bold(text))

  console.log()
  console.log(output)
  console.log()
  return prompts([
    {
      name: 'projectName',
      type: 'text',
      message: '请输入项目名称:2',
      initial: 'zd-app',
    },
    {
      name: 'templateType',
      type: 'select',
      message: '请选择 uni-app 模板？',
      hint,
      choices: ['vue', 'react', 'vanilla'].map((type) => {
        return {
          title: type,
          value: { type },
        }
      }),
    },
  ], {
    onCancel,
  })
}

function shouldOverwrite() {
  return prompts({
    name: 'overwrite',
    type: 'toggle',
    message: '文件已经存在, 是否覆盖文件夹',
    initial: false,
    active: '是',
    inactive: '否',
  }, {
    onCancel,
  })
}

let loading: Ora

/**
 * 检查 目标目录 是不是空目录？
 */
function isEmpty(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(1)
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

async function start() {
  try {
    const result = await init()

    const overwrite = isEmpty(result.projectName)
      ? true
      : (await shouldOverwrite()).overwrite

    if (overwrite) {
      if (!fs.existsSync(result.projectName)) {
        fs.mkdirSync(result.projectName)
      }
      else {
        fs.readdirSync(result.projectName).forEach((e) => {
          deleteFileOrDir(`${result.projectName}/${e}`)
        })
      }
      loading = ora(`${bold('正在下载模板...')}`).start()
      await downloadTemplate(result.templateType.type, result.projectName)
      loading.succeed('模板创建成功~')
    }
    else {
      onCancel()
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    process.exit(0)
  }
}

start()
