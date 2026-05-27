// ===================== 页面路由管理 =====================
// V1.1 - 导航层级重构：
//   监测模块(一级) → 监测项目列表 / 刷新记录日志
//   新建监测 = 从项目列表打开的子页面（面包屑: 监测项目列表 > 新建监测 > 某类型）
//   监测结果 = 从项目卡片点击打开的子页面（面包屑: 监测项目列表 > 项目名）

const breadcrumbs = {
  'monitor-list': '监测模块 / <span>监测项目列表</span>',
  'monitor-config': '监测项目列表 / <span class="breadcrumb-link" onclick="showPage(\'monitor-list\')">监测项目列表</span> <span class="breadcrumb-sep">›</span> <span class="breadcrumb-link" onclick="openCreateMenu()">新建监测</span> <span class="breadcrumb-sep">›</span> <span>通用关键词监测</span>',
  'account-monitor': '监测项目列表 / <span class="breadcrumb-link" onclick="showPage(\'monitor-list\')">监测项目列表</span> <span class="breadcrumb-sep">›</span> <span class="breadcrumb-link" onclick="openCreateMenu()">新建监测</span> <span class="breadcrumb-sep">›</span> <span>媒体账号专项监测</span>',
  'ai-monitor': '监测项目列表 / <span class="breadcrumb-link" onclick="showPage(\'monitor-list\')">监测项目列表</span> <span class="breadcrumb-sep">›</span> <span class="breadcrumb-link" onclick="openCreateMenu()">新建监测</span> <span class="breadcrumb-sep">›</span> <span>AI智能创建</span><span class="tag-recommend">推荐</span>',
  'result-list': '监测项目列表 / <span class="breadcrumb-link" onclick="showPage(\'monitor-list\')">监测项目列表</span> <span class="breadcrumb-sep">›</span> <span id="breadcrumb-project-name">项目名称</span> / <span>监测数据</span>',
  'refresh-log': '监测模块 / <span>刷新记录日志</span>',
  'report-list': '智能报告 / <span>报告管理</span>',
  'report-ai-create': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-list\')">报告管理</span> <span class="breadcrumb-sep">›</span> <span>AI智能生成报告</span>',
  'report-wizard': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-list\')">报告管理</span> <span class="breadcrumb-sep">›</span> <span>新建报告</span>',
  'report-preview': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-list\')">报告管理</span> <span class="breadcrumb-sep">›</span> <span>报告预览</span>',
  'report-group': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-list\')">报告管理</span> <span class="breadcrumb-sep">›</span> <span>报告组详情</span>',
  'report-edit': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-list\')">报告管理</span> <span class="breadcrumb-sep">›</span> <span>编辑报告</span>',
  'report-template': '智能报告 / <span>报告模板中心</span>',
  'report-template-editor': '智能报告 / <span class="breadcrumb-link" onclick="showPage(\'report-template\')">报告模板中心</span> <span class="breadcrumb-sep">›</span> <span>模板编辑器</span>',
  'account-mgmt': '系统管理 / <span>账号管理</span>',
  'refresh-mgmt': '系统管理 / <span>互动量刷新管理</span>',
  'refresh-rules': '系统管理 / <span class="breadcrumb-link" onclick="showPage(\'refresh-mgmt\')">互动量刷新管理</span> <span class="breadcrumb-sep">›</span> <span>自动刷新规则管理</span>',
  'category-config': '系统管理 / <span>分类设置</span>',
};

let currentContext = { projectId: null, projectName: null, createMode: null };

function showPage(pageId, context) {
  if (context) currentContext = { ...currentContext, ...context };
  document.getElementById('breadcrumb').innerHTML = breadcrumbs[pageId] || pageId;
  if (pageId === 'result-list' && currentContext.projectName) {
    const nameEl = document.getElementById('breadcrumb-project-name');
    if (nameEl) nameEl.textContent = currentContext.projectName;
  }
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });
  const content = document.getElementById('content');
  const renderer = pageRenderers[pageId];
  if (renderer) {
    content.innerHTML = renderer();
    if (pageInits[pageId]) pageInits[pageId]();
  } else {
    console.error('[showPage] NO RENDERER for:', pageId);
    content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted)">页面加载中...</div>';
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// 全局关闭所有下拉菜单
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('open');
    menu.style.display = 'none';
  });
  document.querySelectorAll('.dropdown-toggle').forEach(btn => btn.classList.remove('active'));
}
document.addEventListener('click', closeAllDropdowns);

// ===================== 弹窗管理 =====================
function openModal(title, bodyHtml, footerHtml, width) {
  const modal = document.getElementById('modal');
  modal.style.width = (width || 600) + 'px';
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').innerHTML = footerHtml || '';
  document.getElementById('modal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
}

// ===================== Toast 通知 =====================
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--info)' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span style="color:${colors[type]};font-weight:700;font-size:15px">${icons[type]}</span><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ===================== 模拟数据 =====================
const mockMonitorProjects = [
  { id: 'M001', name: '长安CS75Plus品牌传播监测', type: '关键词监测', status: 'running', platform: ['抖音','快手'], dataCount: 15632, commentCount: 8921, createTime: '2026-04-01', updateTime: '2026-04-10 15:42', sentiment: {pos:65,neg:12,neu:23}, category: {company:'长安', brand:'长安企业', model:'长安CS75'} },
  { id: 'M002', name: '蔚来ET9上市传播监测', type: '媒体账号监测', status: 'running', platform: ['汽车之家','易车网','懂车帝'], dataCount: 8430, commentCount: 3210, createTime: '2026-03-28', updateTime: '2026-04-10 15:38', sentiment: {pos:72,neg:8,neu:20}, category: {company:'蔚来', brand:'蔚来企业', model:'蔚来eT9'} },
  { id: 'M003', name: '比亚迪竞品声量对比监测', type: '关键词监测', status: 'paused', platform: ['微信公众号','新浪微博'], dataCount: 24561, commentCount: 12087, createTime: '2026-03-15', updateTime: '2026-04-09 22:00', sentiment: {pos:58,neg:18,neu:24}, category: {company:'比亚迪', brand:'王朝系列', model:'汉EV'} },
  { id: 'M004', name: '理想L9用户口碑监测', type: '关键词监测', status: 'running', platform: ['小红书','新浪微博'], dataCount: 6789, commentCount: 2341, createTime: '2026-04-05', updateTime: '2026-04-10 15:50', sentiment: {pos:80,neg:5,neu:15}, category: {company:'理想', brand:'理想企业', model:'理想L9'} },
  { id: 'M005', name: '特斯拉Model Y舆情监测', type: '关键词监测', status: 'archived', platform: ['今日头条','百度新闻','网易新闻'], dataCount: 3210, commentCount: 980, createTime: '2026-01-15', updateTime: '2026-03-01 10:22', sentiment: {pos:45,neg:30,neu:25}, category: {company:'其它品牌', brand:'其它品牌', model:'其它'} },
  { id: 'M006', name: '小鹏G9上市前监测', type: '媒体账号监测', status: 'archived', platform: ['凤凰新闻','搜狐新闻','腾讯新闻'], dataCount: 12890, commentCount: 5670, createTime: '2026-02-01', updateTime: '2026-03-20 14:30', sentiment: {pos:55,neg:20,neu:25}, category: {company:'小鹏', brand:'小鹏企业', model:'小鹏G9'} },
  { id: 'M007', name: '吉利星越L品牌监测', type: '关键词监测', status: 'running', platform: ['抖音','快手','微信视频号','哔哩哔哩'], dataCount: 9876, commentCount: 4321, createTime: '2026-04-08', updateTime: '2026-04-12 09:30', sentiment: {pos:68,neg:10,neu:22}, category: {company:'吉利', brand:'吉利企业', model:'星越L'} },
  { id: 'M008', name: '问界M9竞品舆情监测', type: '关键词监测', status: 'paused', platform: ['央媒','省媒'], dataCount: 5432, commentCount: 2100, createTime: '2026-03-20', updateTime: '2026-04-08 16:45', sentiment: {pos:52,neg:25,neu:23}, category: {company:'华为', brand:'华为问界', model:'问界M9'} },
];

