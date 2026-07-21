/* About page - backgrounds and 3D card effects */
(function () {
  if (window.__aboutInit) return;
  window.__aboutInit = true;

  function initAbout() {
    // === 背景几何图形漫游 ===
    const shapeContainer = document.getElementById('background-shapes');
    if (shapeContainer && !shapeContainer.dataset.initialized) {
      shapeContainer.dataset.initialized = 'true';
      shapeContainer.innerHTML = '';
      const shapeCount = 15;
      const shapes = [];

      for (let i = 0; i < shapeCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');
        const type = Math.random();
        if (type < 0.33) shape.classList.add('shape-circle');
        else if (type < 0.66) shape.classList.add('shape-square');
        else shape.classList.add('shape-triangle');

        const size = Math.random() * 70 + 30;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        shape.style.opacity = Math.random() * 0.25 + 0.05;

        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let vx = (Math.random() - 0.5) * 1.5;
        let vy = (Math.random() - 0.5) * 1.5;
        let r = Math.random() * 360;
        let vr = (Math.random() - 0.5) * 0.5;

        shapeContainer.appendChild(shape);
        shapes.push({ el: shape, x: x, y: y, vx: vx, vy: vy, r: r, vr: vr });
      }

      function animateShapes() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        shapes.forEach(function (s) {
          s.x += s.vx;
          s.y += s.vy;
          s.r += s.vr;
          if (s.x <= -50 || s.x >= w + 50) s.vx *= -1;
          if (s.y <= -50 || s.y >= h + 50) s.vy *= -1;
          s.el.style.transform = 'translate3d(' + s.x + 'px, ' + s.y + 'px, 0) rotate(' + s.r + 'deg)';
        });
        requestAnimationFrame(animateShapes);
      }
      animateShapes();
    }

    // === 卡片 3D ===
    const cards = document.querySelectorAll('.interest-card');
    cards.forEach(function (card) {
      if (card.dataset.tilted) return;
      card.dataset.tilted = 'true';
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        let rotateY = x / 40;
        let rotateX = -y / 40;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02) translateY(-10px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateY(0)';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAbout);
  // PJAX support
  document.addEventListener('pjax:complete', function () {
    window.__aboutInit = false;
    initAbout();
  });
})();
