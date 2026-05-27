// ===================== 智能报告 - AI创建报告页面 =====================

const reportSceneCards = [
  { id: 1, icon: '📅', name: '品牌传播周报', prompt: '帮我生成一份品牌传播周报，报告类型为周期报告，每周一上午9点自动生成，数据范围为上周一至上周日的全平台品牌传播数据，需要包含总声量趋势、平台分布、核心传播内容、互动效果分析、下周优化建议' },
  { id: 2, icon: '🚗', name: '新车上市复盘', prompt: '帮我生成一份新车上市传播全周期复盘报告，数据范围为上市前7天至今，需包含传播峰值分析、KOL传播路径、媒体分布、用户口碑关键词、与竞品对比' },
  { id: 3, icon: '🚨', name: '负面舆情分析', prompt: '帮我生成一份负面舆情事件处置分析报告，时间范围为近30天，重点分析负面内容传播路径、情感趋势变化、主要传播节点、已采取处置措施的效果评估，以及后续应对建议' },
  { id: 4, icon: '🔥', name: '热点事件监测', prompt: '帮我生成一份热点事件传播效果监测报告，分析事件引爆到消散的完整传播链路，包括声量趋势、情感变化、核心传播媒体与账号、事件标签话题分析' },
  { id: 5, icon: '📊', name: '竞品对标分析', prompt: '帮我生成一份品牌/车型竞品对标分析报告，对比范围包含主要竞品品牌，从声量、互动率、情感、内容类型、平台分布多维度对比，输出竞争格局洞察和差异化建议' },
  { id: 6, icon: '💬', name: '品牌口碑分析', prompt: '帮我生成一份品牌口碑与用户观点分析报告，聚焦用户真实声音，包含正负面观点词云、主要用户痛点与好评点、KOL评价内容摘要、口碑趋势变化分析' },
  { id: 7, icon: '⭐', name: 'KOL效果复盘', prompt: '帮我生成一份KOL合作传播效果复盘报告，分析本次合作的KOL列表传播数据，包含内容互动率、受众覆盖、情感倾向、ROI评估，以及下次投放选号建议' },
  { id: 8, icon: '📱', name: '平台投放评估', prompt: '帮我生成一份平台投放效果评估报告，覆盖各平台投放数据，包含曝光量、互动率、转化数据、内容类型效果对比、平台优劣势分析及下期优化方向' },
  { id: 9, icon: '❤️', name: '品牌健康度分析', prompt: '帮我生成一份月度品牌健康度分析报告，从声量、情感、口碑、竞争力四个维度综合评估品牌健康状况，输出品牌健康指数并对比上月变化趋势' },
  { id: 10, icon: '🎉', name: '公关活动复盘', prompt: '帮我生成一份公关活动传播复盘报告，总结活动期间全平台传播效果，包含声量曲线、核心媒体贡献、活动话题表现、用户参与度分析，以及活动复盘结论和优化建议' },
];

let aiChatHistory = [];
let aiCreateStep = 0; // 0=初始 1=确认报告类型 2=确认模板 3=确认数据源 4=确认刷新设置 5=确认发送设置 6=确认分析维度 7=生成中 8=已生成
let aiReportType = 'project'; // project | period
let aiPeriodType = 'weekly'; // daily | weekly | custom
let aiRefreshEnabled = true;
let aiRefreshInterval = '6h';
let aiCommentEnabled = false;
let aiCommentInterval = '24h';
let aiSelectedMonitor = null;

pageRenderers['report-ai-create'] = () => `
<div class="page-header">
  <div style="display:flex;align-items:center;gap:10px">
    <button class="btn btn-ghost btn-sm" onclick="showPage('report-list')">
      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      返回
    </button>
    <div class="page-title">AI智能生成报告</div>
  </div>
</div>

<!-- 上半部分：能力全景介绍 -->
<div id="aiCapBanner" style="background:linear-gradient(135deg,#1a1d26 0%,#2a1520 100%);border-radius:12px;padding:24px;margin-bottom:20px;color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 50%,rgba(217,63,74,0.25),transparent 60%);pointer-events:none"></div>
  <div style="font-size:18px;font-weight:700;margin-bottom:4px;position:relative">汽车品牌传播全场景智能分析能力全景</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:18px;position:relative">覆盖品牌传播「规划 - 执行 - 复盘 - 常态化运营」全生命周期，所有品牌分析需求一键生成报告</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;position:relative">
    <div style="background:rgba(147,197,253,0.08);border:1px solid rgba(147,197,253,0.2);border-radius:8px;padding:14px">
      <div style="font-size:12px;color:#93C5FD;font-weight:600;margin-bottom:8px">🔮 事前 · 规划预判类</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.8">
        <div>· 新车上市前传播策略规划与竞品对标</div>
        <div>· 营销活动/选题风险预判与热点机会</div>
        <div>· 行业政策/大事件对品牌影响分析</div>
        <div>· 竞品最新传播动作与策略拆解</div>
      </div>
    </div>
    <div style="background:rgba(253,186,116,0.08);border:1px solid rgba(253,186,116,0.2);border-radius:8px;padding:14px">
      <div style="font-size:12px;color:#FBB86C;font-weight:600;margin-bottom:8px">⚡ 事中 · 执行管控类</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.8">
        <div>· 新车上市/活动实时传播效果追踪</div>
        <div>· 突发负面舆情溯源、传播路径分析</div>
        <div>· 投放渠道/KOL实时效果监控优化</div>
        <div>· 竞品突发营销动作实时对标分析</div>
      </div>
    </div>
    <div style="background:rgba(134,239,172,0.08);border:1px solid rgba(134,239,172,0.2);border-radius:8px;padding:14px">
      <div style="font-size:12px;color:#86EFAC;font-weight:600;margin-bottom:8px">📋 事后 · 复盘沉淀类</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.8">
        <div>· 传播活动全周期效果复盘报告</div>
        <div>· 周/月度品牌健康度综合分析</div>
        <div>· KOL合作传播效果评估报告</div>
        <div>· 竞品对标季度总结与策略建议</div>
      </div>
    </div>
  </div>
</div>

<!-- 高频场景卡片 -->
<div style="margin-bottom:16px">
  <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px">高频场景快速选择</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    ${reportSceneCards.map(c => `
      <div class="scene-card" onclick="fillScenePrompt(${c.id})">
        <span>${c.icon}</span>
        <span>${c.name}</span>
      </div>
    `).join('')}
  </div>
</div>

<!-- 对话区 -->
<div style="display:flex;gap:0;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;overflow:hidden;min-height:420px">
  <div style="flex:1;display:flex;flex-direction:column;">
    <!-- 对话历史 -->
    <div id="aiChatHistory" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;min-height:300px">
      <div style="text-align:center;padding:24px 0">
        <div style="font-size:32px;margin-bottom:8px">🤖</div>
        <div style="font-size:14px;color:var(--text-secondary);max-width:480px;margin:0 auto;line-height:1.7">
          你好！我是智能报告助手，请描述您需要生成的报告，或点击上方场景卡片快速开始。<br>
          <span class="text-muted text-sm">建议包含：报告场景、类型（单次/周期）、数据时间范围、核心分析维度</span>
        </div>
      </div>
    </div>

    <!-- 补全提示区 -->
    <div id="aiCompleteHint" style="display:none;padding:0 20px 8px;"></div>

    <!-- 输入框 -->
    <div style="padding:16px 20px;border-top:1px solid var(--border)">
      <div style="display:flex;gap:10px;align-items:flex-end">
        <textarea id="aiInput" rows="3" class="form-input" style="flex:1;resize:none;font-size:13px;line-height:1.7"
          placeholder="请描述您的报告需求，建议包含：报告场景、类型（单次专项/周期例行）、数据时间范围、核心分析维度，也可直接点击上方场景卡片一键填充"
          oninput="onAiInput(this.value)"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAiMessage()}"></textarea>
        <button class="btn btn-primary" style="padding:8px 16px;height:fit-content" onclick="sendAiMessage()">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h12M9 3l5 5-5 5"/></svg>
          发送
        </button>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
        <button class="btn btn-ghost btn-sm" onclick="quickFill('品牌传播周报，上周数据，包含声量趋势、平台分布、互动效果')">品牌周报</button>
        <button class="btn btn-ghost btn-sm" onclick="quickFill('负面舆情分析报告，近7天，重点分析传播路径和处置效果')">舆情分析</button>
        <button class="btn btn-ghost btn-sm" onclick="quickFill('竞品对标分析，近30天，与主要竞品全维度对比')">竞品对标</button>
        <button class="btn btn-ghost btn-sm" onclick="quickFill('KOL合作效果复盘，近一个月，评估ROI和内容表现')">KOL复盘</button>
      </div>
    </div>
  </div>
</div>
`;

