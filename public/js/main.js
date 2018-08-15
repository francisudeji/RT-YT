const URL = "localhost:4000";
let socket = null;

const play = document.querySelector('#play');
const stop = document.querySelector('#stop');
const pause = document.querySelector('#pause');
const volume = document.querySelector('#volume');
const time = document.querySelector('#time');

let options = {
  playing: 0,
  volume: 50
}

/////////////

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      playerVars: {
        'controls': '0',
        'autoplay': '1',
        'color': 'red'
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
  });
}

// ////////////

const establishConnection = () => {
  socket = io.connect(URL);
  socket.on('chat', data => {

  });

  socket.on('play', status => {
    //console.log("received :", status)
    status.playing === 1 ? player.playVideo() : null;
  });

  socket.on('pause', status => {
    //console.log("received :", status)
    status.playing === 0 ? player.pauseVideo() : null;
  });

  socket.on('stop', status => {
    //console.log("received :", status)
    status.playing === false ? player.stopVideo() : null;
  });

  socket.on('volume', volume => {
    options.volume = volume;
    options.volume ? player.setVolume(options.volume) : player.setVolume(50);
  });

}

window.addEventListener('load', e => {
  establishConnection();
});

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  player.setVolume(options.volume);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 0);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}


pause.addEventListener('click', () => {
    options.playing = 0;
    if(socket.emit('pause', options)){
      console.log("sent pause request", options);
    }
});

stop.addEventListener('click', (e) => {
  options.playing = false;
  if(socket.emit('stop', options)) {
    console.log("sent stop request", options);
  }
});

play.addEventListener('click', (e) => {
    options.playing = 1;
    if(socket.emit('play', options)) {
      console.log("sent play request", options);
    }
});

function handleVolumeChange(e) {
  options.volume = Math.floor(e.target.value);
    if(socket.emit('volume', options.volume)) {
      console.log("sent volume request", options.volume);
    }
  //player.setVolume(Math.floor(e.target.value));
}

volume.addEventListener('change', handleVolumeChange);
//volume.addEventListener('mousemove', handleVolumeChange);
time.addEventListener('change', e => {
  console.log("player :", player, "time", player.getCurrentTime());
});



