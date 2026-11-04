// --- Popup Script with built-in tag pool ---
let currentMode = 'stamp'; // 'stamp' | 'emoji'
function getStorageKey() {
  return currentMode === 'emoji' ? 'lineEmojiTags' : 'lineStampTags';
}

const TAG_POOL_DATA = {
"会話":["はぁ","おはよう","ちーん","やっほー","なんと","承認","密です","安心した","どうしたの？","かわいい","そうそう","うける","バイバイ","おかえり","ただいま","しまった","お願いします","うはうは","待ってた","まさか","ほほう","真面目","どこ？","何してる？","確かに","暇です","げっ","早く","うーん","ファイト","おまたせ","だめ","いやいや","ふむふむ","いいね","恐ろしい","ガンバレ","承知","がっかり","さすが","大変","本気","ワンチャン","いってらっしゃい","助かる","申し訳ない","終わった？","はーい","どんまい","おいしい","恥ずかしい","まったり","お手数おかけします","おやすみ","了解","感謝","そんな","だるい","本当","塞ぐ","違う","問題ない","どうしよう","おお","お見事","わかった","สวัสดี","じゃあね","構って","こんばんは","面倒","よろしく","しっかり","ごちそうさま","ねぇねぇ","素晴らしい","やるね","よし","またね","まじで？","わかるわかる","もちろん","そっか","忙しい","任せろ","どういたしまして","何でもない","やった","待ってる","間違いない","うんうん","え？","バカな","何か？","はぁ？","許さない","そうなの？","辛い（つらい）","ありがとう","じゃーん","お祝い","内緒","あらま","えー","きたー","頑張る","メシウマ","OK","ありえない","いただきます","さようなら","お大事に","引く","わからない","NG","ごめんなさい","難しい","おつかれさま","ごゆっくり","まだ？","眠い","タピる","いえいえ","半端ない","NO","안녕","心配","嘘","YES","えっへん","なるほど","ようこそ","会いたい","それな","すごい","気をつけて","無理しないで","いってきます","元気？","いいなー","どうぞ","偉い","ちょっと待った","面白い","すみません","終わった","何故","こんにちは","無理","嬉しい","任せた","おめでとう","愛してる","それで？","おーい","大丈夫","こらー"],
"表現":["空虚","遊ぶ","気合","怒る","ゆるい","だらだら","イチャイチャ","エモイ","わーい","動揺","幸せ","逃走","ショック","プププ","ベロ","休憩","びっくり","満足","フフフ","シュール","キュン","抜け殻","ちゃらい","のんびり","じーっ","もうすぐ着く","うるうる","一番","空腹","しんみり","やばい","テンパる","唖然","衝撃","ある","オーマイガー","あぶない","あわあわ","賛成","もやもや","ひやひや","ラブラブ","カチーン","マッハ","元気","ベー","！！","ルンルン","満腹","ドキドキ","ノリノリ","ガクブル","ぶんぶん","ハート","カップル","プレッシャー","どんより","キュート","アホ","てへ","土下座","もぐもぐ","起きる","照れる","腹ペコ","謙遜","じゅるり","チラッ","寝る","今いく","こっそり","ラッキー","隠れる","ツッコミ","喪失","きらきら","えへへ","萌える","ない","廃人","ぼかーん","応援","爆発","幸運","ぐすん","バテる","わいわい","？","もじもじ","馬鹿","うきうき","しんどい","おろおろ","謝る","疲れた","贈る","大げさ","残念","ひそひそ","ぎくり","あくび","しょんぼり","ピキピキ","復活","ハハハ","パクパク","ふらふら","目が覚める","そわそわ","我慢","ごはん","ダッシュ","ワクテカ","断る","ぺこり","！？","限界","呆然","ピース","緊急","無念","しくしく","よしよし","ゾクゾク","ラブリー","ちくしょー","キョトン","すやすや","チェッ","ピンチ"],
"感情":["感激","必死","驚く","気まずい","へこむ","泣く","ときめく","あちゃー","がーん","興奮","悔しい","期待","不満","素敵","どや","涙","イエイ","安心","焦る","寂しい","後悔","ぼーっとする","怖い","一生懸命","落ちこむ","悲しい","かっこいい","わくわく","号泣","呆れる","ジェラシー","えーん","楽しい","むかつく","パニック","暑い","にやにや","不機嫌","最高","いらいら","キレる","不安","冷静","吹く","ぴえん","ひゃっほー","とほほ","しらける","にっこり","和む","震える","寒い","笑う","憂鬱","腹が立つ","好き","弱った","困る","やれやれ","甘える","うらやましい"],
"行動":["悩む","威張る","考える","お使い","買い物","誤爆","落ち着いて","あたふた","掃除","覗く","頼む","爆笑","脅迫","勉強中","慌てる","急ぐ","飲む","ぐったり","参る","うろうろ","到着","浮かれる","はしゃぐ","食べる","反省","惚れる","走る","却下","お風呂","爆睡","くすくす","退勤","食事","慰める","バンザイ","拍手","出勤","拒否","今帰る","料理","仕事中","出かける"],
"春":["春","いちご","こいのぼり","ゴールデンウィーク","エイプリルフール","入学","卒業","春休み","ひな祭り","花粉症","花見","チューリップ","桜","春酒","228","婦女節","青年節","清明節","兒童節","枇杷"],
"夏":["夏","猛暑","ムシムシ","日焼け","夏バテ","熱中症","汗","水分補給","クーラー","扇風機","うちわ","風鈴","花火","夏祭り","盆踊り","浴衣","レジャー","夏フェス","プール","海","泳ぐ","水着","キャンプ","バーベキュー","ビアガーデン","虫刺され","流しそうめん","スイカ","かき氷","アイスクリーム","ビール","ひまわり","台風","雷","ゲリラ豪雨","お盆","帰省","暑中見舞い","夏休み","夏休みの宿題","自由研究","夏期講習","高校野球","酷暑","涼しい"],
"秋":["秋","トリックオアトリート","仮装","コウモリ","ミイラ","魔女","おばけ","カボチャ","ハロウィン","七五三","松茸","さんま","柿","梨","ぶどう","焼きいも","栗","お月見","落ち葉","イチョウ","紅葉狩り","紅葉","鮭","どんぐり"],
"冬":["冬","冬休み","ポインセチア","クリスマスリース","クリスマスプレゼント","クリスマスケーキ","クリスマスツリー","クリスマスパーティー","サンタクロース","クリスマス","雪だるま","そり","スケート","スノーボード","スキー","雪","鍋","みかん","手袋","マフラー","こたつ"],
"年末年始":["年末年始","除夜の鐘","カウントダウン","帰省中です","昨年は大変お世話になりました","よいお年を","大晦日","年越し","今年もよろしく（ことよろ）","正月太り","おせち","お年玉","初夢","初日の出","年賀状","抱負","おみくじ","初詣","元旦","賀正","あけましておめでとう","うま年","2026","รดน้ำดำหัว","สงกรานต์","สาดน้ำ","สวัสดีปีใหม่ไทย","お正月","謹賀新年"],
"動物":["イルカ","ペンギン","カワウソ","アザラシ","ゴリラ","サル","トラ","ライオン","ゾウ","キリン","パンダ","コアラ","クマ","ブタ","ヒツジ","ウマ","ウシ","トリ","ハリネズミ","ハムスター","ウサギ","イヌ","ネコ","アルパカ","ネズミ"],
"その他":["สายย่อ","電話","sikat","連絡","誕生日","幹嘛","kacau","パリピ","合格","กราบ","ไปเล่นตรงโน้น","意味不明","狂","遅刻","毒舌","最低","สาธุ","100点","加ー","โลกสวย","今","ギャグ","นกตลอด","プレゼント","随便","返信不要","都你的毛","เลือก","感人","貧乏","既読","ピクニック","แม่คือแม่","既読無視","sosor","เอาที่สบายใจ","キス","未読","変顔","崩潰","方言","飲み会","yaelah","顔文字","メモ","雨","神","แบร์","โอ้พระเจ้า","คนน่า","ハグ","真顔","体調不良","capekdeh"]
};

