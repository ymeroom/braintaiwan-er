const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = ['ais.html', 'nihss.html', 'aspects.html', 'se.html', 'ich.html', 'meningitis.html', 'cord.html'];
const cta = '<a class="subscribe-link" href="https://media.braintaiwan.com/subscribe.html">訂閱 ER 工具更新</a><br>';
const css = `footer .subscribe-link{display:inline-flex;align-items:center;justify-content:center;margin:10px 0 4px;padding:6px 12px;border-radius:18px;border:1px solid rgba(255,123,46,.45);color:var(--ora);text-decoration:none}
footer .subscribe-link:hover{background:rgba(255,123,46,.1);color:#ff9b5e}`;

let changed = 0;

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;

  if (!html.includes('footer .subscribe-link')) {
    html = html.replace('</style>', `${css}\n</style>`);
  }

  if (!html.includes('訂閱 ER 工具更新')) {
    html = html.replace('</footer>', `  ${cta}\n</footer>`);
  }

  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed += 1;
  }
}

console.log(`Enhanced ${changed} ER tool footer(s).`);
