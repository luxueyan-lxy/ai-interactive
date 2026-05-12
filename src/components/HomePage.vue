<template>
  <div>
    <!-- <ProgressBar :progress="progress" :completed-challenges="completedChallenges" /> -->
    <div class="reset-container">
      <button v-if="currentStage !== 'input'" class="reset-btn" @click="currentStage = 'input'">
        返回主页
      </button>
    </div>

    <div class="app-container">
      <div class="header">
        <h2>智能辅助创作</h2>
        <p>打开思维方式，探索多元视角</p>
      </div>

      <div class="card-container">
        <InputSection v-if="currentStage === 'input'" v-model:user-input="userInput" :is-generating="isGenerating"
          :topics="topics" :selected-topic-id="selectedTopicId" @submit="submitOpinion" @submit2="startCreation"
          @select-topic="handleTopicSelect" />

        <BlindBoxSection v-if="currentStage === 'blindbox'" :blind-boxes="blindBoxes"
          :is-generating-boxes="isGeneratingBoxes" @open-box="openBlindBox" />

        <ChallengeSection v-if="currentStage === 'challenge'" :current-perspective="currentPerspective"
          :ai-feedback="aiFeedback" :is-submitting-challenge="isSubmittingChallenge" :is-blindBoxes="isBlindBoxes"
          @submit-challenge="submitChallenge" @copy-feedback="copyFeedback" @prev-step="challengeSectionPrev"
          @submit-blindbox="submitOpinion" @view-example="viewExample" @publish-challenge="publishChallenge" />

      </div>
    </div>

    <ExamplePanel v-if="showExample" :user-input="userInput" :current-perspective="currentPerspective"
      @close="showExample = false" />

    <UnlockModal v-if="showUnlockModal" @close="showUnlockModal = false" @view="viewHiddenBox" />

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
import { fetchData, postData, deleteData } from '../axiosConfig.js';

// 应用状态
const currentStage = ref('input'); // 'input' | 'blindbox' | 'challenge'

// 用户输入
const userInput = ref('');
const isGenerating = ref(false);
const selectedTopicId = ref(null);
const isInputFocused = ref(false);
const isListening = ref(false);

const isBlindBoxes = ref(false);
const topics = ref([]);

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

// 初始化
onMounted(() => {
  completedChallenges.value = 0;
  loadHotList();
});