// ===================== 车企-品牌-车型三层分类数据 =====================
const carBrandData = [
  { id: 'gwm', name: '长城', brands: [
    { id: 'gwm-gwm', name: '长城企业', models: ['长城C30','长城C50','长城其他'] },
    { id: 'gwm-haval', name: '哈弗', models: ['哈弗H2','哈弗H2s','哈弗H4','哈弗H5','哈弗H6','哈弗H6s','哈弗H7','哈弗H8','哈弗H9','哈弗F5','哈弗M6','哈弗M6PLUS','哈弗P11','哈弗F7','哈弗F7x','哈弗赤兔','哈弗神兽','哈弗猛龙','哈弗枭龙','哈弗初恋','哈弗酷狗','哈弗大狗','哈弗二狗','哈弗其他','哈弗H6L'] },
    { id: 'gwm-ora', name: '欧拉', models: ['欧拉R1','欧拉iQ','欧拉ORA','欧拉R2','欧拉黑猫','欧拉白猫','欧拉好猫','欧拉芭蕾猫','欧拉机甲龙','欧拉5','欧拉闪电猫','欧拉其他'] },
    { id: 'gwm-pickup', name: '长城皮卡', models: ['风骏3','风骏5','风骏6','风骏7','长城炮','金刚炮','山海炮','旅装炮','商用炮','长城火炮','长城D02炮','长城龙弹','长城火弹','长城X炮','长城风骏','长城黑弹','长城皮卡其他'] },
    { id: 'gwm-wey', name: '魏牌', models: ['魏牌VV5','魏牌VV6','魏牌VV7','魏牌P8','魏牌摩卡','魏牌拿铁','魏牌玛奇朵','魏牌全新蓝山','魏牌圆梦','魏牌MPV','魏牌coffee01','魏牌coffee02','魏牌全新高山','魏牌机甲龙','魏牌其他'] },
    { id: 'gwm-tank', name: '坦克', models: ['坦克300','坦克500','坦克400','坦克700','坦克330','坦克800','坦克600','坦克900','坦克其他'] },
    { id: 'gwm-soul', name: '长城灵魂摩托车', models: ['长城灵魂摩托车'] }
  ]},
  { id: 'li', name: '理想', brands: [
    { id: 'li-li', name: '理想企业', models: ['理想ONE','理想X01','理想L9','理想L8','理想W01','理想L8Pro','理想L8Air','理想L8Max','理想L9Pro','理想L9Max','理想Pro','理想MAX','MEGA','理想L6','理想L7','理想其他','理想i8'] }
  ]},
  { id: 'byd', name: '比亚迪', brands: [
    { id: 'byd-byd', name: '比亚迪企业', models: ['比亚迪F0','比亚迪F3','比亚迪S6','比亚迪其他'] },
    { id: 'byd-dynasty', name: '王朝系列', models: ['汉DM-i','汉DM-p','汉EV','唐DM-p','唐EV','唐DM-i','秦PLUS DM-i','秦PLUS EV','秦L','宋L','宋Pro DM-i','宋MAX DM-i','元PLUS','元Pro','元up','王朝系列其他','比亚迪海鸥','比亚迪海豹','比亚迪海豚','比亚迪护卫舰','比亚迪驱逐舰','比亚迪海狮'] },
    { id: 'byd-ocean', name: '海洋系列', models: ['宋PLUS','宋PLUS e2','比亚迪 e2','海狮07','海洋系列其他','比亚迪BYD SHARK'] },
    { id: 'byd-pickup', name: '皮卡', models: ['皮卡系列其他'] },
    { id: 'byd-denza', name: '腾势', models: ['腾势N7','腾势N8','腾势D9','腾势其他','腾势N9'] },
    { id: 'byd-yangwang', name: '仰望', models: ['仰望U8','仰望U7','仰望U9','仰望其他'] },
    { id: 'byd-fangchengbao', name: '方程豹', models: ['豹3','豹5','豹8','SUPER9','SUPER3','方程豹其他'] }
  ]},
  { id: 'chery', name: '奇瑞', brands: [
    { id: 'chery-chery', name: '奇瑞企业', models: ['瑞虎9','瑞虎8 PLUS','瑞虎8 PRO','瑞虎8','瑞虎7','瑞虎7 PLUS','瑞虎5x','瑞虎3x','艾瑞泽8','艾瑞泽5','艾瑞泽5PLUS','艾瑞泽5 GT','探索06','欧萌达','奇瑞其他'] },
    { id: 'chery-jetour', name: '捷途', models: ['捷途旅行者','捷途大圣','捷途X90','捷途X70','捷途山海','捷途山海T2','捷途山海L9','捷途其他'] },
    { id: 'chery-icar', name: 'iCAR', models: ['icarGT','icar 03','icar V23','iCAR其他'] },
    { id: 'chery-fengyun', name: '风云', models: ['奇瑞风云T9','奇瑞风云A8','风云其他'] },
    { id: 'chery-riich', name: '瑞麒', models: ['瑞麒M1','瑞麒M5','瑞麒G3','瑞麒G5','瑞麒G6','瑞麒A6','瑞麒G2','瑞麒M3','瑞麒其他'] },
    { id: 'chery-kaiyi', name: '凯翼', models: ['凯翼昆仑','凯翼轩度','凯翼拾月','凯翼炫界','凯翼X3','凯翼V7','凯翼其他'] },
    { id: 'chery-exeed', name: '星途', models: ['星途揽月','星途凌云','星途瑶光','星途追风','星纪元ET','星纪元ES','瑶光DM','星途TX','星途其他'] },
    { id: 'chery-qoros', name: '观致', models: ['观致7','观致5S','观致3','观致其他'] },
    { id: 'chery-kairy', name: '开瑞', models: ['开瑞K60','开瑞K50','开瑞海豚EV','开瑞优劲T5','开瑞X6','开瑞X70','开瑞其他'] }
  ]},
  { id: 'geely', name: '吉利', brands: [
    { id: 'geely-geely', name: '吉利企业', models: ['星瑞','星越L','星越S','帝豪LHiP','帝豪S','第4代帝豪','缤越COOL','新缤越','博越L','博越Cool','博越X','博越','熊猫mini','熊猫骑士','熊猫卡丁','吉利ICON','嘉际L','豪越L','豪越','远景X6PRo','全球鹰','自由舰','雷达地平线','雷达RD6','银河E8','银河L6','银河L7','吉利其他'] },
    { id: 'geely-zeekr', name: '极氪', models: ['极氪001','极氪007','极氪009','极氪X','极氪其他','极氪9X','极氪7x'] },
    { id: 'geely-lynk', name: '领克', models: ['领克01','领克02','领克03','领克05','领克06','领克07','领克08','领克09','领克其他','领克900'] },
    { id: 'geely-ruiline', name: '睿蓝', models: ['睿蓝7','睿蓝9','睿蓝x3','睿蓝其他'] },
    { id: 'geely-geometry', name: '几何', models: ['几何G6','几何M6','几何e萤火虫','吉利几何A','几何其他'] },
    { id: 'geely-volvo', name: '沃尔沃', models: ['沃尔沃XC60'] }
  ]},
  { id: 'changan', name: '长安', brands: [
    { id: 'changan-changan', name: '长安企业', models: ['长安启源','长安A05','长安A07','长安Q05','长安智电','长安逸达','长安UNI-K','长安UNI-T','长安UNI-V','长安Lumin','长安CS35','长安CS55','长安CS75','长安CS85','长安CS95','长安逸动','长安锐程','长安皮卡','长安览拓者','长安F70','长安猎手','长安其他'] },
    { id: 'changan-deepal', name: '深蓝汽车', models: ['深蓝SL03','深蓝S7','深蓝G318','DEEPAL L07','DEEPAL S07','深蓝其他'] },
    { id: 'changan-avatr', name: '阿维塔', models: ['阿维塔11','阿维塔12','阿维塔其他'] },
    { id: 'changan-oshan', name: '长安欧尚', models: ['欧尚Z6','欧尚X5','奔奔','欧尚X7','长安欧尚其他'] },
    { id: 'changan-kaicheng', name: '长安凯程', models: ['长安凯程F300','长安欧诺S','长安凯程其他'] }
  ]},
  { id: 'huawei', name: '华为', brands: [
    { id: 'huawei-aito', name: '华为问界', models: ['问界M7','问界M5','问界M9','问界赛力斯','华为问界其他','问界M8'] },
    { id: 'huawei-luxeed', name: '华为智界', models: ['智界S7','智界赛力斯','华为智界其他'] },
    { id: 'huawei-享界', name: '华为享界', models: ['享界s9'] }
  ]},
  { id: 'xpeng', name: '小鹏', brands: [
    { id: 'xpeng-xpeng', name: '小鹏企业', models: ['小鹏X9','小鹏G9','小鹏P7','小鹏G6','小鹏P5','小鹏G3','小鹏G3i','小鹏其他'] }
  ]},
  { id: 'nio', name: '蔚来', brands: [
    { id: 'nio-nio', name: '蔚来企业', models: ['蔚来eT9','蔚来ec6','蔚来eT5t','蔚来es6','蔚来ec7','蔚来es8','蔚来eT7','蔚来et5','蔚来es7','蔚来其他'] }
  ]},
  { id: 'xiaomi', name: '小米', brands: [
    { id: 'xiaomi-auto', name: '小米汽车', models: ['小米SU7','小米汽车其他','小米YU7','小米SU7 ultra'] }
  ]},
  { id: 'others', name: '其它品牌', brands: [
    { id: 'others-cadillac', name: '凯迪拉克', models: ['凯迪拉克XT5'] },
    { id: 'others-audi', name: '奥迪汽车', models: ['奥迪Q5L'] }
  ]},
  { id: 'other-monitor', name: '其它监测项目', brands: [
    { id: 'other-monitor-other', name: '其它', models: [] }
  ]}
];

