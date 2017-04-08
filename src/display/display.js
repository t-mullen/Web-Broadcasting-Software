var h = require('hyperscript')
var VideoStreamMerger = require('video-stream-merger')

var View = require('./widgets/view')
var Scenes = require('./widgets/scenes')
var Sources = require('./widgets/sources')
var Transitions = require('./widgets/transitions')
var Mixer = require('./widgets/mixer')
var Controls = require('./widgets/controls')

function Display (element, opts) {
  var self = this
  if (!(self instanceof Display)) return new Display()
  
  self._merger = new VideoStreamMerger(opts)
  self._merger.start()
  
  self.view = new View(opts) 
  self.scenes = new Scenes(self._merger, opts)
  self.sources = new Sources(opts)
  self.mixer = new Mixer(opts)
  self.transitions = new Transitions(opts)
  self.controls = new Controls(opts)
  
  // HACK: WebAudio will have huge delay if we add sources too soon
  window.setTimeout(function () {
    self.sources.ready()
  }, 6000)
  
  self.view.setStream(self._merger.result)

  self.element = h('div.JumpStreamer',
                   self.view.element,
                   h('div.toolbar',
                    self.scenes.element,
                    self.sources.element,
                    self.mixer.element,
                    self.transitions.element,
                    self.controls.element))

  element.appendChild(self.element)
  
  self.sources.on('remove', function (source) {
    self.scenes.removeSource(source)
  })
  self.sources.on('change', function (source) {
    self.scenes.focusSource(source)
  })
  
  self.scenes.on('change', self._changeScene.bind(self))
  self.scenes.on('mover', function (mover) {
    self.view.addMover(mover)
  })
  
  self.controls.on('stream', function () {
    self.emit('stream', self._merger.result)
  })
  self.controls.on('stopstream', function () {
    self.emit('stopstream')
  })

}

Display.prototype._changeScene = function (scene) {
  var self = this
  
  self.sources.setScene(scene)
}
  
module.exports = Display