// Flatten tag pool
const ALL_TAGS = [];
const TAG_CATEGORIES = {};
for (const [cat, tags] of Object.entries(TAG_POOL_DATA)) {
  for (const t of tags) {
    ALL_TAGS.push(t);
    TAG_CATEGORIES[t] = cat;
  }
}

let currentEditStamp = null;
let currentEditTags = [];

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
    if (tab.dataset.tab === 'list') renderSavedList();
  });
});

function showStatus(msg, isError = false) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status' + (isError ? ' error' : '');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 2500);
}

// Generate stamp rows
document.getElementById('generateBtn').addEventListener('click', () => {
  const count = parseInt(document.getElementById('stampCount').value) || 8;
  generateRows(count);
});

function generateRows(count, data = {}) {
  const list = document.getElementById('stampList');
  list.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const tags = data[String(i)] || [];
    const row = document.createElement('div');
    row.className = 'stamp-item';
    row.innerHTML = `
      <div class="stamp-header">
        <span class="num">#${i}</span>
        <span class="tag-count">${tags.length}/9</span>
      </div>
      <div class="selected-tags" data-num="${i}">
        ${tags.map(t => `<span class="tag-chip" data-tag="${t}">${t}</span>`).join('')}
      </div>
      <button class="tag-picker-btn" data-num="${i}">+ タグを選択</button>
    `;
    list.appendChild(row);

    row.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => { chip.remove(); updateStampCount(row); });
    });
    row.querySelector('.tag-picker-btn').addEventListener('click', () => openTagPicker(i));
  }
}

