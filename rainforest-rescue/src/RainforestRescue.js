import React, { useRef, useEffect, useState, useCallback } from 'react';

// ─── Grammar Questions ─────────────────────────────────────────────────────────
const grammarQuestions = [
  { text: "The red helicopter.", answer: "Fragment" },
  { text: "Rain falls on the canopy.", answer: "Sentence" },
  { text: "Flying over the Amazon.", answer: "Fragment" },
  { text: "Monkeys swing in the trees.", answer: "Sentence" },
  { text: "The fire is spreading fast.", answer: "Sentence" },
  { text: "Under the thick leaves.", answer: "Fragment" },
  { text: "A bright toucan.", answer: "Fragment" },
  { text: "We need more water.", answer: "Sentence" },
  { text: "Dashing through the smoke.", answer: "Fragment" },
  { text: "The bulldozer stops.", answer: "Sentence" },
  { text: "Many colorful flowers.", answer: "Fragment" },
  { text: "They live in the forest.", answer: "Sentence" },
  { text: "High above the clouds.", answer: "Fragment" },
  { text: "Firefighters work hard.", answer: "Sentence" },
  { text: "Protecting the animals.", answer: "Fragment" },
  { text: "The sun shines bright.", answer: "Sentence" },
  { text: "A loud engine noise.", answer: "Fragment" },
  { text: "Nature is beautiful.", answer: "Sentence" },
  { text: "Running to safety.", answer: "Fragment" },
  { text: "The ecosystem is fragile.", answer: "Sentence" },
];

// ─── Math Question Banks ───────────────────────────────────────────────────────
const mathQuestions = {
  prek: [
    { text: "How many trees? 🌳🌳🌳", answers: ["1","2","3","4"], answer: "3" },
    { text: "How many birds? 🦜🦜", answers: ["1","2","3","4"], answer: "2" },
    { text: "1 + 1 = ?", answers: ["1","2","3","4"], answer: "2" },
    { text: "2 + 1 = ?", answers: ["2","3","4","5"], answer: "3" },
    { text: "How many legs does a dog have?", answers: ["2","4","6","8"], answer: "4" },
    { text: "3 - 1 = ?", answers: ["1","2","3","4"], answer: "2" },
    { text: "Which is bigger: 5 or 3?", answers: ["3","5","Same","Neither"], answer: "5" },
    { text: "2 + 2 = ?", answers: ["2","3","4","5"], answer: "4" },
    { text: "How many sides on a triangle?", answers: ["2","3","4","5"], answer: "3" },
    { text: "5 - 2 = ?", answers: ["1","2","3","4"], answer: "3" },
    { text: "1 + 3 = ?", answers: ["2","3","4","5"], answer: "4" },
    { text: "How many fingers on one hand?", answers: ["4","5","6","10"], answer: "5" },
    { text: "4 + 1 = ?", answers: ["3","4","5","6"], answer: "5" },
    { text: "Which is less: 2 or 7?", answers: ["2","7","Same","Neither"], answer: "2" },
    { text: "3 + 3 = ?", answers: ["4","5","6","7"], answer: "6" },
  ],
  k3: [
    { text: "7 + 8 = ?", answers: ["13","14","15","16"], answer: "15" },
    { text: "13 - 5 = ?", answers: ["6","7","8","9"], answer: "8" },
    { text: "4 × 3 = ?", answers: ["9","10","11","12"], answer: "12" },
    { text: "15 + 7 = ?", answers: ["20","21","22","23"], answer: "22" },
    { text: "20 - 9 = ?", answers: ["9","10","11","12"], answer: "11" },
    { text: "6 × 4 = ?", answers: ["20","22","24","26"], answer: "24" },
    { text: "33 + 14 = ?", answers: ["45","46","47","48"], answer: "47" },
    { text: "50 - 18 = ?", answers: ["30","32","34","36"], answer: "32" },
    { text: "5 × 5 = ?", answers: ["20","25","30","35"], answer: "25" },
    { text: "9 + 16 = ?", answers: ["23","24","25","26"], answer: "25" },
    { text: "40 - 13 = ?", answers: ["25","26","27","28"], answer: "27" },
    { text: "7 × 3 = ?", answers: ["18","19","20","21"], answer: "21" },
    { text: "28 + 15 = ?", answers: ["41","42","43","44"], answer: "43" },
    { text: "60 - 24 = ?", answers: ["34","36","38","40"], answer: "36" },
    { text: "8 × 6 = ?", answers: ["44","46","48","50"], answer: "48" },
  ],
  '46': [
    { text: "12 × 7 = ?", answers: ["74","82","84","86"], answer: "84" },
    { text: "144 ÷ 12 = ?", answers: ["10","11","12","13"], answer: "12" },
    { text: "3/4 + 1/4 = ?", answers: ["1/2","3/4","1","4/8"], answer: "1" },
    { text: "What is 25% of 80?", answers: ["15","20","25","30"], answer: "20" },
    { text: "9 × 11 = ?", answers: ["96","97","98","99"], answer: "99" },
    { text: "180 ÷ 15 = ?", answers: ["10","11","12","13"], answer: "12" },
    { text: "7/8 - 3/8 = ?", answers: ["1/4","3/8","1/2","4/8"], answer: "1/2" },
    { text: "What is 10% of 350?", answers: ["30","35","40","45"], answer: "35" },
    { text: "13 × 8 = ?", answers: ["100","102","104","106"], answer: "104" },
    { text: "256 ÷ 16 = ?", answers: ["14","15","16","17"], answer: "16" },
    { text: "2/3 + 1/6 = ?", answers: ["3/9","5/6","1","3/6"], answer: "5/6" },
    { text: "What is 50% of 46?", answers: ["21","22","23","24"], answer: "23" },
    { text: "15 × 15 = ?", answers: ["215","220","225","230"], answer: "225" },
    { text: "320 ÷ 8 = ?", answers: ["38","39","40","41"], answer: "40" },
    { text: "5/6 - 1/3 = ?", answers: ["1/6","1/3","1/2","2/3"], answer: "1/2" },
  ],
};

// ─── Trivia Question Banks ─────────────────────────────────────────────────────
const triviaQuestions = {
  prek: [
    { text: "What sound does a frog make?", answers: ["Moo","Ribbit","Bark","Roar"], answer: "Ribbit" },
    { text: "What color are most leaves?", answers: ["Blue","Red","Green","Purple"], answer: "Green" },
    { text: "Where do fish live?", answers: ["Trees","Underground","Water","Sky"], answer: "Water" },
    { text: "Which animal has a trunk?", answers: ["Lion","Elephant","Frog","Bird"], answer: "Elephant" },
    { text: "What do caterpillars turn into?", answers: ["Fish","Frogs","Butterflies","Spiders"], answer: "Butterflies" },
    { text: "What do plants need to grow?", answers: ["Candy","Sunlight","Ice","Rocks"], answer: "Sunlight" },
    { text: "Which has spots?", answers: ["Penguin","Rabbit","Ladybug","Dolphin"], answer: "Ladybug" },
    { text: "How many legs does a spider have?", answers: ["4","6","8","10"], answer: "8" },
    { text: "What do birds use to fly?", answers: ["Legs","Tails","Wings","Paws"], answer: "Wings" },
    { text: "What baby animal says 'meow'?", answers: ["Puppy","Kitten","Chick","Foal"], answer: "Kitten" },
    { text: "What fruit is yellow and peels?", answers: ["Apple","Orange","Banana","Grape"], answer: "Banana" },
    { text: "Where do bears sleep in winter?", answers: ["Nests","Caves","Oceans","Trees"], answer: "Caves" },
    { text: "What is rain made of?", answers: ["Juice","Water","Sand","Milk"], answer: "Water" },
    { text: "Which animal lives in rainforests?", answers: ["Polar bear","Penguin","Monkey","Walrus"], answer: "Monkey" },
    { text: "What comes out after rain?", answers: ["Snow","Fog","Rainbow","Stars"], answer: "Rainbow" },
  ],
  k3: [
    { text: "What is the world's biggest rainforest?", answers: ["Congo","Daintree","Amazon","Borneo"], answer: "Amazon" },
    { text: "What do plants use to make food?", answers: ["Moonlight","Sunlight","Starlight","Firelight"], answer: "Sunlight" },
    { text: "What gas do plants release into the air?", answers: ["Carbon dioxide","Oxygen","Nitrogen","Hydrogen"], answer: "Oxygen" },
    { text: "What is the top layer of a rainforest called?", answers: ["Floor","Understory","Canopy","Emergent"], answer: "Canopy" },
    { text: "Which animal is the slowest mammal?", answers: ["Snail","Sloth","Tortoise","Worm"], answer: "Sloth" },
    { text: "What is a baby frog called?", answers: ["Puppy","Tadpole","Kitten","Cub"], answer: "Tadpole" },
    { text: "What do monkeys mostly eat?", answers: ["Only fish","Only grass","Fruits and plants","Only insects"], answer: "Fruits and plants" },
    { text: "What process do plants use to make food?", answers: ["Digestion","Respiration","Photosynthesis","Osmosis"], answer: "Photosynthesis" },
    { text: "Where do toucans live?", answers: ["Arctic","Rainforests","Deserts","Oceans"], answer: "Rainforests" },
    { text: "What do herbivores eat?", answers: ["Only meat","Only plants","Both","Rocks"], answer: "Only plants" },
    { text: "What covers most of the rainforest floor?", answers: ["Sand","Dead leaves","Snow","Rocks"], answer: "Dead leaves" },
    { text: "How do plants drink water?", answers: ["Their leaves","Their flowers","Their roots","Their bark"], answer: "Their roots" },
    { text: "What is a jaguar's main color?", answers: ["Black","White","Orange/yellow","Blue"], answer: "Orange/yellow" },
    { text: "How much of Earth is covered by rainforests?", answers: ["About 2%","About 6%","About 20%","About 50%"], answer: "About 6%" },
    { text: "Which continent has rainforests but no jaguars?", answers: ["Africa","Australia","Asia","Antarctica"], answer: "Australia" },
  ],
  '46': [
    { text: "What % of Earth's species live in rainforests?", answers: ["10%","25%","50%","75%"], answer: "50%" },
    { text: "What is the process of trees releasing water called?", answers: ["Evaporation","Transpiration","Condensation","Precipitation"], answer: "Transpiration" },
    { text: "Which layer gets the most sunlight?", answers: ["Forest floor","Understory","Canopy","Emergent layer"], answer: "Emergent layer" },
    { text: "What is deforestation's biggest cause?", answers: ["Tourism","Agriculture","Mining","Logging"], answer: "Agriculture" },
    { text: "What gas do rainforests absorb in large amounts?", answers: ["Oxygen","Nitrogen","Carbon dioxide","Helium"], answer: "Carbon dioxide" },
    { text: "Epiphytes grow on:", answers: ["Rocks only","Tree surfaces","Soil only","Water"], answer: "Tree surfaces" },
    { text: "What is a keystone species?", answers: ["Most common animal","Critical ecosystem species","Endangered species","Biggest predator"], answer: "Critical ecosystem species" },
    { text: "What do decomposers do in an ecosystem?", answers: ["Hunt prey","Pollinate flowers","Break down dead matter","Photosynthesize"], answer: "Break down dead matter" },
    { text: "The Amazon produces roughly what % of Earth's oxygen?", answers: ["10%","20%","35%","50%"], answer: "20%" },
    { text: "What is mutualism?", answers: ["One harms the other","Both benefit","One benefits, one neutral","Both harmed"], answer: "Both benefit" },
    { text: "Which continent has no rainforests?", answers: ["Antarctica","Africa","Asia","South America"], answer: "Antarctica" },
    { text: "What is the scientific study of forests called?", answers: ["Zoology","Silvology","Botany","Ecology"], answer: "Silvology" },
    { text: "What is the main threat to rainforest jaguars?", answers: ["Climate change","Habitat loss","Flooding","Disease"], answer: "Habitat loss" },
    { text: "What makes rainforests important to global climate?", answers: ["They cool oceans","They store carbon","They block wind","They create rain clouds only"], answer: "They store carbon" },
    { text: "Water-holding plant cups in bromeliads are called:", answers: ["Aquifers","Phytotelmata","Ponds","Wetlands"], answer: "Phytotelmata" },
  ],
};

