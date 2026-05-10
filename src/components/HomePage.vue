<template>
  <div>
    <!-- <ProgressBar :progress="progress" :completed-challenges="completedChallenges" /> -->
     <div class="reset-container">
        <button
        v-if="currentStage !== 'input'"
        class="reset-btn"
        @click="currentStage = 'input'"
        >
        返回主页
        </button>
     </div>
    
    <div class="app-container">
      <div class="header">
        <h2>智能辅助创作</h2>
        <p>打开思维方式，探索多元视角</p>
      </div>
      
      <div class="card-container">
        <InputSection 
          v-if="currentStage === 'input'"
          v-model:user-input="userInput"
          :is-generating="isGenerating"
          :topics="presetTopics"
          :selected-topic-id="selectedTopicId"
          @submit="submitOpinion"
          @submit2="startCreation"
          @select-topic="handleTopicSelect"
        />
        
        <BlindBoxSection
          v-if="currentStage === 'blindbox'"
          :blind-boxes="blindBoxes"
          :is-generating-boxes="isGeneratingBoxes"
          @open-box="openBlindBox"
        />
        
        <ChallengeSection
          v-if="currentStage === 'challenge'"
          :current-perspective="currentPerspective"
          :ai-feedback="aiFeedback"
          :is-submitting-challenge="isSubmittingChallenge"
          :is-blindBoxes="isBlindBoxes"
          @submit-challenge="submitChallenge"
          @copy-feedback="copyFeedback"
          @prev-step="challengeSectionPrev"
          @submit-blindbox="submitOpinion"
          @view-example="viewExample"
        />
        
      </div>
    </div>
    
    <ExamplePanel
      v-if="showExample"
      :user-input="userInput"
      :current-perspective="currentPerspective"
      @close="showExample = false"
    />
    
    <UnlockModal
      v-if="showUnlockModal"
      @close="showUnlockModal = false"
      @view="viewHiddenBox"
    />
    
    <CopySuccess v-if="showCopySuccess" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import InputSection from './HomePage/InputSection.vue';
import BlindBoxSection from './HomePage/BlindBoxSection.vue';
import ChallengeSection from './HomePage/ChallengeSection.vue';
import ExamplePanel from './HomePage/ExamplePanel.vue';
// import ProgressBar from './HomePage/ProgressBar.vue';
import UnlockModal from './HomePage/UnlockModal.vue';
import CopySuccess from './HomePage/CopySuccess.vue';
import { mockBlindBoxes, mockAIFeedback, mockComparisonAnalysis, perspectiveTypes, presetTopics } from '../data/mockData.js';

// 应用状态
const currentStage = ref('input'); // 'input' | 'blindbox' | 'challenge'

// 用户输入
const userInput = ref('');
const isGenerating = ref(false);
const selectedTopicId = ref(null);
const isInputFocused = ref(false);
const isListening = ref(false);

const isBlindBoxes = ref(false);

// 盲盒数据
const blindBoxes = ref([]);
const isGeneratingBoxes = ref(false);

// 加载状态
const isLoading = ref(true);
const loadingText = ref('正在初始化AI模型...');

// 当前视角
const currentPerspective = ref({
  type: '',
  title: '',
  hint: ''
});

// 挑战相关
const isSubmittingChallenge = ref(false);
const aiFeedback = ref(null);

// 视角对比
const showExample = ref(false);

// 解锁与进度
const showUnlockModal = ref(false);
const completedChallenges = ref(0);
const progress = computed(() => (completedChallenges.value / 5) * 100);
const showCopySuccess = ref(false);

// API基础URL
const API_BASE = window.API_BASE;

// 处理话题选择
const handleTopicSelect = (topicId) => {
  selectedTopicId.value = topicId;
  const selectedTopic = presetTopics.find(topic => topic.id === topicId);
  if (selectedTopic) {
    userInput.value = selectedTopic.description;
  }
};

// 方法定义
const submitOpinion = async () => {
  if (!userInput.value.trim()) {
      // showMessage('请输入您的观点', 'warning');
      return;
  }
                    
  isGenerating.value = true;
  isLoading.value = true;
  
  try {
      const response = await axios.post(`${API_BASE}/api/generate-perspectives`, {
          text: userInput.value,
          count: 5
      });
      
      const data = response.data;
      if(data && data.data) {
        // 处理返回的视角数据
        blindBoxes.value = data.data.perspectives.map(perspective => ({
            ...perspective,
            opened: false
        }));
      }
      
      // 切换到盲盒界面
      currentStage.value = 'blindbox';
      
  } catch (error) {
      console.error('生成视角失败:', error);
      
      // 如果API失败，使用备用数据
      blindBoxes.value = [...mockBlindBoxes];
      isGenerating.value = false;
      currentStage.value = 'blindbox';
      isGeneratingBoxes.value = true;
      
      // 模拟盲盒生成动画
      setTimeout(() => {
        isGeneratingBoxes.value = false;
      }, 1500);
  } finally {
      isGenerating.value = false;
      isLoading.value = false;
      isBlindBoxes.value = true;
  }
  
  // 模拟生成盲盒
  // setTimeout(() => {
  //   blindBoxes.value = [...mockBlindBoxes];
  //   isGenerating.value = false;
  //   currentStage.value = 'blindbox';
  //   isGeneratingBoxes.value = true;
    
  //   // 模拟盲盒生成动画
  //   setTimeout(() => {
  //     isGeneratingBoxes.value = false;
  //   }, 1500);
  // }, 1500);
};
// 开始创作
const startCreation = () => {
  isBlindBoxes.value = false;
  currentStage.value = 'challenge';
  currentPerspective.value = {
    type: '',
    title: userInput,
    hint: ''
  };
}

