// 全书论证树：按「总问题 → 四大部 → 各步论证 → 概念」的层级组织。
// 学习型站点（Kialo 论证树 / CmapTools 概念图）普遍采用这种树状可读结构，而非节点连线图。
// k 为术语库键（悬浮/点按取完整定义），否则用 def 兜底。

export interface ArgNode {
  label: string;
  k?: string; // 术语库键
  def?: string; // 内联定义（无术语库条目时）
  note?: string; // 一句话说明（始终显示在框内）
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

export const ARG_BRANCHES: ArgBranch[] = [
  {
    key: 'aesthetic',
    title: '先验感性论',
    question: '数学如何可能？',
    color: '#1a5f4e',
    steps: [
      {
        nodes: [
          { label: '空间', k: '空间', note: '外感官先天直观形式 · 几何的基础' },
          { label: '时间', k: '时间', note: '内感官先天直观形式 · 算术的基础' },
        ],
      },
      {
        rel: '都是纯直观',
        nodes: [{ label: '纯直观', k: '纯直观', note: '非概念、非经验抽象，先于经验给出形式' }],
      },
      {
        rel: '奠基',
        nodes: [{ label: '数学', def: '几何（空间）与算术（时间）——先天综合科学的典范，奠基在纯直观上。', note: '既扩展知识，又必然普遍' }],
      },
      {
        rel: '先验观念性 = 经验实在性',
        nodes: [
          { label: '先验观念性', k: '先验观念性', note: '时空只是主观直观形式，非物自体属性' },
          { label: '经验实在性', k: '经验实在性', note: '现象中的对象在经验上客观实在' },
        ],
      },
      {
        rel: '划界',
        nodes: [
          { label: '现象', k: '现象', note: '我们唯一能认识的对象' },
          { label: '物自体', k: '物自体', note: '不可知但可思，限制概念' },
        ],
      },
      {
        rel: 'B版辩护',
        nodes: [{ label: '反驳观念论', k: '反驳观念论', note: '内意识的时间规定预设外物持久' }],
      },
    ],
  },
  {
    key: 'analytic',
    title: '先验分析论',
    question: '自然科学（知识）如何可能？',
    color: '#1a3a5f',
    steps: [
      {
        nodes: [
          { label: '判断表', k: '判断表', note: '量/质/关系/模态 × 3 = 12 种判断形式' },
          { label: '范畴表', k: '范畴表', note: '由判断表引申而来' },
          { label: '范畴', k: '范畴', note: '12 个先天概念，统一直观杂多' },
        ],
      },
      {
        rel: '最高原理',
        nodes: [{ label: '统觉', k: '统觉', note: '「我思」必须能伴随我一切表象' }],
      },
      {
        rel: '证明范畴适用一切经验',
        nodes: [{ label: '先验演绎', k: '先验演绎', note: 'A版自下而上（三重综合）/ B版自上而下（统觉）' }],
      },
      {
        rel: '范畴翻译为时间',
        nodes: [{ label: '图型', k: '图型', note: '范畴（逻辑）与直观（感性）之间的中介' }],
      },
      {
        rel: '衍生',
        nodes: [{ label: '原理体系', k: '原理体系', note: '直观公理 / 知觉预测 / 经验类比 / 思维公设' }],
      },
      {
        rel: '第二类比 · 回击休谟',
        nodes: [
          { label: '因果律', def: '第二类比：一切变化按因果规律联结；区分客观相继与主观联想，正面回击休谟。', note: '客观时间秩序的条件' },
          { label: '休谟怀疑论', k: '怀疑论', note: '把因果当心理习惯，被因果律反驳' },
        ],
      },
      {
        rel: '范畴只能经验地用',
        nodes: [
          { label: '现象', k: '现象', note: '范畴的合法应用领域' },
          { label: '物自体', k: '物自体', note: '范畴超验使用无意义' },
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
        nodes: [{ label: '理性', k: '理性', note: '追求无条件总体，与知性相对' }],
      },
      {
        rel: '产生理念',
        nodes: [{ label: '理念', k: '理念', note: '灵魂 / 世界 / 上帝' }],
      },
      {
        rel: '超验使用',
        nodes: [{ label: '先验幻相', k: '先验幻相', note: '理性本性使然、不可避免的假象' }],
      },
      {
        rel: '三种体现',
        nodes: [
          { label: '谬误推理', k: '谬误推理', note: '从「我思」推出灵魂' },
          { label: '二律背反', k: '二律背反', note: '把世界当整体，正反皆可证' },
          { label: '本体论证明', k: '本体论证明', note: '从概念推出上帝存在' },
        ],
      },
      {
        rel: '被反驳',
        nodes: [{ label: '存在不是谓词', k: '存在不是谓词', note: '100塔勒：存在只是设定，不是属性' }],
      },
      {
        rel: '理念的正确用法',
        nodes: [{ label: '调节性使用', k: '调节性使用', note: '指导研究、不构成知识' }],
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
        nodes: [{ label: '训练', k: '训练', note: '定义 / 公理 / 证明 / 假设四纪律' }],
      },
      {
        rel: '体系化',
        nodes: [{ label: '建筑术', k: '建筑术', note: '知识是有机体系，不是堆积' }],
      },
      {
        rel: '法规在实践',
        nodes: [
          { label: '法规', k: '法规', note: '实践领域的法则：道德律' },
          { label: '至善', k: '至善', note: '德福一致，需上帝与不朽作公设' },
        ],
      },
      {
        rel: '哲学史三阶段',
        nodes: [
          { label: '独断论', k: '独断论', note: '沃尔夫：未经批判就建体系' },
          { label: '怀疑论', k: '怀疑论', note: '休谟：摧毁知识基础' },
          { label: '批判哲学', k: '批判哲学', note: '先审查能力再立界' },
        ],
      },
    ],
  },
];
