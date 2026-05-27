// ===================== 6. 刷新记录日志（用户视角）=====================

// 用户刷新记录日志的数据（简化版，仅显示用户自己的刷新记录）
const mockUserRefreshLogs = [
  { id: 'R001', type: '自动规则刷新', project: 'M001', projectName: '长安CS75Plus品牌传播监测', time: '2026-04-10 15:42:30', status: 'success', count: 128, newInteract: 23400, cost: 128 },
  { id: 'R002', type: '手动刷新', project: 'M002', projectName: '蔚来ET9上市传播监测', time: '2026-04-10 15:38:15', status: 'success', count: 89, newInteract: 12300, cost: 89 },
  { id: 'R003', type: '自动规则刷新', project: 'M001', projectName: '长安CS75Plus品牌传播监测', time: '2026-04-10 09:42:30', status: 'success', count: 234, newInteract: 45600, cost: 234 },
  { id: 'R004', type: '自动规则刷新', project: 'M003', projectName: '比亚迪竞品声量对比监测', time: '2026-04-10 08:00:00', status: 'fail', count: 0, newInteract: 0, cost: 0 },
  { id: 'R005', type: '手动刷新', project: 'M004', projectName: '理想L9用户口碑监测', time: '2026-04-09 22:30:12', status: 'success', count: 67, newInteract: 8900, cost: 67 },
];

pageRenderers['refresh-log'] = () => `
<div class="page active">
  <div class="page-header">
    <div class="page-title">刷新记录日志</div>
    <div class="page-actions">
      <button class="btn btn-secondary" onclick="showToast('日志已导出','success')">导出记录</button>
    </div>
  </div>

  <div class="stat-grid mb-16">
    <div class="stat-card">
      <div class="stat-label">今日刷新次数</div>
      <div class="stat-value">48</div>
      <div class="stat-change stat-up">自动+手动</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">今日刷新条数</div>
      <div class="stat-value">6,234</div>
      <div class="stat-change stat-up">↑ 12%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">今日新增互动量</div>
      <div class="stat-value">234,580</div>
      <div class="stat-change stat-up">↑ 23.6%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">今日消耗洞察豆</div>
      <div class="stat-value red">1,240</div>
      <div class="stat-change" style="color:var(--text-muted)">余额：12,580</div>
    </div>
  </div>

  <div class="filter-bar mb-16">
    <div class="search-box">
      <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
      <input type="text" placeholder="搜索记录ID、项目名称...">
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">状态：</span>
      <select class="filter-select">
        <option>全部</option><option>刷新中</option><option>成功</option><option>失败</option>
      </select>
    </div>
    <div class="filter-item">
      <span class="filter-label">类型：</span>
      <select class="filter-select">
        <option>全部</option><option>手动刷新</option><option>自动规则刷新</option>
      </select>
    </div>
    <div class="filter-item">
      <span class="filter-label">时间：</span>
      <input type="date" class="filter-select" value="2026-04-10">
    </div>
    <button class="btn btn-ghost btn-sm" style="margin-left:auto">重置</button>
  </div>

  <!-- 表格顶部批量操作 -->
  <div id="batch-bar" style="display:none;margin-bottom:8px;padding:8px 12px;background:var(--primary-bg);border:1px solid var(--primary-border);border-radius:8px;display:flex;align-items:center;gap:8px">
    <span style="font-size:12px;color:var(--primary);font-weight:600">已选 <strong>2</strong> 条</span>
    <button class="btn btn-primary btn-sm">批量导出</button>
    <button class="btn btn-ghost btn-sm">批量查看日志</button>
    <button class="btn btn-ghost btn-sm" style="margin-left:auto">取消选择</button>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:36px"><input type="checkbox" onclick="toggleAllCheck(this)"></th>
          <th>记录ID</th>
          <th>刷新类型</th>
          <th>所属监测项目</th>
          <th style="cursor:pointer" onclick="showToast('已按刷新时间排序','info')">刷新时间 ↓</th>
          <th>刷新状态</th>
          <th style="cursor:pointer" onclick="showToast('已按条数排序','info')">刷新条数 ↕</th>
          <th style="cursor:pointer" onclick="showToast('已按互动量排序','info')">新增互动量 ↕</th>
          <th>消耗豆</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${mockUserRefreshLogs.map(log => renderRefreshLog(log)).join('')}
      </tbody>
    </table>
  </div>

  <div class="flex-between mt-12" style="padding:8px 0">
    <div class="text-muted">共 48 条记录，每页显示 20 条</div>
    <div class="pagination">
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn">›</button>
    </div>
  </div>
</div>`;

function renderRefreshLog(log) {
  const statusMap = { success: ['tag-green','成功'], fail: ['tag-red','失败'], running: ['tag-blue','刷新中'] };
  const [stClass, stText] = statusMap[log.status] || ['tag-gray','未知'];
  const projectName = mockMonitorProjects.find(p => p.id === log.project)?.name || log.project;
  return `
  <tr>
    <td><input type="checkbox" onclick="updateBatchBar()"></td>
    <td><span class="td-name" style="cursor:pointer;color:var(--primary)" onclick="showRefreshDetail('${log.id}')">${log.id}</span></td>
    <td><span class="tag tag-gray">${log.type}</span></td>
    <td><a href="#" onclick="showPage('result-list');return false" style="color:var(--text-primary);text-decoration:none">${projectName.substring(0,12)}...</a></td>
    <td>${log.time}</td>
    <td><span class="tag ${stClass}">${stText}</span></td>
    <td>${log.count.toLocaleString()}</td>
    <td>${log.newInteract.toLocaleString()}</td>
    <td style="color:var(--primary)">${log.cost}</td>
    <td>
      <div class="flex gap-4">
        <button class="btn btn-ghost btn-sm" onclick="showRefreshDetail('${log.id}')">详情</button>
        ${log.status === 'fail' ? '<button class="btn btn-secondary btn-sm" onclick="showToast(\'正在重试刷新...\',\'info\')">重试</button>' : ''}
        <button class="btn btn-ghost btn-sm" onclick="showToast('已导出','success')">导出</button>
      </div>
    </td>
  </tr>`;
}

