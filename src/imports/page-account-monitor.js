// ===================== 3. 媒体账号专项监测 =====================
pageRenderers['account-monitor'] = () => `
<div class="page active">
  <div class="page-header">
    <div class="page-title">媒体账号专项监测配置</div>
    <div class="page-actions">
      <button class="btn btn-ghost" onclick="showPage('monitor-list')">← 返回列表</button>
      <button class="btn btn-primary" onclick="submitMonitorConfig()">确认创建监测</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 320px;gap:16px">
    <div>
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>添加监测媒体 / 账号</div>
        </div>
        <div class="grid-2 mb-16">
          <div class="form-group">
            <label class="form-label">媒体类型 <span class="required">*</span></label>
            <select class="form-control" id="media-type-sel" onchange="onMediaTypeChange(this)">
              <option value="">请选择媒体类型</option>
              <option>汽车之家</option><option>易车网</option><option>懂车帝</option>
              <option>微信公众号</option><option>新浪微博</option><option>抖音</option>
              <option>快手</option><option>小红书</option><option>微信视频号</option>
              <option>哔哩哔哩</option><option>其他网站</option>
            </select>
          </div>
          <div class="form-group" id="domain-group" style="display:none">
            <label class="form-label">媒体域名</label>
            <input type="text" class="form-control" placeholder="如：www.autohome.com.cn" id="media-domain">
          </div>
        </div>
        <div class="grid-2 mb-12">
          <div class="form-group">
            <label class="form-label">账号名称 <span class="required">*</span></label>
            <input type="text" class="form-control" id="acc-name" placeholder="如：懂车帝官方账号">
          </div>
          <div class="form-group">
            <label class="form-label">账号ID / UID</label>
            <input type="text" class="form-control" id="acc-id" placeholder="如：douyin_12345678">
          </div>
        </div>
        <button class="btn btn-primary" onclick="addMediaAccount()">
          <svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="white" stroke-width="2" fill="none"/></svg>
          添加到监测列表
        </button>
      </div>

      <!-- 已添加的媒体占位框 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>已添加的监测账号</div>
          <span class="text-muted">已添加 3 个</span>
        </div>
        <div id="account-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">
          ${[
            {platform:'抖音',name:'@懂车帝官方', id:'douyin_dc2024', icon:'🎵'},
            {platform:'微博',name:'@汽车观察家', id:'weibo_car2024', icon:'🔵'},
            {platform:'汽车之家',name:'长安专区', id:'autohome_changan', icon:'🚗'},
          ].map(a => renderAccountCard(a)).join('')}
          <div class="media-card" style="border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90px;cursor:pointer" onclick="">
            <div style="font-size:24px;margin-bottom:4px;color:var(--text-muted)">+</div>
            <div style="font-size:11px;color:var(--text-muted)">添加更多账号</div>
          </div>
        </div>
      </div>

      <!-- 时间配置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>监测时间范围</div>
        </div>
        <div class="flex gap-8 mb-12">
          <button class="select-btn" onclick="setTimeRange(this)">近7天</button>
          <button class="select-btn active" onclick="setTimeRange(this)">近30天</button>
          <button class="select-btn" onclick="setTimeRange(this)">近90天</button>
          <button class="select-btn" onclick="setTimeRange(this)">自定义</button>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">开始时间</label>
            <input type="datetime-local" class="form-control" value="2026-03-11T00:00">
          </div>
          <div class="form-group">
            <label class="form-label">结束时间</label>
            <input type="datetime-local" class="form-control" value="2026-04-10T23:59">
          </div>
        </div>
      </div>

      <!-- 互动量刷新设置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>互动量刷新设置</div>
          <div class="flex-center gap-8">
            <span class="text-sm text-muted">关闭</span>
            <label class="switch" onclick="toggleAccountRefreshSwitch(this)">
              <input type="checkbox" id="account-refresh-switch">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>

        <div id="account-refresh-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label">刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setAccountRefreshTime(this,'0.5h')">半小时</div>
              <div class="time-option active" onclick="setAccountRefreshTime(this,'1h')">1小时</div>
              <div class="time-option" onclick="setAccountRefreshTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setAccountRefreshTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setAccountRefreshTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showAccountRefreshTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="account-refresh-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-card3);border-radius:8px">
              <div class="form-label mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="account-refresh-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="account-refresh-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="2" min="1" max="12" style="width:80px" id="account-refresh-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 评论刷新设置 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>评论刷新设置</div>
          <div class="flex-center gap-8">
            <span class="text-sm text-muted">关闭</span>
            <label class="switch" onclick="toggleAccountCommentSwitch(this)">
              <input type="checkbox" id="account-comment-switch">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>

        <div id="account-comment-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label">评论刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setAccountCommentTime(this,'0.5h')">半小时</div>
              <div class="time-option" onclick="setAccountCommentTime(this,'1h')">1小时</div>
              <div class="time-option active" onclick="setAccountCommentTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setAccountCommentTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setAccountCommentTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showAccountCommentTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="account-comment-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-card3);border-radius:8px">
              <div class="form-label mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="account-comment-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="account-comment-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="4" min="1" max="12" style="width:80px" id="account-comment-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 右侧摘要 -->
    <div>
      <div class="card" style="position:sticky;top:0">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>配置摘要</div>
        </div>
        <div style="font-size:12px;line-height:2.2">
          <div class="flex-between" style="padding:6px 8px;background:var(--bg-card2);border-radius:6px;margin-bottom:6px">
            <span class="text-muted">监测账号数</span>
            <strong>3 个</strong>
          </div>
          <div class="flex-between" style="padding:6px 8px;background:var(--bg-card2);border-radius:6px;margin-bottom:6px">
            <span class="text-muted">监测平台</span>
            <span>抖音 / 微博 / 汽车之家</span>
          </div>
          <div class="flex-between" style="padding:6px 8px;background:var(--bg-card2);border-radius:6px;margin-bottom:6px">
            <span class="text-muted">时间范围</span>
            <span>近30天</span>
          </div>
          <div class="flex-between" style="padding:6px 8px;background:var(--bg-card2);border-radius:6px;margin-bottom:6px">
            <span class="text-muted">互动量刷新</span>
            <span style="color:var(--success);font-size:11px">每1小时自动刷新</span>
          </div>
          <div class="flex-between" style="padding:6px 8px;background:var(--bg-card2);border-radius:6px">
            <span class="text-muted">评论刷新</span>
            <span style="color:var(--success);font-size:11px">每6小时自动刷新</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="card" style="background:var(--primary-bg);border-color:var(--primary-border)">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">预计费用</div>
          <div style="font-size:22px;font-weight:800;color:var(--primary)">~280 豆</div>
          <div class="text-muted text-sm" style="margin-top:4px">当前余额：12,580 豆（剩余约45天）</div>
        </div>
        <div class="divider"></div>
        <div class="form-group">
          <label class="form-label">项目名称 <span class="required">*</span></label>
          <input type="text" class="form-control" value="懂车帝/微博/汽车之家专项监测" placeholder="请输入项目名称">
        </div>
        <div class="form-group">
          <label class="form-label">所属分类 <span class="text-muted" style="font-weight:400;font-size:11px">（可选）</span></label>
          <div style="display:flex;flex-direction:column;gap:6px">
            <select class="form-control" id="acct-car-company" onchange="onAcctCompanyChange(this.value)" style="font-size:12px">
              <option value="">-- 选择车企 --</option>
              ${carBrandConfig.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}
            </select>
            <select class="form-control" id="acct-car-brand" onchange="onAcctBrandChange(this.value)" style="font-size:12px" disabled>
              <option value="">-- 选择品牌 --</option>
            </select>
            <select class="form-control" id="acct-car-model" style="font-size:12px" disabled>
              <option value="">-- 选择车型 --</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="submitAccountMonitor()">创建监测项目</button>
      </div>
    </div>
  </div>
</div>`;

