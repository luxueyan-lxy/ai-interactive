<template>
  <div class="challenge-section">
    <div class="challenge-header">
      <div class="current-perspective">{{ currentPerspective.title }}</div>
      <div class="perspective-hint-text">{{ currentPerspective.hint }}</div>
      <div class="perspective-creation" v-if="currentPerspective.creation_prompts">
        <h3>🧠 创作思维提示</h3>
        
        <div class="mb-3" v-if="currentPerspective.creation_prompts && currentPerspective.creation_prompts.thinking_directions">
            <h4>思考方向：</h4>
            <ul class="list-disc" v-for="item in currentPerspective.creation_prompts.thinking_directions">
                <li>{{ item }}</li>
            </ul>
        </div>
        
        <div class="mb-3" v-if="currentPerspective.creation_prompts && currentPerspective.creation_prompts.questions_to_ask">
            <h4>启发问题：</h4>
            <ul class="list-disc" v-for="item in currentPerspective.creation_prompts.questions_to_ask">
                <li>{{ item }}</li>
            </ul>
        </div>
      </div>
    </div>
    <div v-if="isBlindBoxes==false">
      <span>没有想法？试试“生成思维视角”寻找创作视角。</span>
      <el-button type="text" @click="submitBlindbox">生成思维视角</el-button>
    </div>
    <div class="response-input-area">
      <div class="response-input-wrapper">
        <textarea
          v-model="challengeResponse"
          placeholder="请在此处阐述你的观点..."
          class="custom-textarea"
          rows="20"
        ></textarea>
        <button class="clear-btn" @click="clearResponse">清空</button>
        <!-- <el-tiptap
          v-model="challengeResponse"
          :extensions="extensions"
          placeholder="请在此处阐述你的观点..."
          height="400px"
        /> -->
      </div>
      
      <div class="input-controls">
        <div class="char-count">
          已输入 {{ challengeResponse.length }}
        </div>
        <button
          class="prev-btn"
          @click="prevStep"
        >
          上一步
        </button>
        <button
          class="submit-btn"
          :disabled="!challengeResponse.trim() || isSubmittingChallenge"
          @click="submitChallenge"
        >
          <span v-if="!isSubmittingChallenge">AI分析</span>
          <span v-else>
            <el-icon><Loading /></el-icon> AI正在审核你的看法...
          </span>
        </button>
        <button
          class="submit-btn"
          :disabled="!challengeResponse.trim() || isPublishChallenge"
          @click="publishChallenge"
        >
          <span v-if="!isPublishChallenge">发表</span>
          <span v-else>
            <el-icon><Loading /></el-icon> 正在发表你的看法...
          </span>
        </button>
        <button
          class="submit-btn"
          @click="viewExample"
        >
          查看示例
        </button>
      </div>
      
      <!-- AI反馈 -->
      <div v-if="aiFeedback" class="ai-feedback" :style="{ borderLeftColor: getTagColor(currentPerspective.type) }">
        <div class="feedback-header">
          <div class="perspective-indicator" :style="{ backgroundColor: getTagColor(currentPerspective.type) }"></div>
          <div class="feedback-title">AI反馈</div>
          <button class="copy-btn" @click="copyFeedback" title="复制反馈">
            <el-icon><CopyDocument /></el-icon>
          </button>
        </div>
        <div class="feedback-content">
          <div class="feedback-section">
            <div class="section-title">👍 肯定部分</div>
            <div class="feedback-text">{{ aiFeedback.positive }}</div>
          </div>
          <div class="feedback-section">
            <div class="section-title">💡 优化建议</div>
            <div class="feedback-text">{{ aiFeedback.suggestion }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
// import { Text, Document, Paragraph, Bold, Italic, Underline, Strike, BulletList, OrderedList, Link, Image } from 'element-tiptap'
import { perspectiveTypes } from '../../data/mockData.js';

const props = defineProps({
  currentPerspective: {
    type: Object,
    default: () => ({})
  },
  aiFeedback: {
    type: Object,
    default: null
  },
  isSubmittingChallenge: {
    type: Boolean,
    default: false
  },
  isBlindBoxes: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-challenge', 'publish-challenge', 'copy-feedback', 'submit-blindbox', 'view-example', 'prev-step']);

const challengeResponse = ref('');
// 配置工具栏扩展（按需引入）
// const extensions = [Text, Document, Paragraph, Bold, Italic,  Underline, Strike,
//   BulletList, OrderedList, Link, Image]

const isPublishChallenge = ref(false);

// API基础URL
const API_BASE = window.API_BASE;

const clearResponse = () => {
  challengeResponse.value = '';
};

const submitBlindbox = () => {
  emit('submit-blindbox');
}

const submitChallenge = () => {
  if (!challengeResponse.value.trim()) return;
  emit('submit-challenge',challengeResponse.value);
};

const publishChallenge = () => {
  if (!challengeResponse.value.trim()) return;
  emit('publish-challenge',challengeResponse.value);
}

const viewExample = () => {
  emit('view-example');
}

const prevStep = () => {
    emit('prev-step');
}

const copyFeedback = () => {
  emit('copy-feedback');
};

const getTagColor = (type) => {
  return perspectiveTypes[type]?.color || '#3498db';
};
</script>

<style scoped>
/* 视角挑战区域 */
.challenge-section {
  display: block;
  animation: fadeInUp 0.8s ease;
}

.challenge-header {
  text-align: center;
  margin-bottom: 30px;
}

.current-perspective {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.perspective-hint-text {
  font-size: 16px;
  color: #7f8c8d;
}

.perspective-creation {
  text-align: left;
  padding: 10px 50px;
  font-size: 14px;
}
.perspective-creation .mb-3 {
  padding:0 30px;
}

.response-input-area {
  max-width: 800px;
  margin: 0 auto 30px;
}

.response-input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: #f1f2f6;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e74c3c;
  color: white;
}

.ai-feedback {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  border-left: 5px solid;
  position: relative;
}

.feedback-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.perspective-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
}

.feedback-title {
  font-weight: 600;
  color: #2c3e50;
}

.copy-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 18px;
}

.copy-btn:hover {
  color: #2980b9;
}

.feedback-content {
  margin-bottom: 15px;
}

.feedback-section {
  margin-bottom: 15px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #2c3e50;
}

.feedback-text {
  color: #34495e;
  line-height: 1.6;
}
.custom-textarea {
  width: 100%;
  min-height: 120px;
  padding: 20px 20px 0 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  resize: none;
  transition: all 0.3s ease;
  font-family: inherit;
}
button {
  margin-bottom: 5px;
}
button+button {
  margin-left:10px;
}
</style>