function toggleAllCheck(cb) {
  document.querySelectorAll('.data-table tbody input[type="checkbox"]').forEach(el => el.checked = cb.checked);
  updateBatchBar();
}

function updateBatchBar() {
  const checked = document.querySelectorAll('.data-table tbody input[type="checkbox"]:checked').length;
  const bar = document.getElementById('batch-bar');
  if (bar) {
    bar.style.display = checked > 0 ? 'flex' : 'none';
    const countEl = bar.querySelector('strong');
    if (countEl) countEl.textContent = checked;
  }
}

function showRefreshDetail(id) {
  const log = mockUserRefreshLogs.find(l => l.id === id);
  if (!log) return;
  openModal(`刷新记录详情 - ${id}`, `
    <div class="grid-2 mb-16">
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">刷新类型</div>
        <span class="tag tag-gray">${log.type}</span>
      </div>
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">刷新状态</div>
        <span class="tag ${log.status==='success'?'tag-green':'tag-red'}">${log.status==='success'?'成功':'失败'}</span>
      </div>
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">刷新时间</div>
        <div>${log.time}</div>
      </div>
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">刷新条数</div>
        <div style="font-size:18px;font-weight:700;color:var(--text-primary)">${log.count}</div>
      </div>
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">新增互动量</div>
        <div style="font-size:18px;font-weight:700;color:#22C870">+${log.newInteract.toLocaleString()}</div>
      </div>
      <div style="padding:10px;background:var(--bg-card2);border-radius:6px;font-size:12px">
        <div class="text-muted mb-12">消耗洞察豆</div>
        <div style="font-size:18px;font-weight:800;color:var(--primary)">${log.cost}</div>
      </div>
    </div>
    ${log.status === 'fail' ? `
    <div class="card" style="background:var(--danger-bg);border-color:rgba(239,68,68,0.2)">
      <div style="color:var(--danger);font-size:12px;margin-bottom:6px;font-weight:600">❌ 失败原因</div>
      <div style="font-size:12px;color:var(--text-secondary)">网络超时：请求抖音API时连接超时（30s），已自动加入重试队列</div>
    </div>` : ''}
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">关闭</button>
    ${log.status === 'fail' ? '<button class="btn btn-primary" onclick="showToast(\'正在重试\',\'info\');closeModal()">立即重试</button>' : ''}
    <button class="btn btn-secondary" onclick="showToast(\'已导出\',\'success\')">导出明细</button>
  `);
}

// ===================== 7. 报告管理(简版) =====================
// 此版本已废弃，由 page-report.js 提供完整版本
// pageRenderers['report-list'] = () => `
// <div class="page active">
//   <div class="page-header">
//     <div class="page-title">报告管理</div>
//     <div class="page-actions">
//       <button class="btn btn-secondary" onclick="showToast('跳转到新建周期报告','info')">新建周期报告</button>
//       <button class="btn btn-primary" onclick="showToast('跳转到新建专项报告','info')">+ 新建专项报告</button>
//     </div>
//   </div>
//   <div class="filter-bar mb-16">
//     <div class="search-box">
//       <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
//       <input type="text" placeholder="搜索报告名称、编号、创建人...">
//     </div>
//     <div class="filter-item">
//       <span class="filter-label">状态：</span>
//       <select class="filter-select"><option>全部</option><option>编辑中</option><option>已生成</option><option>已归档</option></select>
//     </div>
//     <div class="filter-item">
//       <span class="filter-label">时间：</span>
//       <select class="filter-select"><option>近7天</option><option>近30天</option><option>近90天</option></select>
//     </div>
//     <div style="margin-left:auto;display:flex;gap:8px">
//       <button class="btn btn-secondary btn-sm active-mode">🗂 卡片视图</button>
//       <button class="btn btn-ghost btn-sm">📋 表格视图</button>
//     </div>
//   </div>
//   <div class="tab-bar">
//     <div class="tab-item active">全部<span class="tab-count">18</span></div>
//     <div class="tab-item">专项报告<span class="tab-count">12</span></div>
//     <div class="tab-item">周期报告<span class="tab-count">4</span></div>
//     <div class="tab-item">草稿箱<span class="tab-count">2</span></div>
//     <div class="tab-item">已归档<span class="tab-count">0</span></div>
//   </div>
//   <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">
//     ${[
//       {name:'长安CS75 3月品牌传播周报',type:'周期报告',scene:'品牌传播周报',status:'running',time:'2026-04-07',creator:'张三'},
//       {name:'蔚来ET9上市传播全周期复盘',type:'专项报告',scene:'新车上市复盘',status:'done',time:'2026-04-05',creator:'李四'},
//       {name:'4月第2周竞品对标分析报告',type:'专项报告',scene:'竞品对标',status:'done',time:'2026-04-08',creator:'张三'},
//       {name:'Q1品牌健康度分析报告',type:'专项报告',scene:'品牌健康度',status:'draft',time:'2026-04-01',creator:'王五'},
//     ].map(r => renderReportCardOld(r)).join('')}
//   </div>
// </div>`;
// function renderReportCardOld(r) {
//   const statusMap = {running:['tag-green','运行中'], done:['tag-blue','已生成'], draft:['tag-gray','编辑中'], archived:['tag-gray','已归档']};
//   const [stClass, stText] = statusMap[r.status] || ['tag-gray','未知'];
//   const typeTag = r.type === '周期报告' ? 'tag-primary' : 'tag-blue';
//   return `<div class="card" style="cursor:pointer" onclick="showToast('打开报告预览','info')">
//     <div class="flex-between mb-12"><span class="tag ${typeTag}">${r.type}</span><span class="tag ${stClass}">${stText}</span></div>
//     <div style="font-size:14px;font-weight:700;margin-bottom:6px;line-height:1.4">${r.name}</div>
//     <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">${r.scene} · ${r.creator} · ${r.time}</div>
//     ${r.type === '周期报告' ? `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:12px">周期规则：每周一 09:00 自动生成 · 已生成 8 期</div>` : ''}
//     <div class="divider" style="margin:8px 0"></div>
//     <div class="flex gap-6">
//       <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('打开报告预览','info')">查看</button>
//       <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('报告下载中...','info')">下载</button>
//       <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">编辑</button>
//       <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation()">···</button>
//     </div>
//   </div>`;
// }

