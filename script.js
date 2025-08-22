// Papa Sureña - interacción básica
(function(){
  const yearEl = document.getElementById('y');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
  // store previously focused element when opening overlays (nav / lightbox)
  let prevFocus = null;
  // helper: set/unset inert behavior on container (with fallback for browsers without inert)
  function setInert(container, inert){
    if(!container) return;
    try{ // try native inert where supported
      container.inert = !!inert;
    }catch(err){}
    if(inert){
      // store focusable items and disable them
      const focusable = Array.from(container.querySelectorAll('a,button,input,textarea,select,[tabindex]'));
      container.__inertStore = focusable.map(el=>({el, prevTab: el.getAttribute('tabindex')}));
      focusable.forEach(el=>{
        try{ el.setAttribute('tabindex','-1'); }catch(e){}
      });
    } else {
      const store = container.__inertStore || [];
      store.forEach(item=>{
        try{
          if(item.prevTab === null){ item.el.removeAttribute('tabindex'); }
          else { item.el.setAttribute('tabindex', item.prevTab); }
        }catch(e){}
      });
      container.__inertStore = null;
    }
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const header = document.querySelector('.site-header');
  if(navToggle && primaryNav){
    const navBackdrop = document.querySelector('.nav-backdrop');
    const navClose = primaryNav.querySelector('.nav__close');
    function openNav(){
      prevFocus = document.activeElement;
      // remove inert and show nav
      setInert(primaryNav, false);
      document.body.classList.add('nav-open');
      navToggle.setAttribute('aria-expanded','true');
      navToggle.classList.add('is-open');
      primaryNav.setAttribute('aria-hidden','false');
      if(navBackdrop) navBackdrop.setAttribute('aria-hidden','false');
      const first = primaryNav.querySelector('a'); if(first) first.focus();
    }
    function closeNav(){
      // if focus is inside the nav, move to toggle before hiding
      try{
        if(primaryNav.contains(document.activeElement)){
          navToggle.focus();
        }
      }catch(e){}
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded','false');
      navToggle.classList.remove('is-open');
      primaryNav.setAttribute('aria-hidden','true');
      if(navBackdrop) navBackdrop.setAttribute('aria-hidden','true');
      // make inert to avoid aria-hidden/focus conflicts
      setInert(primaryNav, true);
      // restore previous focus if possible
      try{ if(prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus(); }
      catch(err){}
    }
  navToggle.addEventListener('click', ()=>{ if(document.body.classList.contains('nav-open')) closeNav(); else openNav(); });
    navClose && navClose.addEventListener('click', closeNav);
    navBackdrop && navBackdrop.addEventListener('click', closeNav);
    primaryNav.addEventListener('click', (e)=>{
      if(e.target.closest('a')){ closeNav(); }
    });
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 920){ closeNav(); }
    });

    // initialize inert state if nav starts hidden
    if(primaryNav.getAttribute('aria-hidden') === 'true'){
      setInert(primaryNav, true);
      // if focus somehow is inside, move focus to toggle
      try{ if(primaryNav.contains(document.activeElement)) navToggle.focus(); }catch(e){}
    }

    // focus trap for nav when open and Esc to close
    document.addEventListener('keydown', (e)=>{
      if(document.body.classList.contains('nav-open') && e.key === 'Tab'){
        const focusable = primaryNav.querySelectorAll('a,button');
        if(focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length-1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      if(e.key === 'Escape' && document.body.classList.contains('nav-open')){ closeNav(); }
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

  // Hero typing/rotating effect
  (function(){
    const el = document.querySelector('.hero-rotator');
    if(!el) return;
    const phrases = [
      'Venta por saco',
      'Precios por volumen',
      'Entrega a todo Chile',
      'Papa Patagonia fresca',
      'Boleta / Factura',
      'Calidad garantizada'
    ];
    let i = 0, j = 0, deleting = false;
    const type = ()=>{
      const current = phrases[i % phrases.length];
      if(!deleting){
        j++;
        el.textContent = current.slice(0, j);
        if(j === current.length){
          deleting = true;
          setTimeout(type, 1400); // hold full phrase
          return;
        }
      }else{
        j--;
        el.textContent = current.slice(0, j);
        if(j === 0){
          deleting = false;
          i++;
        }
      }
      const speed = deleting ? 40 : 70;
      setTimeout(type, speed + Math.random()*60);
    };
    type();
  })();
  const form = document.getElementById('contactForm');
  if(!form) return;

    // Smooth scroll helper for in-page CTA links
    document.querySelectorAll('a[data-scroll-target]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const sel = a.getAttribute('data-scroll-target');
        if(!sel) return;
        const target = document.querySelector(sel);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          // focus first input in form after scrolling
          setTimeout(()=>{
            const first = target.querySelector('input,textarea,select,button');
            if(first) first.focus({preventScroll:true});
          }, 650);
        }
      });
    });

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

  // Validación mínima UX — requerimos nombre y teléfono para contacto rápido
  if(!nombre){ alert('Por favor indica tu nombre.'); return; }
  if(!telefono){ alert('Por favor indica un número de teléfono o WhatsApp para contactarte.'); return; }

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

  // read media items from markup; .mitem elements are now interactive buttons with data-index
  const mitems = Array.from(document.querySelectorAll('.media-masonry .mitem'));
  const mediaList = mitems.map(it=>{
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
  // show with class for CSS transitions and trap focus
  prevFocus = document.activeElement;
  lightboxEl.setAttribute('aria-hidden','false');
  lightboxEl.classList.add('open');
  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.overflow = 'hidden';
  setTimeout(()=>{ document.documentElement.style.scrollBehavior = ''; }, 0);
  // focus close button for keyboard users
  lbClose && lbClose.focus();
  }
  function closeLightbox(){
    if(!lightboxEl) return;
  lightboxEl.setAttribute('aria-hidden','true');
  lightboxEl.classList.remove('open');
  document.body.style.overflow = '';
  current = -1;
  // restore focus
  try{ if(prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus(); }
  catch(err){}
  }
  function next(){ if(current < mediaList.length-1) openLightbox(current+1); else openLightbox(0); }
  function prev(){ if(current > 0) openLightbox(current-1); else openLightbox(mediaList.length-1); }

  // attach interactions (click + keyboard) to new .mitem buttons
  mitems.forEach((it, idx)=>{
    it.setAttribute('role','button');
    it.setAttribute('tabindex', '0');
    it.addEventListener('click', (e)=>{ e.preventDefault(); openLightbox(idx); });
    it.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); } });
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
      // trap Tab inside lightbox controls
      if(e.key === 'Tab'){
        const focusable = lightboxEl.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
        if(focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length-1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
        return;
      }
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
