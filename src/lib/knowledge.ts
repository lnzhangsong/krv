// 全书论证树：按「总问题 → 四大部 → 各步论证 → 概念」的层级组织。
// 学习型站点（Kialo 论证树 / CmapTools 概念图）普遍采用这种树状可读结构，而非节点连线图。
// k 为术语库键（悬浮/点按取完整定义）；refs 为 commentDB 句读键，点按概念时在面板展开原文+邓晓芒讲解。

export interface ArgNode {
  label: string;
  k?: string; // 术语库键
  def?: string; // 内联定义（无术语库条目时）
  note?: string; // 一句话说明（始终显示在框内）
  refs?: string[]; // 相关句读键
}

export interface ArgStep {
  rel?: string; // 上一步到此步的关系标注（箭头文字）
  nodes: ArgNode[];
}

export interface ArgBranch {
  key: string;
  title: string;
  question: string;
  color: string;
  steps: ArgStep[];
}

export const ROOT: { label: string; def: string } = {
  label: '先天综合判断如何可能？',
  def: '全书总问题：数学、自然科学何以既扩展知识、又必然普遍；形而上学能否成为科学。',
};

export const MAIN_LINE = [
  '数学可能 —— 时空是先天直观形式',
  '知识可能 —— 范畴靠统觉/先验演绎成立',
  '形而上学失败 —— 理性追求无条件必生幻相',
  '未来建立 —— 方法论划界，交棒实践理性',
];

