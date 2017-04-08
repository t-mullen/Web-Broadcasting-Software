var h = require('hyperscript')

function Transitions () {
  var self = this
  if (!(self instanceof Transitions)) return new Transitions()

  self.element = h('div.transitions',
                  h('label', 'Scene Transitions'))
}

Transitions.prototype.method = function () {
  var self = this
  
}
  
module.exports = Transitions