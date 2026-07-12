/* ============================================================
   Ironclad Motion System — ironclad-motion.js  (v1.1)
   Framework-agnostic. Include after DOM (defer). Pairs with
   ironclad-motion.css. Respects prefers-reduced-motion: if the
   user opts out, this script does nothing and all content shows
   in its final state.

   v1.1 changes (SPA/React-safe; behavior identical on static pages):
   - window.icMotionScan() is exposed: call it after any client-side
     render, or rely on the built-in MutationObserver which rescans
     automatically (debounced 100ms) when nodes are added.
   - Elements are bound once (data-icm marker) so rescans are cheap
     and idempotent.
   - Revealed state is mirrored to a data-icr ATTRIBUTE (plus the
     .rev class). Frameworks that re-render and wipe JS-added classes
     keep attributes, so revealed sections can never fade back out.
     A small injected override rule makes data-icr authoritative.
   - Content already scrolled past at bind time (rect.bottom < 0) is
     shown immediately — it can never re-enter from below.

   Usage: markup attributes only — no per-page JS required.
     data-entrance            hero inner container (children cascade)
     data-reveal              scroll-reveal element (staggered by column)
     data-count="200"         count-up number (keep real value as text)
     data-rotate='["a","b"]'  rotating word (inside .ic-rot wrapper)
     .ic-glass                glass card (shine layer auto-injected)
   ============================================================ */
(function () {
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = null, cio = null;

  function ensure() {
    if (io) return;

    /* 1. Scroll reveals with column stagger (90ms per column, 3-col cycle) */
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var p = el.parentElement;
        var idx = p ? Array.prototype.indexOf.call(p.children, el) : 0;
        el.style.transitionDelay = ((idx % 3) * 90) + 'ms';
        el.classList.add('rev');
        el.setAttribute('data-icr', ''); /* attribute survives framework re-renders */
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    /* 3. Count-up numbers (1.1s, cubic ease-out, starts on first view) */
    cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target)) return;
        var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
        var t0 = performance.now();
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 1100);
          var v = target * (1 - Math.pow(1 - k, 3));
          el.textContent = decimals ? v.toFixed(decimals) : Math.round(v);
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
  }

  /* 4. Rotating word (2.6s cycle, vertical flip, width eases) */
  function bindRotate(rw) {
    var words;
    try { words = JSON.parse(rw.getAttribute('data-rotate')); } catch (e) { return; }
    if (!words || words.length < 2) return;
    var wrap = rw.parentElement; /* .ic-rot */
    var wi = Math.max(0, words.indexOf(rw.textContent.trim()));
    setTimeout(function () { wrap.style.width = rw.offsetWidth + 'px'; }, 600);
    setInterval(function () {
      if (!rw.isConnected) return;
      wi = (wi + 1) % words.length;
      rw.style.transform = 'translateY(-115%)';
      rw.style.opacity = '0';
      setTimeout(function () {
        rw.textContent = words[wi];
        rw.style.transition = 'none';
        rw.style.transform = 'translateY(115%)';
        void rw.offsetHeight; /* reflow */
        rw.style.transition = '';
        rw.style.transform = 'translateY(0)';
        rw.style.opacity = '1';
        wrap.style.width = rw.offsetWidth + 'px';
      }, 360);
    }, 2600);
  }

  /* 10. Glass shimmer — inject shine layer + cursor tracking */
  function bindGlass(c) {
    var sh = document.createElement('span');
    sh.className = 'ic-shine';
    c.appendChild(sh);
    c.addEventListener('mousemove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }

  function scan() {
    if (!document.body) return;
    document.body.classList.add('anim');
    if (!document.getElementById('ic-motion-icr')) {
      var st = document.createElement('style');
      st.id = 'ic-motion-icr';
      /* data-icr mirrors .rev via an attribute; attributes survive
         framework re-renders that strip JS-added classes. */
      st.textContent = '.anim [data-reveal][data-icr]{opacity:1 !important;transform:none !important;}';
      document.head.appendChild(st);
    }
    ensure();
    document.querySelectorAll('[data-reveal]:not([data-icm])').forEach(function (el) {
      el.setAttribute('data-icm', '1');
      /* Content already scrolled past can never re-enter from below — show it. */
      if (el.getBoundingClientRect().bottom < 0) { el.setAttribute('data-icr', ''); el.classList.add('rev'); return; }
      io.observe(el);
    });
    document.querySelectorAll('[data-count]:not([data-icm])').forEach(function (el) { el.setAttribute('data-icm', '1'); cio.observe(el); });
    document.querySelectorAll('[data-rotate]:not([data-icm])').forEach(function (el) { el.setAttribute('data-icm', '1'); bindRotate(el); });
    document.querySelectorAll('.ic-glass:not([data-icm])').forEach(function (el) { el.setAttribute('data-icm', '1'); bindGlass(el); });
  }

  window.icMotionScan = scan;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();

  /* SPA safety net: rescan (debounced) whenever nodes are added, so
     client-side re-renders re-bind recreated elements automatically. */
  var pending = null;
  function watch() {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes && muts[i].addedNodes.length) {
          clearTimeout(pending);
          pending = setTimeout(scan, 100);
          return;
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) watch();
  else document.addEventListener('DOMContentLoaded', watch);
})();
