// ===================== 账号管理中心页面 =====================

// ---------- Mock数据 ----------
const mockUsers = [
  { id:'U001', name:'张三', account:'zhangsan', empNo:'EMP001', dept:'市场部', deptId:'D002', type:'admin', status:'active', lastLogin:'2026-04-13 09:30', phone:'13800138001', email:'zhangsan@brand.com', createTime:'2025-01-15', creator:'admin', beans:5000, expireTime:'2027-12-31' },
  { id:'U002', name:'李四', account:'lisi', empNo:'EMP002', dept:'市场部', deptId:'D002', type:'normal', status:'active', lastLogin:'2026-04-12 18:45', phone:'13800138002', email:'lisi@brand.com', createTime:'2025-03-20', creator:'admin', beans:2800, expireTime:'2026-06-30' },
  { id:'U003', name:'王五', account:'wangwu', empNo:'EMP003', dept:'产品部', deptId:'D003', type:'normal', status:'active', lastLogin:'2026-04-11 14:20', phone:'13800138003', email:'wangwu@brand.com', createTime:'2025-06-10', creator:'admin', beans:1200, expireTime:'2026-12-31' },
  { id:'U004', name:'赵六', account:'zhaoliu', empNo:'EMP004', dept:'技术部', deptId:'D004', type:'normal', status:'frozen', lastLogin:'2026-03-28 10:00', phone:'13800138004', email:'zhaoliu@brand.com', createTime:'2025-08-05', creator:'admin', beans:0, expireTime:'2025-08-05' },
  { id:'U005', name:'孙七', account:'sunqi', empNo:'EMP005', dept:'市场部', deptId:'D002', type:'normal', status:'pending', lastLogin:'-', phone:'13800138005', email:'sunqi@brand.com', createTime:'2026-04-01', creator:'张三', beans:1000, expireTime:'2027-04-01' },
  { id:'U006', name:'周八', account:'zhouba', empNo:'EMP006', dept:'运营部', deptId:'D005', type:'admin', status:'active', lastLogin:'2026-04-13 08:00', phone:'13800138006', email:'zhouba@brand.com', createTime:'2025-02-18', creator:'admin', beans:8000, expireTime:'2028-02-18' },
  { id:'U007', name:'吴九', account:'wujiu', empNo:'EMP007', dept:'产品部', deptId:'D003', type:'normal', status:'active', lastLogin:'2026-04-10 16:30', phone:'13800138007', email:'wujiu@brand.com', createTime:'2025-09-12', creator:'admin', beans:3500, expireTime:'2026-09-12' },
  { id:'U008', name:'郑十', account:'zhengshi', empNo:'EMP008', dept:'技术部', deptId:'D004', type:'normal', status:'frozen', lastLogin:'2026-02-20 11:15', phone:'13800138008', email:'zhengshi@brand.com', createTime:'2025-11-03', creator:'admin', beans:600, expireTime:'2025-11-03' },
];

const mockDepts = [
  { id:'D001', name:'总公司', parentId:null, leader:'陈总', status:'active', count:8 },
  { id:'D002', name:'市场部', parentId:'D001', leader:'张三', status:'active', count:25 },
  { id:'D003', name:'产品部', parentId:'D001', leader:'王五', status:'active', count:18 },
  { id:'D004', name:'技术部', parentId:'D001', leader:'赵六', status:'active', count:32 },
  { id:'D005', name:'运营部', parentId:'D001', leader:'周八', status:'active', count:15 },
  { id:'D006', name:'市场一部', parentId:'D002', leader:'李四', status:'active', count:12 },
  { id:'D007', name:'市场二部', parentId:'D002', leader:'孙七', status:'active', count:13 },
];

// ---------- 状态变量 ----------
let accountCurrentTab = 'users'; // users | depts
let accountViewMode = 'table'; // table | card
let accountSearchText = '';
let accountFilterStatus = 'all';
let accountFilterDept = 'all';
let accountFilterType = 'all';
let accountFilterCreateTime = 'all';
let accountCurrentPage = 1;
const accountPageSize = 10;
let accountSelectedIds = new Set();
let selectedDeptId = null;

// ---------- 渲染器 ----------
pageRenderers['account-mgmt'] = () => {
  accountSelectedIds = new Set();
  accountCurrentPage = 1;
  return renderAccountMgmtPage();
};

pageInits['account-mgmt'] = () => {
  renderAccountContent();
};

