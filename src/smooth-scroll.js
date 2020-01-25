'use strict';

//https://codepen.io/brian-baum/pen/mJZxJX 

const smoothScroll = {
  timer: null,

  stop: function () {
    clearTimeout(this.timer);
  },

  scrollTo: function (id) {
    const settings = {
      duration: 1000,
      easing: {
        outQuint: function (x, t, b, c, d) {
          return c*((t=t/d-1)*t*t*t*t + 1) + b;
        }
      }
    };
    let percentage;
    let startTime;
    const node = document.getElementById(id);
    if(!node || typeof document === 'undefined' || typeof window === 'undefined'){return;}

    const nodeTop = node.offsetTop;
    const nodeHeight = node.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    if(!body || !html){return;}

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowHeight = window.innerHeight;
    const offset = window.pageYOffset;
    const delta = nodeTop - offset;
    const bottomScrollableY = height - windowHeight;
    const targetY = (bottomScrollableY < delta) ?
      bottomScrollableY - (height - nodeTop - nodeHeight + offset):
      delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step () {
      let yScroll;
      const elapsed = Date.now() - startTime;

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

module.exports = {
  smoothScroll,
};