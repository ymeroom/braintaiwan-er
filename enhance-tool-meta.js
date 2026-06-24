const fs = require('fs');
const path = require('path');

const root = __dirname;
const marker = '<!-- bt-tool-meta -->';

const tools = {
  'ais.html': {
    audience: '急診、神經科與中風團隊；用於疑似急性缺血性中風初始分流。',
    updated: '2026.06',
    source: '2026 AHA/ASA acute ischemic stroke guideline',
  },
  'nihss.html': {
    audience: '受訓醫療人員；用於急性中風神經功能量化與溝通。',
    updated: '2026.06',
    source: 'NIH Stroke Scale standard scoring / NINDS training framework',
  },
  'aspects.html': {
    audience: '中風團隊與受訓影像判讀人員；用於 MCA 缺血早期變化評估。',
    updated: '2026.06',
    source: 'Barber et al. Lancet 2000 / 2026 AHA/ASA AIS guideline',
  },
  'se.html': {
    audience: '急診、加護病房與神經科團隊；用於癲癇重積狀態初始處置。',
    updated: '2026.06',
    source: 'NCS guideline 2012 / AES guidance / RAMPART / ESETT',
  },
  'ich.html': {
    audience: '急診、加護病房、神經科與神經外科團隊；用於急性 ICH 初始管理。',
    updated: '2026.06',
    source: '2022 AHA/ASA ICH guideline / INTERACT3 / ENRICH',
  },
  'meningitis.html': {
    audience: '急診、感染科與神經科團隊；用於疑似 CNS 感染初始治療決策。',
    updated: '2026.06',
    source: 'IDSA bacterial meningitis guideline / HSV encephalitis empiric treatment principles',
  },
  'cord.html': {
    audience: '急診、腫瘤、神經科與神經外科團隊；用於脊髓壓迫或馬尾症候群警訊分流。',
    updated: '2026.06',
    source: 'Patchell et al. Lancet 2005 / NICE MSCC guideline / cauda equina decompression consensus',
  },
};

const css = `.tool-meta{max-width:var(--tool-meta-width,800px);margin:16px auto 0;padding:0 20px}
.tool-meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.tool-meta-item{background:rgba(22,27,34,.92);border:1px solid var(--border);border-radius:9px;padding:11px 13px}
.tool-meta-k{font-size:9.5pt;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--ora);margin-bottom:5px}
.tool-meta-v{font-size:10.5pt;line-height:1.5;color:var(--muted)}
@media(max-width:720px){.tool-meta-grid{grid-template-columns:1fr}.tool-meta{padding:0 18px}}`;

function block(meta) {
  return `${marker}
<section class="tool-meta" aria-label="工具版本與資料來源">
  <div class="tool-meta-grid">
    <div class="tool-meta-item">
      <div class="tool-meta-k">適用對象</div>
      <div class="tool-meta-v">${meta.audience}</div>
    </div>
    <div class="tool-meta-item">
      <div class="tool-meta-k">最後更新</div>
      <div class="tool-meta-v">${meta.updated}</div>
    </div>
    <div class="tool-meta-item">
      <div class="tool-meta-k">資料來源</div>
      <div class="tool-meta-v">${meta.source}</div>
    </div>
  </div>
</section>`;
}

function enhance(file, meta) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const maxWidth = html.match(/main\{max-width:(\d+px)/)?.[1] || '800px';
  const pageCss = css.replace('var(--tool-meta-width,800px)', maxWidth);

  if (!html.includes('.tool-meta{')) {
    html = html.replace('</style>', `${pageCss}\n</style>`);
  }

  html = html.replace(new RegExp(`\\n${marker}[\\s\\S]*?(?=\\n<main>)`), '');
  html = html.replace(/\n<main>/, `\n${block(meta)}\n<main>`);

  fs.writeFileSync(filePath, html, 'utf8');
}

for (const [file, meta] of Object.entries(tools)) {
  enhance(file, meta);
}

console.log(`Enhanced ${Object.keys(tools).length} ER tool page(s).`);
