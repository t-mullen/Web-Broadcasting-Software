// merges multiple Sources

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var SourceMover = require('./../display/common/sourcemover')
var mixer = require('./mixer')

inherits(Scene, EventEmitter)

function Scene (output, mixerEffect, opts) {
  var self = this
  
  opts = opts || {}
  opts.width = opts.width || 400*3
  opts.height = opts.height || 400*3
  
  self.sources = []
  
  self._output = output
  self._mixerEffect = mixerEffect
}

Scene.prototype.addSource = function (source, opts) {
  var self = this
  
  var mover = new SourceMover(source, self._output)
  source.mover = mover
  source.audioEffect = mixer.addStream.bind(mixer, source)
  
  opts = opts || {}
  opts.draw = mover.draw.bind(mover)
  opts.audioEffect = source.audioEffect
  opts.index = null // place on top
  
  console.log(opts)
  
  self._output.addStream(source.stream, opts)
  self.sources.push(source)
  
  self.emit('mover', mover)
  
  console.log(self.sources)
}

Scene.prototype.removeSource = function (source) {
  var self = this
  
  self._output.removeStream(source.stream)
  mixer.removeStream(source)
  
  for (var i=0; i<self.sources.length; i++) {
    if (self.sources[i].id === source.id) {
      self.sources[i].destroy()
      self.sources.splice(i, 1)
      i--
    }
  }
}

Scene.prototype.reorderSource = function (index, source) {
  var self = this
  
  var opts = opts || {}
  opts.draw = source.mover.draw.bind(source.mover)
  opts.audioEffect = source.audioEffect
  opts.index = self.sources.length - (index+1)
  
  mixer.removeStream(source)
  
  self._output.removeStream(source.stream)
  self._output.addStream(source.stream, opts)
  
  for (var i=0; i<self.sources.length; i++) {
    if (self.sources[i].id === source.id) {
      self.sources.splice(i, 1)
      i--
    }
  }
  self.sources.splice(index, 0, source)
  
  console.log(self.sources)
}

Scene.prototype.focusSource = function (source) {
  var self = this
  
  for (var i=0; i<self.sources.length; i++) {
    if (source && self.sources[i].id === source.id) {
      self.sources[i].mover.focus()
    } else {
      self.sources[i].mover.blur()
    }
  }
}

Scene.prototype.show = function () {
  var self = this
  
  for (var i=0; i<self.sources.length; i++) {
    self._output.addStream(self.sources[i].stream, {
      draw: self.sources[i].mover.draw.bind(self.sources[i].mover),
      audioEffect: mixer.addStream.bind(mixer, self.sources[i])
    })
    self.sources[i].mover.show()
  }
}

Scene.prototype.hide = function () {
  var self = this
  
  for (var i=0; i<self.sources.length; i++) {
    self._output.removeStream(self.sources[i].stream)
    mixer.removeStream(self.sources[i])
    self.sources[i].mover.hide()
  }
}

Scene.prototype.destroy = function () {
  var self = this
  
  for (var i=0; i<self.sources.length; i++) {
    self.sources[i].destroy()
  }
  
  self.sources = []
}
  
module.exports = Scene