// ---------- 主页面HTML ----------
function renderAccountMgmtPage() {
  return `
<div class="page active" id="account-mgmt-page">
  <!-- 顶部操作栏 -->
  <div class="page-header">
    <div class="page-title">账号管理中心</div>
    <div class="page-actions">
      ${accountCurrentTab === 'users' ? `
        <button class="btn btn-ghost btn-sm" onclick="openBatchImportModal()">
          <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2v8M4 6l4-4 4 4M2 12v2h12v-2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
          批量导入
        </button>
        <div class="view-toggle" style="margin:0 8px">
          <button class="view-btn ${accountViewMode==='table'?'active':''}" onclick="switchAccountView('table')" title="表格视图">
            <svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12M6 2v12M10 2v12" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
          </button>
          <button class="view-btn ${accountViewMode==='card'?'active':''}" onclick="switchAccountView('card')" title="卡片视图">
            <svg viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
          </button>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="openCreateUserModal()">
          <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2v12M2 8h12" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          新建账号
        </button>
      ` : ''}
      ${accountCurrentTab === 'depts' ? `
        <button class="btn btn-secondary btn-sm" onclick="openCreateDeptModal()">
          <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2v12M2 8h12" stroke="currentColor" fill="none" stroke-width="2"/></svg>
          新增部门
        </button>
      ` : ''}
      <button class="btn btn-ghost btn-sm" onclick="exportAccountData()" style="margin-left:8px">
        <svg viewBox="0 0 16 16" style="width:13px;height:13px;margin-right:4px"><path d="M8 2v8M4 6l4 4 4-4M2 12v2h12v-2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>
        导出
      </button>
      <div class="search-box" style="max-width:200px;margin-left:12px">
        <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
        <input type="text" placeholder="搜索账号、姓名..." id="account-search-input" value="${accountSearchText}" oninput="onAccountSearch(this.value)">
      </div>
    </div>
  </div>

  <!-- Tab栏 -->
  <div class="tab-bar">
    <div class="tab-item ${accountCurrentTab==='users'?'active':''}" onclick="switchAccountTab('users')">
      用户账号管理
    </div>
    <div class="tab-item ${accountCurrentTab==='depts'?'active':''}" onclick="switchAccountTab('depts')">
      组织部门管理
    </div>
  </div>

  ${accountCurrentTab === 'users' ? renderUserFilterBar() : ''}
  ${accountCurrentTab === 'depts' ? renderDeptFilterBar() : ''}

  <!-- 内容区 -->
  <div id="account-content-area"></div>

  <!-- 分页 -->
  <div class="flex-between mt-12" style="padding:6px 0" id="account-pagination-bar">
    <div class="text-muted" id="account-pagination-info"></div>
    <div class="pagination" id="account-pagination"></div>
  </div>
</div>`;
}

