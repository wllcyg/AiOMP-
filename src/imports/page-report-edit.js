// ===================== 报告编辑页面 =====================
// 报告编辑器 - 支持手动修改AI生成的报告内容，图表可编辑

// 报告内容数据结构
const reportEditorData = {
  title: '长安CS75Plus 品牌传播周报（第14周）',
  dateRange: '2026.03.31 - 2026.04.06',
  generatedTime: '2026-04-07 09:00',
  summary: `本周（4.1-4.7）长安CS75PLUS全平台传播声量 <strong>89,420</strong> 条，环比上周 <strong style="color:var(--success)">↑12.3%</strong>，正面情感占比 68%，整体表现优异。<br>
        重点：① 抖音评测内容引爆传播高峰；② 小红书种草内容互动率创历史新高；③ 销量破3万辆的相关报道持续发酵。<br>
        风险：导航系统负面评价有所上升，建议关注。`,
  sections: [
    {
      id: 'sec-1',
      num: '01',
      title: '总声量传播趋势分析',
      content: '本周声量峰值出现在周三4月3日（18,420条），受「蓝鲸杯最佳SUV」话题引爆，同日抖音相关视频累计播放量突破5000万。整体传播呈现「平日低位→事件引爆→快速回落」的典型波动特征。建议持续关注行业热点，提前布局事件借势传播内容。',
      isAiAnalysis: true,
      chartData: {
        type: 'line',
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{ name: '声量', data: [8200, 9600, 18420, 15200, 12800, 11300, 13900] }]
      }
    },
    {
      id: 'sec-2',
      num: '02',
      title: '平台声量分布概览',
      content: '',
      data: [
        { platform: '抖音', pct: '34.2%', count: '30,562', change: '↑8.5%' },
        { platform: '微博', pct: '22.1%', count: '19,758', change: '↑5.2%' },
        { platform: '小红书', pct: '18.6%', count: '16,631', change: '↑22.4%' },
        { platform: '汽车之家', pct: '12.3%', count: '11,000', change: '↓2.1%' }
      ],
      chartData: {
        type: 'bar',
        labels: ['抖音', '微博', '小红书', '汽车之家', '今日头条', '微信'],
        datasets: [{ name: '声量占比', data: [34.2, 22.1, 18.6, 12.3, 8.5, 4.3] }]
      }
    },
    {
      id: 'sec-3',
      num: '03',
      title: '情感倾向分析',
      content: '',
      emotions: [
        { type: '正面', pct: '68%', count: '60,406', tags: '外观/性能/性价比' },
        { type: '中性', pct: '20%', count: '17,884', tags: '资讯/发布/活动' },
        { type: '负面', pct: '12%', count: '10,730', tags: '系统/服务/品控' }
      ],
      chartData: {
        type: 'pie',
        labels: ['正面', '中性', '负面'],
        datasets: [{ name: '情感分布', data: [68, 20, 12] }]
      }
    },
    {
      id: 'sec-4',
      num: '04',
      title: '核心传播内容 TOP10',
      content: '',
      chartData: {
        type: 'table',
        columns: ['排名', '标题', '平台', '互动量', '情感'],
        data: [
          ['1', '长安CS75 PLUS赛博格全新亮相，外观设计大幅升级引发热议', '抖音', '138.5万', '正面'],
          ['2', '【深度测评】CS75 PLUS vs 途观L 到底谁更值得买？', '汽车之家', '92.8万', '正面'],
          ['3', '销量喜人！长安CS75系列3月份销售破3.2万辆创历史新高', '今日头条', '72.1万', '正面'],
          ['4', '小红书KOL种草视频：CS75 PLUS内饰全升级，女生也爱了！', '小红书', '61.3万', '正面'],
          ['5', '长安CS75PLUS车主吐槽：导航系统频繁卡顿，官方至今没解决', '微博', '47.2万', '负面'],
        ]
      }
    },
    {
      id: 'sec-5',
      num: '05',
      title: '竞品声量对比',
      content: '',
      chartData: {
        type: 'comp-bar',
        labels: ['长安CS75 PLUS', '比亚迪宋Plus', '吉利星越L', '哈佛H6', '奇瑞瑞虎8'],
        datasets: [
          { name: '本周', data: [89.4, 76.2, 65.8, 58.3, 42.1] },
          { name: '上周', data: [79.6, 74.8, 62.3, 61.2, 41.8] }
        ]
      }
    },
    {
      id: 'sec-6',
      num: '06',
      title: '互动量趋势',
      content: '',
      chartData: {
        type: 'multi-line',
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [
          { name: '点赞', data: [12.3, 14.8, 28.6, 22.1, 18.4, 15.2, 19.8] },
          { name: '评论', data: [3.2, 4.1, 8.6, 6.2, 5.1, 4.2, 5.8] },
          { name: '转发', data: [1.8, 2.3, 5.2, 3.8, 3.1, 2.6, 3.4] }
        ]
      }
    },
    {
      id: 'sec-8',
      num: '08',
      title: '下周传播优化建议',
      suggestions: [
        { icon: '🎯', title: '抢占热点机会', desc: '4月15日将迎来年度车型评选结果公布，建议提前布局相关话题内容，预计可带来额外1.5-2万条声量增量。', badge: '建议立即执行' },
        { icon: '⚠️', title: '负面舆情管控', desc: '导航卡顿负面评价近3天增长23.4%，建议官方账号主动出面回应，发布系统升级路线图，降低负面传播扩散。', badge: '重点关注' },
        { icon: '💡', title: '内容投放优化', desc: '小红书互动率本周创历史新高（8.9%），建议加大种草内容投入，重点布局女性用户圈层，扩大口碑辐射范围。', badge: '持续跟进' }
      ]
    }
  ]
};

