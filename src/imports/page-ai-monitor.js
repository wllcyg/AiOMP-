// ===================== 4. AI智能创建监测 =====================
pageRenderers['ai-monitor'] = () => `
<div class="page active">
  <div class="page-header">
    <div class="page-title">AI智能创建监测</div>
    <div class="page-actions">
      <button class="btn btn-ghost" onclick="showPage('monitor-list')">← 返回列表</button>
      <button class="btn btn-ghost btn-sm" onclick="showPage('monitor-config')">切换手动配置</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;height:calc(100vh - 180px)">
    <!-- 左：对话区 -->
    <div class="card" style="display:flex;flex-direction:column;overflow:hidden;padding:0">
      <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
        <div style="width:8px;height:8px;border-radius:50%;background:#22C870;box-shadow:0 0 6px #22C870"></div>
        <span style="font-size:14px;font-weight:600">AI 监测助手</span>
        <span class="tag tag-primary" style="margin-left:auto">智能配置模式</span>
        <button class="btn btn-ghost btn-sm" onclick="clearAIChat()">清空对话</button>
      </div>

      <!-- 快捷场景卡片 -->
      <div id="quick-scenes" style="padding:14px 16px;border-bottom:1px solid var(--border)">
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">💡 快速开始，选择常见场景：</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${[
            '监测品牌整体舆情',
            '竞品对比声量分析',
            '新车上市传播监测',
            '负面舆情专项监测',
            'KOL账号监测',
          ].map(s => `<button class="select-btn" onclick="fillScene('${s}')">${s}</button>`).join('')}
        </div>
      </div>

      <div class="chat-messages" id="ai-chat-messages">
        <div class="chat-msg ai">
          <div class="chat-avatar ai">AI</div>
          <div>
            <div class="chat-bubble">
              你好！我是AI监测助手 🤖<br><br>
              请告诉我您想要监测什么内容，我会帮您自动配置监测关键词、时间范围、互动刷新规则。<br><br>
              您可以直接描述，例如："帮我监测长安CS75在抖音和微博上近30天的传播情况"
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;margin-left:4px">AI监测助手 · 刚刚</div>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <textarea id="ai-input" placeholder="描述您的监测需求，例如：帮我监测比亚迪汉在全平台近一个月的用户口碑..." rows="2" onkeydown="handleAiMonitorKeydown(event)"></textarea>
        <button class="chat-send-btn" onclick="sendAiMonitorMessage()">
          <svg viewBox="0 0 16 16"><path d="M2 2l12 6-12 6V9l8-1-8-1V2z" fill="white"/></svg>
        </button>
      </div>
    </div>

    <!-- 右：配置预览/确认区 -->
    <div class="card" style="display:flex;flex-direction:column;overflow:hidden;padding:0" id="ai-config-panel">
      <div style="padding:14px 16px;border-bottom:1px solid var(--border)">
        <div style="font-size:14px;font-weight:600">📋 AI生成的监测配置</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">AI根据您的需求自动生成，可手动调整</div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:16px" id="ai-config-content">
        <!-- 初始引导状态 -->
        <div class="empty-state" style="padding:40px">
          <svg viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="var(--primary)" stroke-width="2" opacity="0.3"/>
            <circle cx="32" cy="32" r="18" stroke="var(--primary)" stroke-width="2" opacity="0.5"/>
            <circle cx="32" cy="32" r="8" fill="var(--primary)" opacity="0.7"/>
          </svg>
          <p>在左侧输入监测需求</p>
          <small>AI将自动解析并生成监测配置</small>
        </div>
      </div>
    </div>
  </div>
</div>`;

const aiResponses = {
  '监测品牌整体舆情': {
    input: '帮我创建一个品牌整体舆情监测，监测对象是长安汽车，需要覆盖主流平台的近30天数据',
    round1: '好的，我理解您需要创建**长安汽车品牌整体舆情监测**。\n\n让我先确认几个基础信息：\n\n1. 您是想监测**长安汽车品牌整体**，还是某个特定车型？\n2. 需要关注**正负面**都监测，还是重点关注**负面舆情**？\n\n请选择或直接回复：',
    choices1: ['全品牌监测', '指定车型', '重点负面舆情'],
    config: {
      keywords: '长安汽车 / 长安 + (口碑 / 舆情 / 评测 / 用户反馈)',
      exclude: '广告 / 推广 / 招聘',
      time: '2026-03-11 至 2026-04-10（近30天）',
      platforms: ['抖音', '快手', '微信视频号', '哔哩哔哩', '汽车之家', '易车网', '懂车帝', '太平洋汽车', '微信公众号', '新浪微博', '小红书'],
      refresh: '每6小时自动刷新互动量',
      comment: '每12小时刷新评论',
      estimateCost: '280',
    }
  }
};