// ---------- 用户筛选栏 ----------
function renderUserFilterBar() {
  const statusOptions = [
    { value:'all', label:'全部' },
    { value:'active', label:'启用' },
    { value:'frozen', label:'冻结' },
    { value:'pending', label:'待激活' },
  ];
  const deptOptions = [
    { value:'all', label:'全部部门' },
    { value:'D002', label:'市场部' },
    { value:'D003', label:'产品部' },
    { value:'D004', label:'技术部' },
    { value:'D005', label:'运营部' },
  ];
  const typeOptions = [
    { value:'all', label:'全部类型' },
    { value:'admin', label:'部门管理员' },
    { value:'normal', label:'普通员工' },
  ];
  const timeOptions = [
    { value:'all', label:'全部时间' },
    { value:'today', label:'今天' },
    { value:'7days', label:'近7天' },
    { value:'30days', label:'近30天' },
    { value:'90days', label:'近90天' },
  ];

  return `
  <div class="filter-bar mb-0">
    <div class="filter-item">
      <span class="filter-label">账号状态：</span>
      <select class="filter-select" onchange="onAccountFilter('status', this.value)">
        ${statusOptions.map(o => `<option value="${o.value}" ${accountFilterStatus===o.value?'selected':''}>${o.label}</option>`).join('')}
      </select>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">所属部门：</span>
      <select class="filter-select" onchange="onAccountFilter('dept', this.value)">
        ${deptOptions.map(o => `<option value="${o.value}" ${accountFilterDept===o.value?'selected':''}>${o.label}</option>`).join('')}
      </select>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">账号类型：</span>
      <select class="filter-select" onchange="onAccountFilter('type', this.value)">
        ${typeOptions.map(o => `<option value="${o.value}" ${accountFilterType===o.value?'selected':''}>${o.label}</option>`).join('')}
      </select>
    </div>
    <div class="filter-divider"></div>
    <div class="filter-item">
      <span class="filter-label">创建时间：</span>
      <select class="filter-select" onchange="onAccountFilter('createTime', this.value)">
        ${timeOptions.map(o => `<option value="${o.value}" ${accountFilterCreateTime===o.value?'selected':''}>${o.label}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-ghost btn-sm" style="color:var(--primary);margin-left:auto" onclick="resetAccountFilters()">重置</button>
  </div>`;
}

// ---------- 部门筛选栏 ----------
function renderDeptFilterBar() {
  return `
  <div class="filter-bar mb-0">
    <div class="filter-item">
      <span class="filter-label">部门状态：</span>
      <select class="filter-select" onchange="onDeptFilter('status', this.value)">
        <option value="all">全部</option>
        <option value="active">启用</option>
        <option value="stopped">停用</option>
      </select>
    </div>
    <button class="btn btn-ghost btn-sm" style="color:var(--primary);margin-left:auto" onclick="resetDeptFilters()">重置</button>
  </div>`;
}

// ---------- 内容渲染 ----------
function renderAccountContent() {
  if (accountCurrentTab === 'users') {
    renderUserContent();
  } else {
    renderDeptContent();
  }
}

function renderUserContent() {
  const filtered = getFilteredUsers();
  const total = filtered.length;
  const totalPages = Math.ceil(total / accountPageSize);
  if (accountCurrentPage > totalPages && totalPages > 0) accountCurrentPage = totalPages;
  const paged = filtered.slice((accountCurrentPage-1)*accountPageSize, accountCurrentPage*accountPageSize);

  const area = document.getElementById('account-content-area');
  const infoEl = document.getElementById('account-pagination-info');
  const pageEl = document.getElementById('account-pagination');
  if (!area) return;

  if (paged.length === 0) {
    area.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
      <div style="font-size:40px;margin-bottom:12px">👤</div>
      <div style="font-size:14px;margin-bottom:6px">暂无账号</div>
      <div style="font-size:12px">调整筛选条件或新建账号</div>
    </div>`;
    if (infoEl) infoEl.textContent = '共 0 个账号';
    if (pageEl) pageEl.innerHTML = '';
    return;
  }

  if (accountViewMode === 'table') {
    area.innerHTML = renderUserTable(paged);
  } else {
    area.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
      ${paged.map(u => renderUserCard(u)).join('')}
    </div>`;
  }

  if (infoEl) infoEl.textContent = `共 ${total} 个账号`;
  if (pageEl) renderAccountPagination(totalPages, pageEl);
}

function renderUserTable(users) {
  const statusMap = { active:'启用', frozen:'冻结', pending:'待激活' };
  const typeMap = { admin:'部门管理员', normal:'普通员工' };
  const statusCls = { active:'tag-green', frozen:'tag-red', pending:'tag-orange' };

  return `
  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:40px"><input type="checkbox" onchange="toggleAllUsers(this)"></th>
          <th>账号信息</th>
          <th>所属部门</th>
          <th>账号类型</th>
          <th>账号状态</th>
          <th>洞察豆余额</th>
          <th>账号到期时间</th>
          <th>最后登录</th>
          <th style="width:220px">操作</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
        <tr>
          <td><input type="checkbox" ${accountSelectedIds.has(u.id)?'checked':''} onchange="toggleUserSelect('${u.id}', this.checked)"></td>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600">${u.name.charAt(0)}</div>
              <div>
                <div style="font-weight:500">${u.name}</div>
                <div style="font-size:12px;color:var(--text-muted)">${u.account} · ${u.empNo}</div>
              </div>
            </div>
          </td>
          <td><span class="tag tag-gray">${u.dept}</span></td>
          <td>${typeMap[u.type]}</td>
          <td><span class="tag ${statusCls[u.status]}">${statusMap[u.status]}</span></td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-weight:600;color:var(--primary)">${u.beans.toLocaleString()}</span>
              <button class="btn btn-ghost btn-xs" onclick="openRechargeBeansModal('${u.id}')" title="充值洞察豆" style="padding:2px 6px;font-size:10px">充值</button>
            </div>
          </td>
          <td>
            <div style="font-size:12px">${u.expireTime}</div>
            ${isExpiringSoon(u.expireTime) ? '<span style="font-size:10px;color:var(--danger)">即将到期</span>' : ''}
          </td>
          <td style="color:var(--text-muted);font-size:12px">${u.lastLogin}</td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn btn-ghost btn-sm" onclick="openEditUserModal('${u.id}')">编辑</button>
              <button class="btn btn-ghost btn-sm" onclick="resetUserPassword('${u.id}')">重置密码</button>
              <div class="dropdown-wrap" style="position:relative">
                <button class="btn btn-ghost btn-sm" onclick="toggleUserMore(this, '${u.id}')">更多 ▾</button>
                <div class="dropdown-menu" style="display:none;right:0;min-width:120px;z-index:100">
                  <div class="dropdown-item" onclick="openRechargeBeansModal('${u.id}')">💰 充值洞察豆</div>
                  ${u.status === 'active' ? `<div class="dropdown-item" onclick="freezeUser('${u.id}')">冻结账号</div>` : `<div class="dropdown-item" onclick="unfreezeUser('${u.id}')">启用账号</div>`}
                  <div class="dropdown-item danger" onclick="deleteUser('${u.id}')">删除</div>
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

// 判断是否即将到期（30天内）
function isExpiringSoon(expireTime) {
  if (!expireTime) return false;
  const now = new Date();
  const expire = new Date(expireTime);
  const diff = (expire - now) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 30;
}

// 充值洞察豆模态框
function openRechargeBeansModal(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;

  openModal(`💰 充值洞察豆 · ${user.name}`, `
    <div style="display:grid;gap:16px">
      <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-card2);border-radius:8px">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600">${user.name.charAt(0)}</div>
        <div>
          <div style="font-weight:600">${user.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">当前余额：<span style="color:var(--primary);font-weight:600">${user.beans.toLocaleString()}</span> 洞察豆</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label required">充值数量</label>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px">
          <button class="btn btn-secondary btn-sm" onclick="setRechargeAmount(this, 1000)" style="padding:8px">1,000</button>
          <button class="btn btn-secondary btn-sm" onclick="setRechargeAmount(this, 2000)" style="padding:8px">2,000</button>
          <button class="btn btn-secondary btn-sm" onclick="setRechargeAmount(this, 5000)" style="padding:8px">5,000</button>
          <button class="btn btn-secondary btn-sm" onclick="setRechargeAmount(this, 10000)" style="padding:8px">10,000</button>
        </div>
        <input type="number" class="form-input" id="recharge-beans-input" placeholder="或输入自定义数量" min="1" value="1000">
      </div>
      <div class="form-group">
        <label class="form-label">延长到期时间</label>
        <input type="date" class="form-input" id="recharge-expire-input" value="${user.expireTime || ''}" style="cursor:pointer">
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px">留空则不修改到期时间</div>
      </div>
      <div style="padding:12px;background:var(--primary-bg);border-radius:8px">
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px">充值说明</div>
        <div style="font-size:11px;color:var(--text-muted)">• 1元 = 10洞察豆<br>• 充值后立即到账<br>• 洞察豆不支持提现和转让</div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="doRechargeBeans('${userId}')">确认充值</button>
  `, 500);
}

function setRechargeAmount(btn, amount) {
  document.querySelectorAll('#modal-body .btn-secondary').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('recharge-beans-input').value = amount;
}

function doRechargeBeans(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;
  const beans = parseInt(document.getElementById('recharge-beans-input').value) || 0;
  const expireTime = document.getElementById('recharge-expire-input').value;
  if (beans <= 0) {
    showToast('请输入正确的充值数量', 'error');
    return;
  }
  user.beans += beans;
  if (expireTime) {
    user.expireTime = expireTime;
  }
  showToast(`充值成功！${user.name} 洞察豆余额：${user.beans.toLocaleString()}`, 'success');
  closeModal();
  renderAccountContent();
}

function renderUserCard(user) {
  const statusMap = { active:'启用', frozen:'冻结', pending:'待激活' };
  const typeMap = { admin:'部门管理员', normal:'普通员工' };
  const statusCls = { active:'tag-green', frozen:'tag-red', pending:'tag-orange' };

  return `
  <div class="card" style="padding:16px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
      <div style="width:44px;height:44px;border-radius:50%;background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600">${user.name.charAt(0)}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px">${user.name}</div>
        <div style="font-size:12px;color:var(--text-muted)">${user.account}</div>
      </div>
      <span class="tag ${statusCls[user.status]}">${statusMap[user.status]}</span>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">
      <div style="margin-bottom:4px"><span class="text-muted">工号：</span>${user.empNo}</div>
      <div style="margin-bottom:4px"><span class="text-muted">部门：</span>${user.dept}</div>
      <div style="margin-bottom:4px"><span class="text-muted">类型：</span>${typeMap[user.type]}</div>
      <div><span class="text-muted">最后登录：</span>${user.lastLogin}</div>
    </div>
    <div style="display:flex;gap:12px;padding:8px;background:var(--bg-card2);border-radius:6px;margin-bottom:8px">
      <div style="flex:1;text-align:center">
        <div style="font-size:10px;color:var(--text-muted)">洞察豆</div>
        <div style="font-size:14px;font-weight:600;color:var(--primary)">${user.beans.toLocaleString()}</div>
      </div>
      <div style="width:1px;background:var(--border)"></div>
      <div style="flex:1;text-align:center">
        <div style="font-size:10px;color:var(--text-muted)">到期时间</div>
        <div style="font-size:14px;font-weight:600">${user.expireTime || '永久'}</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;border-top:1px solid var(--border);padding-top:12px;margin-top:4px">
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openEditUserModal('${user.id}')">编辑</button>
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="openRechargeBeansModal('${user.id}')">充值</button>
      <button class="btn btn-ghost btn-sm" style="flex:1" onclick="resetUserPassword('${user.id}')">重置密码</button>
    </div>
  </div>`;
}

// ---------- 部门内容 ----------
function renderDeptContent() {
  const area = document.getElementById('account-content-area');
  if (!area) return;

  const selectedDept = selectedDeptId ? mockDepts.find(d => d.id === selectedDeptId) : null;

  area.innerHTML = `
  <div style="display:flex;gap:16px;min-height:500px">
    <!-- 左侧部门树 -->
    <div class="card" style="width:280px;padding:0;flex-shrink:0">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);font-weight:600">组织架构</div>
      <div style="padding:12px">
        ${renderDeptTree(mockDepts.filter(d => d.parentId === null))}
      </div>
    </div>
    <!-- 右侧详情 -->
    <div class="card" style="flex:1;padding:20px">
      ${selectedDept ? renderDeptDetail(selectedDept) : `
        <div style="text-align:center;padding:60px;color:var(--text-muted)">
          <div style="font-size:48px;margin-bottom:12px">🏢</div>
          <div>请选择左侧部门查看详情</div>
        </div>
      `}
    </div>
  </div>`;
}

function renderDeptTree(depts, level = 0) {
  return depts.map(dept => {
    const children = mockDepts.filter(d => d.parentId === dept.id);
    const hasChildren = children.length > 0;
    const isSelected = selectedDeptId === dept.id;
    const marginLeft = level * 16;

    return `
    <div style="margin-bottom:2px">
      <div class="dept-tree-item ${isSelected?'selected':''}" onclick="selectDept('${dept.id}')" style="margin-left:${marginLeft}px;padding:8px 12px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:6px;${isSelected?'background:var(--primary-bg);color:var(--primary)':''}">
        ${hasChildren ? `<span onclick="event.stopPropagation();toggleDeptExpand('${dept.id}')" style="width:16px;text-align:center">▶</span>` : '<span style="width:16px"></span>'}
        <span style="flex:1">${dept.name}</span>
        <span style="font-size:11px;color:var(--text-muted)">${dept.count}</span>
      </div>
      ${hasChildren ? renderDeptTree(children, level + 1) : ''}
    </div>`;
  }).join('');
}

function renderDeptDetail(dept) {
  const members = mockUsers.filter(u => u.deptId === dept.id);
  const leader = members.find(m => m.name === dept.leader);
  const children = mockDepts.filter(d => d.parentId === dept.id);

  return `
  <div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div>
        <h3 style="margin:0 0 4px 0;font-size:18px">${dept.name}</h3>
        <div style="font-size:12px;color:var(--text-muted)">
          部门编码：${dept.id} · 
          状态：<span class="tag tag-green">${dept.status==='active'?'启用':'停用'}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="openEditDeptModal('${dept.id}')">编辑</button>
        <button class="btn btn-ghost btn-sm" onclick="toggleDeptStatus('${dept.id}')">${dept.status==='active'?'停用':'启用'}</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      <div class="stat-card">
        <div style="font-size:24px;font-weight:700;color:var(--primary)">${dept.count}</div>
        <div style="font-size:12px;color:var(--text-muted)">部门成员</div>
      </div>
      <div class="stat-card">
        <div style="font-size:24px;font-weight:700;color:var(--primary)">${children.length}</div>
        <div style="font-size:12px;color:var(--text-muted)">子部门数量</div>
      </div>
      <div class="stat-card">
        <div style="font-size:24px;font-weight:700;color:var(--primary)">${leader?.name || '-'}</div>
        <div style="font-size:12px;color:var(--text-muted)">部门负责人</div>
      </div>
    </div>

    ${children.length > 0 ? `
    <div style="margin-bottom:24px">
      <div style="font-weight:600;margin-bottom:12px">子部门</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${children.map(d => `
          <span class="tag tag-gray" style="cursor:pointer" onclick="selectDept('${d.id}')">${d.name}</span>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div>
      <div style="font-weight:600;margin-bottom:12px">部门成员（${members.length}人）</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${members.map(m => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg-page);border-radius:8px">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-bg);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600">${m.name.charAt(0)}</div>
            <div>
              <div style="font-size:12px;font-weight:500">${m.name}</div>
              <div style="font-size:10px;color:var(--text-muted)">${m.type==='admin'?'管理员':'成员'}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

// ---------- 分页 ----------
function renderAccountPagination(totalPages, container) {
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  let html = `<button class="page-btn" onclick="gotoAccountPage(${accountCurrentPage-1})" ${accountCurrentPage<=1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= accountCurrentPage - 1 && i <= accountCurrentPage + 1)) {
      html += `<button class="page-btn ${i===accountCurrentPage?'active':''}" onclick="gotoAccountPage(${i})">${i}</button>`;
    } else if (i === accountCurrentPage - 2 || i === accountCurrentPage + 2) {
      html += `<span style="padding:0 4px">...</span>`;
    }
  }
  html += `<button class="page-btn" onclick="gotoAccountPage(${accountCurrentPage+1})" ${accountCurrentPage>=totalPages?'disabled':''}>›</button>`;
  container.innerHTML = html;
}

function gotoAccountPage(p) {
  const filtered = getFilteredUsers();
  const totalPages = Math.ceil(filtered.length / accountPageSize);
  if (p < 1 || p > totalPages) return;
  accountCurrentPage = p;
  renderUserContent();
}

// ---------- 筛选 ----------
function getFilteredUsers() {
  let list = [...mockUsers];
  if (accountFilterStatus !== 'all') list = list.filter(u => u.status === accountFilterStatus);
  if (accountFilterDept !== 'all') list = list.filter(u => u.deptId === accountFilterDept);
  if (accountFilterType !== 'all') list = list.filter(u => u.type === accountFilterType);
  if (accountSearchText) {
    const q = accountSearchText.toLowerCase();
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.account.toLowerCase().includes(q) || u.empNo.toLowerCase().includes(q));
  }
  return list;
}

