// ===================== 智能报告 - 报告预览页面 =====================

// 状态配置
const reportStatusConfig = {
  done:     { label: '已完成', tagClass: 'tag-green' },
  published:{ label: '已发布', tagClass: 'tag-green' },
  running:  { label: '进行中', tagClass: 'tag-blue' },
  draft:    { label: '草稿', tagClass: 'tag-orange' },
  archived: { label: '已归档', tagClass: 'tag-gray' },
  pending:  { label: '待生成', tagClass: 'tag-gray' },
};

pageRenderers['report-preview'] = () => {
  const rId = currentContext.reportId || 'RPT001';
  const r = mockReports ? mockReports.find(x => x.id === rId) : null;
  const rName = r ? r.name : '长安CS75Plus 品牌传播周报（第14周）';
  const isArchived = r && r.status === 'archived';
  const isFromAI = currentContext.isPreview === true || currentContext.isNew === true;

  return `
<div style="display:flex;flex-direction:column;height:calc(100vh - 56px - 32px)">
  <!-- 顶部固定操作栏 -->
  <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 20px;margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-shrink:0">
    ${isFromAI ? `
    <button class="btn btn-secondary btn-sm" onclick="returnToAiChat()" style="background:var(--primary-bg);color:var(--primary);border-color:var(--primary-border)">
      <svg viewBox="0 0 16 16" width="13" height="13"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      返回对话
    </button>` : `
    <button class="btn btn-ghost btn-sm" onclick="showPage('report-list')">
      <svg viewBox="0 0 16 16" width="13" height="13"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      返回列表
    </button>`}
    <div style="flex:1;font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${rName}</div>
    <div style="display:flex;gap:8px;flex-shrink:0">
      ${!isArchived ? `<button class="btn btn-ghost btn-sm" onclick="showPage('report-edit',{reportId:'${rId}'})">编辑</button>` : ''}
      <button class="btn btn-ghost btn-sm" onclick="downloadReport('${rId}')">下载</button>
      <button class="btn btn-ghost btn-sm" onclick="shareReport('${rId}')">分享</button>
      <button class="btn btn-ghost btn-sm" onclick="printReport()">打印</button>
      <div class="dropdown-wrap">
        <button class="btn btn-ghost btn-sm" id="zoomBtn">100%</button>
      </div>
    </div>
  </div>

  <!-- 主体：目录 + 报告内容 -->
  <div style="display:flex;gap:14px;flex:1;overflow:hidden">
    <!-- 左侧目录 -->
    <div style="width:180px;flex-shrink:0;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;overflow-y:auto">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:1px;margin-bottom:10px">目录</div>
      ${['执行摘要','01 总声量传播趋势','02 平台声量分布','03 情感倾向分析','04 核心传播内容','05 互动效果分析','06 KOL传播贡献','07 观点词云分析','08 下周传播建议'].map((s, i) => `
        <div onclick="scrollToSection(${i})" style="padding:6px 8px;border-radius:5px;cursor:pointer;font-size:11px;color:var(--text-secondary);margin-bottom:2px;transition:all 0.15s" class="toc-item" data-sec="${i}"
          onmouseover="this.style.background='var(--bg-card3)'" onmouseout="this.style.background='transparent'">${s}</div>`).join('')}
    </div>

    <!-- 右侧报告内容 -->
    <div style="flex:1;overflow-y:auto;background:var(--bg-card);border:1px solid var(--border);border-radius:10px" id="reportPreviewContent">
      ${renderReportContent(rName)}
    </div>
  </div>
</div>`;
};

