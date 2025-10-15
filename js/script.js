/* Shared script for site - theme, discover population, basic messaging hooks */
(function(){
  // year
  document.querySelectorAll('#year').forEach(e=>e.textContent = new Date().getFullYear());
  // theme toggle
  const tgl = document.getElementById('darkToggle');
  if(tgl){
    const saved = localStorage.getItem('lc_theme'); if(saved === 'dark') document.body.classList.add('dark');
    tgl.addEventListener('click', ()=>{
      document.body.classList.toggle('dark');
      localStorage.setItem('lc_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // populate discover grid if present
  const profiles = [
    {id:1,name:'Anna',age:25,bio:'Loves travel, dogs, and movies',photo:'https://i.pravatar.cc/400?img=11'},
    {id:2,name:'Mark',age:28,bio:'Music producer, gym freak',photo:'https://i.pravatar.cc/400?img=12'},
    {id:3,name:'Ella',age:23,bio:'Coffee addict and night owl',photo:'https://i.pravatar.cc/400?img=13'},
    {id:4,name:'Sofia',age:27,bio:'Designer & plant parent',photo:'https://i.pravatar.cc/400?img=14'},
    {id:5,name:'James',age:31,bio:'Photographer',photo:'https://i.pravatar.cc/400?img=15'}
  ];
  const grid = document.getElementById('discoverGrid');
  if(grid){
    profiles.forEach(p=>{
      const div=document.createElement('div');div.className='profile-card card';
      div.innerHTML=`<img src="${p.photo}" alt="${p.name}"><h3>${p.name}, ${p.age}</h3><p>${p.bio}</p><div style="margin-top:10px;display:flex;gap:8px"><button class="btn primary like" data-id="${p.id}">❤ Like</button><a class="btn ghost" href="messages.html">Message</a></div>`;
      grid.appendChild(div);
    });
  }

  // simple messages page convo list populate
  const convoList = document.getElementById('convoList');
  if(convoList){
    const people = profiles.slice(0,5);
    people.forEach(p=>{
      const li = document.createElement('li'); li.className='convo-item';
      li.innerHTML=`<img src="${p.photo}" alt="${p.name}"/><div class="meta"><div class="name">${p.name}</div><div class="snippet">${p.bio}</div></div>`;
      li.addEventListener('click', ()=> {
        // on click, open simple chat tab by navigating to messages.html?open=ID (for multi-page mock)
        // but here we will simply create a sample convo in the DOM if chatWindow exists
        const tabsBar = document.getElementById('tabsBar');
        const chatWindow = document.getElementById('chatWindow');
        if(!tabsBar || !chatWindow) return;
        // create a tab
        const tabId = 'tab-'+p.id;
        if(!document.querySelector('#'+tabId)){
          const tab = document.createElement('div'); tab.className='tab active'; tab.id=tabId;
          tab.innerHTML=`<img src="${p.photo}" style="width:34px;height:34px;border-radius:8px;object-fit:cover"/><div style="min-width:120px">${p.name}</div><button class="close">✕</button>`;
          tab.querySelector('.close').addEventListener('click', (ev)=>{ ev.stopPropagation(); tab.remove(); chatWindow.innerHTML='<div class="chat-empty"><p>No chat open — click a person on the left to open a conversation</p></div>'; });
          tab.addEventListener('click', ()=>{ /* activate tab */ });
          tabsBar.appendChild(tab);
        }
        // render chat window content
        chatWindow.innerHTML = `<div class="chat-top"><img src="${p.photo}" style="width:44px;height:44px;border-radius:8px;object-fit:cover"/><div><strong>${p.name}</strong><div style="font-size:13px;color:#6b7280">${p.bio}</div></div></div>`;
        const messagesPane = document.createElement('div'); messagesPane.className='messages-pane';
        messagesPane.innerHTML = '<div class="msg them">Hey there! 👋</div><div class="msg me">Hi! Nice to meet you</div>';
        const composer = document.createElement('div'); composer.className='composer';
        composer.innerHTML = '<input placeholder="Write a message..."/><button class="btn primary">Send</button>';
        composer.querySelector('button').addEventListener('click', ()=>{
          const txt = composer.querySelector('input').value.trim(); if(!txt) return;
          const d = document.createElement('div'); d.className='msg me'; d.textContent=txt; messagesPane.appendChild(d); composer.querySelector('input').value='';
        });
        chatWindow.appendChild(messagesPane); chatWindow.appendChild(composer);
      });
      convoList.appendChild(li);
    });
  }

  // profile page load/save
  const profileForm = document.getElementById('profileForm');
  if(profileForm){
    profileForm.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Profile saved (local mock).'); });
    document.getElementById('resetProfile').addEventListener('click', ()=>{ if(confirm('Reset profile?')){ document.getElementById('inputName').value=''; document.getElementById('inputBio').value=''; document.getElementById('inputLocation').value=''; }});
  }

  // notifications page
  const notifList = document.getElementById('notificationsList');
  if(notifList){
    notifList.innerHTML = '<li>No notifications yet</li>';
  }
})();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}
