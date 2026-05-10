<template>
  <div class="input-section">
    <div class="topic-selector">
      <div class="selector-header">
        <h3>选择话题</h3>
        <p>或在下方的输入框中输入您自己的观点</p>
      </div>
      
      <div class="topics-grid">
        <div
          v-for="(topic,index) in hotList"
          :key="topic.id"
          class="topic-card"
          :class="{ active: selectedTopicId === topic.id }"
          @click="selectTopic(topic.id)"
        >
          <div class="topic-icon" :class="{'topic-3':index<=2}">
            <i>{{ index+1 }}</i>
          </div>
          <div class="topic-content">
            <div class="topic-title">{{ topic.title }}</div>
            <div class="topic-desc">{{ topic.description }}</div>
            <div class="topic-tags">
              <span v-for="tag in topic.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div v-if="selectedTopicId === topic.id" class="selected-indicator">
            <el-icon><CircleCheck /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-area">
      <div class="input-wrapper">
        <div class="dynamic-placeholder" :class="{ focused: isInputFocused || userInput }">
          {{ isInputFocused ? '请大胆输入你想创作的主题' : '输入你的主题（如"线上办公与线下办公哪个更好"）' }}
        </div>
        <textarea
          :value="userInput"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          maxlength="50"
          class="custom-textarea"
          placeholder=""
        ></textarea>
      </div>
      
      <div class="input-controls">
        <div class="char-count" :class="{ warning: userInput.length >= 95 }">
          已输入 {{ userInput.length }}/100
        </div>
        <button
          class="voice-btn"
          :class="{ listening: isListening }"
          @click="toggleVoiceInput"
          title="语音输入"
        >
          <el-icon>
            <Microphone v-if="!isListening" />
            <Mute v-else />
          </el-icon>
        </button>
      </div>
      <div class="tips">没有思路？试试下方按钮“生成思维视角”。已有想法，点击“直接开始创作”。</div>
    </div>
    <button
      class="submit-btn"
      :disabled="!userInput.trim()"
      @click="$emit('submit')"
    >
      生成思维视角
    </button>
    <button
      class="submit-btn"
      :disabled="!userInput.trim()"
      @click="$emit('submit2')"
    >
      直接开始创作
    </button>
    
    <div v-if="isGenerating" class="loading-tip">
      <el-icon><Loading /></el-icon>
      正在生成思维视角...
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue';
import { fetchData, postData, deleteData } from '../../axiosConfig.js';
import axios from 'axios';

const props = defineProps({
  userInput: {
    type: String,
    default: ''
  },
  isGenerating: {
    type: Boolean,
    default: false
  },
  topics: {
    type: Array,
    default: () => []
  },
  selectedTopicId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:userInput', 'submit', 'select-topic', 'submit2']);

const isInputFocused = ref(false);
const isListening = ref(false);
const loading = ref(false);
const hotList = ref([]);

// API基础URL
const API_BASE = window.API_BASE;

onMounted(() => {
  // loadHotList();
  handleClassify();
});

// 加载热搜列表
const loadHotList = async () => {
  try {
    loading.value = true;
    let params = {
      Limit:6
    }
    const data = await fetchData('/api/v1/content/hot_list',params);
    
  } catch (error) {
    
  } finally {
    loading.value = false;
  }
};

// 处理分类
const handleClassify = async () => {
  hotList.value = props.topics
  for(let i=0; i<props.topics.length; i++) {
    let tags = await textClassify(props.topics[i].title);
    if(tags) hotList.value[i].tags = tags;
  }
}

// ai分类
const textClassify = async (textInput) => {
  try {
      const response = await axios.post(`${API_BASE}/api/classify`, {
          text: textInput, 
          top_k: 3 
      });
      
      const data = response.data;
      return data.data.domains
      
  } catch (error) {
      
  } finally {
      
  }
};

const onInput = (event) => {
  emit('update:userInput', event.target.value);
  // 如果输入了自定义内容，取消选中话题
  if (props.selectedTopicId) {
    emit('select-topic', null);
  }
};

const onFocus = () => {
  isInputFocused.value = true;
};

const onBlur = () => {
  isInputFocused.value = false;
};

const toggleVoiceInput = () => {
  isListening.value = !isListening.value;
  
  if (isListening.value) {
    // 模拟语音识别
    setTimeout(() => {
      isListening.value = false;
      // 模拟语音输入结果
      if (props.userInput.length < 40) {
        const newValue = props.userInput + '我认为远程办公可以提高工作效率，节省通勤时间。';
        emit('update:userInput', newValue);
        // 如果输入了自定义内容，取消选中话题
        if (props.selectedTopicId) {
          emit('select-topic', null);
        }
      }
    }, 2000);
  }
};

const selectTopic = (topicId) => {
  emit('select-topic', topicId);
};
</script>

<style scoped>
/* 话题选择器样式 */
.topic-selector {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e9ecef;
  height: 472px;
  overflow: auto;
}

.selector-header {
  text-align: center;
  margin-bottom: 20px;
}

.selector-header h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.selector-header p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  max-height: 400px;
  overflow: auto;
}

@media (max-width: 768px) {
  .topics-grid {
    grid-template-columns: 1fr;
  }
}

.topic-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.topic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #3498db;
}

.topic-card.active {
  border-color: #3498db;
  background: #f0f8ff;
}

.topic-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498db, #2c3e50);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}
.topic-3 {
  background: linear-gradient(135deg, #db8534, #bd4816);
  font-weight: bold;
  font-size: 20px;
}

.topic-content {
  flex: 1;
  min-width: 0;
}

.topic-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
  line-height: 1.3;
}

.topic-desc {
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.selected-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #2ecc71;
  font-size: 16px;
}

/* 输入区域样式 */
.input-section {
  text-align: center;
  transition: all 0.5s ease;
}

.input-area {
  max-width: 800px;
  margin: 0 auto 30px;
}

.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.dynamic-placeholder {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #bdc3c7;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.dynamic-placeholder.focused {
  top: -10px;
  left: 10px;
  font-size: 12px;
  color: #3498db;
  background: white;
  padding: 0 5px;
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

.custom-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.char-count {
  color: #95a5a6;
  font-size: 14px;
}

.char-count.warning {
  color: #e74c3c;
}

.voice-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
}

.voice-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.voice-btn.listening {
  animation: pulse 1.5s infinite;
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.voice-btn i {
  transition: all 0.3s ease;
}

.voice-btn.listening i {
  animation: spin 2s linear infinite;
}
.tips {
  font-size: 12px;
  color: #7f8c8d;
}
button + button {
  margin-left: 10px;
}

.submit-btn {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
}

.submit-btn:disabled {
  background: linear-gradient(45deg, #bdc3c7, #95a5a6);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-tip {
  margin-top: 20px;
  color: #3498db;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-tip i {
  animation: spin 1s linear infinite;
}

/* 动画定义 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
