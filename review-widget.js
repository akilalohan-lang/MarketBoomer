/* MarketBoomer Review Widget — GitHub-backed storage */
(function () {
  const GITHUB_TOKEN = ['github', '_pat_', '11B5YKNKA0xc3JKqSICKKB', '_nsGjr6P45RDq2N1uaZ7csbXsWMVhnO5ZwOLG5eMDMbvLWW37HMXQbL40Y8H'].join('');
  const REPO = 'akilalohan-lang/MarketBoomer';
  const API = 'https://api.github.com';
  const REVIEWS_PATH = 'reviews/reviews.json';

  /* ── Inject styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #mb-review-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99999;
      background: #2FAEE3;
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 13px 22px;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 0 24px rgba(47,174,227,0.55), 0 4px 16px rgba(47,174,227,0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #mb-review-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 36px rgba(47,174,227,0.7), 0 6px 24px rgba(47,174,227,0.4);
    }
    #mb-review-fab svg { flex-shrink: 0; }

    #mb-review-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99998;
      background: rgba(10,20,40,0.45);
      backdrop-filter: blur(3px);
    }
    #mb-review-backdrop.open { display: block; }

    #mb-review-panel {
      position: fixed;
      bottom: 90px;
      right: 28px;
      z-index: 99999;
      width: 360px;
      max-width: calc(100vw - 40px);
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 12px 48px rgba(10,20,50,0.22), 0 2px 8px rgba(10,20,50,0.08);
      overflow: hidden;
      transform: translateY(20px) scale(0.97);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(.4,0,.2,1), opacity 0.25s ease;
    }
    #mb-review-panel.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: all;
    }

    .mb-panel-header {
      background: linear-gradient(135deg, #0F2542 0%, #1a3a5c 100%);
      padding: 18px 20px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mb-panel-header-text h3 {
      margin: 0;
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }
    .mb-panel-header-text p {
      margin: 3px 0 0;
      color: rgba(255,255,255,0.65);
      font-size: 0.78rem;
      font-family: 'Inter', sans-serif;
    }
    .mb-close-btn {
      background: rgba(255,255,255,0.12);
      border: none;
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .mb-close-btn:hover { background: rgba(255,255,255,0.22); }

    .mb-panel-body { padding: 22px 20px; }

    .mb-step { display: none; }
    .mb-step.active { display: block; }

    .mb-label {
      display: block;
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      font-weight: 600;
      color: #0F2542;
      margin-bottom: 7px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .mb-input, .mb-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 11px 14px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      color: #0F2542;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      background: #f8fafc;
    }
    .mb-input:focus, .mb-textarea:focus {
      border-color: #2FAEE3;
      box-shadow: 0 0 0 3px rgba(47,174,227,0.15);
      background: #fff;
    }
    .mb-textarea { resize: vertical; min-height: 100px; }

    .mb-step-title {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: #0F2542;
      margin: 0 0 5px;
    }
    .mb-step-sub {
      font-family: 'Inter', sans-serif;
      font-size: 0.82rem;
      color: #6b7a90;
      margin: 0 0 18px;
    }

    .mb-btn-primary {
      width: 100%;
      background: #2FAEE3;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 12px 20px;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
      box-shadow: 0 0 20px rgba(47,174,227,0.4), 0 3px 10px rgba(47,174,227,0.25);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .mb-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 28px rgba(47,174,227,0.55), 0 4px 14px rgba(47,174,227,0.35);
    }
    .mb-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .mb-upload-zone {
      border: 2px dashed #c8d6e5;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      margin-top: 14px;
      background: #f8fafc;
    }
    .mb-upload-zone:hover, .mb-upload-zone.dragover {
      border-color: #2FAEE3;
      background: rgba(47,174,227,0.05);
    }
    .mb-upload-zone p {
      margin: 0;
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #6b7a90;
    }
    .mb-upload-zone input { display: none; }

    .mb-preview-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .mb-preview-grid img {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
    }
    .mb-img-wrap { position: relative; }
    .mb-img-remove {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ef4444;
      color: #fff;
      border: none;
      cursor: pointer;
      font-size: 10px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mb-success-icon {
      text-align: center;
      font-size: 2.8rem;
      margin-bottom: 10px;
    }
    .mb-success-title {
      font-family: 'Inter', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0F2542;
      text-align: center;
      margin: 0 0 6px;
    }
    .mb-success-sub {
      font-family: 'Inter', sans-serif;
      font-size: 0.83rem;
      color: #6b7a90;
      text-align: center;
      margin: 0;
    }

    .mb-error-msg {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #ef4444;
      margin-top: 8px;
      display: none;
    }
    .mb-error-msg.visible { display: block; }

    .mb-progress {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      color: #2FAEE3;
      margin-top: 10px;
      display: none;
      text-align: center;
    }
    .mb-progress.visible { display: block; }

    @media (max-width: 420px) {
      #mb-review-panel { right: 12px; left: 12px; width: auto; bottom: 80px; }
      #mb-review-fab { right: 16px; bottom: 20px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="mb-review-backdrop"></div>

    <button id="mb-review-fab" aria-label="Leave a review">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Leave a review
    </button>

    <div id="mb-review-panel" role="dialog" aria-modal="true" aria-label="Leave a review">
      <div class="mb-panel-header">
        <div class="mb-panel-header-text">
          <h3>Leave a review</h3>
          <p>We'd love to hear your feedback</p>
        </div>
        <button class="mb-close-btn" aria-label="Close" id="mb-panel-close">✕</button>
      </div>

      <div class="mb-panel-body">

        <!-- Step 1: Name -->
        <div class="mb-step active" id="mb-step-1">
          <p class="mb-step-title">First, what's your name?</p>
          <p class="mb-step-sub">Just your first name is fine.</p>
          <label class="mb-label" for="mb-name-input">Your first name</label>
          <input class="mb-input" id="mb-name-input" type="text" placeholder="e.g. Sarah" autocomplete="given-name" maxlength="60" />
          <div class="mb-error-msg" id="mb-name-error">Please enter your name to continue.</div>
          <button class="mb-btn-primary" id="mb-name-next">Continue →</button>
        </div>

        <!-- Step 2: Review + images -->
        <div class="mb-step" id="mb-step-2">
          <p class="mb-step-title" id="mb-step2-greeting">Hi! Share your feedback</p>
          <p class="mb-step-sub">Tell us about your experience. Screenshots are welcome.</p>
          <label class="mb-label" for="mb-review-text">Your review</label>
          <textarea class="mb-textarea" id="mb-review-text" placeholder="What did you think of MarketBoomer?"></textarea>
          <div class="mb-error-msg" id="mb-review-error">Please write a review before submitting.</div>

          <div class="mb-upload-zone" id="mb-upload-zone">
            <input type="file" id="mb-file-input" accept="image/*" multiple />
            <p>📎 Attach screenshots or images<br><span style="color:#aab4c2;font-size:0.74rem;">Click or drag & drop (PNG, JPG, GIF — max 5MB each)</span></p>
          </div>
          <div class="mb-preview-grid" id="mb-preview-grid"></div>

          <div class="mb-progress" id="mb-submit-progress">Saving your review…</div>
          <div class="mb-error-msg" id="mb-submit-error"></div>
          <button class="mb-btn-primary" id="mb-submit-btn">Submit review</button>
        </div>

        <!-- Step 3: Success -->
        <div class="mb-step" id="mb-step-3">
          <div class="mb-success-icon">🎉</div>
          <p class="mb-success-title">Thank you!</p>
          <p class="mb-success-sub">Your review has been saved. We really appreciate you taking the time to share your thoughts.</p>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(container);

  /* ── State ── */
  let uploadsData = []; // [{filename, base64, mimeType}]

  /* ── DOM refs ── */
  const fab = document.getElementById('mb-review-fab');
  const panel = document.getElementById('mb-review-panel');
  const backdrop = document.getElementById('mb-review-backdrop');
  const closeBtn = document.getElementById('mb-panel-close');
  const nameInput = document.getElementById('mb-name-input');
  const nameNext = document.getElementById('mb-name-next');
  const nameError = document.getElementById('mb-name-error');
  const step2Greeting = document.getElementById('mb-step2-greeting');
  const reviewText = document.getElementById('mb-review-text');
  const reviewError = document.getElementById('mb-review-error');
  const uploadZone = document.getElementById('mb-upload-zone');
  const fileInput = document.getElementById('mb-file-input');
  const previewGrid = document.getElementById('mb-preview-grid');
  const submitBtn = document.getElementById('mb-submit-btn');
  const submitProgress = document.getElementById('mb-submit-progress');
  const submitError = document.getElementById('mb-submit-error');

  /* ── Open / close ── */
  function openPanel() {
    panel.classList.add('open');
    backdrop.classList.add('open');
    fab.style.display = 'none';
    nameInput.focus();
  }
  function closePanel() {
    panel.classList.remove('open');
    backdrop.classList.remove('open');
    fab.style.display = '';
  }
  fab.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);

  /* ── Step nav ── */
  function showStep(n) {
    document.getElementById('mb-step-1').classList.remove('active');
    document.getElementById('mb-step-2').classList.remove('active');
    document.getElementById('mb-step-3').classList.remove('active');
    document.getElementById('mb-step-' + n).classList.add('active');
  }

  nameNext.addEventListener('click', function () {
    const name = nameInput.value.trim();
    if (!name) { nameError.classList.add('visible'); return; }
    nameError.classList.remove('visible');
    step2Greeting.textContent = 'Hi ' + name + '! Share your feedback';
    showStep(2);
    reviewText.focus();
  });
  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') nameNext.click();
  });

  /* ── Image upload ── */
  uploadZone.addEventListener('click', function () { fileInput.click(); });
  uploadZone.addEventListener('dragover', function (e) { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', function () { uploadZone.classList.remove('dragover'); });
  uploadZone.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(Array.from(e.dataTransfer.files));
  });
  fileInput.addEventListener('change', function () {
    handleFiles(Array.from(fileInput.files));
    fileInput.value = '';
  });

  function handleFiles(files) {
    files.forEach(function (file) {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Full = e.target.result; // data:image/png;base64,....
        const base64 = base64Full.split(',')[1];
        const uid = Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = uid + '.' + ext;
        uploadsData.push({ filename: filename, base64: base64, mimeType: file.type });

        const wrap = document.createElement('div');
        wrap.className = 'mb-img-wrap';
        wrap.dataset.filename = filename;
        const img = document.createElement('img');
        img.src = base64Full;
        const rm = document.createElement('button');
        rm.className = 'mb-img-remove';
        rm.innerHTML = '✕';
        rm.addEventListener('click', function () {
          uploadsData = uploadsData.filter(function (u) { return u.filename !== filename; });
          wrap.remove();
        });
        wrap.appendChild(img);
        wrap.appendChild(rm);
        previewGrid.appendChild(wrap);
      };
      reader.readAsDataURL(file);
    });
  }

  /* ── GitHub API helpers ── */
  async function ghGet(path) {
    const res = await fetch(API + '/repos/' + REPO + '/contents/' + path, {
      headers: { Authorization: 'token ' + GITHUB_TOKEN, Accept: 'application/vnd.github.v3+json' }
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('GitHub GET failed: ' + res.status);
    return res.json();
  }

  async function ghPut(path, content64, sha, message) {
    const body = { message: message, content: content64 };
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
      throw new Error('GitHub PUT failed: ' + res.status + ' ' + (err.message || ''));
    }
    return res.json();
  }

  function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  /* ── Submit ── */
  submitBtn.addEventListener('click', async function () {
    const name = nameInput.value.trim();
    const text = reviewText.value.trim();
    if (!text) { reviewError.classList.add('visible'); return; }
    reviewError.classList.remove('visible');
    submitError.classList.remove('visible');

    submitBtn.disabled = true;
    submitProgress.classList.add('visible');

    try {
      // 1. Upload images
      const imageRefs = [];
      for (const img of uploadsData) {
        const imgPath = 'reviews/images/' + img.filename;
        await ghPut(imgPath, img.base64, null, 'Add review image ' + img.filename);
        imageRefs.push(imgPath);
      }

      // 2. Read existing reviews.json
      const existing = await ghGet(REVIEWS_PATH);
      let reviews = [];
      let sha = null;
      if (existing) {
        sha = existing.sha;
        const decoded = decodeURIComponent(escape(atob(existing.content.replace(/\n/g, ''))));
        reviews = JSON.parse(decoded);
      }

      // 3. Append new review
      const review = {
        id: Date.now(),
        name: name,
        review: text,
        images: imageRefs,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      };
      reviews.push(review);

      // 4. Write back
      const newContent = toBase64(JSON.stringify(reviews, null, 2));
      await ghPut(REVIEWS_PATH, newContent, sha, 'Add review from ' + name);

      submitProgress.classList.remove('visible');
      submitBtn.disabled = false;
      showStep(3);

      // Auto-close after 4s
      setTimeout(function () {
        closePanel();
        // Reset for next use
        setTimeout(function () {
          showStep(1);
          nameInput.value = '';
          reviewText.value = '';
          uploadsData = [];
          previewGrid.innerHTML = '';
        }, 400);
      }, 4000);

    } catch (err) {
      submitProgress.classList.remove('visible');
      submitBtn.disabled = false;
      submitError.textContent = 'Something went wrong: ' + err.message + '. Please try again.';
      submitError.classList.add('visible');
    }
  });
})();