// 三层分类管理数据（支持用户增删改，初始化时深拷贝）
let carBrandConfig = JSON.parse(JSON.stringify(carBrandData));

// 监测列表筛选/排序状态
let monitorListState = {
  search: '',
  status: 'all',
  type: 'all',
  platform: 'all',
  carCompany: 'all',
  carBrand: 'all',
  carModel: 'all',
  sort: 'createTime',
  sortOrder: 'desc',
  tab: 'all',
  page: 1,
  pageSize: 10
};

const mockResultItems = [
  { id: 'C001', title: '长安CS75 PLUS赛博格全新亮相，外观设计大幅升级引发热议', source: '抖音', author: '@汽车大咖说', time: '2026-04-10 14:32', interact: {read:128400,like:8921,comment:1234,share:456}, sentiment: 'pos', views: '观点：外观新颖，科技感强', hasComment: true },
  { id: 'C002', title: '【深度测评】CS75 PLUS vs 途观L 到底谁更值得买？', source: '汽车之家', author: '车评人李明', time: '2026-04-10 12:15', interact: {read:89600,like:3240,comment:567,share:234}, sentiment: 'pos', views: '观点：综合实力强，性价比高', hasComment: true },
  { id: 'C003', title: '长安CS75PLUS车主吐槽：导航系统频繁卡顿，官方至今没解决', source: '微博', author: '@CS75车主群', time: '2026-04-10 11:44', interact: {read:45300,like:1890,comment:892,share:315}, sentiment: 'neg', views: '观点：系统问题，用户不满', hasComment: true },
  { id: 'C004', title: '销量喜人！长安CS75系列3月份销售破3.2万辆创历史新高', source: '今日头条', author: '汽车数据君', time: '2026-04-10 09:20', interact: {read:67800,like:4120,comment:234,share:178}, sentiment: 'pos', views: '观点：销量强劲，品牌认可度高', hasComment: false },
  { id: 'C005', title: '小红书KOL种草视频：CS75 PLUS内饰全升级，女生也爱了！', source: '小红书', author: '美美的车生活', time: '2026-04-10 08:55', interact: {read:23400,like:5670,comment:445,share:89}, sentiment: 'pos', views: '观点：颜值高，女性用户认可', hasComment: true },
];

// mockRefreshLogs 已移至 page-refresh.js

// ===================== 页面渲染器 =====================
const pageRenderers = {};
const pageInits = {};

// 默认加载首页
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => showPage('monitor-list'));
} else {
  showPage('monitor-list');
}

