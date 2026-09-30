<script setup lang="ts">
/**
 * ChatBubble.vue — 单条聊天气泡。
 * 方向=发出 靠右、对方靠左，带头像、时间、表情包。
 */
import { computed } from 'vue';
import type { PhoneEntry } from '../core/phone-parser';

const props = defineProps<{
  entry: PhoneEntry;
  /** 是否群聊（群聊显示发送者名） */
  isGroup?: boolean;
  /** 机主名，用来判断是否自己发的 */
  ownerName?: string;
}>();

const isOut = computed(() => {
  if (props.entry.direction) return props.entry.direction === '发出';
  return props.entry.sender === props.ownerName;
});
</script>

<template>
  <div class="chat-bubble" :class="isOut ? 'bubble-out' : 'bubble-in'">
    <img v-if="entry.avatar" class="bubble-avatar" :src="entry.avatar" alt="" />
    <div v-else class="bubble-avatar bubble-avatar--placeholder">
      {{ (entry.sender || '?').slice(0, 1) }}
    </div>

    <div class="bubble-body">
      <div v-if="isGroup && !isOut" class="bubble-sender">{{ entry.sender }}</div>
      <div class="bubble-content">
        <p v-if="entry.content">{{ entry.content }}</p>
        <img
          v-for="(stk, i) in entry.stickers"
          :key="i"
          class="bubble-sticker"
          :src="stk"
          alt="sticker"
        />
      </div>
      <div v-if="entry.time" class="bubble-time">{{ entry.time }}</div>
    </div>
  </div>
</template>

<style scoped>
.chat-bubble {
  display: flex;
  gap: 8px;
  margin: 10px 4px;
  align-items: flex-start;
}
.bubble-out {
  flex-direction: row-reverse;
}
.bubble-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.06);
}
.bubble-avatar--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #fff;
  background: #b8a99a;
}
.bubble-body {
  max-width: 72%;
  display: flex;
  flex-direction: column;
}
.bubble-out .bubble-body {
  align-items: flex-end;
}
.bubble-sender {
  font-size: 11px;
  color: #999;
  margin-bottom: 2px;
}
.bubble-content {
  padding: 9px 12px;
  border-radius: 14px;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}
.bubble-in .bubble-content {
  background: #fff;
  border-top-left-radius: 4px;
}
.bubble-out .bubble-content {
  background: #b6e3a5;
  border-top-right-radius: 4px;
}
.bubble-sticker {
  width: 120px;
  max-width: 100%;
  border-radius: 8px;
  display: block;
  margin: 4px 0;
}
.bubble-time {
  font-size: 10px;
  color: #b0aaa0;
  margin-top: 3px;
}
</style>
