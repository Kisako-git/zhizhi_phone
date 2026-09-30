<script setup lang="ts">
/**
 * WeChat.vue — 微信。
 * 渲染该 APP 下的「聊天」栏目：按联系人/群分组，逐条出气泡。
 */
import { computed } from 'vue';
import type { PhoneApp } from '../core/phone-parser';
import ChatBubble from '../components/ChatBubble.vue';
import { phone } from '../core/phone-state';

const props = defineProps<{ app: PhoneApp }>();

/** 仅保留聊天类栏目 */
const chatSections = computed(() =>
  props.app.sections.filter(s => !s.type || s.type === '聊天' || s.type === '群聊'),
);
</script>

<template>
  <div class="wechat">
    <section v-for="(sec, i) in chatSections" :key="i" class="wechat__section">
      <h3 class="wechat__name">{{ sec.name }}</h3>
      <ChatBubble
        v-for="(entry, j) in sec.entries"
        :key="j"
        :entry="entry"
        :is-group="sec.type === '群聊'"
        :owner-name="phone.ownerName"
      />
    </section>
    <p v-if="chatSections.length === 0" class="wechat__empty">暂无聊天记录</p>
  </div>
</template>

<style scoped>
.wechat {
  padding-bottom: 12px;
}
.wechat__section {
  margin-bottom: 18px;
}
.wechat__name {
  font-size: 13px;
  color: #8a8378;
  margin: 4px 2px 6px;
  text-align: center;
}
.wechat__empty {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  margin-top: 40px;
}
</style>
