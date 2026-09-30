<script setup lang="ts">
/**
 * Desktop.vue — 手机主屏幕：状态栏 + 应用图标宫格。
 */
import { computed } from 'vue';
import { phone, sortedDesktop, openApp } from '../core/phone-state';

/** 应用名 -> 图标 emoji，兜底用通用图标 */
const ICON_MAP: Record<string, string> = {
  微信: '💬',
  QQ: '🐧',
  小红书: '📕',
  浏览器: '🌐',
  备忘录: '📝',
  相册: '🖼️',
  短信: '✉️',
  电话: '📞',
};

const icons = computed(() => sortedDesktop.value.map(icon => ({
  ...icon,
  emoji: ICON_MAP[icon.name] ?? '📱',
})));

const statusTime = computed(() => phone.data?.time || '22:30');
</script>

<template>
  <div class="desktop" :style="phone.data?.wallpaper ? { background: phone.data.wallpaper } : {}">
    <!-- 状态栏 -->
    <div class="desktop__statusbar">
      <span>{{ statusTime }}</span>
      <span class="desktop__status-right">
        <span v-if="phone.data?.network">📶 {{ phone.data.network }}</span>
        <span v-if="phone.data?.battery">🔋 {{ phone.data.battery }}</span>
      </span>
    </div>

    <!-- 应用宫格 -->
    <div class="desktop__grid">
      <button
        v-for="icon in icons"
        :key="icon.id"
        class="desktop__icon"
        @click="openApp(icon.id)"
      >
        <span class="desktop__icon-glyph">{{ icon.emoji }}</span>
        <span v-if="icon.unread > 0" class="desktop__badge">{{ icon.unread > 99 ? '99+' : icon.unread }}</span>
        <span class="desktop__icon-label">{{ icon.name }}</span>
      </button>
    </div>

    <!-- 底部 dock -->
    <div class="desktop__dock">
      <span class="desktop__dock-home" @click="openApp('')"></span>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f6ead9, #e8d3b8);
  padding: 12px 16px 0;
  box-sizing: border-box;
}
.desktop__statusbar {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5b4a3a;
  font-weight: 600;
  margin-bottom: 14px;
}
.desktop__status-right {
  display: flex;
  gap: 8px;
}
.desktop__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px 12px;
}
.desktop__icon {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}
.desktop__icon-glyph {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}
.desktop__badge {
  position: absolute;
  top: -4px;
  right: 8px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: #f04848;
  color: #fff;
  font-size: 10px;
  line-height: 17px;
  text-align: center;
}
.desktop__icon-label {
  font-size: 11px;
  color: #4a3d30;
}
.desktop__dock {
  margin-top: auto;
  padding: 10px 0 6px;
  display: flex;
  justify-content: center;
}
.desktop__dock-home {
  width: 110px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.25);
}
</style>
