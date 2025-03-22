<template>
  <div class="not-found">
    <svg class="background-decoration" viewBox="0 0 600 505" preserveAspectRatio="xMidYMid meet">
      <g>
        <path
          class="cloud"
          d="M110,20 C105,20 100,15 100,10 C100,5 105,0 110,0 C115,0 120,5 120,10 C120,15 115,20 110,20 Z
          M130,25 C125,25 120,20 120,15 C120,10 125,5 130,5 C135,5 140,10 140,15 C140,20 135,25 130,25 Z"
          fill="#E6E5CE"
        />
        <path
          class="cloud"
          d="M450,30 C445,30 440,25 440,20 C440,15 445,10 450,10 C455,10 460,15 460,20 C460,25 455,30 450,30 Z"
          fill="#D6EDE7"
        />
      </g>
    </svg>

    <div class="not-found-container">
      <div class="content-wrapper">
        <div class="error-code">
          <span>4</span>
          <span class="circle">0</span>
          <span>4</span>
        </div>
        <div class="message">
          <h2>页面走丢了</h2>
          <p>抱歉，您寻找的页面似乎不存在或已移动</p>
        </div>
        <button @click="goHome" class="home-button">
          <span>返回首页</span>
          <svg class="arrow" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  console.log('goHome clicked')
  router.push('/homeview')
}
</script>

<style scoped>
.not-found {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed; /* 脱离 #app 的限制 */
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.not-found-container {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 60px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 90vw;
  width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: fadeIn 1s ease-in-out; /* 添加淡入动画 */
}

.background-decoration {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}

.cloud {
  animation: float 6s ease-in-out infinite;
}

.error-code {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.error-code span {
  font-size: 150px;
  font-weight: 700;
  color: #41b093;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: #ef918e;
  border-radius: 50%;
  color: white;
  animation: pulse 2s infinite;
}

.message {
  margin-bottom: 40px;
}

.message h2 {
  font-size: 40px;
  color: #184657;
  margin-bottom: 10px;
}

.message p {
  font-size: 20px;
  color: #666;
  line-height: 1.6;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 40px;
  background: #41b093;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-button:hover {
  background: #35907a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(65, 176, 147, 0.4);
}

.arrow {
  width: 20px;
  height: 20px;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 40px;
  }

  .error-code span {
    font-size: 80px;
  }

  .circle {
    width: 70px;
    height: 70px;
  }

  .message h2 {
    font-size: 24px;
  }

  .message p {
    font-size: 16px;
  }

  .home-button {
    padding: 12px 30px;
    font-size: 16px;
  }
}
</style>
