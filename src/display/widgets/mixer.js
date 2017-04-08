var h = require('hyperscript')

function Mixer () {
  var self = this
  
  self.element = h('div.mixer',
                  h('label', 'Mixer'))
}

Mixer.prototype.method = function () {
  var self = this
  
}
  
module.exports = Mixer