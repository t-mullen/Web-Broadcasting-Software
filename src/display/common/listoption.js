var h = require('hyperscript')

function ListOption (index, text, value) {
  var self = this
  if (!(self instanceof ListOption)) return new ListOption()

  self.index = index
  self.text = text
  self.value = value
  self.element = h('div.option', self.text) 
}

ListOption.prototype.destroy = function () {
  var self = this
  
  self.element.parentElement.removeChild(self.element)
  self.element = null
  
  self.index = null
  self.text = null
  self.value = null
}
  
module.exports = ListOption