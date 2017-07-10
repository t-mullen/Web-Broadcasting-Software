var VolumeMeter = require('volume-meter')

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Mixer, EventEmitter)

function Mixer () {
  var self = this

  self.audioContext = null
  self.analyzer = null
}

Mixer.prototype.setAudioContext = function (audioContext) {
  var self = this
  
  self.audioContext = audioContext
}

Mixer.prototype.addStream = function (sourceObj, sourceNode, destNode) {
  var self = this
  
  self.emit('sourceAdd', sourceObj)
  
  var meter = VolumeMeter(self.audioContext, { tweenIn: 2, tweenOut: 6 }, function (volume) {
    self.emit('sourceVolume', sourceObj, volume)
  })
  
  sourceNode.connect(meter)
  sourceNode.connect(destNode)
}

Mixer.prototype.removeStream = function (id) {
  var self = this
  
  self.emit('sourceRemove', id)
}
  
module.exports = new Mixer()