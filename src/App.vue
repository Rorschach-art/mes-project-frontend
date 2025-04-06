<template>
  <router-view />
</template>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useAuthStore } from './stores/counter'
const counterStore = useAuthStore() // 引入store
console.log('登录状态', counterStore)
useHead({
  // 页面标题
  title: () => (counterStore.isLogin ? 'Mes系统' : '请登录'),
  link: [
    {
      rel: 'icon',
      href: () => (counterStore.isLogin ? '/Mes.ico' : '/Login.ico'),
    },
  ],
})
</script>
