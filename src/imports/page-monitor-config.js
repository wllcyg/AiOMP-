// ===================== 2. 通用关键词监测配置 =====================
pageRenderers['monitor-config'] = () => `
<div class="page active">
  <div class="page-header">
    <div class="page-title">通用关键词监测</div>
    <div class="page-actions">
      <button class="btn btn-ghost" onclick="showPage('monitor-list')">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3L5 8l5 5" stroke-linecap="round"/></svg>
        返回列表
      </button>
      <button class="btn btn-secondary" onclick="showToast('已保存草稿','info')">保存草稿</button>
      <button class="btn btn-primary" onclick="submitMonitorConfig()">
        <svg viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2"><path d="M13 3L6 10.5 3 7.5" stroke-linecap="round"/></svg>
        确认创建监测
      </button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 340px;gap:16px">
    <div>
      <!-- 关键词配置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>关键词配置</div>
          <span class="text-muted text-sm">支持 AND / OR / 括号 / 字符距离 等逻辑组合</span>
        </div>

        <div class="form-group">
          <label class="form-label">监测关键词 <span class="required">*</span></label>
          <div class="keyword-toolbar">
            <button class="kw-btn kw-and" onclick="insertKw('kw-editor', ' + ')" title="AND关系，两词都需出现">AND(+)</button>
            <button class="kw-btn kw-or" onclick="insertKw('kw-editor', ' / ')" title="OR关系，任意一词出现即可">OR(/)</button>
            <button class="kw-btn" onclick="insertKw('kw-editor', '（）')" title="括号分组">( )</button>
            <button class="kw-btn" onclick="insertKw('kw-editor', '【10】')" title="字符距离，两词之间字数不超过10">字距【10】</button>
            <button class="kw-btn" style="margin-left:auto" onclick="clearEditor('kw-editor')">清空</button>
          </div>
          <div class="keyword-editor" id="kw-editor" contenteditable="true">长安CS75 + （传播 / 口碑 / 评测 / 销量）</div>
          <div class="text-muted mt-8 text-sm">
            💡 示例：<span class="kw-highlight">长安</span> + <span class="kw-highlight">（口碑 / 好评）</span> 表示必须同时包含"长安"和("口碑"或"好评")
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">排除关键词</label>
          <div class="keyword-toolbar">
            <button class="kw-btn kw-or" onclick="insertKw('excl-editor', ' / ')">OR(/)</button>
            <button class="kw-btn" style="margin-left:auto" onclick="clearEditor('excl-editor')">清空</button>
          </div>
          <div class="keyword-editor" id="excl-editor" contenteditable="true" style="min-height:50px">广告 / 赞助 / 推广</div>
        </div>
      </div>

      <!-- 时间配置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>时间范围配置</div>
        </div>
        <div class="flex gap-8 mb-12">
          <button class="select-btn" onclick="setTimeRange(this,'last7')">近7天</button>
          <button class="select-btn active" onclick="setTimeRange(this,'last30')">近30天</button>
          <button class="select-btn" onclick="setTimeRange(this,'last90')">近90天</button>
          <button class="select-btn" onclick="setTimeRange(this,'custom')">自定义</button>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">开始时间 <span class="required">*</span></label>
            <input type="datetime-local" class="form-control" value="2026-03-11T00:00">
          </div>
          <div class="form-group">
            <label class="form-label">结束时间 <span class="required">*</span></label>
            <input type="datetime-local" class="form-control" value="2026-04-10T23:59">
          </div>
        </div>
      </div>

      <!-- 媒体类型配置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>媒体类型配置</div>
          <button class="btn btn-ghost btn-sm" onclick="selectAllMedia()">全选</button>
        </div>

        <div style="margin-bottom:14px">
          <div class="form-label" style="margin-bottom:8px">🎬 短视频平台</div>
          <div class="media-grid">
            ${['抖音', '快手', '微信视频号', '哔哩哔哩'].map(m => `
            <div class="media-card selected" onclick="toggleMedia(this)">
              <span class="media-icon">${{'抖音':'🎵','快手':'⚡','微信视频号':'💚','哔哩哔哩':'💜'}[m]}</span>
              <div class="media-name">${m}</div>
            </div>`).join('')}
          </div>
        </div>

        <div style="margin-bottom:14px">
          <div class="form-label" style="margin-bottom:8px">🌐 汽车垂直媒体</div>
          <div class="media-grid">
            ${['汽车之家','易车网','懂车帝','太平洋汽车'].map(m => `
            <div class="media-card" onclick="toggleMedia(this)">
              <span class="media-icon">🚗</span>
              <div class="media-name">${m}</div>
            </div>`).join('')}
          </div>
        </div>

        <div style="margin-bottom:14px">
          <div class="form-label" style="margin-bottom:8px">📱 社交媒体</div>
          <div class="media-grid">
            ${['微信公众号','新浪微博','小红书'].map(m => `
            <div class="media-card selected" onclick="toggleMedia(this)">
              <span class="media-icon">${{'微信公众号':'💬','新浪微博':'🔵','小红书':'❤️'}[m]}</span>
              <div class="media-name">${m}</div>
            </div>`).join('')}
          </div>
        </div>

        <div>
          <div class="form-label" style="margin-bottom:8px">📰 门户/新闻媒体</div>
          <div class="media-grid">
            ${['今日头条','网易新闻','腾讯新闻','其他媒体'].map(m => `
            <div class="media-card" onclick="toggleMedia(this)">
              <span class="media-icon">📰</span>
              <div class="media-name">${m}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- 互动量刷新设置 -->
      <div class="card mb-16">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>互动量刷新设置</div>
          <div class="flex-center gap-8">
            <span class="text-sm text-muted">关闭</span>
            <label class="switch" onclick="toggleRefreshSwitch(this)">
              <input type="checkbox" id="refresh-switch">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>

        <div id="refresh-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label">刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setRefreshTime(this,'0.5h')">半小时</div>
              <div class="time-option active" onclick="setRefreshTime(this,'1h')">1小时</div>
              <div class="time-option" onclick="setRefreshTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setRefreshTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setRefreshTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showRefreshTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="refresh-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-card3);border-radius:8px">
              <div class="form-label mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="refresh-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="refresh-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="2" min="1" max="12" style="width:80px" id="refresh-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">刷新媒体范围</label>
            <div class="select-group" id="refresh-media">
              ${['抖音','快手','小红书','微信视频号','微博','汽车之家','易车网','懂车帝'].map((m,i) => `
              <div class="select-btn ${i===0?'active':''}" onclick="this.classList.toggle('active')">${m}</div>`).join('')}
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
            <label class="switch" onclick="toggleCommentSwitch(this)">
              <input type="checkbox" id="comment-switch">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>

        <div id="comment-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label">评论刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setCommentTime(this,'0.5h')">半小时</div>
              <div class="time-option" onclick="setCommentTime(this,'1h')">1小时</div>
              <div class="time-option active" onclick="setCommentTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setCommentTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setCommentTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showCommentTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="comment-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-card3);border-radius:8px">
              <div class="form-label mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="comment-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="comment-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="4" min="1" max="12" style="width:80px" id="comment-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">评论刷新媒体</label>
            <div class="select-group">
              ${['抖音','快手','小红书','微信视频号','微博','汽车之家','易车网','懂车帝'].map((m,i) => `
              <div class="select-btn ${i<3?'active':''}" onclick="this.classList.toggle('active')">${m}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧预览/摘要面板 -->
    <div>
      <div class="card" style="position:sticky;top:0">
        <div class="card-header">
          <div class="card-title"><span class="card-title-dot"></span>配置摘要预览</div>
        </div>
        <div style="font-size:12px;line-height:2">
          <div class="flex-between mb-8" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">监测关键词</span>
            <span style="color:var(--primary);font-size:11px;max-width:180px;text-align:right;font-weight:600">长安CS75 + (传播/口碑/评测/销量)</span>
          </div>
          <div class="flex-between mb-8" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">排除词</span>
            <span style="color:var(--text-secondary);font-size:11px">广告 / 赞助 / 推广</span>
          </div>
          <div class="flex-between mb-8" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">时间范围</span>
            <span style="color:var(--text-primary);font-size:11px">2026-03-11 至 今</span>
          </div>
          <div class="flex-between mb-8" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">监测平台</span>
            <span style="color:var(--text-primary);font-size:11px">7个平台</span>
          </div>
          <div class="flex-between mb-8" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">互动量刷新</span>
            <span style="color:var(--success);font-size:11px">每1小时自动刷新</span>
          </div>
          <div class="flex-between" style="padding:8px;background:var(--bg-card3);border-radius:6px">
            <span class="text-muted">评论刷新</span>
            <span style="color:var(--success);font-size:11px">每6小时自动刷新</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="card" style="background:var(--primary-bg);border-color:var(--primary-border)">
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px">预计费用</div>
          <div style="font-size:22px;font-weight:800;color:var(--primary)">~320 豆</div>
          <div class="text-muted text-sm" style="margin-top:4px">当前余额：12,580 豆（剩余约39天）</div>
        </div>

        <div style="margin-top:14px">
          <div class="form-group" style="margin-bottom:10px">
            <label class="form-label">项目名称 <span class="required">*</span></label>
            <input type="text" class="form-control" value="长安CS75Plus品牌传播监测" placeholder="请输入项目名称">
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">所属分类 <span class="text-muted" style="font-weight:400;font-size:11px">（可选）</span></label>
            <div style="display:flex;flex-direction:column;gap:6px">
              <select class="form-control" id="config-car-company" onchange="onConfigCompanyChange(this.value)" style="font-size:12px">
                <option value="">-- 选择车企 --</option>
                ${carBrandConfig.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
              <select class="form-control" id="config-car-brand" onchange="onConfigBrandChange(this.value)" style="font-size:12px" disabled>
                <option value="">-- 选择品牌 --</option>
              </select>
              <select class="form-control" id="config-car-model" style="font-size:12px" disabled>
                <option value="">-- 选择车型 --</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

function toggleMedia(el) { el.classList.toggle('selected'); }
function selectAllMedia() {
  document.querySelectorAll('.media-card').forEach(el => el.classList.add('selected'));
  showToast('已全选所有媒体', 'success');
}
function insertKw(editorId, text) {
  const el = document.getElementById(editorId);
  if (!el) return;
  el.focus();
  document.execCommand('insertText', false, text);
}
function clearEditor(editorId) {
  const el = document.getElementById(editorId);
  if (el) { el.innerHTML = ''; el.focus(); }
}
function setTimeRange(btn, range) {
  btn.closest('.flex').querySelectorAll('.select-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 切换到自定义时显示时间选择器
  if (range === 'custom') {
    const grid = btn.closest('.card').querySelector('.grid-2');
    if (grid) grid.style.display = 'grid';
  }
}

// 互动量刷新开关
function toggleRefreshSwitch(label) {
  const checkbox = label.querySelector('input');
  const content = document.getElementById('refresh-content');
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

// 评论刷新开关
function toggleCommentSwitch(label) {
  const checkbox = label.querySelector('input');
  const content = document.getElementById('comment-content');
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
function showRefreshTimeEditor(btn) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('refresh-time-editor');
  editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

// 显示评论刷新时间编辑器
function showCommentTimeEditor(btn) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const editor = document.getElementById('comment-time-editor');
  editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

function setRefreshTime(btn, t) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 隐藏时间编辑器
  const editor = document.getElementById('refresh-time-editor');
  if (editor) editor.style.display = 'none';
}
function setCommentTime(btn, t) {
  btn.closest('.time-option-group').querySelectorAll('.time-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // 隐藏时间编辑器
  const editor = document.getElementById('comment-time-editor');
  if (editor) editor.style.display = 'none';
}
function submitMonitorConfig() {
  showToast('监测项目创建成功！正在开始数据采集...', 'success');
  setTimeout(() => showPage('monitor-list'), 1500);
}

function onConfigCompanyChange(company) {
  const brandSel = document.getElementById('config-car-brand');
  const modelSel = document.getElementById('config-car-model');
  if (!brandSel || !modelSel) return;
  if (!company) {
    brandSel.innerHTML = '<option value="">-- 选择品牌 --</option>';
    brandSel.disabled = true;
    modelSel.innerHTML = '<option value="">-- 选择车型 --</option>';
    modelSel.disabled = true;
    return;
  }
  const comp = carBrandConfig.find(c=>c.name===company);
  brandSel.innerHTML = '<option value="">-- 选择品牌 --</option>' + (comp?.brands||[]).map(b=>`<option value="${b.name}">${b.name}</option>`).join('');
  brandSel.disabled = false;
  modelSel.innerHTML = '<option value="">-- 选择车型 --</option>';
  modelSel.disabled = true;
}

function onConfigBrandChange(brand) {
  const company = document.getElementById('config-car-company')?.value;
  const modelSel = document.getElementById('config-car-model');
  if (!modelSel) return;
  if (!brand) { modelSel.innerHTML = '<option value="">-- 选择车型 --</option>'; modelSel.disabled = true; return; }
  const comp = carBrandConfig.find(c=>c.name===company);
  const br = comp?.brands.find(b=>b.name===brand);
  modelSel.innerHTML = '<option value="">-- 选择车型 --</option>' + (br?.models||[]).map(m=>`<option value="${m}">${m}</option>`).join('');
  modelSel.disabled = false;
}
