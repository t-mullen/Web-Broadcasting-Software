var h = require('hyperscript')

function Transitions () {
  var self = this

  self.element = h('div.transitions',
                  h('label', 'Scene Transitions'))
}

Transitions.prototype.method = function () {
  var self = this
  
}
  
module.exports = Transitions