<script setup lang="ts" generic="T extends any, O extends any">
import { useAppStore } from '~/store/app'

defineOptions({
  name: 'IndexPage',
})

const { reduce, increase } = useAppStore()

const name = ref('')

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
</script>

<template>
  <div>
    <div i-carbon-campsite inline-block text-4xl />
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse-lite" target="_blank">
        Vitesse Lite
      </a>
    </p>
    <p>
      <em text-sm op75>Opinionated Vite Starter Template</em>
    </p>

    <div py-4 />

    <TheInput
      v-model="name"
      placeholder="What's your name?"
      autocomplete="false"
      @keydown.enter="go"
    />

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!name"
        @click="go"
      >
        Go
      </button>
      <button
        class="m-3 text-sm btn"
        @click="reduce()"
      >
        reduce
      </button>
      <button
        class="m-3 text-sm btn"
        @click="increase()"
      >
        increase
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
  meta:
    layout: home
    bgColor: yellow
</route>
