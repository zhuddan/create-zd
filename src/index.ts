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
import { deleteFileOrDir, isEmpty } from './file'
import { changePackageName, changePackageTitle } from './change'
import { capitalizeFirstLetter } from './utils'
import { printFinish } from './printFinish'

// export const instructions = gray('使用↑↓选择，空格或←→选中，a全选，回车确认')
export const hint = '使用↑↓选择，回车确认'

function init() {
  const text = 'ZD-CREATOR'

  let colorText = ''

  const startColor = { r: 0x3B, g: 0xD1, b: 0x91 }
  const endColor = { r: 0x2B, g: 0x4C, b: 0xEE }

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
      message: '请输入项目名称:',
      initial: 'my-app',
    },
    {
      name: 'templateType',
      type: 'select',
      message: '请选择模板?',
      hint,
      choices: [
        {
          title: 'vue',
          value: { type: 'template-vue' },
        },
        {
          title: 'react',
          value: { type: 'template-react' },
        },
        {
          title: 'uni-app',
          value: { type: 'template-uni-app' },
        },
        {
          title: 'vanilla',
          value: { type: 'template-vanilla' },
        },
      ],
    },
  ], { onCancel })
}

function shouldOverwrite() {
  return prompts({
    name: 'overwrite',
    type: 'toggle',
    message: '文件已经存在, 是否覆盖文件夹?',
    initial: false,
    active: '是',
    inactive: '否',
  }, { onCancel })
}

let loading: Ora

async function start() {
  try {
    const result = await init()
    // const { title } = await prompts({
    //   name: 'title',
    //   type: 'text',
    //   message: '请输入项目标题:',
    //   initial: result.templateType.type === 'template-vanilla'
    //     ? 'My-App'
    //     : `My-${capitalizeFirstLetter(result.templateType.type)}-App`,
    // })

    const cwd = process.cwd()
    const root = path.join(cwd, result.projectName!)
    const userAgent = process.env.npm_config_user_agent ?? ''
    const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

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
      changePackageName(`${result.projectName}/package.json`, `${result.projectName}`)
      // changePackageTitle(`${result.projectName}/.env`, title)
      loading.succeed('模板创建成功~')
      printFinish(root, cwd, packageManager, loading)
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
