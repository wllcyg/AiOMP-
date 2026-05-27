// ===================== 互动量刷新任务管理页面 =====================
console.log('[page-refresh.js] loaded!');

// ---------- Mock数据 ----------
const mockRefreshLogs = [
  { id:'RF001', type:'manual', project:'M001', platform:'抖音', status:'success', time:'2026-04-13 09:45:23', contentCount:128, commentCount:342, duration:'12秒', operator:'张三' },
  { id:'RF002', type:'auto', project:'M001', platform:'微博', status:'success', time:'2026-04-13 09:30:00', contentCount:56, commentCount:189, duration:'8秒', operator:'系统' },
  { id:'RF003', type:'manual', project:'M002', platform:'小红书', status:'failed', time:'2026-04-13 09:15:10', contentCount:23, commentCount:0, duration:'失败', operator:'李四', error:'请求超时' },
  { id:'RF004', type:'auto', project:'M003', platform:'抖音', status:'success', time:'2026-04-13 08:00:00', contentCount:234, commentCount:567, duration:'18秒', operator:'系统' },
  { id:'RF005', type:'manual', project:'M001', platform:'微信', status:'success', time:'2026-04-12 18:30:45', contentCount:45, commentCount:123, duration:'6秒', operator:'王五' },
  { id:'RF006', type:'auto', project:'M002', platform:'汽车之家', status:'success', time:'2026-04-12 18:00:00', contentCount:89, commentCount:234, duration:'15秒', operator:'系统' },
  { id:'RF007', type:'manual', project:'M003', platform:'懂车帝', status:'failed', time:'2026-04-12 17:20:33', contentCount:12, commentCount:0, duration:'失败', operator:'张三', error:'API限流' },
  { id:'RF008', type:'auto', project:'M001', platform:'抖音', status:'success', time:'2026-04-12 08:00:00', contentCount:156, commentCount:423, duration:'14秒', operator:'系统' },
  { id:'RF009', type:'manual', project:'M004', platform:'微博', status:'success', time:'2026-04-11 16:45:22', contentCount:78, commentCount:201, duration:'10秒', operator:'李四' },
  { id:'RF010', type:'auto', project:'M002', platform:'小红书', status:'success', time:'2026-04-11 08:00:00', contentCount:67, commentCount:178, duration:'9秒', operator:'系统' },
];

// ---------- 状态变量 ----------
let refreshCurrentView = 'stats';
let refreshViewMode = 'company';
let refreshFilterTime = '7days';
let refreshFilterType = 'all';
let refreshFilterStatus = 'all';
let refreshFilterPlatform = 'all';
let refreshFilterProject = 'all';
let refreshSearchText = '';
let refreshCurrentPage = 1;
const refreshPageSize = 10;

// ---------- 渲染器 ----------
pageRenderers['refresh-mgmt'] = () => {
  refreshCurrentPage = 1;
  return renderRefreshMgmtPage();
};

pageInits['refresh-mgmt'] = () => {
  initRefreshCharts();
};

// ---------- 主页面HTML ----------
function renderRefreshMgmtPage() {
  return `
<div class="page active" id="refresh-mgmt-page">
  <!-- 顶部操作栏 -->
  <div class="page-header">
    <div class="page-title">互动量与评论刷新管理</div>
    <div class="page-actions">
      <div style="display:flex;align-items:center;gap:8px;margin-right:12px;padding:4px 12px;background:var(--bg-card);border-radius:6px;font-size:12px">
        <span style="color:var(--text-muted)">视图：</span>
        <button class="tab-btn ${refreshViewMode==='company'?'active':''}" onclick="switchRefreshView('company')">全公司</button>
        <button class="tab-btn ${refreshViewMode==='dept'?'active':''}" onclick="switchRefreshView('dept')">本部门</button>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="showPage('refresh-rules')">
        <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><circle cx="8" cy="8" r="6" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        自动刷新规则管理
      </button>
      <button class="btn btn-ghost btn-sm" onclick="openRefreshWarningModal()">
        <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2L1 14h14L8 2zM8 6v4M8 12v.5" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
        刷新用量预警
      </button>
      <button class="btn btn-ghost btn-sm" onclick="exportRefreshData()">
        <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2v8M4 6l4 4 4-4M2 12v2h12v-2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
        导出
      </button>
      <div class="search-box" style="max-width:200px;margin-left:12px">
        <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
        <input type="text" placeholder="搜索项目、平台..." id="refresh-search-input" value="${refreshSearchText}" oninput="onRefreshSearch(this.value)">
      </div>
    </div>
  </div>

  <!-- Tab栏 -->
  <div class="tab-bar">
    <div class="tab-item ${refreshCurrentView==='stats'?'active':''}" onclick="switchRefreshViewTab('stats')">
      统计分析视图
    </div>
    <div class="tab-item ${refreshCurrentView==='detail'?'active':''}" onclick="switchRefreshViewTab('detail')">
      明细记录列表
    </div>
  </div>

  ${renderRefreshFilterBar()}

  <div id="refresh-view-container">
    ${refreshCurrentView === 'stats' ? renderRefreshStatsView() : renderDetailView()}
  </div>

  <!-- 分页 -->
  <div class="flex-between mt-12" style="padding:6px 0;${refreshCurrentView==='stats'?'display:none':''}" id="refresh-pagination-bar">
    <div class="text-muted" id="refresh-pagination-info"></div>
    <div class="pagination" id="refresh-pagination"></div>
  </div>
</div>`;
}

