<script setup lang="ts">
/**
 * Phone.vue — 手机整机外壳。
 * 负责：机身外框、主题切换、根据 activeApp 在 桌面 / 应用窗口 间切换。
 */
import { computed } from 'vue';
import { phone, currentApp, togglePhone, cycleTheme, goHome } from '../core/phone-state';
import { resolveAppComponent } from '../core/app-router';
import Desktop from './Desktop.vue';
import AppWindow from './AppWindow.vue';

const activeComponent = computed(() => (currentApp.value ? resolveAppComponent(currentApp.value) : null));
const themeClass = computed(() => `theme-${phone.theme}`);
</script>

<template>
  <div v-if="phone.show" class="phone-shell" :class="themeClass">
    <div class="phone-shell__notch"></div>

    <div class="phone-shell__screen">
      <!-- 桌面 -->
      <Desktop v-if="!currentApp" />

      <!-- 打开的应用 -->
      <AppWindow v-else :title="currentApp.name">
        <component :is="activeComponent" :app="currentApp" />
      </AppWindow>
    </div>

    <!-- 侧边控制键：显隐 / 主题 / 回桌面 -->
    <div v-if="phone.navButton" class="phone-shell__sidekeys">
      <button title="显隐" @click="togglePhone">⊙</button>
      <button title="切主题" @click="cycleTheme">◐</button>
      <button v-if="currentApp" title="回桌面" @click="goHome">⌂</button>
    </div>
  </div>
</template>

<style scoped>
.phone-shell {
  position: relative;
  width: 380px;
  max-width: 92vw;
  height: 760px;
  max-height: 88vh;
  border-radius: 42px;
  padding: 12px;
  background: #1f1b17;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  box-sizing: border-box;
}
.phone-shell__notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 22px;
  border-radius: 12px;
  background: #1f1b17;
  z-index: 5;
}
.phone-shell__screen {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  overflow: hidden;
  background: #f3f0ea;
}
.phone-shell__sidekeys {
  position: absolute;
  right: -46px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.phone-shell__sidekeys button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 15px;
  color: #5b4a3a;
}
</style>