function renderAccountCard(a) {
  return `
  <div class="media-card selected" style="text-align:left;padding:12px;position:relative">
    <button onclick="this.parentElement.remove()" style="position:absolute;top:6px;right:6px;background:var(--danger-bg);border:none;color:var(--danger);border-radius:4px;cursor:pointer;width:18px;height:18px;font-size:11px;display:flex;align-items:center;justify-content:center;font-weight:700">✕</button>
    <div style="font-size:20px;margin-bottom:6px">${a.icon}</div>
    <div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:2px">${a.name}</div>
    <div style="font-size:10px;color:var(--text-muted)">${a.platform} · ${a.id}</div>
  </div>`;
}

function onMediaTypeChange(sel) {
  const domainGroup = document.getElementById('domain-group');
  if (sel.value === '其他网站') {
    domainGroup.style.display = 'block';
  } else {
    domainGroup.style.display = 'none';
  }
}

function addMediaAccount() {
  const name = document.getElementById('acc-name').value;
  const id = document.getElementById('acc-id').value;
  const platform = document.getElementById('media-type-sel').value;
  if (!name || !platform) { showToast('请填写账号名称和媒体类型', 'error'); return; }
  const list = document.getElementById('account-list');
  const addBtn = list.lastElementChild;
  const card = document.createElement('div');
  card.innerHTML = renderAccountCard({platform, name, id: id || 'unknown', icon: '📱'});
  list.insertBefore(card.firstElementChild, addBtn);
  document.getElementById('acc-name').value = '';
  document.getElementById('acc-id').value = '';
  showToast(`已添加账号：${name}`, 'success');
}

