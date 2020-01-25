'use strict';

var smoothScroll = {
  //https://codepen.io/brian-baum/pen/mJZxJX 
  timer: null,

  stop: function stop() {
    clearTimeout(this.timer);
  },

  scrollTo: function scrollTo(id) {
    var settings = {
      duration: 1000,
      easing: {
        outQuint: function outQuint(x, t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        }
      }
    };
    var percentage = void 0;
    var startTime = void 0;
    var node = document.getElementById(id);
    if (!node || typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    var nodeTop = node.offsetTop;
    var nodeHeight = node.offsetHeight;
    var body = document.body;
    var html = document.documentElement;
    if (!body || !html) {
      return;
    }

    var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    var windowHeight = window.innerHeight;
    var offset = window.pageYOffset;
    var delta = nodeTop - offset;
    var bottomScrollableY = height - windowHeight;
    var targetY = bottomScrollableY < delta ? bottomScrollableY - (height - nodeTop - nodeHeight + offset) : delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
      var yScroll = void 0;
      var elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);
      } else {
        yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  }
};

var scrollToTop = function scrollToTop() {
  var where = typeof window !== 'undefined' && window.document ? 'client' : 'server';
  if (where === 'client') {
    if (window.location && window.location.hash) {
      window.location.hash = '';
    }
    if (typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }
};

var scrollFix = function scrollFix() {

  if (typeof window !== 'undefined' && window.history && window.history.pushState) {

    // Calculating width of browser's scrollbar
    var getScrollbarWidth = function getScrollbarWidth() {
      var outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.width = '100px';
      outer.style.msOverflowStyle = 'scrollbar';

      document.body.appendChild(outer);

      var widthNoScroll = outer.offsetWidth;
      // force scrollbars
      outer.style.overflow = 'scroll';

      // add innerdiv
      var inner = document.createElement('div');
      inner.style.width = '100%';
      outer.appendChild(inner);

      var widthWithScroll = inner.offsetWidth;

      // remove divs
      outer.parentNode.removeChild(outer);

      return widthNoScroll - widthWithScroll;
    };

    var SCROLL_RESTORATION_TIMEOUT_MS = 3000;
    var TRY_TO_SCROLL_INTERVAL_MS = 50;

    var originalPushState = window.history.pushState;
    var originalReplaceState = window.history.replaceState;

    // Store current scroll position in current state when navigating away.
    window.history.pushState = function () {
      var newStateOfCurrentPage = Object.assign({}, window.history.state, {
        __scrollX: window.scrollX,
        __scrollY: window.scrollY
      });
      originalReplaceState.call(window.history, newStateOfCurrentPage, '');

      originalPushState.apply(window.history, arguments);
    };

    // Make sure we don't throw away scroll position when calling "replaceState".
    window.history.replaceState = function (state) {
      var newState = Object.assign({}, {
        __scrollX: window.history.state && window.history.state.__scrollX,
        __scrollY: window.history.state && window.history.state.__scrollY
      }, state);

      for (var _len = arguments.length, otherArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherArgs[_key - 1] = arguments[_key];
      }

      originalReplaceState.apply(window.history, [newState].concat(otherArgs));
    };

    var timeoutHandle = null;
    var scrollBarWidth = null;

    // Try to scroll to the scrollTarget, but only if we can actually scroll
    // there. Otherwise keep trying until we time out, then scroll as far as
    // we can.
    var tryToScrollTo = function tryToScrollTo(scrollTarget) {
      // Stop any previous calls to "tryToScrollTo".
      clearTimeout(timeoutHandle);

      var body = document.body;
      var html = document.documentElement;
      if (!scrollBarWidth) {
        scrollBarWidth = getScrollbarWidth();
      }

      // From http://stackoverflow.com/a/1147768
      var documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
      var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      if (documentWidth + scrollBarWidth - window.innerWidth >= scrollTarget.x && documentHeight + scrollBarWidth - window.innerHeight >= scrollTarget.y || Date.now() > scrollTarget.latestTimeToTry) {
        window.scrollTo(scrollTarget.x, scrollTarget.y);
      } else {
        timeoutHandle = setTimeout(function () {
          return tryToScrollTo(scrollTarget);
        }, TRY_TO_SCROLL_INTERVAL_MS);
      }
    };

    // Try scrolling to the previous scroll position on popstate
    var onPopState = function onPopState() {
      var state = window.history.state;

      if (state && Number.isFinite(state.__scrollX) && Number.isFinite(state.__scrollY)) {
        setTimeout(function () {
          return tryToScrollTo({
            x: state.__scrollX,
            y: state.__scrollY,
            latestTimeToTry: Date.now() + SCROLL_RESTORATION_TIMEOUT_MS
          });
        });
      }
    };

    window.addEventListener('popstate', onPopState, true);
  }
};

module.exports = {
  smoothScroll: smoothScroll,
  scrollToTop: scrollToTop,
  scrollFix: scrollFix
};