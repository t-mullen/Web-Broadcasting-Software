var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var Display = require('./display/display')

inherits(JumpStreamer, EventEmitter)

function JumpStreamer (element, opts) {
  var self = this
  if (!(self instanceof JumpStreamer)) return new JumpStreamer()

  if (typeof element === 'string') {
    element = document.querySelector(element)
  }
  
  self._display = new Display(element, opts)
  
  self._display.on('stream', function (stream) {
    self.emit('stream', stream)
  })
  self._display.on('stopstream', function () {
    self.emit('stopstream')
  })
}
  
module.exports = JumpStreamer