// ─── Level Config ──────────────────────────────────────────────────────────────
const LEVELS = [
  { id: 1, name: "First Response",      animalsTarget: 3,  fireSpread: 18000, bdSpeed: 0.4, startFires: 2 },
  { id: 2, name: "Rising Smoke",        animalsTarget: 5,  fireSpread: 15000, bdSpeed: 0.5, startFires: 3 },
  { id: 3, name: "Deep Canopy",         animalsTarget: 7,  fireSpread: 12000, bdSpeed: 0.6, startFires: 4 },
  { id: 4, name: "Heart of the Jungle", animalsTarget: 9,  fireSpread: 9000,  bdSpeed: 0.8, startFires: 6 },
  { id: 5, name: "Final Stand",         animalsTarget: 12, fireSpread: 6000,  bdSpeed: 1.0, startFires: 8 },
];

// ─── Constants ─────────────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 460; // leaves 80px for HUD
const TILE_SIZE = 40;
const COLS = 30;       // total world columns (wider than viewport)
const ROWS = 9;        // rows visible (360px / 40 = 9)
const SKY_ROWS = 3;    // top 3 rows are sky
const GROUND_ROW = SKY_ROWS; // first ground row index
const FIRE_SPREAD_INTERVAL = 12000; // ms
const ANIMAL_TYPES = ['monkey', 'bird', 'frog', 'toucan', 'sloth', 'jaguar'];
const OBSTACLE_COST = 5;        // helicopter fuel cost to drop an obstacle
const BULLDOZER_FUEL_LOSS = 20; // fuel lost per obstacle hit
const BULLDOZER_STALL_TIME = 60; // frames to pause when hitting obstacle

// Tile states
const TILE_SKY = 'sky';
const TILE_HEALTHY = 'healthy';
const TILE_FIRE = 'fire';
const TILE_ASH = 'ash';
const TILE_DIRT = 'dirt';

// ─── Colors ────────────────────────────────────────────────────────────────────
const COLORS = {
  sky: ['#1a6699', '#1a7aaa', '#1e8fbf'],
  cloud: '#ddeeff',
  healthy: ['#1a7a2a', '#1e8a30', '#157022', '#2a9a38'],
  trunk: '#5a3a1a',
  fire: ['#ff4400', '#ff6600', '#ff8800', '#ffaa00'],
  ash: '#444444',
  dirt: '#8B6914',
  ground: '#2a5a1a',
  water: '#44aaff',
  heli_body: '#cc2222',
  heli_window: '#88ccff',
  heli_skid: '#888888',
  bulldozer: '#ccaa22',
  beam: 'rgba(100,200,255,0.35)',
};

// ─── Utilities ─────────────────────────────────────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFrom(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// ─── Initial world generation ──────────────────────────────────────────────────
function createWorld() {
  const tiles = [];
  for (let r = 0; r < ROWS; r++) {
    tiles[r] = [];
    for (let c = 0; c < COLS; c++) {
      if (r < GROUND_ROW) {
        tiles[r][c] = { type: TILE_SKY };
      } else {
        tiles[r][c] = {
          type: TILE_HEALTHY,
          treeVariant: randInt(0, 3),
          fireTick: 0,
        };
      }
    }
  }
  return tiles;
}

function createAnimals() {
  const animals = [];
  for (let i = 0; i < 12; i++) {
    animals.push({
      id: i,
      col: randInt(2, COLS - 2),
      row: randInt(GROUND_ROW, ROWS - 2),
      type: randFrom(ANIMAL_TYPES),
      saved: false,
      lost: false,
      beamTimer: 0,
      rescuePhase: null,  // null | 'net_descending' | 'capturing' | 'retracting'
      netY: 0,
      captureY: 0,
      rescueFrame: 0,
    });
  }
  return animals;
}

// ─── Drawing helpers ───────────────────────────────────────────────────────────
function drawTree(ctx, x, y, variant, state) {
  if (state === TILE_ASH || state === TILE_DIRT) {
    // just show as flat
    return;
  }
  const trunkW = 6, trunkH = 14;
  const tx = x + TILE_SIZE / 2 - trunkW / 2;
  const ty = y + TILE_SIZE - trunkH;
  ctx.fillStyle = COLORS.trunk;
  ctx.fillRect(tx, ty, trunkW, trunkH);

  const canopyColors = [
    '#1a8a2a', '#1e9a30', '#157022', '#2aaa38',
  ];
  const sizes = [28, 32, 26, 30];
  const cw = sizes[variant];
  const ch = sizes[variant] - 4;
  const cx = x + TILE_SIZE / 2 - cw / 2;
  const cy = y + 4;

  ctx.fillStyle = canopyColors[variant];
  ctx.fillRect(cx, cy, cw, ch);
  // darker center shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(cx + 4, cy + 4, cw - 8, ch - 8);
}

function drawFire(ctx, x, y, tick) {
  const flicker = (tick % 8 < 4) ? 0 : 2;
  const colors = ['#ff4400', '#ff6600', '#ffaa00'];
  // base flame
  ctx.fillStyle = colors[0];
  ctx.fillRect(x + 4, y + TILE_SIZE - 20, TILE_SIZE - 8, 20);
  ctx.fillStyle = colors[1];
  ctx.fillRect(x + 8, y + TILE_SIZE - 28 + flicker, TILE_SIZE - 16, 16);
  ctx.fillStyle = colors[2];
  ctx.fillRect(x + 12, y + TILE_SIZE - 34 + flicker, TILE_SIZE - 24, 12);
}

