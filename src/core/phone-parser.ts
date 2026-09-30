/**
 * phone-parser.ts
 * ------------------------------------------------------------
 * 负责把 AI 在正文末尾输出的 <手机>...</手机> 标记文本，
 * 解析成组件可以直接渲染的结构化数据 PhoneData。
 *
 * 支持的标记（见 worldbook/手机格式.txt）：
 *   <角色> <时间> <日期> <电量> <网络> <壁纸>
 *   <桌面> <应用 编号="" 未读="">名称</应用> ... </桌面>
 *   <APP 编号="" 名称=""> <栏目 名称="" 类型=""> <条目 .../> </栏目> </APP>
 *
 * 解析采用宽容策略：标签可能不规范、属性缺失、内容含 <br>，
 * 任何一处解析失败都不会整体抛错，只跳过坏节点。
 */

export interface PhoneEntry {
  /** 聊天方向：发出=机主本人，收到=对方 */
  direction?: '发出' | '收到';
  /** 发送者昵称 */
  sender?: string;
  /** 头像 URL */
  avatar?: string;
  /** 消息时间 */
  time?: string;
  /** 标题（动态/笔记/任务等） */
  title?: string;
  /** 副文（时间、来源、元信息） */
  subtitle?: string;
  /** 标记（价格、标签） */
  tag?: string;
  /** 状态：待办/完成/已接/已拨/未接 */
  status?: string;
  /** 正文（已把 <br> 转换为换行） */
  content: string;
  /** 原文中嵌入的 <img> 表情包链接列表 */
  stickers: string[];
}

export interface PhoneSection {
  name: string;
  /** 聊天 / 动态 / 其他自定义类型 */
  type?: string;
  entries: PhoneEntry[];
}

export interface PhoneApp {
  /** 编号，如 01 */
  id: string;
  /** 应用名，如 微信 / QQ / 小红书 */
  name: string;
  /** 09、10 号自定义应用的界面类型 */
  surface?: string;
  sections: PhoneSection[];
}

export interface PhoneDesktopIcon {
  id: string;
  name: string;
  unread: number;
}

export interface PhoneData {
  character: string;
  time: string;
  date: string;
  battery: string;
  network: string;
  wallpaper: string;
  desktop: PhoneDesktopIcon[];
  apps: PhoneApp[];
  /** 原始未解析文本，便于调试 */
  raw: string;
}

/** 从一段正文中截取最后一个完整的 <手机>...</手机> 块 */
export function extractPhoneBlock(text: string): string | null {
  if (!text) return null;
  const re = /<手机[^>]*>([\s\S]*?)<\/手机>/g;
  let last: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) last = m;
  return last ? `<手机>${last[1]}</手机>` : null;
}

/** 把标签内部的 <br>/<br/> 归一为换行，清理多余空白 */
function normalizeContent(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/** 从条目正文里抽出所有 <img src="..."> 作为表情包，并从正文中移除 */
function splitStickers(content: string): { content: string; stickers: string[] } {
  const stickers: string[] = [];
  const re = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const cleaned = content.replace(re, (_full, url) => {
    stickers.push(url as string);
    return ' ';
  });
  return { content: cleaned.replace(/\s+\n/g, '\n').trim(), stickers };
}

/** 解析一段属性串，如: 编号="01" 未读="3"（属性名可能是中文） */
function parseAttrs(attrText: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([\w一-龥]+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrText)) !== null) out[m[1]] = m[2];
  // 兼容单引号
  const re2 = /([\w一-龥]+)\s*=\s*'([^']*)'/g;
  while ((m = re2.exec(attrText)) !== null) {
    if (!(m[1] in out)) out[m[1]] = m[2];
  }
  return out;
}

