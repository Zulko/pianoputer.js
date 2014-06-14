

var FPS = 22050
var REFERENCE_FREQ = 110.0 // A2
var DURATION = 5
var ARRAY_SIZE = FPS*DURATION


function compute_freq(note_pitch) {
  // pitch is expressed relatively to A4 = 110 Hz
  var factor = Math.pow(2.0, (1.0*note_pitch)/12.0);
  return REFERENCE_FREQ * factor;
}

function make_array(freq, fun, fadein, fadeout) {
 
  var omega = (1.0*freq) / FPS;
  var freq_damp = REFERENCE_FREQ/freq
  var array = [];

  for (var i=0; i<ARRAY_SIZE; i++) {
    var fadein_damp = 1;//Math.min(1.0*i/FPS/fadein, 1)
    var fadeout_damp = 1;//Math.max(0,
                        //Math.min(1.0,
                          //(ARRAY_SIZE-i)/FPS/fadeout))

    array[i] = ( 128+Math.round(127*freq_damp
                                *fadein_damp
                                *fadeout_damp)
                                *fun(i*omega));
  }
  return array;
}


function array_to_audio(array) {
  wave = new RIFFWAVE();
  wave.header.sampleRate = FPS;
  wave.header.numChannels = 1;
  wave.Make(array)
  audio = new Audio(wave.dataURI);
  return audio;
}

function pitch_to_audio(note_pitch, fun) {
  freq = compute_freq(note_pitch);
  array = make_array(freq, fun, .01, .01);
  audio= array_to_audio(array)
  return audio;
}

function fun_sine(t) { return Math.sin(2.0*Math.PI*t); }
function fun_sawtooth(t) { return (t%1.0)-0.5; }
function fun_square(t) { return 1.0*((t%1.0)<0.5); }
function fun_polynome(t) { return (t%1.0)*(1.0-(t%1.0)); }
function fun_sine3(t) { return fun_polynome(t)*fun_sine(t);}

function play_audio(audio) {
  audio.play();
}

function stop_audio(audio) {
  audio.pause();
  audio.currentTime = 0;
}