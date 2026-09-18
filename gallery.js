  let publishedMedia = {};
  function renderMediaGallery(imageId, thumbsId, photos, placement, name) {
    const image = document.getElementById(imageId);
    const thumbs = document.getElementById(thumbsId);
    if (!image || !thumbs) return;
    const en = currentLang === 'en';
    const items = [...photos.map(src => ({src})), ...(publishedMedia[placement]?.videos || []).map(id => ({id}))];
    const stage = image.parentElement;
    stage.querySelectorAll('.gallery-video').forEach(el => el.remove());
    document.getElementById(imageId + 'Controls')?.remove();
    thumbs.replaceChildren();
    image.hidden = false;
    stage.classList.add('media-stage');
    const video = document.createElement('div'); video.className = 'gallery-video'; video.hidden = true; stage.appendChild(video);
    const controls = document.createElement('div'); controls.className = 'gallery-controls';
    const prev = document.createElement('button'); prev.type = 'button'; prev.textContent = '←'; prev.setAttribute('aria-label', en ? 'Previous media' : 'Vorige afbeelding of video');
    const next = document.createElement('button'); next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', en ? 'Next media' : 'Volgende afbeelding of video');
    const counter = document.createElement('span'); counter.setAttribute('aria-live','polite');
    controls.id = imageId + 'Controls';
    controls.append(prev, counter, next); stage.after(controls);
    controls.hidden = items.length <= 1; thumbs.hidden = items.length <= 1;
    let selected = 0;
    const buttons = [];
    function show(index) {
      selected = (index + items.length) % items.length;
      const item = items[selected];
      video.replaceChildren(); // Unmount the player to stop audio when moving away.
      image.hidden = Boolean(item.id); video.hidden = !item.id;
      const badge = stage.querySelector('.config-status-badge'); if (badge) badge.hidden = Boolean(item.id);
      if (item.src) { image.src = item.src; image.alt = name + ' — ' + (selected + 1); }
      else {
        const play = document.createElement('button'); play.type = 'button'; play.className = 'video-play';
        play.textContent = '▶ ' + (en ? 'Play YouTube video' : 'YouTube-video afspelen');
        const note = document.createElement('p'); note.textContent = en ? 'Playing connects to YouTube.' : 'Afspelen maakt verbinding met YouTube.';
        play.onclick = () => {
          const frame = document.createElement('iframe');
          frame.src = 'https://www.youtube-nocookie.com/embed/' + item.id + '?autoplay=1';
          frame.title = name + ' — YouTube video'; frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';
          const fallback = document.createElement('a'); fallback.href = 'https://www.youtube.com/watch?v=' + item.id; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = en ? 'Watch on YouTube' : 'Bekijk op YouTube';
          video.replaceChildren(frame, fallback);
        };
        video.append(play, note);
      }
      counter.textContent = (selected + 1) + ' / ' + items.length;
      buttons.forEach((button, i) => { button.classList.toggle('active', i === selected); button.setAttribute('aria-pressed', String(i === selected)); });
      if (buttons[selected]) thumbs.scrollLeft = Math.max(0, buttons[selected].offsetLeft - thumbs.offsetLeft - thumbs.clientWidth / 2 + buttons[selected].clientWidth / 2);
    }
    items.forEach((item, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'thumb-item';
      button.setAttribute('aria-label', (item.id ? 'Video ' : en ? 'Photo ' : 'Foto ') + (i + 1));
      if (item.src) { const thumb = document.createElement('img'); thumb.src = item.src; thumb.alt = ''; thumb.loading = 'lazy'; button.appendChild(thumb); }
      else { button.textContent = '▶ Video'; button.classList.add('video-thumb'); }
      button.onclick = () => show(i); buttons.push(button); thumbs.appendChild(button);
    });
    prev.onclick = () => show(selected - 1); next.onclick = () => show(selected + 1);
    stage.tabIndex = 0; stage.setAttribute('aria-label', en ? 'Product media gallery' : 'Productgalerij');
    stage.onkeydown = event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault(); show(selected + (event.key === 'ArrowRight' ? 1 : -1));
    };
    let start;
    stage.ontouchstart = event => { start = [event.changedTouches[0].clientX, event.changedTouches[0].clientY]; };
    stage.ontouchend = event => {
      if (!start) return;
      const dx = event.changedTouches[0].clientX - start[0], dy = event.changedTouches[0].clientY - start[1];
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(selected + (dx < 0 ? 1 : -1));
      start = null;
    };
    show(0);
  }
  async function loadPublishedMedia() {
    try {
      const response = await fetch('/api/media', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      if (!data.placements) return;
      publishedMedia = data.placements;
      if (detailModelKey) updateModelConfigurator();
      if (detailAccessory) renderAccessoryDetail();
      const home = document.getElementById('homeVideos');
      if (!detailModelKey && !detailAccessory && publishedMedia['/']?.videos?.length) {
        home.hidden = false;
        renderMediaGallery('homeVideoImage', 'homeVideoThumbs', [], '/', 'SmokeyKamado');
      }
    } catch { /* Photos remain available if media cannot be loaded. */ }
  }