// ===================== 1. 监测项目列表 =====================
pageRenderers['monitor-list'] = () => `
<div class="page-header">
  <div class="page-title">监测项目列表</div>
  <div class="page-actions">
    <button class="btn btn-primary" onclick="openCreateMenu()">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v12M2 8h12"/></svg>
      新建监测项目
    </button>
  </div>
</div>

<div class="stat-grid">
  <div class="stat-card">
    <div class="stat-label">监测项目总数</div>
    <div class="stat-value">${mockMonitorProjects.length}</div>
    <div class="stat-change stat-up">↑ 3 本月新增</div>
    <div class="stat-icon" style="background:var(--primary-bg)">
      <svg viewBox="0 0 20 20" style="color:var(--primary)"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-label">运行中项目</div>
    <div class="stat-value" style="color:var(--success)">${mockMonitorProjects.filter(p=>p.status==='running').length}</div>
    <div class="stat-change">正常运行中</div>
    <div class="stat-icon" style="background:var(--success-bg)">
      <svg viewBox="0 0 20 20" style="color:var(--success)"><circle cx="10" cy="10" r="7" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-label">今日新增数据</div>
    <div class="stat-value">12,847</div>
    <div class="stat-change stat-up">↑ 18.3% vs昨日</div>
    <div class="stat-icon" style="background:var(--info-bg)">
      <svg viewBox="0 0 20 20" style="color:var(--info)"><path d="M3 14l4-4 3 3 4-6 3 2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
    </div>
  </div>
  <div class="stat-card">
    <div class="stat-label">今日消耗洞察豆</div>
    <div class="stat-value red">1,240</div>
    <div class="stat-change stat-down">今日已用</div>
    <div class="stat-icon" style="background:var(--primary-bg)">
      <svg viewBox="0 0 20 20" style="color:var(--primary)"><circle cx="10" cy="10" r="7" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M10 7v6M7.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
    </div>
  </div>
</div>

<!-- 筛选条件区 -->
<div class="filter-bar">
  <div class="search-box">
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="5"/><path d="M13 13l3 3"/></svg>
    <input type="text" id="search-input" placeholder="搜索项目名称..." value="${monitorListState.search}" oninput="handleMonitorSearch(this.value)">
  </div>
  <div class="filter-divider"></div>
  <div class="filter-item">
    <span class="filter-label">状态：</span>
    <select class="filter-select" id="filter-status" onchange="handleMonitorFilter('status', this.value)">
      <option value="all" ${monitorListState.status==='all'?'selected':''}>全部</option>
      <option value="running" ${monitorListState.status==='running'?'selected':''}>运行中</option>
      <option value="paused" ${monitorListState.status==='paused'?'selected':''}>已暂停</option>
      <option value="archived" ${monitorListState.status==='archived'?'selected':''}>归档</option>
    </select>
  </div>
  <div class="filter-item">
    <span class="filter-label">监测类型：</span>
    <select class="filter-select" id="filter-type" onchange="handleMonitorFilter('type', this.value)">
      <option value="all" ${monitorListState.type==='all'?'selected':''}>全部</option>
      <option value="关键词监测" ${monitorListState.type==='关键词监测'?'selected':''}>关键词监测</option>
      <option value="媒体账号监测" ${monitorListState.type==='媒体账号监测'?'selected':''}>媒体账号监测</option>
    </select>
  </div>
  <div class="filter-item dropdown" id="platform-filter-dropdown">
    <span class="filter-label">平台：</span>
    <button class="filter-select dropdown-toggle" onclick="togglePlatformFilter(event)" style="min-width:120px">
      <span id="selected-platform-text">${monitorListState.platform==='all'?'全部平台':monitorListState.platform}</span>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:12px;height:12px;margin-left:auto"><path d="M4 6l4 4 4-4"/></svg>
    </button>
    <div class="dropdown-menu platform-dropdown-menu" onclick="event.stopPropagation()" style="display:none;min-width:240px;padding:8px;max-height:320px;overflow-y:auto">
      <div class="platform-option" onclick="selectPlatformFilter('all')">
        <span class="radio-dot ${monitorListState.platform==='all'?'active':''}"></span>
        <span>全部平台</span>
      </div>
      <div class="platform-group-toggle" onclick="togglePlatformGroup(this)">
        <svg class="toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg>
        <span>短视频平台</span>
      </div>
      <div class="platform-group-items" style="display:none">
        <div class="platform-option" onclick="selectPlatformFilter('抖音')"><span class="radio-dot ${monitorListState.platform==='抖音'?'active':''}"></span><span>抖音</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('快手')"><span class="radio-dot ${monitorListState.platform==='快手'?'active':''}"></span><span>快手</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('微信视频号')"><span class="radio-dot ${monitorListState.platform==='微信视频号'?'active':''}"></span><span>微信视频号</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('哔哩哔哩')"><span class="radio-dot ${monitorListState.platform==='哔哩哔哩'?'active':''}"></span><span>哔哩哔哩</span></div>
      </div>
      <div class="platform-group-toggle" onclick="togglePlatformGroup(this)">
        <svg class="toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg>
        <span>汽车垂类媒体</span>
      </div>
      <div class="platform-group-items" style="display:none">
        <div class="platform-option" onclick="selectPlatformFilter('汽车之家')"><span class="radio-dot ${monitorListState.platform==='汽车之家'?'active':''}"></span><span>汽车之家</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('易车网')"><span class="radio-dot ${monitorListState.platform==='易车网'?'active':''}"></span><span>易车网</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('懂车帝')"><span class="radio-dot ${monitorListState.platform==='懂车帝'?'active':''}"></span><span>懂车帝</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('太平洋汽车')"><span class="radio-dot ${monitorListState.platform==='太平洋汽车'?'active':''}"></span><span>太平洋汽车</span></div>
      </div>
      <div class="platform-group-toggle" onclick="togglePlatformGroup(this)">
        <svg class="toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg>
        <span>社交媒体</span>
      </div>
      <div class="platform-group-items" style="display:none">
        <div class="platform-option" onclick="selectPlatformFilter('微信公众号')"><span class="radio-dot ${monitorListState.platform==='微信公众号'?'active':''}"></span><span>微信公众号</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('新浪微博')"><span class="radio-dot ${monitorListState.platform==='新浪微博'?'active':''}"></span><span>新浪微博</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('小红书')"><span class="radio-dot ${monitorListState.platform==='小红书'?'active':''}"></span><span>小红书</span></div>
      </div>
      <div class="platform-group-toggle" onclick="togglePlatformGroup(this)">
        <svg class="toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg>
        <span>门户新闻媒体</span>
      </div>
      <div class="platform-group-items" style="display:none">
        <div class="platform-option" onclick="selectPlatformFilter('今日头条')"><span class="radio-dot ${monitorListState.platform==='今日头条'?'active':''}"></span><span>今日头条</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('百度新闻')"><span class="radio-dot ${monitorListState.platform==='百度新闻'?'active':''}"></span><span>百度新闻</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('网易新闻')"><span class="radio-dot ${monitorListState.platform==='网易新闻'?'active':''}"></span><span>网易新闻</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('凤凰新闻')"><span class="radio-dot ${monitorListState.platform==='凤凰新闻'?'active':''}"></span><span>凤凰新闻</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('搜狐新闻')"><span class="radio-dot ${monitorListState.platform==='搜狐新闻'?'active':''}"></span><span>搜狐新闻</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('腾讯新闻')"><span class="radio-dot ${monitorListState.platform==='腾讯新闻'?'active':''}"></span><span>腾讯新闻</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('央媒')"><span class="radio-dot ${monitorListState.platform==='央媒'?'active':''}"></span><span>央媒</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('省媒')"><span class="radio-dot ${monitorListState.platform==='省媒'?'active':''}"></span><span>省媒</span></div>
        <div class="platform-option" onclick="selectPlatformFilter('其它媒体')"><span class="radio-dot ${monitorListState.platform==='其它媒体'?'active':''}"></span><span>其它媒体</span></div>
      </div>
    </div>
  </div>
  <button class="btn btn-primary btn-sm" onclick="applyMonitorFilters()" style="margin-left:auto">筛选</button>
  <button class="btn btn-ghost btn-sm" onclick="resetMonitorFilters()">重置</button>
  <button class="btn btn-secondary btn-sm" onclick="openCategorySettingsModal()" style="display:flex;align-items:center;gap:5px">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:13px;height:13px"><circle cx="8" cy="8" r="2.5"/><path d="M8 2v1M8 13v1M2 8h1M13 8h1M3.5 3.5l.7.7M11.8 11.8l.7.7M3.5 12.5l.7-.7M11.8 4.2l.7-.7"/></svg>
    分类设置
  </button>
</div>

<!-- 三层分类筛选区 -->
<div class="filter-bar" id="category-filter-bar" style="margin-top:-8px;padding-top:10px;border-top:none">
  <span class="filter-label" style="color:var(--text-muted);font-size:12px">分类筛选：</span>
  <div class="filter-item">
    <span class="filter-label">车企：</span>
    <select class="filter-select" id="filter-car-company" onchange="handleCarCompanyChange(this.value)" style="min-width:110px">
      <option value="all">全部车企</option>
      ${carBrandConfig.map(c => `<option value="${c.name}" ${monitorListState.carCompany===c.name?'selected':''}>${c.name}</option>`).join('')}
    </select>
  </div>
  <div class="filter-item">
    <span class="filter-label">品牌：</span>
    <select class="filter-select" id="filter-car-brand" onchange="handleCarBrandChange(this.value)" style="min-width:130px">
      <option value="all">全部品牌</option>
      ${(carBrandConfig.find(c=>c.name===monitorListState.carCompany)||{brands:[]}).brands.map(b => `<option value="${b.name}" ${monitorListState.carBrand===b.name?'selected':''}>${b.name}</option>`).join('')}
    </select>
  </div>
  <div class="filter-item">
    <span class="filter-label">车型：</span>
    <select class="filter-select" id="filter-car-model" onchange="handleMonitorFilter('carModel', this.value)" style="min-width:150px">
      <option value="all">全部车型</option>
      ${(((carBrandConfig.find(c=>c.name===monitorListState.carCompany)||{brands:[]}).brands).find(b=>b.name===monitorListState.carBrand)||{models:[]}).models.map(m => `<option value="${m}" ${monitorListState.carModel===m?'selected':''}>${m}</option>`).join('')}
    </select>
  </div>
</div>

<!-- 排序和Tab区 -->
<div class="monitor-list-toolbar">
  <div class="tab-bar" style="margin-bottom:0;border-bottom:none">
    <div class="tab-item ${monitorListState.tab==='all'?'active':''}" onclick="switchMonitorTab('all')">全部项目<span class="tab-count">${getFilteredProjects().length}</span></div>
    <div class="tab-item ${monitorListState.tab==='running'?'active':''}" onclick="switchMonitorTab('running')">运行中<span class="tab-count">${mockMonitorProjects.filter(p=>p.status==='running').length}</span></div>
    <div class="tab-item ${monitorListState.tab==='paused'?'active':''}" onclick="switchMonitorTab('paused')">已暂停<span class="tab-count">${mockMonitorProjects.filter(p=>p.status==='paused').length}</span></div>
    <div class="tab-item ${monitorListState.tab==='archived'?'active':''}" onclick="switchMonitorTab('archived')">归档<span class="tab-count">${mockMonitorProjects.filter(p=>p.status==='archived').length}</span></div>
  </div>
  <div class="sort-selector">
    <span class="filter-label">排序：</span>
    <select class="filter-select" onchange="handleMonitorSort(this.value)">
      <option value="createTime-desc" ${monitorListState.sort==='createTime'&&monitorListState.sortOrder==='desc'?'selected':''}>监测创建时间 ↓</option>
      <option value="createTime-asc" ${monitorListState.sort==='createTime'&&monitorListState.sortOrder==='asc'?'selected':''}>监测创建时间 ↑</option>
      <option value="dataCount-desc" ${monitorListState.sort==='dataCount'&&monitorListState.sortOrder==='desc'?'selected':''}>数据量 ↓</option>
      <option value="dataCount-asc" ${monitorListState.sort==='dataCount'&&monitorListState.sortOrder==='asc'?'selected':''}>数据量 ↑</option>
    </select>
  </div>
</div>

<!-- 监测任务列表 -->
<div id="project-list">
  ${renderMonitorProjectList()}
</div>

<!-- 分页 -->
<div class="pagination" id="project-pagination"></div>
`;

// ===================== 监测项目列表函数 =====================
function getFilteredProjects() {
  let list = [...mockMonitorProjects];
  
  // 搜索过滤
  if (monitorListState.search) {
    list = list.filter(p => p.name.toLowerCase().includes(monitorListState.search.toLowerCase()));
  }
  
  // 状态过滤
  if (monitorListState.status !== 'all') {
    list = list.filter(p => p.status === monitorListState.status);
  }
  
  // 类型过滤
  if (monitorListState.type !== 'all') {
    list = list.filter(p => p.type === monitorListState.type);
  }
  
  // 平台过滤
  if (monitorListState.platform !== 'all') {
    list = list.filter(p => p.platform.includes(monitorListState.platform));
  }

  // 三层分类过滤
  if (monitorListState.carCompany !== 'all') {
    list = list.filter(p => p.category && p.category.company === monitorListState.carCompany);
  }
  if (monitorListState.carBrand !== 'all') {
    list = list.filter(p => p.category && p.category.brand === monitorListState.carBrand);
  }
  if (monitorListState.carModel !== 'all') {
    list = list.filter(p => p.category && p.category.model === monitorListState.carModel);
  }
  
  // Tab过滤
  if (monitorListState.tab !== 'all') {
    list = list.filter(p => p.status === monitorListState.tab);
  }
  
  // 排序
  list.sort((a, b) => {
    let valA, valB;
    if (monitorListState.sort === 'createTime') {
      valA = new Date(a.createTime);
      valB = new Date(b.createTime);
    } else {
      valA = a.dataCount;
      valB = b.dataCount;
    }
    return monitorListState.sortOrder === 'desc' ? valB - valA : valA - valB;
  });
  
  return list;
}

