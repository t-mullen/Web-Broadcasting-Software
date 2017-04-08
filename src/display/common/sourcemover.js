// moves/resizes a source on a scene

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var h = require('hyperscript')
var interact = require('interactjs')

inherits(SourceMover, EventEmitter)

function SourceMover (source, output) {
  var self = this
  if (!(self instanceof SourceMover)) return new SourceMover()

  self.player = document.querySelector('.JumpStreamer .view video')
  
  self.id = source.id
  
  self.x = 0
  self.y = 0
  self.width = self.player.clientWidth
  self.height = self.player.clientHeight
  
  self.outx = self.x
  self.outy = self.y
  
  self.xRatio = output.width / self.player.clientWidth
  self.yRatio = output.height / self.player.clientHeight
  
  var lastOffset = {
    left: self.player.offsetLeft,
    top: self.player.offsetTop
  }
  
  window.addEventListener('resize', function (e) {
    self.x = self.x - lastOffset.left + self.player.offsetLeft
    self.y = self.y - lastOffset.top + self.player.offsetTop
    
    // TODO: Figure out how to recalc the transform
    
    lastOffset = {
      left: self.player.offsetLeft,
      top: self.player.offsetTop
    }
    
    self.width = self.width * self.xRatio
    self.height = self.height * self.yRatio
    
    self.xRatio = output.width / self.player.clientWidth
    self.yRatio = output.height / self.player.clientHeight
    
    self.width = self.width / self.xRatio
    self.height = self.height / self.yRatio
    
    self._setStyle()
  })
  
  self.element = h('div.mover')
  self._setStyle()
  
  interact(self.element).draggable({
    onmove: self._onDragMove.bind(self)
  }).resizable({
    edges: { left: true, right: true, bottom: true, top: true }
  }).on('resizemove', self._onResizeMove.bind(self))
}

SourceMover.prototype.focus = function (){
  var self = this
  
  console.log('focus', self.element)
  self.element.style.display = ''
}

SourceMover.prototype.blur = function (){
  var self = this

  console.log('blur', self.element)
  self.element.style.display = 'none'
}

SourceMover.prototype._onDragMove = function (event) {
  var self = this
  
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the position attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  
  // update the source
  self.outx = self.x + x
  self.outy = self.x + y
}

SourceMover.prototype._onResizeMove = function (event) {
  var self = this
  
  var target = event.target
  var x = (parseFloat(target.getAttribute('data-x')) || 0)
  var y = (parseFloat(target.getAttribute('data-y')) || 0)

  // update the element's style
  target.style.width  = event.rect.width + 'px'
  target.style.height = event.rect.height + 'px'

  // translate when resizing from top or left edges
  x += event.deltaRect.left
  y += event.deltaRect.top

  target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
  
  // update the source
  self.outx = self.x + x
  self.outy = self.x + y
  
  self.width = event.rect.width
  self.height = event.rect.height
}

SourceMover.prototype._setStyle = function (element) {
  var self = this
  
  self.element.style.left = self.player.offsetLeft
  self.element.style.top = self.player.offsetTop
  self.element.style.width = self.player.clientWidth
  self.element.style.height = self.player.clientHeight
}

SourceMover.prototype.draw = function (ctx, frame, next) {
  var self = this
  
  ctx.drawImage(frame, self.outx * self.xRatio, self.outy * self.yRatio, self.width * self.xRatio, self.height * self.yRatio)
  
  next()
}

SourceMover.prototype.show = function () {
  var self = this
  self.element.style.display = ''
}

SourceMover.prototype.hide = function () {
  var self = this
  self.element.style.display = 'none'
}

SourceMover.prototype.destroy = function () {
  var self = this
  
  self.element.parentElement.removeChild(self.element)
  
  self.element = null
  self.x = null
  self.y = null
  self.width = null
  self.height = null
  self.xRatio = null
  self.yRatio = null
}
  
module.exports = SourceMover