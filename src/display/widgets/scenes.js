// Controls adding/removing/changing of scenes

var h = require('hyperscript')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var VideoStreamMerger = require('video-stream-merger')

var List = require('./../common/list')
var Scene = require('./../../lib/scene')

inherits(Scenes, EventEmitter)

function Scenes (output) {
  var self = this

  self.list = new List()
  self.list.on('add', self._createScene.bind(self))
  self.list.on('remove', self._destroyScene.bind(self))
  self.list.on('change', self._changeScene.bind(self))
  
  self.element = h('div.scenes',
                  h('label', 'Scenes'),
                  self.list.element)
  
  self.counter = 0
  self._currentScene = null
  
  self._output = output
}

Scenes.prototype.focusSource = function (source) {
  var self = this
  self._currentScene.focusSource(source)
}

Scenes.prototype.removeSource = function (source) {
  var self = this
  
  self._currentScene.removeSource(source)
}

Scenes.prototype.reorderSource = function (index, source) {
  var self = this
  
  self._currentScene.reorderSource(index, source)
}

Scenes.prototype._createScene = function () {
  var self = this
  
  var newScene = new Scene(self._output)
  
  newScene.on('mover', function (mover) {
    self.emit('mover', mover)
  })
  
  self.counter++
  self.list.addOption('Scene '+self.counter, newScene)
}

Scenes.prototype._destroyScene = function (scene) {
  var self = this
  
  scene.destroy()
}

Scenes.prototype._changeScene = function (scene) {
  var self = this
  
  if (self._currentScene) self._currentScene.hide()
  
  if (scene) {
    scene.show()
    self._currentScene = scene
  }
  
  self.emit('change', scene)
}
  
module.exports = Scenes