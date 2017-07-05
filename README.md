# Web Broadcasting Software (WBS) (Work In Progress)

![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)

Live broadcasting and recording software for the web, inspired by [OBS](https://obsproject.com/). WBS allows broadcasters to record video and audio, create video composites, apply audiovisual effects and eventually output to a broadcast transport (which is not within the scope of this project)... all within the browser.

[Demo](https://rationalcoding.github.io/Web-Broadcasting-Software/) 

The UI and functionality of WBS is modeled around Open Broadcasting Software (OBS), but can be easily modified to suit less technical users.

(If you've never used similar software, click "+" on scenes, then "+" on sources. Select a media device. You can then drag and resize that video, or add more videos to make a composite.)

## install

```html
<script src="wbs.js"></script>
```

## usage

```html
<div></div>
<script>
  var wbs = new WBS('div') // Element or selector to place the UI
  
  wbs.on('stream', function (stream) {
    // stream is the MediaStream output
  })
  wbs.on('stopstream', function () {
    // called when the stream stops
  })
</script>
```

## api

### `var wbs = new WBS(element, [opts])`

`element` is a HTMLElement or CSS selector string. The display will attempt to fit inside this element.

Optional `opts` is a configuration object that will override the following defaults:

```
{
  output: {
    width: 1200,  // resolution of the output stream
    height: 900,
    fps: 40       // frames per second of the output stream
  },
  injectStyles: true, // whether to inject the WBS css
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
`wbs` does not **broadcast** your video, it simply gives you an output MediaStream to do with as you wish.

You could send it over a WebRTC connection, record it as a file, send to to a proxy RTMP server, pipe it through FFMPEG... anything.

## todo
- [ ] Audio mixer
- [ ] Scene transitions
- [ ] Visual effect API
