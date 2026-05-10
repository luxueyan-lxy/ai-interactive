<template>
  <div class="comparison-panel" :class="{ active: show }">
    <div class="comparison-header">
      <div class="comparison-title">视角碰撞·辩证思考</div>
      <p>对比不同视角，深化你的思考</p>
    </div>
    
    <div class="vs-container">
      <div class="view-box">
        <div class="view-label">你的初始观点</div>
        <div class="view-content">{{ userInput }}</div>
      </div>
      
      <div class="vs-icon">VS</div>
      
      <div class="view-box" :style="{ borderColor: getTagColor(currentPerspective.type) }">
        <div class="view-label">{{ getPerspectiveLabel(currentPerspective.type) }}视角</div>
        <div class="view-content">{{ currentPerspective.title }}</div>
      </div>
    </div>
    
    <div class="analysis-section">
      <div class="analysis-title">AI分析：差异与合理性</div>
      <div v-for="(point, index) in comparisonAnalysis" :key="index" class="analysis-point">
        <span v-html="highlightKeywords(point)"></span>
      </div>
    </div>
    
    <div class="comparison-buttons">
      <button class="panel-btn switch-btn" @click="closePanel">切换视角</button>
      <button class="panel-btn confirm-btn" @click="confirmSummary">确认总结</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { perspectiveTypes } from '../../data/mockData.js';

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
  comparisonAnalysis: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'confirm']);

const closePanel = () => {
  emit('close');
};

const confirmSummary = () => {
  emit('confirm');
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
.comparison-panel {
  /* position: fixed;
  top: 0;
  right: 0;
  width: 33.33%;
  height: 100%; */
  width:900px;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  /* transform: translateX(100%);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); */
  z-index: 1000;
  overflow-y: auto;
}

.comparison-panel.active {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .comparison-panel {
    width: 100%;
  }
}

.comparison-header {
  text-align: center;
  margin-bottom: 30px;
}

.comparison-title {
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
  font-weight: 700;
  color: #2c3e50;
  font-size: 18px;
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

.comparison-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
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
