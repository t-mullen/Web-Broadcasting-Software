// wraps an input MediaStream

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Source, EventEmitter)

function Source (stream, name, hasVideo) {
  var self = this

  self.stream = stream || null
  self.id = stream.id
  self.name = name || 'Source'
  self.hasVideo = hasVideo
  self.mover = null
}

Source.prototype.destroy = function () {
  var self = this
  
  self.stream = null
  self.id = null
  self.name = null
  if (self.mover) self.mover.destroy()
  self.mover = null
}
  
module.exports = Source