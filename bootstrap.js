/* ============================================================
   bootstrap.js — Bootstrap JavaScript Bundle
   Project  : BMI Health Calculator
   Course   : CET138 Full Stack Development

   Bootstrap's JavaScript is needed for:
     - Navbar collapse / hamburger toggle on mobile
     - data-bs-toggle and data-bs-target attributes

   This file dynamically loads the Bootstrap JS bundle from CDN.
   ============================================================ */

(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
})();
