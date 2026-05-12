// 视角类型配置
export const perspectiveTypes = {
  opposite: {
    label: '对立视角',
    color: '#e74c3c',
    description: '与你的初始观点完全相反'
  },
  neutral: {
    label: '中立视角',
    color: '#3498db',
    description: '站在客观中立的角度分析'
  },
  supplement: {
    label: '补充视角',
    color: '#2ecc71',
    description: '补充你未考虑的方面'
  },
  unique: {
    label: '小众视角',
    color: '#9b59b6',
    description: '从非主流角度思考问题'
  },
  historical: {
    label: "历史视角",
    color: "#f39c12",
    description: "从历史发展的角度看问题"
  },
  global: {
    label: "全球视角",
    color: "#1abc9c",
    description: "从国际化和全球化的角度思考"
  }
};

// 预设话题
export const presetTopics = [
  {
    id: 'topic_001',
    Title: '线上办公 vs 线下办公',
    content: '线上办公比线下办公更高效',
    description: '比较远程办公和传统办公室工作的优缺点',
    icon: 'fas fa-laptop-house',
    tags: ['工作', '效率', '未来趋势']
  },
  {
    id: 'topic_002',
    Title: '人工智能的利弊',
    content: '人工智能对人类就业的威胁被夸大了',
    Summary: '探讨AI发展对人类社会和就业的影响',
    icon: 'fas fa-robot',
    tags: ['科技', '就业', '伦理']
  },
  {
    id: 'topic_003',
    Title: '短视频的影响',
    content: '短视频对青少年发展弊大于利',
    Summary: '讨论短视频平台对年轻人认知和价值观的影响',
    icon: 'fas fa-video',
    tags: ['媒体', '教育', '青少年']
  },
  {
    id: 'topic_004',
    Title: '环保与发展的平衡',
    content: '经济发展不应以牺牲环境为代价',
    Summary: '探讨经济发展与环境保护之间的平衡关系',
    icon: 'fas fa-leaf',
    tags: ['环境', '经济', '可持续发展']
  },
  {
    id: 'topic_005',
    Title: '大学专业选择',
    content: '选择热门专业比选择兴趣专业更重要',
    Summary: '讨论大学专业选择的策略和考量因素',
    icon: 'fas fa-graduation-cap',
    tags: ['教育', '职业', '选择']
  },
  {
    id: 'topic_006',
    Title: '城市与乡村生活',
    content: '大城市的生活质量比小城市更高',
    Summary: '比较不同规模城市的生活体验和优缺点',
    icon: 'fas fa-city',
    tags: ['生活', '城市', '社会']
  }
];