function updateStampCount(row) {
  const chips = row.querySelectorAll('.tag-chip');
  row.querySelector('.tag-count').textContent = `${chips.length}/9`;
}

// Tag Picker Modal
function openTagPicker(stampNum) {
  currentEditStamp = stampNum;
  const container = document.querySelector(`.selected-tags[data-num="${stampNum}"]`);
  currentEditTags = Array.from(container.querySelectorAll('.tag-chip')).map(c => c.dataset.tag);

  document.getElementById('modalStampNum').textContent = stampNum;
  document.getElementById('tagSearch').value = '';
  document.getElementById('catFilter').value = 'all';
  renderTagOptions('', 'all');
  document.getElementById('tagModal').classList.add('active');
  document.getElementById('tagSearch').focus();
}

function renderTagOptions(filter, category) {
  const container = document.getElementById('tagOptions');
  const lowerFilter = filter.toLowerCase();

  let tagsToShow = category === 'all' ? ALL_TAGS : (TAG_POOL_DATA[category] || []);
  if (filter) {
    tagsToShow = tagsToShow.filter(t => t.toLowerCase().includes(lowerFilter));
  }

  container.innerHTML = tagsToShow.map(t => {
    const isSelected = currentEditTags.includes(t);
    const isDisabled = !isSelected && currentEditTags.length >= 9;
    let cls = 'tag-option';
    if (isSelected) cls += ' selected';
    if (isDisabled) cls += ' disabled';
    return `<span class="${cls}" data-tag="${t}">${t}</span>`;
  }).join('');

  document.getElementById('modalCount').textContent = currentEditTags.length;

  container.querySelectorAll('.tag-option').forEach(el => {
    el.addEventListener('click', () => {
      const tag = el.dataset.tag;
      if (el.classList.contains('disabled')) return;
      if (el.classList.contains('selected')) {
        currentEditTags = currentEditTags.filter(t => t !== tag);
      } else {
        if (currentEditTags.length >= 9) return;
        currentEditTags.push(tag);
      }
      renderTagOptions(document.getElementById('tagSearch').value, document.getElementById('catFilter').value);
    });
  });
}

document.getElementById('tagSearch').addEventListener('input', (e) => {
  renderTagOptions(e.target.value, document.getElementById('catFilter').value);
});

document.getElementById('catFilter').addEventListener('change', (e) => {
  renderTagOptions(document.getElementById('tagSearch').value, e.target.value);
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('tagModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('tagModal')) closeModal();
});
function closeModal() { document.getElementById('tagModal').classList.remove('active'); }

document.getElementById('modalDone').addEventListener('click', () => {
  const container = document.querySelector(`.selected-tags[data-num="${currentEditStamp}"]`);
  container.innerHTML = currentEditTags.map(t => `<span class="tag-chip" data-tag="${t}">${t}</span>`).join('');
  container.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => { chip.remove(); updateStampCount(container.closest('.stamp-item')); });
  });
  updateStampCount(container.closest('.stamp-item'));
  closeModal();
});

