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
    download('speak.wav', wav);
  });
}

function playBinaryWAV(content) {
  var divAudio = document.getElementById('audio');
  while (divAudio.hasChildNodes()) {
    divAudio.firstChild.remove();
  }

  var audioElement = document.createElement('audio');
  audioElement.setAttribute('controls', '');
  var sourceElement = document.createElement('source');
  sourceElement.setAttribute('type', 'audio/wav');
  sourceElement.setAttribute('src', 'data:audio/x-wav;base64,' + encode64(content));
  audioElement.appendChild(sourceElement);
  divAudio.appendChild(audioElement);
  audioElement.play();
}

function playAudioHTML5(text, options) {
  speak(text, options, function(data, wav) {
    playBinaryWAV(wav);
  });
}

function generateAudio(text, callback) {
  var form = document.getElementById('form');
  var amplitude = form.amplitude.value;
  var workdgap = form.workdgap.value;
  var pitch = form.pitch.value;
  var speed = form.speed.value;
  var voice = form.voice.value;
  callback(text, { amplitude: amplitude, wordgap: workdgap, pitch: pitch, speed: speed, voice: voice });
}

function loadTextContentFile(callback) {
  var fileInput = document.getElementById('file');
  var reader = new FileReader();

  reader.onload = function(e) {
    var text = e.target.result;
    generateAudio(text, callback);
  };

  reader.readAsText(fileInput.files[0]);
}

function generateAudioByInput(callback) {
  var form = document.getElementById('form');
  var inputType = form.input.value;
  if (inputType == 'text') {
    var text = form.text.value;
    generateAudio(text, callback);
  } else {
    loadTextContentFile(callback);
  }
}

function changeInput() {
  var form = document.getElementById('form');
  var inputType = form.input.value;
  var isText = inputType == 'text';
  var isFile = inputType == 'file';
  
  document.getElementById('label-text').hidden = !isText;
  form.text.required = isText;
  form.text.hidden = !isText;

  document.getElementById('label-file').hidden = !isFile;
  form.file.required = isFile;
  form.file.hidden = !isFile;
}

function downloadWAV() {
  generateAudioByInput(convertToWAV);
}

function playAudio() {
  generateAudioByInput(playAudioHTML5);
}

changeInput();
