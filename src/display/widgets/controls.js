var h = require('hyperscript')
var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')

inherits(Controls, EventEmitter)

function Controls () {
  var self = this

  self._startedStream = false
  self._startButton = h('button.stopped', {onclick: self.clickStream.bind(self)}, 'Start Streaming')
  self._startButton.style.marginTop = '10px'
  
  var label = h('label')
  label.innerHTML = '&nbsp;'
  
  self.element = h('div.controls',
                    label,
                    self._startButton//,
                    //h('button', {onclick: self.clickRecord}, 'Start Recording'),
                    //h('button', {onclick: self.clickSettings}, 'Settings')
                  )
}

Controls.prototype.clickStream = function () {
  var self = this
  
  if (self._startedStream) {
    self._startButton.innerHTML = 'Start Streaming'
    self._startButton.className = 'stopped'
    self.emit('stopstream')
  } else {
    self._startButton.innerHTML = 'Stop Streaming'
    self._startButton.className = 'started'
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