// ---------- 筛选栏 ----------
function renderRefreshFilterBar() {
  const showCustom = refreshFilterTime === 'custom';
  return `
  <div class="filter-bar mb-0">
    <div class="filter-item" style="flex-wrap:wrap;gap:6px">
      <span class="filter-label">时间范围：</span>
      <select class="filter-select" onchange="onRefreshFilter('time', this.value)">
        <option value="today" ${refreshFilterTime==='today'?'selected':''}>今天</option>
        <option value="7days" ${refreshFilterTime==='7days'?'selected':''}>近7天</option>
        <option value="30days" ${refreshFilterTime==='30days'?'selected':''}>近30天</option>
        <option value="90days" ${refreshFilterTime==='90days'?'selected':''}>近90天</option>
        <option value="thisMonth" ${refreshFilterTime==='thisMonth'?'selected':''}>本月</option>
        <option value="lastMonth" ${refreshFilterTime==='lastMonth'?'selected':''}>上月</option>
        <option value="custom" ${refreshFilterTime==='custom'?'selected':''}>自定义时间</option>
      </select>
      <span id="custom-time-range" style="${showCustom?'':'display:none'};display:flex;align-items:center;gap:6px;font-size:12px">
        <input type="date" class="form-input" style="width:130px;font-size:12px;padding:4px 8px" id="custom-start-date" value="2025-04-01" onchange="onCustomDateChange()">
        <span style="color:var(--text-muted)">至</span>
        <input type="date" class="form-input" style="width:130px;font-size:12px;padding:4px 8px" id="custom-end-date" value="2026-04-17" onchange="onCustomDateChange()">
      </span>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">刷新类型：</span>
      <select class="filter-select" onchange="onRefreshFilter('type', this.value)">
        <option value="all" ${refreshFilterType==='all'?'selected':''}>全部类型</option>
        <option value="manual" ${refreshFilterType==='manual'?'selected':''}>手动刷新</option>
        <option value="auto" ${refreshFilterType==='auto'?'selected':''}>自动规则刷新</option>
      </select>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">刷新状态：</span>
      <select class="filter-select" onchange="onRefreshFilter('status', this.value)">
        <option value="all" ${refreshFilterStatus==='all'?'selected':''}>全部状态</option>
        <option value="success" ${refreshFilterStatus==='success'?'selected':''}>刷新成功</option>
        <option value="failed" ${refreshFilterStatus==='failed'?'selected':''}>刷新失败</option>
        <option value="running" ${refreshFilterStatus==='running'?'selected':''}>刷新中</option>
      </select>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">内容平台：</span>
      <select class="filter-select" onchange="onRefreshFilter('platform', this.value)">
        <option value="all" ${refreshFilterPlatform==='all'?'selected':''}>全部平台</option>
        <option value="抖音" ${refreshFilterPlatform==='抖音'?'selected':''}>抖音</option>
        <option value="微博" ${refreshFilterPlatform==='微博'?'selected':''}>微博</option>
        <option value="微信" ${refreshFilterPlatform==='微信'?'selected':''}>微信</option>
        <option value="小红书" ${refreshFilterPlatform==='小红书'?'selected':''}>小红书</option>
        <option value="汽车之家" ${refreshFilterPlatform==='汽车之家'?'selected':''}>汽车之家</option>
        <option value="懂车帝" ${refreshFilterPlatform==='懂车帝'?'selected':''}>懂车帝</option>
      </select>
    </div>
    <button class="btn btn-ghost btn-sm" style="color:var(--primary);margin-left:auto" onclick="resetRefreshFilters()">重置</button>
  </div>`;
}

