// ============================================
// FARM AI BUILDER — Main Application Logic v2.0
// ============================================

(function() {
  'use strict';

  // ── State ──
  let currentPage = 'dashboard';
  let selectedState = null;
  let selectedSeason = null;
  let selectedCategory = 'all';
  let searchQuery = '';
  let pricePage = 0;
  const PRICE_PER_PAGE = 10;

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── DOM Elements ──
  const navTabs = $$('.nav-tab');
  const navIndicator = $('#navIndicator');
  const pages = $$('.page');
  const themeToggle = $('#themeToggle');
  const searchInput = $('#searchInput');
  const statesGrid = $('#statesGrid');
  const stateDetail = $('#stateDetail');
  const detailGrid = $('#detailGrid');
  const detailStateName = $('#detailStateName');
  const detailClose = $('#detailClose');
  const priceTableBody = $('#priceTableBody');
  const mandiGrid = $('#mandiGrid');
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatClear = $('#chatClear');
  const uploadZone = $('#uploadZone');
  const fileInput = $('#fileInput');
  const uploadPreview = $('#uploadPreview');
  const previewImage = $('#previewImage');
  const analyzeBtn = $('#analyzeBtn');
  const diseaseResult = $('#diseaseResult');
  const priceCount = $('#priceCount');
  const pricePrev = $('#pricePrev');
  const priceNext = $('#priceNext');
  const headerTime = $('#headerTime');
  const stateCount = $('#stateCount');

  // ═══════════════════════════════════════
  //  PARTICLE SYSTEM
  // ═══════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDirection * 0.003;
        if (this.opacity > 0.35) this.fadeDirection = -1;
        if (this.opacity < 0.03) this.fadeDirection = 1;
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
          this.reset();
        }
      }
      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(74, 222, 128, ${this.opacity})`
          : `rgba(16, 185, 129, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ═══════════════════════════════════════
  //  INITIALIZE
  // ═══════════════════════════════════════
  function init() {
    initParticles();
    renderStatesGrid();
    renderPriceTable();
    renderMandiGrid();
    bindEvents();
    animateStats();
    updateNavIndicator();
    updateTime();
    setInterval(updateTime, 60000);
    setupScrollEffects();

    // Set current year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ── Time Display ──
  function updateTime() {
    if (!headerTime) return;
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    headerTime.textContent = now.toLocaleTimeString('en-IN', options);
  }

  // ── Scroll Effects ──
  function setupScrollEffects() {
    const header = $('#appHeader');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Navigation Indicator ──
  function updateNavIndicator() {
    if (!navIndicator) return;
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = activeTab.parentElement.getBoundingClientRect();
      navIndicator.style.left = (activeTab.offsetLeft) + 'px';
      navIndicator.style.width = tabRect.width + 'px';
      navIndicator.style.top = '4px';
    }
  }

  // ── Navigation ──
  function switchPage(pageName) {
    currentPage = pageName;
    navTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.page === pageName));
    pages.forEach(page => {
      page.classList.remove('active');
      if (page.id === `page-${pageName}`) {
        page.classList.add('active');
      }
    });
    updateNavIndicator();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Lazy-init Markets page on first visit
    if (pageName === 'markets') {
      initMarketsPage();
    }
  }

  // ── Theme Toggle ──
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');

    const icon = themeToggle.querySelector('.theme-icon');
    icon.style.transform = 'rotate(360deg) scale(0)';
    setTimeout(() => {
      icon.textContent = isDark ? '☀️' : '🌙';
      icon.style.transform = 'rotate(0deg) scale(1)';
    }, 250);

    showToast(isDark ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  }

  // ── Toast Notification ──
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ── Animated Stats ──
  function animateStats() {
    const statesCnt = Object.keys(STATES_DATA).length;
    let mandiCnt = 0;
    Object.values(STATES_DATA).forEach(s => mandiCnt += s.mandis.length);
    animateNumber('statStates', statesCnt);
    animateNumber('statCrops', 50, '+');
    animateNumber('statMandis', mandiCnt, '+');
    animateNumber('statPrices', MARKET_PRICES.length);
  }

  function animateNumber(id, target, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 35);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current + suffix;
    }, 28);
  }

  // ═══════════════════════════════════════
  //  RENDER STATES GRID
  // ═══════════════════════════════════════
  function renderStatesGrid() {
    const states = Object.keys(STATES_DATA).sort();
    const query = searchQuery.toLowerCase();
    let found = 0;

    statesGrid.innerHTML = '';

    states.forEach((stateName, index) => {
      const data = STATES_DATA[stateName];

      // Search filter
      if (query) {
        const matchState = stateName.toLowerCase().includes(query);
        const matchRegion = data.region.toLowerCase().includes(query);
        const matchCrop = Object.values(data.crops).flat().some(c => c.toLowerCase().includes(query));
        const matchMandi = data.mandis.some(m => m.name.toLowerCase().includes(query) || m.location.toLowerCase().includes(query));
        if (!matchState && !matchRegion && !matchCrop && !matchMandi) return;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const categoryCrops = data.crops[selectedCategory];
        if (!categoryCrops || categoryCrops.length === 0) return;
      }

      found++;
      const card = document.createElement('div');
      card.className = `state-card${selectedState === stateName ? ' active' : ''}`;
      card.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`;
      card.innerHTML = `
        <div class="state-name">${stateName}</div>
        <div class="state-region">
          <span class="region-dot ${data.region.toLowerCase()}"></span>
          ${data.region} India
        </div>
      `;
      card.addEventListener('click', () => selectState(stateName));
      statesGrid.appendChild(card);
    });

    if (found === 0) {
      statesGrid.innerHTML = '<div class="no-results">🔍 No states match your search. Try different keywords.</div>';
    }

    // Update state count badge
    if (stateCount) {
      stateCount.textContent = `${found} state${found !== 1 ? 's' : ''}`;
    }
  }

  // ═══════════════════════════════════════
  //  SELECT STATE
  // ═══════════════════════════════════════
  function selectState(stateName) {
    selectedState = stateName;
    const data = STATES_DATA[stateName];

    // Update grid highlighting
    $$('.state-card').forEach(card => {
      card.classList.toggle('active', card.querySelector('.state-name').textContent === stateName);
    });

    // Build detail view
    detailStateName.innerHTML = `📍 ${stateName}`;

    let seasonHTML = '';
    Object.entries(data.seasons).forEach(([key, crops]) => {
      const seasonInfo = SEASONS[key];
      const filteredCrops = selectedSeason && selectedSeason !== key ? [] : crops;
      if (filteredCrops.length === 0 && selectedSeason) return;
      seasonHTML += `
        <div class="detail-card">
          <h4>${seasonInfo.icon} ${seasonInfo.name} Season (${seasonInfo.period})</h4>
          <div class="crop-tags">
            ${(selectedSeason ? filteredCrops : crops).map(c => `<span class="crop-tag">${c}</span>`).join('')}
          </div>
        </div>
      `;
    });

    let cropsHTML = '';
    Object.entries(data.crops).forEach(([cat, crops]) => {
      if (selectedCategory !== 'all' && selectedCategory !== cat) return;
      if (crops.length === 0) return;
      const catInfo = CROP_CATEGORIES[cat];
      cropsHTML += `
        <div class="detail-card">
          <h4>${catInfo.icon} ${catInfo.name}</h4>
          <div class="crop-tags">
            ${crops.map(c => `<span class="crop-tag ${cat}">${c}</span>`).join('')}
          </div>
        </div>
      `;
    });

    detailGrid.innerHTML = `
      <div class="detail-card">
        <h4>🌡️ Climate</h4>
        <p>${data.climate}</p>
        <div style="margin-top: 14px; display: flex; gap: 20px;">
          <div>
            <div class="stat" style="font-size:1.1rem">${data.avgTemp}</div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">Avg Temperature</div>
          </div>
          <div>
            <div class="stat" style="font-size:1.1rem">${data.rainfall}</div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">Annual Rainfall</div>
          </div>
        </div>
      </div>
      <div class="detail-card">
        <h4>🗺️ Region & Capital</h4>
        <p><strong>Region:</strong> ${data.region} India</p>
        <p><strong>Capital:</strong> ${data.capital}</p>
        <p style="margin-top:8px"><strong>Mandis:</strong> ${data.mandis.length} markets listed</p>
      </div>
      ${seasonHTML}
      ${cropsHTML}
    `;

    stateDetail.classList.add('visible');
    stateDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update mandis
    renderMandiGrid();
  }

  // ═══════════════════════════════════════
  //  RENDER PRICE TABLE
  // ═══════════════════════════════════════
  function renderPriceTable() {
    let filtered = [...MARKET_PRICES];

    // Season filter
    if (selectedSeason) {
      filtered = filtered.filter(p => p.season === selectedSeason);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => p.crop.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const total = filtered.length;
    const start = pricePage * PRICE_PER_PAGE;
    const pageItems = filtered.slice(start, start + PRICE_PER_PAGE);

    priceTableBody.innerHTML = '';

    if (pageItems.length === 0) {
      priceTableBody.innerHTML = `<tr><td colspan="5" class="no-results">No prices match current filters</td></tr>`;
    } else {
      pageItems.forEach((item, i) => {
        const trendIcon = item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●';
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${i * 0.04}s`;
        tr.innerHTML = `
          <td><strong>${item.crop}</strong></td>
          <td><span class="category-badge ${item.category}">${CROP_CATEGORIES[item.category].icon} ${CROP_CATEGORIES[item.category].name}</span></td>
          <td class="price-column">₹${item.price.toLocaleString('en-IN')}</td>
          <td><span class="trend-badge ${item.trend}">${trendIcon} ${item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}</span></td>
          <td class="price-column"><span class="trend-badge ${item.trend}">${item.change}</span></td>
        `;
        priceTableBody.appendChild(tr);
      });
    }

    // Update pagination
    const endItem = Math.min(start + PRICE_PER_PAGE, total);
    priceCount.textContent = total > 0 ? `Showing ${start + 1}–${endItem} of ${total}` : 'No results';
    pricePrev.disabled = pricePage === 0;
    priceNext.disabled = start + PRICE_PER_PAGE >= total;
  }

  // ═══════════════════════════════════════
  //  RENDER MANDI GRID
  // ═══════════════════════════════════════
  function renderMandiGrid() {
    mandiGrid.innerHTML = '';
    let allMandis = [];

    Object.entries(STATES_DATA).forEach(([stateName, data]) => {
      // If a state is selected, show only that state's mandis
      if (selectedState && selectedState !== stateName) return;

      data.mandis.forEach(m => {
        allMandis.push({ ...m, state: stateName, region: data.region });
      });
    });

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      allMandis = allMandis.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m.speciality.toLowerCase().includes(q)
      );
    }

    // Limit display
    const displayMandis = allMandis.slice(0, 24);

    if (displayMandis.length === 0) {
      mandiGrid.innerHTML = '<div class="no-results">🔍 No mandis match your search.</div>';
      return;
    }

    displayMandis.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'mandi-card';
      card.style.animationDelay = `${i * 0.04}s`;
      card.innerHTML = `
        <div class="mandi-name">🏪 ${m.name}</div>
        <div class="mandi-location">📍 ${m.location}, ${m.state}</div>
        <div class="mandi-speciality">🏷️ ${m.speciality}</div>
      `;
      mandiGrid.appendChild(card);
    });

    if (allMandis.length > 24) {
      const more = document.createElement('div');
      more.className = 'no-results';
      more.textContent = `Showing 24 of ${allMandis.length} mandis. Select a state or use search to narrow results.`;
      mandiGrid.appendChild(more);
    }
  }

  // ═══════════════════════════════════════
  //  CHAT SYSTEM
  // ═══════════════════════════════════════
  function sendChatMessage(text) {
    if (!text.trim()) return;

    // Add user message
    addMessage('user', text);
    chatInput.value = '';

    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message ai';
    typingEl.innerHTML = `
      <div class="msg-avatar ai">🌱</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response delay
    setTimeout(() => {
      typingEl.remove();
      const response = getAIResponse(text);
      addMessage('ai', response);
    }, 800 + Math.random() * 1200);
  }

  function addMessage(type, content) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;

    const avatar = type === 'ai' ? '🌱' : '👤';

    // Parse markdown-like formatting
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    msg.innerHTML = `
      <div class="msg-avatar ${type}">${avatar}</div>
      <div class="msg-bubble">${html}</div>
    `;

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function clearChat() {
    chatMessages.innerHTML = '';
    // Re-add welcome message
    const welcome = document.createElement('div');
    welcome.className = 'chat-message ai';
    welcome.innerHTML = `
      <div class="msg-avatar ai">🌱</div>
      <div class="msg-bubble">
        <strong>Namaste! 🙏</strong><br><br>
        I'm your <strong>Farm AI Assistant</strong>. I can help you with:<br><br>
        🌾 Crop recommendations<br>
        🐛 Pest & disease management<br>
        🧪 Fertilizer advice<br>
        🌦️ Weather advisory<br>
        💧 Irrigation planning<br>
        🏛️ Government schemes<br><br>
        Ask me anything about farming!
      </div>
    `;
    chatMessages.appendChild(welcome);
    showToast('🧹 Chat cleared');
  }

  // ═══════════════════════════════════════
  //  IMAGE UPLOAD & ANALYSIS
  // ═══════════════════════════════════════
  function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('⚠️ Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      uploadPreview.classList.add('visible');
      uploadZone.style.display = 'none';
      diseaseResult.classList.remove('visible');
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  function analyzeImage() {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div> Analyzing...';

    setTimeout(() => {
      const result = getRandomDisease();
      displayDiseaseResult(result);
      analyzeBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>
        </svg>
        Analyze Crop Image
      `;
      analyzeBtn.disabled = false;
    }, 1500 + Math.random() * 1500);
  }

  function displayDiseaseResult(result) {
    const confidenceNum = parseInt(result.confidence);

    diseaseResult.innerHTML = `
      <div class="result-card">
        <h4>🔬 Disease Detected</h4>
        <div class="result-value">${result.disease}</div>
        <p>Crop: ${result.crop}</p>
        <p style="margin-top: 6px">${result.description}</p>
        <div style="display: flex; gap: 12px; margin-top: 12px; align-items: center; flex-wrap: wrap">
          <span class="severity-badge ${result.severity.toLowerCase().includes('high') ? 'high' : result.severity.toLowerCase().includes('low') ? 'low' : 'moderate'}">
            Severity: ${result.severity}
          </span>
          <span style="font-size: 0.82rem; color: var(--text-muted)">Confidence: ${result.confidence}</span>
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="result-card">
        <h4>🧪 Suggested Fertilizer</h4>
        <p>${result.fertilizer}</p>
      </div>

      <div class="result-card">
        <h4>💊 Recommended Treatment</h4>
        <p>${result.pesticide}</p>
      </div>

      <div class="result-card">
        <h4>💡 Expert Advice</h4>
        <p>${result.advice.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    diseaseResult.classList.add('visible');

    // Animate confidence bar
    setTimeout(() => {
      const fill = diseaseResult.querySelector('.confidence-fill');
      if (fill) fill.style.width = confidenceNum + '%';
    }, 150);
  }

  // ═══════════════════════════════════════
  //  EVENT BINDINGS
  // ═══════════════════════════════════════
  function bindEvents() {
    // Navigation
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => switchPage(tab.dataset.page));
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Season cards
    $$('.season-card').forEach(card => {
      card.addEventListener('click', () => {
        const season = card.dataset.season;
        if (selectedSeason === season) {
          selectedSeason = null;
          card.classList.remove('active');
        } else {
          selectedSeason = season;
          $$('.season-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        if (selectedState) selectState(selectedState);
      });
    });

    // Category filter buttons
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.dataset.category;
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        if (selectedState) selectState(selectedState);
      });
    });

    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        renderMandiGrid();
      }, 200);
    });

    // Close state detail
    detailClose.addEventListener('click', () => {
      stateDetail.classList.remove('visible');
      selectedState = null;
      $$('.state-card').forEach(c => c.classList.remove('active'));
      renderMandiGrid();
    });

    // Price pagination
    pricePrev.addEventListener('click', () => {
      if (pricePage > 0) { pricePage--; renderPriceTable(); }
    });
    priceNext.addEventListener('click', () => {
      pricePage++;
      renderPriceTable();
    });

    // Chat
    chatSend.addEventListener('click', () => sendChatMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(chatInput.value);
    });

    // Chat clear
    if (chatClear) {
      chatClear.addEventListener('click', clearChat);
    }

    // Quick action chips
    $$('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sendChatMessage(chip.dataset.query);
      });
    });

    // Image upload
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
    });
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
    });

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeImage);

    // Reset upload (click preview to re-upload)
    previewImage.addEventListener('click', () => {
      uploadPreview.classList.remove('visible');
      uploadZone.style.display = '';
      diseaseResult.classList.remove('visible');
      fileInput.value = '';
    });

    // Keyboard shortcut: Ctrl+K to focus search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (currentPage === 'dashboard') {
          searchInput.focus();
        } else {
          chatInput.focus();
        }
      }
      // Escape to close detail
      if (e.key === 'Escape') {
        if (stateDetail.classList.contains('visible')) {
          stateDetail.classList.remove('visible');
          selectedState = null;
          $$('.state-card').forEach(c => c.classList.remove('active'));
          renderMandiGrid();
        }
      }
    });

    // Window resize — update nav indicator
    window.addEventListener('resize', () => updateNavIndicator());
  }

  // ═══════════════════════════════════════
  //  NEARBY MARKETS PAGE
  // ═══════════════════════════════════════
  let userLocation = null;
  let nearbyMarkets = [];
  let marketsView = 'map'; // 'map' | 'list'
  let googleMap = null;
  let googleMapMarkers = [];
  let googleInfoWindow = null;
  let marketsInitialized = false;
  const API_BASE = window.location.origin;

  // City coordinates lookup for manual search
  const CITY_COORDS = {
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'patna': { lat: 25.6244, lng: 85.1376 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'kochi': { lat: 9.9312, lng: 76.2673 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'shimla': { lat: 31.1048, lng: 77.1734 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'mysuru': { lat: 12.2958, lng: 76.6394 },
    'nashik': { lat: 20.0063, lng: 73.7903 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'vizag': { lat: 17.6868, lng: 83.2185 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'warangal': { lat: 17.9784, lng: 79.5941 }
  };

  function initMarketsPage() {
    if (marketsInitialized) return;
    marketsInitialized = true;

    // Request geolocation
    requestUserLocation();

    // Bind markets page events
    bindMarketsEvents();
  }

  function requestUserLocation() {
    const locText = document.getElementById('userLocationText');
    const locPulse = document.querySelector('.location-pulse');

    if (!navigator.geolocation) {
      showLocationFallback('Geolocation not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (locText) locText.textContent = `📍 Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
        loadMarketsForLocation(userLocation.lat, userLocation.lng);
      },
      (error) => {
        let msg = 'Location access denied';
        if (error.code === 2) msg = 'Location unavailable';
        if (error.code === 3) msg = 'Location request timed out';
        showLocationFallback(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  function showLocationFallback(msg) {
    const locText = document.getElementById('userLocationText');
    const locPulse = document.querySelector('.location-pulse');
    const fallback = document.getElementById('locationFallback');

    if (locText) locText.textContent = '⚠️ ' + msg;
    if (locPulse) locPulse.classList.add('error');
    if (fallback) fallback.style.display = 'block';
  }

  async function loadMarketsForLocation(lat, lng) {
    const controls = document.getElementById('marketsControls');
    const mapContainer = document.getElementById('marketsMapContainer');
    const listContainer = document.getElementById('marketsListContainer');
    const fallback = document.getElementById('locationFallback');

    if (fallback) fallback.style.display = 'none';
    if (controls) controls.style.display = 'flex';

    try {
      const response = await fetch(`${API_BASE}/api/nearby-markets?lat=${lat}&lng=${lng}&radius=100`);
      const data = await response.json();

      if (data.status === 'ok') {
        nearbyMarkets = data.markets;
        document.getElementById('marketsCount').textContent = data.total;

        // Show current view
        if (marketsView === 'map') {
          if (mapContainer) mapContainer.style.display = 'block';
          if (listContainer) listContainer.style.display = 'none';
          initMap(lat, lng);
        } else {
          if (mapContainer) mapContainer.style.display = 'none';
          if (listContainer) listContainer.style.display = 'grid';
          renderMarketsList();
        }
      } else {
        showToast('⚠️ Could not load markets data');
      }
    } catch (err) {
      // Fallback: show controls anyway with a message
      showToast('⚠️ Server not reachable. Start the server with: cd server && node server.js');
    }
  }

  async function initMap(lat, lng) {
    const mapEl = document.getElementById('marketsMap');
    if (!mapEl) return;

    // Try to load Google Maps
    try {
      const keyRes = await fetch(`${API_BASE}/api/maps-key`);
      const keyData = await keyRes.json();

      if (keyData.status === 'ok' && keyData.key && !window.google) {
        // Load Google Maps API
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${keyData.key}&libraries=places`;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    } catch (e) {
      // No API key or server not available — use fallback
    }

    if (window.google && window.google.maps) {
      renderGoogleMap(lat, lng);
    } else {
      renderFallbackMap(lat, lng);
    }
  }

  function renderGoogleMap(lat, lng) {
    const mapEl = document.getElementById('marketsMap');
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    const darkMapStyle = [
      { elementType: 'geometry', stylers: [{ color: '#0c0d17' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0c0d17' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#5a5e76' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1b2e' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0b18' }] },
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
    ];

    googleMap = new google.maps.Map(mapEl, {
      center: { lat, lng },
      zoom: 9,
      styles: isDark ? darkMapStyle : [],
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    googleInfoWindow = new google.maps.InfoWindow();

    // User location marker
    new google.maps.Marker({
      position: { lat, lng },
      map: googleMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3
      },
      title: 'Your Location',
      zIndex: 100
    });

    // Add market markers
    addGoogleMapMarkers();
  }

  function addGoogleMapMarkers() {
    // Clear old markers
    googleMapMarkers.forEach(m => m.setMap(null));
    googleMapMarkers = [];

    nearbyMarkets.forEach(market => {
      const marker = new google.maps.Marker({
        position: { lat: market.lat, lng: market.lng },
        map: googleMap,
        title: market.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10b981',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        const content = `
          <div class="map-info-window">
            <h4>🏪 ${market.name}</h4>
            <p>📍 ${market.address}</p>
            <p>📞 ${market.phone || 'N/A'}</p>
            <p class="iw-distance">📏 ${market.distance} km away</p>
            <button class="iw-btn" onclick="window._openMarketDetail('${market.id}')">View Prices →</button>
          </div>
        `;
        googleInfoWindow.setContent(content);
        googleInfoWindow.open(googleMap, marker);
      });

      googleMapMarkers.push(marker);
    });
  }

  function renderFallbackMap(lat, lng) {
    const mapEl = document.getElementById('marketsMap');
    if (!mapEl) return;

    const marketsNearby = nearbyMarkets.slice(0, 8);
    const marketsList = marketsNearby.map(m =>
      `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer" onclick="window._openMarketDetail('${m.id}')">
        <span style="color:var(--accent-1)">📍</span>
        <span style="flex:1;font-size:0.82rem">${m.name}</span>
        <span class="market-distance-badge">${m.distance} km</span>
      </div>`
    ).join('');

    mapEl.innerHTML = `
      <div class="markets-map-fallback">
        <div class="fallback-map-icon">🗺️</div>
        <div class="fallback-map-text">
          <h3>Map View — Nearby Markets</h3>
          <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:16px">
            Add a Google Maps API key in server/.env for interactive map
          </p>
          <div style="text-align:left;width:100%;max-width:400px;padding:0 20px">
            ${marketsList || '<p style="text-align:center;color:var(--text-muted)">No markets found nearby</p>'}
          </div>
        </div>
      </div>
    `;
  }

  function renderMarketsList() {
    const container = document.getElementById('marketsListContainer');
    if (!container) return;

    if (nearbyMarkets.length === 0) {
      container.innerHTML = '<div class="no-results">🔍 No marketplaces found within 100 km. Try a different location.</div>';
      return;
    }

    container.innerHTML = nearbyMarkets.map((m, i) => `
      <div class="market-list-card" style="animation-delay:${Math.min(i * 0.04, 0.6)}s" onclick="window._openMarketDetail('${m.id}')">
        <div class="market-card-header">
          <div class="market-card-name">🏪 ${m.name}</div>
          <div class="market-distance-badge">${m.distance} km</div>
        </div>
        <div class="market-card-address">📍 ${m.address}</div>
        <div class="market-card-phone">📞 ${m.phone || 'N/A'}</div>
        <div class="market-card-crops">
          ${m.crops.map(c => `<span class="market-crop-chip">${c}</span>`).join('')}
        </div>
        <div class="market-card-footer">
          <span class="market-card-state">${m.state}</span>
          <button class="market-view-prices-btn" onclick="event.stopPropagation();window._openMarketDetail('${m.id}')">
            💹 View Prices
          </button>
        </div>
      </div>
    `).join('');
  }

  // Expose for onclick in HTML-generated content
  window._openMarketDetail = function(marketId) {
    const market = nearbyMarkets.find(m => m.id === marketId);
    if (market) showMarketDetail(market);
  };

  function showMarketDetail(market) {
    const overlay = document.getElementById('marketDetailOverlay');
    document.getElementById('marketDetailName').textContent = '🏪 ' + market.name;
    document.getElementById('marketDetailAddress').textContent = market.address;
    document.getElementById('marketDetailPhone').textContent = market.phone || 'Not available';
    document.getElementById('marketDetailDistance').textContent = market.distance + ' km from your location';

    // Render crops
    const cropsEl = document.getElementById('marketDetailCrops');
    cropsEl.innerHTML = market.crops.map(c => `<span class="market-crop-chip">${c}</span>`).join('');

    // Show overlay
    overlay.style.display = 'flex';

    // Fetch live prices
    fetchLivePrices(market.id);
  }

  function closeMarketDetail() {
    const overlay = document.getElementById('marketDetailOverlay');
    overlay.style.display = 'none';
  }

  async function fetchLivePrices(marketId) {
    const tbody = document.getElementById('marketPricesBody');
    const updatedEl = document.getElementById('pricesLastUpdated');

    tbody.innerHTML = '<tr><td colspan="3" class="prices-loading">Loading prices...</td></tr>';
    updatedEl.textContent = 'Loading...';

    try {
      const res = await fetch(`${API_BASE}/api/live-prices?market=${encodeURIComponent(marketId)}`);
      const data = await res.json();

      if (data.status === 'ok' && data.prices) {
        tbody.innerHTML = data.prices.map(p => {
          const trendIcon = p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '●';
          return `
            <tr>
              <td><strong>${p.crop}</strong></td>
              <td class="price-col">₹${p.price.toLocaleString('en-IN')}</td>
              <td><span class="trend-badge ${p.trend}">${trendIcon} ${p.change}</span></td>
            </tr>
          `;
        }).join('');

        const updated = new Date(data.timestamp);
        updatedEl.textContent = 'Updated ' + updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      } else {
        tbody.innerHTML = '<tr><td colspan="3" class="prices-loading">⚠️ Prices not available</td></tr>';
        updatedEl.textContent = '';
      }
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="3" class="prices-loading">⚠️ Could not load prices. Check server connection.</td></tr>';
      updatedEl.textContent = '';
    }
  }

  function toggleMarketsView(view) {
    marketsView = view;
    const mapContainer = document.getElementById('marketsMapContainer');
    const listContainer = document.getElementById('marketsListContainer');

    document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));

    if (view === 'map') {
      if (mapContainer) mapContainer.style.display = 'block';
      if (listContainer) listContainer.style.display = 'none';
      if (userLocation) initMap(userLocation.lat, userLocation.lng);
    } else {
      if (mapContainer) mapContainer.style.display = 'none';
      if (listContainer) listContainer.style.display = 'grid';
      renderMarketsList();
    }
  }

  function handleManualLocationSearch() {
    const input = document.getElementById('manualLocationInput');
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    const coords = CITY_COORDS[query];
    if (coords) {
      userLocation = coords;
      document.getElementById('userLocationText').textContent = `📍 Location: ${query.charAt(0).toUpperCase() + query.slice(1)}`;
      document.querySelector('.location-pulse').classList.remove('error');
      loadMarketsForLocation(coords.lat, coords.lng);
      showToast(`📍 Showing markets near ${query.charAt(0).toUpperCase() + query.slice(1)}`);
    } else {
      showToast('⚠️ City not found. Try a major Indian city name.');
    }
  }

  function bindMarketsEvents() {
    // View toggle
    const mapToggle = document.getElementById('toggleMapView');
    const listToggle = document.getElementById('toggleListView');
    if (mapToggle) mapToggle.addEventListener('click', () => toggleMarketsView('map'));
    if (listToggle) listToggle.addEventListener('click', () => toggleMarketsView('list'));

    // Detail close
    const detailClose = document.getElementById('marketDetailClose');
    const detailOverlay = document.getElementById('marketDetailOverlay');
    if (detailClose) detailClose.addEventListener('click', closeMarketDetail);
    if (detailOverlay) {
      detailOverlay.addEventListener('click', (e) => {
        if (e.target === detailOverlay) closeMarketDetail();
      });
    }

    // Manual location search
    const searchBtn = document.getElementById('manualLocationSearch');
    const searchInput = document.getElementById('manualLocationInput');
    if (searchBtn) searchBtn.addEventListener('click', handleManualLocationSearch);
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleManualLocationSearch();
      });
    }

    // Popular city buttons
    document.querySelectorAll('.fallback-city-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lat = parseFloat(btn.dataset.lat);
        const lng = parseFloat(btn.dataset.lng);
        userLocation = { lat, lng };
        document.getElementById('userLocationText').textContent = `📍 Location: ${btn.textContent}`;
        document.querySelector('.location-pulse').classList.remove('error');
        loadMarketsForLocation(lat, lng);
        showToast(`📍 Showing markets near ${btn.textContent}`);
      });
    });

    // Escape to close detail
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailOverlay && detailOverlay.style.display === 'flex') {
        closeMarketDetail();
      }
    });
  }

  // ═══════════════════════════════════════
  //  MOCK API ENDPOINTS
  // ═══════════════════════════════════════
  window.FarmAPI = {
    // GET /prices
    getPrices: (params = {}) => {
      return new Promise(resolve => {
        setTimeout(() => {
          let data = [...MARKET_PRICES];
          if (params.category) data = data.filter(p => p.category === params.category);
          if (params.season) data = data.filter(p => p.season === params.season);
          if (params.search) data = data.filter(p => p.crop.toLowerCase().includes(params.search.toLowerCase()));
          resolve({
            status: 'ok',
            endpoint: '/prices',
            data,
            total: data.length,
            timestamp: new Date().toISOString()
          });
        }, 300);
      });
    },

    // GET /recommend
    getRecommendation: (params = {}) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const state = params.state && STATES_DATA[params.state];
          if (!state) {
            resolve({ status: 'error', message: 'State not found' });
            return;
          }
          const season = params.season || 'kharif';
          resolve({
            status: 'ok',
            endpoint: '/recommend',
            state: params.state,
            season: season,
            recommended_crops: state.seasons[season] || [],
            climate: state.climate,
            nearest_mandis: state.mandis,
            timestamp: new Date().toISOString()
          });
        }, 300);
      });
    },

    // GET /states
    getStates: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          const states = Object.keys(STATES_DATA).sort().map(name => ({
            name,
            region: STATES_DATA[name].region,
            capital: STATES_DATA[name].capital,
            mandis: STATES_DATA[name].mandis.length
          }));
          resolve({
            status: 'ok',
            endpoint: '/states',
            data: states,
            total: states.length,
            timestamp: new Date().toISOString()
          });
        }, 200);
      });
    },

    // POST /analyze
    analyzeDisease: (imageFile) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 'ok',
            endpoint: '/analyze',
            data: getRandomDisease(),
            timestamp: new Date().toISOString()
          });
        }, 1500);
      });
    }
  };

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', init);
})();

