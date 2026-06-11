/* ════════════════════════════════════════════════
   SKIES — script.js
   ════════════════════════════════════════════════ */

const API_KEY = '2d98a165b934a5808a1753b0376d6279';
const BASE    = 'https://api.openweathermap.org/data/2.5';

/* ── DOM refs ── */
const searchInput   = document.getElementById('searchInput');
const searchBtn     = document.getElementById('searchBtn');
const dropdown      = document.getElementById('dropdown');
const recentList    = document.getElementById('recentList');
const clearRecentBtn= document.getElementById('clearRecentBtn');
const stateInit     = document.getElementById('stateInit');
const stateLoading  = document.getElementById('stateLoading');
const stateError    = document.getElementById('stateError');
const weatherCard   = document.getElementById('weatherCard');
const errorMsg      = document.getElementById('errorMsg');
const retryBtn      = document.getElementById('retryBtn');
const loadingLabel  = document.getElementById('loadingLabel');
const cardGlow      = document.getElementById('cardGlow');
const orbA          = document.getElementById('orbA');
const orbB          = document.getElementById('orbB');
const tray          = document.getElementById('tray');
const trayChips     = document.getElementById('trayChips');
const trayClearBtn  = document.getElementById('trayClearBtn');
const aqiSection    = document.getElementById('aqiSection');
const mainEl        = document.querySelector('.main');

/* ── State ── */
let lastCity  = 'Delhi';
let savedCache = {}; // { cityLower: {temp, icon, cond} }

/* ── Storage ── */
const SK_RECENT = 'skies_recent_v2';
const SK_SAVED  = 'skies_saved_v2';
const MAX_REC = 6, MAX_SAV = 8;

function loadJ(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } }
function saveJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

/* ── Aura palette per weather condition ── */
const COND_PALETTE = {
  clear:        { aura: '#FF8C00', glow: 'rgba(255,140,0,0.07)' },
  clouds:       { aura: '#5B7FA6', glow: 'rgba(91,127,166,0.07)' },
  rain:         { aura: '#1A8FFF', glow: 'rgba(26,143,255,0.08)' },
  drizzle:      { aura: '#1A8FFF', glow: 'rgba(26,143,255,0.08)' },
  thunderstorm: { aura: '#9B59B6', glow: 'rgba(155,89,182,0.1)' },
  snow:         { aura: '#90CAF9', glow: 'rgba(144,202,249,0.08)' },
  mist:         { aura: '#607D8B', glow: 'rgba(96,125,139,0.07)' },
  fog:          { aura: '#607D8B', glow: 'rgba(96,125,139,0.07)' },
  haze:         { aura: '#C9A227', glow: 'rgba(201,162,39,0.07)' },
  default:      { aura: '#00D4FF', glow: 'rgba(0,212,255,0.07)' },
};

function getPalette(cond) {
  const k = (cond || '').toLowerCase();
  for (const [key, val] of Object.entries(COND_PALETTE)) {
    if (k.includes(key)) return val;
  }
  return COND_PALETTE.default;
}

function applyAura(palette) {
  document.documentElement.style.setProperty('--aura', palette.aura);
  orbA.style.background = `radial-gradient(circle, ${palette.aura}40, transparent 70%)`;
  cardGlow.style.background = `radial-gradient(ellipse 80% 50% at 50% 0%, ${palette.glow}, transparent 70%)`;
}

