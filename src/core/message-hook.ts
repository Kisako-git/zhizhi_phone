/**
 * message-hook.ts
 * ------------------------------------------------------------
 * 消息钩子：监听 SillyTavern 的消息渲染事件，从 AI 回复中
 * 抽取 <手机> 块并更新到全局状态。
 *
 * 在 SillyTavern 环境外（纯 Vite 调试），它退化为一个
 * 手动喂文本的入口 scanText()，不会报错。
 */
import { parsePhoneFromText } from './phone-parser';
import { applyPhoneData, phone } from './phone-state';

/** 已知的 SillyTavern 全局对象（做特性探测，避免裸引用） */
declare global {
  interface Window {
    eventOn?: (event: string, handler: (data?: any) => void) => void;
    tavern_events?: Record<string, string>;
    getChatMessages?: (range: string, opts?: { role?: string }) => Promise<Array<{ message_id: number; message: string }>>;
    triggerSlash?: (cmd: string) => Promise<string>;
  }
}

/** 扫描一段文本，若含 <手机> 块则更新状态 */
export function scanText(text: string): boolean {
  if (!text) return false;
  const data = parsePhoneFromText(text);
  if (!data) return false;
  applyPhoneData(data);
  return true;
}

/** 扫描单条消息对象 */
export function scanMessage(msg: { message: string }): boolean {
  return scanText(msg.message || '');
}

/**
 * 绑定 SillyTavern 事件。仅在检测到相关全局对象时生效。
 * 返回一个解绑提示（当前 ST 无标准 off API，这里仅做幂等注册）。
 */
export function installHooks(): void {
  const w = window;
  if (!w || typeof w.eventOn !== 'function' || !w.tavern_events) {
    console.info('[zhizhi-phone] 未检测到 SillyTavern 环境，仅启用手动 scanText()。');
    return;
  }
  const ev = w.tavern_events;

  const handle = async (messageId?: number) => {
    try {
      const lastId = (await w.triggerSlash?.('/pass {{lastMessageId}}')) ?? '0';
      const msgs = await w.getChatMessages?.(`0-${lastId}`, { role: 'assistant' });
      if (!msgs || msgs.length === 0) return;
      // 倒序：找到最新一条含手机块的即可
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (scanMessage(msgs[i])) break;
      }
    } catch (e) {
      console.warn('[zhizhi-phone] 扫描消息失败', e);
    }
  };

  w.eventOn(ev.CHARACTER_MESSAGE_RENDERED ?? 'characterMessageRendered', handle);
  w.eventOn(ev.MESSAGE_UPDATED ?? 'messageUpdated', handle);
  w.eventOn(ev.GENERATION_ENDED ?? 'generationEnded', handle);
  w.eventOn(ev.CHAT_CHANGED ?? 'chatChanged', () => handle());

  console.info('[zhizhi-phone] 消息钩子已安装。');
}

/** 从 IndexedDB 之类的持久层恢复（占位，真实环境可在此读取缓存） */
export function loadCachedState(): void {
  try {
    const saved = localStorage.getItem('zhizhi-phone-theme');
    if (saved === 'milk' || saved === 'glass' || saved === 'dark') {
      phone.theme = saved;
    }
  } catch {
    /* 隐私模式下 localStorage 可能不可用 */
  }
}