export const ARG_BRANCHES: ArgBranch[] = [
  {
    key: 'aesthetic',
    title: '先验感性论',
    question: '数学如何可能？',
    color: '#1a5f4e',
    steps: [
      {
        nodes: [
          {
            label: '空间',
            k: '空间',
            note: '外感官先天直观形式 · 几何的基础',
            refs: ['ae-space-m1', 'ae-space-m2', 'ae-space-m3', 'ae-space-m4', 'ae-space-trans', 'ae-space-inner', 'ae-space-concl1'],
          },
          {
            label: '时间',
            k: '时间',
            note: '内感官先天直观形式 · 算术的基础',
            refs: ['ae-time-m1', 'ae-time-m2', 'ae-time-m3', 'ae-time-m4', 'ae-time-trans', 'ae-time-inner', 'ae-time-basis', 'ae-time-arithmetic'],
          },
          {
            label: '外感官',
            k: '外感官',
            note: '对象在空间中被表象',
            refs: ['ae-space-inner'],
          },
          {
            label: '内感官',
            k: '内感官',
            note: '自我及状态在时间中；时间比空间更根本',
            refs: ['ae-time-inner', 'ae-time-basis'],
          },
        ],
      },
      {
        rel: '都是纯直观',
        nodes: [
          {
            label: '纯直观',
            k: '纯直观',
            note: '非概念、非经验抽象，先于经验给出形式',
            refs: ['ae-space-m3', 'ae-time-m3', 'ae-space-trans', 'ae-time-trans'],
          },
        ],
      },
      {
        rel: '奠基',
        nodes: [
          {
            label: '数学',
            def: '几何（空间）与算术（时间）——先天综合科学的典范，奠基在纯直观上。',
            note: '既扩展知识，又必然普遍',
            refs: ['ae-math-foundation', 'ae-time-arithmetic', 'ae-space-geometry-detail', 'intro-math'],
          },
        ],
      },
      {
        rel: '先验观念性 = 经验实在性',
        nodes: [
          {
            label: '先验观念性',
            k: '先验观念性',
            note: '时空只是主观直观形式，非物自体属性',
            refs: ['ae-emp-real', 'ae-emp-real-proof', 'ae-space-concl2', 'ae-time-concl2'],
          },
          {
            label: '经验实在性',
            k: '经验实在性',
            note: '现象中的对象在经验上客观实在',
            refs: ['ae-emp-real', 'ae-emp-real-proof'],
          },
        ],
      },
      {
        rel: '划界',
        nodes: [
          {
            label: '现象',
            k: '现象',
            note: '我们唯一能认识的对象',
            refs: ['ae-phenomena-only', 'intro-phenomena-noumena', 'ae-noumena-unknowable'],
          },
          {
            label: '物自体',
            k: '物自体',
            note: '不可知但可思，限制概念',
            refs: ['ae-noumena-unknowable', 'intro-phenomena-noumena'],
          },
        ],
      },
      {
        rel: 'B版辩护',
        nodes: [
          {
            label: '反驳观念论',
            k: '反驳观念论',
            note: '内意识的时间规定预设外物持久',
            refs: ['ae-b-refutation-proof', 'ae-refutation-ps', 'pref-b-scandal'],
          },
        ],
      },
    ],
  },
  {
    key: 'analytic',
    title: '先验分析论',
    question: '自然科学（知识）如何可能？',
    color: '#3a5a8c',
    steps: [
      {
        nodes: [
          {
            label: '判断',
            k: '判断',
            note: '把表象带到统觉的统一之下',
            refs: ['an-judg-quantity', 'an-judg-quality', 'an-judg-relation', 'an-judg-modality'],
          },
          {
            label: '判断表',
            k: '判断表',
            note: '量/质/关系/模态 × 3 = 12 种判断形式',
            refs: ['an-judg-quantity', 'an-judg-quality', 'an-judg-relation', 'an-judg-modality', 'an-cat-clue'],
          },
          {
            label: '范畴表',
            k: '范畴表',
            note: '由判断表引申而来，共 12 范畴',
            refs: ['an-cat-table-full', 'an-cat-system', 'an-cat-metaphys-ded'],
          },
          {
            label: '范畴',
            k: '范畴',
            note: '12 个先天概念，统一直观杂多',
            refs: ['an-cat-ded-idea', 'an-cat-quantity', 'an-cat-quality', 'an-cat-relation-sub', 'an-cat-relation-cause', 'an-cat-relation-comm', 'an-cat-modality'],
          },
        ],
      },
      {
        rel: '最高原理',
        nodes: [
          {
            label: '统觉',
            k: '统觉',
            note: '「我思」必须能伴随我一切表象',
            refs: ['an-ded-b-apper', 'an-ded-b-131', 'an-ded-b-apper-unity', 'an-apperception-synthetic'],
          },
        ],
      },
      {
        rel: '证明范畴适用一切经验',
        nodes: [
          {
            label: '先验演绎',
            k: '先验演绎',
            note: 'A版自下而上（三重综合）/ B版自上而下（统觉）',
            refs: ['an-ded-necessity', 'an-ded-b-judg', 'an-ded-b-obj', 'an-ded-b-limit', 'an-ded-a-apper', 'an-ded-a-repro', 'an-ded-a-recog'],
          },
        ],
      },
      {
        rel: 'A版：三重综合',
        nodes: [
          {
            label: '想象力',
            k: '想象力',
            note: '领会 / 再生 / 认定 的心理发生',
            refs: ['an-ded-a-imag', 'an-ded-a-reproduction', 'an-ded-threefold'],
          },
        ],
      },
      {
        rel: '范畴翻译为时间',
        nodes: [
          {
            label: '图型',
            k: '图型',
            note: '范畴（逻辑）与直观（感性）之间的中介',
            refs: ['an-schema-def', 'an-schema-necessity', 'an-schema-time-all'],
          },
          {
            label: '时间图型',
            k: '时间图型',
            note: '量=数 · 因果=有规则相继 · 实体=持久',
            refs: ['an-schema-quant', 'an-schema-qual', 'an-schema-sub', 'an-schema-cause', 'an-schema-comm', 'an-schema-mod', 'an-schema-time-all'],
          },
        ],
      },
      {
        rel: '衍生',
        nodes: [
          {
            label: '原理体系',
            k: '原理体系',
            note: '直观公理 / 知觉预测 / 经验类比 / 思维公设',
            refs: ['an-prin-axiom', 'an-prin-ant', 'an-prin-anal1', 'an-prin-anal2', 'an-prin-anal3', 'an-prin-post1', 'an-prin-post2', 'an-prin-post3'],
          },
        ],
      },
      {
        rel: '第二类比 · 回击休谟',
        nodes: [
          {
            label: '因果律',
            def: '第二类比：一切变化按因果规律联结；区分客观相继与主观联想，正面回击休谟。',
            note: '客观时间秩序的条件',
            refs: ['an-prin-anal2', 'an-prin-anal2-proof', 'an-prin-anal2-objective', 'an-schema-cause-detail'],
          },
          {
            label: '休谟怀疑论',
            k: '怀疑论',
            note: '把因果当心理习惯，被因果律反驳',
            refs: ['meth-history-scep'],
          },
        ],
      },
      {
        rel: '范畴只能经验地用',
        nodes: [
          {
            label: '现象',
            k: '现象',
            note: '范畴的合法应用领域',
            refs: ['an-phen-noum', 'an-phen-noum-limits'],
          },
          {
            label: '物自体',
            k: '物自体',
            note: '范畴超验使用无意义；本体是限制概念',
            refs: ['an-phen-noum-limits', 'an-noumena-negative', 'an-phen-noum-positive'],
          },
        ],
      },
    ],
  },
  {
    key: 'dialectic',
    title: '先验辩证论',
    question: '形而上学为何失败？',
    color: '#8e2a2a',
    steps: [
      {
        nodes: [
          {
            label: '理性',
            k: '理性',
            note: '追求无条件总体，与知性相对',
            refs: ['dia-ide-logic', 'dia-illusion-logic'],
          },
        ],
      },
      {
        rel: '产生理念',
        nodes: [
          {
            label: '理念',
            k: '理念',
            note: '灵魂 / 世界 / 上帝',
            refs: ['dia-idea-soul', 'dia-idea-world', 'dia-idea-god', 'dia-ide-logic'],
          },
        ],
      },
      {
        rel: '超验使用',
        nodes: [
          {
            label: '先验幻相',
            k: '先验幻相',
            note: '理性本性使然、不可避免的假象',
            refs: ['dia-illusion', 'dia-illusion-inevitable', 'dia-illusion-logic'],
          },
        ],
      },
      {
        rel: '三种体现',
        nodes: [
          {
            label: '谬误推理',
            k: '谬误推理',
            note: '从「我思」推出灵魂：实体/单纯/人格/不朽',
            refs: ['dia-para-1', 'dia-para-2', 'dia-para-3', 'dia-para-4', 'dia-para-syllogism'],
          },
          {
            label: '二律背反',
            k: '二律背反',
            note: '把世界当整体，正反皆可证；共四组',
            refs: ['dia-anti-intro', 'dia-anti1-res', 'dia-anti2-res', 'dia-anti-key'],
          },
          {
            label: '数学二律',
            k: '数学二律',
            note: '世界有限/无限、单纯/可分：皆假（无总体）',
            refs: ['dia-anti1-thesis', 'dia-anti1-antith', 'dia-anti2-thesis', 'dia-anti2-antith'],
          },
          {
            label: '力学二律',
            k: '力学二律',
            note: '自由/必然：皆真，分属现象与物自体',
            refs: ['dia-anti3-res', 'dia-anti4-res', 'dia-freedom-moral'],
          },
        ],
      },
      {
        rel: '上帝三证明 · 被击破',
        nodes: [
          {
            label: '本体论证明',
            k: '本体论证明',
            note: '从概念推出上帝存在',
            refs: ['dia-onto-refutation', 'dia-onto-100thaler', 'dia-onto-full'],
          },
          {
            label: '存在不是谓词',
            k: '存在不是谓词',
            note: '100塔勒：存在只是设定，不是属性',
            refs: ['dia-onto-refutation', 'dia-onto-100thaler'],
          },
          {
            label: '宇宙论证明',
            k: '宇宙论证明',
            note: '从偶然推必然，暗中依赖本体论',
            refs: ['dia-cosmo', 'dia-cosmo-full', 'dia-cosmo-detail'],
          },
          {
            label: '自然神学证明',
            k: '自然神学证明',
            note: '至多证明建筑师，非全能造物主',
            refs: ['dia-physico', 'dia-physico-full', 'dia-physico-detail'],
          },
        ],
      },
      {
        rel: '理念的正确用法',
        nodes: [
          {
            label: '调节性使用',
            k: '调节性使用',
            note: '指导研究、不构成知识',
            refs: ['dia-regulative', 'dia-regulative-maxim', 'dia-practical-door'],
          },
        ],
      },
    ],
  },
  {
    key: 'method',
    title: '先验方法论',
    question: '未来形而上学如何建立？',
    color: '#6b4a12',
    steps: [
      {
        nodes: [
          {
            label: '训练',
            k: '训练',
            note: '定义 / 公理 / 证明 / 假设四纪律',
            refs: ['meth-disc-def', 'meth-disc-axiom', 'meth-disc-proof', 'meth-disc-hypo', 'meth-disc-polemic'],
          },
        ],
      },
      {
        rel: '体系化',
        nodes: [
          {
            label: '建筑术',
            k: '建筑术',
            note: '知识是有机体系，不是堆积',
            refs: ['meth-architectonic', 'meth-archi-organism', 'meth-architectonic-detail'],
          },
        ],
      },
      {
        rel: '法规在实践',
        nodes: [
          {
            label: '法规',
            k: '法规',
            note: '实践领域的法则：道德律',
            refs: ['meth-canon', 'meth-canon-reason', 'meth-canon-moral'],
          },
          {
            label: '意见 · 知识 · 信仰',
            def: '按主客观充分性三分：意见两不足，知识两充分，信仰主观足客观不足；道德信仰是理性的。',
            note: '三种判断的划界',
            refs: ['meth-canon-faith', 'meth-canon-belief'],
          },
          {
            label: '至善',
            k: '至善',
            note: '德福一致，需上帝与不朽作公设',
            refs: ['meth-highest-good', 'meth-highest-good-detail', 'meth-highest-good-link'],
          },
        ],
      },
      {
        rel: '哲学史三阶段',
        nodes: [
          {
            label: '独断论',
            k: '独断论',
            note: '沃尔夫：未经批判就建体系',
            refs: ['meth-history-dog'],
          },
          {
            label: '怀疑论',
            k: '怀疑论',
            note: '休谟：摧毁知识基础',
            refs: ['meth-history-scep'],
          },
          {
            label: '批判哲学',
            k: '批判哲学',
            note: '先审查能力再立界',
            refs: ['meth-history-crit', 'meth-history-crit-detail'],
          },
        ],
      },
    ],
  },
];
