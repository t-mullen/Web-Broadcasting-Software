var h = require('hyperscript')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Controls, EventEmitter)

function Controls () {
  var self = this
  if (!(self instanceof Controls)) return new Controls()

  self._startedStream = false
  
  self.element = h('div.controls',
                    h('br'),
                    h('button', {onclick: self.clickStream}, 'Start Streaming')//,
                    //h('button', {onclick: self.clickRecord}, 'Start Recording'),
                    //h('button', {onclick: self.clickSettings}, 'Settings')
                  )
}

Controls.prototype.clickStream = function () {
  var self = this
  
  if (self._startedStream) {
    self.emit('stopstream')
  } else {
    self.emit('stream')
  }
  
  self._startedStream = !self._startedStream
}

Controls.prototype.clickRecord = function () {
  var self = this
  // TODO
}

Controls.prototype.clickSettings = function () {
  var self = this
  // TODO
}
  
module.exports = Controls