#!/usr/bin/env node
import process from 'node:process'
import path from 'node:path'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import prompts from 'prompts'
import { bold, gray, lightCyan, red } from 'kolorist'
import figures from 'prompts/lib/util/figures.js'
import * as p from '@clack/prompts'
import { type Ora, ora } from './utils/ora'
import { downloadTemplate } from './utils/download'
import { onCancel } from './utils/cancel'
import { deleteFileOrDir, isEmpty } from './utils/file'
import { changeHtmlTitle, changePackageName } from './utils/change'
import { capitalizeFirstLetter } from './utils/capitalizeFirstLetter'
import { printFinish } from './utils/printFinish'
import createVue from './create-vue'
import { HINT, frameworkOptions } from './constants'

// export const instructions = gray('使用↑↓选择，空格或←→选中，a全选，回车确认')
interface ITemplateType { type: string, htmlTitle?: boolean }

async function init() {
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

  return await p.group(
    {
      projectName: () => p.text({
        message: '请输入项目名称',
        initialValue: 'my-app',
      }),
      framework: ({ results }) => p.select({
        message: '请选择一个框架',
        options: frameworkOptions,
      }),
    },
    {
      onCancel: ({ results }) => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    },
  )
}

function shouldOverwrite() {
  return p.confirm({
    message: '文件已经存在, 是否覆盖文件夹?',
    initialValue: false,
    active: '是',
    inactive: '否',
  })
}

let loading: Ora

export async function main() {
  try {
    const { projectName, framework } = await init()
    const cwd = process.cwd()
    const root = path.join(cwd, projectName!)
    const userAgent = process.env.npm_config_user_agent ?? ''
    const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
    const overwrite = isEmpty(projectName)
      ? true
      : (await shouldOverwrite())

    if (overwrite) {
      if (!fs.existsSync(projectName)) {
        fs.mkdirSync(projectName)
      }
      else {
        fs.readdirSync(projectName).forEach((e) => {
          deleteFileOrDir(`${projectName}/${e}`)
        })
      }
      if (framework === 'vue') {
        await createVue()
      }
      // loading = ora(`${bold('正在下载模板...')}`).start()
      // await downloadTemplate(result.templateType.type, result.projectName)
      // changePackageName(`${result.projectName}/package.json`, `${result.projectName}`)
      // if ((result.templateType as ITemplateType).htmlTitle) {
      //   changeHtmlTitle(`${result.projectName}/index.html`, `${result.projectName}`)
      // }
      // loading.succeed('模板创建成功~')
      // printFinish(root, cwd, packageManager, loading)
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