/* ══════════════════════════════════════════
   ATMOSPHERIC CANVAS — Particle field
══════════════════════════════════════════ */
const canvas = document.getElementById('atmosphereCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let animFrame;
let canvasColor = { r: 0, g: 212, b: 255 };

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() { this.reset(true); }
  reset(random = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = random ? Math.random() * canvas.height : canvas.height + 10;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.life   = 0;
    this.maxLife= Math.random() * 200 + 150;
    this.alpha  = 0;
  }
  update() {
    this.x  += this.vx;
    this.y  += this.vy;
    this.life++;
    const half = this.maxLife / 2;
    this.alpha = this.life < half
      ? (this.life / half) * 0.45
      : (1 - (this.life - half) / half) * 0.45;
    if (this.life >= this.maxLife) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${canvasColor.r},${canvasColor.g},${canvasColor.b},${this.alpha})`;
    ctx.fill();
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function initParticles(n = 80) {
  particles = Array.from({ length: n }, () => new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

function setParticleColor(hex) {
  canvasColor = hexToRgb(hex);
}

initParticles();
animateParticles();

/* ══════════════════════════════════════════
   FORMATTERS
══════════════════════════════════════════ */
function fmtTime(unix, tz) {
  const d = new Date((unix + tz) * 1000);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function fmtDate(unix) {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
}

function fmtDay(unix) {
  return new Date(unix * 1000).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

/* ── Animated temp count-up ── */
function animateTemp(target, el) {
  const start = target - 6;
  let cur = start, step = 0, steps = 24;
  el.textContent = start;
  const interval = setInterval(() => {
    step++;
    cur = Math.round(start + (target - start) * (step / steps));
    el.textContent = cur;
    if (step >= steps) { clearInterval(interval); el.textContent = target; }
  }, 20);
}

/* ══════════════════════════════════════════
   STATE MANAGEMENT
══════════════════════════════════════════ */
function showMain(el) {
  [stateInit, stateLoading, stateError, weatherCard].forEach(e => e.classList.add('hidden'));
  el.classList.remove('hidden');
}

const LOADING_MSGS = ['Locating…', 'Fetching skies…', 'Reading clouds…', 'Almost there…'];
let loadMsgTimer;
function startLoadingMsgs() {
  let i = 0;
  loadingLabel.textContent = LOADING_MSGS[0];
  loadMsgTimer = setInterval(() => {
    i = (i + 1) % LOADING_MSGS.length;
    loadingLabel.style.animation = 'none';
    void loadingLabel.offsetWidth;
    loadingLabel.style.animation = '';
    loadingLabel.textContent = LOADING_MSGS[i];
  }, 900);
}
function stopLoadingMsgs() { clearInterval(loadMsgTimer); }

/* ══════════════════════════════════════════
   FORECAST
══════════════════════════════════════════ */
function groupForecast(list) {
  const days = {};
  list.forEach(item => {
    const d   = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!days[key]) days[key] = [];
    days[key].push(item);
  });
  return Object.values(days).slice(0, 5).map(di => {
    const noon = di.find(i => { const h = new Date(i.dt * 1000).getHours(); return h >= 11 && h <= 14; }) || di[0];
    return { ...noon, high: Math.max(...di.map(i => i.main.temp_max)), low: Math.min(...di.map(i => i.main.temp_min)) };
  });
}

function renderForecast(items) {
  const row = document.getElementById('forecastRow');
  row.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'fc-card';
    card.innerHTML = `
      <div class="fc-day">${fmtDay(item.dt)}</div>
      <img class="fc-img" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}"/>
      <div class="fc-high">${Math.round(item.high)}°</div>
      <div class="fc-low">${Math.round(item.low)}°</div>
      <div class="fc-desc">${item.weather[0].description}</div>`;
    row.appendChild(card);
  });
}

/* ══════════════════════════════════════════
   SUN ARC
══════════════════════════════════════════ */
function updateSunArc(sunrise, sunset, tzOffset) {
  const now  = Date.now() / 1000;
  const rise = sunrise + tzOffset;
  const set_ = sunset  + tzOffset;
  const nowL = now     + tzOffset;
  const prog = Math.max(0, Math.min(1, (nowL - rise) / (set_ - rise)));

  const t  = prog;
  const p0 = { x: 10, y: 72 }, p1 = { x: 100, y: 8 }, p2 = { x: 190, y: 72 };
  const x  = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
  const y  = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y;

  const dot  = document.getElementById('sunDot');
  const glow = document.getElementById('sunGlow');
  if (dot)  { dot.setAttribute('cx', x.toFixed(1));  dot.setAttribute('cy', y.toFixed(1)); }
  if (glow) { glow.setAttribute('cx', x.toFixed(1)); glow.setAttribute('cy', y.toFixed(1)); }

  // Animate progress stroke
  const pathEl = document.getElementById('sunProgressPath');
  if (pathEl) {
    const totalLen = 220;
    const offset   = totalLen * (1 - prog);
    pathEl.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => pathEl.style.strokeDashoffset = offset, 300);
  }
}

/* ══════════════════════════════════════════
   AQI
══════════════════════════════════════════ */
const AQI_INFO = [
  { label: 'Good',      color: '#00E676', pct: 15 },
  { label: 'Fair',      color: '#AEEA00', pct: 35 },
  { label: 'Moderate',  color: '#FFD600', pct: 55 },
  { label: 'Poor',      color: '#FF6D00', pct: 75 },
  { label: 'Very Poor', color: '#D50000', pct: 95 },
];

function renderAQI(aqi) {
  const info = AQI_INFO[(aqi || 1) - 1] || AQI_INFO[0];
  document.getElementById('aqiLevel').textContent = info.label;
  const fill = document.getElementById('aqiFill');
  fill.style.background = info.color;
  aqiSection.style.display = 'block';
  setTimeout(() => { fill.style.width = info.pct + '%'; }, 200);
}

/* ══════════════════════════════════════════
   RECENT + SAVED
══════════════════════════════════════════ */
function getRecent() { return loadJ(SK_RECENT, []); }
function getSaved()  { return loadJ(SK_SAVED, []); }

function pushRecent(obj) {
  let rec = getRecent().filter(r => r.name.toLowerCase() !== obj.name.toLowerCase());
  rec.unshift(obj);
  saveJ(SK_RECENT, rec.slice(0, MAX_REC));
}
function pushSaved(obj) {
  let saved = getSaved().filter(s => s.name.toLowerCase() !== obj.name.toLowerCase());
  saved.unshift(obj);
  saveJ(SK_SAVED, saved.slice(0, MAX_SAV));
}

function renderDropdown() {
  const rec = getRecent();
  if (!rec.length) { dropdown.classList.remove('open'); return; }
  recentList.innerHTML = '';
  rec.forEach(r => {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.innerHTML = `
      <span class="dropdown-item-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </span>
      <span>${r.name}</span>
      <span class="dropdown-item-country">${r.country || ''}</span>`;
    li.addEventListener('click', () => {
      searchInput.value = r.name;
      dropdown.classList.remove('open');
      fetchWeather(r.name);
    });
    recentList.appendChild(li);
  });
  dropdown.classList.add('open');
}

function renderTray() {
  const saved = getSaved();
  if (!saved.length) { tray.classList.add('hidden'); return; }
  tray.classList.remove('hidden');
  trayChips.innerHTML = '';
  saved.forEach(s => {
    const chip  = document.createElement('div');
    const ckey  = s.name.toLowerCase();
    const cache = savedCache[ckey];
    const isActive = lastCity && lastCity.toLowerCase() === ckey;
    chip.className = 'tray-chip' + (isActive ? ' active' : '');
    chip.innerHTML = `
      <div class="chip-top">
        <span class="chip-name">${s.name}</span>
        ${cache ? `<img class="chip-icon" src="https://openweathermap.org/img/wn/${cache.icon}.png" alt=""/>` : ''}
      </div>
      <div class="chip-temp">${cache ? cache.temp + '°' : '—'}</div>
      <div class="chip-cond">${cache ? cache.cond : (s.country || '')}</div>`;
    chip.addEventListener('click', () => { searchInput.value = s.name; fetchWeather(s.name); });
    trayChips.appendChild(chip);
  });
}

async function refreshTray() {
  const saved = getSaved();
  for (const s of saved) {
    try {
      const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(s.name)}&units=metric&appid=${API_KEY}`);
      if (res.ok) {
        const d = await res.json();
        savedCache[s.name.toLowerCase()] = {
          temp: Math.round(d.main.temp),
          icon: d.weather[0].icon,
          cond: d.weather[0].description,
        };
      }
    } catch {}
  }
  renderTray();
}

