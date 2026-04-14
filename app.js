const watches = [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner Date',
    ref: '126610LN',
    serial: 'RXL-9283',
    health: 82,
    lastService: '3 Nov 2019',
    valueAED: 51000,
    servicesDue: ['Water resistance test', 'Bracelet polish'],
  },
  {
    id: 2,
    brand: 'Patek Philippe',
    model: 'Aquanaut',
    ref: '5167A-001',
    serial: 'PTK-4411',
    health: 63,
    lastService: '17 Feb 2018',
    valueAED: 285000,
    servicesDue: ['Complete overhaul', 'Authentication certificate'],
  },
  {
    id: 3,
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    ref: '15500ST',
    serial: 'AP-7719',
    health: 45,
    lastService: '25 Jul 2016',
    valueAED: 210000,
    servicesDue: ['Complete overhaul', 'Case & bracelet refinish'],
  },
];

const services = [
  {
    id: 'health',
    title: 'Watch Health & Servicing',
    description: 'View health scores and service intervals. Book partial or complete overhauls directly into Swiss Watch Services with one tap.',
    tag: 'Core',
  },
  {
    id: 'white-glove',
    title: 'White Glove Pickup',
    description: 'Doorstep pickup and return for any service booking within Dubai — insured transit and real-time courier tracking included.',
    tag: 'Convenience',
  },
  {
    id: 'authentication',
    title: 'Authentication Certificate',
    description: 'Seddiqi-issued certificate confirming authenticity, movement originality and condition rating — ideal for insurance or resale.',
    tag: 'Trust',
  },
  {
    id: 'insurance',
    title: 'Insurance & Appraisal',
    description: 'Request a valuation, receive partner insurance quotes, and store all policy documents inside your personal digital safe.',
    tag: 'Protection',
  },
  {
    id: 'cpo',
    title: 'CPO Trade-In & Upgrade',
    description: 'Get a binding trade-in offer and apply the credit directly towards a new purchase or a certified pre-owned timepiece.',
    tag: 'Upgrade',
  },
  {
    id: 'spa',
    title: 'Watch Spa & Cosmetic Care',
    description: 'Crystal polish, five-level case & bracelet finishing, and water resistance re-testing — between full service intervals.',
    tag: 'Aesthetics',
  },
];

// ── DOM refs ────────────────────────────────────────────
const appRoot   = document.getElementById('app-root');
const modalEl   = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');

// ── Helpers ─────────────────────────────────────────────
const formatAED = v =>
  new Intl.NumberFormat('en-AE', { style: 'decimal', maximumFractionDigits: 0 }).format(v);

const healthClass = s => s >= 75 ? 'good' : s >= 55 ? 'warn' : 'bad';
const healthLabel = s => s >= 75 ? 'Excellent' : s >= 55 ? 'Service Due' : 'Overhaul Needed';

// ── Render template ──────────────────────────────────────
function renderTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl) return;
  appRoot.innerHTML = '';
  appRoot.appendChild(tpl.content.cloneNode(true));
}

// ── Portfolio view ───────────────────────────────────────
function initPortfolio() {
  const total   = watches.length;
  const value   = watches.reduce((s, w) => s + w.valueAED, 0);
  const avg     = total ? Math.round(watches.reduce((s, w) => s + w.health, 0) / total) : 0;
  const overdue = watches.filter(w => w.health < 65).length;

  document.getElementById('kpi-total-pieces').textContent = total;
  document.getElementById('kpi-total-value').textContent  = formatAED(value);
  document.getElementById('kpi-avg-health').textContent   = avg;
  document.getElementById('kpi-overdue').textContent      = overdue;

  const list = document.getElementById('watch-list');
  watches.forEach(w => {
    const hc   = healthClass(w.health);
    const card = document.createElement('article');
    card.className = 'watch-card';
    card.innerHTML = `
      <div class="watch-card-top">
        <div>
          <div class="watch-brand">${w.brand}</div>
          <div class="watch-model">${w.model}</div>
          <div class="watch-ref">Ref. ${w.ref}</div>
        </div>
        <span class="health-badge ${hc}">${healthLabel(w.health)}</span>
      </div>
      <div class="watch-card-mid">
        <div class="meta-line"><span>Last service</span><span>${w.lastService}</span></div>
        <div class="meta-line"><span>Est. value</span><span>AED ${formatAED(w.valueAED)}</span></div>
        <div class="health-bar-wrap">
          <div class="health-bar-label">
            <span>Health score</span><span>${w.health}/100</span>
          </div>
          <div class="health-bar">
            <div class="health-bar-fill ${hc}" style="width:${w.health}%"></div>
          </div>
        </div>
      </div>
      <div class="watch-card-tags">
        ${w.servicesDue.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
      <div class="watch-card-actions">
        <button class="btn btn-ghost" data-action="view-safe" data-id="${w.id}">Digital Safe</button>
        <button class="btn btn-primary" data-action="book-service" data-id="${w.id}">Book Service</button>
      </div>
    `;
    card.addEventListener('click', e => {
      const action = e.target.dataset.action;
      if (!action) return;
      const watch = watches.find(x => x.id === Number(e.target.dataset.id));
      if (!watch) return;
      if (action === 'view-safe')    openDigitalSafe(watch);
      if (action === 'book-service') openServiceBooking(watch);
    });
    list.appendChild(card);
  });
}