/** 解析单个 <条目 ...>内容</条目> */
function parseEntry(block: string): PhoneEntry | null {
  const m = block.match(/^<条目([^>]*)>([\s\S]*)$/i);
  if (!m) return null;
  const attrs = parseAttrs(m[1]);
  const inner = m[2].replace(/<\/条目>\s*$/i, '');
  const { content, stickers } = splitStickers(normalizeContent(inner));
  return {
    direction: attrs['方向'] as PhoneEntry['direction'],
    sender: attrs['发送者'],
    avatar: attrs['头像'],
    time: attrs['时间'],
    title: attrs['标题'],
    subtitle: attrs['副文'],
    tag: attrs['标记'],
    status: attrs['状态'],
    content,
    stickers,
  };
}

/** 解析单个 <栏目 ...>...</栏目> */
function parseSection(block: string): PhoneSection | null {
  const m = block.match(/^<栏目([^>]*)>([\s\S]*)$/i);
  if (!m) return null;
  const attrs = parseAttrs(m[1]);
  const inner = m[2].replace(/<\/栏目>\s*$/i, '');
  const entryRe = /<条目[^>]*>[\s\S]*?<\/条目>/gi;
  const entries: PhoneEntry[] = [];
  let em: RegExpExecArray | null;
  while ((em = entryRe.exec(inner)) !== null) {
    const e = parseEntry(em[0]);
    if (e) entries.push(e);
  }
  return { name: attrs['名称'] || '未命名栏目', type: attrs['类型'], entries };
}

/** 解析单个 <APP ...>...</APP> */
function parseApp(block: string): PhoneApp | null {
  const m = block.match(/^<APP([^>]*)>([\s\S]*)$/i);
  if (!m) return null;
  const attrs = parseAttrs(m[1]);
  const inner = m[2].replace(/<\/APP>\s*$/i, '');
  const secRe = /<栏目[^>]*>[\s\S]*?<\/栏目>/gi;
  const sections: PhoneSection[] = [];
  let sm: RegExpExecArray | null;
  while ((sm = secRe.exec(inner)) !== null) {
    const s = parseSection(sm[0]);
    if (s) sections.push(s);
  }
  return {
    id: attrs['编号'] || '',
    name: attrs['名称'] || '应用',
    surface: attrs['界面'],
    sections,
  };
}

/** 提取 <标签>内容</标签> 的快捷函数 */
function grab(tag: string, html: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}

/** 主解析入口：把 <手机> 文本解析为 PhoneData */
export function parsePhone(rawBlock: string): PhoneData {
  const body = rawBlock
    .replace(/^<手机[^>]*>/i, '')
    .replace(/<\/手机>\s*$/i, '');

  const desktop: PhoneDesktopIcon[] = [];
  const desktopMatch = body.match(/<桌面[^>]*>([\s\S]*?)<\/桌面>/i);
  if (desktopMatch) {
    const iconRe = /<应用([^>]*)>([\s\S]*?)<\/应用>/gi;
    let im: RegExpExecArray | null;
    while ((im = iconRe.exec(desktopMatch[1])) !== null) {
      const a = parseAttrs(im[1]);
      desktop.push({
        id: a['编号'] || '',
        name: im[2].trim(),
        unread: Number(a['未读'] || 0),
      });
    }
  }

  const apps: PhoneApp[] = [];
  const appRe = /<APP[^>]*>[\s\S]*?<\/APP>/gi;
  let am: RegExpExecArray | null;
  while ((am = appRe.exec(body)) !== null) {
    const app = parseApp(am[0]);
    if (app) apps.push(app);
  }

  return {
    character: grab('角色', body),
    time: grab('时间', body),
    date: grab('日期', body),
    battery: grab('电量', body),
    network: grab('网络', body),
    wallpaper: grab('壁纸', body),
    desktop,
    apps,
    raw: rawBlock,
  };
}

/** 一键完成：从任意聊天文本中取块并解析 */
export function parsePhoneFromText(text: string): PhoneData | null {
  const block = extractPhoneBlock(text);
  if (!block) return null;
  try {
    return parsePhone(block);
  } catch (e) {
    console.warn('[zhizhi-phone] 解析失败', e);
    return null;
  }
}