function submitAccountMonitor() {
  showToast('账号监测项目创建成功！', 'success');
  setTimeout(() => showPage('monitor-list'), 1500);
}

// 媒体账号监测 - 互动量刷新开关
function toggleAccountRefreshSwitch(label) {
  const checkbox = label.querySelector('input');
  const content = document.getElementById('account-refresh-content');
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    content.style.opacity = '1';
    content.style.pointerEvents = 'auto';
    showToast('互动量刷新已开启', 'success');
  } else {
    content.style.opacity = '0.4';
    content.style.pointerEvents = 'none';
  }
}

// 媒体账号监测 - 评论刷新开关
function toggleAccountCommentSwitch(label) {
  const checkbox = label.querySelector('input');
  const content = document.getElementById('account-comment-content');
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked) {
    content.style.opacity = '1';
    content.style.pointerEvents = 'auto';
    showToast('评论刷新已开启', 'success');
  } else {
    content.style.opacity = '0.4';
    content.style.pointerEvents = 'none';
  }
}

// 显示互动量刷新时间编辑器
function showAccountRefreshTimeEditor(btn) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('account-refresh-time-editor');
  editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

// 显示评论刷新时间编辑器
function showAccountCommentTimeEditor(btn) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('account-comment-time-editor');
  editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

function setAccountRefreshTime(btn, t) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('account-refresh-time-editor');
  if (editor) editor.style.display = 'none';
}

function setAccountCommentTime(btn, t) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('account-comment-time-editor');
  if (editor) editor.style.display = 'none';
}

function onAcctCompanyChange(company) {
  const brandSel = document.getElementById('acct-car-brand');
  const modelSel = document.getElementById('acct-car-model');
  if (!brandSel || !modelSel) return;
  if (!company) {
    brandSel.innerHTML = '<option value="">-- 选择品牌 --</option>'; brandSel.disabled = true;
    modelSel.innerHTML = '<option value="">-- 选择车型 --</option>'; modelSel.disabled = true;
    return;
  }
  const comp = carBrandConfig.find(c=>c.name===company);
  brandSel.innerHTML = '<option value="">-- 选择品牌 --</option>' + (comp?.brands||[]).map(b=>`<option value="${b.name}">${b.name}</option>`).join('');
  brandSel.disabled = false;
  modelSel.innerHTML = '<option value="">-- 选择车型 --</option>'; modelSel.disabled = true;
}

function onAcctBrandChange(brand) {
  const company = document.getElementById('acct-car-company')?.value;
  const modelSel = document.getElementById('acct-car-model');
  if (!modelSel) return;
  if (!brand) { modelSel.innerHTML = '<option value="">-- 选择车型 --</option>'; modelSel.disabled = true; return; }
  const comp = carBrandConfig.find(c=>c.name===company);
  const br = comp?.brands.find(b=>b.name===brand);
  modelSel.innerHTML = '<option value="">-- 选择车型 --</option>' + (br?.models||[]).map(m=>`<option value="${m}">${m}</option>`).join('');
  modelSel.disabled = false;
}
