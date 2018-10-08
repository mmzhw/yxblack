/* eslint-disable */
var util = (function() {
  return {
    html2node(template) {
      var container = document.createElement('div')
      container.innerHTML = template
      return container.children[0]
    },

    extend(o1, o2) {
      for (var i in o2) {
        if (o1[i] === undefined) {
          o1[i] = o2[i]
        }
      }
    },

    throttle(method, time, context) {
      clearTimeout(method.timer)
      method.timer = setTimeout(function() {
        method.apply(context)
      }, time)
    },

    animate(elem, property, from, to, duration, onStart, onEnd) {
      onStart && onStart()
      const dis = to - from
      const stepsNum = duration / 1000 * 60
      const stepDis = dis / stepsNum
      let lastValue = from
      function stepAnimate() {
        lastValue = elem.style[property] = lastValue + stepDis
        if ((dis > 0 && lastValue < to) || (dis < 0 && lastValue > to)) {
          requestAnimationFrame(stepAnimate)
        } else {
          onEnd && onEnd()
        }
      }
      requestAnimationFrame(stepAnimate)
    },

    emitter: {
      on(event, fn) {
        var handlers = this._handlers ||　(this._handlers = {}),
          calls = handlers[event] || (handlers[event] = [])
        calls.push(fn)
        return this
      },

      off(event, fn) {
        if (!event || !this._handlers) this._handlers = {}
        var handlers = this._handlers,
          calls
        if (calls = handlers[event]) {
          if (!fn) {
            calls = []
            return this
          } else {
            for (var i = calls.length - 1; i > -1; i++) {
              if (fn === calls[i]) {
                calls.splice(i, 1)
                return this
              }
            }
          }
        }
        return this
      },

      emit(event) {
        var data = [].slice.call(arguments, 1),
          handlers = this._handlers,
          calls

        if (!handlers || !(calls = handlers[event])) return this
        calls.forEach(fn => fn.apply(this, data))
        return this
      }
    }
  }
})()

export default util
// module.exports = util
