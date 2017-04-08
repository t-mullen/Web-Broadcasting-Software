var h = require('hyperscript')

function Mixer () {
  var self = this
  if (!(self instanceof Mixer)) return new Mixer()

  
  self.element = h('div.mixer',
                  h('label', 'Mixer'))
}

Mixer.prototype.method = function () {
  var self = this
  
}
  
module.exports = Mixer