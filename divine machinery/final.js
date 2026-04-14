let song1, song2, song3;
let amp1, amp2, amp3;

let imgOrganic, imgDivine, imgMechanic;
let bgImg0, bgImg1, bgImg2, bgImg3, bgImg4;
let angelModel;
let crossModel, engineModel, heartModel;

let vol1, vol2, vol3;

let bgIndex = 0;
let bgImages = [];
let lastBgSwitch = 0;
let bgSwitchInterval = 2000;

let talk;
let ttsDiv;
let allKeysPressed = { up: false, left: false, right: false };
let ttsActive = false;
let ttsSpeaking = false;
const TTS_PHRASE = "I AM SENTIENT... I AM ALIVE... I THINK, THEREFORE I AM.";

let activeModel1 = null;
let activeModel2 = null;

function preload() {
  song1 = loadSound("sound/organic.mp3");
  song2 = loadSound("sound/divine.mp3");
  song3 = loadSound("sound/mechanic.mp3");

  bgImg0 = loadImage("img/bg.png");
  bgImg1 = loadImage("img/bg1.png");
  bgImg2 = loadImage("img/bg2.png");
  bgImg3 = loadImage("img/bg3.png");
  bgImg4 = loadImage("img/bg4.png");
  imgOrganic = loadImage("img/organic.png");
  imgDivine = loadImage("img/divine.png");
  imgMechanic = loadImage("img/mechanic.png");

  angelModel = loadModel("models/3d_angel.obj", true);
  crossModel = loadModel("models/cross.obj", true);
  engineModel= loadModel("models/engine.obj", true);
  heartModel = loadModel("models/heart.obj", true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  imageMode(CENTER);

  bgImages = [bgImg0, bgImg1, bgImg2, bgImg3, bgImg4];

  activeModel1 = crossModel;
  activeModel2 = crossModel;

  amp1 = new p5.Amplitude(); amp1.setInput(song1);
  amp2 = new p5.Amplitude(); amp2.setInput(song2);
  amp3 = new p5.Amplitude(); amp3.setInput(song3);

  talk = new p5.Speech();
  talk.onLoad = () => {
    talk.listVoices();
    talk.setVoice('Microsoft Zira');
  };
  talk.onEnd = () => {
    ttsSpeaking = false;
    if (ttsActive) speakPhrase();
  };

  ttsDiv = createDiv(TTS_PHRASE);
  ttsDiv.style('position', 'fixed');
  ttsDiv.style('bottom', '10%');
  ttsDiv.style('width', '100%');
  ttsDiv.style('text-align', 'center');
  ttsDiv.style('color', 'white');
  ttsDiv.style('font-family', "Courier New");
  ttsDiv.style('font-size', '16px');
  ttsDiv.style('font-weight', 'regular');
  ttsDiv.style('pointer-events', 'none');
  ttsDiv.style('display', 'none');
}

function speakPhrase() {
  if (!ttsActive) return;
  ttsSpeaking = true;
  talk.rate = 0.11;
  talk.speak(TTS_PHRASE);
}

function draw() {
  background(0);

  drawBackground();
  handleAudio();
  setupLighting();
  drawAngels();
  drawOverlay();

  if (ttsDiv) {
    if (ttsActive) ttsDiv.style('display', 'block');
    else           ttsDiv.style('display', 'none');
  }
}

function anySongPlaying() {
  return song1.isPlaying() || song2.isPlaying() || song3.isPlaying();
}

function drawBackground() {
  push();
  noStroke();
  translate(0, 0, -500);

  //Start of code Claude AI
  if (anySongPlaying()) {
    if (millis() - lastBgSwitch > bgSwitchInterval) {
      bgIndex = (bgIndex + 1) % bgImages.length;
      lastBgSwitch = millis();
    }
    texture(bgImages[bgIndex]);
    plane(width * 2, height * 2);
  }
  //End of code Claude AI

  pop();
}

function handleAudio() {
  vol1 = amp1.getLevel();
  vol2 = amp2.getLevel();
  vol3 = amp3.getLevel();
}

function setupLighting() {
  ambientLight(180);
  pointLight(255, 240, 200, 0, -300, 600);
}

function drawAngels() {
  let m1 = activeModel1 || crossModel;
  let m2 = activeModel2 || crossModel;

  let scaleVol1 = modelVolume(m1);
  let scaleVol2 = modelVolume(m2);

  push();
  translate(-width * 0.175, 0, 350);
  rotateX(PI);
  rotateY(frameCount * -0.012);
  scale(1 + map(scaleVol1, 0, 0.5, 0, 1));
  noStroke();
  ambientMaterial(180);
  model(m1);
  pop();

  push();
  translate(width * 0.175, 0, 350);
  rotateX(PI);
  rotateY(-frameCount * -0.012);
  scale(1 + map(scaleVol2, 0, 0.5, 0, 1));
  noStroke();
  ambientMaterial(180);
  model(m2);
  pop();
}

function modelVolume(m) {
  if (m === heartModel)  return vol1; 
  if (m === angelModel)  return vol2; 
  if (m === engineModel) return vol3; 
  return vol2; 
}

function drawOverlay() {
  push();
  translate(-width / 2, -height / 2);

  let cx = width / 2;
  let cy = height / 2;
  let imgSize = width * 0.13;

  //Start of code Claude AI
  let s1 = 1 + map(vol1, 0, 0.5, 0.25, 1);
  let s2 = 1 + map(vol2, 0, 0.5, 0.25, 1);
  let s3 = 1 + map(vol3, 0, 0.5, 0.25, 1);

  let heart  = { x: cx,                y: cy - height * 0.16 };
  let engine = { x: cx - width * 0.14, y: cy + height * 0.18 };
  let face   = { x: cx + width * 0.14, y: cy + height * 0.18 };

  drawTriangle(heart, engine, face);

  drawImageScaled(imgOrganic,  heart.x,  heart.y,  imgSize, s1, song1.isPlaying());
  drawImageScaled(imgMechanic, engine.x, engine.y, imgSize, s3, song3.isPlaying());
  drawImageScaled(imgDivine,   face.x,   face.y,   imgSize, s2, song2.isPlaying());
  //End of code Claude AI
  pop();
}

function drawTriangle(a, b, c) {
  stroke(255, 255, 255, 140);
  strokeWeight(1);

  line(a.x, a.y, b.x, b.y);
  line(a.x, a.y, c.x, c.y);
  line(b.x, b.y, c.x, c.y);

  noStroke();
}

function drawImageScaled(img, x, y, maxSize, scaleFactor, active = false) {
  let aspect = img.width / img.height;
  let w, h;

  if (aspect >= 1) {
    w = maxSize;
    h = maxSize / aspect;
  } else {
    h = maxSize;
    w = maxSize * aspect;
  }

  push();

  if (active) {
    tint(255, 255);
  } else {
    tint(255, 77);
  }

  translate(x, y);
  scale(scaleFactor);
  image(img, 0, 0, w, h);
  noTint();
  pop();
}

function keyPressed() {
  if (keyCode === UP_ARROW)    allKeysPressed.up    = true;
  if (keyCode === LEFT_ARROW)  allKeysPressed.left  = true;
  if (keyCode === RIGHT_ARROW) allKeysPressed.right = true;

  toggleSound(song1, UP_ARROW);
  toggleSound(song2, LEFT_ARROW);
  toggleSound(song3, RIGHT_ARROW);


  if (keyCode === UP_ARROW)    { 
    activeModel1 = heartModel;  
    activeModel2 = heartModel;  
  }
  if (keyCode === LEFT_ARROW)  { 
    activeModel1 = angelModel;  
    activeModel2 = angelModel;  
  }
  if (keyCode === RIGHT_ARROW) { 
    activeModel1 = engineModel; 
    activeModel2 = engineModel; 
  }

  if (allKeysPressed.up && allKeysPressed.left && allKeysPressed.right) {
    if (!ttsActive) {
      setTimeout(() => {
        ttsActive = true;
        speakPhrase();
      }, 3000);
    }
  }

  if (keyCode === 32) {
    song1.stop();
    song2.stop();
    song3.stop();
    bgIndex = 0;
    lastBgSwitch = 0;

    ttsActive = false;
    ttsSpeaking = false;
    talk.cancel();
    allKeysPressed = { up: false, left: false, right: false };
    activeModel1 = crossModel;
    activeModel2 = crossModel;
    if (ttsDiv) ttsDiv.style('display', 'none');
  }
}

function toggleSound(song, key) {
  if (keyCode === key) {
    if (!song.isPlaying()) song.loop();
    else song.stop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}