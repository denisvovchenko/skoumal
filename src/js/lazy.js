(function () {
  var MiniLazyload = function () {
    "use strict";

    function c() {
      function i() {
        return !window.IntersectionObserver
      }
      var r = this,
        e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
        t = 1 < arguments.length ? arguments[1] : void 0,
        n = 2 < arguments.length ? arguments[2] : void 0;
      this.update = function () {
        r.enabled && r.loadImages(function () {}, !1)
      }, this.allElements = function () {
        return [].slice.call(document.querySelectorAll(r.selector))
      }, this.loadImages = function () {
        var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : function () {},
          n = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
        r.allElements().forEach(function (e) {
          s(e), t(e), i() || n ? o(e) : r.newObserver().observe(e)
        })
      }, this.newObserver = function () {
        return new IntersectionObserver(function (e, r) {
          e.forEach(function (e) {
            var t = e.intersectionRatio,
              n = e.target;
            0 < t && (r.unobserve(n), o(n, !0))
          })
        }, r.options)
      };
      var o = function (e, t) {
          var n = e.dataset,
            r = n.src,
            o = n.srcset,
            s = n.bg;
          r && (e.src = r), o && (e.srcset = o), (t || i()) && s && (e.style.backgroundImage = "url(".concat(s, ")")), a(e.parentElement)
        },
        a = function (e) {
          window.HTMLPictureElement && e instanceof HTMLPictureElement && [].slice.call(e.querySelectorAll("[data-srcset]")).forEach(function (e) {
            e.srcset = e.dataset.srcset
          })
        },
        s = function (e) {
          function t() {
            return e.classList.add("loaded")
          }
          var n = r.options.placeholder;
          e.addEventListener("error", function () {
            n && -1 === e.className.indexOf("error") && (e.src = n), e.classList.add("error"), e.removeEventListener("load", t)
          }), e.addEventListener("load", t)
        };
      this.selector = t || "[loading=lazy]", this.options = e, this.enabled = !HTMLImageElement.prototype.hasOwnProperty("loading") || n === c.IGNORE_NATIVE_LAZYLOAD, this.update()
    }
    return c.IGNORE_NATIVE_LAZYLOAD = !0, c
  }();

  new MiniLazyload();
})();