// ===================== 8. 报告模板(简版) =====================
// 此版本已废弃，由 page-report-template.js 提供完整版本
// pageRenderers['report-template'] = () => `
// <div class="page active">
//   <div class="page-header">
//     <div class="page-title">报告模板中心</div>
//     <div class="page-actions">
//       <button class="btn btn-primary" onclick="showToast('跳转到模板创建页面','info')">+ 新建模板</button>
//     </div>
//   </div>
//   <div class="filter-bar mb-16">
//     <div class="search-box"><svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg><input type="text" placeholder="搜索模板名称、场景..."></div>
//     <div class="filter-item"><span class="filter-label">类型：</span><select class="filter-select"><option>全部</option><option>专项报告模板</option><option>周期报告模板</option></select></div>
//     <div class="filter-item"><span class="filter-label">状态：</span><select class="filter-select"><option>全部</option><option>已发布</option><option>草稿</option></select></div>
//   </div>
//   <div class="tab-bar">
//     <div class="tab-item active">全部</div><div class="tab-item">我的模板</div><div class="tab-item">部门模板</div>
//     <div class="tab-item">全公司模板</div><div class="tab-item">系统预置</div><div class="tab-item">草稿箱</div><div class="tab-item">已归档</div>
//   </div>
//   <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
//     ${[{name:'品牌传播周报标准模板',scene:'品牌传播周报',status:'published',type:'周期',creator:'系统预置'},
//       {name:'负面舆情处置分析模板',scene:'负面舆情处置',status:'published',type:'专项',creator:'张三'},
//       {name:'新车上市全周期复盘模板',scene:'新车上市',status:'published',type:'专项',creator:'系统预置'},
//       {name:'竞品对标分析标准模板',scene:'竞品对标',status:'published',type:'专项',creator:'李四'},
//       {name:'月度品牌健康度模板',scene:'品牌健康度',status:'draft',type:'周期',creator:'王五'},
//     ].map(t => renderTemplateCardOld(t)).join('')}
//   </div>
// </div>`;
// function renderTemplateCardOld(t) {
//   const statusMap = {published:['tag-green','已发布'], draft:['tag-gray','草稿']};
//   const [stClass, stText] = statusMap[t.status] || ['tag-gray','未知'];
//   return `<div class="card card-clickable">
//     <div class="flex-between mb-8"><span class="tag tag-blue">${t.type}报告</span><span class="tag ${stClass}">${stText}</span></div>
//     <div style="height:80px;background:var(--bg-card2);border-radius:6px;margin-bottom:10px;display:flex;align-items:center;justify-content:center;border:1px dashed var(--border)"><span style="font-size:11px;color:var(--text-muted)">模板预览缩略图</span></div>
//     <div style="font-size:13px;font-weight:600;margin-bottom:4px">${t.name}</div>
//     <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px">${t.scene} · ${t.creator}</div>
//     <div class="flex gap-6">
//       <button class="btn btn-primary btn-sm" style="flex:1" onclick="showToast('已选择此模板，正在跳转创建报告','success')">使用模板</button>
//       <button class="btn btn-ghost btn-sm" onclick="showToast('预览模板','info')">预览</button>
//     </div>
//   </div>`;
// }

// ===================== 9. 账号管理（完整版）- Mock数据已移至 page-account.js ======================

// --- 状态 ---
let acctCurrentTab = 'users'; // users | org | roles | log
let acctSelectedIds = new Set();
let orgExpandMap = { 'ORG001':true, 'D001':true, 'D002':true, 'D003':true };

// --- 渲染器 ---
pageRenderers['account-mgmt'] = () => {
  acctSelectedIds = new Set();
  return renderAccountPage();
};

function renderAccountPage() {
  return `
<div class="page active" id="account-mgmt-page">
  <div class="page-header">
    <div class="page-title">账号管理中心</div>
    <div class="page-actions">
      <button class="btn btn-ghost btn-sm" onclick="showToast('请准备符合模板格式的Excel文件','info')">
        <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:3px"><path d="M8 2v9M5 8l3 3 3-3" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M2 12h12" stroke="currentColor" stroke-width="1.5"/></svg>
        批量导入
      </button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('账号列表已导出','success')">导出</button>
      <button class="btn btn-primary" onclick="showNewAccountModal()">+ 新建账号</button>
    </div>
  </div>

  <!-- 主Tab -->
  <div class="tab-bar">
    <div class="tab-item ${acctCurrentTab==='users'?'active':''}" onclick="switchAcctTab('users')">用户账号<span class="tab-count">${mockUsers.length}</span></div>
    <div class="tab-item ${acctCurrentTab==='org'?'active':''}" onclick="switchAcctTab('org')">组织架构</div>
    <div class="tab-item ${acctCurrentTab==='roles'?'active':''}" onclick="switchAcctTab('roles')">角色权限<span class="tab-count">${mockRoles.length}</span></div>
    <div class="tab-item ${acctCurrentTab==='log'?'active':''}" onclick="switchAcctTab('log')">操作日志</div>
  </div>

  <!-- 各Tab内容 -->
  <div id="acct-tab-content"></div>
</div>`;
}

