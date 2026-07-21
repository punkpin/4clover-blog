document.addEventListener("DOMContentLoaded", function () {
  if (typeof Pjax === "undefined") return;

  var pjax = new Pjax({
    elements:
      "a:not([target='_blank']):not([href^='#']):not([data-pjax-state=''])",
    selectors: ["title", "main.main"],
    cacheBust: false,
    timeout: 5000,
  });

  document.addEventListener("pjax:send", function () {
    var main = document.querySelector("main.main");
    if (main) {
      main.style.transition = "opacity 0.2s ease";
      main.style.opacity = "0.4";
    }
  });

  document.addEventListener("pjax:complete", function () {
    var main = document.querySelector("main.main");
    if (main) main.style.opacity = "1";

    var currentPath = window.location.pathname;

    // 导航高亮
    document.querySelectorAll(".nav-item").forEach(function (item) {
      var link = item.querySelector("a");
      if (!link) { item.classList.remove("active"); return; }
      var href = link.getAttribute("href");
      if (href === "/" && currentPath === "/") item.classList.add("active");
      else if (href !== "/" && currentPath.startsWith(href)) item.classList.add("active");
      else item.classList.remove("active");
    });

    // 关于页动态注入/移除 about.css
    var aboutCss = document.getElementById('about-dynamic-css');
    if (currentPath === '/about/' || currentPath.startsWith('/about/')) {
      if (!aboutCss) {
        aboutCss = document.createElement('link');
        aboutCss.id = 'about-dynamic-css';
        aboutCss.rel = 'stylesheet';
        aboutCss.href = '/css/about.css';
        document.head.appendChild(aboutCss);
      }
    } else {
      if (aboutCss) aboutCss.remove();
    }

    // 只派发 DOMContentLoaded（仅 document，不派发 load 避免性能问题）
    document.dispatchEvent(new Event("DOMContentLoaded"));
  });
});
