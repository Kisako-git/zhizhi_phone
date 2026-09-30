/**
 * phone-state.ts
 * ------------------------------------------------------------
 * 全应用共享的响应式状态。基于 Vue 3 reactivity，
 * 不依赖任何 SillyTavern 全局对象，方便在浏览器里独立调试。
 */
import { reactive, computed } from 'vue';
import type { PhoneData } from './phone-parser';

export type ThemeName = 'milk' | 'glass' | 'dark';

interface PhoneState {
  /** 手机是否显示 */
  show: boolean;
  /** 当前打开的应用 id（空字符串 = 停留在桌面） */
  activeApp: string;
  /** 当前主题 */
  theme: ThemeName;
  /** 解析出来的最新手机数据 */
  data: PhoneData | null;
  /** 机主昵称（来自 SillyTavern 的 {{user}}，独立运行时用默认值） */
  ownerName: string;
  /** 机主头像 */
  ownerAvatar: string;
  /** 角色名 */
  charName: string;
  /** 屏幕亮度 0~1 */
  brightness: number;
  /** 侧键导航按钮是否显示 */
  navButton: boolean;
}

export const phone = reactive<PhoneState>({
  show: true,
  activeApp: '',
  theme: 'milk',
  data: null,
  ownerName: '我',
  ownerAvatar: '',
  charName: '',
  brightness: 1,
  navButton: true,
});

/** 当前打开的应用对象（computed，随 data / activeApp 自动更新） */
export const currentApp = computed(() => {
  if (!phone.data || !phone.activeApp) return null;
  return phone.data.apps.find(a => a.id === phone.activeApp) ?? null;
});

/** 桌面图标按编号排序 */
export const sortedDesktop = computed(() => {
  if (!phone.data) return [];
  return [...phone.data.desktop].sort((a, b) => a.id.localeCompare(b.id));
});

/** 未读总数（桌面角标求和） */
export const totalUnread = computed(() => {
  if (!phone.data) return 0;
  return phone.data.desktop.reduce((sum, icon) => sum + (icon.unread || 0), 0);
});

/** 切换主题，循环顺序 milk -> glass -> dark */
export function cycleTheme() {
  const order: ThemeName[] = ['milk', 'glass', 'dark'];
  const i = order.indexOf(phone.theme);
  phone.theme = order[(i + 1) % order.length];
}

/** 返回桌面 */
export function goHome() {
  phone.activeApp = '';
}

/** 打开某个应用 */
export function openApp(id: string) {
  phone.activeApp = id;
}

/** 写入新解析到的手机数据 */
export function applyPhoneData(data: PhoneData) {
  phone.data = data;
  phone.charName = data.character || phone.charName;
  // 若当前打开的应用已不存在，回桌面
  if (phone.activeApp && !data.apps.some(a => a.id === phone.activeApp)) {
    phone.activeApp = '';
  }
}

/** 显隐切换 */
export function togglePhone() {
  phone.show = !phone.show;
}