// ── Services view ────────────────────────────────────────
function initServices() {
  const list = document.getElementById('service-list');
  services.forEach(svc => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.innerHTML = `
      <span class="service-tag-pill">${svc.tag}</span>
      <div class="service-title">${svc.title}</div>
      <p class="service-desc">${svc.description}</p>
      <div>
        <button class="btn btn-ghost" data-service="${svc.id}">Learn more</button>
      </div>
    `;
    card.querySelector('[data-service]').addEventListener('click', () => openServiceDetail(svc));
    list.appendChild(card);
  });
}

// ── Modal helpers ────────────────────────────────────────
function openModal(html) {
  modalBody.innerHTML = html;
  modalEl.classList.remove('hidden');
  modalEl.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modalEl.classList.add('hidden');
  modalEl.setAttribute('aria-hidden', 'true');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
modalEl.addEventListener('click', e => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });

// ── Digital safe modal ───────────────────────────────────
function openDigitalSafe(w) {
  openModal(`
    <div class="modal-title">${w.brand} ${w.model}</div>
    <div class="modal-subtitle">Digital Safe · Ref. ${w.ref} · Serial ${w.serial}</div>
    <div class="modal-section">
      <div class="modal-section-title">Core Details</div>
      <div class="modal-row"><span>Brand</span><span>${w.brand}</span></div>
      <div class="modal-row"><span>Reference</span><span>${w.ref}</span></div>
      <div class="modal-row"><span>Serial</span><span>${w.serial}</span></div>
      <div class="modal-row"><span>Last service</span><span>${w.lastService}</span></div>
      <div class="modal-row"><span>Health score</span><span>${w.health}/100</span></div>
      <div class="modal-row"><span>Est. value</span><span>AED ${formatAED(w.valueAED)}</span></div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Services Due</div>
      ${w.servicesDue.map(s => `<div class="modal-row"><span>${s}</span><span>Pending</span></div>`).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="safe-close">Close</button>
      <button class="btn btn-primary" id="safe-book">Book Service</button>
    </div>
  `);
  document.getElementById('safe-close').addEventListener('click', closeModal);
  document.getElementById('safe-book').addEventListener('click', () => { closeModal(); openServiceBooking(w); });
}

// ── Service booking modal ────────────────────────────────
function openServiceBooking(w) {
  openModal(`
    <div class="modal-title">Book Service</div>
    <div class="modal-subtitle">${w.brand} ${w.model} · ${w.ref}</div>
    <div class="modal-section">
      <div class="modal-section-title">Watch Condition</div>
      <div class="modal-row"><span>Health score</span><span>${w.health}/100 — ${healthLabel(w.health)}</span></div>
      <div class="modal-row"><span>Last service</span><span>${w.lastService}</span></div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Choose Service</div>
      <div class="modal-row"><label><input type="radio" name="svc" value="partial" checked /> Partial service</label><span>2–3 weeks</span></div>
      <div class="modal-row"><label><input type="radio" name="svc" value="complete" /> Complete overhaul</label><span>4–6 weeks</span></div>
      <div class="modal-row"><label><input type="radio" name="svc" value="spa" /> Cosmetic spa only</label><span>5–7 days</span></div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Collection</div>
      <div class="modal-row"><label><input type="checkbox" checked /> White glove pickup — Dubai</label><span>Included</span></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="svc-cancel">Cancel</button>
      <button class="btn btn-primary" id="svc-confirm">Confirm Request</button>
    </div>
  `);
  document.getElementById('svc-cancel').addEventListener('click', closeModal);
  document.getElementById('svc-confirm').addEventListener('click', () => {
    closeModal();
    alert('Service request submitted. A Seddiqi concierge will contact you to confirm timing.');
  });
}

// ── Service detail modal ─────────────────────────────────
function openServiceDetail(svc) {
  openModal(`
    <div class="modal-title">${svc.title}</div>
    <div class="modal-subtitle">Service category · ${svc.tag}</div>
    <div class="modal-section">
      <div class="modal-section-title">About this service</div>
      <p style="font-size:13px;line-height:1.7;color:var(--text-muted);">${svc.description}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">How it works</div>
      <p style="font-size:13px;line-height:1.7;color:var(--text-muted);">In a live build, this flow connects to Seddiqi's booking, logistics, insurance and CPO systems. This screen expands into a full wizard — intake details, pickup preferences, and booking confirmation.</p>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="svc-detail-close">Close</button>
      <button class="btn btn-primary" id="svc-detail-book">Book Now</button>
    </div>
  `);
  document.getElementById('svc-detail-close').addEventListener('click', closeModal);
  document.getElementById('svc-detail-book').addEventListener('click', () => {
    closeModal();
    alert('Redirecting to booking flow for: ' + svc.title);
  });
}

// ── Navigation ───────────────────────────────────────────
function loadView(view) {
  if (view === 'portfolio') {
    renderTemplate('portfolio-view');
    initPortfolio();
  } else if (view === 'services') {
    renderTemplate('services-view');
    initServices();
  } else if (view === 'profile') {
    renderTemplate('profile-view');
  }
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => loadView(btn.dataset.view));
});

// ── Mobile sidebar toggle ─────────────────────────────────
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
if (hamburger && sidebar) {
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ── Boot ─────────────────────────────────────────────────
loadView('portfolio');