// 当前编辑状态
let currentEditingField = null;
let hasUnsavedChanges = false;
let originalData = null;
// 已修改的图表ID列表
let modifiedChartIds = [];
// 当前正在编辑的图表ID
let editingChartId = null;
// 图表原始数据缓存
const chartOriginalData = {};

// 生成图表HTML
function generateChartHTML(sec) {
  const chartId = `chart-${sec.id}`;
  const isModified = modifiedChartIds.includes(chartId);
  const chart = sec.chartData;
  
  let chartContent = '';
  
  if (chart.type === 'line') {
    const maxVal = Math.max(...chart.datasets[0].data);
    chartContent = `
      <div style="display:flex;align-items:flex-end;gap:8px;height:180px;padding:10px">
        ${chart.labels.map((label, i) => {
          const val = chart.datasets[0].data[i];
          const h = (val / maxVal) * 150;
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="width:100%;background:linear-gradient(180deg,var(--primary),rgba(217,63,74,0.5));border-radius:4px 4px 0 0;height:${h}px;transition:all 0.3s" title="${val}"></div>
            <span style="font-size:10px;color:var(--text-muted)">${label}</span>
          </div>`;
        }).join('')}
      </div>
      <div style="text-align:center;font-size:11px;color:var(--text-muted);padding-bottom:8px">单位：条</div>`;
  } else if (chart.type === 'bar') {
    const maxVal = Math.max(...chart.datasets[0].data);
    const colors = ['#D93F4A','#E8636C','#F08A8F','#5BA3E0','#3498DB','#2ECC71'];
    chartContent = `
      <div style="display:flex;align-items:flex-end;gap:12px;height:180px;padding:10px">
        ${chart.labels.map((label, i) => {
          const val = chart.datasets[0].data[i];
          const h = (val / maxVal) * 150;
          return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:10px;color:var(--text-secondary);font-weight:600">${val}%</div>
            <div style="width:100%;background:${colors[i] || 'var(--primary)'};border-radius:4px 4px 0 0;height:${h}px;transition:all 0.3s" title="${val}%"></div>
            <span style="font-size:9px;color:var(--text-muted);text-align:center">${label}</span>
          </div>`;
        }).join('')}
      </div>`;
  } else if (chart.type === 'pie') {
    const colors = ['#86EFAC', '#FDE047', '#F87171'];
    chartContent = `
      <div style="display:flex;height:180px;padding:10px;align-items:center;justify-content:center;gap:30px">
        <div style="display:flex;gap:8px;flex-wrap:wrap;max-width:200px;justify-content:center">
          ${chart.labels.map((label, i) => `
            <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text-secondary)">
              <span style="width:10px;height:10px;border-radius:50%;background:${colors[i]}"></span>
              ${label} ${chart.datasets[0].data[i]}%
            </div>
          `).join('')}
        </div>
        <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(${chart.datasets[0].data.map((v,i,arr)=>{let sum=0;for(let j=0;j<i;j++) sum+=arr[j];return `${colors[i]} ${sum}% ${sum+v}%`;}).join(', ')});position:relative">
          <div style="position:absolute;inset:20px;background:var(--bg-card2);border-radius:50%"></div>
        </div>
      </div>`;
  } else if (chart.type === 'table') {
    chartContent = `
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:11px;border-collapse:collapse">
          <thead><tr style="background:var(--bg-card3)">
            ${chart.columns.map(col => `<th style="padding:8px 10px;text-align:center;color:var(--text-muted);font-weight:600">${col}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${chart.data.map(row => `<tr style="border-top:1px solid var(--border)">${row.map((cell, ci) => `<td style="padding:8px 10px;text-align:${ci === 0 || ci === 2 || ci === 4 ? 'center' : 'left'};color:var(--text-primary);${ci === 1 ? 'max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' : ''}">${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } else if (chart.type === 'comp-bar') {
    const maxVal = Math.max(...chart.datasets.flatMap(d => d.data));
    chartContent = `
      <div style="padding:10px 20px">
        <div style="display:flex;gap:16px;margin-bottom:12px;justify-content:center">
          ${chart.datasets.map((ds, i) => `<span style="display:flex;align-items:center;gap:4px;font-size:11px"><span style="width:12px;height:3px;background:${i === 0 ? 'var(--primary)' : '#888'};border-radius:2px"></span>${ds.name}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:140px">
          ${chart.labels.map((label, li) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="width:100%;display:flex;gap:2px;align-items:flex-end;justify-content:center;height:110px">
              ${chart.datasets.map((ds, di) => {const val = ds.data[li];const h = (val / maxVal) * 100;return `<div style="width:12px;background:${di === 0 ? 'var(--primary)' : '#ccc'};border-radius:3px 3px 0 0;height:${h}%;transition:all 0.3s" title="${val}"></div>`;}).join('')}
            </div>
            <span style="font-size:9px;color:var(--text-muted);text-align:center;max-width:60px">${label}</span>
          </div>`).join('')}
        </div>
      </div>`;
  } else if (chart.type === 'multi-line') {
    const maxVal = Math.max(...chart.datasets.flatMap(d => d.data));
    const colors = ['var(--primary)', '#3498DB', '#2ECC71'];
    chartContent = `
      <div style="padding:10px 20px">
        <div style="display:flex;gap:16px;margin-bottom:12px;justify-content:center">
          ${chart.datasets.map((ds, i) => `<span style="display:flex;align-items:center;gap:4px;font-size:11px"><span style="width:12px;height:3px;background:${colors[i]};border-radius:2px"></span>${ds.name}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:130px">
          ${chart.labels.map((label, li) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
            ${chart.datasets.map((ds, di) => {const val = ds.data[li];return `<div style="font-size:9px;color:${colors[di]};font-weight:600">${val}</div>`;}).join('')}
            <div style="width:100%;height:1px;background:var(--border);margin:2px 0"></div>
            <span style="font-size:9px;color:var(--text-muted)">${label}</span>
          </div>`).join('')}
        </div>
      </div>`;
  }
  
  return `
    <div style="position:relative;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;margin-bottom:12px;overflow:hidden">
      ${isModified ? `<div class="chart-modified-badge" style="position:absolute;top:8px;left:8px;z-index:5;background:var(--warning);color:#000;font-size:9px;padding:2px 6px;border-radius:4px;font-weight:600;display:flex;align-items:center;gap:3px">
        <svg viewBox="0 0 12 12" width="10" height="10"><path d="M10 3L4.5 8.5 2 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
        已修改
      </div>` : ''}
      <button onclick="startChartEdit('${chartId}', '${sec.id}')" style="position:absolute;top:8px;right:8px;z-index:5;background:var(--bg-card);border:1px solid var(--border);border-radius:5px;padding:4px 8px;font-size:10px;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.15s" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-secondary)'">
        <svg viewBox="0 0 12 12" width="11" height="11"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" fill="none" stroke-width="1.2"/></svg>
        编辑
      </button>
      <div id="${chartId}" class="chart-view">${chartContent}</div>
    </div>
  `;
}

// 生成表格编辑HTML
function generateChartEditTableHTML(chartId, sec) {
  const chart = sec.chartData;
  
  if (chart.type === 'line') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>折线图 · 数据系列：${chart.datasets[0].name}</div><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)"><th style="padding:8px;text-align:center;color:var(--text-muted);width:40px">#</th><th style="padding:8px;text-align:left;color:var(--text-muted)">标签</th><th style="padding:8px;text-align:right;color:var(--text-muted)">数值</th></tr></thead><tbody>${chart.labels.map((label, i) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;text-align:center;color:var(--text-muted)">${i+1}</td><td style="padding:6px 8px"><input type="text" class="chart-edit-input" data-row="${i}" data-field="label" value="${label}" style="width:100%;background:transparent;border:none;font-size:11px;color:var(--text-primary);outline:none"></td><td style="padding:6px 8px"><input type="number" class="chart-edit-input" data-row="${i}" data-field="data" value="${chart.datasets[0].data[i]}" style="width:80px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-size:11px;color:var(--text-primary);outline:none;text-align:right"></td></tr>`).join('')}</tbody></table></div>`;
  } else if (chart.type === 'bar') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>柱状图 · 数据系列：${chart.datasets[0].name}</div><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)"><th style="padding:8px;text-align:center;color:var(--text-muted);width:40px">#</th><th style="padding:8px;text-align:left;color:var(--text-muted)">名称</th><th style="padding:8px;text-align:right;color:var(--text-muted)">数值(%)</th></tr></thead><tbody>${chart.labels.map((label, i) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;text-align:center;color:var(--text-muted)">${i+1}</td><td style="padding:6px 8px"><input type="text" class="chart-edit-input" data-row="${i}" data-field="label" value="${label}" style="width:100%;background:transparent;border:none;font-size:11px;color:var(--text-primary);outline:none"></td><td style="padding:6px 8px"><input type="number" step="0.1" class="chart-edit-input" data-row="${i}" data-field="data" value="${chart.datasets[0].data[i]}" style="width:80px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-size:11px;color:var(--text-primary);outline:none;text-align:right"></td></tr>`).join('')}</tbody></table></div>`;
  } else if (chart.type === 'pie') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>饼图 · 数据系列：${chart.datasets[0].name}</div><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)"><th style="padding:8px;text-align:center;color:var(--text-muted);width:40px">#</th><th style="padding:8px;text-align:left;color:var(--text-muted)">分类</th><th style="padding:8px;text-align:right;color:var(--text-muted)">占比(%)</th></tr></thead><tbody>${chart.labels.map((label, i) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;text-align:center;color:var(--text-muted)">${i+1}</td><td style="padding:6px 8px"><input type="text" class="chart-edit-input" data-row="${i}" data-field="label" value="${label}" style="width:100%;background:transparent;border:none;font-size:11px;color:var(--text-primary);outline:none"></td><td style="padding:6px 8px"><input type="number" step="0.1" class="chart-edit-input" data-row="${i}" data-field="data" value="${chart.datasets[0].data[i]}" style="width:80px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-size:11px;color:var(--text-primary);outline:none;text-align:right"></td></tr>`).join('')}</tbody></table></div>`;
  } else if (chart.type === 'table') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>数据表格</div><div style="overflow-x:auto"><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)">${chart.columns.map((col, ci) => `<th style="padding:8px;text-align:${ci === 0 ? 'center' : 'left'};color:var(--text-muted);white-space:nowrap">${col}</th>`).join('')}</tr></thead><tbody>${chart.data.map((row, ri) => `<tr style="border-top:1px solid var(--border)">${row.map((cell, ci) => `<td style="padding:4px 6px"><input type="text" class="chart-edit-input" data-row="${ri}" data-col="${ci}" value="${cell}" style="width:100%;min-width:60px;background:${ci === 0 ? 'var(--bg-card3)' : 'transparent'};border:${ci === 0 ? 'none' : '1px solid var(--border)'};border-radius:4px;padding:4px 6px;font-size:11px;color:${ci === 0 ? 'var(--text-muted)' : 'var(--text-primary)'};outline:none;${ci === 1 ? 'max-width:280px' : ''}"></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  } else if (chart.type === 'comp-bar') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>竞品对比柱状图</div><div style="overflow-x:auto"><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)"><th style="padding:8px;text-align:center;color:var(--text-muted);width:40px">#</th><th style="padding:8px;text-align:left;color:var(--text-muted)">竞品名称</th>${chart.datasets.map(ds => `<th style="padding:8px;text-align:right;color:var(--text-muted)">${ds.name}</th>`).join('')}</tr></thead><tbody>${chart.labels.map((label, i) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;text-align:center;color:var(--text-muted)">${i+1}</td><td style="padding:6px 8px"><input type="text" class="chart-edit-input" data-type="comp-bar" data-row="${i}" data-field="label" value="${label}" style="width:100%;background:transparent;border:none;font-size:11px;color:var(--text-primary);outline:none"></td>${chart.datasets.map((ds, di) => `<td style="padding:6px 8px"><input type="number" step="0.1" class="chart-edit-input" data-type="comp-bar" data-row="${i}" data-ds="${di}" data-field="data" value="${ds.data[i]}" style="width:70px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:11px;color:var(--text-primary);outline:none;text-align:right"></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  } else if (chart.type === 'multi-line') {
    return `<div style="padding:16px"><div style="margin-bottom:12px;font-size:12px;color:var(--text-muted)"><strong>图表类型：</strong>多系列折线图</div><div style="overflow-x:auto"><table style="width:100%;font-size:11px;border-collapse:collapse"><thead><tr style="background:var(--bg-card3)"><th style="padding:8px;text-align:center;color:var(--text-muted);width:40px">#</th><th style="padding:8px;text-align:left;color:var(--text-muted)">标签</th>${chart.datasets.map(ds => `<th style="padding:8px;text-align:right;color:var(--text-muted)">${ds.name}</th>`).join('')}</tr></thead><tbody>${chart.labels.map((label, i) => `<tr style="border-top:1px solid var(--border)"><td style="padding:6px 8px;text-align:center;color:var(--text-muted)">${i+1}</td><td style="padding:6px 8px"><input type="text" class="chart-edit-input" data-type="multi-line" data-row="${i}" data-field="label" value="${label}" style="width:100%;background:transparent;border:none;font-size:11px;color:var(--text-primary);outline:none"></td>${chart.datasets.map((ds, di) => `<td style="padding:6px 8px"><input type="number" step="0.1" class="chart-edit-input" data-type="multi-line" data-row="${i}" data-ds="${di}" data-field="data" value="${ds.data[i]}" style="width:70px;background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:11px;color:var(--text-primary);outline:none;text-align:right"></td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  }
  
  return '<div style="padding:16px;color:var(--text-muted)">暂不支持编辑此类型图表</div>';
}

// 开始编辑图表
function startChartEdit(chartId, secId) {
  const sec = reportEditorData.sections.find(s => s.id === secId);
  if (!sec || !sec.chartData) return;
  
  editingChartId = chartId;
  
  if (!chartOriginalData[chartId]) {
    chartOriginalData[chartId] = JSON.parse(JSON.stringify(sec.chartData));
  }
  
  const chartContainer = document.getElementById(chartId);
  if (!chartContainer) return;
  
  chartContainer.innerHTML = `
    ${generateChartEditTableHTML(chartId, sec)}
    <div style="display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--border);background:var(--bg-card3)">
      <button onclick="cancelChartEdit('${chartId}', '${secId}')" style="flex:1;padding:8px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text-secondary);cursor:pointer;transition:all 0.15s" onmouseover="this.style.borderColor='var(--danger)';this.style.color='var(--danger)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-secondary)'">取消</button>
      <button onclick="saveChartEdit('${chartId}', '${secId}')" style="flex:1;padding:8px 12px;background:var(--primary);border:1px solid var(--primary);border-radius:6px;font-size:12px;color:white;cursor:pointer;font-weight:600;transition:all 0.15s" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">保存</button>
    </div>
  `;
  chartContainer.classList.add('editing');
}

// 取消图表编辑
function cancelChartEdit(chartId, secId) {
  const sec = reportEditorData.sections.find(s => s.id === secId);
  if (!sec || !sec.chartData) return;
  
  if (chartOriginalData[chartId]) {
    sec.chartData = JSON.parse(JSON.stringify(chartOriginalData[chartId]));
    delete chartOriginalData[chartId];
  }
  
  editingChartId = null;
  const chartContainer = document.getElementById(chartId);
  if (chartContainer) {
    chartContainer.innerHTML = generateChartHTML(sec);
    chartContainer.classList.remove('editing');
  }
}

// 保存图表编辑
function saveChartEdit(chartId, secId) {
  const sec = reportEditorData.sections.find(s => s.id === secId);
  if (!sec || !sec.chartData) return;
  
  const chart = sec.chartData;
  const inputs = document.querySelectorAll(`#${chartId} .chart-edit-input`);
  
  inputs.forEach(input => {
    const row = parseInt(input.dataset.row);
    const field = input.dataset.field;
    const value = input.value;
    
    if (chart.type === 'table') {
      const col = parseInt(input.dataset.col);
      if (col === 0) return;
      chart.data[row][col] = value;
    } else if (chart.type === 'comp-bar' || chart.type === 'multi-line') {
      if (field === 'label') {
        chart.labels[row] = value;
      } else {
        const dsIdx = parseInt(input.dataset.ds || 0);
        chart.datasets[dsIdx].data[row] = parseFloat(value) || 0;
      }
    } else {
      if (field === 'label') {
        chart.labels[row] = value;
      } else {
        chart.datasets[0].data[row] = parseFloat(value) || 0;
      }
    }
  });
  
  if (!modifiedChartIds.includes(chartId)) {
    modifiedChartIds.push(chartId);
  }
  
  hasUnsavedChanges = true;
  editingChartId = null;
  
  const chartContainer = document.getElementById(chartId);
  if (chartContainer) {
    chartContainer.innerHTML = generateChartHTML(sec);
    chartContainer.classList.remove('editing');
  }
  
  updateEditStatus();
  showToast('图表数据已更新', 'success');
}

pageRenderers['report-edit'] = () => {
  const rId = currentContext.reportId || 'RPT001';
  const r = mockReports ? mockReports.find(x => x.id === rId) : null;
  const rName = r ? r.name : reportEditorData.title;

  if (!originalData) {
    originalData = JSON.parse(JSON.stringify(reportEditorData));
    originalData.title = rName;
  }

  return `
<div style="display:flex;flex-direction:column;height:calc(100vh - 56px - 32px)">
  <!-- 顶部固定操作栏 -->
  <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 20px;margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-shrink:0">
    <button class="btn btn-secondary btn-sm" onclick="returnFromReportEdit()" style="background:var(--primary-bg);color:var(--primary);border-color:var(--primary-border)">
      <svg viewBox="0 0 16 16" width="13" height="13"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
      返回
    </button>
    <div style="flex:1;font-size:13px;font-weight:600;color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
      ${rName}
    </div>
    <div style="display:flex;gap:8px;flex-shrink:0;align-items:center">
      <div id="editStatusIndicator" style="font-size:12px;color:var(--text-muted);display:none;align-items:center;gap:4px">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--warning)"></span>
        未保存
      </div>
      <button class="btn btn-ghost btn-sm" onclick="resetReportEdit()">重置</button>
      <button class="btn btn-secondary btn-sm" onclick="saveReportEdit()" style="background:var(--primary);color:white;border-color:var(--primary)">
        <svg viewBox="0 0 16 16" width="13" height="13"><path d="M13 4H3a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1z" stroke="currentColor" fill="none" stroke-width="1.5"/><path d="M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" stroke-width="1.5"/></svg>
        保存修改
      </button>
    </div>
  </div>

  <!-- 主体：目录 + 报告内容 -->
  <div style="display:flex;gap:14px;flex:1;overflow:hidden">
    <!-- 左侧目录 -->
    <div style="width:180px;flex-shrink:0;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;overflow-y:auto">
      <div style="font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:1px;margin-bottom:10px">目录</div>
      <div onclick="scrollToEditSection(0)" style="padding:6px 8px;border-radius:5px;cursor:pointer;font-size:11px;color:var(--text-secondary);margin-bottom:2px;transition:all 0.15s" class="toc-item" data-sec="0"
        onmouseover="this.style.background='var(--bg-card3)'" onmouseout="this.style.background='transparent'">报告封面</div>
      ${reportEditorData.sections.map((s, i) => `
        <div onclick="scrollToEditSection(${i + 1})" style="padding:6px 8px;border-radius:5px;cursor:pointer;font-size:11px;color:var(--text-secondary);margin-bottom:2px;transition:all 0.15s" class="toc-item" data-sec="${i + 1}"
          onmouseover="this.style.background='var(--bg-card3)'" onmouseout="this.style.background='transparent'">${s.num} ${s.title}</div>
      `).join('')}
    </div>

    <!-- 右侧报告内容（可编辑） -->
    <div style="flex:1;overflow-y:auto;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:32px 40px" id="reportEditContent">
      <!-- 封面 -->
      <div id="edit-sec-0" style="background:linear-gradient(135deg,#0f1117 0%,#1a0a0f 50%,#250d14 100%);padding:48px 56px;color:#fff;position:relative;overflow:hidden;margin:-32px -40px 32px;margin-bottom:32px">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(217,63,74,0.2),transparent 60%);pointer-events:none"></div>
        <div style="position:relative">
          <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-bottom:16px">品牌传播监测洞察平台 · BRAND INSIGHT REPORT</div>
          <div id="edit-title" class="editable-field" onclick="startEdit('title', this)" contenteditable="false" style="font-size:28px;font-weight:700;margin-bottom:8px;line-height:1.3;cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">${reportEditorData.title}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:32px">数据范围：${reportEditorData.dateRange} · 生成时间：${reportEditorData.generatedTime}</div>

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

      <!-- 执行摘要 -->
      <div style="background:var(--primary-bg);border-left:4px solid var(--primary);border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px">
        <div style="font-size:13px;font-weight:700;color:var(--primary);margin-bottom:8px">📋 执行摘要</div>
        <div id="edit-summary" class="editable-field" onclick="startEdit('summary', this)" contenteditable="false" style="font-size:12px;line-height:1.9;color:var(--text-secondary);cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">
          ${reportEditorData.summary}
        </div>
      </div>

      <!-- 第1章 -->
      <div id="edit-sec-1" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">01</span>
          总声量传播趋势分析
        </div>
        ${generateChartHTML(reportEditorData.sections[0])}
        <div class="editable-analysis-box">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="tag tag-primary" style="font-size:10px">AI智能分析</span>
            <span style="font-size:11px;color:var(--text-muted)">（可编辑，点击文本区域修改）</span>
          </div>
          <div id="edit-sec-1-content" class="editable-field" onclick="startEdit('sec-1-content', this)" contenteditable="false" style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-size:12px;line-height:1.8;color:var(--text-secondary);cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">
            ${reportEditorData.sections[0].content}
          </div>
        </div>
      </div>

      <!-- 第2章 -->
      <div id="edit-sec-2" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">02</span>
          平台声量分布概览
        </div>
        ${generateChartHTML(reportEditorData.sections[1])}
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
          ${reportEditorData.sections[1].data.map(d => `
            <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center">
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${d.platform}</div>
              <div style="font-size:22px;font-weight:700;color:var(--primary)">${d.pct}</div>
              <div style="font-size:11px;color:var(--text-secondary)">${d.count} 条</div>
              <div style="font-size:11px;color:${d.change.startsWith('↑') ? 'var(--success)' : 'var(--danger)'}">${d.change} vs上周</div>
            </div>`).join('')}
        </div>
        <div class="editable-analysis-box">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="tag tag-primary" style="font-size:10px">AI智能分析</span>
            <span style="font-size:11px;color:var(--text-muted)">（可编辑，点击文本区域修改）</span>
          </div>
          <div class="editable-field" contenteditable="false" style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-size:12px;line-height:1.8;color:var(--text-secondary);cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">
            抖音平台本周占比34.2%保持领先，小红书增速最快（↑22.4%），建议加大短视频内容投入。汽车之家本周略有下降（↓2.1%），需关注汽车垂媒内容优化。
          </div>
        </div>
      </div>

      <!-- 第3章 -->
      <div id="edit-sec-3" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">03</span>
          情感倾向分析
        </div>
        ${generateChartHTML(reportEditorData.sections[2])}
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
          ${reportEditorData.sections[2].emotions.map(e => `
            <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:12px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span class="node-${e.type === '正面' ? 'positive' : e.type === '负面' ? 'negative' : 'neutral'}">${e.type}</span>
                <span style="font-size:18px;font-weight:700">${e.pct}</span>
              </div>
              <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">${e.count} 条</div>
              <div style="font-size:10px;color:var(--text-muted)">${e.tags}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- 第4章 -->
      <div id="edit-sec-4" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">04</span>
          核心传播内容 TOP10
        </div>
        ${generateChartHTML(reportEditorData.sections[3])}
      </div>

      <!-- 第5章：竞品声量对比 -->
      <div id="edit-sec-5" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">05</span>
          竞品声量对比
        </div>
        ${generateChartHTML(reportEditorData.sections[4])}
        <div class="editable-analysis-box">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span class="tag tag-primary" style="font-size:10px">AI智能分析</span>
          </div>
          <div class="editable-field" contenteditable="false" style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-size:12px;line-height:1.8;color:var(--text-secondary);cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">
            长安CS75 PLUS本周声量89.4万，领先比亚迪宋Plus（76.2万）17.3%，领先吉利星越L（65.8万）35.9%。建议继续保持内容投放力度，同时关注竞品动态。
          </div>
        </div>
      </div>

      <!-- 第6章：互动量趋势 -->
      <div id="edit-sec-6" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">06</span>
          互动量趋势
        </div>
        ${generateChartHTML(reportEditorData.sections[5])}
      </div>

      <!-- 第8章：下周建议 -->
      <div id="edit-sec-8" style="margin-bottom:28px">
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:14px;display:flex;align-items:center;gap:8px">
          <span style="background:var(--primary);color:white;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">08</span>
          下周传播优化建议
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${reportEditorData.sections[6].suggestions.map((s, idx) => `
            <div style="background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;display:flex;gap:12px">
              <div style="font-size:20px;flex-shrink:0">${s.icon}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:var(--text-primary)">${s.title}</div>
                <div id="edit-suggestion-${idx}" class="editable-field" onclick="startEdit('suggestion-${idx}', this)" contenteditable="false" style="font-size:12px;line-height:1.7;color:var(--text-secondary);cursor:text;padding:4px;border-radius:4px;transition:all 0.15s">${s.desc}</div>
              </div>
              <span class="tag tag-primary" style="font-size:10px;height:fit-content;flex-shrink:0">${s.badge}</span>
            </div>`).join('')}
        </div>
      </div>

      <div style="text-align:center;padding:16px;color:var(--text-muted);font-size:11px;border-top:1px solid var(--border)">
        本报告由品牌传播监测洞察平台 AI 自动生成 · 生成时间：${reportEditorData.generatedTime}${modifiedChartIds.length > 0 ? ' · <span style="color:var(--warning)">已人工编辑</span>' : ''}
      </div>
    </div>
  </div>

  <!-- 编辑提示浮层 -->
  <div id="editHint" style="position:fixed;bottom:20px;right:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px 16px;font-size:12px;color:var(--text-secondary);display:none;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000">
    <div style="margin-bottom:4px">💡 提示：按 <kbd style="background:var(--bg-card2);padding:2px 6px;border-radius:4px;font-size:11px">Enter</kbd> 确认修改</div>
    <div>按 <kbd style="background:var(--bg-card2);padding:2px 6px;border-radius:4px;font-size:11px">Esc</kbd> 取消编辑</div>
  </div>
</div>

<style>
.editable-field:hover {
  background: var(--bg-card3) !important;
  outline: 2px dashed var(--primary) !important;
}
.editable-field:focus, .editable-field.editing {
  background: var(--bg-card3) !important;
  outline: 2px solid var(--primary) !important;
}
.editable-analysis-box .editable-field {
  background: var(--bg-card2) !important;
  border: 1px solid var(--border) !important;
  border-radius: 8px !important;
}
.chart-modified-badge {
  animation: pulse-badge 2s ease-in-out infinite;
}
@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>`;
};

pageInits['report-edit'] = () => {
  document.addEventListener('keydown', handleEditKeydown);
  hasUnsavedChanges = false;
  modifiedChartIds = [];
  editingChartId = null;
  updateEditStatus();
};

// 开始编辑
function startEdit(fieldId, element) {
  if (editingChartId) return;
  
  if (currentEditingField && currentEditingField !== element) {
    finishEdit(currentEditingField, false);
  }

  currentEditingField = element;
  element.contentEditable = 'true';
  element.classList.add('editing');
  element.focus();

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  document.getElementById('editHint').style.display = 'block';
}

// 完成编辑
function finishEdit(element, save = true) {
  if (!element) return;

  element.contentEditable = 'false';
  element.classList.remove('editing');

  if (save) {
    hasUnsavedChanges = true;
    updateEditStatus();
  }

  document.getElementById('editHint').style.display = 'none';
  currentEditingField = null;
}

// 键盘事件处理
function handleEditKeydown(e) {
  if (!currentEditingField) return;

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    finishEdit(currentEditingField, true);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cancelEdit(currentEditingField);
    finishEdit(currentEditingField, false);
  }
}

// 取消编辑
function cancelEdit(element) {
  const fieldId = element.id;
  switch(fieldId) {
    case 'edit-title':
      element.innerHTML = reportEditorData.title;
      break;
    case 'edit-summary':
      element.innerHTML = reportEditorData.summary;
      break;
    case 'edit-sec-1-content':
      element.innerHTML = reportEditorData.sections[0].content;
      break;
    case 'edit-suggestion-0':
      element.innerHTML = reportEditorData.sections[6].suggestions[0].desc;
      break;
    case 'edit-suggestion-1':
      element.innerHTML = reportEditorData.sections[6].suggestions[1].desc;
      break;
    case 'edit-suggestion-2':
      element.innerHTML = reportEditorData.sections[6].suggestions[2].desc;
      break;
  }
}

// 更新编辑状态
function updateEditStatus() {
  const indicator = document.getElementById('editStatusIndicator');
  if (indicator) {
    indicator.style.display = hasUnsavedChanges ? 'flex' : 'none';
  }
}

// 保存修改
function saveReportEdit() {
  const titleEl = document.getElementById('edit-title');
  const summaryEl = document.getElementById('edit-summary');
  const sec1El = document.getElementById('edit-sec-1-content');

  if (titleEl) reportEditorData.title = titleEl.innerText.trim();
  if (summaryEl) reportEditorData.summary = summaryEl.innerHTML;
  if (sec1El) reportEditorData.sections[0].content = sec1El.innerText.trim();

  for (let i = 0; i < 3; i++) {
    const el = document.getElementById('edit-suggestion-' + i);
    if (el) reportEditorData.sections[6].suggestions[i].desc = el.innerText.trim();
  }

  hasUnsavedChanges = false;
  updateEditStatus();
  showToast('报告已保存，覆盖原报告', 'success');
}

// 重置修改
function resetReportEdit() {
  if (hasUnsavedChanges) {
    if (!confirm('确定要放弃所有修改吗？')) return;
  }

  if (titleEl = document.getElementById('edit-title')) titleEl.innerText = originalData.title;
  if (summaryEl = document.getElementById('edit-summary')) summaryEl.innerHTML = originalData.summary;
  if (sec1El = document.getElementById('edit-sec-1-content')) sec1El.innerText = originalData.sections[0].content;
  for (let i = 0; i < 3; i++) {
    const el = document.getElementById('edit-suggestion-' + i);
    if (el) el.innerText = originalData.sections[6].suggestions[i].desc;
  }
  
  // 重置图表数据
  reportEditorData.sections.forEach(sec => {
    const chartId = `chart-${sec.id}`;
    if (sec.chartData && chartOriginalData[chartId]) {
      sec.chartData = JSON.parse(JSON.stringify(chartOriginalData[chartId]));
      delete chartOriginalData[chartId];
    }
  });
  modifiedChartIds = [];
  
  // 重新渲染页面
  const container = document.getElementById('reportEditContent');
  if (container) {
    // 保存滚动位置
    const scrollTop = container.parentElement.scrollTop;
    // 重新获取并插入内容
    container.outerHTML = container.outerHTML;
    container.parentElement.scrollTop = scrollTop;
  }

  hasUnsavedChanges = false;
  updateEditStatus();
  showToast('已恢复到原始内容', 'info');
}

// 返回上一页
function returnFromReportEdit() {
  if (hasUnsavedChanges) {
    if (!confirm('有未保存的修改，确定要离开吗？')) return;
  }

  document.removeEventListener('keydown', handleEditKeydown);
  currentEditingField = null;
  hasUnsavedChanges = false;
  modifiedChartIds = [];
  editingChartId = null;
  originalData = null;

  const rId = currentContext.reportId || 'RPT001';
  showPage('report-preview', { reportId: rId });
}

// 滚动到指定章节
function scrollToEditSection(index) {
  const el = document.getElementById('edit-sec-' + index);
  const container = document.getElementById('reportEditContent');
  if (el && container) {
    container.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });

    document.querySelectorAll('.toc-item').forEach(item => item.style.color = 'var(--text-secondary)');
    const activeItem = document.querySelector(`.toc-item[data-sec="${index}"]`);
    if (activeItem) activeItem.style.color = 'var(--primary)';
  }
}