function switchAccountTab(tab) {
  accountCurrentTab = tab;
  accountCurrentPage = 1;
  accountSelectedIds = new Set();
  accountSearchText = '';
  showPage('account-mgmt');
}

function switchAccountView(mode) {
  accountViewMode = mode;
  accountCurrentPage = 1;
  renderAccountContent();
}

function onAccountSearch(val) {
  accountSearchText = val;
  accountCurrentPage = 1;
  renderUserContent();
}

function onAccountFilter(type, val) {
  if (type === 'status') accountFilterStatus = val;
  else if (type === 'dept') accountFilterDept = val;
  else if (type === 'type') accountFilterType = val;
  else if (type === 'createTime') accountFilterCreateTime = val;
  accountCurrentPage = 1;
  renderUserContent();
}

function resetAccountFilters() {
  accountFilterStatus = 'all';
  accountFilterDept = 'all';
  accountFilterType = 'all';
  accountFilterCreateTime = 'all';
  accountSearchText = '';
  accountCurrentPage = 1;
  document.getElementById('account-search-input').value = '';
  renderAccountContent();
  showToast('筛选条件已重置', 'info');
}

function onDeptFilter(type, val) {
  // 部门筛选逻辑
}

// ---------- 选择 ----------
function toggleUserSelect(id, checked) {
  if (checked) accountSelectedIds.add(id);
  else accountSelectedIds.delete(id);
}

