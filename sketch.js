let deck = [];
let discardPile = [];
let playerHand = [];

let fingerImg;
let fingerT = 0;

let suits = ["♠", "♥", "♦", "♣"];

let cardW = 100;
let cardH = 150;

let gameState = "start";
let instructionPage = 1;
let totalInstructionPages = 5;

let cardImages = {};
let backImage;

let tutorialStep = 0;
let autoPreviewMode = false;
let autoPreviewStep = 0;
let autoPreviewType = "";


let tutorialOffsetX = 0;
let previewCard   = null;
let draggingCard = null;
let draggingIndex = -1;

// Layout
function deckX()    { return width / 2 - 120 - 45; }
function discardX() { return width / 2 + 60 - 45; }
function midY()     { return height / 2 - cardH / 2; }
function playerY()  { return height - cardH - 40; }

function handStartX(hand) {
  let totalW = hand.length * 120 - 20;
  return width / 2 - totalW / 2 - 45;
}

// PRELOAD
function preload() {
  fingerImg = loadImage("assets/finger.png");

  let suitMap = { "♠": "J", "♥": "K", "♦": "S", "♣": "M" };

  for (let suit of suits) {
    for (let value = 1; value <= 13; value++) {
      let label = getLabel(value);
      let filename = label + suitMap[suit] + ".png";
      cardImages[label + suit] = loadImage("assets/cards/" + filename);
    }
  }

  backImage = loadImage("assets/cards/BG.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startTutorial();
}

// START
function startTutorial() {
  deck = [];
  discardPile = [];
  playerHand = [];

  createDeck();
  shuffleDeck();

  for (let i = 0; i < 4; i++) {
    playerHand.push(deck.pop());
  }

  discardPile.push(deck.pop());

  tutorialStep = 0;
}

// DRAW LOOP
function draw() {
  background(20, 120, 70);

  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  if (gameState === "menu") {
    drawMenuScreen();
    return;
  }

  if (gameState === "instructions") { 
  drawInstructionsScreen();

  if (previewCard) {
    drawPreviewCard();
  }
  if (autoPreviewMode) {
  drawBottomCardTutorial();
}

  return;
}

  if (gameState === "tutorial") {
    // your current game drawing
    drawDeck();
    drawDiscard();
    drawPlayerHand();
    drawTutorialUI();

    if (tutorialStep === 1) {
      drawPlayerHand();
    }
  }
}

function drawStartScreen() {
  background(10, 80, 40);

  fill(255);
  textAlign(CENTER);
  //textFont(myFont1);
  textSize(60);
  text("CATURASA", width / 2, height / 2 - 100);

  fill(200);
  rect(width / 2 - 150, height / 2 - 20, 300, 80, 20);

  //textFont(myFont2);
  fill(0);
  textSize(32);
  text("Mulai Permainan", width / 2, height / 2 + 30);
}

function drawMenuScreen() {
  background(15, 90, 50);

  let w = 220;
  let h = 80;
  let gap = 40;

  // center BOTH buttons horizontally
  let totalW = w * 2 + gap;
  let startX = width / 2 - totalW / 2;
  let y = height / 2 - h / 2;

  // LEFT button (Tutorial)
  fill(200);
  rect(startX, y, w, h, 15);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Tutorial", startX + w/2, y + h/2);

  // RIGHT button (Mulai)
  fill(200);
  rect(startX + w + gap, y, w, h, 15);

  fill(0);
  text("Mulai", startX + w + gap + w/2, y + h/2);
}

function drawInstructionsScreen() {
  background(15, 90, 50);

  fill(255);
  textAlign(CENTER);
  textSize(50);
  text("Peraturan Bermain", width / 2 + tutorialOffsetX, 120);

  if (previewCard) {
  tutorialOffsetX = lerp(tutorialOffsetX, -200, 0.1);
} else {
  tutorialOffsetX = lerp(tutorialOffsetX, 0, 0.1);
}
  
  // === PAGE CONTENT ===
  if (instructionPage === 1) {
    textSize(22);
    text("Caturasa merupakan permainan kartu dimana tujuan pemain adalah \n" + "mengumpulkan makanan dari wilayah yang sama untuk memperoleh poin tertinggi. ", width / 2, 250);
  } 
  else if (instructionPage === 2) {
    textSize(22);
    text("Dalam 1 deck Caturasa ada total 52 kartu", width / 2, 250);
  }
  else if(instructionPage === 3) {
    textSize(22);
    text("Dari 52 kartu tersebut terbagi menjadi 4 kategori yang \n" + "mewakili beberapa daerah di Indonesia (klik kartu untuk memperbesar gambar)", width / 2 + tutorialOffsetX, 190);
    drawCategoryCards();
  }
  
  else if (instructionPage === 4) {
    textSize(22);
  text("Dalam 1 kategori terdapat 13 kartu dengan 3 jenis \n" +  "simbol yang berbeda (klik kartu untuk memperbesar gambar)", width / 2 + tutorialOffsetX, 190);
    drawIconCards();
}
else if (instructionPage === 5) {
  textSize(22);
  text("Halaman 5...", width / 2, 250);
}
  
  // === BUTTONS ===
  drawInstructionButtons();
}

function drawCategoryCards() {
  let y       = 250;
  let spacing = 30;
  let totalWidth = cardW * 4 + spacing * 3;
  let startX  = width / 2 - totalWidth / 2 + tutorialOffsetX;
  // Show one card per suit using "A" (square icon) as representative
  let suitKeys = ["A♠", "A♥", "A♦", "A♣"];
  let names    = ["Jawa", "Kalimantan", "Sumatra", "Modern"];

  for (let i = 0; i < 4; i++) {
    let x        = startX + i * (cardW + spacing);
    let hovering = mouseX > x && mouseX < x + cardW && mouseY > y && mouseY < y + cardH;

    if (hovering) {
      let zoom = 1.25;
      let newW = cardW * zoom, newH = cardH * zoom;
      image(cardImages[suitKeys[i]], x - (newW - cardW) / 2, y - (newH - cardH) / 2, newW, newH);
    } else {
      image(cardImages[suitKeys[i]], x, y, cardW, cardH);
    }
  }

  textSize(18);
  textAlign(CENTER);
  fill(255);
  for (let i = 0; i < 4; i++) {
    text(names[i], startX + i * (cardW + spacing) + cardW / 2, y + cardH + 30);
  }
}

//perRegion
function drawIconCards() {
  let y = 250;
  let spacing = 30;

  let suitKeys = ["A♠", "7♠", "6♠"];
  let names = ["4 Poin", "6 Poin", "10 Poin"];

  let totalWidth =
    cardW * suitKeys.length +
    spacing * (suitKeys.length - 1);

  let startX = width / 2 - totalWidth / 2 + tutorialOffsetX;

  for (let i = 0; i < suitKeys.length; i++) {
    let x = startX + i * (cardW + spacing);

    let hovering =
      mouseX > x &&
      mouseX < x + cardW &&
      mouseY > y &&
      mouseY < y + cardH;

    if (hovering) {
      let zoom = 1.25;
      let newW = cardW * zoom;
      let newH = cardH * zoom;

      image(
        cardImages[suitKeys[i]],
        x - (newW - cardW) / 2,
        y - (newH - cardH) / 2,
        newW,
        newH
      );
    } else {
      image(cardImages[suitKeys[i]], x, y, cardW, cardH);
    }
  }

  textSize(18);
  textAlign(CENTER);
  fill(255);

  for (let i = 0; i < suitKeys.length; i++) {
    text(
      names[i],
      startX + i * (cardW + spacing) + cardW / 2,
      y + cardH + 30);
  }
}

function drawInstructionButtons() {

  let w = 180;
  let h = 60;
  let y = height - 120;

  textAlign(CENTER, CENTER);

  // BACK button
  if (instructionPage > 0) {
    fill(200);
    rect(width / 2 - 220 + tutorialOffsetX, y, w, h, 15);

    fill(0);
    textSize(20);
    text("Kembali", width / 2 - 130 + tutorialOffsetX, y + h/2);
  }

  // NEXT button
  fill(200);
  rect(width / 2 + 40 + tutorialOffsetX, y, w, h, 15);

  fill(0);
  textSize(20);

  if (instructionPage < totalInstructionPages) {
    text("Lanjut", width / 2 + 130 + tutorialOffsetX, y + h/2);
  } else {
    text("Mulai", width / 2 + 130 + tutorialOffsetX, y + h/2);
  }
}

// ── Card preview
function drawPreviewCard() {
  let bigW = cardW * 3;
  let bigH = cardH * 3;
  let x = width - bigW - 100;
  let y = height / 2 - bigH / 2;
  image(previewCard.img, x, y, bigW, bigH);
}

//HIGHLIGT 1
function drawBottomCardTutorial() {

  let bigW = cardW * 3;
  let bigH = cardH * 3;

  let x = width - bigW - 100;
let y = height / 2 - bigH / 2;

  // draw card
  image(previewCard.img, x, y, bigW, bigH);

  // =========================
  // DARK OVERLAY
  // =========================

  fill(0, 0, 0, 180);
  noStroke();

  rect(0, 0, width, height);

  // redraw card
  image(previewCard.img, x, y, bigW, bigH);

  // =========================
  // HIGHLIGHT BOTTOM HALF
  // =========================

  noFill();
  stroke(255, 0, 0);
  strokeWeight(6);

  // PAGE 3
if (autoPreviewType === "top") {

  rect(
    x + 20,
    y + bigH / 2 + 60,
    bigW - 40,
    bigH / 2 - 80,
    15
  );
}

// PAGE 4 
else if (autoPreviewType === "bottom") {

  rect(
    x + 12,
    y + 12,
    bigW - 232,
    65,
    15
  );
}

  // =========================
  // TEXTS
  // =========================

  let txt = "";

// PAGE 3 TEXTS
if (autoPreviewType === "top") {

  if (autoPreviewStep === 0) {
    txt = "Asal daerah dari makanan tersebut dapat dilihat di bagian bawah kartu.";
  }

  else if (autoPreviewStep === 1) {
    txt = "Wilayah tersebut ditunjukkan oleh bagian berwarna pada peta Indonesia";
  }

  else if (autoPreviewStep === 2) {
    txt = "Masing-masing daerah juga memiliki warna yang berbeda";
  }
}

// PAGE 4 TEXTS
else if (autoPreviewType === "bottom") {

  if (autoPreviewStep === 0) {
    txt = "Simbol dapat dilihat di bagian pojok kiri kartu";
  }

  else if (autoPreviewStep === 1) {
    txt = "Setiap simbol mengkategorikan jenis makanan yang berbeda";
  }

  else if (autoPreviewStep === 2) {
    txt = "Simbol tersebut juga memiliki jumlah poin yang berbeda";
  }
}

  drawAutoPreviewBox(txt);
}

//BOX TUTOR 1
function drawAutoPreviewBox(txt) {

  let w = 420;
  let h = 130;

  let x = width / 2 - w / 2;

  // DEFAULT = bottom (for page 3)
  let y = height - 200;

  // PAGE 4 = top
  if (autoPreviewType === "bottom") {
    y = 60;
  }

  fill(255);
  noStroke();

  rect(x, y, w, h, 20);

  fill(0);

  textAlign(LEFT, TOP);
  textSize(20);

  text(txt, x + 20, y + 20, w - 40);

  fill(120);
  textSize(14);

  text(
    "Klik dimana saja untuk lanjut",
    x + 20,
    y + 90
  );
}

// UI

function drawTutorialUI() {
  if (tutorialStep === 0) {
    let x = deckX();
    let y = midY();

    drawSpotlight(x, y, cardW, cardH);
    drawPulseBox(x, y, cardW, cardH);

    drawTooltip("Klik deck untuk mengambil kartu", x + 120, y);

   // drawFingerTap(x + cardW / 2 - 30, y - 70);
  }

  else if (tutorialStep === 1) {
    let startX = handStartX(playerHand) + 120 * floor(playerHand.length / 2);
    let startY = playerY();

    let targetX = discardX();
    let targetY = midY();

    drawSpotlight(targetX, targetY, cardW, cardH);
    drawPulseBox(targetX, targetY, cardW, cardH);

    drawTooltip("Seret kartu ke sini", targetX - 320, targetY);

    drawFingerDrag(startX, startY, targetX, targetY);
  }

  else if (tutorialStep === 2) {
    let x = width/2 - 120;
    let y = height - 120;

    drawSpotlight(x, y, 240, 60);
    drawPulseBox(x, y, 240, 60);

    drawTooltip("Tutorial selesai!", x, y - 90);

    fill(200);
    rect(x, y, 240, 60, 15);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Selesai", x + 120, y + 30);

    //drawFingerTap(x + 90, y - 50);
  }
}

// ================= EFFECTS =================

// DARK OVERLAY WITH CUTOUT
function drawSpotlight(x, y, w, h) {
  fill(0, 0, 0, 180);
  noStroke();

  // top
  rect(0, 0, width, y);

  // bottom
  rect(0, y + h, width, height - (y + h));

  // left
  rect(0, y, x, h);

  // right
  rect(x + w, y, width - (x + w), h);
}

// PULSING BOX
function drawPulseBox(x, y, w, h) {
  let maxPulse = 35

  // ⏱️ durations in seconds
  let shrinkDuration = 0.4;  // stays SAME
  let pauseDuration  = 1  // you change THIS

  let totalDuration = shrinkDuration + pauseDuration;

  // convert frameCount → seconds
  let t = (millis() / 1000) % totalDuration;

  let pulse;

  if (t < shrinkDuration) {
    // SHRINK (constant speed)
    let progress = t / shrinkDuration;
    pulse = (1 - progress) * maxPulse;
  } else {
    // PAUSE
    pulse = 0;
  }

  noFill();

  // base box
  stroke(255, 255, 0);
  strokeWeight(3);
  rect(x, y, w, h, 10);

  // animated box
  stroke(255, 255, 0, 120);
  rect(
    x - pulse,
    y - pulse,
    w + pulse * 2,
    h + pulse * 2,
    12
  );

  noStroke();
}

// TOOLTIP
function drawTooltip(txt, x, y) {
  fill(255);
  rect(x, y, 300, 80, 10);

  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  text(txt, x + 10, y + 10, 280);
}


// FINGER DRAG
function drawFingerDrag(x1, y1, x2, y2) {
  fingerT += 0.02;
  if (fingerT > 1) fingerT = 0;

  let x = lerp(x1, x2, fingerT);
  let y = lerp(y1, y2, fingerT);

  image(fingerImg, x, y, 60, 60);
}

// ================= INPUT =================
function mousePressed() {

  // ===== START SCREEN → MENU =====
  if (gameState === "start") {
    gameState = "menu";
    return;
  }

  // ===== MENU BUTTONS =====
  if (gameState === "menu") {
    let w = 220;
    let h = 80;
    let gap = 40;

    let totalW = w * 2 + gap;
    let startX = width / 2 - totalW / 2;
    let y = height / 2 - h / 2;

    // LEFT: Tutorial
    if (mouseX > startX && mouseX < startX + w &&
        mouseY > y && mouseY < y + h) {

      gameState = "instructions";
      instructionPage = 1;
      return;
    }

    // RIGHT: Mulai (skip tutorial)
    if (mouseX > startX + w + gap && mouseX < startX + w + gap + w &&
        mouseY > y && mouseY < y + h) {

      gameState = "tutorial";
      startTutorial();
      return;
    }
  }

// ===== INSTRUCTIONS BUTTONS =====
if (gameState === "instructions") {

  if (autoPreviewMode) {

  autoPreviewStep++;

  // END SEQUENCE
  if (autoPreviewStep > 2) {

    autoPreviewMode = false;
    previewCard = null;

    instructionPage++;
  }

  return;
}
  
  let w = 180;
  let h = 60;
  let y = height - 120;

  let clickedCard = null;

  // ONLY ENABLE ENLARGE ON CERTAIN PAGES
  if (instructionPage === 3) {
    clickedCard = getClickedCategoryCard(mouseX, mouseY);
  }

  else if (instructionPage === 4) {
    clickedCard = getClickedIconCard(mouseX, mouseY);
  }

  if (clickedCard) {

    if (previewCard && previewCard.img === clickedCard.img) {
      previewCard = null;
    } else {
      previewCard = clickedCard;
    }

    return;
  }
  
    let backX = width / 2 - 220 + tutorialOffsetX;
let nextX = width / 2 + 40 + tutorialOffsetX;

// BACK
if (
  mouseX > backX &&
  mouseX < backX + w &&
  mouseY > y &&
  mouseY < y + h
) {

  if (instructionPage > 1) {
    instructionPage--;
  } else {
    gameState = "menu";
  }

  previewCard = null;
  return;
}     
    // NEXT / START
    if (
  mouseX > nextX &&
  mouseX < nextX + w &&
  mouseY > y &&
  mouseY < y + h) {

      // PAGE 3 SPECIAL PREVIEW
if (instructionPage === 3) {

  autoPreviewMode = true;

  previewCard = {
    img: cardImages["A♠"]
  };

  autoPreviewStep = 0;

  autoPreviewType = "top";

  return;
}

// PAGE 4 SPECIAL PREVIEW
if (instructionPage === 4) {

  autoPreviewMode = true;

  previewCard = {
    img: cardImages["A♠"]
  };

  autoPreviewStep = 0;

  autoPreviewType = "bottom";

  return;
}

if (instructionPage < totalInstructionPages) {
  instructionPage++;
  previewCard = null;

} else {
  previewCard = null;
  gameState = "tutorial";
  startTutorial();
}
      return;
}
  }
  // ===== TUTORIAL GAME =====
  if (gameState === "tutorial") {

    if (tutorialStep === 0) {
      if (mouseX > deckX() && mouseX < deckX() + cardW &&
          mouseY > midY() && mouseY < midY() + cardH) {

        playerHand.push(deck.pop());
        tutorialStep = 1;
      }
      return;
    }

    if (tutorialStep === 1) {
      for (let i = 0; i < playerHand.length; i++) {
        let c = playerHand[i];
        if (mouseX > c.x && mouseX < c.x + cardW &&
            mouseY > c.y && mouseY < c.y + cardH) {

          draggingCard = c;
          draggingIndex = i;
          break;
        }
      }
      return;
    }

    if (tutorialStep === 2) {
      if (mouseX > width/2 - 120 && mouseX < width/2 + 120 &&
          mouseY > height - 120 && mouseY < height - 60) {
        startTutorial();
      }
    }
  }
}

function getClickedCategoryCard(mx, my) {
  let y       = 250;
  let spacing = 30;
  let totalWidth = cardW * 4 + spacing * 3;
  let startX  = width / 2 - totalWidth / 2 + tutorialOffsetX;

  let suitKeys = ["A♠", "A♥", "A♦", "A♣"];

  for (let i = 0; i < 4; i++) {
    let x = startX + i * (cardW + spacing);

    if (mx > x && mx < x + cardW &&
        my > y && my < y + cardH) {

      return {
        img: cardImages[suitKeys[i]]
      };
    }
  }

  return null;
}

function getClickedIconCard(mx, my) {
  let y       = 250;
  let spacing = 30;
  let totalWidth = cardW * 3 + spacing * 3;
  let startX  = width / 2 - totalWidth / 2 + tutorialOffsetX;

  let suitKeys = ["A♠", "7♠", "6♠"];

  for (let i = 0; i < 3; i++) {
    let x = startX + i * (cardW + spacing);

    if (mx > x && mx < x + cardW &&
        my > y && my < y + cardH) {

      return {
        img: cardImages[suitKeys[i]]
      };
    }
  }

  return null;
}

function mouseReleased() {
  if (tutorialStep === 1 && draggingCard) {
    if (mouseX > discardX() && mouseX < discardX() + cardW &&
        mouseY > midY() && mouseY < midY() + cardH) {

      discardPile.push(draggingCard);
      playerHand.splice(draggingIndex, 1);

      tutorialStep = 2;
    }
  }

  draggingCard = null;
  draggingIndex = -1;
}

// ================= DRAW =================

function drawDeck() {
  image(backImage, deckX(), midY(), cardW, cardH);
}

function drawDiscard() {
  if (discardPile.length > 0) {
    let top = discardPile[discardPile.length - 1];
    image(top.img, discardX(), midY(), cardW, cardH);
  }
}

function drawPlayerHand() {
  let startX = handStartX(playerHand);

  for (let i = 0; i < playerHand.length; i++) {
    if (i === draggingIndex) continue;

    let x = startX + i * 120;
    let y = playerY();

    let c = playerHand[i];
    c.x = x;
    c.y = y;

    image(c.img, x, y, cardW, cardH);
  }

  if (draggingCard) {
    image(draggingCard.img, mouseX - cardW/2, mouseY - cardH/2, cardW, cardH);
  }
}

// ================= DECK =================

function createDeck() {
  for (let suit of suits) {
    for (let value = 1; value <= 13; value++) {
      let label = getLabel(value);

      deck.push({
        suit,
        value,
        img: cardImages[label + suit]
      });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// ================= HELPERS =================

function getLabel(value) {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return value.toString();
}