function drawHelicopter(ctx, hx, hy, frame) {
  const rx = Math.round(hx);
  const ry = Math.round(hy);

  // rotor hub
  ctx.fillStyle = '#666';
  ctx.beginPath();
  ctx.arc(rx, ry + 1, 3, 0, Math.PI * 2);
  ctx.fill();

  // rotor blades (cross pattern, animated)
  const rotorAngle = (frame * 0.5) % (Math.PI * 2);
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rx + Math.cos(rotorAngle) * 28, ry + 1 + Math.sin(rotorAngle) * 4);
  ctx.lineTo(rx - Math.cos(rotorAngle) * 28, ry + 1 - Math.sin(rotorAngle) * 4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx + Math.cos(rotorAngle + Math.PI/2) * 28, ry + 1 + Math.sin(rotorAngle + Math.PI/2) * 4);
  ctx.lineTo(rx - Math.cos(rotorAngle + Math.PI/2) * 28, ry + 1 - Math.sin(rotorAngle + Math.PI/2) * 4);
  ctx.stroke();

  // rotor mast
  ctx.fillStyle = '#999';
  ctx.fillRect(rx - 1, ry + 1, 3, 4);

  // tail boom
  ctx.fillStyle = '#aa1a1a';
  ctx.fillRect(rx + 14, ry + 8, 22, 6);
  ctx.fillRect(rx + 28, ry + 6, 8, 4); // tail tip narrows

  // tail rotor (animated spin)
  ctx.fillStyle = '#aaa';
  ctx.fillRect(rx + 35, ry + 1, 2, 14);
  if (frame % 3 === 0) {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(rx + 34, ry + 4, 4, 3);
    ctx.fillRect(rx + 34, ry + 10, 4, 3);
  }

  // main body with rounded nose
  ctx.fillStyle = COLORS.heli_body;
  ctx.fillRect(rx - 18, ry + 5, 34, 14);
  // nose curve
  ctx.beginPath();
  ctx.arc(rx - 18, ry + 12, 7, -Math.PI/2, Math.PI/2);
  ctx.fill();
  // body highlight stripe
  ctx.fillStyle = '#dd4444';
  ctx.fillRect(rx - 16, ry + 7, 30, 3);
  // underbelly shadow
  ctx.fillStyle = '#991a1a';
  ctx.fillRect(rx - 16, ry + 16, 30, 3);

  // cockpit bubble (rounded)
  ctx.fillStyle = COLORS.heli_window;
  ctx.beginPath();
  ctx.arc(rx - 16, ry + 12, 8, -Math.PI * 0.6, Math.PI * 0.6);
  ctx.fill();
  // window glint
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(rx - 20, ry + 8, 3, 4);

  // landing light
  ctx.fillStyle = '#ffff66';
  ctx.fillRect(rx - 24, ry + 13, 3, 2);

  // skid struts
  ctx.fillStyle = '#777';
  ctx.fillRect(rx - 14, ry + 19, 2, 5);
  ctx.fillRect(rx + 8, ry + 19, 2, 5);
  // skids
  ctx.fillStyle = COLORS.heli_skid;
  ctx.fillRect(rx - 18, ry + 23, 14, 2);
  ctx.fillRect(rx + 4, ry + 23, 14, 2);

  // exhaust particles
  if (frame % 6 < 3) {
    ctx.fillStyle = 'rgba(150,150,150,0.3)';
    ctx.fillRect(rx + 36 + (frame % 12), ry + 6, 4, 3);
    ctx.fillStyle = 'rgba(150,150,150,0.15)';
    ctx.fillRect(rx + 42 + (frame % 8), ry + 5, 3, 2);
  }
}

function drawAnimal(ctx, screenX, screenY, type, frame, animalId) {
  const bounce = Math.sin(frame * 0.06 + animalId * 1.7) * 2;
  const bx = Math.round(screenX);
  const by = Math.round(screenY + bounce);

  // pulsing glow for visibility
  const glowAlpha = 0.2 + 0.1 * Math.sin(frame * 0.08 + animalId);
  ctx.fillStyle = `rgba(255,255,100,${glowAlpha})`;
  ctx.beginPath();
  ctx.arc(bx, by - 12, 18, 0, Math.PI * 2);
  ctx.fill();

  switch (type) {
    case 'monkey':
      // tail (curled)
      ctx.strokeStyle = '#7a3a10';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx + 10, by - 16, 8, -Math.PI * 0.3, Math.PI * 0.8);
      ctx.stroke();
      // body
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(bx - 8, by - 18, 16, 14);
      // belly
      ctx.fillStyle = '#CD9B5A';
      ctx.fillRect(bx - 5, by - 14, 10, 8);
      // head
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(bx - 7, by - 28, 14, 12);
      // face
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(bx - 4, by - 24, 8, 8);
      // eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 3, by - 24, 3, 3);
      ctx.fillRect(bx + 1, by - 24, 3, 3);
      // pupils
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx - 2, by - 23, 1, 1);
      ctx.fillRect(bx + 2, by - 23, 1, 1);
      // mouth
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(bx - 2, by - 19, 4, 1);
      // ears
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(bx - 9, by - 26, 3, 4);
      ctx.fillRect(bx + 6, by - 26, 3, 4);
      // arms
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(bx - 12, by - 16, 4, 10);
      ctx.fillRect(bx + 8, by - 16, 4, 10);
      // feet
      ctx.fillRect(bx - 6, by - 4, 5, 3);
      ctx.fillRect(bx + 2, by - 4, 5, 3);
      break;

    case 'bird':
      // body
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(bx - 8, by - 14, 14, 10);
      // breast
      ctx.fillStyle = '#ff6666';
      ctx.fillRect(bx - 6, by - 12, 10, 6);
      // head
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(bx - 5, by - 22, 10, 10);
      // eye
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx - 2, by - 20, 4, 3);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 1, by - 19, 2, 2);
      // beak
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(bx - 9, by - 18, 5, 3);
      // wing (animated flap)
      const wingY = frame % 20 < 10 ? -2 : 2;
      ctx.fillStyle = '#cc1111';
      ctx.fillRect(bx + 4, by - 16 + wingY, 10, 6);
      ctx.fillStyle = '#aa0000';
      ctx.fillRect(bx + 8, by - 14 + wingY, 8, 4);
      // tail feathers
      ctx.fillStyle = '#dd2222';
      ctx.fillRect(bx + 4, by - 8, 6, 4);
      ctx.fillRect(bx + 8, by - 10, 4, 3);
      // feet
      ctx.fillStyle = '#aa6600';
      ctx.fillRect(bx - 4, by - 4, 2, 4);
      ctx.fillRect(bx + 2, by - 4, 2, 4);
      break;

    case 'frog':
      // body
      ctx.fillStyle = '#22aa44';
      ctx.fillRect(bx - 10, by - 12, 20, 12);
      // belly
      ctx.fillStyle = '#88dd88';
      ctx.fillRect(bx - 7, by - 8, 14, 6);
      // head
      ctx.fillStyle = '#2abb55';
      ctx.fillRect(bx - 8, by - 22, 16, 12);
      // eye bumps
      ctx.fillStyle = '#33cc66';
      ctx.fillRect(bx - 9, by - 26, 7, 6);
      ctx.fillRect(bx + 2, by - 26, 7, 6);
      // eyes
      ctx.fillStyle = '#ffff44';
      ctx.fillRect(bx - 7, by - 25, 5, 4);
      ctx.fillRect(bx + 3, by - 25, 5, 4);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 5, by - 24, 2, 2);
      ctx.fillRect(bx + 5, by - 24, 2, 2);
      // mouth line
      ctx.fillStyle = '#1a8833';
      ctx.fillRect(bx - 5, by - 14, 10, 1);
      // front legs
      ctx.fillStyle = '#22aa44';
      ctx.fillRect(bx - 12, by - 6, 4, 6);
      ctx.fillRect(bx + 8, by - 6, 4, 6);
      // back legs (folded)
      ctx.fillRect(bx - 14, by - 2, 6, 4);
      ctx.fillRect(bx + 8, by - 2, 6, 4);
      // toe pads
      ctx.fillStyle = '#44cc66';
      ctx.fillRect(bx - 14, by + 1, 3, 2);
      ctx.fillRect(bx + 11, by + 1, 3, 2);
      break;

    case 'toucan':
      // body
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(bx - 8, by - 16, 14, 14);
      // white breast
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx - 6, by - 12, 10, 8);
      // head
      ctx.fillStyle = '#222222';
      ctx.fillRect(bx - 6, by - 26, 12, 12);
      // eye ring
      ctx.fillStyle = '#44aaff';
      ctx.fillRect(bx - 3, by - 24, 5, 4);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 1, by - 23, 2, 2);
      // giant colorful beak
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(bx - 18, by - 22, 14, 5);
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(bx - 18, by - 18, 14, 4);
      ctx.fillStyle = '#ff3300';
      ctx.fillRect(bx - 16, by - 15, 10, 3);
      // beak tip
      ctx.fillStyle = '#333';
      ctx.fillRect(bx - 20, by - 21, 3, 6);
      // wing
      ctx.fillStyle = '#333';
      ctx.fillRect(bx + 4, by - 14, 8, 8);
      // tail
      ctx.fillStyle = '#111';
      ctx.fillRect(bx + 4, by - 4, 6, 6);
      // feet
      ctx.fillStyle = '#666';
      ctx.fillRect(bx - 4, by - 2, 3, 3);
      ctx.fillRect(bx + 2, by - 2, 3, 3);
      break;

    case 'sloth':
      // body (hanging pose)
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(bx - 10, by - 18, 20, 16);
      // fur texture
      ctx.fillStyle = '#7a6344';
      ctx.fillRect(bx - 8, by - 16, 4, 10);
      ctx.fillRect(bx + 2, by - 14, 4, 8);
      // head
      ctx.fillStyle = '#9B8365';
      ctx.fillRect(bx - 7, by - 28, 14, 12);
      // face mask
      ctx.fillStyle = '#C4A672';
      ctx.fillRect(bx - 5, by - 26, 10, 8);
      // dark eye patches
      ctx.fillStyle = '#4a3a2a';
      ctx.fillRect(bx - 4, by - 24, 4, 3);
      ctx.fillRect(bx + 1, by - 24, 4, 3);
      // eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 3, by - 23, 2, 2);
      ctx.fillRect(bx + 2, by - 23, 2, 2);
      // nose
      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(bx - 1, by - 20, 3, 2);
      // smile
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(bx - 2, by - 18, 5, 1);
      // long arms
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(bx - 16, by - 22, 8, 4);
      ctx.fillRect(bx + 8, by - 22, 8, 4);
      // claws
      ctx.fillStyle = '#5a4a3a';
      ctx.fillRect(bx - 18, by - 22, 3, 2);
      ctx.fillRect(bx + 14, by - 22, 3, 2);
      ctx.fillRect(bx - 18, by - 20, 3, 2);
      ctx.fillRect(bx + 14, by - 20, 3, 2);
      break;

    case 'jaguar':
      // tail
      ctx.fillStyle = '#D4942A';
      ctx.strokeStyle = '#D4942A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx + 10, by - 8);
      ctx.quadraticCurveTo(bx + 20, by - 16, bx + 16, by - 24);
      ctx.stroke();
      // body
      ctx.fillStyle = '#E8A830';
      ctx.fillRect(bx - 12, by - 16, 22, 12);
      // spots
      ctx.fillStyle = '#333';
      ctx.fillRect(bx - 8, by - 14, 3, 3);
      ctx.fillRect(bx - 2, by - 12, 3, 3);
      ctx.fillRect(bx + 4, by - 14, 3, 3);
      ctx.fillRect(bx - 6, by - 8, 2, 2);
      ctx.fillRect(bx + 2, by - 8, 2, 2);
      ctx.fillRect(bx + 6, by - 10, 2, 2);
      // belly
      ctx.fillStyle = '#F5D680';
      ctx.fillRect(bx - 8, by - 8, 16, 4);
      // head
      ctx.fillStyle = '#E8A830';
      ctx.fillRect(bx - 14, by - 24, 14, 12);
      // ears
      ctx.fillStyle = '#D4942A';
      ctx.fillRect(bx - 15, by - 28, 4, 5);
      ctx.fillRect(bx - 4, by - 28, 4, 5);
      ctx.fillStyle = '#F5C0A0';
      ctx.fillRect(bx - 14, by - 27, 2, 3);
      ctx.fillRect(bx - 3, by - 27, 2, 3);
      // face
      ctx.fillStyle = '#F5D680';
      ctx.fillRect(bx - 12, by - 20, 10, 6);
      // eyes
      ctx.fillStyle = '#44aa44';
      ctx.fillRect(bx - 11, by - 20, 3, 3);
      ctx.fillRect(bx - 5, by - 20, 3, 3);
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 10, by - 19, 2, 2);
      ctx.fillRect(bx - 4, by - 19, 2, 2);
      // nose
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(bx - 9, by - 16, 4, 2);
      // whisker dots
      ctx.fillStyle = '#333';
      ctx.fillRect(bx - 14, by - 16, 1, 1);
      ctx.fillRect(bx - 14, by - 14, 1, 1);
      ctx.fillRect(bx - 1, by - 16, 1, 1);
      ctx.fillRect(bx - 1, by - 14, 1, 1);
      // legs
      ctx.fillStyle = '#E8A830';
      ctx.fillRect(bx - 10, by - 4, 5, 6);
      ctx.fillRect(bx + 2, by - 4, 5, 6);
      // paws
      ctx.fillStyle = '#D4942A';
      ctx.fillRect(bx - 11, by + 1, 6, 2);
      ctx.fillRect(bx + 1, by + 1, 6, 2);
      break;

    default:
      break;
  }
}

