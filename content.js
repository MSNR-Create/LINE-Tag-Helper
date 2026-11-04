// --- Content Script: LINE Creators Market Tag Helper ---
(function () {
  // Only run on tag editing pages
  if (!window.location.pathname.endsWith('/tag')) return;

  const isEmoji = window.location.pathname.includes('/emoji/');
  const STORAGE_KEY = isEmoji ? 'lineEmojiTags' : 'lineStampTags';
  const HASH_PAD = isEmoji ? 3 : 2;
  const MAX_TAGS = 9;

  function getCurrentStampNumber() {
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/(\d+)/);
      if (match) return String(parseInt(match[1]));
    }
    const select = document.querySelector('select');
    if (select) {
      const text = select.options?.[select.selectedIndex]?.text || select.value;
      if (text) {
        const match = text.match(/(\d+)/);
        if (match) return String(parseInt(match[1]));
      }
    }
    return null;
  }

  function getAvailableTags() {
    const tags = {};
    document.querySelectorAll('label.cm-product-image-tag').forEach(label => {
      const nameEl = label.querySelector('.cm-product-image-tag-name-text[data-test="tag-name"]');
      const checkbox = label.querySelector('input[type="checkbox"]');
      if (nameEl && checkbox) {
        tags[nameEl.textContent.trim()] = { checkbox, label };
      }
    });
    return tags;
  }

  function getCheckedCount() {
    return document.querySelectorAll('label.cm-product-image-tag input[type="checkbox"]:checked').length;
  }

  function clickTag(tag, expectedChecked) {
    return new Promise((resolve) => {
      if (tag.checkbox.checked === expectedChecked) {
        resolve(true);
        return;
      }
      // 要素をビューポートに入れてからクリック
      tag.label.scrollIntoView({ behavior: 'instant', block: 'center' });
      setTimeout(() => {
        tag.label.click();
        let attempts = 0;
        const check = () => {
          if (tag.checkbox.checked === expectedChecked) {
            resolve(true);
          } else if (attempts++ < 40) {
            setTimeout(check, 100);
          } else {
            resolve(false);
          }
        };
        setTimeout(check, 200);
      }, 150);
    });
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function findSaveButton() {
    // 「登録」「保存」「タグを登録」などのボタンを探す
    const candidates = document.querySelectorAll('button, input[type="submit"], a[role="button"]');
    for (const el of candidates) {
      const text = el.textContent.trim();
      if (/登録|保存|register|save/i.test(text) && !el.disabled) {
        return el;
      }
    }
    return null;
  }

  async function applyTags(tagsToSet, mode) {
    const available = getAvailableTags();
    const matched = [];
    const unmatched = [];

    for (const tagName of tagsToSet) {
      if (available[tagName]) {
        matched.push(tagName);
      } else {
        unmatched.push(tagName);
      }
    }

    const SAVE_WAIT = parseInt(document.querySelector('.lst-interval')?.value || '700', 10);

    if (mode === 'replace') {
      const checkedNames = Object.entries(available)
        .filter(([, tag]) => tag.checkbox.checked)
        .map(([name]) => name);
      for (const name of checkedNames) {
        const fresh = getAvailableTags();
        const tag = fresh[name];
        if (tag?.checkbox.checked) {
          await clickTag(tag, false);
          await sleep(SAVE_WAIT);
        }
      }
    }

    let applied = 0;
    for (let i = 0; i < matched.length; i++) {
      // 毎回最新のDOM参照を取得（クリック後の再レンダリング対策）
      const fresh = getAvailableTags();
      const tag = fresh[matched[i]];
      if (!tag) continue;
      if (!tag.checkbox.checked) {
        const ok = await clickTag(tag, true);
        if (ok) applied++;
        await sleep(SAVE_WAIT);
      }
    }

    return { applied, matched: matched.length, unmatched };
  }

  async function navigateToStamp(targetNum) {
    const padded = String(targetNum).padStart(HASH_PAD, '0');
    window.location.hash = '#/' + padded;
    await sleep(800);

    const select = document.querySelector('select');
    if (select) {
      for (const opt of select.options) {
        if (opt.text.trim() === padded || opt.value === padded) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          await sleep(500);
          break;
        }
      }
    }

    await sleep(500);
    return parseInt(getCurrentStampNumber()) === targetNum;
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'lst-helper-panel';
    panel.innerHTML = `
      <div class="lst-header">
        <span>${isEmoji ? '😀' : '🏷️'} Tag Helper${isEmoji ? ' (絵文字)' : ''}</span>
        <button class="lst-minimize" title="最小化">−</button>
        <button class="lst-close" title="閉じる">×</button>
      </div>
      <div class="lst-body">
        <div class="lst-info">
          <span class="lst-stamp-num">スタンプ: ---</span>
          <span class="lst-detected"></span>
        </div>
        <div class="lst-tags-preview"></div>
        <div class="lst-controls">
          <select class="lst-mode">
            <option value="replace">全入れ替え</option>
            <option value="append">不足分追加</option>
          </select>
          <button class="lst-apply-btn">タグ適用</button>
        </div>
        <div class="lst-interval-row">
          <label>間隔: <input class="lst-interval" type="number" value="200" min="200" max="5000" step="100">ms</label>
        </div>
        <div class="lst-apply-all-row">
          <button class="lst-apply-all-btn">全スタンプに順番に適用</button>
        </div>
        <div class="lst-result"></div>
      </div>
    `;
    document.body.appendChild(panel);

    // Draggable
    let isDragging = false, startX, startY, startLeft, startTop;
    const header = panel.querySelector('.lst-header');
    header.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      startX = e.clientX; startY = e.clientY;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panel.style.left = (startLeft + e.clientX - startX) + 'px';
      panel.style.top = (startTop + e.clientY - startY) + 'px';
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    return panel;
  }

  function updatePanel(panel, stampData) {
    const num = getCurrentStampNumber();
    const tags = getAvailableTags();
    const tagCount = Object.keys(tags).length;

    panel.querySelector('.lst-stamp-num').textContent = `スタンプ: #${num || '?'}`;
    panel.querySelector('.lst-detected').textContent = `(${tagCount}個検出)`;

    const preview = panel.querySelector('.lst-tags-preview');
    if (num && stampData[num]) {
      preview.innerHTML = stampData[num]
        .map(t => {
          const found = tags[t];
          const cls = found ? 'lst-tag-chip' : 'lst-tag-chip lst-tag-missing';
          return `<span class="${cls}">${t}${found ? '' : ' ✗'}</span>`;
        })
        .join('');
    } else {
      preview.innerHTML = '<span class="lst-no-tags">このスタンプにタグ未設定</span>';
    }
  }

  function showResult(panel, msg, isError = false) {
    const el = panel.querySelector('.lst-result');
    el.textContent = msg;
    el.style.color = isError ? '#ff4757' : '#06c755';
  }

  function init() {
    console.log('[Tag Helper] Content script loaded on:', window.location.href);
    let retries = 0;
    const waitForPage = () => {
      const tags = getAvailableTags();
      console.log('[Tag Helper] Waiting for tags...', Object.keys(tags).length);
      if (Object.keys(tags).length > 0) {
        console.log('[Tag Helper] Tags found, setting up panel');
        setup();
      } else if (retries++ < 30) {
        setTimeout(waitForPage, 500);
      } else {
        console.log('[Tag Helper] Gave up waiting for tags');
      }
    };
    waitForPage();
  }

  function setup() {
    const panel = createPanel();
    let stampData = {};

    chrome.storage.local.get(STORAGE_KEY, (result) => {
      stampData = result[STORAGE_KEY] || {};
      updatePanel(panel, stampData);
    });

    chrome.storage.onChanged.addListener((changes) => {
      if (changes[STORAGE_KEY]) {
        stampData = changes[STORAGE_KEY].newValue || {};
        updatePanel(panel, stampData);
      }
    });

    // Minimize
    let minimized = false;
    panel.querySelector('.lst-minimize').addEventListener('click', () => {
      minimized = !minimized;
      panel.querySelector('.lst-body').style.display = minimized ? 'none' : 'block';
      panel.querySelector('.lst-minimize').textContent = minimized ? '+' : '−';
    });

    // Close
    panel.querySelector('.lst-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    // Apply
    panel.querySelector('.lst-apply-btn').addEventListener('click', async () => {
      const num = getCurrentStampNumber();
      if (!num || !stampData[num]) {
        showResult(panel, `スタンプ #${num || '?'} のタグデータがありません`, true);
        return;
      }
      const mode = panel.querySelector('.lst-mode').value;
      const btn = panel.querySelector('.lst-apply-btn');
      btn.disabled = true;
      btn.textContent = '適用中...';

      try {
        const result = await applyTags(stampData[num], mode);
        let msg = `${result.applied}個のタグを適用`;
        if (result.unmatched.length > 0) {
          msg += ` (未対応: ${result.unmatched.join(', ')})`;
        }
        showResult(panel, msg);
      } catch (e) {
        showResult(panel, 'エラー: ' + e.message, true);
      }
      btn.disabled = false;
      btn.textContent = 'タグ適用';
    });

    // Apply all
    panel.querySelector('.lst-apply-all-btn').addEventListener('click', async () => {
      const mode = panel.querySelector('.lst-mode').value;
      const btn = panel.querySelector('.lst-apply-all-btn');
      const applyBtn = panel.querySelector('.lst-apply-btn');
      btn.disabled = true;
      applyBtn.disabled = true;

      const nums = Object.keys(stampData).map(Number).sort((a, b) => a - b);
      const total = nums.length;
      let applied = 0;

      for (const num of nums) {
        btn.textContent = `処理中... (${applied + 1}/${total})`;
        showResult(panel, `スタンプ #${num} を処理中...`);

        const ok = await navigateToStamp(num);
        if (!ok) continue;

        try {
          await applyTags(stampData[String(num)], mode);
          applied++;
        } catch (e) { /* continue */ }
        await sleep(1200);
      }

      showResult(panel, `${applied}/${total} スタンプにタグを適用`);
      btn.disabled = false;
      applyBtn.disabled = false;
      btn.textContent = '全スタンプに順番に適用';
      updatePanel(panel, stampData);
    });

    // Watch hash changes only (lightweight)
    window.addEventListener('hashchange', () => {
      setTimeout(() => updatePanel(panel, stampData), 500);
    });

    // NO MutationObserver - avoid performance issues
  }

  init();
})();
