var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var Display = require('./display/display')

inherits(WBS, EventEmitter)

function WBS (element, opts) {
  var self = this
  if (!(self instanceof WBS)) return new WBS(element, opts)

  if (typeof element === 'string') {
    element = document.querySelector(element)
  }

  opts = opts || {}

  opts.output = opts.output || {
    width: 400 * 3,
    height: 300 * 3,
    fps: 40
  }
  opts.inputs = opts.inputs || []
  opts.injectStyles = opts.injectStyles || true

  if (opts.injectStyles) require('./../less/wbs.css')

  self._display = new Display(element, opts)

  self._display.on('stream', function (stream) {
    self.emit('stream', stream)
  })
  self._display.on('stopstream', function () {
    self.emit('stopstream')
  })
}

module.exports = WBS