// ---------- 统计视图 ----------
function renderRefreshStatsView() {
  const successRate = 87.5;

  return `
  <!-- 核心数据概览 -->
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:20px">
    <div class="stat-card" style="cursor:pointer" onclick="switchRefreshViewTab('detail')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:var(--primary)">156</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">累计刷新总次数</div>
        </div>
        <div class="stat-icon" style="background:var(--primary-bg);color:var(--primary)">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">
        <span style="color:var(--success)">手动 45%</span> · <span style="color:var(--info)">自动 55%</span>
      </div>
    </div>

    <div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:var(--text-primary)">70</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">手动刷新次数</div>
        </div>
        <div class="stat-icon" style="background:#f0f9ff;color:#0ea5e9">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:var(--text-primary)">86</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">自动规则刷新</div>
        </div>
        <div class="stat-icon" style="background:#f0fdf4;color:#22c55e">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:var(--text-primary)">1,284</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">累计刷新内容数</div>
        </div>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700;color:var(--text-primary)">3,567</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">累计获取评论数</div>
        </div>
        <div class="stat-icon" style="background:#fce7f3;color:#ec4899">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>

    <div class="stat-card ${successRate>=90?'':successRate>=80?'warning':'danger'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:28px;font-weight:700">${successRate}%</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">刷新成功率</div>
        </div>
        <div class="stat-icon" style="${successRate>=90?'background:var(--success-bg);color:var(--success)':successRate>=80?'background:#fef3c7;color:#f59e0b':'background:#fef2f2;color:var(--danger)'}">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-muted)">
        失败 <span style="color:var(--danger)">20</span> 次
      </div>
    </div>
  </div>

  <!-- 图表区域 -->
  <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:20px">
    <div class="card" style="padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-weight:600">刷新次数趋势</div>
        <div style="display:flex;gap:12px;font-size:12px">
          <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:var(--primary);border-radius:2px"></span>手动刷新</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:var(--info);border-radius:2px"></span>自动刷新</span>
          <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:var(--success);border-radius:2px"></span>成功率</span>
        </div>
      </div>
      <div id="refresh-trend-chart" style="width:100%;height:280px"></div>
    </div>
  </div>

  <!-- 分布图 -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
    <div class="card" style="padding:20px">
      <div style="font-weight:600;margin-bottom:16px">刷新类型分布</div>
      <div id="refresh-type-chart" style="width:100%;height:240px"></div>
    </div>
    <div class="card" style="padding:20px">
      <div style="font-weight:600;margin-bottom:16px">平台分布</div>
      <div id="refresh-platform-chart" style="width:100%;height:240px"></div>
    </div>
  </div>

  <!-- 维度排行 -->
  <div class="card" style="padding:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="font-weight:600">维度排行分析</div>
      <div class="tab-bar" style="background:var(--bg-page);padding:4px;border-radius:6px">
        <div class="tab-item active" onclick="switchRankTab(this, 'project')">按项目</div>
        <div class="tab-item" onclick="switchRankTab(this, 'platform')">按平台</div>
        <div class="tab-item" onclick="switchRankTab(this, 'operator')">按操作人</div>
        <div class="tab-item" onclick="switchRankTab(this, 'time')">按时段</div>
      </div>
    </div>
    <div id="rank-content">
      ${renderRankTable('project')}
    </div>
  </div>`;
}

