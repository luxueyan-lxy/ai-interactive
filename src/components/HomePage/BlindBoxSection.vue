<template>
  <div class="blind-box-section">
    <div class="blind-boxes-container">
      <div
        v-for="(box, index) in blindBoxes"
        :key="index"
        class="blind-box"
        :class="{
          'closed': !box.opened,
          'flipped': box.opened,
          'generating': isGeneratingBoxes
        }"
        @click="openBlindBox(index)"
      >
        <div class="blind-box-inner">
          <!-- 盲盒正面 -->
          <div class="blind-box-front">
            <div class="box-icon">
              <el-icon><Box /></el-icon>
            </div>
            <div class="box-title"> {{ getPerspectiveLabel(box.type) }}</div>
            <div class="box-desc">点击打开探索新视角</div>
          </div>
          
          <!-- 盲盒背面 -->
          <div class="blind-box-back" :style="{ borderColor: getTagColor(box.type) }">
            <div class="perspective-tag" :class="box.type">
              {{ getPerspectiveLabel(box.type) }}
            </div>
            <div class="perspective-content">
              <div class="perspective-title">{{ box.title }}</div>
              <div class="perspective-hint">{{ box.hint }}</div>
              <!-- <div class="perspective-challenge">
                <small>点击查看挑战</small>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { perspectiveTypes } from '../../data/mockData.js';

const props = defineProps({
  blindBoxes: {
    type: Array,
    default: () => []
  },
  isGeneratingBoxes: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['open-box']);

const onBoxHover = () => {
  // 播放音效
  const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

const openBlindBox = (index) => {
  onBoxHover();
  emit('open-box', index);
};

const getTagColor = (type) => {
  return perspectiveTypes[type]?.color || '#3498db';
};

const getPerspectiveLabel = (type) => {
  return perspectiveTypes[type]?.label || '未知视角';
};
</script>

<style scoped>
/* 盲盒区域样式 */
.blind-box-section {
  display: block;
  animation: fadeInUp 0.8s ease;
}

.blind-boxes-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .blind-boxes-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .blind-boxes-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

.blind-box {
  perspective: 1000px;
  height: 250px;
  cursor: pointer;
}

.blind-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.blind-box.flipped .blind-box-inner {
  transform: rotateY(180deg);
}

.blind-box.closed {
  animation: float 3s ease-in-out infinite;
}

.blind-box-front,
.blind-box-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.blind-box-front {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e0e0e0;
}

.blind-box-back {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transform: rotateY(180deg);
  border: 2px solid;
  overflow: hidden;
}

.box-icon {
  font-size: 40px;
  margin-bottom: 15px;
  color: #3498db;
}

.box-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.box-desc {
  font-size: 14px;
  color: #7f8c8d;
  text-align: center;
}

.perspective-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.perspective-tag.opposite {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.perspective-tag.neutral {
  background: linear-gradient(45deg, #3498db, #2980b9);
}

.perspective-tag.supplement {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
}

.perspective-tag.unique {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
}

.perspective-tag.historical {
  background: linear-gradient(45deg, #f39c12, #c47b05);
}

.perspective-tag.global {
  background: linear-gradient(45deg, #1abc9c, #03a585);
}

.perspective-content {
  text-align: center;
  width: 100%;
}

.perspective-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #2c3e50;
}

.perspective-hint {
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.5;
  margin-bottom: 20px;
}

/* 盲盒生成动画 */
.blind-box.generating {
  animation: rotate 1s ease-in-out, blink 0.5s ease-in-out 2, float 0.5s ease-in-out 2;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotateY(0); }
  to { transform: rotateY(360deg); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