// Save
document.getElementById('saveBtn').addEventListener('click', () => {
  const data = collectData();
  chrome.storage.local.set({ [getStorageKey()]: data }, () => showStatus('保存しました'));
});

// Clear
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('全てのタグデータを削除しますか？')) {
    chrome.storage.local.remove(getStorageKey(), () => {
      generateRows(parseInt(document.getElementById('stampCount').value) || 8);
      showStatus('削除しました');
    });
  }
});

function collectData() {
  const data = {};
  document.querySelectorAll('.selected-tags[data-num]').forEach(container => {
    const num = container.dataset.num;
    const tags = Array.from(container.querySelectorAll('.tag-chip')).map(c => c.dataset.tag);
    if (tags.length > 0) data[num] = tags;
  });
  return data;
}

// --- Unified table parser (MD/CSV) ---
function parseTableText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // Detect format: pipe-delimited (MD) or comma-delimited (CSV)
  const isMD = lines[0].includes('|');

  function splitRow(line) {
    if (isMD) {
      return line.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - (line.endsWith('|') ? 1 : 0));
    }
    // CSV: handle quoted fields
    const result = []; let cur = ''; let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = ''; }
      else { cur += ch; }
    }
    result.push(cur.trim());
    return result;
  }

  // Find header
  let headerIdx = -1;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const cols = splitRow(lines[i]);
    const hasNo = cols.some(c => /^No\.?$/i.test(c.trim()));
    const hasTag = cols.some(c => /LINEタグ|^タグ$/i.test(c.trim()));
    if (hasNo && hasTag) { headerIdx = i; break; }
  }
  if (headerIdx === -1) return null;

  const headerCols = splitRow(lines[headerIdx]);
  const noIdx = headerCols.findIndex(c => /^No\.?$/i.test(c.trim()));
  const tagIdx = headerCols.findIndex(c => /LINEタグ|^タグ$/i.test(c.trim()));

  const data = {};
  let imported = 0;
  const skippedTags = [];

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (isMD && /^[\s|:-]+$/.test(line)) continue; // separator row
    const cols = splitRow(line);
    if (cols.length <= Math.max(noIdx, tagIdx)) continue;

    const numMatch = cols[noIdx]?.match(/(\d+)/);
    if (!numMatch) continue;
    const num = numMatch[1];

    const tagStr = cols[tagIdx] || '';
    const rawTags = tagStr.split(/[、,，]/).map(t => t.replace(/\*+/g, '').replace(/※.*$/, '').trim()).filter(Boolean);
    const validTags = rawTags.filter(t => ALL_TAGS.includes(t));
    const invalidTags = rawTags.filter(t => !ALL_TAGS.includes(t) && t.length > 0);

    if (validTags.length > 0) {
      data[num] = validTags.slice(0, 9);
      imported++;
    }
    skippedTags.push(...invalidTags);
  }

  return imported > 0 ? { data, imported, skippedTags: [...new Set(skippedTags)] } : null;
}

function applyImportResult(result, resultElId) {
  if (!result) { showStatus('タグを抽出できませんでした', true); return; }
  const { data, imported, skippedTags } = result;
  chrome.storage.local.set({ [getStorageKey()]: data }, () => {
    const maxNum = Math.max(...Object.keys(data).map(Number), 8);
    document.getElementById('stampCount').value = maxNum;
    generateRows(maxNum, data);

    let msg = `${imported}個のスタンプのタグを取り込みました`;
    if (skippedTags.length > 0) {
      msg += `\n未対応タグ: ${skippedTags.slice(0, 10).join('、')}`;
      if (skippedTags.length > 10) msg += `…他${skippedTags.length - 10}件`;
    }
    document.getElementById(resultElId).textContent = msg;
    showStatus(`${imported}個取り込み完了`);
  });
}

// Import from pasted text
document.getElementById('importBungenBtn').addEventListener('click', () => {
  const text = document.getElementById('bungenText').value.trim();
  if (!text) { showStatus('テキストを貼り付けてください', true); return; }
  applyImportResult(parseTableText(text), 'importResult');
});

// --- Drag & Drop / File import ---
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
dropZone.addEventListener('drop', (e) => {
  e.preventDefault(); dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});