pageInits['account-mgmt'] = () => {
  renderAcctTabContent();
};

function switchAcctTab(tab) {
  acctCurrentTab = tab;
  acctSelectedIds = new Set();
  document.querySelectorAll('#account-mgmt-page .tab-bar .tab-item').forEach((el, i) => {
    el.classList.toggle('active', ['users','org','roles','log'][i] === tab);
  });
  renderAcctTabContent();
}

function renderAcctTabContent() {
  const area = document.getElementById('acct-tab-content');
  if (!area) return;
  if (acctCurrentTab === 'users') area.innerHTML = renderUserTab();
  else if (acctCurrentTab === 'org') area.innerHTML = renderOrgTab();
  else if (acctCurrentTab === 'roles') area.innerHTML = renderRolesTab();
  else if (acctCurrentTab === 'log') area.innerHTML = renderLogTab();
}

// ---- 用户账号Tab ----
function renderUserTab() {
  return `
  <div class="filter-bar mb-14">
    <div class="search-box" style="max-width:240px">
      <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
      <input type="text" placeholder="搜索姓名、工号、账号...">
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">状态：</span>
      <select class="filter-select"><option>全部</option><option>启用</option><option>冻结</option><option>待激活</option></select>
    </div>
    <div class="filter-item">
      <span class="filter-label">部门：</span>
      <select class="filter-select"><option>全部</option><option>品牌部</option><option>传播部</option><option>数据部</option></select>
    </div>
    <div class="filter-item">
      <span class="filter-label">角色：</span>
      <select class="filter-select"><option>全部</option><option>超级管理员</option><option>部门管理员</option><option>普通员工</option></select>
    </div>
    <button class="btn btn-ghost btn-sm" style="margin-left:auto">重置</button>
  </div>

  <!-- 批量操作栏 -->
  <div id="acct-batch-bar" style="display:none;margin-bottom:10px;padding:9px 14px;background:var(--primary-bg);border:1px solid var(--primary-border);border-radius:8px;align-items:center;gap:8px">
    <span style="font-size:12px;color:var(--primary);font-weight:600">已选 <strong id="acct-batch-count">0</strong> 个账号</span>
    <button class="btn btn-secondary btn-sm" onclick="showToast('已向所选账号发送重置密码邮件','success')">批量重置密码</button>
    <button class="btn btn-ghost btn-sm" onclick="showToast('已发送激活邮件','info')">批量激活</button>
    <button class="btn btn-danger btn-sm" onclick="showToast('所选账号已冻结','error')">批量冻结</button>
    <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="clearAcctSelection()">取消选择</button>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:36px"><input type="checkbox" onclick="toggleAllAcct(this)" style="accent-color:var(--primary);cursor:pointer"></th>
          <th>账号信息</th>
          <th>所属部门</th>
          <th>角色</th>
          <th>账号状态</th>
          <th>最后登录</th>
          <th>创建时间</th>
          <th>来源</th>
          <th style="width:150px">操作</th>
        </tr>
      </thead>
      <tbody>
        ${mockUsers.map(u => renderUserRow(u)).join('')}
      </tbody>
    </table>
  </div>

  <div class="flex-between mt-12" style="padding:6px 0">
    <div class="text-muted">共 ${mockUsers.length} 个账号</div>
    <div class="pagination">
      <button class="page-btn">‹</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">›</button>
    </div>
  </div>`;
}