function renderMonitorProjectList() {
  const list = getFilteredProjects();
  if (list.length === 0) {
    return '<div class="empty-state"><div style="font-size:48px;margin-bottom:12px">📋</div><div>暂无监测项目</div></div>';
  }
  
  // 分页
  const total = list.length;
  const totalPages = Math.ceil(total / monitorListState.pageSize);
  if (monitorListState.page > totalPages) monitorListState.page = totalPages || 1;
  
  const start = (monitorListState.page - 1) * monitorListState.pageSize;
  const pagedList = list.slice(start, start + monitorListState.pageSize);
  
  // 渲染分页
  renderProjectPagination(total, totalPages);
  
  return pagedList.map(p => renderProjectCard(p)).join('');
}

function renderProjectPagination(total, totalPages) {
  const container = document.getElementById('project-pagination');
  if (!container) return;
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = `<div class="page-info">共 ${total} 条，每页 ${monitorListState.pageSize} 条</div>`;
  html += '<div class="page-btns">';
  
  // 上一页
  html += `<button class="page-btn" onclick="goToProjectPage(${monitorListState.page - 1})" ${monitorListState.page === 1 ? 'disabled' : ''}>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 4l-4 4 4 4"/></svg>
  </button>`;
  
  // 页码
  const maxVisible = 5;
  let startPage = Math.max(1, monitorListState.page - 2);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  if (startPage > 1) {
    html += `<button class="page-btn" onclick="goToProjectPage(1)">1</button>`;
    if (startPage > 2) html += '<span class="page-ellipsis">...</span>';
  }
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === monitorListState.page ? 'active' : ''}" onclick="goToProjectPage(${i})">${i}</button>`;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += '<span class="page-ellipsis">...</span>';
    html += `<button class="page-btn" onclick="goToProjectPage(${totalPages})">${totalPages}</button>`;
  }
  
  // 下一页
  html += `<button class="page-btn" onclick="goToProjectPage(${monitorListState.page + 1})" ${monitorListState.page === totalPages ? 'disabled' : ''}>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg>
  </button>`;
  
  html += '</div>';
  container.innerHTML = html;
}

function goToProjectPage(page) {
  const list = getFilteredProjects();
  const totalPages = Math.ceil(list.length / monitorListState.pageSize);
  if (page < 1 || page > totalPages) return;
  monitorListState.page = page;
  document.getElementById('project-list').innerHTML = renderMonitorProjectList();
}