dropZone.addEventListener('click', (e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') fileInput.click(); });
fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); fileInput.value = ''; });

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['txt', 'md', 'csv', 'json'].includes(ext)) {
    showStatus('対応していないファイル形式です', true); return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    if (ext === 'json') {
      try {
        const data = JSON.parse(text);
        for (const [k, v] of Object.entries(data)) {
          if (!Array.isArray(v)) throw new Error(`キー "${k}" の値は配列である必要があります`);
        }
        chrome.storage.local.set({ [getStorageKey()]: data }, () => {
          const maxNum = Math.max(...Object.keys(data).map(Number), 8);
          document.getElementById('stampCount').value = maxNum;
          generateRows(maxNum, data);
          document.getElementById('importResult').textContent = `${file.name} から ${Object.keys(data).length}個のスタンプを取り込みました`;
          showStatus('JSONインポート完了');
        });
      } catch (e) { showStatus('JSON形式が不正です: ' + e.message, true); }
    } else {
      // MD, TXT, CSV → table parse
      const result = parseTableText(text);
      if (result) {
        document.getElementById('importResult').textContent = `${file.name}: `;
        applyImportResult(result, 'importResult');
      } else {
        showStatus(`${file.name}: 「No」と「LINEタグ/タグ」列が見つかりません`, true);
      }
    }
  };
  reader.readAsText(file);
}

// Export
document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.storage.local.get(getStorageKey(), (result) => {
    document.getElementById('ioText').value = JSON.stringify(result[STORAGE_KEY] || {}, null, 2);
    showStatus('エクスポートしました');
  });
});

// Import
document.getElementById('importBtn').addEventListener('click', () => {
  try {
    const data = JSON.parse(document.getElementById('ioText').value.trim());
    for (const [k, v] of Object.entries(data)) {
      if (!Array.isArray(v)) throw new Error(`キー "${k}" の値は配列である必要があります`);
    }
    chrome.storage.local.set({ [getStorageKey()]: data }, () => {
      const maxNum = Math.max(...Object.keys(data).map(Number), 8);
      document.getElementById('stampCount').value = maxNum;
      generateRows(maxNum, data);
      showStatus('インポートしました');
    });
  } catch (e) {
    showStatus('JSON形式が不正です: ' + e.message, true);
  }
});

// Saved list
function renderSavedList() {
  chrome.storage.local.get(getStorageKey(), (result) => {
    const data = result[STORAGE_KEY] || {};
    const list = document.getElementById('savedList');
    const entries = Object.entries(data).sort((a, b) => Number(a[0]) - Number(b[0]));
    if (entries.length === 0) {
      list.innerHTML = '<div class="empty-state">タグが登録されていません</div>';
      return;
    }
    list.innerHTML = entries.map(([num, tags]) => `
      <div class="stamp-item">
        <span class="num">#${num}</span>
        <div class="selected-tags">${tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}</div>
      </div>
    `).join('');
  });
}

function loadCurrentMode() {
  const key = getStorageKey();
  chrome.storage.local.get(key, (result) => {
    const data = result[key] || {};
    const maxNum = Math.max(...Object.keys(data).map(Number), 8);
    document.getElementById('stampCount').value = maxNum;
    generateRows(maxNum, data);
  });
  const isEmoji = currentMode === 'emoji';
  document.getElementById('headerIcon').textContent = isEmoji ? '😀' : '🏷️';
  document.getElementById('headerTitle').textContent = isEmoji ? 'LINE Emoji Tag Helper' : 'LINE Stamp Tag Helper';
  document.querySelector('.stamp-count-row label').textContent = isEmoji ? '絵文字数:' : 'スタンプ数:';
}

// Mode toggle
document.getElementById('modeStamp').addEventListener('click', () => {
  currentMode = 'stamp';
  document.getElementById('modeStamp').classList.add('active');
  document.getElementById('modeEmoji').classList.remove('active');
  loadCurrentMode();
});
document.getElementById('modeEmoji').addEventListener('click', () => {
  currentMode = 'emoji';
  document.getElementById('modeEmoji').classList.add('active');
  document.getElementById('modeStamp').classList.remove('active');
  loadCurrentMode();
});

// Init
loadCurrentMode();