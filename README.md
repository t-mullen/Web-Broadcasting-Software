# Web Broadcasting Software (WBS)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<img width="1278" alt="screenshot" src="https://user-images.githubusercontent.com/14932492/61163247-02022980-a4db-11e9-8bc2-d8e74578aa2f.png">

[Try the Live Demo](https://t-mullen.github.io/Web-Broadcasting-Software/) 

Live broadcasting and recording software for the web, inspired by [OBS](https://obsproject.com/). WBS allows broadcasters to record video and audio, create video composites, apply audiovisual effects and eventually output to a broadcast transport (which is not within the scope of this project)... all within the browser.

The UI and functionality of WBS is modeled around Open Broadcasting Software (OBS), but can be easily modified to suit less technical users.

If you've never used similar software:
  1. Click "+" on scenes.
  2. Click "+" on sources. 
  3. Select a media device. 
  4. You can then drag and resize that video, or add more videos to make a composite.
  5. Switch between scenes and active videos by click on them.
  6. "Start Streaming" emits an output MediaStream that can be used in other modules.

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
    // fired when user presses "Start Streaming"
    // stream is the MediaStream output
  })
  wbs.on('stopstream', function () {
    // fired when the user presses "Stop Streaming"
  })
</script>
```

## api

### `var wbs = new WBS(element, [opts])`

`element` is a HTMLElement or CSS selector string. The display will attempt to fit inside this element.

This constructor must be wrapped in a user gesture like a "click" event listener.

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

WBS automatically detects AV devices on the system. However, any method to get a MediaStream can be used as an input. To add your own, put an object inside the `opts.inputs` array that has the following format:

```
{
  name: 'Display Name of Device', // Can be anything, but it should be descriptive
  getStream: function (callback) {
    // This function should call "callback" with the following arguments
    callback(err, name, isVideo, stream)  
      - "err" is any error thrown, null otherwise
      - "name" is the name of the device, with the kind (Video/Audio Input/Ouput) in brackets
      - "isVideo" is true if the stream will have only video tracks, false if only audio tracks.
      - "stream" is the input MediaStream
  }
}
```

Here is an example device:

```javascript
{
  name: 'Video Camera (Video Input)',
  hasVideo: true, // false for
  getStream: function (callback) {
    getusermedia({audio:false, video:true}, function (err, stream) {
      callback(err, 'Video Camera', true, stream)
    })
  }
}
```

## notes
`wbs` does not **broadcast** your video, it simply gives you an output MediaStream to do with as you wish.

You could send it over a WebRTC connection, record it as a file, send to to a proxy RTMP server, pipe it through FFMPEG... anything.

For an example P2P transport using [Dat](https://datproject.org/) and [BeakerBrowser](https://beakerbrowser.com/), see [wbs-plus-hypercast](https://github.com/t-mullen/wbs-plus-hypercast). (Only works with Beaker Browser.)


## Sponsors
Support this project by becoming a sponsor. Your logo will appear here with a link to your website. [[Become a sponsor](https://github.com/sponsors/t-mullen)]

<a href="https://filefire.ca"><img src="https://user-images.githubusercontent.com/14932492/84754967-15413300-af8f-11ea-80b8-3d04cccc2671.png" align="left" height="48" ></a>


