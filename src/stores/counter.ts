// stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State：仅保留需要持久化的状态
    const token = ref("");
    const refreshToken = ref("");

    // 计算登录状态，无需持久化
    const isLogin = computed(() => token.value !== "");

    // Actions
    function login(newToken: string, newRefreshToken: string) {
      if (newToken != "") token.value = newToken;
      if (newRefreshToken != "") refreshToken.value = newRefreshToken;
    }

    function logout() {
      token.value = "";
      refreshToken.value = "";
    }

    return {
      token,
      refreshToken,
      isLogin,
      login,
      logout,
    };
  },
  {
    persist: true, // 启用持久化
  }
);