function renderRankTable(type) {
  const rankData = {
    project: [
      { name:'长安CS75 3月品牌传播', count:45, successRate:92, trend:'up' },
      { name:'蔚来ET9上市传播监测', count:38, successRate:87, trend:'up' },
      { name:'理想L9 vs 蔚来ET9', count:32, successRate:95, trend:'down' },
      { name:'4月竞品对标分析', count:28, successRate:82, trend:'up' },
      { name:'Q1品牌健康度监测', count:13, successRate:100, trend:'stable' },
    ],
    platform: [
      { name:'抖音', count:56, successRate:91, trend:'up' },
      { name:'微博', count:42, successRate:88, trend:'up' },
      { name:'小红书', count:28, successRate:85, trend:'down' },
      { name:'汽车之家', count:18, successRate:94, trend:'stable' },
      { name:'懂车帝', count:12, successRate:75, trend:'up' },
    ],
    operator: [
      { name:'张三', count:35, successRate:94, trend:'up' },
      { name:'李四', count:28, successRate:89, trend:'up' },
      { name:'系统自动', count:86, successRate:87, trend:'stable' },
      { name:'王五', count:7, successRate:100, trend:'up' },
    ],
    time: [
      { name:'上午(6-12点)', count:68, successRate:91, trend:'up' },
      { name:'下午(12-18点)', count:52, successRate:88, trend:'down' },
      { name:'晚间(18-24点)', count:24, successRate:83, trend:'up' },
      { name:'凌晨(0-6点)', count:12, successRate:92, trend:'stable' },
    ],
  };

  const data = rankData[type] || rankData.project;
  const trendIcon = { up:'↑', down:'↓', stable:'→' };
  const trendColor = { up:'var(--success)', down:'var(--danger)', stable:'var(--text-muted)' };

  return `
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:50px">排名</th>
        <th>${type === 'project' ? '监测项目' : type === 'platform' ? '内容平台' : type === 'operator' ? '操作人' : '时段'}</th>
        <th style="width:120px">刷新次数</th>
        <th style="width:120px">成功率</th>
        <th style="width:100px">趋势</th>
      </tr>
    </thead>
    <tbody>
      ${data.map((item, i) => `
      <tr>
        <td><span class="rank-badge ${i<3?'top':''}">${i+1}</span></td>
        <td style="font-weight:500">${item.name}</td>
        <td>${item.count} 次</td>
        <td><span class="tag ${item.successRate>=90?'tag-green':item.successRate>=80?'tag-orange':'tag-red'}">${item.successRate}%</span></td>
        <td><span style="color:${trendColor[item.trend]}">${trendIcon[item.trend]}</span></td>
      </tr>
      `).join('')}
    </tbody>
  </table>`;
}

