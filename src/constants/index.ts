import * as c from 'kolorist'

export const HINT = '使用↑↓选择，回车确认'

export interface PromItem<T> {
  label: string
  value: T
  hint?: string
}

export type FrameworkOption = 'vue' | 'react'

export const frameworkOptions: PromItem<FrameworkOption>[] = [
  {
    label: c.green('Vue'),
    value: 'vue',
  },
  {
    label: c.cyan('React'),
    value: 'react',
  },
]