let aiChatCount = 0;

function fillScene(scene) {
  document.getElementById('ai-input').value = aiResponses[scene]?.input || `帮我${scene}`;
  document.getElementById('ai-input').focus();
}

function handleAiMonitorKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiMonitorMessage();
  }
}

function sendAiMonitorMessage() {
  const input = document.getElementById('ai-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';

  const messages = document.getElementById('ai-chat-messages');
  messages.innerHTML += `
    <div class="chat-msg user">
      <div class="chat-avatar user-av">我</div>
      <div>
        <div class="chat-bubble">${msg}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;text-align:right">刚刚</div>
      </div>
    </div>`;
  messages.scrollTop = messages.scrollHeight;
  aiChatCount++;

  // 模拟AI思考
  setTimeout(() => {
    const thinkEl = document.createElement('div');
    thinkEl.className = 'chat-msg ai';
    thinkEl.innerHTML = `
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble" style="color:var(--text-muted)">
          <span class="ai-thinking">🤔 正在分析您的需求...</span>
        </div>
      </div>`;
    messages.appendChild(thinkEl);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      thinkEl.remove();
      if (aiChatCount === 1) {
        addAiMsg1(messages);
      } else if (aiChatCount === 2) {
        addAiMsg2(messages);
      } else {
        addAiMsgFinal(messages);
      }
      messages.scrollTop = messages.scrollHeight;
    }, 1500);
  }, 300);
}

function addAiMsg1(messages) {
  messages.innerHTML += `
    <div class="chat-msg ai">
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble">
          好的，我已经理解您的需求！📊<br><br>
          请帮我确认一下数据时间范围：<br>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
            <button class="select-btn active" onclick="selectTimeRange(this, '30')">近30天</button>
            <button class="select-btn" onclick="selectTimeRange(this, '7')">近7天</button>
            <button class="select-btn" onclick="selectTimeRange(this, '90')">近90天</button>
            <button class="select-btn" onclick="selectTimeRange(this, 'custom')">自定义</button>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;margin-left:4px">AI监测助手 · 刚刚</div>
      </div>
    </div>`;
}

let selectedTimeRange = '30';

function selectTimeRange(btn, range) {
  // 移除其他按钮的 active 样式
  btn.parentElement.querySelectorAll('.select-btn').forEach(b => {
    b.classList.remove('active');
    b.textContent = b.textContent.replace(' ✓', '');
  });
  // 添加 active 样式到当前按钮
  btn.classList.add('active');
  btn.textContent = btn.textContent + ' ✓';
  selectedTimeRange = range;
  
  // 如果选择了自定义，显示日期选择器
  if (range === 'custom') {
    showCustomDatePicker(btn);
  } else {
    // 自动发送确认消息
    setTimeout(() => {
      const input = document.getElementById('ai-input');
      input.value = '确认时间范围：' + btn.textContent.replace(' ✓', '');
      sendAiMonitorMessage();
    }, 300);
  }
}

function showCustomDatePicker(btn) {
  // 在按钮下方插入日期选择器
  const existing = document.getElementById('custom-date-picker');
  if (existing) { existing.remove(); return; }
  
  const picker = document.createElement('div');
  picker.id = 'custom-date-picker';
  picker.style.cssText = 'position:absolute;z-index:1000;background:white;border:1px solid var(--border);border-radius:8px;padding:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:8px;width:280px';
  picker.innerHTML = `
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">请选择自定义时间范围：</div>
    <div style="margin-bottom:8px">
      <label style="font-size:11px;color:var(--text-muted)">开始日期</label>
      <input type="date" id="custom-start-date" class="form-control" style="width:100%;margin-top:4px" value="">
    </div>
    <div style="margin-bottom:8px">
      <label style="font-size:11px;color:var(--text-muted)">结束日期</label>
      <input type="date" id="custom-end-date" class="form-control" style="width:100%;margin-top:4px" value="">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn btn-ghost btn-sm" onclick="document.getElementById('custom-date-picker').remove()">取消</button>
      <button class="btn btn-primary btn-sm" onclick="confirmCustomDate()">确认</button>
    </div>
  `;
  btn.parentElement.style.position = 'relative';
  btn.parentElement.appendChild(picker);
  
  // 设置默认日期（30天前到今天）
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  document.getElementById('custom-end-date').value = today.toISOString().split('T')[0];
  document.getElementById('custom-start-date').value = thirtyDaysAgo.toISOString().split('T')[0];
}