/* ══════════════════════════════════════════
   MAIN FETCH
══════════════════════════════════════════ */
async function fetchWeather(city) {
  showMain(stateLoading);
  startLoadingMsgs();
  dropdown.classList.remove('open');

  try {
    const [curRes, fcRes] = await Promise.all([
      fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
      fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`),
    ]);

    if (!curRes.ok) {
      const err = await curRes.json();
      throw new Error(err.message || 'City not found');
    }

    const cur = await curRes.json();
    const fc  = await fcRes.json();

    // AQI (non-blocking)
    let aqiData = null;
    try {
      const ar = await fetch(`${BASE}/air_pollution?lat=${cur.coord.lat}&lon=${cur.coord.lon}&appid=${API_KEY}`);
      if (ar.ok) aqiData = await ar.json();
    } catch {}

    stopLoadingMsgs();
    renderWeather(cur, fc.list, aqiData);

    // Save
    const obj = { name: cur.name, country: cur.sys.country };
    pushRecent(obj);
    pushSaved(obj);
    savedCache[cur.name.toLowerCase()] = {
      temp: Math.round(cur.main.temp),
      icon: cur.weather[0].icon,
      cond: cur.weather[0].description,
    };
    lastCity = cur.name;
    renderTray();

  } catch (err) {
    stopLoadingMsgs();
    errorMsg.textContent = err.message || 'Something went wrong.';
    showMain(stateError);
  }
}

/* ══════════════════════════════════════════
   RENDER WEATHER
══════════════════════════════════════════ */
function renderWeather(data, forecastList, aqiData) {
  const cond    = data.weather[0].main;
  const palette = getPalette(cond);
  const tzOff   = data.timezone;

  // Visuals
  applyAura(palette);
  setParticleColor(palette.aura);

  // Hero
  document.getElementById('cityName').textContent     = data.name;
  document.getElementById('countryCode').textContent  = data.sys.country;
  document.getElementById('dateStr').textContent      = fmtDate(data.dt);
  document.getElementById('conditionText').textContent= data.weather[0].description;
  const iconEl = document.getElementById('weatherIcon');
  iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  animateTemp(Math.round(data.main.temp), document.getElementById('tempDisplay'));
  document.getElementById('tempMax').textContent = Math.round(data.main.temp_max) + '°';
  document.getElementById('tempMin').textContent = Math.round(data.main.temp_min) + '°';

  // Stats
  document.getElementById('feelsLike').textContent  = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent   = `${data.main.humidity}%`;
  document.getElementById('windSpeed').textContent  = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  document.getElementById('pressure').textContent   = `${data.main.pressure} hPa`;

  // UV (not in free tier — show from data if present, else N/A)
  const uvVal = data.uvi != null ? data.uvi : '—';
  document.getElementById('uvIndex').textContent = typeof uvVal === 'number' ? uvVal.toFixed(0) : uvVal;

  // Sun
  document.getElementById('sunrise').textContent = fmtTime(data.sys.sunrise, tzOff);
  document.getElementById('sunset').textContent  = fmtTime(data.sys.sunset, tzOff);
  updateSunArc(data.sys.sunrise, data.sys.sunset, tzOff);

  // AQI
  if (aqiData?.list?.[0]) {
    renderAQI(aqiData.list[0].main.aqi);
  } else {
    aqiSection.style.display = 'none';
  }

  // Forecast
  renderForecast(groupForecast(forecastList));

  showMain(weatherCard);
}

/* ══════════════════════════════════════════
   EVENTS
══════════════════════════════════════════ */
searchBtn.addEventListener('click', () => {
  const c = searchInput.value.trim();
  if (c) fetchWeather(c);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const c = searchInput.value.trim();
    if (c) { dropdown.classList.remove('open'); fetchWeather(c); }
  }
  if (e.key === 'Escape') dropdown.classList.remove('open');
});

searchInput.addEventListener('focus', () => renderDropdown());
searchInput.addEventListener('input', () => {
  if (!searchInput.value.trim()) renderDropdown();
  else dropdown.classList.remove('open');
});

document.addEventListener('click', e => {
  if (!e.target.closest('#searchWrap')) dropdown.classList.remove('open');
});

clearRecentBtn.addEventListener('click', () => {
  saveJ(SK_RECENT, []);
  dropdown.classList.remove('open');
});

retryBtn.addEventListener('click', () => fetchWeather(lastCity));
trayClearBtn.addEventListener('click', () => {
  saveJ(SK_SAVED, []);
  savedCache = {};
  renderTray();
});

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
(async () => {
  renderTray();
  fetchWeather('Delhi');
  refreshTray();
})();