<script setup lang="ts">
import { ref } from 'vue'
const welcomeText = ref('欢迎体验MES系统')
</script>

<template>
  <div class="home">
    <div class="hero-section">
      <div class="content-wrapper">
        <div class="text-container">
          <h1 class="title">{{ welcomeText }}</h1>
          <p class="subtitle">智能制造的起点 - MES系统欢迎您</p>
          <a href="/loginview" class="cta-button">探索更多</a>
        </div>
      </div>
      <div class="background-overlay"></div>
    </div>
  </div>
</template>

<style scoped>
/* 重置默认边距并确保铺满 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.home {
  margin: 0;
  padding: 0;
  width: 100vw; /* 使用视窗宽度 */
  min-height: 100vh; /* 确保最低高度为视窗高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 固定定位确保铺满 */
  top: 0;
  left: 0;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 100vh; /* 完整视窗高度 */
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-container {
  text-align: center;
  color: white;
  padding: 2rem;
  animation: fadeIn 1s ease-in;
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  padding: 12px 32px;
  background-color: #00c853;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background-color: #00e676;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 200, 83, 0.3);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .cta-button {
    padding: 10px 24px;
    font-size: 1rem;
  }
}
</style>