function confirmCustomDate() {
  const startDate = document.getElementById('custom-start-date').value;
  const endDate = document.getElementById('custom-end-date').value;
  
  if (!startDate || !endDate) {
    showToast('请选择开始和结束日期', 'warning');
    return;
  }
  
  if (new Date(startDate) > new Date(endDate)) {
    showToast('开始日期不能晚于结束日期', 'warning');
    return;
  }
  
  document.getElementById('custom-date-picker').remove();
  
  // 更新按钮文字
  const btns = document.querySelectorAll('#platform-select-group, .select-btn');
  document.querySelectorAll('.select-btn').forEach(b => {
    if (b.textContent.includes('自定义')) {
      b.classList.add('active');
      b.textContent = '自定义：' + startDate + ' 至 ' + endDate + ' ✓';
    }
  });
  
  selectedTimeRange = startDate + ' 至 ' + endDate;
  
  // 自动发送确认消息
  setTimeout(() => {
    const input = document.getElementById('ai-input');
    input.value = '确认时间范围：' + startDate + ' 至 ' + endDate;
    sendAiMonitorMessage();
  }, 300);
}

function addAiMsg2(messages) {
  messages.innerHTML += `
    <div class="chat-msg ai">
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble">
          明白了！我需要最后确认一下重点监测平台：<br><br>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">🎬 短视频平台</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px" id="platform-select-group">
            <button class="select-btn active" onclick="togglePlatform(this, '抖音')">抖音</button>
            <button class="select-btn active" onclick="togglePlatform(this, '快手')">快手</button>
            <button class="select-btn active" onclick="togglePlatform(this, '微信视频号')">微信视频号</button>
            <button class="select-btn" onclick="togglePlatform(this, '哔哩哔哩')">哔哩哔哩</button>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">🚗 汽车垂类媒体</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <button class="select-btn active" onclick="togglePlatform(this, '汽车之家')">汽车之家</button>
            <button class="select-btn" onclick="togglePlatform(this, '易车网')">易车网</button>
            <button class="select-btn" onclick="togglePlatform(this, '懂车帝')">懂车帝</button>
            <button class="select-btn" onclick="togglePlatform(this, '太平洋汽车')">太平洋汽车</button>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">💬 社交媒体</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <button class="select-btn active" onclick="togglePlatform(this, '微信公众号')">微信公众号</button>
            <button class="select-btn" onclick="togglePlatform(this, '新浪微博')">新浪微博</button>
            <button class="select-btn" onclick="togglePlatform(this, '小红书')">小红书</button>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">📰 门户新闻媒体</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <button class="select-btn" onclick="togglePlatform(this, '今日头条')">今日头条</button>
            <button class="select-btn" onclick="togglePlatform(this, '百度新闻')">百度新闻</button>
            <button class="select-btn" onclick="togglePlatform(this, '网易新闻')">网易新闻</button>
            <button class="select-btn" onclick="togglePlatform(this, '凤凰新闻')">凤凰新闻</button>
            <button class="select-btn" onclick="togglePlatform(this, '搜狐新闻')">搜狐新闻</button>
            <button class="select-btn" onclick="togglePlatform(this, '腾讯新闻')">腾讯新闻</button>
            <button class="select-btn" onclick="togglePlatform(this, '央媒')">央媒</button>
            <button class="select-btn" onclick="togglePlatform(this, '省媒')">省媒</button>
          </div>
          <div style="margin-top:10px">
            <button class="btn btn-primary btn-sm" onclick="addAiMsg3(document.getElementById('ai-chat-messages'))">下一步</button>
          </div>
        </div>
      </div>
    </div>`;
}

