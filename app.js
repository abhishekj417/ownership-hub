const watches = [
  {
    id: 1,
    brand: "Rolex",
    model: "Submariner Date",
    ref: "126610LN",
    serial: "RXL-9283",
    health: 82,
    lastService: "2019-11-03",
    valueAED: 51000,
    servicesDue: ["Water resistance test", "Bracelet polish"],
  },
  {
    id: 2,
    brand: "Patek Philippe",
    model: "Aquanaut",
    ref: "5167A-001",
    serial: "PTK-4411",
    health: 63,
    lastService: "2018-02-17",
    valueAED: 285000,
    servicesDue: ["Complete overhaul", "Authentication certificate"],
  },
  {
    id: 3,
    brand: "Audemars Piguet",
    model: "Royal Oak",
    ref: "15500ST",
    serial: "AP-7719",
    health: 45,
    lastService: "2016-07-25",
    valueAED: 210000,
    servicesDue: ["Complete overhaul", "Case & bracelet refinish"],
  },
];

const services = [
  {
    id: "health",
    title: "Watch Health & Servicing",
    description:
      "See health scores, service intervals and book partial or complete overhaul directly into Swiss Watch Services.",
    tag: "Core",
  },
  {
    id: "white-glove",
    title: "White Glove Pickup",
    description:
      "Doorstep pickup and return for any service booking within Dubai, with insured transit and real-time tracking.",
    tag: "Convenience",
  },
  {
    id: "authentication",
    title: "Authentication & Condition Certificate",
    description:
      "Seddiqi-issued certificate confirming authenticity, movement originality and condition rating for insurance or resale.",
    tag: "Trust",
  },
  {
    id: "insurance",
    title: "Insurance & Appraisal",
    description:
      "Request a valuation, receive partner insurance quotes, and store policy documents inside the digital safe.",
    tag: "Protection",
  },
  {
    id: "cpo",
    title: "CPO Trade-In & Upgrade",
    description:
      "Get a binding trade-in offer and apply credit towards a new purchase or certified pre-owned piece.",
    tag: "Upgrade",
  },
  {
    id: "spa",
    title: "Watch Spa & Cosmetic Care",
    description:
      "Crystal polish, five-level case & bracelet finishing, and water resistance re-testing between full services.",
    tag: "Aesthetics",
  },
];

const appRoot = document.getElementById("app-root");
const modalEl = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.querySelector(".modal-close");

function renderTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl) return;
  appRoot.innerHTML = "";
  appRoot.appendChild(tpl.content.cloneNode(true));
}

function formatAED(value) {
  return new Intl.NumberFormat("en-AE", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value);
}

function healthClass(score) {
  if (score >= 75) return "good";
  if (score >= 55) return "warn";
  return "bad";
}

function initPortfolio() {
  const totalPieces = watches.length;
  const totalValue = watches.reduce((sum, w) => sum + w.valueAED, 0);
  const avgHealth =
    totalPieces === 0
      ? 0
      : Math.round(
          watches.reduce((sum, w) => sum + w.health, 0) / totalPieces
        );

  document.getElementById("kpi-total-pieces").textContent = totalPieces;
  document.getElementById("kpi-total-value").textContent = formatAED(totalValue);
  document.getElementById("kpi-avg-health").textContent = `${avgHealth}`;

  const list = document.getElementById("watch-list");
  watches.forEach((watch) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${watch.brand} ${watch.model}</div>
          <div class="card-subtitle">Ref. ${watch.ref}</div>
        </div>
        <span class="health-pill ${healthClass(watch.health)}">Health ${
      watch.health
    }/100</span>
      </div>
      <div class="meta-row">
        <span>Last service</span>
        <span>${watch.lastService}</span>
      </div>
      <div class="meta-row">
        <span>Value</span>
        <span>AED ${formatAED(watch.valueAED)}</span>
      </div>
      <div class="chip-row">
        ${watch.servicesDue
          .map((s) => `<span class="chip">${s}</span>`)
          .join("")}
      </div>
      <div class="card-actions">
        <button class="btn btn-ghost" data-action="view-safe" data-id="${
          watch.id
        }">Digital Safe</button>
        <button class="btn btn-primary" data-action="book-service" data-id="${
          watch.id
        }">Book Service</button>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      if (!action) return;
      const id = Number(e.target.dataset.id);
      const w = watches.find((x) => x.id === id);
      if (!w) return;
      if (action === "view-safe") openDigitalSafe(w);
      if (action === "book-service") openServiceBooking(w);
    });

    list.appendChild(card);
  });
}

function initServices() {
  const list = document.getElementById("service-list");
  services.forEach((svc) => {
    const card = document.createElement("article");
    card.className = "card service-card";
    card.innerHTML = `
      <div class="card-header">
        <h3>${svc.title}</h3>
        <span class="pill">${svc.tag}</span>
      </div>
      <p>${svc.description}</p>
      <div class="card-actions">
        <button class="btn btn-primary" data-service="${svc.id}">Explore</button>
      </div>
    `;

    card
      .querySelector("[data-service]")
      .addEventListener("click", () => openServiceDetail(svc));

    list.appendChild(card);
  });
}

