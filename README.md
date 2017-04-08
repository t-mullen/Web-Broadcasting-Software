# jumpstreamer

![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)

Live broadcasting and recording software for the web, inspired by [OBS](https://obsproject.com/).  

[Demo](https://rationalcoding.github.io/jumpstreamer/)

## install

```
npm install --save jumpstreamer
```

or

```html
<script src="jumpstreamer.js"></script>
```

## usage

```html
<div></div>
<script>
  var jump = new JumpStreamer('div') // Element or selector to place the UI
  
  jump.on('stream', function (stream) {
    // stream is the MediaStream output
  })
  jump.on('stopstream', function () {
    // called when the stream stops
  })
</script>
```

## api

### `var jump = new JumpStreamer(element, [opts])`

`element` is a HTMLElement or CSS selector string. The display will attempt to fit inside this element.

Optional `opts` is a configuration object that will override the following defaults:

```
{
  output: {
    width: 1200,  // resolution of the output stream
    height: 900,
    fps: 40       // frames per second of the output stream
  },
  injectStyles: true, // whether to inject the JumpStreamer css
  inputs: [array of input devices - see below]
}
```

### adding input devices

There are several ways to get MediaStreams to use as input sources. To add your own, put an object inside the `opts.inputs` array that has the following format:

```
{
  name: 'Display Name of Device', // Can be anything, but it should be descriptive
  getStream: function (callback) {
    // This function should call "callback" with the following arguments
    callback(err, name, stream)  
      - "err" is any error thrown, null otherwise
      - "name" is the name of the source (usually the same as the device name)
      - "stream" is the input MediaStream
  }
}
```

For example, here is one of the default devices:

```
{
  name: 'Video Camera',
  getStream: function (callback) {
    getusermedia({audio:true, video:true}, function (err, stream) {
      callback(err, 'Video Camera', stream)
    })
  }
}
```

## notes
`jumpstreamer` does not **broadcast** your video, it simply gives you an output MediaStream to do with as you wish.

You could send it over a WebRTC connection, record it as a file, send to to a proxy RTMP server, pipe it through FFMPEG... whatever!

## todo
- [ ] Audio mixer
- [ ] Scene transitions
- [ ] More output options
