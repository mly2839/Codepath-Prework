//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.2;
var cluePauseTime = 333; //how long to pause in between clues
var nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var guessCounter;
var mistakeCounter = 0; //counts the mistakes, resets upon startGame()
var starttime = 11; //starting time
var clock = 11; //value that will be changed every second
var timer; //setInterval variable


//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function startGame() { 
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  nextClueWaitTime = 1000;
  clueHoldTime = 1000;
  mistakeCounter = 0;
  generatePattern();
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("timer").classList.remove("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  //changes the state of game
  gamePlaying = false;
  //swaps the visibility of start and end buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("timer").classList.add("hidden");
  document.getElementById("endBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 282,
  3: 302.5,
  4: 323,
  5: 343.4,
  6: 363.9,
  7: 384.4,
  8: 404.2,
  9: 424.9,
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  timer = setInterval(myTimer, 1000); //timer that will show a clock every second
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if (pattern[guessCounter] == btn){
    if (guessCounter == progress) {
      if (guessCounter == (pattern.length - 1)) {
        stopTimer();
        winGame();
      }
      else {
        progress+=1;
        if (clueHoldTime > 120) {
          clueHoldTime -= 110;
          nextClueWaitTime -= 50;
        }
        stopTimer();
        playClueSequence();
      }
    }
    else {
      guessCounter+=1;
    }
  }
  else if (mistakeCounter == 2){
    stopTimer();
    loseGame();
  }
  else {
    stopTimer();
    mistakeCounter+=1;
    alert("strike "+mistakeCounter+"/3 try again!")
    playClueSequence();
  }
}

function generatePattern() {
  for (let i = 0; i < 10; i++) {
    var temp = Math.ceil(Math.random() * 9);
    pattern[i] = temp;
  }
}

function myTimer() {
  clock-=1;
  document.getElementById("timer").innerHTML = clock + " seconds";
  if (clock == 0){
    if (mistakeCounter == 2) {
      stopTimer();
      loseGame();
    }
    else {
      stopTimer();
      mistakeCounter+=1;
      alert("strike "+mistakeCounter+"/3 try again!")
      playClueSequence();
    }
  }
}

function stopTimer() {
  clearInterval(timer);
  clock = starttime;
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Wooo, you won!");
}