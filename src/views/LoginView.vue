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
          <h2 class="login-title">欢迎登录</h2>
          <el-form
            :model="loginForm"
            ref="loginFormRef"
            :rules="rules"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="options">
                <el-switch v-model="loginForm.rememberMe" active-text="记住我" />
                <a href="#" class="forgot-password">忘记密码?</a>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-button"
                native-type="submit"
                :loading="loading"
                @mouseover="hover = true"
                @mouseleave="mouseleaveHandler"
                @mousedown="active = true"
                @mouseup="active = false"
              >
                登录
                <svg class="arrow" viewBox="0 0 24 24" :class="{ 'arrow-hover': hover }">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </el-button>
            </el-form-item>
          </el-form>
          <div class="social-login">
            <el-tooltip content="短信登录" placement="top">
              <el-button circle plain @click="socialLogin('sms')">
                <el-icon><Message /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="微信登录" placement="top">
              <el-button circle plain @click="socialLogin('wechat')">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path
                    d="M18.5 8.5c0-2.5-2-4.5-4.5-4.5s-4.5 2-4.5 4.5 2 4.5 4.5 4.5c.7 0 1.4-.2 2-.5l2.5 1.5-1-3zM5.5 12c-2 0-3.5-1.5-3.5-3.5S3.5 5 5.5 5s3.5 1.5 3.5 3.5c0 .7-.2 1.3-.5 1.8l-1 3 2.5-1.5c.6.3 1.3.5 2 .5 2 0 3.5-1.5 3.5-3.5"
                    fill="none"
                    stroke="#67C23A"
                    stroke-width="2"
                  />
                </svg>
              </el-button>
            </el-tooltip>
            <el-tooltip content="钉钉登录" placement="top">
              <el-button circle plain @click="socialLogin('dingtalk')">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path
                    d="M12 2L2 9h20L12 2zm0 20l10-7H2l10 7z"
                    fill="none"
                    stroke="#409EFF"
                    stroke-width="2"
                  />
                </svg>
              </el-button>
            </el-tooltip>
            <el-tooltip content="GitHub登录" placement="top">
              <el-button circle plain @click="socialLogin('github')">
                <el-icon><i class="fab fa-github" /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <p class="register-link">还没有账号? <a href="#">立即注册</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'

// 响应式变量
const hover = ref(false)
const active = ref(false)
const loading = ref(false)
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

// 表单校验规则
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

// 处理鼠标离开
const mouseleaveHandler = () => {
  hover.value = false
  active.value = false
}

// 登录处理函数
const handleLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      console.log('登录信息:', loginForm)
      // 模拟登录请求
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
  })
}

// 社交登录处理函数
const socialLogin = (type: string) => {
  console.log(`使用 ${type} 登录`)
  // 这里可以添加具体的社交登录逻辑
}
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #75abed 0%, #3876da 100%);
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10%;
  font-family: Arial, sans-serif;
}

/* 背景浮动元素 */
.background-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: floatGlow 8s infinite ease-in-out;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
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

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: particleMove 5s infinite ease-in-out;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
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

.core-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 10%,
    rgba(76, 110, 244, 0.6) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: glowPulse 2s infinite ease-in-out;
  box-shadow: 0 0 30px rgba(76, 110, 244, 0.8);
}

.ripple-circle {
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(76, 110, 244, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  animation: rippleExpand 3.5s infinite ease-out;
  box-shadow: 0 0 20px rgba(76, 110, 244, 0.4);
}

.ripple-delay {
  animation-delay: 1.75s;
  background: radial-gradient(circle, rgba(163, 193, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%);
}

.rotating-ring {
  position: absolute;
  width: 220px;
  height: 220px;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  border-top-color: #ffffff;
  border-right-color: rgba(255, 255, 255, 0.8);
  animation: rotateGlow 3s infinite linear;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.card-right {
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 350px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  animation: fadeIn 1s ease-in;
}

.el-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.forgot-password {
  color: #4c6ef4;
  text-decoration: none;
  margin-left: 187px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #3858d6;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateX(5px);
}

.login-button:active {
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

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.social-icon {
  width: 20px;
  height: 20px;
}

.register-link {
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #4c6ef4;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #3858d6;
}

/* 动画 */
@keyframes floatGlow {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: translateY(-4vh) scale(1.1);
    opacity: 1;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
}

@keyframes cardPop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes rippleExpand {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
    box-shadow: 0 0 10px rgba(76, 110, 244, 0.4);
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
    box-shadow: 0 0 20px rgba(76, 110, 244, 0.6);
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    box-shadow: 0 0 30px rgba(76, 110, 244, 0);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 20px rgba(76, 110, 244, 0.6);
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
    box-shadow: 0 0 40px rgba(76, 110, 244, 0.9);
  }
}

@keyframes rotateGlow {
  0% {
    transform: rotate(0deg);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
  }
  100% {
    transform: rotate(360deg);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
}

@keyframes particleMove {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.9;
  }
  25% {
    transform: translate(25px, -25px) scale(1.2);
    opacity: 0.6;
  }
  50% {
    transform: translate(-15px, 15px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(20px, 10px) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.9;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
