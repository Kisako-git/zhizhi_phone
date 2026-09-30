<script setup lang="ts">
/**
 * CustomApp.vue — 通用应用渲染器。
 * 用于 09/10 号自定义应用，以及 浏览器/备忘录/相册/电话/短信 等
 * 未单独定制的应用。按 surface 做最基础的差异化：
 *   - 任务/待办：条目带状态勾选样式
 *   - 其余：标题 + 标签 + 正文 + 配图
 */
import { computed } from 'vue';
import type { PhoneApp } from '../core/phone-parser';

const props = defineProps<{ app: PhoneApp }>();

const isTodo = computed(() => props.app.surface === '任务');
</script>

<template>
  <div class="custom-app">
    <section v-for="(sec, si) in app.sections" :key="si" class="custom-app__section">
      <h3 v-if="sec.name && sec.name !== '未命名栏目'" class="custom-app__heading">
        {{ sec.name }}
      </h3>

      <div v-for="(entry, ei) in sec.entries" :key="ei" class="custom-app__entry">
        <!-- 任务类：勾选框 -->
        <div v-if="isTodo" class="custom-app__todo" :class="{ done: entry.status === '完成' }">
          <span class="custom-app__checkbox">
            {{ entry.status === '完成' ? '✓' : '○' }}
          </span>
          <div>
            <div class="custom-app__entry-title">{{ entry.title || entry.content }}</div>
            <div v-if="entry.content && entry.title" class="custom-app__entry-body">{{ entry.content }}</div>
          </div>
        </div>

        <!-- 通用条目 -->
        <template v-else>
          <img
            v-for="(stk, ii) in entry.stickers"
            :key="ii"
            class="custom-app__img"
            :src="stk"
            alt=""
          />
          <div v-if="entry.title" class="custom-app__entry-title">{{ entry.title }}</div>
          <p v-if="entry.content" class="custom-app__entry-body">{{ entry.content }}</p>
          <div class="custom-app__meta">
            <span v-if="entry.tag" class="custom-app__chip">{{ entry.tag }}</span>
            <span v-if="entry.status" class="custom-app__chip">{{ entry.status }}</span>
            <span v-if="entry.subtitle">{{ entry.subtitle }}</span>
            <span v-if="entry.time">· {{ entry.time }}</span>
          </div>
        </template>
      </div>
    </section>
    <p v-if="app.sections.length === 0" class="custom-app__empty">此应用暂无内容</p>
  </div>
</template>

<style scoped>
.custom-app__section {
  margin-bottom: 18px;
}
.custom-app__heading {
  font-size: 13px;
  color: #8a8378;
  margin: 4px 2px 8px;
}
.custom-app__entry {
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.custom-app__todo {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.custom-app__todo.done .custom-app__entry-title {
  text-decoration: line-through;
  color: #aaa;
}
.custom-app__checkbox {
  font-size: 18px;
  color: #6ab04c;
  line-height: 1.2;
}
.custom-app__entry-title {
  font-size: 14px;
  font-weight: 600;
}
.custom-app__entry-body {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  white-space: pre-wrap;
}
.custom-app__img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
  max-height: 200px;
  object-fit: cover;
}
.custom-app__meta {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.custom-app__chip {
  background: #f0e9df;
  color: #8a7358;
  border-radius: 4px;
  padding: 1px 6px;
}
.custom-app__empty {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
}
</style>
