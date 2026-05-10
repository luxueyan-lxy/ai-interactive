<template>
  <div>
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="progress-text">{{ completedChallenges }}/5 次挑战完成</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  completedChallenges: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: #ecf0f1;
  z-index: 1001;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db, #9b59b6);
  width: 0%;
  transition: width 0.5s ease;
}

.progress-text {
  position: fixed;
  top: 10px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  color: #2c3e50;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 1002;
}
</style>