function openModal(contentHtml) {
  modalBody.innerHTML = contentHtml;
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modalEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) closeModal();
});

function openDigitalSafe(watch) {
  const html = `
    <h2>${watch.brand} ${watch.model}</h2>
    <p class="modal-subtitle">Digital Safe · Ref. ${watch.ref} · Serial ${
    watch.serial
  }</p>

    <div class="modal-section">
      <div class="modal-section-title">Core details</div>
      <div class="modal-row"><span>Brand</span><span>${watch.brand}</span></div>
      <div class="modal-row"><span>Reference</span><span>${watch.ref}</span></div>
      <div class="modal-row"><span>Serial</span><span>${watch.serial}</span></div>
      <div class="modal-row"><span>Last service</span><span>$${
        watch.lastService
      }</span></div>
      <div class="modal-row"><span>Health score</span><span>${
        watch.health
      } / 100</span></div>
      <div class="modal-row"><span>Estimated value</span><span>AED ${formatAED(
        watch.valueAED
      )}</span></div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Services due</div>
      ${watch.servicesDue
        .map(
          (s) =>
            `<div class="modal-row"><span>·</span><span>${s}</span></div>`
        )
        .join("")}
    </div>

    <div class="card-actions" style="margin-top: 0.9rem; justify-content: flex-end;">
      <button class="btn btn-ghost" id="digital-safe-close">Close</button>
      <button class="btn btn-primary" id="digital-safe-book">Book Service</button>
    </div>
  `;
  openModal(html);
  document
    .getElementById("digital-safe-close")
    .addEventListener("click", closeModal);
  document
    .getElementById("digital-safe-book")
    .addEventListener("click", () => {
      closeModal();
      openServiceBooking(watch);
    });
}

function openServiceBooking(watch) {
  const html = `
    <h2>Book Service · ${watch.brand} ${watch.model}</h2>
    <p class="modal-subtitle">Select the service you need and we'll route it to Swiss Watch Services.</p>

    <div class="modal-section">
      <div class="modal-section-title">Recommended based on health score</div>
      <div class="modal-row"><span>Health</span><span>${watch.health} / 100</span></div>
      <div class="modal-row"><span>Last service</span><span>${
        watch.lastService
      }</span></div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Choose service</div>
      <div class="modal-row"><span><input type="radio" name="svc" value="partial" checked /> Partial service</span><span>2–3 weeks</span></div>
      <div class="modal-row"><span><input type="radio" name="svc" value="complete" /> Complete overhaul</span><span>4–6 weeks</span></div>
      <div class="modal-row"><span><input type="radio" name="svc" value="spa" /> Cosmetic spa only</span><span>5–7 days</span></div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Pickup</div>
      <div class="modal-row"><span><input type="checkbox" id="white-glove" checked /> White glove pickup in Dubai</span><span>Included</span></div>
    </div>

    <div class="card-actions" style="margin-top: 0.9rem; justify-content: flex-end;">
      <button class="btn btn-ghost" id="svc-cancel">Cancel</button>
      <button class="btn btn-primary" id="svc-confirm">Confirm request</button>
    </div>
  `;
  openModal(html);
  document.getElementById("svc-cancel").addEventListener("click", closeModal);
  document.getElementById("svc-confirm").addEventListener("click", () => {
    alert(
      "Service request submitted. A Seddiqi concierge will contact you to confirm timing."
    );
    closeModal();
  });
}

function openServiceDetail(service) {
  const html = `
    <h2>${service.title}</h2>
    <p class="modal-subtitle">${service.description}</p>
    <div class="modal-section">
      <div class="modal-section-title">How it works</div>
      <p style="font-size: 0.8rem; line-height: 1.6; color: var(--text-muted);">
        This is a front-end prototype. In a production build, this flow would connect to
        Seddiqi's booking, logistics, insurance and CPO systems. You can extend this
        screen into a full wizard: intake details, pickup preferences, and confirmation.
      </p>
    </div>
    <div class="card-actions" style="margin-top: 0.9rem; justify-content: flex-end;">
      <button class="btn btn-ghost" id="svc-detail-close">Close</button>
    </div>
  `;
  openModal(html);
  document
    .getElementById("svc-detail-close")
    .addEventListener("click", closeModal);
}

function setActiveNav(view) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    if (btn.dataset.view === view) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      loadView(view);
    });
  });
}

function loadView(view) {
  if (view === "portfolio") {
    renderTemplate("portfolio-view");
    initPortfolio();
  } else if (view === "services") {
    renderTemplate("services-view");
    initServices();
  } else if (view === "profile") {
    renderTemplate("profile-view");
  }
  setActiveNav(view);
}

initNavigation();
loadView("portfolio");
