var h = require('hyperscript')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var ListOption = require('./listoption')

inherits(List, EventEmitter)

function List () {
  var self = this
  
  self._select = h('div.select')
  
  self._plus = h('button.plus', {onclick: self._onAddOption.bind(self)}, '+')
  self._minus = h('button.minus', {onclick: self._onRemoveOption.bind(self)},'-')
  self._up = h('button.up', {onclick: self._onMoveUp.bind(self)}, '▲')
  self._down = h('button.down', {onclick: self._onMoveDown.bind(self)}, '▼')

  self.element = h('div.list', 
                  self._select,
                  h('div.controls', 
                   self._plus,
                   self._minus, 
                   h('div', ' '),
                   self._up,
                   self._down))
  
  self._selected = null
  self._options = []
  
  Object.defineProperty(self, 'length', {
    get: function () {
      return self._options.length
    }
  })
  
  self._checkButtons()
}

List.prototype._setSelection = function (opt) {
  var self = this
  
  if (self._selected) self._selected.element.className = 'option'
  
  self._selected = opt

  if (!self._selected) {
    self.emit('change', null)
    return
  }
  self._selected.element.className = 'option selected'
  self._checkButtons()
  self.emit('change', opt.value)
}

List.prototype.get = function (index) {
  var self = this
  return self._options[index]
}

List.prototype.addOption = function (text, value) {
  var self = this
  
  var opt = new ListOption(0, text, value)
  self._options.forEach(function (opt) {
    opt.index++
  })
  
  self._options.splice(0, 0, opt)
  if (self._select.firstChild) {
    self._select.insertBefore(opt.element, self._select.firstChild)
  } else {
    self._select.appendChild(opt.element)
  }
  
  self._setSelection(opt)
  
  opt.element.addEventListener('click', function () {
    self._setSelection(opt)
  })
  self._checkButtons()
}

List.prototype._onAddOption = function () {
  var self = this
  
  self.emit('add')
}

List.prototype._onRemoveOption = function () {
  var self = this
  
  if (!self._selected) return
  
  var selectedIndex = self._selected.index
  
  for (var i=self._selected.index+1; i<self._options.length; i++) {
    self._options[i].index--
  }

  ;(function (oldValue) {
    self._options[selectedIndex].destroy()
    self._options.splice(selectedIndex, 1)
    self._selected = null
    self._setSelection(self._options[selectedIndex-1] || self._options[selectedIndex+1] || null)

    self.emit('remove', oldValue)
  }(self._selected.value))
  
  self._checkButtons()
}

List.prototype._onMoveUp = function () {
  var self = this
  
  if (!self._selected) return
  if (!self._options[self._selected.index-1]) return
  
  ;(function (top, bottom) {
    var topIndex = self._selected.index-1
    var bottomIndex = self._selected.index
    
    self._options[topIndex] = bottom
    self._options[bottomIndex] = top
    
    self._options[topIndex].index = topIndex
    self._options[bottomIndex].index = bottomIndex
    
    self._options[topIndex].element.parentNode.insertBefore(self._options[topIndex].element, self._options[bottomIndex].element) // swap nodes
    
    self._checkButtons()
    
    self.emit('reorder', topIndex, self._options[topIndex].value) // emit the lower indexed item
    
  }(self._options[self._selected.index-1], self._options[self._selected.index]))
}

List.prototype._onMoveDown = function () {
  var self = this
  
  if (!self._selected) return
  if (!self._options[self._selected.index+1]) return
  
  ;(function (top, bottom) {
    var topIndex = self._selected.index
    var bottomIndex = self._selected.index+1
    
    self._options[bottomIndex] = top
    self._options[topIndex] = bottom
    
    self._options[bottomIndex].index = bottomIndex
    self._options[topIndex].index = topIndex
    
    self._options[topIndex].element.parentNode.insertBefore(self._options[topIndex].element, self._options[bottomIndex].element) // swap nodes
    
    self._checkButtons()
    
    self.emit('reorder', topIndex, self._options[topIndex].value) // emit the lower indexed item
    
  }(self._options[self._selected.index], self._options[self._selected.index+1]))
}

List.prototype.empty = function () {
  var self = this
  
  while (self._options[0]) {
    self._options[0].destroy()
    self._options.shift()
  }
  
  self._selected = null
  
  self._checkButtons()
}

List.prototype.disableButton = function (buttonClass) {
  var self = this
  self['_'+buttonClass].className = buttonClass+' disabled'
}

List.prototype.enableButton = function (buttonClass) {
  var self = this
  self['_'+buttonClass].className = buttonClass
}

List.prototype.setButtonContent = function (buttonClass, content) {
  var self = this
  self['_'+buttonClass].innerHTML = content
}

List.prototype._checkButtons = function () {
  var self = this
  
  if (!self._selected) {
    self.disableButton('up')
    self.disableButton('down')
    self.disableButton('minus')
    return
  } else {
    self.enableButton('minus')
  }
  
  if (!self._options[self._selected.index-1]) {
    self.disableButton('up')
  } else {
    self.enableButton('up')
  }
  
  if (!self._options[self._selected.index+1]) {
    self.disableButton('down')
  } else {
    self.enableButton('down')
  }
}

module.exports = List