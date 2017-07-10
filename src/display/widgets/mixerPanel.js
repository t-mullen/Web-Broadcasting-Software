var h = require('hyperscript')

var mixer = require('./../../lib/mixer')

function MixerPanel () {
  var self = this
  
  var listEl = h('div')
  
  self.element = h('div.mixer',
                  h('label', 'Mixer'),
                  listEl)
  
  mixer.on('sourceAdd', function (source) {
    console.log('source added', source)
    var sourceElement = h('div#a'+source.id, 
                         h('label', source.name),
                         h('div.meter'))
    listEl.appendChild(sourceElement)
  })
  
  mixer.on('sourceRemove', function (source) {
    console.log('source removed', source)
    var el = listEl.querySelector('#a'+source.id)
    if (!el) return
    listEl.removeChild(el)
  })
  
  mixer.on('sourceVolume', function (source, volume) {
    console.log(volume)
    var el = listEl.querySelector('#a'+source.id + ' .meter')
    if (!el) return
    el.style.width = volume+'%'
  })
}
  
module.exports = MixerPanel