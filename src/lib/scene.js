// merges multiple Sources

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var SourceMover = require('./../display/common/sourcemover')

inherits(Scene, EventEmitter)

function Scene (output, opts) {
  var self = this
  if (!(self instanceof Scene)) return new Scene()
  
  opts = opts || {}
  opts.width = opts.width || 400*3
  opts.height = opts.height || 400*3
  
  self.sources = []
  self._movers = []
  
  self._output = output
}

Scene.prototype.addSource = function (source) {
  var self = this
  
  var mover = new SourceMover(source, self._output)
  
  self._output.addStream(source.stream, {
    draw: mover.draw.bind(mover)
  })
  
  self.sources.push(source)
  self._movers.push(mover)
  
  self.emit('mover', mover)
}

Scene.prototype.removeSource = function (source) {
  var self = this
  
  for (var i=0; i<self._movers.length; i++) {
    if (self._movers[i].id === source.id) {
      self._movers[i].destroy()
      self._movers.splice(i, 1)
      i--
    }
  }
  
  for (var i=0; i<self.sources.length; i++) {
    if (self.sources[i].id === source.id) {
      self.sources.splice(i, 1)
      i--
    }
  }
  
  self._output.removeStream(source.stream)
}

Scene.prototype.focusSource = function (source) {
  var self = this
  
  for (var i=0; i<self._movers.length; i++) {
    if (source && self._movers[i].id === source.id) {
      self._movers[i].focus()
    } else {
      self._movers[i].blur()
    }
  }
}

Scene.prototype.show = function () {
  var self = this
  
  for (var i=0; i<self._movers.length; i++) {
    self._movers[i].show()
  }
  
  for (var i=0; i<self.sources.length; i++) {
    self._output.addStream(self.sources[i].stream)
  }
}

Scene.prototype.hide = function () {
  var self = this
  
  for (var i=0; i<self._movers.length; i++) {
    self._movers[i].hide()
  }
  
  for (var i=0; i<self.sources.length; i++) {
    self._output.removeStream(self.sources[i].stream)
  }
}

Scene.prototype.destroy = function () {
  var self = this
  
  for (var i=0; i<self._movers.length; i++) {
    if (self._movers[i].id === source.id) {
      self._movers[i].destroy()
    }
  }
  
  self.sources = []
  self._movers = []
}
  
module.exports = Scene