var vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))

require('./../../less/vex.css')
require('./../../less/vex-theme-plain.css')

vex.defaultOptions.className = 'vex-theme-plain'

var h = require('hyperscript')
var getusermedia = require('getusermedia')

function InputManager (opts) {
  var self = this
  if (!(self instanceof InputManager)) return new InputManager()

  self.inputs = opts.inputs
  
  // Add default inputs
  self.inputs.push({
    name: 'Video Camera',
    getStream: function (cb) {
      getusermedia({audio:true, video:true}, function (err, stream) {
        cb(err, stream)
      })
    }
  })
  
  var counter = 0;
  self.inputs.forEach(function (a) {
    a.id = counter++
  })
}

InputManager.prototype.chooseDevice = function (cb) {
  var self = this
  
  vex.dialog.open({
    message: 'Select a media source',
    input: [
        '<style>',
            '.vex-custom-field-wrapper {',
                'margin: 1em 0;',
            '}',
            '.vex-custom-field-wrapper > label {',
                'display: inline-block;',
                'margin-bottom: .2em;',
            '}',
        '</style>',
        '<div class="vex-custom-field-wrapper">',
            '<div class="vex-custom-input-wrapper">',
                '<select name="chosen">',
                  self.inputs.map(function (a) {
                    return '<option value="'+a.id+'">'+a.name+'</option>'
                  }).join(''),
                '</select>',
            '</div>',
        '</div>'
    ].join(''),
    callback: function (data) {
        if (!data) return
        
        self.inputs[data.chosen].getStream(cb)
    }
  })
}
  
module.exports = InputManager