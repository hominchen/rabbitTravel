(() => {
  'use strict';
  const WORLD = { width: 1600, height: 2200, carSize: 70, speed: 7 };
  const videos = ['jUnFuJSj0OU','LSkq-wHMxQY','UCG1aXVO8H8','6kUEK3LVrro','q3KJt-SZc2s','BUJJaW0vkJs','aaKOV4qkDHw','qg-aHp2mvS8','sBN5FaqMq7g','rvc1klNIgQc','dQ7Sd6PGLdA','dY2cRNr5Buw','j2L_559nCjc','xwAWSh35uuw','91PfFoqvuUk','JkoXcXI04Qk','BnPoNatG-HE','C03Itx8iSC0','lhXXhDyjFtI','fjhg3gAnMFg','z_fY1pj1VBw','XSD5ptYisw8','215ahZ_0rTg','di-4DCblWq4','Rhkr8qJOFO4','AE1wiaqDZjw'];
  const positions = [[870,2090],[990,1300],[990,1690],[1109,1400],[1158,1475],[1070,1580],[1270,880],[1325,810],[1130,768],[1039,1510],[1214,1370],[759,1118],[802,1185],[1215,143],[1105,214],[1292,1021],[592,1644],[595,1672],[760,769],[732,657],[1299,230],[1460,188],[1313,279],[1222,165],[1494,237],[983,440]];
  const names = ['墾丁南灣', '南橫埡口', '多良車站', '池上天堂路', '金樽海灘', '鯉魚山', '鯉魚潭', '七星潭', '合歡山主峰', '鹿野高台', '三仙台', '太平雲梯', '二延平步道', '淡水漁人碼頭', '桃園國際機場', '大石鼻山', '蓮池潭', '壽山情人觀景台', '望高寮', '高美濕地', '象山看台北', '九份', '貓空指南宮', '八里左岸', '福隆海水浴場', '峨眉湖'];
  const locations = positions.map(([x,y], index) => ({ x, y, name: names[index], radius: 15, url: `https://www.youtube.com/watch?v=${videos[index]}` }));
  const el = { viewport: document.querySelector('#viewport'), world: document.querySelector('#world'), car: document.querySelector('#car'), zones: document.querySelector('#scenic-zones-container'), minimap: document.querySelector('#minimap-container'), pointer: document.querySelector('#minimap-pointer'), coordinates: document.querySelector('#coord-display'), enabled: document.querySelector('#yt-toggle'), modal: document.querySelector('#custom-modal-overlay'), title: document.querySelector('#modal-title'), text: document.querySelector('#modal-text'), confirm: document.querySelector('#modal-confirm'), cancel: document.querySelector('#modal-cancel') };
  let car = { x: 935, y: 887, direction: 'DOWN' };
  let pressed = new Set(); let activeLocation = null; const triggered = new Set();
  const directions = { DOWN: '0 0', UP: '-70px 0', LEFT: '0 -70px', RIGHT: '-70px -70px' };

  function renderLocations() { locations.forEach((location) => { const zone = document.createElement('div'); zone.className = 'scenic-zone'; zone.style.cssText = `width:${location.radius * 2}px;height:${location.radius * 2}px;left:${location.x}px;top:${location.y}px`; const label = document.createElement('div'); label.className = 'scenic-label'; label.textContent = `📍 ${location.name}`; label.style.left = `${location.x}px`; label.style.top = `${location.y}px`; el.zones.append(zone, label); }); }
  function move() { if (pressed.has('arrowup') || pressed.has('w')) { car.y -= WORLD.speed; car.direction = 'UP'; } if (pressed.has('arrowdown') || pressed.has('s')) { car.y += WORLD.speed; car.direction = 'DOWN'; } if (pressed.has('arrowleft') || pressed.has('a')) { car.x -= WORLD.speed; car.direction = 'LEFT'; } if (pressed.has('arrowright') || pressed.has('d')) { car.x += WORLD.speed; car.direction = 'RIGHT'; } car.x = Math.max(0, Math.min(WORLD.width - WORLD.carSize, car.x)); car.y = Math.max(0, Math.min(WORLD.height - WORLD.carSize, car.y)); }
  function updateWorld() { const x = car.x + WORLD.carSize / 2, y = car.y + WORLD.carSize / 2; const left = Math.min(0, Math.max(el.viewport.clientWidth - WORLD.width, el.viewport.clientWidth / 2 - x)); const top = Math.min(0, Math.max(el.viewport.clientHeight - WORLD.height, el.viewport.clientHeight / 2 - y)); el.car.style.left = `${car.x}px`; el.car.style.top = `${car.y}px`; el.car.style.backgroundPosition = directions[car.direction]; el.world.style.left = `${left}px`; el.world.style.top = `${top}px`; el.coordinates.textContent = `目前座標 - X: ${Math.round(x)}, Y: ${Math.round(y)}`; el.pointer.style.left = `${x / WORLD.width * el.minimap.clientWidth}px`; el.pointer.style.top = `${y / WORLD.height * el.minimap.clientHeight}px`; }
  function closeModal() { el.modal.style.display = 'none'; activeLocation = null; }
  function checkLocations() { const x = car.x + WORLD.carSize / 2, y = car.y + WORLD.carSize / 2; locations.forEach((location) => { const distance = Math.hypot(x - location.x, y - location.y); if (distance >= location.radius + 15) triggered.delete(location.name); if (el.enabled.checked && !triggered.has(location.name) && distance < location.radius) { triggered.add(location.name); activeLocation = location; pressed.clear(); el.title.textContent = `發現 ${location.name}`; el.text.textContent = `要開啟 ${location.name} 的 YouTube 影片嗎？`; el.modal.style.display = 'flex'; el.confirm.focus(); } }); }
  function loop() { if (!activeLocation) { move(); checkLocations(); } updateWorld(); requestAnimationFrame(loop); }

  window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && activeLocation) { closeModal(); return; } const key = event.key.toLowerCase(); if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)) { event.preventDefault(); if (!activeLocation) pressed.add(key); } });
  window.addEventListener('keyup', (event) => pressed.delete(event.key.toLowerCase()));
  
  const controls = { 'ctrl-up': 'arrowup', 'ctrl-down': 'arrowdown', 'ctrl-left': 'arrowleft', 'ctrl-right': 'arrowright' };
  Object.entries(controls).forEach(([id,key]) => { const button = document.querySelector(`#${id}`); ['pointerdown','pointerup','pointercancel','pointerleave'].forEach((name) => button.addEventListener(name, (event) => { event.preventDefault(); if (name === 'pointerdown' && !activeLocation) pressed.add(key); else pressed.delete(key); })); });

  // 修正：增加彈出視窗攔截防範邏輯
  el.confirm.addEventListener('click', () => {
    if (activeLocation) {
      const win = window.open(activeLocation.url, '_blank');
      // 若新分頁開啟失敗（被瀏覽器彈出視窗阻擋），則改為直接轉址
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = activeLocation.url;
      }
    }
    closeModal();
  });
  el.cancel.addEventListener('click', closeModal);

  renderLocations(); loop();
})();