// ---------- 明细视图 ----------
function renderDetailView() {
  const filtered = getFilteredRefreshLogs();
  const total = filtered.length;
  const totalPages = Math.ceil(total / refreshPageSize);
  if (refreshCurrentPage > totalPages && totalPages > 0) refreshCurrentPage = totalPages;
  const paged = filtered.slice((refreshCurrentPage-1)*refreshPageSize, refreshCurrentPage*refreshPageSize);

  if (paged.length === 0) {
    return `<div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">📋</div>
      <div style="font-size:14px;margin-bottom:6px">暂无刷新记录</div>
      <div style="font-size:12px">调整筛选条件查看更多记录</div>
    </div>`;
  }

  const typeMap = { manual:'手动刷新', auto:'自动规则刷新' };
  const statusMap = { success:'成功', failed:'失败', running:'刷新中' };
  const statusCls = { success:'tag-green', failed:'tag-red', running:'tag-blue' };

  return `
  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:40px"><input type="checkbox" onchange="toggleAllRefreshLogs(this)"></th>
          <th>记录ID</th>
          <th>刷新类型</th>
          <th>所属项目</th>
          <th>平台</th>
          <th>刷新时间</th>
          <th>刷新状态</th>
          <th>内容数</th>
          <th>评论数</th>
          <th style="width:160px">操作</th>
        </tr>
      </thead>
      <tbody>
        ${paged.map(log => `
        <tr>
          <td><input type="checkbox" onchange="toggleRefreshLogSelect('${log.id}', this.checked)"></td>
          <td style="font-family:monospace;font-size:12px;color:var(--text-muted)">${log.id}</td>
          <td><span class="tag ${log.type==='manual'?'tag-blue':'tag-green'}">${typeMap[log.type]}</span></td>
          <td>${log.project}</td>
          <td>${log.platform}</td>
          <td style="font-size:12px;color:var(--text-secondary)">${log.time}</td>
          <td><span class="tag ${statusCls[log.status]}">${statusMap[log.status]}</span></td>
          <td>${log.contentCount}</td>
          <td>${log.commentCount}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="viewRefreshDetail('${log.id}')">详情</button>
              ${log.status === 'failed' ? `<button class="btn btn-ghost btn-sm" onclick="retryRefresh('${log.id}')">重试</button>` : ''}
              <div class="dropdown-wrap" style="position:relative">
                <button class="btn btn-ghost btn-sm" onclick="toggleRefreshMore(this, '${log.id}')">更多 ▾</button>
                <div class="dropdown-menu" style="display:none;right:0;min-width:120px;z-index:100">
                  <div class="dropdown-item" onclick="viewRefreshRule('${log.id}')">关联规则</div>
                  <div class="dropdown-item" onclick="exportRefreshLog('${log.id}')">导出</div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

// ---------- 分页 ----------
function renderRefreshPagination(totalPages, container) {
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  let html = `<button class="page-btn" onclick="gotoRefreshPage(${refreshCurrentPage-1})" ${refreshCurrentPage<=1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= refreshCurrentPage - 1 && i <= refreshCurrentPage + 1)) {
      html += `<button class="page-btn ${i===refreshCurrentPage?'active':''}" onclick="gotoRefreshPage(${i})">${i}</button>`;
    } else if (i === refreshCurrentPage - 2 || i === refreshCurrentPage + 2) {
      html += `<span style="padding:0 4px">...</span>`;
    }
  }
  html += `<button class="page-btn" onclick="gotoRefreshPage(${refreshCurrentPage+1})" ${refreshCurrentPage>=totalPages?'disabled':''}>›</button>`;
  container.innerHTML = html;
}

function gotoRefreshPage(p) {
  const filtered = getFilteredRefreshLogs();
  const totalPages = Math.ceil(filtered.length / refreshPageSize);
  if (p < 1 || p > totalPages) return;
  refreshCurrentPage = p;
  renderDetailView();
  renderRefreshPagination(totalPages, document.getElementById('refresh-pagination'));
}

// ---------- 筛选 ----------
function getFilteredRefreshLogs() {
  let list = [...mockRefreshLogs];
  if (refreshFilterType !== 'all') list = list.filter(l => l.type === refreshFilterType);
  if (refreshFilterStatus !== 'all') list = list.filter(l => l.status === refreshFilterStatus);
  if (refreshFilterPlatform !== 'all') list = list.filter(l => l.platform === refreshFilterPlatform);
  if (refreshSearchText) {
    const q = refreshSearchText.toLowerCase();
    list = list.filter(l => l.id.toLowerCase().includes(q) || l.project.toLowerCase().includes(q) || l.platform.toLowerCase().includes(q));
  }
  return list;
}

function switchRefreshViewTab(tab) {
  refreshCurrentView = tab;
  refreshCurrentPage = 1;
  const container = document.getElementById('refresh-view-container');
  const paginationBar = document.getElementById('refresh-pagination-bar');
  if (container) {
    container.innerHTML = tab === 'stats' ? renderRefreshStatsView() : renderDetailView();
  }
  if (paginationBar) {
    paginationBar.style.display = tab === 'stats' ? 'none' : 'flex';
    if (tab === 'detail') {
      const total = getFilteredRefreshLogs().length;
      const totalPages = Math.ceil(total / refreshPageSize);
      document.getElementById('refresh-pagination-info').textContent = `共 ${total} 条记录`;
      renderRefreshPagination(totalPages, document.getElementById('refresh-pagination'));
    }
  }
  if (tab === 'stats') {
    setTimeout(() => initRefreshCharts(), 100);
  }
}

function switchRefreshView(mode) {
  refreshViewMode = mode;
  refreshCurrentPage = 1;
  showPage('refresh-mgmt');
}

function onRefreshSearch(val) {
  refreshSearchText = val;
  refreshCurrentPage = 1;
  if (refreshCurrentView === 'detail') {
    renderDetailView();
    const total = getFilteredRefreshLogs().length;
    const totalPages = Math.ceil(total / refreshPageSize);
    document.getElementById('refresh-pagination-info').textContent = `共 ${total} 条记录`;
    renderRefreshPagination(totalPages, document.getElementById('refresh-pagination'));
  }
}

function onRefreshFilter(type, val) {
  if (type === 'time') refreshFilterTime = val;
  else if (type === 'type') refreshFilterType = val;
  else if (type === 'status') refreshFilterStatus = val;
  else if (type === 'platform') refreshFilterPlatform = val;
  refreshCurrentPage = 1;
  showPage('refresh-mgmt');
}

function onCustomDateChange() {
  // 自定义时间变更后自动刷新（不需要额外操作，showPage已刷新）
  const startDate = document.getElementById('custom-start-date')?.value;
  const endDate = document.getElementById('custom-end-date')?.value;
  console.log('Custom date range:', startDate, 'to', endDate);
}

function resetRefreshFilters() {
  refreshFilterTime = '7days';
  refreshFilterType = 'all';
  refreshFilterStatus = 'all';
  refreshFilterPlatform = 'all';
  refreshSearchText = '';
  refreshCurrentPage = 1;
  showPage('refresh-mgmt');
  showToast('筛选条件已重置', 'info');
}

// 自定义时间范围变量
let refreshCustomStart = '2025-04-01';
let refreshCustomEnd = '2026-04-17';

function switchRankTab(el, type) {
  const container = el.parentElement;
  container.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const rankContent = document.getElementById('rank-content');
  if (rankContent) {
    rankContent.innerHTML = renderRankTable(type);
  }
}

// ---------- 操作 ----------
function toggleRefreshMore(btn, logId) {
  const menu = btn.nextElementSibling;
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    if (m !== menu) m.style.display = 'none';
  });
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function toggleRefreshLogSelect(id, checked) {}

function toggleAllRefreshLogs(cb) {}

function viewRefreshDetail(logId) {
  const log = mockRefreshLogs.find(l => l.id === logId);
  if (!log) return;

  openModal('刷新详情', `
    <div style="display:grid;gap:12px">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">记录ID</span>
        <span style="font-family:monospace">${log.id}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">刷新类型</span>
        <span class="tag ${log.type==='manual'?'tag-blue':'tag-green'}">${log.type==='manual'?'手动刷新':'自动规则刷新'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">所属项目</span>
        <span>${log.project}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">内容平台</span>
        <span>${log.platform}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">刷新时间</span>
        <span>${log.time}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">刷新状态</span>
        <span class="tag ${log.status==='success'?'tag-green':log.status==='failed'?'tag-red':'tag-blue'}">${log.status==='success'?'成功':log.status==='failed'?'失败':'刷新中'}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">刷新内容</span>
        <span>${log.contentCount} 条</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">获取评论</span>
        <span>${log.commentCount} 条</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-muted)">刷新耗时</span>
        <span>${log.duration}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0">
        <span style="color:var(--text-muted)">操作人</span>
        <span>${log.operator}</span>
      </div>
      ${log.error ? `
      <div style="display:flex;justify-content:space-between;padding:8px 0;color:var(--danger)">
        <span>失败原因</span>
        <span>${log.error}</span>
      </div>
      ` : ''}
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">关闭</button>
    ${log.status === 'failed' ? `<button class="btn btn-primary" onclick="retryRefresh('${logId}');closeModal()">重试刷新</button>` : ''}
  `, 450);
}

function retryRefresh(logId) {
  showToast('正在重试刷新...', 'info');
  setTimeout(() => showToast('重试成功！', 'success'), 1500);
}

function viewRefreshRule(logId) {
  showToast('查看关联规则', 'info');
}

function exportRefreshLog(logId) {
  showToast('正在导出刷新记录...', 'info');
  setTimeout(() => showToast('导出成功！', 'success'), 1000);
}

function exportRefreshData() {
  if (refreshCurrentView === 'stats') {
    showToast('正在导出统计报表...', 'info');
  } else {
    showToast('正在导出明细数据...', 'info');
  }
  setTimeout(() => showToast('导出成功！', 'success'), 1500);
}

function openRefreshWarningModal() {
  openModal('刷新用量预警设置', `
    <div style="display:grid;gap:20px">
      <div class="form-group">
        <label class="form-label">预警类型</label>
        <div style="display:flex;gap:12px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 12px;background:var(--bg-page);border-radius:6px">
            <input type="radio" name="warnType" value="dept" checked> 部门预警
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;padding:8px 12px;background:var(--bg-page);border-radius:6px">
            <input type="radio" name="warnType" value="project"> 项目预警
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">月度刷新次数阈值</label>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="number" class="form-input" value="500" style="width:120px">
          <span style="color:var(--text-muted)">次 / 月</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">预警通知方式</label>
        <div style="display:flex;gap:12px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" checked> 系统通知
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox"> 邮件通知
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox"> 短信通知
          </label>
        </div>
      </div>
      <div style="padding:12px;background:var(--bg-page);border-radius:8px;font-size:12px;color:var(--text-secondary)">
        <div style="font-weight:500;margin-bottom:6px">预警说明</div>
        <div>• 当月度刷新次数达到阈值的80%时，发送预警通知</div>
        <div>• 超过阈值时，每次刷新操作前都会弹出确认提示</div>
        <div>• 超额使用可能产生额外费用</div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="saveRefreshWarning()">保存设置</button>
  `, 480);
}

function saveRefreshWarning() {
  showToast('预警设置已保存', 'success');
  closeModal();
}

// ---------- 图表初始化 ----------
function initRefreshCharts() {
  setTimeout(() => {
    initTrendChart();
    initTypeChart();
    initPlatformChart();
  }, 100);
}

function initTrendChart() {
  const chartDom = document.getElementById('refresh-trend-chart');
  if (!chartDom || typeof echarts === 'undefined') return;

  const chart = echarts.init(chartDom);
  const dates = ['04-07', '04-08', '04-09', '04-10', '04-11', '04-12', '04-13'];
  const manualData = [8, 12, 6, 15, 10, 14, 5];
  const autoData = [12, 15, 18, 10, 20, 16, 5];
  const successRateData = [92, 88, 95, 87, 91, 89, 85];

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { show: false },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10px', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280', fontSize: 11 }
    },
    yAxis: [
      { type: 'value', name: '刷新次数', position: 'left', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f3f4f6' } }, axisLabel: { color: '#6b7280', fontSize: 11 } },
      { type: 'value', name: '成功率', position: 'right', min: 0, max: 100, axisLine: { show: false }, splitLine: { show: false }, axisLabel: { color: '#6b7280', fontSize: 11, formatter: '{value}%' } }
    ],
    series: [
      { name: '手动刷新', type: 'bar', stack: 'total', data: manualData, itemStyle: { color: '#D93F4A' }, barWidth: '30%' },
      { name: '自动刷新', type: 'bar', stack: 'total', data: autoData, itemStyle: { color: '#3B82F6' } },
      { name: '成功率', type: 'line', yAxisIndex: 1, data: successRateData, smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: '#22C55E', width: 2 }, itemStyle: { color: '#22C55E' } }
    ]
  };

  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}

function initTypeChart() {
  const chartDom = document.getElementById('refresh-type-chart');
  if (!chartDom || typeof echarts === 'undefined') return;

  const chart = echarts.init(chartDom);
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '10%', top: 'center', textStyle: { color: '#374151', fontSize: 12 } },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 70, name: '手动刷新', itemStyle: { color: '#3B82F6' } },
        { value: 86, name: '自动规则刷新', itemStyle: { color: '#22C55E' } }
      ]
    }]
  };

  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}

function initPlatformChart() {
  const chartDom = document.getElementById('refresh-platform-chart');
  if (!chartDom || typeof echarts === 'undefined') return;

  const chart = echarts.init(chartDom);
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#374151', fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['35%', '50%'], roseType: 'radius',
      itemStyle: { borderRadius: 3, borderColor: '#fff', borderWidth: 1 },
      label: { show: false },
      data: [
        { value: 56, name: '抖音', itemStyle: { color: '#FF6B6B' } },
        { value: 42, name: '微博', itemStyle: { color: '#4ECDC4' } },
        { value: 28, name: '小红书', itemStyle: { color: '#FFE66D' } },
        { value: 18, name: '汽车之家', itemStyle: { color: '#95E1D3' } },
        { value: 12, name: '懂车帝', itemStyle: { color: '#DDA0DD' } }
      ]
    }]
  };

  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize());
}
