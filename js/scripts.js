function encode64(data) {
  var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var PAD = '=';
  var ret = '';
  var leftchar = 0;
  var leftbits = 0;
  for (var i = 0; i < data.length; i++) {
    leftchar = (leftchar << 8) | data[i];
    leftbits += 8;
    while (leftbits >= 6) {
      var curr = (leftchar >> (leftbits-6)) & 0x3f;
      leftbits -= 6;
      ret += BASE[curr];
    }
  }
  if (leftbits == 2) {
    ret += BASE[(leftchar&3) << 4];
    ret += PAD + PAD;
  } else if (leftbits == 4) {
    ret += BASE[(leftchar&0xf) << 2];
    ret += PAD;
  }
  
  return ret;
}
function download(filename, content) {
  if (window.atob && window.navigator && window.navigator.msSaveOrOpenBlob && window.Uint8Array && window.Blob) {
    var byteCharacters = atob(content);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {type: 'audio/x-wav'});
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:audio/x-wav;base64,' + encode64(content));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
  }
}

function convertToWAV(text, options) {
  speak(text, options, function(data, wav) {
    console.log('Pronto');
    download('speak.wav', wav);
  });
}

function downloadWAV() {
  var form = document.getElementById('form');
  var text = document.getElementById('text');
  var amplitude = document.getElementById('amplitude');
  var workdgap = document.getElementById('workdgap');
  var pitch = document.getElementById('pitch');
  var speed = document.getElementById('speed');
  var voice = document.getElementById('voice');
  convertToWAV(text.value, { amplitude: amplitude.value, wordgap: workdgap.value, pitch: pitch.value, speed: speed.value, voice: voice.value });
}
