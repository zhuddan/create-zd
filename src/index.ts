#!/usr/bin/env node
import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import { exec } from 'node:child_process'
import prompts from 'prompts'
import { bold, gray, lightCyan } from 'kolorist'
import { type Ora, ora } from './ora'

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
      message: '请输入项目名称:',
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
  ])
}
let loading: Ora

function sleep(t = 100) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, t)
  })
}

init()
  .then((result) => {
  // loading = ora(`${bold('正在创建模板...')}`).start()
    console.log('loading')
    // const root = path.join(cwd, result.projectName!)
    // const userAgent = process.env.npm_config_user_agent ?? ''
    // const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
    const url = `https://github.com/zhuddan/template-${result.templateType.type}`
    return Promise.all([execPromise(`git clone --depth 1 ${url} ${result.projectName}`), result.projectName])
  }).then((res) => {
    const cwd = process.cwd()
    const root = path.join(cwd, res[1])
    console.log('success')
  // loading.succeed(`${bold('模板创建完成！')}`)
  }).catch((e) => {
    console.log(e)
    process.exit(0)
  })

function execPromise(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error executing command: ${error.message}`))
        return
      }

      if (!stderr.includes('Cloning into')) {
        reject(new Error(`stderr: ${stderr}`))
        return
      }
      resolve(stdout)
    })
  })
}
