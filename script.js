// Papa Sureña - interacción básica
(function(){
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const header = document.querySelector('.site-header');
  if(navToggle && primaryNav){
    navToggle.addEventListener('click', ()=>{
      const open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    primaryNav.addEventListener('click', (e)=>{
      if(e.target.closest('a')){
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 920){
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // Header shadow when scrolling
  if(header){
    const onScroll = ()=>{
      if(window.scrollY > 8){ header.classList.add('is-scrolled'); }
      else{ header.classList.remove('is-scrolled'); }
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  const form = document.getElementById('contactForm');
  if(!form) return;

  const PHONE = '56958979618'; // Chile: +56 9 5897 9618 (para wa.me sin + ni espacios)

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const producto = fd.get('producto')||'Papa Patagonia';
    const nombre = (fd.get('nombre')||'').toString().trim();
    const telefono = (fd.get('telefono')||'').toString().trim();
    const ciudad = (fd.get('ciudad')||'').toString().trim();
    const empresa = (fd.get('empresa')||'').toString().trim();
    const cantidad = (fd.get('cantidad')||'').toString().trim();
    const mensaje = (fd.get('mensaje')||'').toString().trim();

    // Validación mínima UX
    const required = {nombre, telefono, ciudad, producto, cantidad};
    for(const [k,v] of Object.entries(required)){
      if(!v){
        alert('Por favor completa: ' + k);
        return;
      }
    }

    const parts = [
      `Hola, quiero cotizar ${producto}.`,
      cantidad ? `Cantidad: ${cantidad} sacos` : '',
      nombre ? `Nombre: ${nombre}` : '',
      telefono ? `Tel: ${telefono}` : '',
      ciudad ? `Ciudad: ${ciudad}` : '',
      empresa ? `Empresa: ${empresa}` : '',
      mensaje ? `Detalle: ${mensaje}` : ''
    ].filter(Boolean);

    const texto = parts.join('\n');
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  });

  // Lightbox for gallery
  const lightboxEl = document.getElementById('lightbox');
  const lbContent = lightboxEl ? lightboxEl.querySelector('.lightbox__content') : null;
  const lbClose = lightboxEl ? lightboxEl.querySelector('.lightbox__close') : null;
  const lbPrev = lightboxEl ? lightboxEl.querySelector('.lightbox__prev') : null;
  const lbNext = lightboxEl ? lightboxEl.querySelector('.lightbox__next') : null;

  const items = Array.from(document.querySelectorAll('.media-masonry .mitem'));
  const mediaList = items.map(it=>{
    const img = it.querySelector('img');
    const vid = it.querySelector('video');
    if(img) return {type:'img', src:img.currentSrc || img.src, alt:img.alt||''};
    if(vid){
      const srcEl = vid.querySelector('source');
      return {type:'video', src: (srcEl && srcEl.src) || vid.currentSrc || '', poster: vid.getAttribute('poster')||''};
    }
    return null;
  }).filter(Boolean);

  let current = -1;
  function openLightbox(index){
    if(!lightboxEl || !lbContent) return;
    current = index;
    const media = mediaList[current];
    lbContent.innerHTML = '';
    if(media.type === 'img'){
      const el = document.createElement('img');
      el.src = media.src;
      el.alt = media.alt || 'Imagen de galería';
      lbContent.appendChild(el);
    }else if(media.type === 'video'){
      const el = document.createElement('video');
      el.controls = true; el.playsInline = true; el.preload = 'metadata';
      if(media.poster) el.poster = media.poster;
      const source = document.createElement('source');
      source.src = media.src; source.type = 'video/mp4';
      el.appendChild(source);
      lbContent.appendChild(el);
      el.play().catch(()=>{});
    }
    // Caption
    const cap = document.createElement('div');
    cap.className = 'lightbox__caption';
    cap.textContent = media.type === 'img' ? (media.alt || 'Imagen') : 'Video';
    lbContent.appendChild(cap);
    lightboxEl.setAttribute('aria-hidden','false');
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overflow = 'hidden';
    setTimeout(()=>{ document.documentElement.style.scrollBehavior = ''; }, 0);
  }
  function closeLightbox(){
    if(!lightboxEl) return;
    lightboxEl.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    current = -1;
  }
  function next(){ if(current < mediaList.length-1) openLightbox(current+1); else openLightbox(0); }
  function prev(){ if(current > 0) openLightbox(current-1); else openLightbox(mediaList.length-1); }

  items.forEach((it,idx)=>{
    it.addEventListener('click', (e)=>{
      e.preventDefault();
      openLightbox(idx);
    });
  });
  if(lightboxEl){
    lbClose && lbClose.addEventListener('click', closeLightbox);
    lbNext && lbNext.addEventListener('click', next);
    lbPrev && lbPrev.addEventListener('click', prev);
    lightboxEl.addEventListener('click', (e)=>{
      if(e.target === lightboxEl) closeLightbox();
    });
    document.addEventListener('keydown', (e)=>{
      if(lightboxEl.getAttribute('aria-hidden') === 'true') return;
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
    });

    // Touch swipe for mobile
    let touchStartX = 0, touchStartY = 0, touching = false;
    const threshold = 40; // px
    const onStart = (e)=>{
      const t = e.touches ? e.touches[0] : e;
      touchStartX = t.clientX; touchStartY = t.clientY; touching = true;
    };
    const onEnd = (e)=>{
      if(!touching) return; touching = false;
      const t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : e;
      const dx = t.clientX - touchStartX; const dy = t.clientY - touchStartY;
      if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold){
        if(dx < 0) next(); else prev();
      }
    };
    lbContent && lbContent.addEventListener('touchstart', onStart, {passive:true});
    lbContent && lbContent.addEventListener('touchend', onEnd, {passive:true});
  }
})();