function renderReportContent(rName) {
  return `
  <!-- 封面 -->
  <div id="sec-0" style="background:linear-gradient(135deg,#0f1117 0%,#1a0a0f 50%,#250d14 100%);padding:48px 56px;color:#fff;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(217,63,74,0.2),transparent 60%);pointer-events:none"></div>
    <div style="position:relative">
      <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-bottom:16px">品牌传播监测洞察平台 · BRAND INSIGHT REPORT</div>
      <div style="font-size:28px;font-weight:700;margin-bottom:8px;line-height:1.3">${rName}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:32px">数据范围：2026.03.31 - 2026.04.06 · 生成时间：2026-04-07 09:00</div>

      <!-- KPI一栏 -->
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        ${[['本周总声量','89,420 条','↑12.3%'],['正面情感占比','68%','↑3.2%'],['总互动量','234.6万','↑18.7%'],['新增内容量','3,248 条','↑8.5%']].map(([l,v,c]) => `
          <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 18px;min-width:140px">
            <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:4px">${l}</div>
            <div style="font-size:20px;font-weight:700">${v}</div>
            <div style="font-size:11px;color:#86EFAC">${c}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- 正文 -->
  <div style="padding:32px 40px">

    <!-- 执行摘要 -->
    <div style="background:var(--primary-bg);border-left:4px solid var(--primary);border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px">
      <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:8px">📋 执行摘要</div>
      <div style="font-size:12px;line-height:1.9;color:var(--text-secondary)">
        本周（4.1-4.7）长安CS75PLUS全平台传播声量 <strong>89,420</strong> 条，环比上周 <strong style="color:var(--success)">↑12.3%</strong>，正面情感占比 68%，整体表现优异。<br>
        重点：① 抖音评测内容引爆传播高峰；② 小红书种草内容互动率创历史新高；③ 销量破3万辆的相关报道持续发酵。<br>
        风险：导航系统负面评价有所上升，建议关注。
      </div>
    </div>

    <!-- 第1章 -->
    <div id="sec-1" style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">01</span>
        总声量传播趋势分析
      </div>
      <div id="reportChart1" style="height:220px;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px"></div>
      <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;margin-top:12px;font-size:12px;line-height:1.8;color:var(--text-secondary)">
        <strong style="color:var(--primary)">AI智能分析：</strong>本周声量峰值出现在周三4月3日（18,420条），受「蓝鲸杯最佳SUV」话题引爆，同日抖音相关视频累计播放量突破5000万。整体传播呈现「平日低位→事件引爆→快速回落」的典型波动特征。建议持续关注行业热点，提前布局事件借势传播内容。
      </div>
    </div>

    <!-- 第2章 -->
    <div id="sec-2" style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">02</span>
        平台声量分布概览
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
        ${[['🎵 抖音','34.2%','30,562','↑8.5%','var(--primary)'],['📱 微博','22.1%','19,758','↑5.2%','var(--info)'],['📕 小红书','18.6%','16,631','↑22.4%','var(--success)'],['🚗 汽车之家','12.3%','11,000','↓2.1%','var(--warning)']].map(([p,pct,cnt,chg,clr]) => `
          <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${p}</div>
            <div style="font-size:22px;font-weight:700;color:${clr}">${pct}</div>
            <div style="font-size:11px;color:var(--text-secondary)">${cnt} 条</div>
            <div style="font-size:11px;color:${chg.startsWith('↑') ? 'var(--success)' : 'var(--danger)'}">${chg} vs上周</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 第3章 -->
    <div id="sec-3" style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">03</span>
        情感倾向分析
      </div>
      <div id="reportChart3" style="height:200px;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;margin-bottom:12px"></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${[['正面','68%','60,406','外观/性能/性价比'],['中性','20%','17,884','资讯/发布/活动'],['负面','12%','10,730','系统/服务/品控']].map(([s,pct,cnt,tags]) => `
          <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span class="node-${s === '正面' ? 'positive' : s === '负面' ? 'negative' : 'neutral'}">${s}</span>
              <span style="font-size:18px;font-weight:700">${pct}</span>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">${cnt} 条</div>
            <div style="font-size:10px;color:var(--text-muted)">${tags}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- 第4章 -->
    <div id="sec-4" style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">04</span>
        核心传播内容 TOP10
      </div>
      <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;overflow:hidden">
        <table style="width:100%;font-size:11px;border-collapse:collapse">
          <thead><tr style="background:var(--bg-card3)">
            <th style="padding:8px 12px;text-align:left;width:30px;color:var(--text-muted)">#</th>
            <th style="padding:8px 12px;text-align:left;color:var(--text-muted)">标题</th>
            <th style="padding:8px 12px;text-align:center;color:var(--text-muted)">平台</th>
            <th style="padding:8px 12px;text-align:right;color:var(--text-muted)">互动量</th>
            <th style="padding:8px 12px;text-align:center;color:var(--text-muted)">情感</th>
          </tr></thead>
          <tbody>
            ${[
              ['长安CS75 PLUS赛博格全新亮相，外观设计大幅升级引发热议','抖音','138.5万','正面'],
              ['【深度测评】CS75 PLUS vs 途观L 到底谁更值得买？','汽车之家','92.8万','正面'],
              ['销量喜人！长安CS75系列3月份销售破3.2万辆创历史新高','今日头条','72.1万','正面'],
              ['小红书KOL种草视频：CS75 PLUS内饰全升级，女生也爱了！','小红书','61.3万','正面'],
              ['长安CS75PLUS车主吐槽：导航系统频繁卡顿，官方至今没解决','微博','47.2万','负面'],
            ].map(([title, plat, interact, sent], i) => `
              <tr style="border-top:1px solid var(--border)">
                <td style="padding:8px 12px;color:var(--text-muted);font-weight:600">${i+1}</td>
                <td style="padding:8px 12px;color:var(--text-primary);max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${title}</td>
                <td style="padding:8px 12px;text-align:center"><span class="tag tag-gray" style="font-size:9px">${plat}</span></td>
                <td style="padding:8px 12px;text-align:right;font-weight:600;color:var(--primary)">${interact}</td>
                <td style="padding:8px 12px;text-align:center"><span class="node-${sent === '正面' ? 'positive' : 'negative'}">${sent}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 第8章：下周建议 -->
    <div id="sec-8" style="margin-bottom:28px">
      <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
        <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">08</span>
        下周传播优化建议
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[
          ['🎯 抢占热点机会','4月15日将迎来年度车型评选结果公布，建议提前布局相关话题内容，预计可带来额外1.5-2万条声量增量。','建议立即执行'],
          ['⚠️ 负面舆情管控','导航卡顿负面评价近3天增长23.4%，建议官方账号主动出面回应，发布系统升级路线图，降低负面传播扩散。','重点关注'],
          ['💡 内容投放优化','小红书互动率本周创历史新高（8.9%），建议加大种草内容投入，重点布局女性用户圈层，扩大口碑辐射范围。','持续跟进'],
        ].map(([icon, desc, badge]) => `
          <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;gap:12px">
            <div style="font-size:20px;flex-shrink:0">${icon.substring(0,2)}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:var(--text-primary)">${icon.substring(3)}</div>
              <div style="font-size:12px;line-height:1.7;color:var(--text-secondary)">${desc}</div>
            </div>
            <span class="tag tag-primary" style="font-size:10px;height:fit-content;flex-shrink:0">${badge}</span>
          </div>`).join('')}
      </div>
    </div>

    <div style="text-align:center;padding:16px;color:var(--text-muted);font-size:11px;border-top:1px solid var(--border)">
      本报告由品牌传播监测洞察平台 AI 自动生成 · 生成时间：2026-04-07 09:00:00
    </div>
  </div>`;
}

pageInits['report-preview'] = () => {
  setTimeout(() => {
    initPreviewCharts();
  }, 100);
};

function initPreviewCharts() {
  const el1 = document.getElementById('reportChart1') || document.getElementById('previewChart1');
  if (el1 && typeof echarts !== 'undefined') {
    const chart1 = echarts.init(el1);
    chart1.setOption({
      grid: { top: 20, right: 20, bottom: 30, left: 50 },
      xAxis: { type: 'category', data: ['4/1','4/2','4/3','4/4','4/5','4/6','4/7'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{
        type: 'line', data: [9800, 11200, 18420, 12600, 10300, 9800, 8720],
        smooth: true, lineStyle: { color: '#D93F4A', width: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(217,63,74,0.3)' }, { offset: 1, color: 'rgba(217,63,74,0.0)' }] } },
        itemStyle: { color: '#D93F4A' },
      }],
      tooltip: { trigger: 'axis' }
    });
  }

  const el3 = document.getElementById('reportChart3');
  if (el3 && typeof echarts !== 'undefined') {
    const chart3 = echarts.init(el3);
    chart3.setOption({
      legend: { bottom: 0, textStyle: { fontSize: 10 } },
      series: [{
        type: 'pie', radius: ['40%', '65%'],
        data: [
          { value: 68, name: '正面', itemStyle: { color: '#22C870' } },
          { value: 20, name: '中性', itemStyle: { color: '#8B919D' } },
          { value: 12, name: '负面', itemStyle: { color: '#D93F4A' } },
        ],
        label: { formatter: '{b}: {d}%', fontSize: 11 }
      }],
      tooltip: { trigger: 'item' }
    });
  }
}

function scrollToSection(i) {
  const el = document.getElementById('sec-' + i);
  const container = document.getElementById('reportPreviewContent');
  if (el && container) {
    container.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
  }
}

function shareReport(id) {
  openModal('分享报告', `
    <div class="tab-bar mb-16">
      <div class="tab-item active">链接分享</div>
      <div class="tab-item">微信分享</div>
      <div class="tab-item">钉钉分享</div>
    </div>
    <div class="form-group">
      <label class="form-label">分享链接</label>
      <div style="display:flex;gap:8px">
        <input class="form-input" value="https://insight.example.com/r/RPT001?token=xxxxx" readonly style="flex:1;font-size:12px">
        <button class="btn btn-secondary btn-sm" onclick="showToast('链接已复制')">复制</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">有效期</label>
      <select class="form-input"><option>永久有效</option><option>1天</option><option>7天</option><option>30天</option><option>自定义</option></select>
    </div>
    <div class="form-group">
      <label class="form-label">访问权限</label>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px"><input type="radio" name="sharePermit" checked> 仅查看</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px"><input type="radio" name="sharePermit"> 可下载</label>
      </div>
    </div>
  `, `<button class="btn btn-ghost" onclick="closeModal()">关闭</button>`, 520);
}

function printReport() { showToast('正在准备打印...', 'info'); }

// 返回AI对话页面继续调整报告
function returnToAiChat() {
  showPage('report-ai-create');
  showToast('已返回对话页面，可以继续调整报告配置', 'info');
}

// ===================== 周期报告组详情页面 =====================
pageRenderers['report-group'] = () => {
  const rId = currentContext.reportId;
  const r = mockReports ? mockReports.find(x => x.id === rId) : null;
  const taskName = r ? r.name : '品牌传播月度周期报告任务';

  return `
<div class="page-header">
  <div style="display:flex;align-items:center;gap:10px">
    <button class="btn btn-ghost btn-sm" onclick="showPage('report-list')">
      <svg viewBox="0 0 16 16" width="13" height="13"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      返回
    </button>
    <div class="page-title">${taskName}</div>
    <span class="tag tag-green">运行中</span>
  </div>
  <div class="page-actions">
    <button class="btn btn-secondary btn-sm">暂停任务</button>
    <button class="btn btn-primary" onclick="showToast('正在生成新一期报告...')">立即生成新一期</button>
  </div>
</div>

<!-- 任务信息 -->
<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:16px">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
    <div><div class="text-muted text-sm mb-4">周期规则</div><div style="font-size:13px;font-weight:500">每月1日 09:00 自动生成</div></div>
    <div><div class="text-muted text-sm mb-4">数据维度</div><div style="font-size:13px;font-weight:500">全平台品牌传播数据</div></div>
    <div><div class="text-muted text-sm mb-4">已生成期数</div><div style="font-size:22px;font-weight:700;color:var(--primary)">4 期</div></div>
    <div><div class="text-muted text-sm mb-4">最新一期</div><div style="font-size:13px;font-weight:500">2026-04-01</div></div>
  </div>
</div>

<!-- 期数列表 -->
<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;overflow:hidden">
  <div style="padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
    <span style="font-weight:600;font-size:13px">历史报告列表</span>
    <div class="topbar-search" style="width:180px">
      <svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M13 13l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
      <input type="text" placeholder="搜索...">
    </div>
  </div>
  <table class="data-table">
    <thead><tr>
      <th style="width:36px"><input type="checkbox"></th>
      <th>期数</th>
      <th>报告名称</th>
      <th>数据范围</th>
      <th>生成时间</th>
      <th>状态</th>
      <th style="text-align:right">操作</th>
    </tr></thead>
    <tbody>
      ${[
        ['第4期','品牌传播月度报告 - 2026年3月','2026.03.01-2026.03.31','2026-04-01 09:00','done'],
        ['第3期','品牌传播月度报告 - 2026年2月','2026.02.01-2026.02.28','2026-03-01 09:02','done'],
        ['第2期','品牌传播月度报告 - 2026年1月','2026.01.01-2026.01.31','2026-02-01 09:00','done'],
        ['第1期','品牌传播月度报告 - 2025年12月','2025.12.01-2025.12.31','2026-01-01 09:00','archived'],
      ].map(([ep, name, range, time, status]) => {
        const sc = reportStatusConfig[status] || { label: status, tagClass: 'tag-gray' };
        return `<tr>
          <td><input type="checkbox"></td>
          <td><span class="tag tag-gray" style="font-size:10px">${ep}</span></td>
          <td><span style="font-size:13px;font-weight:500;cursor:pointer;color:var(--text-primary)" onclick="showPage('report-preview',{reportId:'RPT003'})">${name}</span></td>
          <td class="text-sm text-muted">${range}</td>
          <td class="text-sm text-muted">${time}</td>
          <td><span class="tag ${sc.tagClass}" style="font-size:10px">${sc.label}</span></td>
          <td style="text-align:right">
            <div style="display:flex;gap:4px;justify-content:flex-end">
              <button class="btn btn-ghost btn-sm" onclick="showPage('report-preview',{reportId:'RPT003'})">查看</button>
              <button class="btn btn-ghost btn-sm" onclick="downloadReport('RPT003')">下载</button>
            </div>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</div>`;
};