function toggleAllUsers(cb) {
  const filtered = getFilteredUsers();
  filtered.forEach(u => {
    if (cb.checked) accountSelectedIds.add(u.id);
    else accountSelectedIds.delete(u.id);
  });
  renderUserContent();
}

function selectDept(id) {
  selectedDeptId = id;
  renderDeptContent();
}

// ---------- 操作 ----------
function toggleUserMore(btn, userId) {
  const menu = btn.nextElementSibling;
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    if (m !== menu) m.style.display = 'none';
  });
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function openCreateUserModal() {
  // 计算默认到期时间（一年后）
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const defaultExpire = nextYear.toISOString().split('T')[0];

  openModal('新建账号', `
    <div style="display:grid;gap:16px">
      <div class="form-group">
        <label class="form-label required">姓名</label>
        <input class="form-input" id="new-user-name" placeholder="请输入姓名">
      </div>
      <div class="form-group">
        <label class="form-label required">工号</label>
        <input class="form-input" id="new-user-empno" placeholder="请输入工号">
      </div>
      <div class="form-group">
        <label class="form-label required">登录账号</label>
        <input class="form-input" id="new-user-account" placeholder="请输入登录账号">
      </div>
      <div class="form-group">
        <label class="form-label required">手机号</label>
        <input class="form-input" id="new-user-phone" placeholder="请输入手机号">
      </div>
      <div class="form-group">
        <label class="form-label required">邮箱</label>
        <input class="form-input" id="new-user-email" placeholder="请输入邮箱">
      </div>
      <div class="form-group">
        <label class="form-label required">所属部门</label>
        <select class="form-input" id="new-user-dept">
          <option value="">请选择部门</option>
          <option value="D002">市场部</option>
          <option value="D003">产品部</option>
          <option value="D004">技术部</option>
          <option value="D005">运营部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label required">账号类型</label>
        <div style="display:flex;gap:16px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="userType" value="normal" checked> 普通员工
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="userType" value="admin"> 部门管理员
          </label>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:16px">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-primary)">📋 账号资源配置</div>
        <div class="form-group">
          <label class="form-label required">初始洞察豆</label>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px">
            <button class="btn btn-secondary btn-sm" type="button" onclick="setNewUserBeans(this, 1000)" style="padding:8px">1,000</button>
            <button class="btn btn-secondary btn-sm active" type="button" onclick="setNewUserBeans(this, 2000)" style="padding:8px">2,000</button>
            <button class="btn btn-secondary btn-sm" type="button" onclick="setNewUserBeans(this, 5000)" style="padding:8px">5,000</button>
            <button class="btn btn-secondary btn-sm" type="button" onclick="setNewUserBeans(this, 10000)" style="padding:8px">10,000</button>
          </div>
          <input type="number" class="form-input" id="new-user-beans" value="2000" min="0" placeholder="输入初始洞察豆数量">
        </div>
        <div class="form-group">
          <label class="form-label required">账号到期时间</label>
          <input type="date" class="form-input" id="new-user-expire" value="${defaultExpire}" style="cursor:pointer">
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
            <label style="cursor:pointer"><input type="checkbox" onclick="toggleNoExpire(this)" style="accent-color:var(--primary)"> 不限制到期时间（永久账号）</label>
          </div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="createUser()">创建</button>
  `, 620);
}

