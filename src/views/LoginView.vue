<template>
  <div class="login-page">
    <!-- 背景浮动元素 -->
    <div v-for="i in 12" :key="i" :class="`background-element element${i}`"></div>

    <!-- 登录卡片 -->
    <div class="card">
      <div class="card-left">
        <div class="left-background">
          <div class="particle" v-for="n in 8" :key="n" :class="`particle-${n}`"></div>
          <div class="core-glow"></div>
          <div class="ripple-circle"></div>
          <div class="ripple-circle ripple-delay"></div>
          <div class="rotating-ring"></div>
        </div>
      </div>
      <div class="card-right">
        <div class="login-content">
          <button
            class="login-button"
            @mouseover="hover = true"
            @mouseleave="mouseleaveHandler"
            @mousedown="active = true"
            @mouseup="active = false"
          >
            登录
            <svg class="arrow" viewBox="0 0 24 24" :class="{ 'arrow-hover': hover }">
              <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      hover: false,
      active: false,
    }
  },
  methods: {
    mouseleaveHandler() {
      this.hover = false
      this.active = false
    },
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #b3d4fc 0%, #dbe9ff 100%);
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
  font-family: Arial, sans-serif;
  position: relative;
}

/* 背景浮动元素 */
.background-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: float 8s infinite ease-in-out;
}

.element1 {
  width: 7vw;
  height: 7vw;
  top: 5vh;
  left: 10vw;
  animation-delay: 0s;
}
.element2 {
  width: 5vw;
  height: 5vw;
  top: 85vh;
  left: 85vw;
  animation-delay: 1s;
}
.element3 {
  width: 9vw;
  height: 9vw;
  top: 60vh;
  left: 15vw;
  animation-delay: 2s;
}
.element4 {
  width: 6vw;
  height: 6vw;
  top: 25vh;
  left: 75vw;
  animation-delay: 0.5s;
}
.element5 {
  width: 8vw;
  height: 8vw;
  top: 75vh;
  left: 35vw;
  animation-delay: 1.5s;
}
.element6 {
  width: 4vw;
  height: 4vw;
  top: 15vh;
  left: 95vw;
  animation-delay: 3s;
}
.element7 {
  width: 5.5vw;
  height: 5.5vw;
  top: 45vh;
  left: 55vw;
  animation-delay: 2.5s;
}
.element8 {
  width: 6.5vw;
  height: 6.5vw;
  top: 35vh;
  left: 25vw;
  animation-delay: 4s;
}
.element9 {
  width: 4.5vw;
  height: 4.5vw;
  top: 95vh;
  left: 65vw;
  animation-delay: 3.5s;
}
.element10 {
  width: 7.5vw;
  height: 7.5vw;
  top: 20vh;
  left: 45vw;
  animation-delay: 1.2s;
}
.element11 {
  width: 3.5vw;
  height: 3.5vw;
  top: 70vh;
  left: 5vw;
  animation-delay: 2.8s;
}
.element12 {
  width: 6vw;
  height: 6vw;
  top: 50vh;
  left: 80vw;
  animation-delay: 0.8s;
}

/* 卡片样式 */
.card {
  width: 800px;
  height: 500px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: cardPop 1s ease-out;
  display: flex;
  position: fixed;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
}

.card-left {
  width: 40%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #4c6ef4, #a3c1ff);
}

.left-background {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 粒子效果 */
.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: particleMove 6s infinite linear;
}

.particle-1 {
  width: 8px;
  height: 8px;
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}
.particle-2 {
  width: 6px;
  height: 6px;
  top: 80%;
  left: 70%;
  animation-delay: 1s;
}
.particle-3 {
  width: 10px;
  height: 10px;
  top: 50%;
  left: 30%;
  animation-delay: 2s;
}
.particle-4 {
  width: 7px;
  height: 7px;
  top: 20%;
  left: 80%;
  animation-delay: 0.5s;
}
.particle-5 {
  width: 9px;
  height: 9px;
  top: 70%;
  left: 40%;
  animation-delay: 1.5s;
}
.particle-6 {
  width: 5px;
  height: 5px;
  top: 30%;
  left: 90%;
  animation-delay: 3s;
}
.particle-7 {
  width: 6px;
  height: 6px;
  top: 60%;
  left: 60%;
  animation-delay: 2.5s;
}
.particle-8 {
  width: 8px;
  height: 8px;
  top: 40%;
  left: 10%;
  animation-delay: 4s;
}

/* 核心发光效果 */
.core-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 10%,
    rgba(76, 110, 244, 0.5) 70%,
    transparent 100%
  );
  border-radius: 50%;
  animation: glow 3s infinite ease-in-out;
}

/* 波纹效果 */
.ripple-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(76, 110, 244, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  animation: ripple 3s infinite ease-out;
}

.ripple-delay {
  animation-delay: 1.5s;
}

/* 旋转环 */
.rotating-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: rotate 4s infinite linear;
}

.card-right {
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  text-align: center;
}

.login-button {
  padding: 12px 24px;
  background: #4c6ef4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  background: #3858d6;
  transform: translateX(5px);
}

.login-button:active {
  background: #2a47b8;
  transform: scale(0.95);
  transition: all 0.1s ease;
}

.arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.arrow-hover {
  transform: translateX(5px);
}

/* 动画定义 */
@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4vh);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes cardPop {
  0% {
    opacity: 0;
    transform: translateY(-50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes glow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes particleMove {
  0% {
    transform: translate(0, 0);
    opacity: 0.7;
  }
  50% {
    transform: translate(20px, -20px);
    opacity: 0.3;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.7;
  }
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .background-element {
    min-width: 30px;
    min-height: 30px;
  }
  .card {
    width: 90vw;
    right: 5%;
  }
  .core-glow {
    width: 60px;
    height: 60px;
  }
  .ripple-circle {
    width: 150px;
    height: 150px;
  }
  .rotating-ring {
    width: 130px;
    height: 130px;
  }
}

@media screen and (max-height: 600px) {
  .background-element {
    min-width: 30px;
    min-height: 30px;
  }
  .card {
    height: 80vh;
  }
}
</style>