function addAiMsg3(messages) {
  messages.innerHTML += `
    <div class="chat-msg ai">
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble">
          接下来需要设置**互动量刷新规则**，这会影响数据的实时性：<br><br>
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">是否需要自动刷新互动量（点赞、评论、转发等数据）？</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px" id="refresh-select-group">
            <button class="select-btn active" onclick="selectRefreshOption(this, 'refresh')">需要刷新互动量</button>
            <button class="select-btn" onclick="selectRefreshOption(this, 'no-refresh')">不刷新（节省消耗）</button>
          </div>
          
          <div id="refresh-config-area" style="display:none">
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">请选择刷新时间间隔：</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap" id="refresh-interval-group">
              <button class="select-btn active" onclick="toggleRefreshInterval(this, '1')">每1小时</button>
              <button class="select-btn active" onclick="toggleRefreshInterval(this, '6')">每6小时</button>
              <button class="select-btn" onclick="toggleRefreshInterval(this, '12')">每12小时</button>
              <button class="select-btn" onclick="toggleRefreshInterval(this, '24')">每24小时</button>
            </div>
          </div>
          
          <div style="margin-top:12px">
            <button class="btn btn-primary btn-sm" onclick="generateAiConfig()">✓ 确认，开始生成配置</button>
          </div>
        </div>
      </div>
    </div>`;
  messages.scrollTop = messages.scrollHeight;
}

let selectedRefreshOption = 'refresh';
let selectedRefreshIntervals = ['6'];

function selectRefreshOption(btn, option) {
  btn.parentElement.querySelectorAll('.select-btn').forEach(b => {
    b.classList.remove('active');
    b.textContent = b.textContent.replace(' ✓', '');
  });
  btn.classList.add('active');
  btn.textContent = btn.textContent + ' ✓';
  selectedRefreshOption = option;
  
  const configArea = document.getElementById('refresh-config-area');
  if (option === 'refresh') {
    configArea.style.display = 'block';
  } else {
    configArea.style.display = 'none';
  }
}

function toggleRefreshInterval(btn, interval) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = btn.textContent.replace(' ✓', '') + ' ✓';
    if (!selectedRefreshIntervals.includes(interval)) {
      selectedRefreshIntervals.push(interval);
    }
  } else {
    btn.textContent = btn.textContent.replace(' ✓', '');
    selectedRefreshIntervals = selectedRefreshIntervals.filter(i => i !== interval);
  }
}

function togglePlatform(btn, platform) {
  btn.classList.toggle('active');
  if (btn.classList.contains('active')) {
    btn.textContent = platform;
  } else {
    btn.textContent = platform;
  }
}

function addAiMsgFinal(messages) {
  messages.innerHTML += `
    <div class="chat-msg ai">
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble">我已根据您的需求生成完整监测配置 ✅，请查看右侧配置预览，确认无误后点击"确认创建"即可开始监测！</div>
      </div>
    </div>`;
  generateAiConfig();
}