// 模拟的盲盒数据
export const mockBlindBoxes = [
  {
    type: 'opposite',
    title: '对立视角：线下办公比线上办公更好',
    hint: '请站在"线下办公更优"的角度，阐述至少1个支撑理由',
    creation_prompts: {
      thinking_directions: [
        "角色转换：如果你是对方的支持者，会怎么想？",
        "利益反转：从对立方的利益角度重新思考",
        "假设翻转：如果前提条件完全相反会怎样？"
      ],
      questions_to_ask: [
        "逻辑漏洞：原观点的逻辑链条哪里最脆弱？",
        "证据不足：哪些关键论据缺乏支持？",
        "前提假设：原观点基于哪些可能错误的假设？",
        "极端推演：将观点推向极端会暴露什么问题？"
      ]
    },
    opened: false
  },
  {
    type: 'neutral',
    title: '中立视角：线上线下混合办公是趋势',
    hint: '请客观分析混合办公模式的优缺点',
    creation_prompts: {
      thinking_directions: [
        "平衡分析：既看到优点，也思考缺点",
        "多维度比较：从技术、社会、经济、文化等不同维度分析",
        "辩证统一：寻找看似矛盾观点中的统一性"
      ],
      questions_to_ask: [
        "这个观点在什么条件下成立？什么条件下不成立？",
        "哪些群体/情境能从中受益？哪些可能受损？",
        "短期和长期影响分别是什么？",
        "这个观点的适用边界在哪里？"
      ]
    },
    opened: false
  },
  {
    type: 'supplement',
    title: '补充视角：考虑不同行业差异',
    hint: '请从不同行业特性出发，分析办公模式的选择',
    creation_prompts: {
      thinking_directions: [
        "深度延伸：这个观点还能延伸到哪些相关领域？",
        "广度扩展：还有哪些群体/角度值得考虑？",
        "时间延伸：过去、现在、未来的变化趋势如何？"
      ],
      questions_to_ask: [
        "遗漏维度：这个观点忽略了哪些重要方面？",
        "补充论据：可以增加哪些新的证据支持？",
        "交叉领域：与其他领域的交集会带来什么新视角？",
        "发展脉络：这个问题是如何演变成今天的样子的？"
      ]
    },
    opened: false
  },
  {
    type: 'unique',
    title: '小众视角：从环保角度分析',
    hint: '请从环境保护的角度比较两种办公模式',
    creation_prompts: {
      thinking_directions: [
        "逆向思考：与常识相反的思考角度",
        "跨界借鉴：用其他领域的理论解释这个问题",
        "边缘关注：关注被主流忽视的少数群体或现象"
      ],
      questions_to_ask: [
        "非主流视角：儿童/老人/残障人士会怎么看？",
        "创新类比：用其他领域的成功案例如何解释这个问题？",
        "科幻思维：假设100年后的人类会怎么看？",
        "艺术视角：从绘画、音乐、文学的角度有什么启发？"
      ]
    },
    opened: false
  },
  {
    type: 'historical',
    title: '历史视角：线上办公存在明显缺陷',
    hint: '请从历史发展的角度，分析职场领域的演变',
    creation_prompts: {
      thinking_directions: [
        "历史演变：这个问题是如何从过去发展到现在？",
        "历史比较：与历史上的类似问题有何异同？",
        "历史教训：从历史中我们能学到什么经验？"
      ],
      questions_to_ask: [
        "历史渊源：这个问题的根源可以追溯到什么时候？",
        "转折点：历史上哪些关键时刻改变了问题的走向？",
        "周期规律：是否存在某种历史发展的周期模式？",
        "历史影响：历史上的决策如何影响今天的局面？"
      ]
    },
    opened: false
  }
];

// 模拟的AI反馈
export const mockAIFeedback = {
  opposite: {
    positive: '你的反驳很有力度，线下办公的即时沟通优势确实是线上难以替代的。',
    suggestion: '可以进一步补充线下办公对团队协作和创造力的促进作用，让观点更完整。'
  },
  neutral: {
    positive: '你的分析很全面，混合办公确实能兼顾灵活性和协作效率。',
    suggestion: '可以深入探讨混合办公对管理方式的挑战及应对策略。'
  },
  supplement: {
    positive: '你考虑到了行业差异性，这一点很重要。',
    suggestion: '可以举例说明具体哪些行业更适合线上或线下办公。'
  },
  unique: {
    positive: '环保视角很有创意，这是很多人忽视的角度。',
    suggestion: '可以用具体数据说明两种办公模式的碳排放差异。'
  }
};

// 模拟的对比分析
export const mockComparisonAnalysis = [
  '两种观点分别强调了<span class="highlight" style="color: #e74c3c;">沟通效率</span>和<span class="highlight" style="color: #3498db;">工作灵活性</span>的不同维度',
  '你的观点更关注<span class="highlight" style="color: #e74c3c;">短期效果</span>，而对立视角考虑了<span class="highlight" style="color: #e74c3c;">长期影响</span>',
  '两者在<span class="highlight" style="color: #2ecc71;">团队协作</span>和<span class="highlight" style="color: #2ecc71;">个人效率</span>的平衡点上存在不同侧重点',
  '你的观点具有<span class="highlight" style="color: #9b59b6;">创新性</span>，对立视角更注重<span class="highlight" style="color: #9b59b6;">可行性</span>',
  '两者都有其<span class="highlight" style="color: #3498db;">合理性</span>，实际选择应结合具体情境'
];
