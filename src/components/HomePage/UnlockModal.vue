<template>
  <div v-if="show" class="unlock-modal" @click.self="closeModal">
    <div class="modal-content">
      <div class="unlock-animation">
        <i class="fas fa-gift"></i>
      </div>
      <div class="modal-title">恭喜解锁隐藏盲盒！</div>
      <div class="modal-text">你已成功完成一个视角挑战，获得隐藏盲盒一枚！</div>
      <div class="modal-buttons">
        <button class="modal-btn later-btn" @click="closeModal">稍后查看</button>
        <button class="modal-btn view-btn" @click="viewHiddenBox">立即查看</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'view']);

const closeModal = () => {
  emit('close');
};

const viewHiddenBox = () => {
  emit('view');
};
</script>

<style scoped>
/* 解锁弹窗 */
.unlock-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.unlock-animation {
  font-size: 60px;
  color: #f1c40f;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2c3e50;
}

.modal-text {
  color: #7f8c8d;
  margin-bottom: 30px;
}

.modal-buttons {
  display: flex;
  gap: 15px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.view-btn {
  background: #f1c40f;
  color: white;
}

.view-btn:hover {
  background: #f39c12;
}

.later-btn {
  background: #bdc3c7;
  color: white;
}

.later-btn:hover {
  background: #95a5a6;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style>
