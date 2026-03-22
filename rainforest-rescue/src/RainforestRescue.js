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

// ─── Constants ─────────────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 460; // leaves 80px for HUD
const TILE_SIZE = 40;
const COLS = 30;       // total world columns (wider than viewport)
const ROWS = 9;        // rows visible (360px / 40 = 9)
const SKY_ROWS = 3;    // top 3 rows are sky
const GROUND_ROW = SKY_ROWS; // first ground row index
const FIRE_SPREAD_INTERVAL = 12000; // ms
const ANIMAL_TYPES = ['monkey', 'bird', 'frog'];

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
  for (let i = 0; i < 8; i++) {
    animals.push({
      id: i,
      col: randInt(2, COLS - 2),
      row: randInt(GROUND_ROW, ROWS - 2),
      type: randFrom(ANIMAL_TYPES),
      saved: false,
      lost: false,
      beamTimer: 0,
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
  // rotor (animated)
  const rotorPhase = frame % 4;
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 2;
  if (rotorPhase < 2) {
    ctx.beginPath();
    ctx.moveTo(rx - 24, ry);
    ctx.lineTo(rx + 24, ry);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(rx, ry - 24);
    ctx.lineTo(rx, ry + 4);
    ctx.stroke();
  }

  // body
  ctx.fillStyle = COLORS.heli_body;
  ctx.fillRect(rx - 22, ry + 2, 44, 18);
  // cockpit bubble
  ctx.fillStyle = COLORS.heli_window;
  ctx.fillRect(rx - 14, ry + 4, 16, 12);
  // tail boom
  ctx.fillStyle = '#aa1a1a';
  ctx.fillRect(rx + 20, ry + 6, 18, 8);
  // tail rotor
  ctx.fillStyle = '#999';
  ctx.fillRect(rx + 36, ry + 2, 3, 16);
  // skids
  ctx.fillStyle = COLORS.heli_skid;
  ctx.fillRect(rx - 18, ry + 20, 36, 3);
  ctx.fillRect(rx - 16, ry + 17, 4, 4);
  ctx.fillRect(rx + 12, ry + 17, 4, 4);
}

function drawAnimal(ctx, screenX, screenY, type, beamActive) {
  const bx = Math.round(screenX);
  const by = Math.round(screenY);

  if (beamActive) {
    // beam glow
    ctx.fillStyle = COLORS.beam;
    ctx.fillRect(bx - 10, by - 40, 20, 60);
  }

  switch (type) {
    case 'monkey':
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(bx - 6, by - 14, 12, 10); // body
      ctx.fillStyle = '#CD853F';
      ctx.fillRect(bx - 5, by - 20, 10, 8);  // head
      ctx.fillStyle = '#000';
      ctx.fillRect(bx - 3, by - 19, 2, 2);   // eyes
      ctx.fillRect(bx + 1, by - 19, 2, 2);
      break;
    case 'bird':
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(bx - 8, by - 10, 10, 6);  // body
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(bx - 12, by - 12, 6, 4);  // wing
      ctx.fillRect(bx + 2, by - 11, 5, 3);   // wing
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(bx - 4, by - 14, 4, 4);   // head
      break;
    case 'frog':
      ctx.fillStyle = '#22aa44';
      ctx.fillRect(bx - 7, by - 10, 14, 8);  // body
      ctx.fillStyle = '#33cc55';
      ctx.fillRect(bx - 5, by - 16, 10, 8);  // head
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(bx - 5, by - 14, 3, 3);   // eyes
      ctx.fillRect(bx + 2, by - 14, 3, 3);
      break;
    default:
      break;
  }
}

function drawWaterDrop(ctx, x, y) {
  ctx.fillStyle = '#44aaff';
  ctx.fillRect(Math.round(x) - 4, Math.round(y) - 8, 8, 12);
  ctx.fillStyle = '#aaddff';
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 6, 4, 4);
}

function drawBulldozer(ctx, x, y) {
  const bx = Math.round(x);
  const by = Math.round(y);
  ctx.fillStyle = '#ccaa22';
  ctx.fillRect(bx, by, 60, 30);
  ctx.fillStyle = '#aa8811';
  ctx.fillRect(bx - 6, by + 18, 72, 12);  // tracks
  ctx.fillStyle = '#888';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(bx - 4 + i * 14, by + 20, 8, 8);  // wheels
  }
  ctx.fillStyle = '#ddc044';
  ctx.fillRect(bx + 4, by + 4, 24, 16);  // cab
  ctx.fillStyle = '#88ccff';
  ctx.fillRect(bx + 8, by + 6, 10, 8);   // window
  // blade
  ctx.fillStyle = '#aaa';
  ctx.fillRect(bx + 56, by - 6, 8, 40);
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function RainforestRescue() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);  // mutable game state (not re-render on every frame)
  const rafRef = useRef(null);

  const [gamePhase, setGamePhase] = useState('start'); // start | playing | grammar | gameover
  const [fuel, setFuel] = useState(100);
  const [water, setWater] = useState(100);
  const [animalsSaved, setAnimalsSaved] = useState(0);
  const [treesLost, setTreesLost] = useState(0);
  const [grammarQ, setGrammarQ] = useState(null);
  const [grammarReason, setGrammarReason] = useState('');
  const [grammarResult, setGrammarResult] = useState(null); // null | 'correct' | 'wrong'

  // ─── Init game state ─────────────────────────────────────────────────────────
  const initGameState = useCallback(() => {
    const tiles = createWorld();
    // start a couple fires
    for (let i = 0; i < 3; i++) {
      const r = randInt(GROUND_ROW, ROWS - 1);
      const c = randInt(5, COLS - 5);
      if (tiles[r][c].type === TILE_HEALTHY) tiles[r][c].type = TILE_FIRE;
    }

    stateRef.current = {
      tiles,
      animals: createAnimals(),
      heli: { x: 200, y: 120, vx: 0, vy: 0 },
      waterDrops: [],
      waterSplashes: [],
      bulldozer: { x: -80, y: (GROUND_ROW) * TILE_SIZE - 10 },
      scrollX: 0,
      frame: 0,
      lastFireSpread: Date.now(),
      lastBulldozerMove: Date.now(),
      fuel: 100,
      water: 100,
      animalsSaved: 0,
      treesLost: 0,
      keys: {},
      pendingGrammarReason: '',
      grammarUsedIndices: [],
    };
  }, []);

  // ─── Pick a grammar question ─────────────────────────────────────────────────
  const pickQuestion = useCallback((usedIdx) => {
    const available = grammarQuestions
      .map((q, i) => ({ q, i }))
      .filter(({ i }) => !usedIdx.includes(i));
    if (available.length === 0) return { question: grammarQuestions[0], index: 0 };
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
          setFuel(stateRef.current.fuel);
          setWater(stateRef.current.water);
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

    // ── Water drops ──────────────────────────────────────────────────────────
    if (keys[' '] && gs.water > 0 && gs.frame % 12 === 0) {
      gs.waterDrops.push({ x: heli.x, y: heli.y + 24, vy: 3 });
      gs.water = Math.max(0, gs.water - 4);
    }

    for (let i = gs.waterDrops.length - 1; i >= 0; i--) {
      const drop = gs.waterDrops[i];
      drop.y += drop.vy;
      drop.vy += 0.3;

      // hit ground level?
      const hitY = GROUND_ROW * TILE_SIZE;
      if (drop.y >= hitY) {
        const col = Math.floor(drop.x / TILE_SIZE);
        const row = GROUND_ROW + Math.floor((drop.y - hitY) / TILE_SIZE);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
          const tile = gs.tiles[row]?.[col];
          if (tile && tile.type === TILE_FIRE) {
            tile.type = TILE_HEALTHY;
            tile.treeVariant = randInt(0, 3);
          }
        }
        gs.waterSplashes.push({ x: drop.x, y: drop.y, life: 8 });
        gs.waterDrops.splice(i, 1);
      }
    }

    // age splashes
    for (let i = gs.waterSplashes.length - 1; i >= 0; i--) {
      gs.waterSplashes[i].life--;
      if (gs.waterSplashes[i].life <= 0) gs.waterSplashes.splice(i, 1);
    }

    // ── Fire spread ──────────────────────────────────────────────────────────
    if (now - gs.lastFireSpread > FIRE_SPREAD_INTERVAL) {
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

    // ── Bulldozer ────────────────────────────────────────────────────────────
    if (now - gs.lastBulldozerMove > 80) {
      gs.lastBulldozerMove = now;
      gs.bulldozer.x += 0.6;
      const col = Math.floor((gs.bulldozer.x + 60) / TILE_SIZE);
      if (col >= 0 && col < COLS) {
        for (let r = GROUND_ROW; r < ROWS; r++) {
          if (gs.tiles[r][col]) gs.tiles[r][col].type = TILE_DIRT;
        }
      }
    }

    // ── Animal beaming ───────────────────────────────────────────────────────
    for (const animal of gs.animals) {
      if (animal.saved || animal.lost) continue;
      const ax = animal.col * TILE_SIZE + TILE_SIZE / 2;
      const ay = animal.row * TILE_SIZE + TILE_SIZE / 2;
      const dist = Math.hypot(heli.x - ax, heli.y - ay);
      if (dist < 50) {
        animal.beamTimer = (animal.beamTimer || 0) + 1;
        if (animal.beamTimer > 90) { // ~1.5s at 60fps
          animal.saved = true;
          gs.animalsSaved++;
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
        const beamActive = (animal.beamTimer || 0) > 0;
        drawAnimal(ctx, ax, ay, animal.type, beamActive);
      }
    }

    // Water drops
    for (const drop of gs.waterDrops) {
      drawWaterDrop(ctx, drop.x - sx, drop.y);
    }

    // Splashes
    for (const splash of gs.waterSplashes) {
      const alpha = splash.life / 8;
      ctx.fillStyle = `rgba(68,170,255,${alpha})`;
      ctx.fillRect(splash.x - sx - 8, splash.y - 4, 16, 4);
    }

    // Bulldozer
    const bdx = gs.bulldozer.x - sx;
    if (bdx > -80 && bdx < CANVAS_W + 10) {
      drawBulldozer(ctx, bdx, gs.bulldozer.y);
    }

    // Helicopter
    drawHelicopter(ctx, heli.x - sx, heli.y, gs.frame);

    // Low resource warning overlay
    if (gs.fuel < 15 || gs.water < 15) {
      ctx.fillStyle = `rgba(255,68,0,${0.08 + 0.06 * Math.sin(gs.frame * 0.2)})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // ── Check empty resources → trigger grammar ───────────────────────────────
    if ((gs.fuel <= 0 || gs.water <= 0) && gamePhase === 'playing') {
      const reason = gs.fuel <= 0 ? 'FUEL DEPLETED' : 'WATER DEPLETED';
      triggerGrammar(reason);
      return;
    }

    // ── Game over check (bulldozer reached end or too many trees lost) ────────
    if (gs.bulldozer.x > COLS * TILE_SIZE || gs.treesLost > COLS * (ROWS - GROUND_ROW) * 0.6) {
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

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleStart = () => {
    initGameState();
    setFuel(100);
    setWater(100);
    setAnimalsSaved(0);
    setTreesLost(0);
    setGamePhase('playing');
  };

  const handleRestart = () => {
    initGameState();
    setFuel(100);
    setWater(100);
    setAnimalsSaved(0);
    setTreesLost(0);
    setGamePhase('playing');
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
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

        <div style={{ color: '#666', fontSize: 10, marginLeft: 8 }}>
          <div>ARROWS — Move</div>
          <div>SPACE — Drop Water</div>
        </div>

        <div className="score-block">
          <div className="score-item">
            Saved: <span className="score-val">{animalsSaved}</span>
          </div>
          <div className="score-item">
            Trees Lost: <span className={`score-val ${treesLost > 20 ? 'danger' : ''}`}>{treesLost}</span>
          </div>
        </div>
      </div>

      {/* Grammar Modal */}
      {gamePhase === 'grammar' && grammarQ && (
        <div className="grammar-overlay">
          <div className="grammar-modal">
            <div className="grammar-header">⚠ Resource Alert</div>
            <div className="grammar-subheader">{grammarReason} — Answer correctly to refill 50%!</div>
            <div className="grammar-reason">
              Is the following a complete <strong>Sentence</strong> or a <strong>Fragment</strong>?
            </div>
            <div className="grammar-text-box">
              "{grammarQ.text}"
            </div>
            {grammarResult === null ? (
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
          <div className="start-controls">
            Arrow Keys — Fly Helicopter<br />
            Spacebar — Drop Water on Fires<br />
            Hover near Animals — Beam them to safety<br />
            Answer Grammar Questions — Refill Resources
          </div>
          <button className="start-btn" onClick={handleStart}>
            Start Mission
          </button>
        </div>
      )}

      {/* Game Over */}
      {gamePhase === 'gameover' && (
        <div className="gameover-overlay">
          <div className="gameover-title">Mission Failed</div>
          <div className="gameover-stats">
            Animals Rescued: <strong style={{ color: '#00ff88' }}>{animalsSaved}</strong><br />
            Trees Lost: <strong style={{ color: '#ff4444' }}>{treesLost}</strong>
          </div>
          <button className="gameover-btn" onClick={handleRestart}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
