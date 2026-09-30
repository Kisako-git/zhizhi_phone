/**
 * app-router.ts
 * ------------------------------------------------------------
 * 应用路由：根据应用编号 / 名称决定渲染哪一个 App 组件，
 * 并维护「应用 -> 界面组件」的映射表。
 *
 * 固定应用：
 *   01 微信 / 02 QQ / 03 小红书 / 07 短信  -> 聊天类
 *   09、10 自定义应用                      -> CustomApp
 * 其余（浏览器/备忘录/相册/电话等）      -> CustomApp 通用渲染
 */
import { markRaw, type Component } from 'vue';
import WeChat from '../apps/WeChat.vue';
import QQ from '../apps/QQ.vue';
import RedNote from '../apps/RedNote.vue';
import CustomApp from '../apps/CustomApp.vue';

/** 已知的聊天/信息流类应用名 -> 组件 */
const CHAT_MAP: Record<string, Component> = {
  微信: markRaw(WeChat),
  WeChat: markRaw(WeChat),
  QQ: markRaw(QQ),
  小红书: markRaw(RedNote),
  RedNote: markRaw(RedNote),
};

/** 根据应用元信息拿到应渲染的组件 */
export function resolveAppComponent(app: { id: string; name: string; surface?: string }): Component {
  if (CHAT_MAP[app.name]) return CHAT_MAP[app.name];
  // 编号 09 / 10 或带「界面」属性的，统一走自定义应用
  return markRaw(CustomApp);
}

/** 判断该应用是否为「聊天类」（决定气泡样式方向） */
export function isChatApp(name: string): boolean {
  return name === '微信' || name === 'QQ' || name === '短信' || name === 'WeChat';
}