function setNewUserBeans(btn, amount) {
  document.querySelectorAll('#modal-body .btn-secondary').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('new-user-beans').value = amount;
}

function toggleNoExpire(checkbox) {
  const expireInput = document.getElementById('new-user-expire');
  if (checkbox.checked) {
    expireInput.value = '';
    expireInput.style.display = 'none';
  } else {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    expireInput.value = nextYear.toISOString().split('T')[0];
    expireInput.style.display = 'block';
  }
}

function createUser() {
  const name = document.getElementById('new-user-name').value.trim();
  const empNo = document.getElementById('new-user-empno').value.trim();
  const account = document.getElementById('new-user-account').value.trim();
  const phone = document.getElementById('new-user-phone').value.trim();
  const email = document.getElementById('new-user-email').value.trim();
  const dept = document.getElementById('new-user-dept').value;
  const beans = parseInt(document.getElementById('new-user-beans').value) || 0;
  const expireTime = document.getElementById('new-user-expire').value;
  const noExpire = document.querySelector('#new-user-expire')?.style.display === 'none';
  const type = document.querySelector('input[name="userType"]:checked')?.value || 'normal';

  // 验证必填项
  if (!name) {
    showToast('请输入姓名', 'error');
    return;
  }
  if (!account) {
    showToast('请输入登录账号', 'error');
    return;
  }
  if (!phone) {
    showToast('请输入手机号', 'error');
    return;
  }
  if (!dept) {
    showToast('请选择所属部门', 'error');
    return;
  }

  // 生成新用户ID
  const newId = 'U' + String(mockUsers.length + 1).padStart(3, '0');

  // 创建新用户
  const newUser = {
    id: newId,
    name: name,
    account: account,
    empNo: empNo || 'EMP' + String(mockUsers.length + 1).padStart(3, '0'),
    dept: document.querySelector('#new-user-dept option[value="' + dept + '"]').textContent,
    deptId: dept,
    type: type,
    status: 'active',
    lastLogin: '-',
    phone: phone,
    email: email,
    createTime: new Date().toISOString().split('T')[0],
    creator: 'admin',
    beans: beans,
    expireTime: noExpire ? '' : expireTime
  };

  mockUsers.push(newUser);
  showToast('账号创建成功！', 'success');
  closeModal();
  renderAccountContent();
}

