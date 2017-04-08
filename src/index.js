var Display = require('./display/display')

function JumpStreamer (element, opts) {
  var self = this
  if (!(self instanceof JumpStreamer)) return new JumpStreamer()

  if (typeof element === 'string') {
    element = document.querySelector(element)
  }
  
  self._display = new Display(element, opts)
  
}
  
module.exports = JumpStreamer