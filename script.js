/* ============================================
   CryptoHide — логика
   Всё фейковое. Никаких реальных денег.
   ============================================ */

(function () {
  "use strict";

  /* ---------- Telegram WebApp SDK ---------- */
  var tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
  if (tg) {
    tg.ready();
    tg.expand();
  }

  /* ---------- Тема ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = (theme === "dark") ? "🌙" : "☀️";
    }
    localStorage.setItem("ch_theme", theme);
  }

  var savedTheme = localStorage.getItem("ch_theme");
  var initialTheme = savedTheme || (tg && tg.colorScheme) || "dark";
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = (root.getAttribute("data-theme") === "dark") ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Переключение вкладок ---------- */
  var navItems = document.querySelectorAll(".nav-item");
  var pages = document.querySelectorAll(".page");
  var pageTitle = document.getElementById("pageTitle");

  navItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      var target = item.getAttribute("data-page");
      var title = item.getAttribute("data-title");

      navItems.forEach(function (n) { n.classList.remove("active"); });
      item.classList.add("active");

      pages.forEach(function (p) { p.classList.remove("active"); });
      var page = document.getElementById("page-" + target);
      if (page) page.classList.add("active");

      if (pageTitle && title) pageTitle.textContent = title;

      window.scrollTo(0, 0);
    });
  });

  /* ---------- Модалка ---------- */
  function showModal(title, body) {
    var old = document.getElementById("globalModal");
    if (old) old.remove();

    var overlay = document.createElement("div");
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

    var closeBtn = document.getElementById("modalCloseBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        overlay.remove();
      });
    }
  }

  /* ---------- Данные монет ---------- */
  var CDN = "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/";
  var coins = [
    { symbol: "USDT", name: "Tether",       amount: 22157.903309, price: 1.0,      change:  0.00, icon: CDN + "usdt.png" },
    { symbol: "GRAM", name: "Gram",         amount: 0,            price: 1.34,     change: -2.42, icon: "" },
    { symbol: "BTC",  name: "Bitcoin",      amount: 0,            price: 80783.21, change: -3.43, icon: CDN + "btc.png" },
    { symbol: "DOGE", name: "Dogecoin",     amount: 0,            price: 0.07982,  change: -5.63, icon: CDN + "doge.png" },
    { symbol: "LTC",  name: "Litecoin",     amount: 0,            price: 58.31,    change: -5.54, icon: CDN + "ltc.png" },
    { symbol: "ETH",  name: "Ethereum",     amount: 0,            price: 2377.87,  change: -5.18, icon: CDN + "eth.png" },
    { symbol: "BNB",  name: "Binance Coin", amount: 0,            price: 720.10,   change: -3.06, icon: CDN + "bnb.png" },
    { symbol: "TRX",  name: "TRON",         amount: 0,            price: 0.3321,   change:  0.15, icon: CDN + "trx.png" },
    { symbol: "USDC", name: "USD Coin",     amount: 0,            price: 0.9997,   change: -0.01, icon: CDN + "usdc.png" },
    { symbol: "JET",  name: "TON Jetton",   amount: 0,            price: 1.75,     change:  0.00, icon: "" },
    { symbol: "SEND", name: "Crypto Bot",   amount: 0,            price: 0.01,     change:  0.00, icon: "" }
  ];

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

  /* ---------- Отрисовка монет ---------- */
  function renderCoins(hideSmall) {
    var list = document.getElementById("coinsList");
    if (!list) return;
    list.innerHTML = "";

    coins.forEach(function (c) {
      var isSmall = c.amount === 0;
      if (hideSmall && isSmall) return;

      var usd = c.amount * c.price;
      var changeClass = (c.change >= 0) ? "up" : "down";
      var changeSign = (c.change >= 0) ? "+" : "";

      var li = document.createElement("li");
      li.className = "coin-row";

      var iconHtml;
      if (c.icon) {
        iconHtml = '<img class="coin-icon" src="' + c.icon + '" alt="' + c.symbol + '" loading="lazy" />';
      } else {
        iconHtml = '<span class="coin-icon letter">' + c.symbol.charAt(0) + '</span>';
      }

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
        showModal(c.name + " (" + c.symbol + ")", "Это тестовая функция. Монеты не имеют реальной ценности.");
      });

      list.appendChild(li);
    });
  }

  /* ---------- Кнопки кошелька ---------- */
  document.querySelectorAll("[data-action]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var a = btn.getAttribute("data-action");
      var map = {
        deposit:  ["Пополнить",  "Тестовое пополнение. Реальные монеты не зачисляются."],
        withdraw: ["Вывести",    "Тестовый вывод. Реальные монеты не выводятся."],
        history:  ["История",    "Здесь была бы полная история операций. В тестовой версии её нет."]
      };
      if (map[a]) showModal(map[a][0], map[a][1]);
    });
  });

  /* ---------- Глаз (скрыть баланс) ---------- */
  var balanceHidden = false;
  var eye = document.getElementById("eyeToggle");
  var balanceValueEl = document.getElementById("balanceValue");
  if (eye && balanceValueEl) {
    eye.addEventListener("click", function () {
      balanceHidden = !balanceHidden;
      balanceValueEl.textContent = balanceHidden ? "₽ ••••••" : formatRub(1853804.83);
      eye.textContent = balanceHidden ? "🙈" : "👁";
    });
  }

  /* ---------- Скрыть мелкие балансы ---------- */
  var hideSmall = false;
  var hideSmallBtn = document.getElementById("hideSmallToggle");
  if (hideSmallBtn) {
    hideSmallBtn.addEventListener("click", function () {
      hideSmall = !hideSmall;
      hideSmallBtn.textContent = hideSmall ? "Показать мелкие балансы" : "Скрыть мелкие балансы";
      renderCoins(hideSmall);
    });
  }

  /* ---------- Первый рендер ---------- */
  renderCoins(false);

})();