pageInits['report-ai-create'] = () => {
  aiChatHistory = [];
  aiCreateStep = 0;
};

function fillScenePrompt(sceneId) {
  console.log('fillScenePrompt called with sceneId:', sceneId);
  const scene = reportSceneCards.find(c => c.id === sceneId);
  if (!scene) {
    console.log('Scene not found for id:', sceneId);
    return;
  }
  console.log('Found scene:', scene.name);
  const input = document.getElementById('aiInput');
  if (input) {
    input.value = scene.prompt;
    input.focus();
    onAiInput(scene.prompt);
    showToast('已填充：' + scene.name, 'success');
  } else {
    console.log('aiInput element not found');
  }
}

function quickFill(text) {
  const input = document.getElementById('aiInput');
  if (input) { input.value = text; input.focus(); }
}

function onAiInput(val) {
  const hintArea = document.getElementById('aiCompleteHint');
  if (!hintArea) return;
  if (val.length > 8 && !val.includes('类型') && !val.includes('周期') && !val.includes('时间')) {
    hintArea.style.display = 'block';
    hintArea.innerHTML = `
      <div style="background:var(--info-bg);border:1px solid var(--info-border);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--text-secondary)">
        <span style="color:var(--info);font-weight:600">💡 您还可以补充：</span>
        <span>① 报告是单次专项还是周期生成？</span>
        <span style="margin:0 4px">②</span>
        <span>数据的时间范围？</span>
        <span style="margin:0 4px">③</span>
        <span>需要哪些核心分析维度？</span>
      </div>`;
  } else {
    hintArea.style.display = 'none';
  }
}

let aiMsgIndex = 0;
function sendAiMessage() {
  const input = document.getElementById('aiInput');
  if (!input || !input.value.trim()) return;
  const userMsg = input.value.trim();
  input.value = '';
  document.getElementById('aiCompleteHint') && (document.getElementById('aiCompleteHint').style.display = 'none');

  appendChatMsg('user', userMsg);
  aiCreateStep++;

  setTimeout(() => {
    if (aiCreateStep === 1) {
      // 第1轮：确认报告类型
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound1_ReportType(userMsg));
      }, 1500);
    } else if (aiCreateStep === 2) {
      // 第2轮：选择报告模板
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound2_Template());
      }, 1200);
    } else if (aiCreateStep === 3) {
      // 第3轮：确认数据源
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound3_DataSource());
      }, 1000);
    } else if (aiCreateStep === 4) {
      // 第4轮：确认刷新设置
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound4_Refresh());
      }, 1000);
    } else if (aiCreateStep === 5) {
      // 第5轮：确认发送设置
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound5_SendSettings());
      }, 1000);
    } else if (aiCreateStep === 6) {
      // 第6轮：确认分析维度
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiRound6_Dimensions());
      }, 1000);
    } else {
      // 生成报告
      appendAiThinking();
      setTimeout(() => {
        replaceThinkingWithMsg(getAiFinalResponse());
      }, 2000);
    }
  }, 300);
}