function drawWaterDrop(ctx, x, y) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  // main drop body
  ctx.fillStyle = '#1188ee';
  ctx.fillRect(rx - 6, ry - 4, 12, 14);
  // tapered tip (top)
  ctx.fillRect(rx - 4, ry - 8, 8, 6);
  ctx.fillRect(rx - 2, ry - 12, 4, 5);
  // bright highlight streak
  ctx.fillStyle = '#88ddff';
  ctx.fillRect(rx - 3, ry - 10, 3, 8);
  // inner core shine
  ctx.fillStyle = '#aaeeff';
  ctx.fillRect(rx - 2, ry - 2, 4, 6);
  // trailing splash ripple above
  ctx.fillStyle = 'rgba(68,170,255,0.4)';
  ctx.fillRect(rx - 8, ry - 4, 4, 3);
  ctx.fillRect(rx + 4, ry - 4, 4, 3);
}

function drawBulldozer(ctx, x, y, fuel, frame, stopped) {
  const bx = Math.round(x);
  const by = Math.round(y);

  // exhaust smoke (when not stopped)
  if (!stopped && frame % 10 < 6) {
    ctx.fillStyle = 'rgba(100,100,100,0.4)';
    ctx.beginPath();
    ctx.arc(bx + 14, by - 10 - (frame % 20), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(120,120,120,0.25)';
    ctx.beginPath();
    ctx.arc(bx + 16, by - 18 - (frame % 15), 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // tracks
  ctx.fillStyle = '#555';
  ctx.fillRect(bx - 6, by + 22, 72, 12);
  // track detail (hash marks)
  ctx.fillStyle = '#444';
  for (let i = 0; i < 9; i++) {
    ctx.fillRect(bx - 4 + i * 8, by + 24, 2, 8);
  }
  // track wheels
  ctx.fillStyle = '#777';
  ctx.fillRect(bx - 4, by + 24, 8, 8);
  ctx.fillRect(bx + 54, by + 24, 8, 8);
  ctx.fillStyle = '#666';
  for (let i = 1; i < 5; i++) {
    ctx.fillRect(bx - 2 + i * 12, by + 25, 6, 6);
  }

  // main body
  ctx.fillStyle = '#ccaa22';
  ctx.fillRect(bx, by + 2, 56, 22);
  // body shadow
  ctx.fillStyle = '#aa8811';
  ctx.fillRect(bx, by + 18, 56, 6);
  // body highlight
  ctx.fillStyle = '#ddbb33';
  ctx.fillRect(bx + 2, by + 4, 52, 3);

  // rivets
  ctx.fillStyle = '#888';
  ctx.fillRect(bx + 4, by + 10, 2, 2);
  ctx.fillRect(bx + 12, by + 10, 2, 2);
  ctx.fillRect(bx + 40, by + 10, 2, 2);
  ctx.fillRect(bx + 48, by + 10, 2, 2);

  // exhaust pipe
  ctx.fillStyle = '#666';
  ctx.fillRect(bx + 12, by - 6, 4, 10);
  ctx.fillStyle = '#555';
  ctx.fillRect(bx + 11, by - 8, 6, 3);

  // cab
  ctx.fillStyle = '#ddc044';
  ctx.fillRect(bx + 18, by - 2, 26, 20);
  ctx.fillStyle = '#ccb033';
  ctx.fillRect(bx + 18, by + 12, 26, 4);
  // window
  ctx.fillStyle = '#88ccff';
  ctx.fillRect(bx + 22, by, 14, 10);
  // window frame
  ctx.strokeStyle = '#aa9922';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx + 22, by, 14, 10);
  // window reflection
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(bx + 24, by + 2, 4, 6);

  // headlights
  ctx.fillStyle = '#ffff88';
  ctx.fillRect(bx + 52, by + 6, 4, 4);
  ctx.fillStyle = '#ffff44';
  ctx.fillRect(bx + 52, by + 14, 4, 4);

  // blade (thicker, angled)
  ctx.fillStyle = '#999';
  ctx.fillRect(bx + 56, by - 8, 10, 42);
  ctx.fillStyle = '#aaa';
  ctx.fillRect(bx + 57, by - 6, 8, 38);
  // blade edge shine
  ctx.fillStyle = '#bbb';
  ctx.fillRect(bx + 64, by - 6, 2, 38);
  // blade top curl
  ctx.fillStyle = '#888';
  ctx.fillRect(bx + 54, by - 10, 14, 3);

  // "STOPPED!" text when out of fuel
  if (stopped) {
    ctx.fillStyle = '#ff4444';
    ctx.font = '10px Courier New';
    ctx.fillText('STOPPED!', bx + 8, by - 14);
  }

  // fuel bar above bulldozer
  const barW = 50;
  const barH = 5;
  const barX = bx + 5;
  const barY = by - 22;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
  const fuelPct = Math.max(0, fuel) / 100;
  const fuelColor = fuelPct > 0.5 ? '#44cc44' : fuelPct > 0.25 ? '#ccaa22' : '#ff4444';
  ctx.fillStyle = fuelColor;
  ctx.fillRect(barX, barY, barW * fuelPct, barH);
  ctx.fillStyle = '#aaa';
  ctx.font = '7px Courier New';
  ctx.fillText('DOZER FUEL', barX, barY - 3);
}

function drawObstacle(ctx, x, y, type) {
  const ox = Math.round(x);
  const oy = Math.round(y);

  if (type === 'log') {
    // log (horizontal cylinder)
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(ox - 16, oy - 6, 32, 12);
    // bark texture
    ctx.fillStyle = '#5a3518';
    ctx.fillRect(ox - 14, oy - 4, 4, 8);
    ctx.fillRect(ox - 4, oy - 4, 4, 8);
    ctx.fillRect(ox + 6, oy - 4, 4, 8);
    // end rings
    ctx.fillStyle = '#8B6914';
    ctx.beginPath();
    ctx.arc(ox - 16, oy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#A0784A';
    ctx.beginPath();
    ctx.arc(ox - 16, oy, 4, 0, Math.PI * 2);
    ctx.fill();
    // highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(ox - 14, oy - 5, 28, 3);
  } else {
    // rock (irregular shape)
    ctx.fillStyle = '#777';
    ctx.fillRect(ox - 12, oy - 4, 24, 10);
    ctx.fillRect(ox - 8, oy - 8, 16, 6);
    ctx.fillStyle = '#888';
    ctx.fillRect(ox - 6, oy - 10, 12, 4);
    // cracks
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox - 4, oy - 8);
    ctx.lineTo(ox + 2, oy + 2);
    ctx.stroke();
    // highlights
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(ox - 4, oy - 9, 6, 3);
  }
}

function drawNet(ctx, heliX, heliY, netY, animalX, animalY, phase) {
  const hx = Math.round(heliX);
  const ny = Math.round(netY);
  const netW = 24;

  // rope lines from helicopter skids
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(hx - 8, heliY + 25);
  ctx.lineTo(hx - 8, ny);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hx + 8, heliY + 25);
  ctx.lineTo(hx + 8, ny);
  ctx.stroke();

  // net mesh
  ctx.strokeStyle = '#A0784A';
  ctx.lineWidth = 1;
  const netTop = ny;
  const netBot = ny + 20;

  // horizontal lines
  for (let i = 0; i < 5; i++) {
    const ly = netTop + i * 5;
    const spread = 4 + i * 2;
    ctx.beginPath();
    ctx.moveTo(hx - spread - 4, ly);
    ctx.lineTo(hx + spread + 4, ly);
    ctx.stroke();
  }
  // vertical lines
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(hx + i * 5, netTop);
    ctx.lineTo(hx + i * 6, netBot);
    ctx.stroke();
  }
  // basket bottom curve
  ctx.beginPath();
  ctx.arc(hx, netBot, netW / 2, 0, Math.PI);
  ctx.stroke();

  // captured animal glow
  if (phase === 'capturing' || phase === 'retracting') {
    ctx.fillStyle = 'rgba(100,255,150,0.3)';
    ctx.beginPath();
    ctx.arc(hx, ny + 10, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCrunchParticles(ctx, x, y, frame) {
  const age = frame % 30;
  if (age > 15) return;
  const spread = age * 2;
  ctx.fillStyle = `rgba(139,105,20,${1 - age / 15})`;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const px = x + Math.cos(angle) * spread;
    const py = y + Math.sin(angle) * spread;
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RainforestRescue() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);  // mutable game state (not re-render on every frame)
  const rafRef = useRef(null);

  const [gamePhase, setGamePhase] = useState('start'); // start | playing | grammar | levelcomplete | victory | gameover
  const [fuel, setFuel] = useState(100);
  const [water, setWater] = useState(100);
  const [damage, setDamage] = useState(0);
  const [animalsSaved, setAnimalsSaved] = useState(0);
  const [treesLost, setTreesLost] = useState(0);
  const [grammarQ, setGrammarQ] = useState(null);
  const [grammarReason, setGrammarReason] = useState('');
  const [grammarResult, setGrammarResult] = useState(null); // null | 'correct' | 'wrong'
  const [gameMode, setGameMode] = useState('grammar');   // grammar | math | trivia
  const [difficulty, setDifficulty] = useState('k3');   // prek | k3 | 46
  const [currentLevel, setCurrentLevel] = useState(1);  // 1–5
  const [isTouch, setIsTouch] = useState(false);

  // ─── Init game state ─────────────────────────────────────────────────────────
  const initGameState = useCallback((levelId = 1, mode = 'grammar', diff = 'k3') => {
    const levelConfig = LEVELS[levelId - 1] || LEVELS[0];
    const tiles = createWorld();
    for (let i = 0; i < levelConfig.startFires; i++) {
      const r = randInt(GROUND_ROW, ROWS - 1);
      const c = randInt(5, COLS - 5);
      if (tiles[r][c].type === TILE_HEALTHY) tiles[r][c].type = TILE_FIRE;
    }

    stateRef.current = {
      tiles,
      animals: createAnimals(),
      heli: { x: 200, y: 120, vx: 0, vy: 0, damage: 0 },
      waterDrops: [],
      waterSplashes: [],
      obstacles: [],
      crunchEffects: [],
      bulldozers: [{ x: -80, y: (GROUND_ROW) * TILE_SIZE - 10, fuel: 100, stalled: 0, stopped: false, speed: levelConfig.bdSpeed, lastMove: Date.now() }],
      lastBulldozerSpawn: Date.now(),
      scrollX: 0,
      frame: 0,
      lastFireSpread: Date.now(),
      lastObstacleDrop: 0,
      fuel: 100,
      water: 100,
      animalsSaved: 0,
      treesLost: 0,
      keys: {},
      pendingGrammarReason: '',
      grammarUsedIndices: [],
      levelConfig,
      gameMode: mode,
      difficulty: diff,
    };
  }, []);

  // ─── Pick a question (dispatches by mode + difficulty) ───────────────────────
  const pickQuestion = useCallback((usedIdx) => {
    const mode = stateRef.current?.gameMode || 'grammar';
    const diff = stateRef.current?.difficulty || 'k3';
    let pool;
    if (mode === 'math') pool = mathQuestions[diff] || mathQuestions.k3;
    else if (mode === 'trivia') pool = triviaQuestions[diff] || triviaQuestions.k3;
    else pool = grammarQuestions;
    const available = pool
      .map((q, i) => ({ q, i }))
      .filter(({ i }) => !usedIdx.includes(i));
    if (available.length === 0) return { question: pool[0], index: 0 };
    const pick = randFrom(available);
    return { question: pick.q, index: pick.i };
  }, []);

  // ─── Trigger grammar challenge ───────────────────────────────────────────────
  const triggerGrammar = useCallback((reason) => {
    if (!stateRef.current) return;
    const used = stateRef.current.grammarUsedIndices || [];
    const { question, index } = pickQuestion(used);
    stateRef.current.grammarUsedIndices = [...used, index];
    setGrammarQ(question);
    setGrammarReason(reason);
    setGrammarResult(null);
    setGamePhase('grammar');
  }, [pickQuestion]);

  // ─── Answer grammar question ─────────────────────────────────────────────────
  const handleAnswer = useCallback((answer) => {
    if (!grammarQ || grammarResult !== null) return;
    const correct = answer === grammarQ.answer;
    setGrammarResult(correct ? 'correct' : 'wrong');

    setTimeout(() => {
      if (stateRef.current) {
        if (correct) {
          stateRef.current.fuel = Math.min(100, stateRef.current.fuel + 50);
          stateRef.current.water = Math.min(100, stateRef.current.water + 50);
          stateRef.current.heli.damage = Math.max(0, (stateRef.current.heli.damage || 0) - 50);
          setFuel(stateRef.current.fuel);
          setWater(stateRef.current.water);
          setDamage(stateRef.current.heli.damage);
        } else {
          // wrong answer: partial repair so helicopter isn't immediately re-triggered
          stateRef.current.heli.damage = Math.min(50, stateRef.current.heli.damage || 0);
          setDamage(stateRef.current.heli.damage);
        }
      }
      setGamePhase('playing');
      setGrammarResult(null);
      setGrammarQ(null);
    }, 1800);
  }, [grammarQ, grammarResult]);

  // ─── Game loop ───────────────────────────────────────────────────────────────
  const gameLoop = useCallback((timestamp) => {
    const gs = stateRef.current;
    if (!gs || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const now = Date.now();

    gs.frame++;

    // ── Input & helicopter physics ────────────────────────────────────────────
    const { keys, heli } = gs;
    const THRUST = 0.28;
    const FRICTION = 0.90;
    const GRAVITY = 0.12;

    if (keys['ArrowLeft'])  heli.vx -= THRUST;
    if (keys['ArrowRight']) heli.vx += THRUST;
    if (keys['ArrowUp'])    heli.vy -= THRUST;
    if (keys['ArrowDown'])  heli.vy += THRUST;

    heli.vx *= FRICTION;
    heli.vy *= FRICTION;
    heli.vy += GRAVITY;

    heli.x = clamp(heli.x + heli.vx, 40, COLS * TILE_SIZE - 40);
    heli.y = clamp(heli.y + heli.vy, 10, CANVAS_H - 120);

    // consume fuel while moving
    if (keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']) {
      gs.fuel = Math.max(0, gs.fuel - 0.04);
    } else {
      gs.fuel = Math.max(0, gs.fuel - 0.008); // idle hover drain
    }

    // ── Scrolling ────────────────────────────────────────────────────────────
    const targetScrollX = clamp(heli.x - CANVAS_W / 2, 0, COLS * TILE_SIZE - CANVAS_W);
    gs.scrollX += (targetScrollX - gs.scrollX) * 0.1;

    // ── Helicopter fire damage ────────────────────────────────────────────────
    const heliCol = Math.floor(heli.x / TILE_SIZE);
    const heliRow = Math.floor(heli.y / TILE_SIZE);
    const heliTile = gs.tiles[heliRow]?.[heliCol];
    if (heliTile && heliTile.type === TILE_FIRE) {
      heli.damage = Math.min(100, (heli.damage || 0) + 0.4);
    } else {
      heli.damage = Math.max(0, (heli.damage || 0) - 0.05);
    }

    // ── Water drops ──────────────────────────────────────────────────────────
    if (keys[' '] && gs.water > 0 && gs.frame % 12 === 0) {
      gs.waterDrops.push({ x: heli.x, y: heli.y + 24, vy: 3 });
      gs.water = Math.max(0, gs.water - 4);
    }

    for (let i = gs.waterDrops.length - 1; i >= 0; i--) {
      const drop = gs.waterDrops[i];
      drop.y += drop.vy;
      drop.vy += 0.3;

      // mid-fall: extinguish fire tile the drop passes through (above ground)
      const midCol = Math.floor(drop.x / TILE_SIZE);
      const midRow = Math.floor(drop.y / TILE_SIZE);
      if (midRow >= GROUND_ROW && midRow < ROWS && midCol >= 0 && midCol < COLS) {
        const midTile = gs.tiles[midRow]?.[midCol];
        if (midTile && midTile.type === TILE_FIRE) {
          midTile.type = TILE_HEALTHY;
          midTile.treeVariant = randInt(0, 3);
          for (let p = 0; p < 4; p++) {
            const angle = (p / 4) * Math.PI * 2;
            gs.waterSplashes.push({ x: drop.x, y: drop.y, vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 1.5 - 1, life: 10 });
          }
          gs.waterDrops.splice(i, 1);
          continue;
        }
      }

      // hit ground level?
      const hitY = GROUND_ROW * TILE_SIZE;
      if (drop.y >= hitY) {
        const centerCol = Math.floor(drop.x / TILE_SIZE);
        const centerRow = GROUND_ROW + Math.floor((drop.y - hitY) / TILE_SIZE);
        // Extinguish fires in a 3×3 tile splash radius
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = centerRow + dr;
            const nc = centerCol + dc;
            if (nr >= GROUND_ROW && nr < ROWS && nc >= 0 && nc < COLS) {
              const tile = gs.tiles[nr]?.[nc];
              if (tile && tile.type === TILE_FIRE) {
                tile.type = TILE_HEALTHY;
                tile.treeVariant = randInt(0, 3);
              }
            }
          }
        }
        // Radial splash particles
        for (let p = 0; p < 6; p++) {
          const angle = (p / 6) * Math.PI * 2;
          gs.waterSplashes.push({
            x: drop.x, y: drop.y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 1.5 - 1,
            life: 12,
          });
        }
        gs.waterDrops.splice(i, 1);
      }
    }

    // ── Obstacle dropping (D key) ───────────────────────────────────────────
    if (keys['d'] && gs.fuel >= OBSTACLE_COST && now - gs.lastObstacleDrop > 600) {
      gs.obstacles.push({
        x: heli.x,
        y: gs.bulldozers[0].y,
        type: Math.random() < 0.5 ? 'log' : 'rock',
      });
      gs.fuel = Math.max(0, gs.fuel - OBSTACLE_COST);
      gs.lastObstacleDrop = now;
    }

    // age + move splash particles
    for (let i = gs.waterSplashes.length - 1; i >= 0; i--) {
      const sp = gs.waterSplashes[i];
      sp.x += sp.vx || 0;
      sp.y += sp.vy || 0;
      sp.life--;
      if (sp.life <= 0) gs.waterSplashes.splice(i, 1);
    }

    // ── Fire spread ──────────────────────────────────────────────────────────
    if (now - gs.lastFireSpread > (gs.levelConfig?.fireSpread || FIRE_SPREAD_INTERVAL)) {
      gs.lastFireSpread = now;
      const newFires = [];
      for (let r = GROUND_ROW; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (gs.tiles[r][c].type === TILE_FIRE) {
            gs.tiles[r][c].fireTick = (gs.tiles[r][c].fireTick || 0) + 1;
            // after 2 ticks fire becomes ash
            if (gs.tiles[r][c].fireTick >= 2) {
              gs.tiles[r][c].type = TILE_ASH;
              gs.treesLost++;
            }
            // spread to neighbors
            const neighbors = [
              [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
            ];
            for (const [nr, nc] of neighbors) {
              if (nr >= GROUND_ROW && nr < ROWS && nc >= 0 && nc < COLS) {
                if (gs.tiles[nr][nc].type === TILE_HEALTHY && Math.random() < 0.5) {
                  newFires.push([nr, nc]);
                }
              }
            }
          }
        }
      }
      for (const [r, c] of newFires) {
        gs.tiles[r][c].type = TILE_FIRE;
        gs.tiles[r][c].fireTick = 0;
      }

      // occasionally start new random fire
      if (Math.random() < 0.3) {
        const r = randInt(GROUND_ROW, ROWS - 1);
        const c = randInt(0, COLS - 1);
        if (gs.tiles[r][c].type === TILE_HEALTHY) {
          gs.tiles[r][c].type = TILE_FIRE;
          gs.tiles[r][c].fireTick = 0;
        }
      }
    }

    // ── Bulldozers ───────────────────────────────────────────────────────────
    for (const bd of gs.bulldozers) {
      if (bd.stopped) continue;
      if (bd.stalled > 0) {
        bd.stalled--;
      } else if (now - bd.lastMove > 80) {
        bd.lastMove = now;

        // check collision with obstacles
        const bdFront = bd.x + 66;
        let hitObstacle = false;
        for (let i = gs.obstacles.length - 1; i >= 0; i--) {
          const obs = gs.obstacles[i];
          if (Math.abs(bdFront - obs.x) < 20) {
            hitObstacle = true;
            bd.fuel -= BULLDOZER_FUEL_LOSS;
            bd.stalled = BULLDOZER_STALL_TIME;
            gs.crunchEffects.push({ x: obs.x, y: obs.y, startFrame: gs.frame });
            gs.obstacles.splice(i, 1);
            break;
          }
        }

        if (!hitObstacle) {
          bd.x += bd.speed;
          const col = Math.floor((bd.x + 60) / TILE_SIZE);
          if (col >= 0 && col < COLS) {
            for (let r = GROUND_ROW; r < ROWS; r++) {
              if (gs.tiles[r][col]) gs.tiles[r][col].type = TILE_DIRT;
            }
          }
        }

        if (bd.fuel <= 0) {
          bd.fuel = 0;
          bd.stopped = true;
        }
      }
    }

    // spawn new bulldozer every 30 seconds (max 4 active)
    const MAX_BULLDOZERS = 4;
    const activeBulldozers = gs.bulldozers.filter(bd => !bd.stopped);
    if (now - gs.lastBulldozerSpawn > 30000 && activeBulldozers.length < MAX_BULLDOZERS) {
      gs.bulldozers.push({ x: -80, y: (GROUND_ROW) * TILE_SIZE - 10, fuel: 100, stalled: 0, stopped: false, speed: gs.levelConfig.bdSpeed, lastMove: Date.now() });
      gs.lastBulldozerSpawn = now;
    }

    // age crunch effects
    for (let i = gs.crunchEffects.length - 1; i >= 0; i--) {
      if (gs.frame - gs.crunchEffects[i].startFrame > 30) {
        gs.crunchEffects.splice(i, 1);
      }
    }

    // ── Animal rescue (net animation) ─────────────────────────────────────────
    for (const animal of gs.animals) {
      if (animal.saved || animal.lost) continue;

      const ax = animal.col * TILE_SIZE + TILE_SIZE / 2;
      const ay = animal.row * TILE_SIZE + TILE_SIZE / 2;

      // handle active rescue phases
      if (animal.rescuePhase) {
        animal.rescueFrame++;
        if (animal.rescuePhase === 'net_descending') {
          // net descends from heli toward animal
          const progress = Math.min(1, animal.rescueFrame / 30);
          animal.netY = heli.y + 25 + (ay - heli.y - 25) * progress;
          if (animal.rescueFrame >= 30) {
            animal.rescuePhase = 'capturing';
            animal.rescueFrame = 0;
          }
        } else if (animal.rescuePhase === 'capturing') {
          animal.netY = ay;
          if (animal.rescueFrame >= 15) {
            animal.rescuePhase = 'retracting';
            animal.rescueFrame = 0;
            animal.captureY = ay;
          }
        } else if (animal.rescuePhase === 'retracting') {
          const progress = Math.min(1, animal.rescueFrame / 30);
          animal.netY = animal.captureY + (heli.y + 25 - animal.captureY) * progress;
          if (animal.rescueFrame >= 30) {
            animal.saved = true;
            animal.rescuePhase = null;
            gs.animalsSaved++;
          }
        }
        continue; // skip proximity check during active rescue
      }

      // proximity detection to start rescue
      const dist = Math.hypot(heli.x - ax, heli.y - ay);
      if (dist < 55) {
        animal.beamTimer = (animal.beamTimer || 0) + 1;
        if (animal.beamTimer > 90) {
          // start net rescue animation
          animal.rescuePhase = 'net_descending';
          animal.rescueFrame = 0;
          animal.netY = heli.y + 25;
        }
      } else {
        animal.beamTimer = Math.max(0, (animal.beamTimer || 0) - 2);
      }

      // check if their tile is on fire
      const tile = gs.tiles[animal.row]?.[animal.col];
      if (tile && (tile.type === TILE_FIRE || tile.type === TILE_ASH)) {
        animal.lost = true;
      }
    }

    // ── Sync react state ─────────────────────────────────────────────────────
    setFuel(Math.round(gs.fuel));
    setWater(Math.round(gs.water));
    setDamage(Math.round(heli.damage || 0));
    setAnimalsSaved(gs.animalsSaved);
    setTreesLost(gs.treesLost);

    // ─── RENDER ──────────────────────────────────────────────────────────────
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const sx = Math.round(gs.scrollX);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_ROW * TILE_SIZE);
    skyGrad.addColorStop(0, '#0a3d5c');
    skyGrad.addColorStop(1, '#1a7aaa');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_W, GROUND_ROW * TILE_SIZE);

    // Clouds (parallax)
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const cloudPositions = [80, 220, 400, 570, 720];
    for (const cp of cloudPositions) {
      const cx = ((cp - sx * 0.3) % CANVAS_W + CANVAS_W) % CANVAS_W;
      ctx.fillRect(cx, 20, 60, 14);
      ctx.fillRect(cx + 10, 12, 40, 14);
    }

    // Ground strip
    ctx.fillStyle = '#1a4a0a';
    ctx.fillRect(0, GROUND_ROW * TILE_SIZE, CANVAS_W, 4);

    // Tiles
    const startCol = Math.floor(sx / TILE_SIZE);
    const endCol = Math.min(COLS - 1, startCol + Math.ceil(CANVAS_W / TILE_SIZE) + 1);

    for (let r = GROUND_ROW; r < ROWS; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = gs.tiles[r]?.[c];
        if (!tile) continue;
        const tx = c * TILE_SIZE - sx;
        const ty = r * TILE_SIZE;

        switch (tile.type) {
          case TILE_HEALTHY:
            ctx.fillStyle = randFrom(COLORS.healthy);
            ctx.fillStyle = COLORS.healthy[tile.treeVariant % 4];
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            drawTree(ctx, tx, ty, tile.treeVariant, tile.type);
            break;
          case TILE_FIRE:
            ctx.fillStyle = '#2a1a00';
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            drawTree(ctx, tx, ty, tile.treeVariant || 0, tile.type);
            drawFire(ctx, tx, ty, gs.frame);
            break;
          case TILE_ASH:
            ctx.fillStyle = COLORS.ash;
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#333';
            ctx.fillRect(tx + 8, ty + 8, 6, 6);
            ctx.fillRect(tx + 22, ty + 18, 4, 4);
            break;
          case TILE_DIRT:
            ctx.fillStyle = COLORS.dirt;
            ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#7a5a10';
            for (let i = 0; i < 3; i++) {
              ctx.fillRect(tx + i * 14 + 2, ty + 10, 8, 4);
            }
            break;
          default:
            break;
        }
      }
    }

    // Animals
    for (const animal of gs.animals) {
      if (animal.saved || animal.lost) continue;
      const ax = animal.col * TILE_SIZE - sx + TILE_SIZE / 2;
      const ay = animal.row * TILE_SIZE + 4;
      if (ax > -20 && ax < CANVAS_W + 20) {
        // draw net rescue animation if active
        if (animal.rescuePhase) {
          const heliScreenX = heli.x - sx;
          drawNet(ctx, heliScreenX, heli.y, animal.netY, ax, ay, animal.rescuePhase);
          // draw animal at net position during retract
          if (animal.rescuePhase === 'retracting') {
            drawAnimal(ctx, heliScreenX, animal.netY - 10, animal.type, gs.frame, animal.id);
          } else {
            drawAnimal(ctx, ax, ay, animal.type, gs.frame, animal.id);
          }
        } else {
          // proximity indicator (progress ring)
          if (animal.beamTimer > 0) {
            const progress = animal.beamTimer / 90;
            ctx.strokeStyle = `rgba(100,255,200,${0.5 + progress * 0.5})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ax, ay - 12, 20, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
            ctx.stroke();
          }
          drawAnimal(ctx, ax, ay, animal.type, gs.frame, animal.id);
        }
      }
    }

    // Obstacles
    for (const obs of gs.obstacles) {
      const ox = obs.x - sx;
      if (ox > -30 && ox < CANVAS_W + 30) {
        drawObstacle(ctx, ox, obs.y, obs.type);
      }
    }

    // Crunch effects
    for (const crunch of gs.crunchEffects) {
      const cx = crunch.x - sx;
      if (cx > -30 && cx < CANVAS_W + 30) {
        drawCrunchParticles(ctx, cx, crunch.y, gs.frame - crunch.startFrame);
      }
    }

    // Water drops
    for (const drop of gs.waterDrops) {
      drawWaterDrop(ctx, drop.x - sx, drop.y);
    }

    // Splash particles
    for (const splash of gs.waterSplashes) {
      const alpha = splash.life / 12;
      ctx.fillStyle = `rgba(68,170,255,${alpha})`;
      ctx.fillRect(splash.x - sx - 3, splash.y - 3, 6, 6);
      // inner bright core
      ctx.fillStyle = `rgba(170,230,255,${alpha * 0.8})`;
      ctx.fillRect(splash.x - sx - 1, splash.y - 1, 3, 3);
    }

    // Bulldozers
    for (const bd of gs.bulldozers) {
      const bdx = bd.x - sx;
      if (bdx > -80 && bdx < CANVAS_W + 100) {
        drawBulldozer(ctx, bdx, bd.y, bd.fuel, gs.frame, bd.stopped);
      }
    }

    // Helicopter
    drawHelicopter(ctx, heli.x - sx, heli.y, gs.frame);

    // Low resource warning overlay
    if (gs.fuel < 15 || gs.water < 15) {
      ctx.fillStyle = `rgba(255,68,0,${0.08 + 0.06 * Math.sin(gs.frame * 0.2)})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // ── Check empty resources / max damage → trigger grammar ─────────────────
    if ((gs.fuel <= 0 || gs.water <= 0 || heli.damage >= 100) && gamePhase === 'playing') {
      const reason = gs.fuel <= 0 ? 'FUEL DEPLETED' : gs.water <= 0 ? 'WATER DEPLETED' : 'HELICOPTER DAMAGED';
      triggerGrammar(reason);
      return;
    }

    // ── Level complete check ──────────────────────────────────────────────────
    const lvlTarget = gs.levelConfig?.animalsTarget || 3;
    const allResolved = gs.animals.every(a => a.saved || a.lost);
    if (gs.animalsSaved >= lvlTarget || allResolved) {
      if (gs.levelConfig?.id >= 5) {
        setGamePhase('victory');
      } else {
        setGamePhase('levelcomplete');
      }
      return;
    }

    // ── Game over check (bulldozer reached end or too many trees lost) ────────
    if (gs.bulldozers.some(bd => bd.x > COLS * TILE_SIZE) || gs.treesLost > COLS * (ROWS - GROUND_ROW) * 0.6) {
      setGamePhase('gameover');
      return;
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gamePhase, triggerGrammar]);

  // ─── Start / Resume loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (gamePhase !== 'playing') {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gamePhase, gameLoop]);

  // ─── Keyboard listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => {
      if (!stateRef.current) return;
      stateRef.current.keys[e.key] = true;
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    const onUp = (e) => {
      if (!stateRef.current) return;
      stateRef.current.keys[e.key] = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // ─── Touch / responsive setup ─────────────────────────────────────────────
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const rescale = () => {
      const s = Math.min(window.innerWidth / 800, window.innerHeight / 540, 1);
      document.documentElement.style.setProperty('--game-scale', s);
    };
    rescale();
    window.addEventListener('resize', rescale);
    return () => window.removeEventListener('resize', rescale);
  }, []);

  const handleTouchKey = useCallback((key, isDown) => {
    if (stateRef.current) stateRef.current.keys[key] = isDown;
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleStart = () => {
    setCurrentLevel(1);
    initGameState(1, gameMode, difficulty);
    setFuel(100);
    setWater(100);
    setAnimalsSaved(0);
    setTreesLost(0);
    setGamePhase('playing');
  };

  const handleRestart = () => {
    setCurrentLevel(1);
    initGameState(1, gameMode, difficulty);
    setFuel(100);
    setWater(100);
    setAnimalsSaved(0);
    setTreesLost(0);
    setGamePhase('playing');
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    setCurrentLevel(nextLevel);
    initGameState(nextLevel, gameMode, difficulty);
    setFuel(100);
    setWater(100);
    setAnimalsSaved(0);
    setTreesLost(0);
    setGamePhase('playing');
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  const mkTouch = (key) => ({
    onTouchStart: (e) => { e.preventDefault(); handleTouchKey(key, true); },
    onTouchEnd:   (e) => { e.preventDefault(); handleTouchKey(key, false); },
    onTouchCancel:(e) => { handleTouchKey(key, false); },
  });

  return (
    <>
    <div className="game-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={CANVAS_W}
        height={CANVAS_H}
      />

      {/* HUD */}
      <div className="hud">
        <div className="gauge-block">
          <div className="gauge-label">⛽ Fuel</div>
          <div className="gauge-bar-outer">
            <div
              className="gauge-bar-inner gauge-fuel"
              style={{ width: `${fuel}%` }}
            />
          </div>
          <div style={{ color: fuel < 20 ? '#ff4444' : '#666', fontSize: 10 }}>
            {fuel}%
          </div>
        </div>

        <div className="gauge-block">
          <div className="gauge-label">💧 Water</div>
          <div className="gauge-bar-outer">
            <div
              className="gauge-bar-inner gauge-water"
              style={{ width: `${water}%` }}
            />
          </div>
          <div style={{ color: water < 20 ? '#ff4444' : '#666', fontSize: 10 }}>
            {water}%
          </div>
        </div>

        <div className="gauge-block">
          <div className="gauge-label">🚁 Hull</div>
          <div className="gauge-bar-outer">
            <div
              className="gauge-bar-inner"
              style={{
                width: `${100 - damage}%`,
                background: damage > 60 ? '#ff2222' : damage > 30 ? '#ff8800' : '#44cc44',
              }}
            />
          </div>
          <div style={{ color: damage > 60 ? '#ff4444' : '#666', fontSize: 10 }}>
            {100 - damage}%
          </div>
        </div>

        {!isTouch && (
          <div style={{ color: '#666', fontSize: 10, marginLeft: 8 }}>
            <div>ARROWS — Move</div>
            <div>SPACE — Drop Water</div>
            <div>D — Drop Obstacle</div>
          </div>
        )}
        {isTouch && (
          <div style={{ color: '#666', fontSize: 10, marginLeft: 8 }}>
            <div>D-pad — Fly</div>
            <div>💧 — Drop Water</div>
            <div>🪨 — Drop Obstacle</div>
          </div>
        )}

        <div className="score-block">
          <div className="score-item">
            Level: <span className="score-val">{currentLevel}/5</span>
            {' '}<span style={{ color: '#888', fontSize: 9 }}>
              {LEVELS[currentLevel - 1]?.name}
            </span>
          </div>
          <div className="score-item">
            Saved: <span className="score-val">{animalsSaved}</span>
            <span style={{ color: '#555', fontSize: 9 }}>
              /{LEVELS[currentLevel - 1]?.animalsTarget}
            </span>
          </div>
          <div className="score-item">
            Trees Lost: <span className={`score-val ${treesLost > 20 ? 'danger' : ''}`}>{treesLost}</span>
          </div>
          <div style={{ color: '#555', fontSize: 9, marginTop: 2 }}>
            {gameMode.toUpperCase()} · {difficulty === 'prek' ? 'Pre-K' : difficulty === 'k3' ? 'K–3' : '4–6'}
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {gamePhase === 'grammar' && grammarQ && (
        <div className="grammar-overlay">
          <div className="grammar-modal">
            <div className="grammar-header">⚠ Resource Alert</div>
            <div className="grammar-subheader">{grammarReason} — Answer correctly to refill 50%!</div>
            <div className="grammar-reason">
              {gameMode === 'grammar'
                ? <>Is the following a complete <strong>Sentence</strong> or a <strong>Fragment</strong>?</>
                : gameMode === 'math'
                  ? <>Solve the <strong>Math</strong> problem to refuel!</>
                  : <>Answer the <strong>Trivia</strong> question to refuel!</>}
            </div>
            <div className="grammar-text-box">
              {grammarQ.text}
            </div>
            {grammarResult === null ? (
              grammarQ.answers ? (
                <div className="answer-grid">
                  {grammarQ.answers.map((ans) => (
                    <button
                      key={ans}
                      className="grammar-btn answer-btn"
                      onClick={() => handleAnswer(ans)}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grammar-buttons">
                  <button
                    className="grammar-btn btn-sentence"
                    onClick={() => handleAnswer('Sentence')}
                  >
                    Sentence
                  </button>
                  <button
                    className="grammar-btn btn-fragment"
                    onClick={() => handleAnswer('Fragment')}
                  >
                    Fragment
                  </button>
                </div>
              )
            ) : (
              <div className={`grammar-result ${grammarResult === 'correct' ? 'result-correct' : 'result-wrong'}`}>
                {grammarResult === 'correct'
                  ? '✓ Correct! Refilling fuel and water...'
                  : `✗ Wrong. The answer is "${grammarQ.answer}". Resuming with empty tanks...`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Screen */}
      {gamePhase === 'start' && (
        <div className="start-overlay">
          <div className="start-title">Rainforest Rescue</div>
          <div className="start-subtitle">— 1994 Edition —</div>

          <div className="select-section">
            <div className="select-label">Game Mode</div>
            <div className="select-row">
              {['grammar','math','trivia'].map(m => (
                <button
                  key={m}
                  className={`select-btn ${gameMode === m ? 'active' : ''}`}
                  onClick={() => setGameMode(m)}
                >
                  {m === 'grammar' ? 'Grammar' : m === 'math' ? 'Math' : 'Trivia'}
                </button>
              ))}
            </div>
          </div>

          <div className="select-section">
            <div className="select-label">Difficulty</div>
            <div className="select-row">
              {[['prek','Pre-K'],['k3','K – 3'],['46','Grades 4–6']].map(([val, label]) => (
                <button
                  key={val}
                  className={`select-btn ${difficulty === val ? 'active' : ''}`}
                  onClick={() => setDifficulty(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="start-controls">
            {isTouch
              ? <>D-pad — Fly &nbsp;|&nbsp; 💧 — Drop Water &nbsp;|&nbsp; 🪨 — Drop Obstacle<br /></>
              : <>Arrow Keys — Fly &nbsp;|&nbsp; Space — Drop Water &nbsp;|&nbsp; D — Drop Obstacle<br /></>
            }
            Hover near Animals to Rescue &nbsp;|&nbsp; Answer Questions to Refuel
          </div>
          <button className="start-btn" onClick={handleStart}>
            Start Mission
          </button>
        </div>
      )}

      {/* Level Complete */}
      {gamePhase === 'levelcomplete' && (
        <div className="levelcomplete-overlay">
          <div className="levelcomplete-title">Level {currentLevel} Complete!</div>
          <div className="levelcomplete-sub">{LEVELS[currentLevel - 1]?.name}</div>
          <div className="gameover-stats">
            Animals Rescued: <strong style={{ color: '#00ff88' }}>{animalsSaved}</strong><br />
            Trees Lost: <strong style={{ color: '#ff4444' }}>{treesLost}</strong>
          </div>
          <div className="levelcomplete-next">
            Next: Level {currentLevel + 1} — {LEVELS[currentLevel]?.name}
          </div>
          <button className="start-btn" onClick={handleNextLevel}>
            Next Level
          </button>
        </div>
      )}

      {/* Victory */}
      {gamePhase === 'victory' && (
        <div className="victory-overlay">
          <div className="victory-title">Mission Accomplished!</div>
          <div className="victory-sub">All 5 levels complete — the rainforest is saved!</div>
          <div className="gameover-stats">
            Animals Rescued: <strong style={{ color: '#00ff88' }}>{animalsSaved}</strong><br />
            Mode: <strong style={{ color: '#ffaa00' }}>{gameMode.toUpperCase()}</strong>
          </div>
          <button className="start-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}

      {/* Game Over */}
      {gamePhase === 'gameover' && (
        <div className="gameover-overlay">
          <div className="gameover-title">Mission Failed</div>
          <div className="gameover-stats">
            Animals Rescued: <strong style={{ color: '#00ff88' }}>{animalsSaved}</strong><br />
            Trees Lost: <strong style={{ color: '#ff4444' }}>{treesLost}</strong><br />
            Level: <strong style={{ color: '#ffaa00' }}>{currentLevel}/5</strong>
          </div>
          <button className="gameover-btn" onClick={handleRestart}>
            Try Again
          </button>
        </div>
      )}
    </div>

    {/* Touch Gamepad — rendered outside the scaled container so buttons stay native size */}
    {isTouch && gamePhase === 'playing' && (
      <div className="touch-gamepad">
        <div className="touch-dpad">
          <button className="touch-btn dpad-up"    {...mkTouch('ArrowUp')}>↑</button>
          <button className="touch-btn dpad-left"  {...mkTouch('ArrowLeft')}>←</button>
          <button className="touch-btn dpad-right" {...mkTouch('ArrowRight')}>→</button>
          <button className="touch-btn dpad-down"  {...mkTouch('ArrowDown')}>↓</button>
        </div>
        <div className="touch-actions">
          <button className="touch-btn touch-btn-water" {...mkTouch(' ')}>💧</button>
          <button className="touch-btn touch-btn-block" {...mkTouch('d')}>🪨</button>
        </div>
      </div>
    )}
    </>
  );
}
