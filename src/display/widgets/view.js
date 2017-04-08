var h = require('hyperscript')

function View () {
  var self = this

  self.video = h('video', {
    autoplay: true,
    muted: true
  })
  
  self.video.setAttribute('height', '100%')
  
  self.element = h('div.view', self.video)
}

View.prototype.addMover = function (mover) {
  var self = this
  
  self.element.appendChild(mover.element)
}

View.prototype.setStream = function (stream) {
  var self = this
  
  self.video.src = window.URL.createObjectURL(stream)
}

module.exports = View