function appendChatMsg(role, html) {
  const area = document.getElementById('aiChatHistory');
  if (!area) return;
  const isUser = role === 'user';
  const div = document.createElement('div');
  div.style.cssText = `display:flex;gap:10px;align-items:flex-start;${isUser ? 'flex-direction:row-reverse' : ''}`;
  div.innerHTML = `
    <div style="width:32px;height:32px;border-radius:50%;background:${isUser ? 'var(--primary)' : 'var(--bg-card3)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;border:1px solid var(--border)">
      ${isUser ? '<svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="7" r="3" stroke="white" fill="none" stroke-width="1.5"/><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="white" fill="none" stroke-width="1.5" stroke-linecap="round"/></svg>' : '🤖'}
    </div>
    <div style="max-width:75%;background:${isUser ? 'var(--primary)' : 'var(--bg-card2)'};color:${isUser ? '#fff' : 'var(--text-primary)'};border-radius:${isUser ? '12px 4px 12px 12px' : '4px 12px 12px 12px'};padding:12px 14px;font-size:13px;line-height:1.7;border:1px solid ${isUser ? 'transparent' : 'var(--border)'}">
      ${html}
    </div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function appendAiThinking() {
  const area = document.getElementById('aiChatHistory');
  if (!area) return;
  const div = document.createElement('div');
  div.id = 'ai-thinking';
  div.style.cssText = 'display:flex;gap:10px;align-items:flex-start';
  div.innerHTML = `
    <div style="width:32px;height:32px;border-radius:50%;background:var(--bg-card3);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;border:1px solid var(--border)">🤖</div>
    <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:4px 12px 12px 12px;padding:12px 16px;font-size:13px;color:var(--text-muted)">
      <span style="animation:blink 1s infinite">正在思考</span>
      <span style="display:inline-flex;gap:3px;margin-left:4px">
        <span style="animation:bounce 1s infinite;animation-delay:0s">·</span>
        <span style="animation:bounce 1s infinite;animation-delay:0.2s">·</span>
        <span style="animation:bounce 1s infinite;animation-delay:0.4s">·</span>
      </span>
    </div>`;
  area.appendChild(div);
  area.scrollTop = area.scrollHeight;
}

function replaceThinkingWithMsg(html) {
  const thinking = document.getElementById('ai-thinking');
  if (thinking) thinking.remove();
  appendChatMsg('ai', html);
}

// ========== AI多轮对话：与手动创建报告流程一致 ==========

// 第1轮：确认报告类型
function getAiRound1_ReportType(userMsg) {
  return `
    <div style="margin-bottom:12px;font-weight:600">已为您拆解需求，首先确认<strong>报告类型</strong>：</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div onclick="selectAiReportType('project', this)" style="border:2px solid var(--primary);border-radius:8px;padding:14px;cursor:pointer;background:var(--primary-bg);text-align:center" id="aiTypeProject">
        <div style="font-size:24px;margin-bottom:6px">📋</div>
        <div style="font-size:13px;font-weight:600">专项报告</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">单次分析</div>
      </div>
      <div onclick="selectAiReportType('period', this)" style="border:2px solid var(--border);border-radius:8px;padding:14px;cursor:pointer;background:var(--bg-card);text-align:center" id="aiTypePeriod">
        <div style="font-size:24px;margin-bottom:6px">🔄</div>
        <div style="font-size:13px;font-weight:600">周期报告</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px">例行生成</div>
      </div>
    </div>
    
    <div id="aiPeriodConfig" style="display:none;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;margin-bottom:10px">📅 周期报告生成规则</div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div onclick="selectAiPeriodType('daily', this)" style="flex:1;border:2px solid var(--border);border-radius:6px;padding:10px;cursor:pointer;background:var(--bg-card);text-align:center">
          <div style="font-size:16px">📅</div>
          <div style="font-size:11px;font-weight:500">日报</div>
        </div>
        <div onclick="selectAiPeriodType('weekly', this)" style="flex:1;border:2px solid var(--primary);border-radius:6px;padding:10px;cursor:pointer;background:var(--primary-bg);text-align:center" id="aiPeriodWeekly">
          <div style="font-size:16px">📆</div>
          <div style="font-size:11px;font-weight:500">周报</div>
        </div>
        <div onclick="selectAiPeriodType('custom', this)" style="flex:1;border:2px solid var(--border);border-radius:6px;padding:10px;cursor:pointer;background:var(--bg-card);text-align:center">
          <div style="font-size:16px">⚙️</div>
          <div style="font-size:11px;font-weight:500">自定义</div>
        </div>
      </div>
      
      <div id="aiWeeklyConfig">
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">⏰ 时间范围</div>
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <input class="form-input" type="time" value="00:00" id="aiWeekStartTime" style="flex:1;font-size:12px">
          <span style="color:var(--text-muted);line-height:36px">至</span>
          <input class="form-input" type="time" value="23:59" id="aiWeekEndTime" style="flex:1;font-size:12px">
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">📅 选择工作日</div>
        <div style="display:flex;gap:6px">
          ${['周一','周二','周三','周四','周五','周六','周日'].map((d,i) => `<div onclick="this.classList.toggle('active')" class="weekday-btn ${i<5?'active':''}" style="padding:4px 8px;font-size:10px;cursor:pointer;border-radius:4px;border:1px solid var(--border);background:${i<5?'var(--primary-bg)':'var(--bg-card)'}">${d}</div>`).join('')}
        </div>
      </div>
    </div>
    
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:14px">
      <table style="width:100%;font-size:12px;border-collapse:collapse">
        <tr style="background:var(--bg-card3)"><td style="padding:6px 10px;color:var(--text-muted)">报告名称</td><td style="padding:6px 10px;font-weight:500">长安CS75Plus 品牌传播周报</td></tr>
        <tr><td style="padding:6px 10px;color:var(--text-muted)">报告类型</td><td style="padding:6px 10px"><span class="tag tag-blue" style="font-size:10px" id="aiTypeTag">周期报告 · 周报</span></td></tr>
        <tr style="background:var(--bg-card3)"><td style="padding:6px 10px;color:var(--text-muted)">数据范围</td><td style="padding:6px 10px">每周一至周五 00:00-23:59</td></tr>
      </table>
    </div>
    
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="aiConfirmStep()">✓ 确认报告类型</button>
      <button class="btn btn-ghost btn-sm" onclick="openAiEditReportInfo()">✏ 修改</button>
    </div>`;
}

function selectAiReportType(type, el) {
  aiReportType = type;
  const proj = document.getElementById('aiTypeProject');
  const period = document.getElementById('aiTypePeriod');
  const config = document.getElementById('aiPeriodConfig');
  const tag = document.getElementById('aiTypeTag');
  
  if (type === 'project') {
    proj.style.borderColor = 'var(--primary)';
    proj.style.background = 'var(--primary-bg)';
    period.style.borderColor = 'var(--border)';
    period.style.background = 'var(--bg-card)';
    config.style.display = 'none';
    tag.innerHTML = '专项报告';
  } else {
    period.style.borderColor = 'var(--primary)';
    period.style.background = 'var(--primary-bg)';
    proj.style.borderColor = 'var(--border)';
    proj.style.background = 'var(--bg-card)';
    config.style.display = 'block';
    tag.innerHTML = '周期报告 · 周报';
  }
}

function selectAiPeriodType(type, el) {
  aiPeriodType = type;
  document.querySelectorAll('#aiPeriodConfig > div:first-child + div > div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--primary)';
  el.style.background = 'var(--primary-bg)';
}

function openAiEditReportInfo() {
  openModal('修改报告信息', `
    <div class="form-group"><label class="form-label">报告名称</label><input class="form-input" value="长安CS75Plus 品牌传播周报"></div>
    <div class="form-group"><label class="form-label">报告类型</label>
      <select class="form-input" id="editAiReportType" onchange="updateAiTypeTag(this.value)">
        <option value="project">专项报告</option>
        <option value="period">周期报告</option>
      </select>
    </div>
  `, `<button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="saveAiReportInfo()">保存</button>`, 480);
}

function updateAiTypeTag(val) {
  const tag = document.getElementById('aiTypeTag');
  if (tag) tag.textContent = val === 'project' ? '专项报告' : '周期报告 · 周报';
}

function saveAiReportInfo() {
  closeModal();
  showToast('报告信息已更新', 'success');
}

// 第3轮：确认数据源（互换后）
function getAiRound3_DataSource() {
  aiSelectedMonitor = mockMonitorProjects[0];
  return `
    <div style="margin-bottom:12px;font-weight:600">确认<strong>监测数据源</strong>（第3/6步）：</div>
    <div style="background:var(--success-bg);border:1px solid var(--success-border);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px">
      <span style="color:var(--success);font-weight:600">✓ 已自动匹配</span> 找到1个高度匹配的监测项目
    </div>
    <div style="border:2px solid var(--primary);border-radius:8px;padding:14px;background:var(--primary-bg);margin-bottom:14px;cursor:pointer" onclick="openAiChangeDataSource()">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:28px">📋</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600" id="aiDsName">${aiSelectedMonitor?.name || '长安CS75Plus品牌传播监测'}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px" id="aiDsInfo">运行中 · 覆盖${aiSelectedMonitor?.platform?.length || 8}个平台 · ${aiSelectedMonitor?.dataCount?.toLocaleString() || '15,632'}条数据</div>
          <div style="display:flex;gap:4px;margin-top:6px" id="aiDsPlatforms">
            ${(aiSelectedMonitor?.platform || ['抖音','微博','小红书','汽车之家']).slice(0,5).map(p => `<span class="tag tag-gray" style="font-size:9px">${p}</span>`).join('')}
            <span class="tag tag-gray" style="font-size:9px">+${Math.max(0,(aiSelectedMonitor?.platform?.length || 8) - 5)}</span>
          </div>
        </div>
        <span style="color:var(--primary);font-size:12px">更换 ▼</span>
      </div>
    </div>
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:14px">
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">监测内容</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        <span class="tag tag-gray" style="font-size:10px">关键词监测</span>
        <span class="tag tag-gray" style="font-size:10px">账号监测</span>
        <span class="tag tag-gray" style="font-size:10px">竞品监测</span>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="aiConfirmStep()">✓ 确认数据源</button>
      <button class="btn btn-ghost btn-sm" onclick="openAiChangeDataSource()">更换数据源</button>
    </div>`;
}

function openAiChangeDataSource() {
  openModal('选择监测数据源', `
    <div style="margin-bottom:12px">
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <input class="form-input" type="text" placeholder="搜索监测项目..." style="flex:1;font-size:12px" id="aiDsSearch" oninput="filterAiDataSource(this.value)">
        <select class="form-input" style="width:100px;font-size:12px" onchange="filterAiDsStatus(this.value)">
          <option value="all">全部</option>
          <option value="running">运行中</option>
          <option value="paused">已暂停</option>
        </select>
      </div>
    </div>
    <div style="max-height:320px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead style="position:sticky;top:0;z-index:1;background:var(--bg-card3)">
          <tr>
            <th style="padding:8px 10px;text-align:left;width:36px"></th>
            <th style="padding:8px 10px;text-align:left">监测项目</th>
            <th style="padding:8px 10px;text-align:center;width:60px">状态</th>
            <th style="padding:8px 10px;text-align:center;width:70px">数据量</th>
          </tr>
        </thead>
        <tbody id="aiDsTableBody">
          ${mockMonitorProjects.map((p, i) => `
            <tr class="ai-ds-row" data-id="${p.id}" data-name="${p.name.toLowerCase()}" data-status="${p.status}" onclick="selectAiDsRow('${p.id}', this)" style="cursor:pointer;background:${i===0?'var(--primary-bg)':'transparent'}">
              <td style="padding:8px 10px"><input type="radio" name="aiDsRadio" ${i===0?'checked':''} onclick="event.stopPropagation();selectAiDsRow('${p.id}', this.closest('tr'))"></td>
              <td style="padding:8px 10px">
                <div style="font-weight:500">${p.name}</div>
                <div style="font-size:10px;color:var(--text-muted)">${p.platform.slice(0,3).join(', ')}${p.platform.length>3?'...':''}</div>
              </td>
              <td style="padding:8px 10px;text-align:center"><span class="tag ${p.status==='running'?'tag-green':p.status==='paused'?'tag-orange':'tag-red'}" style="font-size:10px">${p.status==='running'?'运行中':p.status==='paused'?'已暂停':'异常'}</span></td>
              <td style="padding:8px 10px;text-align:center;font-size:11px">${p.dataCount.toLocaleString()}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmAiDsChange()">确认</button>
  `, 580);
}

function selectAiDsRow(id, row) {
  aiSelectedMonitor = mockMonitorProjects.find(p => p.id === id);
  document.querySelectorAll('.ai-ds-row').forEach(r => r.style.background = 'transparent');
  row.style.background = 'var(--primary-bg)';
  row.querySelector('input[type=radio]').checked = true;
}

function filterAiDataSource(q) {
  document.querySelectorAll('.ai-ds-row').forEach(row => {
    row.style.display = row.dataset.name.includes(q.toLowerCase()) ? '' : 'none';
  });
}

function filterAiDsStatus(status) {
  document.querySelectorAll('.ai-ds-row').forEach(row => {
    row.style.display = status === 'all' || row.dataset.status === status ? '' : 'none';
  });
}

function confirmAiDsChange() {
  if (aiSelectedMonitor) {
    const nameEl = document.getElementById('aiDsName');
    const infoEl = document.getElementById('aiDsInfo');
    const platEl = document.getElementById('aiDsPlatforms');
    if (nameEl) nameEl.textContent = aiSelectedMonitor.name;
    if (infoEl) infoEl.textContent = `${aiSelectedMonitor.status==='running'?'运行中':'已暂停'} · 覆盖${aiSelectedMonitor.platform.length}个平台 · ${aiSelectedMonitor.dataCount.toLocaleString()}条数据`;
    if (platEl) {
      platEl.innerHTML = aiSelectedMonitor.platform.slice(0,5).map(p => `<span class="tag tag-gray" style="font-size:9px">${p}</span>`).join('') + 
        `<span class="tag tag-gray" style="font-size:9px">+${Math.max(0,aiSelectedMonitor.platform.length-5)}</span>`;
    }
  }
  closeModal();
}

// 第2轮：选择报告模板（互换后）
function getAiRound2_Template() {
  return `
    <div style="margin-bottom:12px;font-weight:600">选择<strong>报告模板</strong>（第2/6步）：</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      ${[
        { name: '品牌传播周报标准模板', scene: '日常例行传播', match: '97%', selected: true },
        { name: '品牌综合传播分析模板', scene: '正面宣传复盘', match: '85%', selected: false },
        { name: '舆情分析专项模板', scene: '负面舆情专项', match: '72%', selected: false },
        { name: '竞品对标分析模板', scene: '竞品对比', match: '68%', selected: false },
      ].map((t, i) => `
        <div style="border:2px solid ${t.selected ? 'var(--primary)' : 'var(--border)'};border-radius:8px;padding:12px;cursor:pointer;background:${t.selected ? 'var(--primary-bg)' : 'var(--bg-card)'}" onclick="selectAiTemplateCard(this, ${i})">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:20px">📊</span>
            <div style="flex:1">
              <div style="font-size:12px;font-weight:600">${t.name}</div>
              <div style="font-size:10px;color:var(--text-muted)">${t.scene}</div>
            </div>
            ${t.selected ? '<span style="color:var(--primary)">●</span>' : ''}
          </div>
          <div style="font-size:10px;color:var(--success)">AI匹配度 ${t.match}</div>
        </div>`).join('')}
    </div>
    <div style="background:var(--info-bg);border:1px solid var(--info-border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--info);margin-bottom:14px">
      💡 点击模板卡片可切换，模板决定报告的结构和可视化样式
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="aiConfirmStep()">✓ 确认此模板</button>
      <button class="btn btn-ghost btn-sm" onclick="openModal('选择模板',renderTemplatePicker(),'<button class=\\'btn btn-ghost\\' onclick=\\'closeModal()\\'>关闭</button>',700)">浏览全部模板</button>
    </div>`;
}

function openChangeDataSourceModal() {
  openModal('更换监测数据源', `
    <div style="margin-bottom:12px">
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <input type="text" placeholder="搜索监测项目..." style="flex:1;font-size:12px" id="aiDsSearch" oninput="filterAiDataSource(this.value)">
        <select class="form-input" style="width:100px;font-size:12px" onchange="filterAiDsStatus(this.value)">
          <option value="all">全部</option>
          <option value="running">运行中</option>
          <option value="paused">已暂停</option>
        </select>
      </div>
    </div>
    <div style="max-height:320px;overflow-y:auto;border:1px solid var(--border);border-radius:8px">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead style="position:sticky;top:0;z-index:1;background:var(--bg-card3)">
          <tr>
            <th style="padding:8px 10px;text-align:left;width:36px"></th>
            <th style="padding:8px 10px;text-align:left">监测项目</th>
            <th style="padding:8px 10px;text-align:center;width:60px">状态</th>
            <th style="padding:8px 10px;text-align:center;width:70px">数据量</th>
          </tr>
        </thead>
        <tbody id="aiDsTableBody">
          ${mockMonitorProjects.map((p, i) => `
            <tr class="ai-ds-row" data-id="${p.id}" data-name="${p.name.toLowerCase()}" data-status="${p.status}" onclick="selectAiDsRow('${p.id}', this)" style="cursor:pointer;background:${i===0?'var(--primary-bg)':'transparent'}">
              <td style="padding:8px 10px"><input type="radio" name="aiDsRadio" ${i===0?'checked':''} onclick="event.stopPropagation();selectAiDsRow('${p.id}', this.closest('tr'))"></td>
              <td style="padding:8px 10px">
                <div style="font-weight:500">${p.name}</div>
                <div style="font-size:10px;color:var(--text-muted)">${p.platform.slice(0,3).join(', ')}${p.platform.length>3?'...':''}</div>
              </td>
              <td style="padding:8px 10px;text-align:center"><span class="tag ${p.status==='running'?'tag-green':p.status==='paused'?'tag-orange':'tag-red'}" style="font-size:10px">${p.status==='running'?'运行中':p.status==='paused'?'已暂停':'异常'}</span></td>
              <td style="padding:8px 10px;text-align:center;font-size:11px">${p.dataCount.toLocaleString()}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmAiDsChange()">确认</button>
  `, 580);
}

let currentSelectedDsId = mockMonitorProjects[0]?.id || 'M001';

function selectDataSourceRow(id, row) {
  currentSelectedDsId = id;
  const project = mockMonitorProjects.find(p => p.id === id);
  if (!project) return;
  
  // 更新选中状态
  document.querySelectorAll('.data-source-row').forEach(r => {
    r.style.background = 'transparent';
    const radio = r.querySelector('input[type=radio]');
    if (radio) radio.checked = false;
  });
  row.style.background = 'var(--primary-bg)';
  const radio = row.querySelector('input[type=radio]');
  if (radio) radio.checked = true;
  
  // 更新预览
  document.getElementById('selectedDsName').textContent = project.name;
  document.getElementById('selectedDsInfo').textContent = `${project.status==='running'?'运行中':'已暂停'} · 覆盖${project.platform.length}个平台 · ${project.dataCount.toLocaleString()}条数据`;
}

function filterDataSourceTable(searchText) {
  const rows = document.querySelectorAll('.data-source-row');
  const q = searchText.toLowerCase();
  rows.forEach(row => {
    const name = row.dataset.name || '';
    row.style.display = name.includes(q) ? '' : 'none';
  });
}

function filterDataSourceStatus(status) {
  const rows = document.querySelectorAll('.data-source-row');
  rows.forEach(row => {
    const s = row.dataset.status || '';
    row.style.display = status === 'all' || s === status ? '' : 'none';
  });
}

function previewDataSourceChange(projectId) {
  const project = mockMonitorProjects.find(p => p.id === projectId);
  if (!project) return;
  const preview = document.getElementById('changeDataSourcePreview');
  if (preview) {
    preview.innerHTML = `
      <div style="font-size:12px;font-weight:600;margin-bottom:6px">${project.name}</div>
      <div style="font-size:11px;color:var(--text-muted)">${project.status==='running'?'运行中':'已暂停'} · 覆盖${project.platform.length}个平台 · ${project.dataCount.toLocaleString()}条数据</div>
    `;
  }
}

function confirmDataSourceChange() {
  const project = mockMonitorProjects.find(p => p.id === currentSelectedDsId);
  if (!project) return;
  
  // 更新选中显示
  const nameEl = document.getElementById('aiDataSourceName');
  const infoEl = document.getElementById('aiDataSourceInfo');
  const platformEl = document.getElementById('aiDataSourcePlatform');
  
  if (nameEl) nameEl.textContent = project.name;
  if (infoEl) infoEl.textContent = `${project.status==='running'?'运行中':'已暂停'} · 覆盖${project.platform.length}个平台 · ${project.dataCount.toLocaleString()}条数据`;
  if (platformEl) {
    platformEl.innerHTML = project.platform.map(pl => `<span class="tag tag-gray" style="font-size:9px">${pl}</span>`).join('') + 
      `<span class="tag tag-gray" style="font-size:9px">+${Math.max(0, 8 - project.platform.length)}</span>`;
  }
  
  closeModal();
  showToast('数据源已更换', 'success');
}

// 第4轮：确认刷新设置
function getAiRound4_Refresh() {
  return `
    <div style="margin-bottom:12px;font-weight:600">配置<strong>互动量与评论刷新规则</strong>：</div>
    
    <!-- 互动量刷新 -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:13px;font-weight:600">📊 互动量刷新</div>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <span style="font-size:11px;color:var(--text-muted)">关闭</span>
          <input type="checkbox" id="aiRefreshToggle" checked onchange="toggleAiRefreshConfig(this.checked)" style="width:36px;height:20px;accent-color:var(--primary)">
          <span style="font-size:11px;color:var(--success)">开启</span>
        </label>
      </div>
      <div id="aiRefreshConfig">
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">刷新周期</div>
        <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
          <div onclick="setAiRefreshInterval(this, '30m')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">30分钟</div>
          <div onclick="setAiRefreshInterval(this, '1h')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">1小时</div>
          <div onclick="setAiRefreshInterval(this, '6h')" style="padding:6px 10px;border:2px solid var(--primary);border-radius:6px;font-size:11px;cursor:pointer;background:var(--primary-bg)" id="aiRef6h">6小时</div>
          <div onclick="setAiRefreshInterval(this, '12h')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">12小时</div>
          <div onclick="setAiRefreshInterval(this, '24h')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">24小时</div>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">媒体范围</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${['抖音','快手','微博','小红书'].map(p => `<span class="tag tag-gray active" style="font-size:10px;cursor:pointer" onclick="this.classList.toggle('active')">${p}</span>`).join('')}
          <span class="tag tag-gray" style="font-size:10px;cursor:pointer" onclick="this.classList.toggle('active')">全选</span>
        </div>
      </div>
    </div>
    
    <!-- 评论刷新 -->
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:13px;font-weight:600">💬 评论刷新</div>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <span style="font-size:11px;color:var(--text-muted)">关闭</span>
          <input type="checkbox" id="aiCommentToggle" onchange="toggleAiCommentConfig(this.checked)" style="width:36px;height:20px;accent-color:var(--primary)">
          <span style="font-size:11px;color:var(--success)">开启</span>
        </label>
      </div>
      <div id="aiCommentConfig" style="opacity:0.4;pointer-events:none">
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">刷新周期</div>
        <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
          <div onclick="setAiCommentInterval(this, '1h')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">1小时</div>
          <div onclick="setAiCommentInterval(this, '6h')" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:pointer;background:var(--bg-card)">6小时</div>
          <div onclick="setAiCommentInterval(this, '24h')" style="padding:6px 10px;border:2px solid var(--primary);border-radius:6px;font-size:11px;cursor:pointer;background:var(--primary-bg)">24小时</div>
        </div>
      </div>
    </div>
    
    <div style="background:var(--info-bg);border:1px solid var(--info-border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--info);margin-bottom:14px">
      💡 关闭刷新可节省API调用消耗，数据将保持首次采集状态
    </div>
    
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="aiConfirmStep()">✓ 确认刷新设置</button>
      <button class="btn btn-ghost btn-sm" onclick="openAiRefreshAdvanced()">高级配置</button>
    </div>`;
}

function toggleAiRefreshConfig(checked) {
  const config = document.getElementById('aiRefreshConfig');
  const toggle = document.getElementById('aiRefreshToggle');
  aiRefreshEnabled = checked;
  if (config) {
    config.style.opacity = checked ? '1' : '0.4';
    config.style.pointerEvents = checked ? 'auto' : 'none';
  }
}

function toggleAiCommentConfig(checked) {
  const config = document.getElementById('aiCommentConfig');
  aiCommentEnabled = checked;
  if (config) {
    config.style.opacity = checked ? '1' : '0.4';
    config.style.pointerEvents = checked ? 'auto' : 'none';
  }
}

function setAiRefreshInterval(el, interval) {
  aiRefreshInterval = interval;
  document.querySelectorAll('#aiRefreshConfig > div:nth-child(2) > div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--primary)';
  el.style.background = 'var(--primary-bg)';
}

function setAiCommentInterval(el, interval) {
  aiCommentInterval = interval;
  document.querySelectorAll('#aiCommentConfig > div:nth-child(2) > div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--primary)';
  el.style.background = 'var(--primary-bg)';
}

function openAiRefreshAdvanced() {
  showToast('高级配置功能开发中', 'info');
}

// 第5轮：确认发送设置
function getAiRound5_SendSettings() {
  return `
    <div style="margin-bottom:12px;font-weight:600">配置<strong>报告发送设置</strong>：</div>
    
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px">
      <div class="form-group" style="margin-bottom:12px">
        <label class="form-label">发送时间</label>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="color:var(--text-muted);font-size:12px">报告生成后</span>
          <input class="form-input" type="number" value="1" min="0" max="168" style="width:60px;font-size:12px" id="aiSendDelayH">
          <span style="color:var(--text-muted);font-size:12px">小时</span>
          <input class="form-input" type="number" value="0" min="0" max="59" style="width:60px;font-size:12px" id="aiSendDelayM">
          <span style="color:var(--text-muted);font-size:12px">分钟发送</span>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:12px">
        <label class="form-label">发送方式</label>
        <div style="display:flex;gap:8px">
          <div onclick="selectAiSendMethod('dingtalk', this)" style="flex:1;padding:8px;border:2px solid var(--primary);border-radius:6px;cursor:pointer;background:var(--primary-bg);text-align:center" id="aiSendDingtalk">
            <div style="font-size:14px;margin-bottom:2px">💬</div>
            <div style="font-size:11px;font-weight:500">钉钉通知</div>
          </div>
          <div onclick="selectAiSendMethod('webhook', this)" style="flex:1;padding:8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:var(--bg-card);text-align:center">
            <div style="font-size:14px;margin-bottom:2px">🤖</div>
            <div style="font-size:11px;font-weight:500">群机器人</div>
          </div>
          <div onclick="selectAiSendMethod('both', this)" style="flex:1;padding:8px;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:var(--bg-card);text-align:center">
            <div style="font-size:14px;margin-bottom:2px">🔔</div>
            <div style="font-size:11px;font-weight:500">两者都要</div>
          </div>
        </div>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">通知接收人</label>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          <span class="tag tag-primary" style="cursor:pointer" onclick="this.remove()">张三 ×</span>
          <span class="tag tag-primary" style="cursor:pointer" onclick="this.remove()">李四 ×</span>
          <span class="tag tag-gray" style="cursor:pointer" onclick="addAiReceiver()">+ 添加</span>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label class="form-label">任务有效期</label>
      <input class="form-input" type="date" value="2026-12-31" style="font-size:12px">
    </div>
    
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-primary btn-sm" onclick="aiConfirmStep()">✓ 确认发送设置</button>
      <button class="btn btn-ghost btn-sm" onclick="openAiSendAdvanced()">跳过发送</button>
    </div>`;
}

let aiSendMethod = 'dingtalk';

function selectAiSendMethod(method, el) {
  aiSendMethod = method;
  el.parentElement.querySelectorAll('div').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--primary)';
  el.style.background = 'var(--primary-bg)';
}

function addAiReceiver() {
  const name = prompt('请输入接收人姓名：');
  if (name) {
    const container = document.querySelector('.tag.tag-primary:last-of-type')?.parentElement;
    if (container) {
      const newTag = document.createElement('span');
      newTag.className = 'tag tag-primary';
      newTag.style.cssText = 'cursor:pointer';
      newTag.innerHTML = name + ' ×';
      newTag.onclick = function() { this.remove(); };
      container.insertBefore(newTag, container.lastElementChild);
    }
  }
}

function openAiSendAdvanced() {
  showToast('已跳过发送设置，报告生成后将保存在报告管理中', 'info');
}

// 第6轮：确认分析维度
function getAiRound6_Dimensions() {
  const dimensions = [
    { name: '总声量传播趋势', desc: '展示品牌声量的时间变化趋势', checked: true },
    { name: '平台声量分布', desc: '各平台声量占比与对比', checked: true },
    { name: '情感倾向分析', desc: '正面/负面/中性情感占比', checked: true },
    { name: '核心传播内容TOP10', desc: '热度最高的传播内容排行', checked: true },
    { name: '互动效果分析', desc: '点赞/评论/转发等互动数据', checked: true },
    { name: '核心KOL传播贡献', desc: 'KOL账号传播影响力分析', checked: true },
    { name: '观点词云分析', desc: '用户观点高频词云展示', checked: true },
    { name: '下周传播建议', desc: 'AI生成的优化建议', checked: true },
  ];
  
  return `
    <div style="margin-bottom:12px;font-weight:600">确认<strong>核心分析维度</strong>（共${dimensions.filter(d=>d.checked).length}个）：</div>
    <div id="aiDimensionList" style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${dimensions.map((d, i) => `
        <div style="display:flex;align-items:center;gap:10px;font-size:12px;padding:10px 12px;border-radius:6px;background:var(--bg-card2)">
          <input type="checkbox" id="aiDim_${i}" ${d.checked?'checked':''} onchange="toggleAiDimension(${i}, this.checked)" style="accent-color:var(--primary)">
          <span style="flex:1;font-weight:500">${d.name}</span>
          <span style="font-size:10px;color:var(--text-muted)">${d.desc}</span>
        </div>`).join('')}
    </div>
    <div style="background:var(--info-bg);border:1px solid var(--info-border);border-radius:6px;padding:8px 10px;font-size:11px;color:var(--info);margin-bottom:14px">
      💡 可勾选需要的分析维度，至少选择2个维度
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="aiStartGenerate()">🚀 开始生成报告</button>
      <button class="btn btn-ghost btn-sm" onclick="openAiAddDimension()">+ 添加维度</button>
    </div>`;
}

function toggleAiDimension(index, checked) {
  // 记录维度切换
}

function openAiAddDimension() {
  showToast('维度库功能开发中', 'info');
}

// 最终响应：生成报告
function getAiFinalResponse() {
  return `
    <div style="margin-bottom:10px;font-weight:600">✅ 配置确认完成，正在生成报告...</div>
    <div style="margin-bottom:14px">
      <div class="progress-steps">
        ${['拉取监测数据','渲染图表','AI智能分析','拼接报告内容','渲染预览效果'].map((s, i) => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12px">
            <div style="width:18px;height:18px;border-radius:50%;background:${i < 3 ? 'var(--success)' : i === 3 ? 'var(--primary)' : 'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-size:10px">
              ${i < 3 ? '✓' : i === 3 ? '…' : ''}
            </div>
            <span style="color:${i < 3 ? 'var(--text-muted)' : i === 3 ? 'var(--primary)' : 'var(--text-muted)'}">${s}</span>
          </div>`).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="openPreviewReportModal()">查看预览报告</button>
    </div>`;
}

function openEditDimensionModal(index, name, desc) {
  openModal('编辑维度', `
    <div class="form-group">
      <label class="form-label required">维度名称</label>
      <input class="form-input" id="editDimName" value="${name}">
    </div>
    <div class="form-group">
      <label class="form-label">维度描述</label>
      <textarea class="form-input" id="editDimDesc" rows="2" style="resize:none">${desc}</textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-danger btn-sm" onclick="removeDimension(${index})" style="margin-left:auto">删除此维度</button>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="saveDimensionEdit(${index})">保存</button>
  `, 460);
}

function saveDimensionEdit(index) {
  const name = document.getElementById('editDimName').value.trim();
  if (!name) {
    showToast('维度名称不能为空', 'error');
    return;
  }
  closeModal();
  showToast('维度已保存', 'success');
  // 刷新维度列表
  const area = document.getElementById('dimensionList');
  if (area) {
    area.innerHTML = ''; // 触发重新渲染
  }
}

function removeDimension(index) {
  closeModal();
  showToast('维度已删除', 'success');
}

function toggleDimension(index, checked) {
  // 记录维度切换状态
}

function openModifyDimensionModal() {
  const allDimensions = [
    { name: '总声量传播趋势', desc: '展示品牌声量的时间变化趋势' },
    { name: '平台声量分布', desc: '各平台声量占比与对比' },
    { name: '情感倾向分析', desc: '正面/负面/中性情感占比' },
    { name: '核心传播内容TOP10', desc: '热度最高的传播内容排行' },
    { name: '互动效果分析', desc: '点赞/评论/转发等互动数据' },
    { name: '核心KOL传播贡献', desc: 'KOL账号传播影响力分析' },
    { name: '观点词云分析', desc: '用户观点高频词云展示' },
    { name: '下周传播建议', desc: 'AI生成的优化建议' },
    { name: '竞品对比分析', desc: '与竞品品牌的传播对比' },
    { name: '舆情风险预警', desc: '负面舆情风险提示' },
    { name: '传播峰值分析', desc: '声量峰值节点与原因' },
    { name: '内容类型分析', desc: '视频/图文/图文等类型分布' },
  ];
  
  openModal('修改分析维度', `
    <div style="max-height:400px;overflow-y:auto">
      ${allDimensions.map((d, i) => `
        <label style="display:flex;align-items:flex-start;gap:10px;padding:8px;border-radius:6px;cursor:pointer" onmouseover="this.style.background='var(--bg-card2)'" onmouseout="this.style.background='transparent'">
          <input type="checkbox" id="dim_${i}" ${d.name.includes('总声量')||d.name.includes('平台声量')||d.name.includes('情感')||d.name.includes('核心传播内容')||d.name.includes('互动效果')||d.name.includes('KOL')||d.name.includes('观点')||d.name.includes('建议')?'checked':''} style="accent-color:var(--primary);margin-top:2px">
          <div>
            <div style="font-size:12px;font-weight:500">${d.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${d.desc}</div>
          </div>
        </label>`).join('')}
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">取消</button>
    <button class="btn btn-primary" onclick="confirmDimensionChange()">确认修改</button>
  `, 480);
}

function confirmDimensionChange() {
  // 重新渲染维度列表
  const area = document.getElementById('dimensionList');
  if (!area) {
    closeModal();
    showToast('维度已更新', 'success');
    return;
  }
  
  const checked = area.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length < 2) {
    showToast('至少需要选择2个分析维度', 'error');
    return;
  }
  
  closeModal();
  showToast('分析维度已更新', 'success');
}

function aiConfirmStep() {
  sendAiMessage_auto('确认，继续');
}

function sendAiMessage_auto(text) {
  const input = document.getElementById('aiInput');
  if (input) input.value = text;
  sendAiMessage();
}

function selectAiTemplate(el) {
  el.parentElement.querySelectorAll('div[style*="border:2px"]').forEach(d => {
    d.style.borderColor = 'var(--border)';
    d.style.background = 'var(--bg-card)';
  });
  el.style.borderColor = 'var(--primary)';
  el.style.background = 'var(--primary-bg)';
}

function openAiEditModal() {
  openModal('修改报告基础信息', `
    <div class="form-group"><label class="form-label required">报告名称</label><input class="form-input" value="长安CS75Plus 品牌传播周报 2026-W14"></div>
    <div class="form-group"><label class="form-label required">报告类型</label>
      <div style="display:flex;gap:12px">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="radio" name="rtype" checked> 周期报告（例行）</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="radio" name="rtype"> 专项报告（单次）</label>
      </div>
    </div>
    <div class="form-group"><label class="form-label required">数据时间范围</label>
      <div style="display:flex;gap:8px"><input class="form-input" value="2026-04-06" type="date" style="flex:1"><span style="line-height:36px">至</span><input class="form-input" value="2026-04-12" type="date" style="flex:1"></div>
    </div>
    <div class="form-group"><label class="form-label">生成规则</label>
      <select class="form-input"><option>每周一 09:00</option><option>每月1日 09:00</option><option>每日 08:00</option></select>
    </div>
  `, `<button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="closeModal()">保存</button>`, 560);
}

function aiStartGenerate() {
  appendChatMsg('user', '确认所有设置，开始生成');
  aiCreateStep = 7; // 标记为最终生成
  appendAiThinking();
  setTimeout(() => {
    replaceThinkingWithMsg(getAiFinalResponse());
  }, 2000);
}

function openPreviewReportModal() {
  openModal('报告预览', `
    <div style="max-height:60vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#1a1d26 0%,#2c0f16 100%);padding:24px 32px;color:#fff;border-radius:8px;margin-bottom:16px">
        <div style="font-size:10px;color:rgba(255,255,255,0.5);letter-spacing:2px;margin-bottom:6px">BRAND INSIGHT REPORT</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:6px">长安CS75Plus 品牌传播周报</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5)">数据范围：2026.04.06 - 2026.04.12</div>
        <div style="display:flex;gap:16px;margin-top:14px;flex-wrap:wrap">
          <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#E57381">89,420</div><div style="font-size:10px;color:rgba(255,255,255,0.5)">总声量</div></div>
          <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#86EFAC">68%</div><div style="font-size:10px;color:rgba(255,255,255,0.5)">正面率</div></div>
          <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#93C5FD">234,600</div><div style="font-size:10px;color:rgba(255,255,255,0.5)">互动量</div></div>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
        <div style="padding:12px 16px;background:var(--bg-card2);border-bottom:1px solid var(--border);font-size:12px;font-weight:600">报告目录</div>
        <div style="padding:8px 0">
          ${['01 总声量传播趋势分析','02 平台声量分布概览','03 情感倾向分析','04 核心传播内容TOP10','05 互动效果分析','06 主要KOL传播贡献','07 观点词云分析','08 下周传播建议'].map(s => `
            <div style="padding:6px 16px;font-size:11px;color:var(--text-secondary)">${s}</div>`).join('')}
        </div>
      </div>
      <div style="text-align:center;padding:16px;color:var(--text-muted);font-size:11px">预览版含部分章节，正式版可查看完整报告</div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal();returnToChatAndAdjust()">💬 返回对话继续调整</button>
    <button class="btn btn-primary" onclick="closeModal();showPage('report-preview',{reportId:'RPT_NEW',isNew:true})">查看完整报告</button>
  `, 600);
}

function returnToChatAndAdjust() {
  // 返回到AI对话页面，保留之前的对话历史
  showToast('已返回对话页面，可以继续调整报告配置', 'info');
  // 滚动到对话底部
  const chatArea = document.getElementById('aiChatHistory');
  if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
}

function renderTemplatePicker() {
  return `
    <div style="padding:4px 0">
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <div class="topbar-search" style="flex:1"><svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg><input type="text" placeholder="搜索模板名称..."></div>
        <select class="filter-select">全部<option>专项报告模板</option><option>周期报告模板</option></select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${mockTemplates.filter(t => t.status === 'published').map(t => `
          <div class="card card-clickable" style="padding:14px" onclick="closeModal();showToast('已选择模板：${t.name}')">
            <div style="font-size:28px;margin-bottom:8px">${t.thumb}</div>
            <div style="font-size:12px;font-weight:600;margin-bottom:4px">${t.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${t.scene} · ${t.version}</div>
          </div>`).join('')}
      </div>
    </div>`;
}
