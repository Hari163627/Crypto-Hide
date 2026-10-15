/* ============================================
   CryptoHide — логика
   ВСЁ ФЕЙКОВОЕ. Никаких реальных денег.
   ============================================ */

(function () {
  "use strict";

  /* ---------- Telegram WebApp SDK ---------- */
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  /* ---------- Тема ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    }
    localStorage.setItem("ch_theme", theme);
  }

  const savedTheme = localStorage.getItem("ch_theme");
  const initialTheme = savedTheme || (tg && tg.colorScheme) || "dark";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Переключение вкладок ---------- */
  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");

  navItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const target = item.getAttribute("data-page");
      const title = item.getAttribute("data-title") || "CryptoHide";

      navItems.forEach(function (n) { n.classList.remove("active"); });
      item.classList.add("active");

      pages.forEach(function (p) { p.classList.remove("active"); });
      const page = document.getElementById("page-" + target);
      if (page) page.classList.add("active");

      if (pageTitle) pageTitle.textContent = title;

      window.scrollTo({ top: 0, behavior: "instant" });
    });
  });

  /* ---------- Модалка ---------- */
  function showModal(title, body) {
    const old = document.getElementById("globalModal");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay active";
    overlay.id = "globalModal";
    overlay.innerHTML =
      '<div class="modal">' +
        '<h2>' + title + '</h2>' +
        '<p>' + body + '</p>' +
        '<button class="btn btn-primary" id="modalCloseBtn">Понятно</button>' +
      '</div>';

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);

    document.getElementById("modalCloseBtn").addEventListener("click", function () {
      overlay.remove();
    });
  }

  /* ---------- Форматирование ---------- */
  function formatNumber(n, digits) {
    return n.toLocaleString("ru-RU", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }
  function formatRub(n) {
    return "₽ " + formatNumber(n, 2);
  }

  /* ---------- Данные монет ---------- */
  const coins = [
    { symbol: "USDT", name: "Tether",       amount: 22157.903309, price: 0.9988,   change:  0.00, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png" },
    { symbol: "GRAM", name: "Gram",         amount: 0,            price: 1.34,     change: -2.42, icon: "" },
    { symbol: "BTC",  name: "Bitcoin",      amount: 0,            price: 80783.21, change: -3.43, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png" },
    { symbol: "DOGE", name: "Dogecoin",     amount: 0,            price: 0.07982,  change: -5.63, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/doge.png" },
    { symbol: "LTC",  name: "Litecoin",     amount: 0,            price: 58.31,    change: -5.54, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/ltc.png" },
    { symbol: "ETH",  name: "Ethereum",     amount: 0,            price: 2377.87,  change: -5.18, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png" },
    { symbol: "BNB",  name: "Binance Coin", amount: 0,            price: 720.10,   change: -3.06, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png" },
    { symbol: "TRX",  name: "TRON",         amount: 0,            price: 0.3321,   change:  0.15, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/trx.png" },
    { symbol: "USDC", name: "USD Coin",     amount: 0,            price: 0.9997,   change: -0.01, icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdc.png" },
    { symbol: "JET",  name: "TON Jetton",   amount: 0,            price: 1.75,     change:  0.00, icon: "" },
    { symbol: "SEND", name: "Crypto Bot",   amount: 0,            price: 0.01,     change:  0.00, icon: "" }
  ];

  /* ---------- Отрисовка монет ---------- */
  function renderCoins(hideSmall) {
    const list = document.getElementById("coinsList");
    if (!list) return;
    list.innerHTML = "";

    coins.forEach(function (c) {
      const isSmall = c.amount === 0;
      const usd = c.amount * c.price;
      const changeClass = c.change >= 0 ? "up" : "down";
      const changeSign = c.change >= 0 ? "+" : "";

      const li = document.createElement("li");
      li.className = "coin-row" + (isSmall && hideSmall ? " hidden-small" : "");

      const iconHtml = c.icon
        ? '<img class="coin-icon" src="' + c.icon + '" alt="' + c.symbol + '" loading="lazy" />'
        : '<span class="coin-icon-letter">' + c.symbol.charAt(0) + '</span>';

      li.innerHTML =
        '<div class="coin-left">' +
          iconHtml +
          '<div class="coin-meta">' +
            '<div class="coin-name">' + c.name + '</div>' +
            '<div class="coin-price">$' + formatNumber(c.price, c.price < 1 ? 4 : 2) +
              ' <span class="' + changeClass + '">' + changeSign + c.change.toFixed(2) + '%</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="coin-right">' +
          '<div class="coin-amount">' + formatNumber(c.amount, 2) + ' ' + c.symbol + '</div>' +
          '<div class="coin-usd">' + formatRub(usd) + '</div>' +
        '</div>';

      li.addEventListener("click", function () {
        showModal(c.name + " (" + c.symbol + ")",
          "Это тестовая функция. Монеты не имеют реальной ценности.");
      });

      list.appendChild(li);
    });
  }

  /* ---------- Кнопки кошелька ---------- */
  const actionMap = {
    deposit:  ["Пополнить", "Тестовое пополнение. Реальные монеты не зачисляются."],
    withdraw: ["Вывести",   "Тестовый вывод. Реальные монеты не выводятся."],
    history:  ["История",   "Здесь была бы полная история операций."]
  };

  document.querySelectorAll("[data-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.getAttribute("data-action");
      const a = actionMap[key];
      if (a) showModal(a[0], a[1]);
    });
  });

  /* ---------- Глаз: скрыть баланс ---------- */
  let balanceHidden = false;
  const eye = document.getElementById("eyeToggle");
  const balanceValueEl = document.getElementById("balanceValue");
  const BASE_BALANCE = 1853804.83;

  if (eye && balanceValueEl) {
    eye.addEventListener("click", function () {
      balanceHidden = !balanceHidden;
      balanceValueEl.textContent = balanceHidden ? "₽ ••••••" : formatRub(BASE_BALANCE);
      eye.textContent = balanceHidden ? "🙈" : "👁";
    });
  }

  /* ---------- Скрыть мелкие балансы ---------- */
  let hideSmall = false;
  const hideSmallBtn = document.getElementById("hideSmallToggle");

  if (hideSmallBtn) {
    hideSmallBtn.addEventListener("click", function () {
      hideSmall = !hideSmall;
      hideSmallBtn.textContent = hideSmall
        ? "Показать мелкие балансы"
        : "Скрыть мелкие балансы";
      renderCoins(hideSmall);
    });
  }

  /* ---------- Первый рендер ---------- */
  renderCoins(false);

})();
