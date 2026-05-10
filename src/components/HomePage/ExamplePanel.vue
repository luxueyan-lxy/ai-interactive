<template>
  <div class="example-panel" :class="{ active: show }">
    <div class="example-header">
      <div class="example-title">{{ userInput }}</div>
      <!-- <p>对比不同视角，深化你的思考</p> -->
    </div>
    
    <div class="vs-container">
      
      <div class="view-box" :style="{ borderColor: getTagColor(currentPerspective.type) }">
        <!-- <div class="view-label">{{ getPerspectiveLabel(currentPerspective.type) }}</div> -->
        <div class="view-content" v-html="article.html"></div>
      </div>
    </div>
    
    <div class="analysis-section" v-if="aiFeedback">
      <div class="analysis-title">AI分析</div>
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
    
    <div class="example-buttons">
      <button class="panel-btn switch-btn" @click="closePanel">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue';
import { perspectiveTypes,mockAIFeedback } from '../../data/mockData.js';
import axios from 'axios';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userInput: {
    type: String,
    default: ''
  },
  currentPerspective: {
    type: Object,
    default: () => ({})
  },
});

const emit = defineEmits(['close']);

// API基础URL
const API_BASE = window.API_BASE;

const article = ref({})
const aiFeedback = ref(null);

onMounted(() => {
  generateArticle();
});

// 文章生成
const generateArticle = async () => {
  try {
      const response = await axios.post(`${API_BASE}/api/generate-article`, {
          topic: props.userInput, 
          perspective_type: props.currentPerspective.type,
          target_length: 300
      });
      
      const data = response.data;
      if(data && data.data) {
        article.value = data.data.article
        if(article.value.content) {
          article.value.html = article.value.content.replaceAll('\n','<br>');
          analysis(article.value.content)
        }
      }
      
  } catch (error) {
      console.log(error);
  } finally {
      
  }
};

const analysis = async (content) => {
  try {
      const response = await axios.post(`${API_BASE}/api/analyze-viewpoint`, {
          original_text: props.userInput, 
          response_text: content,
          perspective_type: props.currentPerspective.type
      });
      
      const data = response.data;
      if(data && data.data) {
        // 生成AI反馈
        aiFeedback.value = data.data.analysis || {
          positive: '你的观点很有启发性。',
          suggestion: '可以尝试从更多角度进行思考。'
        };
      }
  } catch (error) {
      // 生成AI反馈
      aiFeedback.value = mockAIFeedback[props.currentPerspective.type] || {
        positive: '你的观点很有启发性。',
        suggestion: '可以尝试从更多角度进行思考。'
      };
  } finally {
      
  }
}

const closePanel = () => {
  emit('close');
};

const getTagColor = (type) => {
  return perspectiveTypes[type]?.color || '#3498db';
};

const getPerspectiveLabel = (type) => {
  return perspectiveTypes[type]?.label || '未知视角';
};

const highlightKeywords = (text) => {
  return text.replace(/<span class="highlight" style="color: (#[0-9a-fA-F]{6});">(.*?)<\/span>/g, '<span style="color: $1; font-weight: 700;">$2</span>');
};
</script>

<style scoped>
/* 视角对比面板 */
.example-panel {
  position: fixed;
  top: 0;
  right: 0;
  /* width: 33.33%; */
  height: 100%;
  width:500px;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  /* transform: translateX(100%);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); */
  z-index: 1000;
  overflow-y: auto;
}

.example-panel.active {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .example-panel {
    width: 100%;
  }
}

.example-header {
  text-align: center;
  margin-bottom: 30px;
}

.example-title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.vs-container {
  display: flex;
  align-items: center;
  margin: 30px 0;
  gap: 20px;
}

.view-box {
  flex: 1;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #e0e0e0;
}

.view-label {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.view-content {
  color: #2c3e50;
  text-align: left;
}

.vs-icon {
  font-size: 40px;
  color: #9b59b6;
  font-weight: 900;
}

.analysis-section {
  margin: 30px 0;
}

.analysis-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2c3e50;
}

.analysis-point {
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
  color: #7f8c8d;
}

.analysis-point:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #3498db;
}

.highlight {
  font-weight: 700;
}

.example-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  position: fixed;
  bottom: 5px;
  right:20px;
  width:460px;
}

.panel-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
}

.switch-btn {
  background: white;
  color: #3498db;
  border-color: #3498db;
}

.switch-btn:hover {
  background: #3498db;
  color: white;
}

.confirm-btn {
  background: #2ecc71;
  color: white;
  border-color: #2ecc71;
}

.confirm-btn:hover {
  background: #27ae60;
  border-color: #27ae60;
}
</style>