function generateAiConfig() {
  const panel = document.getElementById('ai-config-content');
  panel.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="flex-between mb-12">
        <div style="font-size:14px;font-weight:600;color:#22C870">✓ 配置生成完成</div>
        <div class="flex gap-8">
          <button class="btn btn-ghost btn-sm" onclick="showToast('可在下方直接编辑各项配置','info')">手动调整</button>
          <button class="btn btn-primary btn-sm" onclick="confirmAiConfig()">确认创建监测</button>
        </div>
      </div>

      <div class="card mb-12" style="background:var(--bg-card2)">
        <div style="font-size:12px;font-weight:600;color:var(--primary);margin-bottom:10px">📌 需求理解摘要</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.8">
          监测主体：<strong style="color:var(--text-primary)">长安汽车品牌传播</strong><br>
          监测目的：全面掌握品牌在主流平台的传播动态与用户口碑<br>
          时间范围：<strong style="color:var(--text-primary)">近30天</strong><br>
          重点平台：<strong style="color:var(--text-primary)">抖音、快手、微信视频号、哔哩哔哩、汽车之家、易车网、懂车帝、太平洋汽车、微信公众号、新浪微博、小红书</strong>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">🔑 监测关键词组合</label>
        <div class="keyword-editor" contenteditable="true">长安汽车 / 长安 + （口碑 / 评测 / 传播 / 销量 / 用户反馈）</div>
      </div>

      <div class="form-group">
        <label class="form-label">🚫 排除词</label>
        <div class="keyword-editor" contenteditable="true" style="min-height:40px">广告 / 推广 / 招聘 / 二手车</div>
      </div>

      <!-- 互动量刷新设置 -->
      <div class="card mb-12" style="background:var(--bg-card3);border:1px solid var(--border)">
        <div class="flex-between mb-12">
          <label class="form-label" style="margin-bottom:0">🔄 互动量刷新</label>
          <div class="flex-center gap-8">
            <span class="text-sm text-muted">关闭</span>
            <label class="switch">
              <input type="checkbox" id="ai-refresh-switch" onchange="toggleAiRefreshContent(this)">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>
        <div id="ai-refresh-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label text-sm">刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setAiRefreshTime(this,'0.5h')">半小时</div>
              <div class="time-option active" onclick="setAiRefreshTime(this,'1h')">1小时</div>
              <div class="time-option" onclick="setAiRefreshTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setAiRefreshTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setAiRefreshTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showAiRefreshTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="ai-refresh-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-page);border-radius:8px">
              <div class="form-label text-sm mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="ai-refresh-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="ai-refresh-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="2" min="1" max="12" style="width:80px" id="ai-refresh-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label text-sm">刷新媒体范围</label>
            <div class="select-group" id="ai-refresh-media">
              ${['抖音','快手','微信视频号','哔哩哔哩','汽车之家','易车网','懂车帝','太平洋汽车','微信公众号','新浪微博','小红书'].map((m,i) => `<div class="select-btn ${i===0?'active':''}" onclick="this.classList.toggle('active')">${m}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- 评论刷新设置 -->
      <div class="card mb-12" style="background:var(--bg-card3);border:1px solid var(--border)">
        <div class="flex-between mb-12">
          <label class="form-label" style="margin-bottom:0">💬 评论刷新</label>
          <div class="flex-center gap-8">
            <span class="text-sm text-muted">关闭</span>
            <label class="switch">
              <input type="checkbox" id="ai-comment-switch" onchange="toggleAiCommentContent(this)">
              <span class="slider"></span>
            </label>
            <span class="text-sm text-muted">开启</span>
          </div>
        </div>
        <div id="ai-comment-content" style="opacity:0.4;pointer-events:none;transition:opacity 0.3s">
          <div class="form-group">
            <label class="form-label text-sm">评论刷新周期</label>
            <div class="time-option-group">
              <div class="time-option" onclick="setAiCommentTime(this,'0.5h')">半小时</div>
              <div class="time-option" onclick="setAiCommentTime(this,'1h')">1小时</div>
              <div class="time-option active" onclick="setAiCommentTime(this,'6h')">6小时</div>
              <div class="time-option" onclick="setAiCommentTime(this,'12h')">12小时</div>
              <div class="time-option" onclick="setAiCommentTime(this,'24h')">24小时</div>
              <div class="time-option" onclick="showAiCommentTimeEditor(this)">自定义时间点</div>
            </div>
            <div id="ai-comment-time-editor" class="time-editor-panel" style="display:none;margin-top:12px;padding:16px;background:var(--bg-page);border-radius:8px">
              <div class="form-label text-sm mb-8">选择具体时间点</div>
              <div class="grid-2">
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">开始时间</label>
                  <input type="time" class="form-control" value="09:00" id="ai-comment-start-time">
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label class="form-label text-sm">结束时间</label>
                  <input type="time" class="form-control" value="21:00" id="ai-comment-end-time">
                </div>
              </div>
              <div class="form-label text-sm mt-8">刷新间隔</div>
              <div class="flex gap-8 mt-4">
                <input type="number" class="form-control" value="4" min="1" max="12" style="width:80px" id="ai-comment-interval">
                <span class="text-muted text-sm flex-center">小时</span>
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label text-sm">评论刷新媒体</label>
            <div class="select-group">
              ${['抖音','快手','微信视频号','哔哩哔哩','汽车之家','易车网','懂车帝','太平洋汽车','微信公众号','新浪微博','小红书'].map((m,i) => `<div class="select-btn ${i<3?'active':''}" onclick="this.classList.toggle('active')">${m}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">🎬 短视频平台</label>
        <div class="select-group">
          ${['抖音','快手','微信视频号','哔哩哔哩'].map(p=>`<div class="select-btn active" onclick="this.classList.toggle('active')">${p}</div>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">🚗 汽车垂类媒体</label>
        <div class="select-group">
          ${['汽车之家','易车网','懂车帝','太平洋汽车'].map(p=>`<div class="select-btn active" onclick="this.classList.toggle('active')">${p}</div>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">💬 社交媒体</label>
        <div class="select-group">
          ${['微信公众号','新浪微博','小红书'].map(p=>`<div class="select-btn active" onclick="this.classList.toggle('active')">${p}</div>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">📰 门户新闻媒体</label>
        <div class="select-group">
          ${['今日头条','百度新闻','网易新闻','凤凰新闻','搜狐新闻','腾讯新闻','央媒','省媒'].map(p=>`<div class="select-btn" onclick="this.classList.toggle('active')">${p}</div>`).join('')}
        </div>
      </div>

      <div class="card" style="background:var(--warning-bg);border-color:rgba(245,158,11,0.2)">
        <div style="font-size:12px;color:#FFA03C">💰 预计消耗：约 280 洞察豆/天（当前余额可持续39天）</div>
      </div>

      <div class="form-group mt-12">
        <label class="form-label">项目名称</label>
        <input class="form-control" value="长安汽车品牌传播舆情监测">
      </div>

      <div class="form-group">
        <label class="form-label">所属分类 <span class="text-muted" style="font-weight:400;font-size:11px">（可选）</span></label>
        <div style="display:flex;flex-direction:column;gap:6px">
          <select class="form-control" id="ai-car-company" onchange="onAiCompanyChange(this.value)" style="font-size:12px">
            <option value="">-- 选择车企 --</option>
            ${carBrandConfig.map(c=>`<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
          <select class="form-control" id="ai-car-brand" onchange="onAiBrandChange(this.value)" style="font-size:12px" disabled>
            <option value="">-- 选择品牌 --</option>
          </select>
          <select class="form-control" id="ai-car-model" style="font-size:12px" disabled>
            <option value="">-- 选择车型 --</option>
          </select>
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;margin-top:8px" onclick="confirmAiConfig()">
        ✓ 确认创建监测项目
      </button>
    </div>`;
}

function confirmAiConfig() {
  showToast('监测项目创建成功！AI已自动开始数据采集', 'success');
  setTimeout(() => showPage('monitor-list'), 1500);
}

function onAiCompanyChange(company) {
  const brandSel = document.getElementById('ai-car-brand');
  const modelSel = document.getElementById('ai-car-model');
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

function onAiBrandChange(brand) {
  const company = document.getElementById('ai-car-company')?.value;
  const modelSel = document.getElementById('ai-car-model');
  if (!modelSel) return;
  if (!brand) { modelSel.innerHTML = '<option value="">-- 选择车型 --</option>'; modelSel.disabled = true; return; }
  const comp = carBrandConfig.find(c=>c.name===company);
  const br = comp?.brands.find(b=>b.name===brand);
  modelSel.innerHTML = '<option value="">-- 选择车型 --</option>' + (br?.models||[]).map(m=>`<option value="${m}">${m}</option>`).join('');
  modelSel.disabled = false;
}

function clearAIChat() {
  aiChatCount = 0;
  document.getElementById('ai-chat-messages').innerHTML = `
    <div class="chat-msg ai">
      <div class="chat-avatar ai">AI</div>
      <div>
        <div class="chat-bubble">对话已清空，请重新描述您的监测需求～</div>
      </div>
    </div>`;
  document.getElementById('ai-config-content').innerHTML = `
    <div class="empty-state" style="padding:40px">
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="var(--primary)" stroke-width="2" opacity="0.3"/>
        <circle cx="32" cy="32" r="18" stroke="var(--primary)" stroke-width="2" opacity="0.5"/>
        <circle cx="32" cy="32" r="8" fill="var(--primary)" opacity="0.7"/>
      </svg>
      <p>在左侧输入监测需求</p>
      <small>AI将自动解析并生成监测配置</small>
    </div>`;
}

// 互动量刷新开关控制
function toggleAiRefreshContent(checkbox) {
  const content = document.getElementById('ai-refresh-content');
  if (content) {
    content.style.opacity = checkbox.checked ? '1' : '0.4';
    content.style.pointerEvents = checkbox.checked ? 'auto' : 'none';
  }
}

function setAiRefreshTime(el, time) {
  document.querySelectorAll('#ai-refresh-content .time-option').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ai-refresh-time-editor').style.display = 'none';
}

function showAiRefreshTimeEditor(el) {
  document.querySelectorAll('#ai-refresh-content .time-option').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ai-refresh-time-editor').style.display = 'block';
}

// 评论刷新开关控制
function toggleAiCommentContent(checkbox) {
  const content = document.getElementById('ai-comment-content');
  if (content) {
    content.style.opacity = checkbox.checked ? '1' : '0.4';
    content.style.pointerEvents = checkbox.checked ? 'auto' : 'none';
  }
}

function setAiCommentTime(el, time) {
  document.querySelectorAll('#ai-comment-content .time-option').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ai-comment-time-editor').style.display = 'none';
}

function showAiCommentTimeEditor(el) {
  document.querySelectorAll('#ai-comment-content .time-option').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('ai-comment-time-editor').style.display = 'block';
}
