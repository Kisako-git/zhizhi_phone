<script setup lang="ts">
/**
 * RedNote.vue — 小红书。
 * 渲染「动态」类栏目为图文笔记卡片：标题、标签、正文、配图/表情包。
 */
import { computed } from 'vue';
import type { PhoneApp, PhoneSection } from '../core/phone-parser';

const props = defineProps<{ app: PhoneApp }>();

const feedSections = computed<PhoneSection[]>(() =>
  props.app.sections.filter(s => s.type === '动态' || !s.type),
);
</script>

<template>
  <div class="rednote">
    <section v-for="(sec, si) in feedSections" :key="si" class="rednote__col">
      <h3 class="rednote__title">{{ sec.name }}</h3>

      <article v-for="(entry, ei) in sec.entries" :key="ei" class="rednote__card">
        <img
          v-for="(stk, ii) in entry.stickers"
          :key="ii"
          class="rednote__cover"
          :src="stk"
          alt=""
        />
        <div v-if="entry.title" class="rednote__card-title">{{ entry.title }}</div>
        <p v-if="entry.content" class="rednote__card-body">{{ entry.content }}</p>
        <div class="rednote__card-meta">
          <span v-if="entry.tag" class="rednote__chip">{{ entry.tag }}</span>
          <span v-if="entry.subtitle">{{ entry.subtitle }}</span>
          <span v-if="entry.time">· {{ entry.time }}</span>
        </div>
      </article>
    </section>
    <p v-if="feedSections.length === 0" class="rednote__empty">还没有笔记</p>
  </div>
</template>

<style scoped>
.rednote {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rednote__title {
  font-size: 14px;
  color: #333;
  margin: 2px 2px 8px;
}
.rednote__card {
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.rednote__cover {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
  max-height: 220px;
  object-fit: cover;
}
.rednote__card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}
.rednote__card-body {
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  white-space: pre-wrap;
}
.rednote__card-meta {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.rednote__chip {
  background: #ffe9ec;
  color: #ff2442;
  border-radius: 4px;
  padding: 1px 6px;
}
.rednote__empty {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
}
</style>
