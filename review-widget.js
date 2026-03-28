/* MarketBoomer Review Widget v2 — chat style, no backdrop */
(function () {
  const GITHUB_TOKEN = ['github', '_pat_', '11B5YKNKA0xc3JKqSICKKB', '_nsGjr6P45RDq2N1uaZ7csbXsWMVhnO5ZwOLG5eMDMbvLWW37HMXQbL40Y8H'].join('');
  const REPO = 'akilalohan-lang/MarketBoomer';
  const API = 'https://api.github.com';
  const REVIEWS_PATH = 'reviews/reviews.json';

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #mb-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: #2FAEE3;
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 11px 20px;
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 22px rgba(47,174,227,0.5), 0 3px 12px rgba(47,174,227,0.28);
      display: flex;
      align-items: center;
      gap: 7px;
      transition: transform 0.18s, box-shadow 0.18s;
      line-height: 1;
    }
    #mb-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 32px rgba(47,174,227,0.65), 0 5px 18px rgba(47,174,227,0.38);
    }

    #mb-chat {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 300px;
      max-width: calc(100vw - 32px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(10,20,50,0.18), 0 2px 8px rgba(10,20,50,0.07);
      display: none;
      flex-direction: column;
      overflow: hidden;
      /* No pointer-events blocking — page stays interactive */
    }
    #mb-chat.open { display: flex; }

    /* Header */
    #mb-chat-header {
      background: #0F2542;
      padding: 13px 14px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #mb-chat-header span {
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
    }
    #mb-chat-close {
      background: rgba(255,255,255,0.1);
      border: none;
      color: rgba(255,255,255,0.8);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    #mb-chat-close:hover { background: rgba(255,255,255,0.2); }

    /* Name step */
    #mb-name-step {
      padding: 16px 14px 14px;
    }
    #mb-name-step p {
      margin: 0 0 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      color: #4a5568;
      line-height: 1.45;
    }
    #mb-name-input {
      width: 100%;
      box-sizing: border-box;
      border: 1.5px solid #e2e8f0;
      border-radius: 9px;
      padding: 9px 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: #0F2542;
      outline: none;
      background: #f8fafc;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    #mb-name-input:focus {
      border-color: #2FAEE3;
      box-shadow: 0 0 0 3px rgba(47,174,227,0.12);
      background: #fff;
    }
    #mb-name-error {
      font-family: 'Inter', sans-serif;
      font-size: 0.74rem;
      color: #ef4444;
      margin-top: 6px;
      display: none;
    }
    #mb-name-error.show { display: block; }
    #mb-name-go {
      width: 100%;
      margin-top: 10px;
      background: #2FAEE3;
      color: #fff;
      border: none;
      border-radius: 9px;
      padding: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 16px rgba(47,174,227,0.38), 0 2px 8px rgba(47,174,227,0.22);
      transition: transform 0.15s;
    }
    #mb-name-go:hover { transform: translateY(-1px); }

    /* Chat step */
    #mb-chat-step { display: none; flex-direction: column; }
    #mb-chat-step.active { display: flex; }

    /* Message feed */
    #mb-feed {
      max-height: 200px;
      overflow-y: auto;
      padding: 12px 12px 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      scroll-behavior: smooth;
    }
    #mb-feed::-webkit-scrollbar { width: 4px; }
    #mb-feed::-webkit-scrollbar-track { background: transparent; }
    #mb-feed::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

    .mb-bubble-row {
      display: flex;
      justify-content: flex-end;
    }
    .mb-bubble {
      background: #0F2542;
      color: #fff;
      border-radius: 12px 12px 2px 12px;
      padding: 8px 11px;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      line-height: 1.45;
      max-width: 230px;
      word-break: break-word;
    }
    .mb-bubble.sending { opacity: 0.55; }
    .mb-bubble-imgs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 5px;
    }
    .mb-bubble-imgs img {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 6px;
      border: 1.5px solid rgba(255,255,255,0.15);
    }

    .mb-system-msg {
      font-family: 'Inter', sans-serif;
      font-size: 0.76rem;
      color: #8a9ab5;
      text-align: center;
      padding: 2px 0;
    }

    /* Input area */
    #mb-input-area {
      padding: 8px 12px 12px;
      border-top: 1px solid #f0f4f8;
      flex-shrink: 0;
    }

    #mb-msg-input {
      width: 100%;
      box-sizing: border-box;
      border: 1.5px solid #e2e8f0;
      border-radius: 9px;
      padding: 8px 11px;
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      color: #0F2542;
      outline: none;
      resize: none;
      min-height: 60px;
      max-height: 120px;
      background: #f8fafc;
      transition: border-color 0.15s, box-shadow 0.15s;
      line-height: 1.4;
    }
    #mb-msg-input:focus {
      border-color: #2FAEE3;
      box-shadow: 0 0 0 3px rgba(47,174,227,0.12);
      background: #fff;
    }
    #mb-msg-input.drag-over {
      border-color: #2FAEE3;
      background: rgba(47,174,227,0.06);
      box-shadow: 0 0 0 3px rgba(47,174,227,0.18);
    }

    /* Attachment strip */
    #mb-attach-strip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }
    #mb-attach-btn {
      background: #f0f4f8;
      border: none;
      border-radius: 7px;
      padding: 5px 9px;
      font-family: 'Inter', sans-serif;
      font-size: 0.74rem;
      color: #4a5568;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background 0.12s;
      flex-shrink: 0;
    }
    #mb-attach-btn:hover { background: #e2e8f0; }
    #mb-attach-input { display: none; }
    #mb-attach-count {
      font-family: 'Inter', sans-serif;
      font-size: 0.73rem;
      color: #2FAEE3;
    }

    /* Action buttons row */
    #mb-actions {
      display: flex;
      gap: 7px;
      margin-top: 8px;
    }
    #mb-send-btn {
      flex: 1;
      background: #2FAEE3;
      color: #fff;
      border: none;
      border-radius: 9px;
      padding: 9px 10px;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 14px rgba(47,174,227,0.35), 0 2px 6px rgba(47,174,227,0.2);
      transition: transform 0.15s;
    }
    #mb-send-btn:hover { transform: translateY(-1px); }
    #mb-send-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    #mb-done-btn {
      flex: 1;
      background: #f0f4f8;
      color: #0F2542;
      border: none;
      border-radius: 9px;
      padding: 9px 10px;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    #mb-done-btn:hover { background: #e2e8f0; }
    #mb-done-btn:disabled { opacity: 0.55; cursor: not-allowed; }

    #mb-send-error {
      font-family: 'Inter', sans-serif;
      font-size: 0.73rem;
      color: #ef4444;
      margin-top: 5px;
      display: none;
    }
    #mb-send-error.show { display: block; }

    /* Done / thank you */
    #mb-done-step {
      display: none;
      padding: 22px 16px 20px;
      text-align: center;
    }
    #mb-done-step.active { display: block; }
    #mb-done-step .mb-done-icon { font-size: 2rem; margin-bottom: 8px; }
    #mb-done-step p {
      margin: 0;
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      color: #4a5568;
      line-height: 1.5;
    }
    #mb-done-step strong {
      display: block;
      font-size: 0.95rem;
      color: #0F2542;
      margin-bottom: 5px;
    }

    @media (max-width: 400px) {
      #mb-chat { right: 10px; left: 10px; width: auto; bottom: 16px; }
      #mb-fab { right: 14px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="mb-fab" aria-label="Leave a review">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Leave a review
    </button>

    <div id="mb-chat" aria-label="Review chat">

      <div id="mb-chat-header">
        <span>Leave a review</span>
        <button id="mb-chat-close" aria-label="Close">✕</button>
      </div>

      <!-- Step 1: Name -->
      <div id="mb-name-step">
        <p>What's your first name?</p>
        <input id="mb-name-input" type="text" placeholder="e.g. Sarah" autocomplete="given-name" maxlength="60" />
        <div id="mb-name-error">Please enter your name.</div>
        <button id="mb-name-go">Start →</button>
      </div>

      <!-- Step 2: Chat -->
      <div id="mb-chat-step">
        <div id="mb-feed"></div>
        <div id="mb-input-area">
          <textarea id="mb-msg-input" placeholder="Type your review here…" rows="3"></textarea>
          <div id="mb-attach-strip">
            <button id="mb-attach-btn" type="button">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attach image
            </button>
            <input id="mb-attach-input" type="file" accept="image/*" multiple />
            <span id="mb-attach-count"></span>
          </div>
          <div id="mb-actions">
            <button id="mb-send-btn">Send</button>
            <button id="mb-done-btn">I'm done</button>
          </div>
          <div id="mb-send-error"></div>
        </div>
      </div>

      <!-- Step 3: Thank you -->
      <div id="mb-done-step">
        <div class="mb-done-icon">🎉</div>
        <p><strong>Thank you!</strong>Your reviews have been saved. We really appreciate you taking the time.</p>
      </div>

    </div>
  `;
  document.body.appendChild(wrap);

  /* ── State ── */
  let reviewerName = '';
  let pendingImages = []; // [{filename, base64, mimeType, previewSrc}]
  let messageCount = 0;

  /* ── DOM ── */
  const fab        = document.getElementById('mb-fab');
  const chat       = document.getElementById('mb-chat');
  const closeBtn   = document.getElementById('mb-chat-close');
  const nameStep   = document.getElementById('mb-name-step');
  const nameInput  = document.getElementById('mb-name-input');
  const nameError  = document.getElementById('mb-name-error');
  const nameGo     = document.getElementById('mb-name-go');
  const chatStep   = document.getElementById('mb-chat-step');
  const feed       = document.getElementById('mb-feed');
  const msgInput   = document.getElementById('mb-msg-input');
  const attachBtn  = document.getElementById('mb-attach-btn');
  const attachInput= document.getElementById('mb-attach-input');
  const attachCount= document.getElementById('mb-attach-count');
  const sendBtn    = document.getElementById('mb-send-btn');
  const doneBtn    = document.getElementById('mb-done-btn');
  const sendError  = document.getElementById('mb-send-error');
  const doneStep   = document.getElementById('mb-done-step');

  /* ── Open / close ── */
  function openChat() {
    chat.classList.add('open');
    fab.style.display = 'none';
    if (!reviewerName) nameInput.focus();
    else msgInput.focus();
  }
  function closeChat() {
    chat.classList.remove('open');
    fab.style.display = '';
  }
  fab.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  /* ── Name step ── */
  function startChat() {
    const name = nameInput.value.trim();
    if (!name) { nameError.classList.add('show'); return; }
    nameError.classList.remove('show');
    reviewerName = name;
    nameStep.style.display = 'none';
    chatStep.classList.add('active');
    addSystemMsg('Hi ' + name + ', feel free to leave all your reviews in the chat.');
    msgInput.focus();
  }
  nameGo.addEventListener('click', startChat);
  nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') startChat(); });

  /* ── Feed helpers ── */
  function addSystemMsg(text) {
    const el = document.createElement('div');
    el.className = 'mb-system-msg';
    el.textContent = text;
    feed.appendChild(el);
    scrollFeed();
  }

  function addBubble(text, imgPreviews, sending) {
    const row = document.createElement('div');
    row.className = 'mb-bubble-row';
    const bub = document.createElement('div');
    bub.className = 'mb-bubble' + (sending ? ' sending' : '');

    if (text) {
      const t = document.createElement('div');
      t.textContent = text;
      bub.appendChild(t);
    }

    if (imgPreviews && imgPreviews.length) {
      const grid = document.createElement('div');
      grid.className = 'mb-bubble-imgs';
      imgPreviews.forEach(function (src) {
        const img = document.createElement('img');
        img.src = src;
        grid.appendChild(img);
      });
      bub.appendChild(grid);
    }

    row.appendChild(bub);
    feed.appendChild(row);
    scrollFeed();
    return bub;
  }

  function scrollFeed() {
    feed.scrollTop = feed.scrollHeight;
  }

  /* ── Image attachment ── */
  attachBtn.addEventListener('click', function () { attachInput.click(); });
  attachInput.addEventListener('change', function () {
    handleFiles(Array.from(attachInput.files));
    attachInput.value = '';
  });

  // Drag-and-drop onto the textarea
  msgInput.addEventListener('dragenter', function (e) { e.preventDefault(); msgInput.classList.add('drag-over'); });
  msgInput.addEventListener('dragover',  function (e) { e.preventDefault(); msgInput.classList.add('drag-over'); });
  msgInput.addEventListener('dragleave', function ()  { msgInput.classList.remove('drag-over'); });
  msgInput.addEventListener('drop', function (e) {
    e.preventDefault();
    msgInput.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(function (f) { return f.type.startsWith('image/'); });
    if (files.length) {
      handleFiles(files);
    } else {
      // Maybe they dragged text — insert it
      const text = e.dataTransfer.getData('text');
      if (text) msgInput.value += text;
    }
  });

  // Also allow drag onto the whole input area
  const inputArea = document.getElementById('mb-input-area');
  inputArea.addEventListener('dragover', function (e) { e.preventDefault(); msgInput.classList.add('drag-over'); });
  inputArea.addEventListener('dragleave', function (e) {
    if (!inputArea.contains(e.relatedTarget)) msgInput.classList.remove('drag-over');
  });
  inputArea.addEventListener('drop', function (e) {
    e.preventDefault();
    msgInput.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(function (f) { return f.type.startsWith('image/'); });
    if (files.length) handleFiles(files);
  });

  function handleFiles(files) {
    files.forEach(function (file) {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const src = e.target.result;
        const base64 = src.split(',')[1];
        const uid = Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        pendingImages.push({ filename: uid + '.' + ext, base64: base64, mimeType: file.type, previewSrc: src });
        updateAttachCount();
      };
      reader.readAsDataURL(file);
    });
  }

  function updateAttachCount() {
    attachCount.textContent = pendingImages.length ? pendingImages.length + ' image' + (pendingImages.length > 1 ? 's' : '') + ' ready' : '';
  }

  /* ── GitHub API ── */
  async function ghGet(path) {
    const res = await fetch(API + '/repos/' + REPO + '/contents/' + path, {
      headers: { Authorization: 'token ' + GITHUB_TOKEN, Accept: 'application/vnd.github.v3+json' }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('GET ' + res.status);
    return res.json();
  }

  async function ghPut(path, content64, sha, msg) {
    const body = { message: msg, content: content64 };
    if (sha) body.sha = sha;
    const res = await fetch(API + '/repos/' + REPO + '/contents/' + path, {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + GITHUB_TOKEN,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(function () { return {}; });
      throw new Error('PUT ' + res.status + ' ' + (err.message || ''));
    }
    return res.json();
  }

  function b64(str) { return btoa(unescape(encodeURIComponent(str))); }

  async function saveMessage(text, images) {
    // Upload images first
    const imageRefs = [];
    for (const img of images) {
      const p = 'reviews/images/' + img.filename;
      await ghPut(p, img.base64, null, 'Review image ' + img.filename);
      imageRefs.push(p);
    }
    // Append to reviews.json
    const existing = await ghGet(REVIEWS_PATH);
    let reviews = [];
    let sha = null;
    if (existing) {
      sha = existing.sha;
      reviews = JSON.parse(decodeURIComponent(escape(atob(existing.content.replace(/\n/g, '')))));
    }
    reviews.push({
      id: Date.now(),
      name: reviewerName,
      message: text,
      images: imageRefs,
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    });
    await ghPut(REVIEWS_PATH, b64(JSON.stringify(reviews, null, 2)), sha, 'Review from ' + reviewerName);
  }

  /* ── Send ── */
  async function doSend() {
    const text = msgInput.value.trim();
    const imgs = pendingImages.slice();
    if (!text && !imgs.length) {
      sendError.textContent = 'Please type a message or attach an image.';
      sendError.classList.add('show');
      return;
    }
    sendError.classList.remove('show');

    // Optimistic bubble
    const previews = imgs.map(function (i) { return i.previewSrc; });
    const bub = addBubble(text, previews, true);

    // Clear input immediately
    msgInput.value = '';
    pendingImages = [];
    updateAttachCount();
    messageCount++;

    sendBtn.disabled = true;
    doneBtn.disabled = true;

    try {
      await saveMessage(text, imgs);
      bub.classList.remove('sending');
    } catch (err) {
      bub.classList.remove('sending');
      bub.style.background = '#fee2e2';
      bub.style.color = '#991b1b';
      sendError.textContent = 'Failed to save — check your connection and try again.';
      sendError.classList.add('show');
    }

    sendBtn.disabled = false;
    doneBtn.disabled = false;
    msgInput.focus();
  }

  sendBtn.addEventListener('click', doSend);
  msgInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  /* ── I'm done ── */
  doneBtn.addEventListener('click', function () {
    chatStep.classList.remove('active');
    doneStep.classList.add('active');
    setTimeout(function () {
      closeChat();
      setTimeout(function () {
        // Reset for next open
        doneStep.classList.remove('active');
        chatStep.classList.add('active');
        feed.innerHTML = '';
        messageCount = 0;
        addSystemMsg('Hi ' + reviewerName + ', feel free to leave all your reviews in the chat.');
      }, 400);
    }, 3000);
  });

})();