function renderUserRow(u) {
  const roleMap = {
    super_admin: { cls:'tag-red', text:'超级管理员' },
    dept_admin: { cls:'tag-orange', text:'部门管理员' },
    member: { cls:'tag-gray', text:'普通员工' },
    viewer: { cls:'tag-gray', text:'只读访问者' },
  };
  const statusMap = {
    active: { cls:'tag-green', text:'启用' },
    frozen: { cls:'tag-red', text:'冻结' },
    pending: { cls:'tag-orange', text:'待激活' },
  };
  const rs = roleMap[u.role] || roleMap.member;
  const ss = statusMap[u.status] || statusMap.pending;
  const isSelected = acctSelectedIds.has(u.id);
  const avatarColors = ['#D93F4A','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899'];
  const ac = avatarColors[u.name.charCodeAt(0) % avatarColors.length];
  return `
  <tr class="${isSelected?'row-selected':''}">
    <td><input type="checkbox" style="accent-color:var(--primary);cursor:pointer" ${isSelected?'checked':''}
      onclick="toggleAcctSelect('${u.id}',this.checked)"></td>
    <td>
      <div style="display:flex;align-items:center;gap:9px">
        <div style="width:32px;height:32px;border-radius:50%;background:${ac};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;cursor:pointer" onclick="showUserDetail('${u.id}')">${u.name[0]}</div>
        <div>
          <div class="td-name" style="cursor:pointer" onclick="showUserDetail('${u.id}')">${u.name}</div>
          <div style="font-size:10px;color:var(--text-muted)">${u.account} &nbsp;·&nbsp; ${u.id}</div>
        </div>
      </div>
    </td>
    <td style="font-size:12.5px">${u.dept}</td>
    <td><span class="tag ${rs.cls}">${rs.text}</span></td>
    <td><span class="tag ${ss.cls}">${ss.text}</span></td>
    <td style="font-size:11px;color:var(--text-secondary)">${u.lastLogin}</td>
    <td style="font-size:11px;color:var(--text-muted)">${u.createTime}</td>
    <td><span class="tag tag-gray" style="font-size:10px">${u.source}</span></td>
    <td>
      <div style="display:flex;gap:4px;align-items:center">
        <button class="btn btn-ghost btn-sm" onclick="showEditAccountModal('${u.id}')">编辑</button>
        <button class="btn btn-ghost btn-sm" onclick="showToast('重置密码邮件已发送到 ${u.email}','success')">重置密码</button>
        <div style="position:relative">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();toggleAcctMore('${u.id}')">···</button>
          <div class="dropdown-menu" id="acct-more-${u.id}" style="right:0;min-width:140px">
            <div class="dropdown-item" onclick="closeAllDropdowns();showUserDetail('${u.id}')">账号详情</div>
            <div class="dropdown-item" onclick="closeAllDropdowns();showPermConfigModal('${u.id}')">权限配置</div>
            <div class="dropdown-divider"></div>
            ${u.status==='active'?`<div class="dropdown-item danger" onclick="closeAllDropdowns();confirmFreezeUser('${u.id}','${u.name}')">冻结账号</div>`
              : u.status==='frozen'?`<div class="dropdown-item" onclick="closeAllDropdowns();showToast('账号 ${u.name} 已启用','success')">启用账号</div>`
              :`<div class="dropdown-item" onclick="closeAllDropdowns();showToast('激活邮件已重新发送','info')">重新发送激活邮件</div>`}
            <div class="dropdown-item danger" onclick="closeAllDropdowns();showToast('账号已删除','error')">删除账号</div>
          </div>
        </div>
      </div>
    </td>
  </tr>`;
}

