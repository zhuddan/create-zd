import process from 'node:process'
import * as p from '@clack/prompts'

export default async function createVue() {
  const group = await p.group(
    {
      router: () => p.select({
        message: '是否使用 vue-router ?',
        options: [
          { label: '不使用', value: 'none' },
          { label: 'unplugin-vue-router (文件系统路由,推荐)', value: 'vue-router' },
          { label: 'vue-router', value: 'vue-router' },
        ],
      }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    },
  )
  console.log(group)

  return group
}