const openBlindBox = (index) => {
//   if (blindBoxes.value[index].opened) return;
  
  // 播放开盒音效
  const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
  audio.volume = 0.5;
  audio.play().catch(() => {});
  
  // 打开选中的盲盒
  blindBoxes.value = blindBoxes.value.map((box, i) => {
    if (i === index) {
      return { ...box, opened: true };
    }
    return box;
  });
  
  // 设置当前视角
  currentPerspective.value = {
    type: blindBoxes.value[index].type,
    title: blindBoxes.value[index].title,
    hint: blindBoxes.value[index].hint
  };
  
  // 显示挑战区域
  setTimeout(() => {
    currentStage.value = 'challenge';
  }, 1000);
  isBlindBoxes.value = true;
};

const submitChallenge = async (challengeResponse) => {
  isSubmittingChallenge.value = true;

  try {
      const response = await axios.post(`${API_BASE}/api/analyze-viewpoint`, {
          original_text: userInput.value, 
          response_text: challengeResponse,
          perspective_type: currentPerspective.value.type
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
      aiFeedback.value = mockAIFeedback[currentPerspective.value.type] || {
        positive: '你的观点很有启发性。',
        suggestion: '可以尝试从更多角度进行思考。'
      };
      
  } finally {
      isSubmittingChallenge.value = false;
  }
  
  // 模拟AI处理
  // const processTime = Math.min(3000, 1000 + Math.random() * 2000);
  
  // setTimeout(() => {
  //   isSubmittingChallenge.value = false;
    
  //   // 生成AI反馈
  //   aiFeedback.value = mockAIFeedback[currentPerspective.value.type] || {
  //     positive: '你的观点很有启发性。',
  //     suggestion: '可以尝试从更多角度进行思考。'
  //   };
    
  //   // 显示对比面板
  //   setTimeout(() => {
  //     showExample.value = true;
  //   }, 500);
    
  // }, processTime);
};

const viewExample = () => {
  showExample.value = true;
}

const copyFeedback = () => {
  if (!aiFeedback.value) return;
  
  const text = `AI反馈：\n👍 肯定部分：${aiFeedback.value.positive}\n💡 优化建议：${aiFeedback.value.suggestion}`;
  
  navigator.clipboard.writeText(text).then(() => {
    showCopySuccess.value = true;
    setTimeout(() => {
      showCopySuccess.value = false;
    }, 3000);
  }).catch(err => {
    console.error('复制失败:', err);
  });
};

const challengeSectionPrev = () => {
  if(isBlindBoxes.value == true) {
    currentStage.value = 'blindbox';
  } else {
    currentStage.value = 'input';
  }
};

const confirmSummary = () => {
  showExample.value = false;
  completedChallenges.value++;
  
  // 检查是否需要显示解锁弹窗
  if (completedChallenges.value === 1) {
    setTimeout(() => {
      showUnlockModal.value = true;
    }, 500);
  }
  
  // 检查是否完成所有挑战
  if (completedChallenges.value >= 5) {
    setTimeout(() => {
      alert('🎉 恭喜你完成所有挑战！获得"辩证思维大师"称号！');
    }, 1000);
  }
  
  // 重置挑战状态
  setTimeout(() => {
    currentStage.value = 'blindbox';
    aiFeedback.value = null;
    blindBoxes.value = blindBoxes.value.map(box => ({ ...box, opened: false }));
  }, 500);
};

const viewHiddenBox = () => {
  showUnlockModal.value = false;
  
  // 添加隐藏盲盒
  const hiddenBox = {
    type: 'unique',
    title: '隐藏视角：从老年人视角看待线上办公',
    hint: '请站在60岁以上老年人的角度，分析线上办公的可行性与挑战',
    opened: false
  };
  
  blindBoxes.value.push(hiddenBox);
  
  // 显示提示消息
  ElMessage({
    message: '隐藏盲盒已添加到你的盲盒列表！',
    type: 'success',
    duration: 3000
  });
};

// 初始化
onMounted(() => {
  completedChallenges.value = 0;
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 防止水平滚动 */
html, body {
    overflow-x: hidden;
    width: 100%;
    height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  transition: background 0.5s ease;
}

.app-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* 头部标题样式 */
.header {
  text-align: center;
  margin-bottom: 20px;
  animation: fadeInDown 0.8s ease;
}

.header h2 {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* 卡片容器样式 */
.card-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-height: 400px;
  position: relative;
}

/* 动画定义 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 重新开始 */
.reset-container {
    text-align: right;
    padding:5px 20px;
    width:1000px;
    margin:0 auto;
}
.reset-btn {
  background: #399fe2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>