function openEditUserModal(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;

  const hasNoExpire = !user.expireTime;

  openModal('编辑账号 · ' + user.name, `
    <div style="display:grid;gap:16px">
      <div class="form-group">
        <label class="form-label">姓名</label>
        <input class="form-input" id="edit-user-name" value="${user.name}">
      </div>
      <div class="form-group">
        <label class="form-label">工号</label>
        <input class="form-input" value="${user.empNo}" readonly style="background:var(--bg-page)">
      </div>
      <div class="form-group">
        <label class="form-label">登录账号</label>
        <input class="form-input" value="${user.account}" readonly style="background:var(--bg-page)">
      </div>
      <div class="form-group">
        <label class="form-label">手机号</label>
        <input class="form-input" id="edit-user-phone" value="${user.phone}">
      </div>
      <div class="form-group">
        <label class="form-label">邮箱</label>
        <input class="form-input" id="edit-user-email" value="${user.email}">
      </div>
      <div class="form-group">
        <label class="form-label">所属部门</label>
        <select class="form-input" id="edit-user-dept">
          <option value="D002" ${user.deptId==='D002'?'selected':''}>市场部</option>
          <option value="D003" ${user.deptId==='D003'?'selected':''}>产品部</option>
          <option value="D004" ${user.deptId==='D004'?'selected':''}>技术部</option>
          <option value="D005" ${user.deptId==='D005'?'selected':''}>运营部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">账号类型</label>
        <div style="display:flex;gap:16px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="editUserType" value="normal" ${user.type==='normal'?'checked':''}> 普通员工
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="editUserType" value="admin" ${user.type==='admin'?'checked':''}> 部门管理员
          </label>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:16px">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px;color:var(--text-primary)">📋 账号资源配置</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label class="form-label">当前洞察豆</label>
            <div style="display:flex;align-items:center;gap:8px">
              <input type="number" class="form-input" id="edit-user-beans" value="${user.beans}" min="0" style="flex:1">
              <button class="btn btn-secondary btn-sm" onclick="openRechargeBeansModal('${userId}')" style="white-space:nowrap">充值</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">账号到期时间</label>
            <input type="date" class="form-input" id="edit-user-expire" value="${user.expireTime || ''}" style="cursor:pointer">
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted)">
          <label style="cursor:pointer"><input type="checkbox" id="edit-no-expire" ${hasNoExpire?'checked':''} onclick="toggleEditNoExpire(this)" style="accent-color:var(--primary)"> 不限制到期时间（永久账号）</label>
        </div>
        ${hasNoExpire ? '<script>document.getElementById("edit-user-expire").style.display="none"</script>' : ''}
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="saveUser('${userId}')">保存</button>
  `, 560);
}

function toggleEditNoExpire(checkbox) {
  const expireInput = document.getElementById('edit-user-expire');
  if (checkbox.checked) {
    expireInput.value = '';
    expireInput.style.display = 'none';
  } else {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    expireInput.value = nextYear.toISOString().split('T')[0];
    expireInput.style.display = 'block';
  }
}

function saveUser(userId) {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;

  // 更新基本信息
  const newName = document.getElementById('edit-user-name').value;
  const newPhone = document.getElementById('edit-user-phone').value;
  const newEmail = document.getElementById('edit-user-email').value;
  const newDept = document.getElementById('edit-user-dept').value;
  const newBeans = parseInt(document.getElementById('edit-user-beans').value) || 0;
  const newExpire = document.getElementById('edit-user-expire').value;
  const noExpire = document.getElementById('edit-no-expire').checked;

  // 验证必填项
  if (!newName.trim()) {
    showToast('请输入姓名', 'error');
    return;
  }
  if (!newPhone.trim()) {
    showToast('请输入手机号', 'error');
    return;
  }

  // 更新用户数据
  user.name = newName.trim();
  user.phone = newPhone.trim();
  user.email = newEmail.trim();
  user.deptId = newDept;
  user.dept = document.querySelector(`#edit-user-dept option[value="${newDept}"]`).textContent;
  user.beans = newBeans;
  user.expireTime = noExpire ? '' : newExpire;

  showToast('账号信息已保存', 'success');
  closeModal();
  renderAccountContent();
}

