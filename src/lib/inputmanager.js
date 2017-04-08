var getusermedia = require('getusermedia')

function InputManager () {
  var self = this
  if (!(self instanceof InputManager)) return new InputManager()

}

InputManager.prototype.chooseDevice = function (cb) {
  var self = this
  
  // TODO: Choose dialog
  getusermedia({audio:true, video:true}, function (err, stream) {
    if (err) throw err
    cb(stream)
  })
}
  
module.exports = new InputManager()