function renderProjectCard(p) {
  const statusMap = { running: ['running','运行中'], paused: ['paused','已暂停'], archived: ['archived','归档'] };
  const [sc, st] = statusMap[p.status] || ['stopped','未知'];
  const tagClass = p.status === 'running' ? 'tag-green' : p.status === 'paused' ? 'tag-orange' : 'tag-gray';
  const typeTag = p.type === '关键词监测' ? 'tag-blue' : 'tag-purple';
  return `
  <div class="list-item-card" onclick="openProjectResult('${p.id}', '${p.name.replace(/'/g, "\\'")}')">
    <div class="list-item-header">
      <div class="flex gap-8" style="align-items:center;flex:1;min-width:0">
        <span class="status-dot status-${sc}"></span>
        <span class="list-item-title">${p.name}</span>
        <span class="tag ${typeTag}" style="font-size:10px;flex-shrink:0">${p.type}</span>
      </div>
      <span class="tag ${tagClass}">${st}</span>
    </div>
    <div class="list-item-body" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div class="list-item-meta">
        <span>📊 数据量 <strong style="color:var(--text-primary)">${p.dataCount.toLocaleString()}</strong></span>
        <span>💬 评论量 <strong style="color:var(--text-primary)">${p.commentCount.toLocaleString()}</strong></span>
        <span>🕐 创建于 ${p.createTime}</span>
        <span>🌐 ${p.platform.slice(0, 3).join(' · ')}${p.platform.length > 3 ? '...' : ''}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;flex-shrink:0">
        <div class="sentiment-inline">
          <span class="node-positive">正 ${p.sentiment.pos}%</span>
          <span class="node-negative">负 ${p.sentiment.neg}%</span>
          <span class="node-neutral">中 ${p.sentiment.neu}%</span>
        </div>
        <div class="flex gap-6" style="align-items:center;flex-shrink:0">
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openProjectActions('${p.id}')">编辑配置</button>
          <div class="dropdown" style="position:relative">
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();toggleProjectActionsDropdown(event, '${p.id}')" title="更多操作">···</button>
            <div class="dropdown-menu project-actions-menu" id="actions-${p.id}" style="display:none;min-width:140px;right:0;left:auto">
              ${p.status === 'archived' ? '' : `<div class="dropdown-item" onclick="event.stopPropagation();toggleProjectStatus('${p.id}', '${p.status === 'running' ? 'paused' : 'running'}')">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:14px;height:14px"><rect x="3" y="3" width="10" height="10" rx="1"/></svg>
                ${p.status === 'running' ? '暂停监测' : '开启监测'}
              </div>`}
              <div class="dropdown-item danger" onclick="event.stopPropagation();deleteProject('${p.id}')">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:14px;height:14px"><path d="M3 5h10M6 5V3h4v2M5 5v8h6V5"/></svg>
                删除监测
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function toggleProjectActionsDropdown(e, projectId) {
  e.stopPropagation();
  const menu = document.getElementById('actions-' + projectId);
  if (menu) {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }
}

function toggleProjectStatus(projectId, newStatus) {
  const project = mockMonitorProjects.find(p => p.id === projectId);
  if (project) {
    project.status = newStatus;
    renderProjectList();
    showToast(newStatus === 'running' ? '监测已开启' : '监测已暂停');
  }
}

function deleteProject(projectId) {
  const project = mockMonitorProjects.find(p => p.id === projectId);
  if (project && confirm('确定要删除监测项目「' + project.name + '」吗？此操作不可恢复。')) {
    const idx = mockMonitorProjects.findIndex(p => p.id === projectId);
    if (idx !== -1) {
      mockMonitorProjects.splice(idx, 1);
      renderProjectList();
      showToast('监测项目已删除');
    }
  }
}

function renderProjectList() {
  document.getElementById('project-list').innerHTML = renderMonitorProjectList();
  // 更新Tab计数
  document.querySelectorAll('.tab-item').forEach(tab => {
    const status = tab.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
    if (status) {
      const count = status === 'all' ? mockMonitorProjects.length : mockMonitorProjects.filter(p => p.status === status).length;
      const countEl = tab.querySelector('.tab-count');
      if (countEl) countEl.textContent = count;
    }
  });
}

function handleMonitorSearch(value) {
  monitorListState.search = value;
  monitorListState.page = 1;
}

function handleMonitorFilter(key, value) {
  monitorListState[key] = value;
  monitorListState.page = 1;
}

function handleMonitorSort(value) {
  const [sort, order] = value.split('-');
  monitorListState.sort = sort;
  monitorListState.sortOrder = order;
  monitorListState.page = 1;
  renderProjectList();
}

function switchMonitorTab(tab) {
  monitorListState.tab = tab;
  monitorListState.page = 1;
  document.querySelectorAll('.tab-bar .tab-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('onclick')?.includes("'" + tab + "'"));
  });
  renderProjectList();
}

function applyMonitorFilters() {
  monitorListState.page = 1;
  renderProjectList();
  closeAllDropdowns();
}

function resetMonitorFilters() {
  monitorListState = { search: '', status: 'all', type: 'all', platform: 'all', carCompany: 'all', carBrand: 'all', carModel: 'all', sort: 'createTime', sortOrder: 'desc', tab: 'all', page: 1, pageSize: 10 };
  document.getElementById('search-input').value = '';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('filter-type').value = 'all';
  document.getElementById('selected-platform-text').textContent = '全部平台';
  document.querySelectorAll('.dropdown-menu .radio-dot').forEach(dot => dot.classList.remove('active'));
  const cc = document.getElementById('filter-car-company');
  if (cc) cc.value = 'all';
  refreshCarBrandSelect('all');
  refreshCarModelSelect('all', 'all');
  document.querySelectorAll('.tab-bar .tab-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('onclick')?.includes("'all'"));
  });
  renderProjectList();
}

function togglePlatformFilter(e) {
  e.stopPropagation();
  closeAllDropdowns();
  const menu = document.querySelector('.platform-dropdown-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  e.currentTarget.classList.toggle('active');
  if (menu.style.display === 'block') {
    menu.classList.add('open');
  }
}

function selectPlatformFilter(platform) {
  monitorListState.platform = platform;
  document.getElementById('selected-platform-text').textContent = platform === 'all' ? '全部平台' : platform;
  document.querySelectorAll('.platform-dropdown-menu .radio-dot').forEach(dot => dot.classList.remove('active'));
  // 找到对应选项并激活
  const options = document.querySelectorAll('.platform-option');
  options.forEach(opt => {
    if (opt.textContent.trim() === platform || (platform === 'all' && opt.textContent.trim() === '全部平台')) {
      opt.querySelector('.radio-dot')?.classList.add('active');
    }
  });
  closeAllDropdowns();
  // 刷新列表
  document.getElementById('project-list').innerHTML = renderMonitorProjectList();
}

function togglePlatformGroup(btn) {
  const groupItems = btn.nextElementSibling;
  const icon = btn.querySelector('.toggle-icon');
  if (groupItems && groupItems.classList.contains('platform-group-items')) {
    const isOpen = groupItems.style.display !== 'none';
    groupItems.style.display = isOpen ? 'none' : 'block';
    icon.style.transform = isOpen ? '' : 'rotate(90deg)';
  }
}

// ===================== 三层分类筛选联动 =====================
function handleCarCompanyChange(company) {
  monitorListState.carCompany = company;
  monitorListState.carBrand = 'all';
  monitorListState.carModel = 'all';
  refreshCarBrandSelect(company);
  refreshCarModelSelect(company, 'all');
}

function handleCarBrandChange(brand) {
  monitorListState.carBrand = brand;
  monitorListState.carModel = 'all';
  refreshCarModelSelect(monitorListState.carCompany, brand);
}

function refreshCarBrandSelect(company) {
  const sel = document.getElementById('filter-car-brand');
  if (!sel) return;
  const brands = company === 'all' ? [] : (carBrandConfig.find(c => c.name === company) || {brands:[]}).brands;
  sel.innerHTML = '<option value="all">全部品牌</option>' + brands.map(b => `<option value="${b.name}">${b.name}</option>`).join('');
}

function refreshCarModelSelect(company, brand) {
  const sel = document.getElementById('filter-car-model');
  if (!sel) return;
  let models = [];
  if (company !== 'all' && brand !== 'all') {
    const comp = carBrandConfig.find(c => c.name === company);
    if (comp) {
      const br = comp.brands.find(b => b.name === brand);
      if (br) models = br.models;
    }
  }
  sel.innerHTML = '<option value="all">全部车型</option>' + models.map(m => `<option value="${m}">${m}</option>`).join('');
}

// ===================== 分类设置弹窗 =====================
let categorySettingsTab = 0; // 0=车企, 1=品牌, 2=车型
let categoryEditCompany = null;
let categoryEditBrand = null;

function openCategorySettingsModal() {
  categorySettingsTab = 0;
  categoryEditCompany = carBrandConfig[0]?.name || null;
  categoryEditBrand = carBrandConfig[0]?.brands[0]?.name || null;
  renderCategorySettingsModal();
}

function renderCategorySettingsModal() {
  const body = buildCategorySettingsBody();
  openModal('分类设置', body, `<button class="btn btn-ghost" onclick="closeModal()">关闭</button>`, 760);
}

function buildCategorySettingsBody() {
  const tabs = ['车企管理', '品牌管理', '车型管理'];
  const tabHtml = `<div class="tab-bar" style="margin-bottom:16px">${tabs.map((t,i)=>`<div class="tab-item${categorySettingsTab===i?' active':''}" onclick="switchCategoryTab(${i})">${t}</div>`).join('')}</div>`;

  let content = '';
  if (categorySettingsTab === 0) {
    // 车企管理
    content = `
      <div style="display:flex;justify-content:flex-end;margin-bottom:10px">
        <button class="btn btn-primary btn-sm" onclick="addCategoryItem('company')">+ 添加车企</button>
      </div>
      <table class="data-table" style="width:100%">
        <thead><tr><th>序号</th><th>车企名称</th><th>品牌数量</th><th>操作</th></tr></thead>
        <tbody>
          ${carBrandConfig.map((c,i)=>`
            <tr>
              <td style="color:var(--text-muted)">${i+1}</td>
              <td><strong>${c.name}</strong></td>
              <td><span class="tag tag-blue">${c.brands.length} 个品牌</span></td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editCategoryItem('company','${c.name}')">编辑</button>
                <button class="btn btn-ghost btn-sm danger" onclick="deleteCategoryItem('company','${c.name}')">删除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } else if (categorySettingsTab === 1) {
    // 品牌管理
    const compOpts = carBrandConfig.map(c=>`<option value="${c.name}"${categoryEditCompany===c.name?' selected':''}>${c.name}</option>`).join('');
    const selComp = carBrandConfig.find(c=>c.name===categoryEditCompany) || {brands:[]};
    content = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <span class="filter-label">选择车企：</span>
        <select class="filter-select" onchange="categoryEditCompany=this.value;renderCategorySettingsModal()" style="min-width:130px">${compOpts}</select>
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="addCategoryItem('brand')">+ 添加品牌</button>
      </div>
      <table class="data-table" style="width:100%">
        <thead><tr><th>序号</th><th>品牌名称</th><th>车型数量</th><th>操作</th></tr></thead>
        <tbody>
          ${selComp.brands.map((b,i)=>`
            <tr>
              <td style="color:var(--text-muted)">${i+1}</td>
              <td><strong>${b.name}</strong></td>
              <td><span class="tag tag-blue">${b.models.length} 个车型</span></td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editCategoryItem('brand','${b.name}')">编辑</button>
                <button class="btn btn-ghost btn-sm danger" onclick="deleteCategoryItem('brand','${b.name}')">删除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } else {
    // 车型管理
    const compOpts = carBrandConfig.map(c=>`<option value="${c.name}"${categoryEditCompany===c.name?' selected':''}>${c.name}</option>`).join('');
    const selComp = carBrandConfig.find(c=>c.name===categoryEditCompany) || {brands:[]};
    const brandOpts = selComp.brands.map(b=>`<option value="${b.name}"${categoryEditBrand===b.name?' selected':''}>${b.name}</option>`).join('');
    const selBrand = selComp.brands.find(b=>b.name===categoryEditBrand) || {models:[]};
    content = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
        <span class="filter-label">车企：</span>
        <select class="filter-select" onchange="categoryEditCompany=this.value;categoryEditBrand=carBrandConfig.find(c=>c.name===this.value)?.brands[0]?.name||null;renderCategorySettingsModal()" style="min-width:110px">${compOpts}</select>
        <span class="filter-label">品牌：</span>
        <select class="filter-select" onchange="categoryEditBrand=this.value;renderCategorySettingsModal()" style="min-width:120px">${brandOpts}</select>
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="addCategoryItem('model')">+ 添加车型</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;min-height:60px">
        ${selBrand.models.map(m=>`
          <div class="tag tag-gray" style="display:flex;align-items:center;gap:4px;padding:4px 10px">
            <span>${m}</span>
            <span style="cursor:pointer;color:var(--text-muted);margin-left:2px" onclick="editCategoryItem('model','${m.replace(/'/g,"\\'")}')">✎</span>
            <span style="cursor:pointer;color:var(--danger);margin-left:2px" onclick="deleteCategoryItem('model','${m.replace(/'/g,"\\'")}')">✕</span>
          </div>`).join('') || '<span style="color:var(--text-muted);font-size:13px">暂无车型，点击右上角添加</span>'}
      </div>`;
  }
  return tabHtml + content;
}

function switchCategoryTab(idx) {
  categorySettingsTab = idx;
  renderCategorySettingsModal();
}

function addCategoryItem(type) {
  const inputLabel = type === 'company' ? '车企名称' : type === 'brand' ? '品牌名称' : '车型名称';
  const bodyHtml = `<div class="form-group"><label class="form-label">${inputLabel}</label><input class="form-input" id="category-add-input" placeholder="请输入${inputLabel}" style="width:100%"></div>`;
  const footerHtml = `
    <button class="btn btn-ghost" onclick="renderCategorySettingsModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmAddCategory('${type}')">确认添加</button>`;
  openModal(`添加${inputLabel}`, bodyHtml, footerHtml, 400);
}

function confirmAddCategory(type) {
  const val = document.getElementById('category-add-input')?.value?.trim();
  if (!val) { showToast('名称不能为空', 'error'); return; }
  if (type === 'company') {
    if (carBrandConfig.find(c=>c.name===val)) { showToast('车企已存在', 'error'); return; }
    carBrandConfig.push({ id: 'custom-' + Date.now(), name: val, brands: [] });
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    if (!comp) { showToast('请先选择车企', 'error'); return; }
    if (comp.brands.find(b=>b.name===val)) { showToast('品牌已存在', 'error'); return; }
    comp.brands.push({ id: 'custom-' + Date.now(), name: val, models: [] });
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (!brand) { showToast('请先选择品牌', 'error'); return; }
    if (brand.models.includes(val)) { showToast('车型已存在', 'error'); return; }
    brand.models.push(val);
  }
  showToast('添加成功');
  renderCategorySettingsModal();
}

function editCategoryItem(type, oldName) {
  const inputLabel = type === 'company' ? '车企名称' : type === 'brand' ? '品牌名称' : '车型名称';
  const bodyHtml = `<div class="form-group"><label class="form-label">${inputLabel}</label><input class="form-input" id="category-edit-input" value="${oldName}" style="width:100%"></div>`;
  const safeOld = oldName.replace(/'/g, "\\'");
  const footerHtml = `
    <button class="btn btn-ghost" onclick="renderCategorySettingsModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmEditCategory('${type}','${safeOld}')">保存</button>`;
  openModal(`编辑${inputLabel}`, bodyHtml, footerHtml, 400);
}

function confirmEditCategory(type, oldName) {
  const val = document.getElementById('category-edit-input')?.value?.trim();
  if (!val) { showToast('名称不能为空', 'error'); return; }
  if (type === 'company') {
    const comp = carBrandConfig.find(c=>c.name===oldName);
    if (comp) { comp.name = val; if(categoryEditCompany===oldName) categoryEditCompany=val; }
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===oldName);
    if (brand) { brand.name = val; if(categoryEditBrand===oldName) categoryEditBrand=val; }
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (brand) { const idx=brand.models.indexOf(oldName); if(idx!==-1) brand.models[idx]=val; }
  }
  showToast('修改成功');
  renderCategorySettingsModal();
}

function deleteCategoryItem(type, name) {
  const label = type==='company'?'车企':type==='brand'?'品牌':'车型';
  if (!confirm(`确定删除${label}「${name}」吗？${type!=='model'?'相关子分类也将一并删除。':''}`)) return;
  if (type === 'company') {
    const idx = carBrandConfig.findIndex(c=>c.name===name);
    if (idx !== -1) { carBrandConfig.splice(idx, 1); categoryEditCompany = carBrandConfig[0]?.name || null; }
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    if (comp) { const idx=comp.brands.findIndex(b=>b.name===name); if(idx!==-1){ comp.brands.splice(idx,1); categoryEditBrand=comp.brands[0]?.name||null; } }
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (brand) { const idx=brand.models.indexOf(name); if(idx!==-1) brand.models.splice(idx,1); }
  }
  showToast('删除成功');
  // 如果是从页面模式调用，刷新页面内容
  const pageEl = document.querySelector('#category-config-page');
  if (pageEl) { renderCategoryConfigPage(); } else { renderCategorySettingsModal(); }
}

// ===================== 分类设置独立页面 =====================
pageRenderers['category-config'] = () => `
<div class="page-header">
  <div class="page-title">分类设置</div>
  <div class="page-actions">
    <button class="btn btn-secondary" onclick="resetCategoryConfig()">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10 A4 4 0 1 1 8 14" stroke-linecap="round"/><path d="M4 10 L2 7M4 10 L7 8" stroke-linecap="round"/></svg>
      恢复默认分类
    </button>
  </div>
</div>
<div class="card">
  <div id="category-config-page">${buildCategoryConfigPageBody()}</div>
</div>`;

pageInits['category-config'] = () => {
  categorySettingsTab = 0;
  categoryEditCompany = carBrandConfig[0]?.name || null;
  categoryEditBrand = carBrandConfig[0]?.brands[0]?.name || null;
};

function renderCategoryConfigPage() {
  const container = document.getElementById('category-config-page');
  if (container) container.innerHTML = buildCategoryConfigPageBody();
}

function buildCategoryConfigPageBody() {
  // 复用弹窗内的三Tab内容，但通过页面内渲染（不用modal）
  const tabs = ['车企管理', '品牌管理', '车型管理'];
  const tabHtml = `<div class="tab-bar" style="margin-bottom:20px">${tabs.map((t,i)=>`<div class="tab-item${categorySettingsTab===i?' active':''}" onclick="switchCategoryTabPage(${i})">${t}</div>`).join('')}</div>`;

  let content = '';
  if (categorySettingsTab === 0) {
    content = `
      <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
        <button class="btn btn-primary btn-sm" onclick="addCategoryItemPage('company')">+ 添加车企</button>
      </div>
      <table class="data-table" style="width:100%">
        <thead><tr><th>序号</th><th>车企名称</th><th>品牌数量</th><th>车型数量</th><th>操作</th></tr></thead>
        <tbody>
          ${carBrandConfig.map((c,i)=>`
            <tr>
              <td style="color:var(--text-muted);width:50px">${i+1}</td>
              <td><strong>${c.name}</strong></td>
              <td><span class="tag tag-blue">${c.brands.length} 个品牌</span></td>
              <td><span class="tag tag-gray">${c.brands.reduce((sum,b)=>sum+b.models.length,0)} 个车型</span></td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editCategoryItemPage('company','${c.name}')">编辑名称</button>
                <button class="btn btn-ghost btn-sm danger" onclick="deleteCategoryItemPage('company','${c.name}')">删除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } else if (categorySettingsTab === 1) {
    const compOpts = carBrandConfig.map(c=>`<option value="${c.name}"${categoryEditCompany===c.name?' selected':''}>${c.name}</option>`).join('');
    const selComp = carBrandConfig.find(c=>c.name===categoryEditCompany) || {brands:[]};
    content = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span class="filter-label">选择车企：</span>
        <select class="filter-select" onchange="categoryEditCompany=this.value;renderCategoryConfigPage()" style="min-width:130px">${compOpts}</select>
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="addCategoryItemPage('brand')">+ 添加品牌</button>
      </div>
      <table class="data-table" style="width:100%">
        <thead><tr><th>序号</th><th>品牌名称</th><th>车型数量</th><th>操作</th></tr></thead>
        <tbody>
          ${selComp.brands.map((b,i)=>`
            <tr>
              <td style="color:var(--text-muted);width:50px">${i+1}</td>
              <td><strong>${b.name}</strong></td>
              <td><span class="tag tag-blue">${b.models.length} 个车型</span></td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editCategoryItemPage('brand','${b.name}')">编辑名称</button>
                <button class="btn btn-ghost btn-sm danger" onclick="deleteCategoryItemPage('brand','${b.name}')">删除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  } else {
    const compOpts = carBrandConfig.map(c=>`<option value="${c.name}"${categoryEditCompany===c.name?' selected':''}>${c.name}</option>`).join('');
    const selComp = carBrandConfig.find(c=>c.name===categoryEditCompany) || {brands:[]};
    const brandOpts = selComp.brands.map(b=>`<option value="${b.name}"${categoryEditBrand===b.name?' selected':''}>${b.name}</option>`).join('');
    const selBrand = selComp.brands.find(b=>b.name===categoryEditBrand) || {models:[]};
    content = `
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px">
        <span class="filter-label">车企：</span>
        <select class="filter-select" onchange="categoryEditCompany=this.value;categoryEditBrand=carBrandConfig.find(c=>c.name===this.value)?.brands[0]?.name||null;renderCategoryConfigPage()" style="min-width:110px">${compOpts}</select>
        <span class="filter-label">品牌：</span>
        <select class="filter-select" onchange="categoryEditBrand=this.value;renderCategoryConfigPage()" style="min-width:120px">${brandOpts}</select>
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="addCategoryItemPage('model')">+ 添加车型</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;min-height:80px;padding:16px;background:var(--bg-card2);border-radius:8px;border:1px solid var(--border)">
        ${selBrand.models.map(m=>`
          <div style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:var(--bg-card);border:1px solid var(--border);border-radius:20px;font-size:12px">
            <span>${m}</span>
            <button onclick="editCategoryItemPage('model','${m.replace(/'/g,"\\'")}') " style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0;font-size:12px" title="编辑">✎</button>
            <button onclick="deleteCategoryItemPage('model','${m.replace(/'/g,"\\'")}') " style="background:none;border:none;cursor:pointer;color:var(--danger);padding:0;font-size:12px" title="删除">✕</button>
          </div>`).join('') || '<span style="color:var(--text-muted);font-size:13px">暂无车型，点击右上角添加</span>'}
      </div>`;
  }
  return tabHtml + content;
}

function switchCategoryTabPage(idx) {
  categorySettingsTab = idx;
  renderCategoryConfigPage();
}

function addCategoryItemPage(type) {
  const inputLabel = type === 'company' ? '车企名称' : type === 'brand' ? '品牌名称' : '车型名称';
  const bodyHtml = `<div class="form-group"><label class="form-label">${inputLabel}</label><input class="form-input" id="category-add-input" placeholder="请输入${inputLabel}" style="width:100%"></div>`;
  const footerHtml = `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmAddCategoryPage('${type}')">确认添加</button>`;
  openModal(`添加${inputLabel}`, bodyHtml, footerHtml, 400);
}

function confirmAddCategoryPage(type) {
  const val = document.getElementById('category-add-input')?.value?.trim();
  if (!val) { showToast('名称不能为空', 'error'); return; }
  if (type === 'company') {
    if (carBrandConfig.find(c=>c.name===val)) { showToast('车企已存在', 'error'); return; }
    carBrandConfig.push({ id: 'custom-' + Date.now(), name: val, brands: [] });
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    if (!comp) { showToast('请先选择车企', 'error'); return; }
    if (comp.brands.find(b=>b.name===val)) { showToast('品牌已存在', 'error'); return; }
    comp.brands.push({ id: 'custom-' + Date.now(), name: val, models: [] });
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (!brand) { showToast('请先选择品牌', 'error'); return; }
    if (brand.models.includes(val)) { showToast('车型已存在', 'error'); return; }
    brand.models.push(val);
  }
  closeModal();
  showToast('添加成功');
  renderCategoryConfigPage();
}

function editCategoryItemPage(type, oldName) {
  const inputLabel = type === 'company' ? '车企名称' : type === 'brand' ? '品牌名称' : '车型名称';
  const bodyHtml = `<div class="form-group"><label class="form-label">${inputLabel}</label><input class="form-input" id="category-edit-input" value="${oldName}" style="width:100%"></div>`;
  const safeOld = oldName.replace(/'/g, "\\'");
  const footerHtml = `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmEditCategoryPage('${type}','${safeOld}')">保存</button>`;
  openModal(`编辑${inputLabel}`, bodyHtml, footerHtml, 400);
}

function confirmEditCategoryPage(type, oldName) {
  const val = document.getElementById('category-edit-input')?.value?.trim();
  if (!val) { showToast('名称不能为空', 'error'); return; }
  if (type === 'company') {
    const comp = carBrandConfig.find(c=>c.name===oldName);
    if (comp) { comp.name = val; if(categoryEditCompany===oldName) categoryEditCompany=val; }
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===oldName);
    if (brand) { brand.name = val; if(categoryEditBrand===oldName) categoryEditBrand=val; }
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (brand) { const idx=brand.models.indexOf(oldName); if(idx!==-1) brand.models[idx]=val; }
  }
  closeModal();
  showToast('修改成功');
  renderCategoryConfigPage();
}

function deleteCategoryItemPage(type, name) {
  const label = type==='company'?'车企':type==='brand'?'品牌':'车型';
  if (!confirm(`确定删除${label}「${name}」吗？${type!=='model'?'相关子分类也将一并删除。':''}`)) return;
  if (type === 'company') {
    const idx = carBrandConfig.findIndex(c=>c.name===name);
    if (idx !== -1) { carBrandConfig.splice(idx, 1); categoryEditCompany = carBrandConfig[0]?.name || null; }
  } else if (type === 'brand') {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    if (comp) { const idx=comp.brands.findIndex(b=>b.name===name); if(idx!==-1){ comp.brands.splice(idx,1); categoryEditBrand=comp.brands[0]?.name||null; } }
  } else {
    const comp = carBrandConfig.find(c=>c.name===categoryEditCompany);
    const brand = comp?.brands.find(b=>b.name===categoryEditBrand);
    if (brand) { const idx=brand.models.indexOf(name); if(idx!==-1) brand.models.splice(idx,1); }
  }
  showToast('删除成功');
  renderCategoryConfigPage();
}

function resetCategoryConfig() {
  if (!confirm('确定恢复默认分类数据吗？您的所有自定义修改将丢失。')) return;
  carBrandConfig = JSON.parse(JSON.stringify(carBrandData));
  showToast('已恢复默认分类', 'success');
  renderCategoryConfigPage();
}

function openProjectResult(projectId, projectName) {
  currentContext.projectId = projectId;
  currentContext.projectName = projectName;
  showPage('result-list');
}

function openProjectActions(projectId) {
  const project = mockMonitorProjects.find(p => p.id === projectId);
  if (!project) return;
  openModal('选择配置方式', `
    <div class="card card-clickable mb-12" onclick="closeModal();showPage('monitor-config',{projectId:'${projectId}',projectName:'${project.name.replace(/'/g,"\\'")}'})">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:24px">🔍</div>
        <div>
          <div style="font-weight:600;font-size:14px;margin-bottom:3px">通用关键词监测</div>
          <div class="text-muted text-sm">通过关键词组合配置监测规则</div>
        </div>
      </div>
    </div>
    <div class="card card-clickable" onclick="closeModal();showPage('account-monitor',{projectId:'${projectId}',projectName:'${project.name.replace(/'/g,"\\'")}'})">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:24px">📱</div>
        <div>
          <div style="font-weight:600;font-size:14px;margin-bottom:3px">媒体账号专项监测</div>
          <div class="text-muted text-sm">针对特定媒体账号进行专项监测</div>
        </div>
      </div>
    </div>
  `, `<button class="btn btn-ghost" onclick="closeModal()">取消</button>`, 460);
}

// ===================== 新建监测 - 选择模式 =====================
function openCreateMenu() {
  openModal('选择创建方式', `
    <div style="margin-bottom:8px">
      <div class="card card-clickable" style="margin-bottom:10px;padding:18px 16px" onclick="closeModal();openCreateMode('ai')">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="font-size:28px;flex-shrink:0">🤖</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">
              AI智能创建 <span class="tag tag-primary">推荐</span>
            </div>
            <div class="text-muted text-sm">用自然语言描述需求，AI自动配置监测规则，新手友好，效率最高</div>
          </div>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px;color:var(--text-muted);flex-shrink:0"><path d="M6 3l5 5-5 5"/></svg>
        </div>
      </div>
      <div class="card card-clickable" style="margin-bottom:10px;padding:18px 16px" onclick="closeModal();openCreateMode('keyword')">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="font-size:28px;flex-shrink:0">🔍</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">通用关键词监测</div>
            <div class="text-muted text-sm">通过关键词组合配置监测规则，适合品牌舆情、话题追踪等场景</div>
          </div>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px;color:var(--text-muted);flex-shrink:0"><path d="M6 3l5 5-5 5"/></svg>
        </div>
      </div>
      <div class="card card-clickable" style="padding:18px 16px" onclick="closeModal();openCreateMode('account')">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="font-size:28px;flex-shrink:0">📱</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:var(--text-primary)">媒体账号专项监测</div>
            <div class="text-muted text-sm">针对特定媒体账号进行专项监测，适合竞品追踪、账号分析</div>
          </div>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px;color:var(--text-muted);flex-shrink:0"><path d="M6 3l5 5-5 5"/></svg>
        </div>
      </div>
    </div>
  `, `<button class="btn btn-ghost" onclick="closeModal()">取消</button>`, 520);
}

function openCreateMode(mode) {
  currentContext.createMode = mode;
  if (mode === 'ai') showPage('ai-monitor');
  else if (mode === 'keyword') showPage('monitor-config');
  else if (mode === 'account') showPage('account-monitor');
}