// 加载热搜列表
const loadHotList = async () => {
  try {
    let params = {
      Limit: 6
    }
    // const data = {
    //   "Code": 0,
    //   "Message": "success",
    //   "Data": {
    //     "Total": 6,
    //     "Items": [
    //       {
    //         "Title": "迪士尼的速通机制，为什么会让一部分人破防？",
    //         "Url": "https://www.zhihu.com/question/2036558081312679727",
    //         "ThumbnailUrl": "https://pic3.zhimg.com/v2-000cb11b4a815cb7f70ec059dd3400c6.jpg",
    //         "Summary": "最近看到很多人在讨论迪士尼“速通”到底公不公平。 有人觉得，大家都买了门票，凭什么有的人可以走快速通道，二十分钟玩到项目，而普通人却要排两三个小时？ 还有人认为，这种机制本质上就是“有钱人插队”，是在用金钱羞辱普通游客。但与此同时，也有人觉得，速通本来就是一种付费服务，本质上和商务舱、VIP通道没区别。 真正让人难受的，也许并不是“插队”本身，而是人与人之间资源、时间和能力差距被赤裸裸摆在眼前。这让我…",
    //         "id": "https://www.zhihu.com/question/2036558081312679727"
    //       },
    //       {
    //         "Title": "追觅创始人俞浩回应被比作贾跃亭，称「乐视从头到尾都在亏损，而追觅的主业一直是盈利的」，如何理解？",
    //         "Url": "https://www.zhihu.com/question/2029535031119426147",
    //         "ThumbnailUrl": "https://pic4.zhimg.com/v2-07429821ff0336864f47d024710a902f.jpg",
    //         "Summary": "晚点：你怎么看有人把你比作贾跃亭？ 俞浩：如果只看局部，什么结论都能得出来。 晚点：你觉得自己和贾跃亭的相同之处，和不同之处分别是什么？ 俞浩：追觅有一个左侧模型和右侧模型。左侧关于如何做好经营；右侧是如何获得社会资源。贾跃亭的问题是，他几乎完全活在右侧，他没挣过钱，乐视从头到尾都在亏损，而追觅的主业一直是盈利的。 https://mp.weixin.qq.com/s/Uru-vz4irZo_GG-GgOTf6Q",
    //         "id": "https://www.zhihu.com/question/2029535031119426147"
    //       },
    //       {
    //         "Title": "清华硕士参与智力测验仅得25分，本人回应学习工作均无困难，为何测试结果与现实有偏差？智商测试还可信吗？",
    //         "Url": "https://www.zhihu.com/question/2037104805538182041",
    //         "ThumbnailUrl": "https://pic4.zhimg.com/v2-17d19789db19a419857c02eb8c7c456b.jpg",
    //         "Summary": "5月10日，网友@是一颗努力的豆子分享自己在硕士入学当月在三甲精神科参与瑞文智力测验仅得25分的经历。潇湘晨报晨视频记者采访该名网友了解到，她在2022年硕士入学当月因身体出现眩晕问题，未检查出病理性原因后转至精神科就诊。在众多检查中，包含一项名为瑞文推理测验（Raven Test)的测验内容。 [图片] 她回忆：“那天有一堆量表，做的时候已经很崩溃了，然后我的得分25分，在报告单的说明里是介于不能自理到能自理之间，所以我大受…",
    //         "id": "https://www.zhihu.com/question/2037104805538182041"
    //       },
    //       {
    //         "Title": "美国总统特朗普时隔九年再度对中国进行国事访问，双方可能会就哪些问题进行磋商？较上次访华会有什么变化？",
    //         "Url": "https://www.zhihu.com/question/2037161087863353508",
    //         "ThumbnailUrl": "https://pic4.zhimg.com/v2-ac9d0e7e28b7b32773ed26212f59fe83.jpg",
    //         "Summary": "外交部发言人5月11日宣布：应国家主席习近平邀请，美利坚合众国总统唐纳德·特朗普将于5月13日至15日对中国进行国事访问。 https://mp.weixin.qq.com/s/A_JLGW98FwgnJhg-o78Byw?scene=1&click_id=8",
    //         "id": "https://www.zhihu.com/question/2037161087863353508"
    //       },
    //       {
    //         "Title": "印尼携手菲律宾打造「镍OPEC」，不断推动镍出口新政，这对中企有何影响，对经济有何影响？",
    //         "Url": "https://www.zhihu.com/question/2036749487478199013",
    //         "ThumbnailUrl": "https://pic3.zhimg.com/v2-505cef410d52ac6465f03b7583f7faa6.jpg",
    //         "Summary": "原料 | 印尼与菲律宾携手合作，强化全球关键矿产供应链 印尼镍矿新政冲击波：中企百亿美元投资影响几何？_腾讯新闻 印度尼西亚央行正式实施外汇交易报告新规 印尼镍矿新政引爆全球镍价 华友钴业公告称，公司印尼子公司华飞镍钴因硫磺价格大幅上涨及产线高负荷运行，自2026年5月1日起对部分产线临时停产检修，预计影响约50%产量。2025年度，华飞镍钴营业收入为144.95亿元，占公司营业收入的17.89%；华飞镍钴实现净利润12.52亿元，公司…",
    //         "id": "https://www.zhihu.com/question/2036749487478199013"
    //       },
    //       {
    //         "Title": "新物种广西两头蛇被发现，这一物种有什么特点？它和普通蛇类有何不同？该发现有什么意义？",
    //         "Url": "https://www.zhihu.com/question/2035777804357169920",
    //         "ThumbnailUrl": "https://pic4.zhimg.com/v2-9811d270c2bc2d168eb9dc6cc3bd7d23.jpg",
    //         "Summary": "中新网 南宁5月7日电 (李双林)广西林业部门6日介绍，近日，广西花坪国家级自然保护区境内发现两头蛇科两头蛇属新物种——广西两头蛇。该成果已发布于国际动物分类学期刊。 [图片] 图为广西两头蛇。莫运明供图 此次新物种发现，源于花坪保护区综合科学考察的两栖爬行类动物资源外业调查。广西自然博物馆科考团队在保护区银杉管理站片区海拔约760米的阔叶林带开展野外调查时，意外捕获到这种小型无毒蛇类。 据科考团队介绍，广西两头蛇体型…",
    //         "id": "https://www.zhihu.com/question/2035777804357169920"
    //       }
    //     ]
    //   }
    // }
    const data = await fetchData('/api/v1/content/hot_list',params);
    console.log(data);
    if (data && data.Data && data.Data.Items) {
      topics.value = data.Data.Items
      console.log(topics.value);
      for (let i = 0; i < topics.value.length; i++) {
        if (!topics.value[i].id) topics.value[i].id = topics.value[i].Url
      }
    }
  } catch (error) {
    console.log(error);
    topics.value = presetTopics
  } finally {

  }
};

// 处理话题选择
const handleTopicSelect = (topicId) => {
  selectedTopicId.value = topicId;
  const selectedTopic = topics.value.find(topic => topic.id === topicId);
  if (selectedTopic) {
    userInput.value = selectedTopic.Title;
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
    if (data && data.data) {
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
    hint: '',
    // creation_prompts: {}
  };
}

const openBlindBox = (index) => {
  //   if (blindBoxes.value[index].opened) return;

  // 播放开盒音效
  const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
  audio.volume = 0.5;
  audio.play().catch(() => { });

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
    hint: blindBoxes.value[index].hint,
    creation_prompts: blindBoxes.value[index].creation_prompts,
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
    if (data && data.data) {
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

const publishChallenge = () => {
  ElMessage({
    message: '已发表！',
    type: 'success',
    duration: 3000
  });
}

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
  if (isBlindBoxes.value == true) {
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

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 防止水平滚动 */
html,
body {
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
  padding: 10px;
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
  padding: 5px 20px;
  width: 1000px;
  margin: 0 auto;
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

button + button {
  margin-left: 10px;
}

.submit-btn {
  background: #1772f6;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 10px;
  font-size: 16px;
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
.prev-btn {
  background: rgba(6, 38, 182, 0.1);
  color: #1772f6;
  border: 2px solid #1772f6;
  padding: 8px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

</style>
