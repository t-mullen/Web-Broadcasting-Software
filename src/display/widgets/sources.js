var h = require('hyperscript')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

var List = require('./../common/list')
var InputManager = require('./../../lib/inputmanager')
var Source = require('./../../lib/source')

inherits(Sources, EventEmitter)

function Sources () {
  var self = this
  if (!(self instanceof Sources)) return new Sources()

  self.list = new List()
  
  self.list.on('add', function () {
    self._getSource()
  })
  
  self.scene = null
  self._ready = false
  
  self.element = h('div.sources',
                  h('label', 'Sources'),
                  self.list.element)
  
  self.list.on('remove', function (source) {
    self.emit('remove', source)
  })
  self.list.on('change', function (source) {
    self.emit('change', source)
  })
  
  self.list.disableButton('plus')
  self.list.setButtonContent('plus', '&#9716;')
}

Sources.prototype.ready = function () {
  var self = this
  
  self.list.setButtonContent('plus', '+')
  
  self._ready = true
  self.emit('ready')
}

Sources.prototype._getSource = function () {
  var self = this
  
  InputManager.chooseDevice(function (stream) {
    var newSource = new Source(stream, 'Source') // TODO: Use name of source
    
    self.scene.addSource(newSource)
    self.list.addOption(newSource.name, newSource)
    
    self.emit('add', newSource)
  })
}

Sources.prototype.setScene = function (scene) {
  var self = this
  
  if (!self._ready) {
    self.once('ready', function () {
      self.setScene(scene)
    })
    return
  }
  
  self.list.empty()
  
  if (!scene) {
    self.list.disableButton('plus')
    return
  }
  
  for (var i=0; i<scene.sources.length; i++) {
    self.list.addOption(scene.sources[i].name, scene.sources[i])
  }
  
  self.scene = scene
  
  self.list.enableButton('plus')
}
  
module.exports = Sources