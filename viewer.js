/* The picture viewer of the project pages. No dependencies.

   Every picture on a project page is a link to its own file (a.zoom), so
   without this file a tap still opens the image at full size. With it, the
   picture opens in a dialog on the page instead: at its natural size, never
   taller than the screen (wider than a phone, it scrolls sideways), with a
   close button; Esc or a tap beside the picture closes it, and focus goes back
   to the picture that was opened. A row of phone screens opens as the row,
   scrolled to the screen that was tapped. It always opens the full-size file,
   even where the page shows the phone copy of a screenshot.

   The dialog is the native <dialog> opened with showModal(): the page behind
   is inert and focus stays inside. Its name is the picture's own approved
   text (the alt, or the row's label), in the language showing at that moment.
   The close button's word switches with the page like any other text
   (data-i18n, site.js). Sizes come from the generator's width and height, so
   the layout is known before the picture is decoded. */
(function () {
  "use strict";

  var root = document.documentElement;
  var dlg = document.getElementById("viewer");
  // An old browser without <dialog>: the links simply open the image itself.
  if (!dlg || typeof dlg.showModal !== "function") return;
  var body = dlg.querySelector(".viewer-body");
  var closeBtn = dlg.querySelector(".viewer-x");
  var opener = null;

  function open(link, tapped) {
    var imgs = link.querySelectorAll("img");
    var target = null;
    body.textContent = "";
    Array.prototype.forEach.call(imgs, function (img) {
      var big = document.createElement("img");
      // The full file, always: on a phone the page shows the 640px copy (a <picture> source),
      // and img.src is still the full one. The copy already on screen is painted under it, so
      // the picture shows at once and sharpens when the full file arrives.
      big.src = img.src;
      if (img.currentSrc && img.currentSrc !== img.src) big.style.backgroundImage = 'url("' + img.currentSrc + '")';
      big.alt = "";   // the dialog carries the picture's text as its name; no need to hear it twice
      big.decoding = "async";
      big.setAttribute("width", img.getAttribute("width"));
      big.setAttribute("height", img.getAttribute("height"));
      big.style.setProperty("--w", img.getAttribute("width"));
      big.style.setProperty("--h", img.getAttribute("height"));
      body.appendChild(big);
      if (tapped && tapped.contains(img)) target = big;
    });
    body.classList.toggle("many", imgs.length > 1);
    var name = link.getAttribute("aria-label") || (imgs[0] ? imgs[0].getAttribute("alt") : "") || "";
    dlg.setAttribute("aria-label", name);
    opener = link;
    root.classList.add("viewing");
    dlg.showModal();
    closeBtn.focus();
    if (target) {
      var b = body.getBoundingClientRect(), r = target.getBoundingClientRect();
      body.scrollBy({ left: r.left + r.width / 2 - (b.left + b.width / 2), behavior: "instant" });
    }
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest ? e.target.closest("a.zoom") : null;
    if (!link) return;
    e.preventDefault();
    open(link, e.target.closest(".phone-card"));
  });

  closeBtn.addEventListener("click", function () { dlg.close(); });
  // A tap beside the picture (on the dark ground) closes it; a tap on the picture does not.
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg || e.target === body) dlg.close();
  });
  // Esc fires "cancel" and then "close"; every way out ends here.
  dlg.addEventListener("close", function () {
    root.classList.remove("viewing");
    body.textContent = "";
    dlg.removeAttribute("aria-label");
    if (opener) {
      var back = opener;
      opener = null;
      back.focus();
    }
  });
})();
