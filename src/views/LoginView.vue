<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const currentLang = ref('zh')
const langOptions = [
  { label: '日本語', value: 'ja' },
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: 'العربية', value: 'ar' },
  { label: 'Français', value: 'fr' },
]

const rules = ref<FormRules>({
  username: [{ required: true, message: t('usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: t('passwordPlaceholder'), trigger: 'blur' }],
})

const handleLangChange = (lang: string) => {
  locale.value = lang
  rules.value = {
    username: [{ required: true, message: t('usernamePlaceholder'), trigger: 'blur' }],
    password: [{ required: true, message: t('passwordPlaceholder'), trigger: 'blur' }],
  }
}

const dividerPath = ref<SVGPathElement | null>(null)
const pathD = ref('')
const initialPath = ref('')

const calculatePath = () => {
  pathD.value = `
    M 90 0
    C 70 30,
      30 70,
      10 100
    L 100 100
    L 100 0
    Z
  `
  initialPath.value = `
    M -100 0
    L -100 100
    L 100 100
    L 100 0
    Z
  `
}

onMounted(() => {
  calculatePath()
  if (dividerPath.value) {
    const pathLength = dividerPath.value.getTotalLength()
    dividerPath.value.style.strokeDasharray = String(pathLength)
    dividerPath.value.style.strokeDashoffset = String(pathLength)
  } else {
    console.warn('dividerPath is null')
  }
})

const hover = ref(false)
const active = ref(false)
const loading = ref(false)
const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
})

const mouseleaveHandler = () => {
  hover.value = false
  active.value = false
}

const handleLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      console.log('登录信息:', loginForm)
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
  })
}

const socialLogin = (type: string) => {
  console.log(`使用 ${type} 登录`)
}
</script>

<template>
  <div class="login-page">
    <!-- 背景SVG分割线 -->
    <svg class="background-divider" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path ref="dividerPath" :d="pathD" fill="none" stroke="#ffffff" stroke-width="0.2" />
      <path :d="pathD" fill-rule="evenodd">
        <animate
          attributeName="d"
          :from="initialPath"
          :to="pathD"
          dur="2s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.42 0 0.58 1"
          keyTimes="0;1"
        />
      </path>
    </svg>

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
        <div class="login-content" :lang="currentLang">
          <!-- 添加分段控制器 -->
          <el-segmented
            v-model="currentLang"
            :options="langOptions"
            @change="handleLangChange"
            class="lang-selector"
          />
          <h2 class="login-title">{{ $t('welcome') }}</h2>
          <el-form
            :model="loginForm"
            ref="loginFormRef"
            :rules="rules"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                :placeholder="$t('usernamePlaceholder')"
                clearable
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                :placeholder="$t('passwordPlaceholder')"
                show-password
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="options">
                <el-switch v-model="loginForm.rememberMe" :active-text="$t('rememberMe')" />
                <el-link href="#" class="forgot-password">{{ $t('forgotPassword') }}</el-link>
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
                {{ $t('login') }}
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
            <el-tooltip :content="$t('smsLogin')" placement="top">
              <el-button circle plain @click="socialLogin('sms')">
                <el-icon><Message /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip :content="$t('wechatLogin')" placement="top">
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
            <el-tooltip :content="$t('dingtalkLogin')" placement="top">
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
            <el-tooltip :content="$t('githubLogin')" placement="top">
              <el-button circle plain @click="socialLogin('github')">
                <el-icon><i class="fab fa-github" /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
          <p class="register-link">
            {{ $t('noAccount') }} <el-link href="#" type="primary">{{ $t('register') }}</el-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

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
  padding-right: 5%; /* 调整以确保卡片在右侧 */
}

.background-divider {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  transform: translateX(-100%);
  animation: slideIn 2s ease-in-out forwards;
  z-index: 0; /* SVG 在卡片之下 */
}

.background-divider path:first-child {
  stroke: #ffffff !important;
  stroke-width: 0.2 !important;
  animation: drawLine 2s ease-in-out forwards;
  z-index: 1;
  position: relative;
}

.background-divider path:nth-child(2) {
  fill: rgba(255, 255, 255, 0.9);
  z-index: 0;
  position: relative;
}

.background-element {
  position: absolute;
  left: 0;
  right: 50%;
  animation:
    slideIn 2s ease-in-out forwards,
    floatGlow 6s infinite ease-in-out;
  transform: translateX(-100%);
}
/* 左边浮动元素 */
.left-element {
  position: absolute;
  animation: floatGlow 6s infinite ease-in-out;
}

.element1 {
  width: 60px;
  height: 60px;
  top: 10%;
  left: 5%;
  background: radial-gradient(circle, #ffffff 20%, transparent 70%);
  border-radius: 50%;
}
.element2 {
  width: 40px;
  height: 80px;
  top: 25%;
  left: 15%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
.element3 {
  width: 70px;
  height: 70px;
  top: 40%;
  left: 8%;
  background: rgba(255, 255, 255, 0.3);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
.element4 {
  width: 50px;
  height: 50px;
  top: 60%;
  left: 20%;
  background: radial-gradient(circle, #a3c1ff 30%, transparent 70%);
  border-radius: 50%;
}
.element5 {
  width: 80px;
  height: 20px;
  top: 15%;
  left: 25%;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
}
.element6 {
  width: 30px;
  height: 60px;
  top: 70%;
  left: 12%;
  background: linear-gradient(45deg, #75abed, transparent);
  transform: rotate(45deg);
}
.element7 {
  width: 45px;
  height: 45px;
  top: 50%;
  left: 5%;
  background: rgba(255, 255, 255, 0.2);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}
.element8 {
  width: 55px;
  height: 55px;
  top: 30%;
  left: 18%;
  background: radial-gradient(circle, #4c6ef4 20%, transparent 70%);
  border-radius: 50%;
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
  z-index: 1; /* 卡片在 SVG 之上 */
  position: relative;
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
  direction: ltr;
}

.login-content[lang='ar'] {
  direction: rtl;
}

.options {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.forgot-password {
  color: #4c6ef4;
  text-decoration: none;
  margin-inline-start: auto; /* 弹性靠右 */
  transition: color 0.3s ease;
}

/* 阿拉伯语 RTL 模式 */
.login-content[lang='ar'] {
  direction: rtl;
}

.login-content[lang='ar'] .options {
  flex-direction: row-reverse;
}

.lang-selector {
  margin-bottom: 20px;
  justify-content: center;
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
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
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
/* 动画 */
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes floatGlow {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-30px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
}
</style>
