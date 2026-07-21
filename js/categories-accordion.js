// 分类页面展开/折叠功能 (PJAX 兼容)
document.addEventListener('DOMContentLoaded', function () {
  var accordion = document.querySelector('.categories-accordion');
  if (!accordion || accordion.dataset.accordionReady) return;
  accordion.dataset.accordionReady = 'true';

  var useAnimation = window.theme && window.theme.categories && window.theme.categories.accordion_animation !== false;

  function toggleEl(el, show) {
    if (!el) return;
    if (show) {
      el.style.display = 'block';
      if (useAnimation) {
        el.style.opacity = '0';
        requestAnimationFrame(function () { el.style.opacity = '1'; });
      }
    } else {
      if (useAnimation) {
        el.style.opacity = '0';
        setTimeout(function () { el.style.display = 'none'; }, 250);
      } else {
        el.style.display = 'none';
      }
    }
  }

  function collapseAll(except) {
    document.querySelectorAll('.category-section').forEach(function (section) {
      if (section === except) return;
      section.classList.remove('active');
      toggleEl(section.querySelector('.category-posts'), false);
      toggleEl(section.querySelector('.no-posts'), false);
    });
  }

  accordion.addEventListener('click', function (e) {
    var header = e.target.closest('.category-header');
    if (!header) return;

    e.preventDefault();
    e.stopPropagation();

    var section = header.closest('.category-section');
    var isActive = section.classList.contains('active');
    var posts = section.querySelector('.category-posts');
    var noPosts = section.querySelector('.no-posts');

    if (isActive) {
      section.classList.remove('active');
      toggleEl(posts, false);
      toggleEl(noPosts, false);
    } else {
      collapseAll(section);
      section.classList.add('active');
      toggleEl(posts, true);
      toggleEl(noPosts, true);
      setTimeout(function () {
        section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, true);
});

