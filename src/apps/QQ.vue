<script setup lang="ts">
/**
 * QQ.vue — QQ。
 * 与微信同为聊天类，但使用 QQ 蓝色调、群聊强调发送者。
 */
import { computed } from 'vue';
import type { PhoneApp } from '../core/phone-parser';
import ChatBubble from '../components/ChatBubble.vue';
import { phone } from '../core/phone-state';

const props = defineProps<{ app: PhoneApp }>();

const chatSections = computed(() =>
  props.app.sections.filter(s => !s.type || s.type === '聊天' || s.type === '群聊'),
);
</script>

<template>
  <div class="qq">
    <section v-for="(sec, i) in chatSections" :key="i" class="qq__section">
      <h3 class="qq__name">{{ sec.name }}<span class="qq__tag">{{ sec.type === '群聊' ? '群聊' : '私聊' }}</span></h3>
      <ChatBubble
        v-for="(entry, j) in sec.entries"
        :key="j"
        :entry="entry"
        :is-group="true"
        :owner-name="phone.ownerName"
      />
    </section>
    <p v-if="chatSections.length === 0" class="qq__empty">暂无消息</p>
  </div>
</template>

<style scoped>
.qq {
  padding-bottom: 12px;
}
.qq__section {
  margin-bottom: 18px;
}
.qq__name {
  font-size: 13px;
  color: #5b8fd6;
  margin: 4px 2px 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.qq__tag {
  font-size: 10px;
  background: #e3efff;
  color: #4a80d0;
  border-radius: 4px;
  padding: 1px 6px;
}
.qq__empty {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  margin-top: 40px;
}
</style>
