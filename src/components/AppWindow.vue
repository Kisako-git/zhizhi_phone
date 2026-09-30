<script setup lang="ts">
/**
 * AppWindow.vue — 单个应用的窗口容器。
 * 顶栏带返回键、应用名；内容区透传 slot。
 */
import { goHome } from '../core/phone-state';

defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="app-window">
    <header class="app-window__bar">
      <button class="app-window__back" @click="goHome()">‹</button>
      <span class="app-window__title">{{ title }}</span>
      <span class="app-window__more">⋯</span>
    </header>
    <div class="app-window__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--app-bg, #f3f0ea);
}
.app-window__bar {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 10px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.app-window__back {
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 0 8px;
  color: var(--bar-color, #333);
}
.app-window__title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--bar-color, #333);
}
.app-window__more {
  padding: 0 8px;
  font-size: 20px;
  color: var(--bar-color, #333);
}
.app-window__content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
</style>