function resetUserPassword(userId) {
  const user = mockUsers.find(u => u.id === userId);
  openModal('重置密码', `
    <div style="text-align:center;padding:20px">
      <div style="font-size:48px;margin-bottom:16px">🔑</div>
      <div style="font-size:14px;margin-bottom:8px">确定要重置 ${user?.name || ''} 的密码吗？</div>
      <div style="font-size:12px;color:var(--text-muted)">新密码将发送至绑定的手机号/邮箱</div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="doResetPassword('${userId}')">确认重置</button>
  `, 400);
}

function doResetPassword(userId) {
  showToast('新密码已发送至用户手机', 'success');
  closeModal();
}

function freezeUser(userId) {
  showToast('账号已冻结', 'info');
  renderAccountContent();
}

function unfreezeUser(userId) {
  showToast('账号已启用', 'success');
  renderAccountContent();
}

function deleteUser(userId) {
  const user = mockUsers.find(u => u.id === userId);
  openModal('删除账号', `
    <div style="text-align:center;padding:20px">
      <div style="font-size:48px;margin-bottom:16px;color:var(--danger)">⚠️</div>
      <div style="font-size:14px;margin-bottom:8px">确定要删除账号「${user?.name || ''}」吗？</div>
      <div style="font-size:12px;color:var(--text-muted)">删除后该账号将无法登录，数据无法恢复</div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-danger" onclick="doDeleteUser('${userId}')">确认删除</button>
  `, 400);
}

function doDeleteUser(userId) {
  showToast('账号已删除', 'success');
  closeModal();
  renderAccountContent();
}

// ---------- 部门操作 ----------
function openCreateDeptModal() {
  openModal('新增部门', `
    <div style="display:grid;gap:16px">
      <div class="form-group">
        <label class="form-label required">部门名称</label>
        <input class="form-input" placeholder="请输入部门名称">
      </div>
      <div class="form-group">
        <label class="form-label">上级部门</label>
        <select class="form-input">
          <option value="">总公司</option>
          <option value="D002">市场部</option>
          <option value="D003">产品部</option>
          <option value="D004">技术部</option>
          <option value="D005">运营部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">部门负责人</label>
        <select class="form-input">
          <option value="">请选择负责人</option>
          <option value="U001">张三</option>
          <option value="U002">李四</option>
          <option value="U003">王五</option>
          <option value="U004">赵六</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">部门描述</label>
        <textarea class="form-input" rows="3" placeholder="请输入部门描述"></textarea>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="createDept()">创建</button>
  `, 480);
}

function createDept() {
  showToast('部门创建成功！', 'success');
  closeModal();
}

function openEditDeptModal(deptId) {
  const dept = mockDepts.find(d => d.id === deptId);
  if (!dept) return;

  openModal('编辑部门', `
    <div style="display:grid;gap:16px">
      <div class="form-group">
        <label class="form-label">部门名称</label>
        <input class="form-input" value="${dept.name}">
      </div>
      <div class="form-group">
        <label class="form-label">上级部门</label>
        <select class="form-input">
          <option value="">总公司</option>
          <option value="D001" ${dept.parentId==='D001'?'selected':''}>总公司</option>
          <option value="D002" ${dept.parentId==='D002'?'selected':''}>市场部</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">部门负责人</label>
        <select class="form-input">
          <option value="">请选择负责人</option>
          <option value="U001" ${dept.leader==='张三'?'selected':''}>张三</option>
          <option value="U003" ${dept.leader==='王五'?'selected':''}>王五</option>
          <option value="U006" ${dept.leader==='周八'?'selected':''}>周八</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">部门描述</label>
        <textarea class="form-input" rows="3">${dept.name}是公司重要的业务部门</textarea>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="saveDept('${deptId}')">保存</button>
  `, 480);
}

function saveDept(deptId) {
  showToast('部门信息已保存', 'success');
  closeModal();
  renderDeptContent();
}

function toggleDeptStatus(deptId) {
  showToast('部门状态已切换', 'info');
  renderDeptContent();
}

function toggleDeptExpand(deptId) {
  // 部门树展开/收起
}

function resetDeptFilters() {
  showToast('筛选条件已重置', 'info');
}

function openBatchImportModal() {
  openModal('批量导入账号', `
    <div style="text-align:center;padding:20px">
      <div style="width:80px;height:80px;margin:0 auto 16px;border:2px dashed var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer">
        <div style="text-align:center">
          <div style="font-size:28px;margin-bottom:4px">📁</div>
          <div style="font-size:12px;color:var(--text-muted)">点击上传</div>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">
        支持 .xlsx 格式文件，<a href="#" style="color:var(--primary)">下载导入模板</a>
      </div>
      <div style="font-size:12px;color:var(--text-muted)">
        <div>• 每次最多导入100条数据</div>
        <div>• 账号信息必须完整，手机号/邮箱二选一</div>
        <div>• 部门需已存在于系统中</div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="doBatchImport()">开始导入</button>
  `, 480);
}

function doBatchImport() {
  showToast('导入任务已创建，请等待处理...', 'info');
  closeModal();
}

function exportAccountData() {
  showToast('正在导出账号数据...', 'info');
  setTimeout(() => showToast('导出成功！', 'success'), 1000);
}
