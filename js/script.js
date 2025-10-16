/* js/app.js
   Shared logic:
   - Hamburger open/close
   - Dark mode toggle (persist)
   - Year in footer
   - Messages page interactive: conversations, send, auto-reply, typing indicator
*/

(function () {
  // Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Dark mode persistence & toggles
  const rootEl = document.documentElement;
  const darkKey = 'loveconnect_dark';
  const setDark = (isDark) => {
    if (isDark) rootEl.classList.add('dark');
    else rootEl.classList.remove('dark');
    localStorage.setItem(darkKey, isDark ? '1' : '0');
    updateThemeIcons(isDark);
    // mobile toggle
    const dot = document.getElementById('mobileToggleDot');
    if (dot) dot.style.transform = isDark ? 'translateX(1.25rem)' : 'translateX(0)';
  };
  const saved = localStorage.getItem(darkKey);
  if (saved === null) {
    // Respect system pref
    setDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } else {
    setDark(saved === '1');
  }

  function updateThemeIcons(isDark) {
    const svgEls = document.querySelectorAll('#themeIconTop');
    svgEls.forEach(svg => {
      svg.innerHTML = isDark
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.66l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m15.66 4.66l-.7-.7M4.04 4.04l-.7-.7"/>`;
    });
  }

  const topToggle = document.getElementById('themeToggleTop');
  if (topToggle) topToggle.addEventListener('click', () => {
    setDark(!rootEl.classList.contains('dark'));
  });

  const mobileDarkToggle = document.getElementById('mobileDarkToggle');
  if (mobileDarkToggle) {
    mobileDarkToggle.addEventListener('click', () => {
      setDark(!rootEl.classList.contains('dark'));
    });
  }

  // ------- MESSAGES PAGE LOGIC -------
  const convoData = [
    { id: 'anna', name: 'Anna', avatar: 'https://i.pravatar.cc/100?img=12', last: 'Hey, how’s it going?', status: 'Online' },
    { id: 'james', name: 'James', avatar: 'https://i.pravatar.cc/100?img=8', last: 'See you soon!', status: 'Offline' },
    { id: 'maria', name: 'Maria', avatar: 'https://i.pravatar.cc/100?img=32', last: 'Love the pics!', status: 'Online' },
  ];

  function initConvos() {
    const list = document.getElementById('convoList');
    if (!list) return;
    list.innerHTML = '';
    convoData.forEach((c, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/40 cursor-pointer';
      li.dataset.id = c.id;
      li.innerHTML = `
        <img src="${c.avatar}" class="w-12 h-12 rounded-full" alt="">
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <strong class="block">${c.name}</strong>
            <span class="text-xs text-gray-400">${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${c.last}</p>
        </div>
      `;
      li.addEventListener('click', () => openConversation(c.id));
      list.appendChild(li);
    });
    // auto open first
    openConversation(convoData[0].id);
  }

  // conversation state
  let currentConvo = null;
  const chatWindow = document.getElementById('chatWindow');
  const chatNameEl = document.getElementById('chatName');
  const chatAvatarEl = document.getElementById('chatAvatar');
  const chatStatusEl = document.getElementById('chatStatus');

  const messagesStore = {
    anna: [
      { from: 'them', text: 'Hey! How’s your day?', time: Date.now() - 600000 },
      { from: 'me', text: 'Pretty good, working on a new app 😄', time: Date.now() - 550000 },
      { from: 'them', text: 'Ooh nice! Can’t wait to see it!', time: Date.now() - 540000 },
    ],
    james: [{ from: 'them', text: 'See you soon!', time: Date.now() - 3600000 }],
    maria: [{ from: 'them', text: 'Love the pics!', time: Date.now() - 7200000 }],
  };

  function openConversation(id) {
    currentConvo = id;
    const convo = convoData.find(c => c.id === id);
    if (!convo) return;
    // update header
    if (chatNameEl) chatNameEl.textContent = convo.name;
    if (chatAvatarEl) chatAvatarEl.src = convo.avatar;
    if (chatStatusEl) chatStatusEl.textContent = convo.status;

    // render messages
    renderMessages();
  }

  function renderMessages() {
    if (!chatWindow || !currentConvo) return;
    chatWindow.innerHTML = '';
    const msgs = messagesStore[currentConvo] || [];
    msgs.forEach(m => {
      const wrapper = document.createElement('div');
      wrapper.className = m.from === 'me' ? 'flex justify-end' : 'flex justify-start';
      const bubble = document.createElement('div');
      bubble.className = 'max-w-[70%] px-4 py-2 rounded-2xl';
      bubble.classList.add(m.from === 'me' ? 'bg-pink-500 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none');
      bubble.innerHTML = `<div class="whitespace-pre-wrap">${escapeHtml(m.text)}</div>
        <div class="text-[11px] text-gray-400 mt-1 text-right">${new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>`;
      wrapper.appendChild(bubble);
      chatWindow.appendChild(wrapper);
    });
    // typing placeholder handled separately
    setTimeout(scrollToBottom, 10);
  }

  function scrollToBottom() {
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight + 200;
  }

  // Input and sending
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentConvo) return;
    const msg = { from: 'me', text, time: Date.now() };
    messagesStore[currentConvo] = messagesStore[currentConvo] || [];
    messagesStore[currentConvo].push(msg);
    messageInput.value = '';
    renderMessages();

    // simulate typing indicator + auto reply from "them"
    simulateReply(currentConvo, text);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (messageInput) {
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // simple typing indicator and auto-reply
  let typingTimeout = null;
  function simulateReply(convoId, userText) {
    if (!chatWindow) return;

    // show typing
    const indicator = document.createElement('div');
    indicator.className = 'flex justify-start items-end';
    indicator.innerHTML = `<div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-none inline-flex items-center gap-2">
      <span class="dot w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
      <span class="dot w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></span>
      <span class="dot w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></span>
    </div>`;
    chatWindow.appendChild(indicator);
    scrollToBottom();

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      // remove typing indicator
      indicator.remove();
      // push reply
      const replyText = autoReplyText(userText);
      const msg = { from: 'them', text: replyText, time: Date.now() };
      messagesStore[convoId] = messagesStore[convoId] || [];
      messagesStore[convoId].push(msg);
      renderMessages();
    }, 900 + Math.random() * 1200);
  }

  function autoReplyText(userText) {
    // simple canned replies, slightly varied
    const samples = [
      "That sounds great! Tell me more 😊",
      "Haha love that!",
      "Amazing — I want to hear more!",
      "Nice! When can we meet?",
      "Loved that — send me a pic!"
    ];
    return samples[Math.floor(Math.random()*samples.length)];
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  // Search filter
  const convoSearch = document.getElementById('convoSearch');
  if (convoSearch) {
    convoSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const items = document.querySelectorAll('#convoList li');
      items.forEach(li => {
        const name = li.querySelector('strong').textContent.toLowerCase();
        const last = li.querySelector('p').textContent.toLowerCase();
        li.style.display = (name.includes(q) || last.includes(q)) ? '' : 'none';
      });
    });
  }

  // init on load
  document.addEventListener('DOMContentLoaded', () => {
    initConvos();
    updateThemeIcons(rootEl.classList.contains('dark'));
  });

})();