// ---- 组织架构Tab ----
function renderOrgTab() {
  return `
  <div style="display:grid;grid-template-columns:300px 1fr;gap:16px">
    <!-- 左侧树形 -->
    <div>
      <div class="card" style="padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:13px;font-weight:700">组织架构</span>
          <button class="btn btn-primary btn-sm" onclick="showNewDeptModal()">+ 新建部门</button>
        </div>
        <div class="org-tree">
          ${renderOrgTree(mockOrgTree)}
        </div>
      </div>
    </div>

    <!-- 右侧部门详情 -->
    <div>
      <div class="card" style="margin-bottom:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
          <div>
            <div style="font-size:15px;font-weight:700;margin-bottom:4px">品牌传播集团</div>
            <div style="font-size:12px;color:var(--text-muted)">全公司 · 共 7 名成员 · 3 个部门</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary btn-sm" onclick="showToast('编辑组织信息','info')">编辑</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          ${[
            {label:'总账号数',val:'7',icon:'👥'},
            {label:'启用中',val:'5',icon:'✅'},
            {label:'待激活',val:'1',icon:'⏳'},
          ].map(s=>`<div style="background:var(--bg-card2);border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:20px;margin-bottom:6px">${s.icon}</div>
            <div style="font-size:20px;font-weight:800;color:var(--text-primary)">${s.val}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${s.label}</div>
          </div>`).join('')}
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)">
          <span style="font-size:13px;font-weight:600">部门成员列表</span>
          <button class="btn btn-secondary btn-sm" onclick="showToast('选择成员添加到此部门','info')">+ 添加成员</button>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>成员</th><th>角色</th><th>状态</th><th>加入时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            ${mockUsers.slice(0,5).map(u=>`
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="width:26px;height:26px;border-radius:50%;background:var(--primary-bg2);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${u.name[0]}</div>
                  <div>
                    <div style="font-size:12.5px;font-weight:600">${u.name}</div>
                    <div style="font-size:10px;color:var(--text-muted)">${u.dept}</div>
                  </div>
                </div>
              </td>
              <td><span class="tag ${{super_admin:'tag-red',dept_admin:'tag-orange',member:'tag-gray'}[u.role]}">${{super_admin:'超级管理员',dept_admin:'部门管理员',member:'普通员工'}[u.role]}</span></td>
              <td><span class="tag ${{active:'tag-green',frozen:'tag-red',pending:'tag-orange'}[u.status]}">${{active:'启用',frozen:'冻结',pending:'待激活'}[u.status]}</span></td>
              <td style="font-size:11px;color:var(--text-muted)">${u.createTime}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="showToast('已移出该部门','info')">移除</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderOrgTree(nodes, depth=0) {
  return nodes.map(node => {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = orgExpandMap[node.id];
    const typeIcon = node.type==='company'?'🏢':node.type==='dept'?'📁':'📂';
    return `
    <div class="org-tree-node" style="padding-left:${depth*16}px">
      <div class="org-tree-item" onclick="selectOrgNode('${node.id}')" style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:6px;cursor:pointer;transition:background 0.15s">
        ${hasChildren ? `<span style="font-size:10px;color:var(--text-muted);cursor:pointer;width:12px;text-align:center;flex-shrink:0" onclick="event.stopPropagation();toggleOrgNode('${node.id}')">${expanded?'▼':'▶'}</span>` : '<span style="width:12px;flex-shrink:0"></span>'}
        <span style="font-size:14px;flex-shrink:0">${typeIcon}</span>
        <span style="font-size:12.5px;flex:1;font-weight:${node.type==='company'?'700':'500'}">${node.name}</span>
        <span style="font-size:10px;color:var(--text-muted);flex-shrink:0">${node.members||''}人</span>
      </div>
      ${hasChildren && expanded ? `<div class="org-tree-children">${renderOrgTree(node.children, depth+1)}</div>` : ''}
    </div>`;
  }).join('');
}

function toggleOrgNode(id) {
  orgExpandMap[id] = !orgExpandMap[id];
  const area = document.getElementById('acct-tab-content');
  if (area) area.innerHTML = renderOrgTab();
}

function selectOrgNode(id) {
  document.querySelectorAll('.org-tree-item').forEach(el => el.style.background = '');
  event.currentTarget.style.background = 'var(--primary-bg)';
  event.currentTarget.style.color = 'var(--primary)';
}

// ---- 角色权限Tab ----
function renderRolesTab() {
  return `
  <div style="display:grid;grid-template-columns:260px 1fr;gap:16px">
    <!-- 角色列表 -->
    <div>
      ${mockRoles.map((r, i) => `
      <div class="card card-clickable ${i===0?'':'mt-10'}" style="${i===0?'border-color:var(--primary);background:var(--primary-bg);':''}padding:14px" onclick="showRoleDetail(this,'${r.id}')">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13px;font-weight:700">${r.name}</span>
          <span class="tag tag-gray" style="font-size:10px">${r.userCount} 人</span>
        </div>
        <div style="font-size:11px;color:var(--text-muted);line-height:1.5">${r.desc}</div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('编辑角色权限','info')">编辑权限</button>
          ${r.id!=='super_admin'?`<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('复制此角色','info')">复制</button>`:''}
        </div>
      </div>`).join('')}
      <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:12px" onclick="showToast('新建自定义角色','info')">+ 新建角色</button>
    </div>

    <!-- 权限详情 -->
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-size:15px;font-weight:700;margin-bottom:4px">超级管理员</div>
          <div style="font-size:12px;color:var(--text-muted)">拥有全部权限，可管理所有模块和账号 · 共 1 人</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="showToast('权限配置已保存','success')">保存配置</button>
      </div>

      ${[
        { module:'监测模块', icon:'📡', perms:['查看','创建','编辑','删除','导出'], granted:[0,1,2,3,4] },
        { module:'智能报告', icon:'📊', perms:['查看','创建','编辑','删除','导出','分享'], granted:[0,1,2,3,4,5] },
        { module:'报告模板', icon:'📋', perms:['查看','创建','编辑','删除','发布'], granted:[0,1,2,3,4] },
        { module:'账号管理', icon:'👥', perms:['查看','创建账号','编辑账号','删除账号','冻结账号'], granted:[0,1,2,3,4] },
        { module:'系统设置', icon:'⚙️', perms:['查看','修改设置','管理套餐'], granted:[0,1,2] },
      ].map(m=>`
      <div style="margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <span style="font-size:16px">${m.icon}</span>
          <span style="font-size:13px;font-weight:600">${m.module}</span>
          <div style="flex:1;height:1px;background:var(--border);margin-left:8px"></div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding-left:8px">
          ${m.perms.map((p,i)=>`
          <label style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:6px;border:1px solid ${m.granted.includes(i)?'var(--primary-border)':'var(--border)'};background:${m.granted.includes(i)?'var(--primary-bg)':''}">
            <input type="checkbox" ${m.granted.includes(i)?'checked':''} style="accent-color:var(--primary);width:13px;height:13px">
            <span style="font-size:12px;color:${m.granted.includes(i)?'var(--primary)':'var(--text-secondary)'}">${p}</span>
          </label>`).join('')}
        </div>
      </div>`).join('')}

      <div style="padding:12px;background:var(--bg-card2);border-radius:8px;font-size:11px;color:var(--text-muted)">
        ℹ️ 超级管理员权限不可修改，如需调整请创建新角色并分配。
      </div>
    </div>
  </div>`;
}

// ---- 操作日志Tab ----
function renderLogTab() {
  return `
  <div class="filter-bar mb-14">
    <div class="search-box" style="max-width:240px">
      <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
      <input type="text" placeholder="搜索操作人、操作对象...">
    </div>
    <div class="filter-item">
      <span class="filter-label">操作类型：</span>
      <select class="filter-select"><option>全部</option><option>新建账号</option><option>修改角色</option><option>冻结账号</option><option>重置密码</option><option>批量导入</option></select>
    </div>
    <div class="filter-item">
      <span class="filter-label">操作人：</span>
      <select class="filter-select"><option>全部</option><option>张三丰</option><option>李小明</option></select>
    </div>
    <div class="filter-item">
      <span class="filter-label">时间：</span>
      <input type="date" class="filter-select" value="2026-04-01">
      <span style="font-size:12px;color:var(--text-muted)">至</span>
      <input type="date" class="filter-select" value="2026-04-13">
    </div>
  </div>

  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th>日志ID</th>
          <th>操作人</th>
          <th>操作类型</th>
          <th>操作对象</th>
          <th>操作详情</th>
          <th>操作时间</th>
          <th>IP地址</th>
        </tr>
      </thead>
      <tbody>
        ${mockOperationLogs.map(l=>`
        <tr>
          <td style="font-size:11px;color:var(--text-muted)">${l.id}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:22px;height:22px;border-radius:50%;background:var(--primary-bg2);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">${l.operator[0]}</div>
              <span style="font-size:12.5px">${l.operator}</span>
            </div>
          </td>
          <td><span class="tag tag-blue" style="font-size:10px">${l.action}</span></td>
          <td style="font-size:12.5px;font-weight:600">${l.target}</td>
          <td style="font-size:11.5px;color:var(--text-secondary);max-width:240px">${l.detail}</td>
          <td style="font-size:11px;color:var(--text-muted);white-space:nowrap">${l.time}</td>
          <td style="font-size:11px;color:var(--text-muted)">${l.ip}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div class="flex-between mt-12" style="padding:6px 0">
    <div class="text-muted">共 ${mockOperationLogs.length} 条日志</div>
    <div class="pagination"><button class="page-btn active">1</button></div>
  </div>`;
}

// ---- 账号操作弹窗 ----
function showUserDetail(uid) {
  const u = mockUsers.find(m => m.id === uid);
  if (!u) return;
  const roleMap = {super_admin:{cls:'tag-red',text:'超级管理员'},dept_admin:{cls:'tag-orange',text:'部门管理员'},member:{cls:'tag-gray',text:'普通员工'}};
  const rs = roleMap[u.role] || roleMap.member;
  const avatarColors = ['#D93F4A','#3B82F6','#10B981','#F59E0B','#8B5CF6','#EC4899'];
  const ac = avatarColors[u.name.charCodeAt(0) % avatarColors.length];
  openModal(`账号详情 · ${u.name}`, `
    <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--bg-card2);border-radius:10px;margin-bottom:16px">
      <div style="width:56px;height:56px;border-radius:50%;background:${ac};color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;flex-shrink:0">${u.name[0]}</div>
      <div>
        <div style="font-size:18px;font-weight:800;margin-bottom:6px">${u.name}</div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="tag ${rs.cls}">${rs.text}</span>
          <span class="tag ${{active:'tag-green',frozen:'tag-red',pending:'tag-orange'}[u.status]}">${{active:'启用',frozen:'冻结',pending:'待激活'}[u.status]}</span>
          <span style="font-size:11px;color:var(--text-muted)">${u.dept}</span>
        </div>
      </div>
    </div>
    <div class="grid-2" style="gap:12px">
      ${[
        ['工号',u.id],['登录账号',u.account],['手机号',u.phone],['邮箱',u.email],
        ['所属部门',u.dept],['账号来源',u.source],['创建时间',u.createTime],['累计登录',u.loginCount+'次'],
        ['最后登录',u.lastLogin,'full'],
      ].map(([label,val,span])=>`
      <div ${span?'style="grid-column:1/-1"':''} style="padding:10px;background:var(--bg-card2);border-radius:8px">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${label}</div>
        <div style="font-size:13px;font-weight:600;color:var(--text-primary)">${val}</div>
      </div>`).join('')}
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">关闭</button>
    <button class="btn btn-secondary" onclick="closeModal();showEditAccountModal('${uid}')">编辑账号</button>
    <button class="btn btn-primary" onclick="closeModal();showPermConfigModal('${uid}')">权限配置</button>
  `, 580);
}

function showEditAccountModal(uid) {
  const u = mockUsers.find(m => m.id === uid) || { name:'', id:'', phone:'', email:'', dept:'品牌部', role:'member', status:'active' };
  openModal(`编辑账号 · ${u.name}`, `
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">姓名 <span class="required">*</span></label>
        <input type="text" class="form-control" value="${u.name}">
      </div>
      <div class="form-group">
        <label class="form-label">工号</label>
        <input type="text" class="form-control" value="${u.id}" readonly style="background:var(--bg-card2);color:var(--text-muted)">
      </div>
      <div class="form-group">
        <label class="form-label">手机号</label>
        <input type="text" class="form-control" value="${u.phone}">
      </div>
      <div class="form-group">
        <label class="form-label">邮箱</label>
        <input type="email" class="form-control" value="${u.email}">
      </div>
      <div class="form-group">
        <label class="form-label">所属部门 <span class="required">*</span></label>
        <select class="form-control">
          <option ${u.dept==='品牌部'?'selected':''}>品牌部</option>
          <option ${u.dept==='传播部'?'selected':''}>传播部</option>
          <option ${u.dept==='数据部'?'selected':''}>数据部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">角色 <span class="required">*</span></label>
        <select class="form-control">
          <option value="member" ${u.role==='member'?'selected':''}>普通员工</option>
          <option value="dept_admin" ${u.role==='dept_admin'?'selected':''}>部门管理员</option>
          ${u.role==='super_admin'?'<option value="super_admin" selected>超级管理员</option>':''}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">账号状态</label>
        <select class="form-control">
          <option value="active" ${u.status==='active'?'selected':''}>启用</option>
          <option value="frozen" ${u.status==='frozen'?'selected':''}>冻结</option>
          <option value="pending" ${u.status==='pending'?'selected':''}>待激活</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">所属分组（可多选）</label>
        <select class="form-control">
          <option>品牌策划组</option><option>内容运营组</option><option>数据分析组</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <textarea class="form-control" style="height:64px" placeholder="账号备注信息（可选）"></textarea>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="showToast('账号信息已更新','success');closeModal()">保存修改</button>
  `, 600);
}

function showPermConfigModal(uid) {
  const u = mockUsers.find(m => m.id === uid);
  if (!u) return;
  const roleMap = {super_admin:'超级管理员',dept_admin:'部门管理员',member:'普通员工'};
  openModal(`权限配置 · ${u.name}`, `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:12px;background:var(--bg-card2);border-radius:8px">
      <div style="width:36px;height:36px;border-radius:50%;background:var(--primary-bg2);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0">${u.name[0]}</div>
      <div>
        <div style="font-size:13px;font-weight:700">${u.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">当前角色：${roleMap[u.role]}</div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">切换系统角色</label>
      <select class="form-control">
        ${mockRoles.map(r=>`<option value="${r.id}" ${r.id===u.role?'selected':''}>${r.name} — ${r.desc}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">额外权限（在角色基础上叠加）</label>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${['导出报告数据','管理全部模板','查看操作日志','配置监测规则'].map(p=>`
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:5px 10px;border-radius:6px;border:1px solid var(--border)">
          <input type="checkbox" style="accent-color:var(--primary)">
          <span style="font-size:12px">${p}</span>
        </label>`).join('')}
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">可访问数据范围</label>
      <select class="form-control">
        <option>仅本部门数据</option>
        <option>全公司数据</option>
        <option>自定义范围</option>
      </select>
    </div>
    <div class="alert alert-info" style="font-size:11px">ℹ️ 角色切换立即生效，额外权限变更将在用户下次登录时生效。</div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="showToast('权限配置已保存，下次登录生效','success');closeModal()">保存权限</button>
  `, 580);
}

function confirmFreezeUser(uid, name) {
  openModal('确认冻结账号', `
    <div class="alert alert-danger">
      <strong>⚠️ 确认要冻结账号「${name}」吗？</strong>
      <div style="margin-top:6px;font-size:12px">冻结后该账号将无法登录，但历史数据和报告不受影响。可随时重新启用。</div>
    </div>
    <div class="form-group" style="margin-top:12px">
      <label class="form-label">冻结原因（可选）</label>
      <select class="form-control">
        <option>员工离职</option><option>临时禁用</option><option>违规处理</option><option>其他</option>
      </select>
    </div>
    <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;color:var(--text-secondary);padding:4px 0">
      <input type="checkbox" style="accent-color:var(--primary)">
      同时向账号发送冻结通知邮件
    </label>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-danger" onclick="showToast('账号 ${name} 已冻结','error');closeModal()">确认冻结</button>
  `, 500);
}

function showNewDeptModal() {
  openModal('新建部门/分组', `
    <div class="form-group">
      <label class="form-label">上级部门 <span class="required">*</span></label>
      <select class="form-control">
        <option>品牌传播集团（根节点）</option>
        <option>品牌部</option><option>传播部</option><option>数据部</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">部门类型 <span class="required">*</span></label>
      <div style="display:flex;gap:10px">
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px">
          <input type="radio" name="dept-type" value="dept" checked style="accent-color:var(--primary)"> 部门
        </label>
        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-size:12px">
          <input type="radio" name="dept-type" value="group" style="accent-color:var(--primary)"> 分组
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">部门名称 <span class="required">*</span></label>
      <input type="text" class="form-control" placeholder="如：品牌策划部">
    </div>
    <div class="form-group">
      <label class="form-label">部门负责人</label>
      <select class="form-control">
        <option>请选择</option>
        ${mockUsers.map(u=>`<option>${u.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">部门描述</label>
      <textarea class="form-control" style="height:60px" placeholder="部门职责描述（可选）"></textarea>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="showToast('部门创建成功','success');closeModal()">创建</button>
  `, 520);
}

function showNewAccountModal() {
  openModal('新建账号', `
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">姓名 <span class="required">*</span></label>
        <input type="text" class="form-control" placeholder="请输入真实姓名">
      </div>
      <div class="form-group">
        <label class="form-label">工号</label>
        <input type="text" class="form-control" placeholder="如：EMP008（留空自动生成）">
      </div>
      <div class="form-group">
        <label class="form-label">登录账号 <span class="required">*</span></label>
        <input type="text" class="form-control" placeholder="唯一标识，不可修改">
      </div>
      <div class="form-group">
        <label class="form-label">手机号 <span class="required">*</span></label>
        <input type="tel" class="form-control" placeholder="接收激活短信">
      </div>
      <div class="form-group">
        <label class="form-label">邮箱</label>
        <input type="email" class="form-control" placeholder="接收激活邮件">
      </div>
      <div class="form-group">
        <label class="form-label">所属部门 <span class="required">*</span></label>
        <select class="form-control">
          <option value="">请选择</option>
          <option>品牌部</option><option>传播部</option><option>数据部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">角色 <span class="required">*</span></label>
        <select class="form-control">
          <option value="member">普通员工</option>
          <option value="dept_admin">部门管理员</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">激活方式</label>
        <select class="form-control">
          <option>邮箱激活链接</option>
          <option>短信验证码</option>
          <option>管理员直接设置密码</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <textarea class="form-control" style="height:56px" placeholder="账号备注信息（可选）"></textarea>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="showToast('账号创建成功，激活通知已发送','success');closeModal()">确认创建</button>
  `, 620);
}

// ---- 选择操作 ----
function toggleAcctSelect(id, checked) {
  if (checked) acctSelectedIds.add(id);
  else acctSelectedIds.delete(id);
  updateAcctBatchBar();
}

function toggleAllAcct(cb) {
  mockUsers.forEach(u => {
    if (cb.checked) acctSelectedIds.add(u.id);
    else acctSelectedIds.delete(u.id);
  });
  updateAcctBatchBar();
  renderAcctTabContent();
}

function clearAcctSelection() {
  acctSelectedIds = new Set();
  updateAcctBatchBar();
  renderAcctTabContent();
}

function updateAcctBatchBar() {
  const bar = document.getElementById('acct-batch-bar');
  const cnt = document.getElementById('acct-batch-count');
  if (bar) bar.style.display = acctSelectedIds.size > 0 ? 'flex' : 'none';
  if (cnt) cnt.textContent = acctSelectedIds.size;
}

function toggleAcctMore(id) {
  closeAllDropdowns();
  const menu = document.getElementById('acct-more-' + id);
  if (menu) { menu.classList.add('open'); event.stopPropagation(); }
}

// ===================== 初始化 =====================
document.addEventListener('DOMContentLoaded', () => {
  showPage('monitor-list');
  // Tab切换
  document.querySelectorAll('.tab-bar .tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      tab.closest('.tab-bar').querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
});
