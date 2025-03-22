# 一些特别的依赖包的安装

## 安装@vueuse/head依赖包

```bash
npm install @vueuse/head
```

### 作用

用于动态设置网页标题，网页图标等，并且符合vue3的规范。

## 使用@vueuse/head依赖包

### 在 main.ts 中配置

```ts
import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'

const app = createApp(App)
const head = createHead()
app.use(head)
app.mount('#app')
```

### 在组件中使用

```vue
<template>
  <div>
    <h1>欢迎</h1>
    <button @click="toggleLogin">{{ isLoggedIn ? '登出' : '登录' }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

const isLoggedIn = ref(false)

const toggleLogin = () => {
  isLoggedIn.value = !isLoggedIn.value
}

useHead({
  link: [
    {
      rel: 'icon',
      href: () => (isLoggedIn.value ? '/Mes.ico' : '/Login.ico'),
    },
  ],
})
</script>
```
