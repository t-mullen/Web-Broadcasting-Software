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

  opts = opts || {}
  opts.audioEffect = source.audioEffect
  opts.index = null // place on top
  
  if (source.hasVideo) {
    var mover = new SourceMover(source, self._output)
    source.mover = mover
    opts.draw = mover.draw.bind(mover)
    self.emit('mover', mover)
    opts.mute = true
  }

  if (!source.hasVideo) {
    source.audioEffect = mixer.addStream.bind(mixer, source)
    opts.audioEffect = source.audioEffect
  }
  
  if (source.stream instanceof HTMLMediaElement || source.stream instanceof HTMLImageElement) {
    self._output.addMediaElement(source.id, source.stream, opts)
  } else {
    self._output.addStream(source.stream, opts)
  }
  self.sources.push(source)

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
  
  index = self.sources.length - (index+1)
  
  self._output.updateIndex(source.stream, index)
  
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
    if (!self.sources[i].mover) continue
    if (source && self.sources[i].id === source.id) {
      self.sources[i].mover.focus()
    } else {
      self.sources[i].mover.blur()
    }
  }
}

Scene.prototype.show = function () {
  var self = this

  console.log(self._output._streams)
  
  for (var i=0; i<self.sources.length; i++) {
    var isMediaElement = self.sources[i] instanceof HTMLMediaElement
    if (isMediaElement) {
      if (self.sources[i].mover) {
        self._output.addMediaElement(self.sources[i].id, self.sources[i].stream, {
          draw: self.sources[i].mover.draw.bind(self.sources[i].mover),
          audioEffect: mixer.addStream.bind(mixer, self.sources[i]),
          mute: true
        })
        self.sources[i].mover.show()
      } else {
        self._output.addMediaElement(self.sources[i].id, self.sources[i].stream, {
          audioEffect: mixer.addStream.bind(mixer, self.sources[i])
        })
      }
    } else {
      if (self.sources[i].mover) {
        self._output.addStream(self.sources[i].stream, {
          draw: self.sources[i].mover.draw.bind(self.sources[i].mover),
          audioEffect: mixer.addStream.bind(mixer, self.sources[i]),
          mute: true
        })
        self.sources[i].mover.show()
      } else {
        self._output.addStream(self.sources[i].stream, {
          audioEffect: mixer.addStream.bind(mixer, self.sources[i])
        })
      }
    }
  }
}

Scene.prototype.hide = function () {
  var self = this
  
  for (var i=0; i<self.sources.length; i++) {
    if (self.sources[i].stream instanceof HTMLMediaElement) {
      self._output.removeStream(self.sources[i].id)
    } else {
      self._output.removeStream(self.sources[i].stream)
    }
    mixer.removeStream(self.sources[i])

    if (self.sources[i].mover) {
      self.sources[i].mover.hide()
    }
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