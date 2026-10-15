/* ============================================
   CryptoHide — логика мини-приложения
   ВСЁ ФЕЙКОВОЕ. Никаких реальных денег и блокчейна.
   ============================================ */

(function () {
  "use strict";

  /* ---------- Telegram WebApp SDK ---------- */
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  if (tg) {
    tg.ready();
    tg.expand();

    // Подхватываем тему из Telegram (если пользователь не переключал вручную)
    const savedTheme = localStorage.getItem("ch_theme");
    if (!savedTheme && tg.colorScheme) {
      document.documentElement.setAttribute("data-theme", tg.colorScheme);
    }
  }

  /* ---------- Тема ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("ch_theme", theme);
  }

  // Стартовая тема: сохранённая → из Telegram → тёмная
  const initialTheme =
    localStorage.getItem("ch_theme") ||
    (tg && tg.colorScheme) ||
    "dark";
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ---------- Данные (фейковые) ---------- */
  // price — «цена» в USDT за 1 монету (вымышленная)
  // amount — сколько монет «на балансе»
  // change — изменение за 24ч в %
  const coins = [
    { symbol: "USDT", name: "Tether",       amount: 1240.50, price: 1.00,     change:  0.01, color: "#26a17b" },
    { symbol: "TON",  name: "Toncoin",      amount: 45.20,   price: 6.85,     change:  2.34, color: "#0098ea" },
    { symbol: "BTC",  name: "Bitcoin",      amount: 0.0125,  price: 67420.00, change: -1.12, color: "#f7931a" },
    { symbol: "ETH",  name: "Ethereum",     amount: 0.34,    price: 3285.40,  change:  0.87, color: "#627eea" },
    { symbol: "TRX",  name: "TRON",         amount: 320.00,  price: 0.128,    change: -0.45, color: "#eb0029" }
  ];

  const history = [
    { type: "Получено",   amount:  +120.00, symbol: "USDT", date: "сегодня, 14:22" },
    { type: "Отправлено", amount:   -45.50, symbol: "USDT", date: "сегодня, 11:07" },
    { type: "Обмен",      amount:   +12.30, symbol: "TON",  date: "вчера, 19:41" },
    { type: "Получено",   amount:   +0.002,symbol: "BTC",  date: "вчера, 08:15" },
    { type: "Отправлено", amount:   -8.00,  symbol: "TRX",  date: "12 окт, 22:03" }
  ];

  /* ---------- Форматирование ---------- */
  function formatAmount(n, symbol) {
    let digits = 2;
    if (symbol === "BTC" || symbol === "ETH") digits = 4;
    if (symbol === "TRX") digits = 2;
    return n.toLocaleString("ru-RU", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function formatUsd(n) {
    return "$" + n.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /* ---------- Отрисовка баланса ---------- */
  function renderBalance() {
    // Считаем общий баланс в USDT
    let totalUsdt = 0;
    let totalUsd = 0;

    coins.forEach(c => {
      const value = c.amount * c.price; // в USDT
      totalUsdt += value;
      totalUsd += value; // USDT ≈ USD для нашей фейковой модели
    });

    document.getElementById("balanceValue").textContent =
      formatAmount(totalUsdt, "USDT") + " USDT";
    document.getElementById("balanceUsd").textContent =
      "≈ " + formatUsd(totalUsd);
  }

  /* ---------- Отрисовка монет ---------- */
  function renderCoins() {
    const list = document.getElementById("coinsList");
    list.innerHTML = "";

    coins.forEach(c => {
      const usdValue = c.amount * c.price;

      const li = document.createElement("li");
      li.className = "coin-item";
      li.innerHTML = `
        <div class="coin-left">
          <div class="coin-icon" style="background:${c.color}">
            ${c.symbol.slice(0, 1)}
          </div>
          <div class="coin-meta">
            <div class="coin-name">${c.name}</div>
            <div class="coin-symbol">${c.symbol}</div>
          </div>
        </div>
        <div class="coin-right">
          <div class="coin-amount">${formatAmount(c.amount, c.symbol)}</div>
          <div class="coin-usd">${formatUsd(usdValue)}</div>
          <div class="coin-change ${c.change >= 0 ? "up" : "down"}">
            ${c.change >= 0 ? "▲" : "▼"} ${Math.abs(c.change).toFixed(2)}%
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  }

  /* ---------- Отрисовка истории ---------- */
  function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.forEach(h => {
      const li = document.createElement("li");
      li.className = "history-item";
      const sign = h.amount >= 0 ? "+" : "−";
      const cls = h.amount >= 0 ? "in" : "out";
      li.innerHTML = `
        <div class="history-left">
          <div class="history-type">${h.type}</div>
          <div class="history-date">${h.date}</div>
        </div>
        <div class="history-amount ${cls}">
          ${sign}${formatAmount(Math.abs(h.amount), h.symbol)} ${h.symbol}
        </div>
      `;
      list.appendChild(li);
    });
  }

  /* ---------- Модалки ---------- */
  const welcomeModal = document.getElementById("welcomeModal");
  const actionModal = document.getElementById("actionModal");
  const actionTitle = document.getElementById("actionTitle");
  const actionBody = document.getElementById("actionBody");

  function openAction(title, body) {
    actionTitle.textContent = title;
    actionBody.textContent = body;
    actionModal.classList.add("active");
  }

  document.getElementById("actionClose").addEventListener("click", () => {
    actionModal.classList.remove("active");
  });

  actionModal.addEventListener("click", (e) => {
    if (e.target === actionModal) actionModal.classList.remove("active");
  });

  // Приветственная модалка — только один раз
  const seenWelcome = localStorage.getItem("ch_welcome_seen");
  if (!seenWelcome) {
    welcomeModal.classList.add("active");
  }

  document.getElementById("welcomeOk").addEventListener("click", () => {
    welcomeModal.classList.remove("active");
    localStorage.setItem("ch_welcome_seen", "1");
  });

  /* ---------- Обработчики действий ---------- */
  const actions = {
    buy:       ["Купить",    "Тестовая функция покупки. Реальные монеты не покупаются."],
    sell:      ["Продать",   "Тестовая функция продажи. Реальные монеты не продаются."],
    send:      ["Перевести", "Тестовая функция перевода. Средства никуда не уходят."],
    deposit:   ["Пополнить", "Тестовое пополнение. Реальные средства не зачисляются."],
    withdraw:  ["Вывести",   "Тестовый вывод. Реальные средства не выводятся."],
    swap:      ["Обменять",  "Тестовый обмен. Курсы вымышлены."],
    history:   ["История",   "Здесь была бы полная история. В тестовой версии доступны только последние операции."]
  };

  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-action");
      const a = actions[key];
      if (a) openAction(a[0], a[1]);
    });
  });

  /* ---------- Инициализация ---------- */
  renderBalance();
  renderCoins();
  renderHistory();

})();
