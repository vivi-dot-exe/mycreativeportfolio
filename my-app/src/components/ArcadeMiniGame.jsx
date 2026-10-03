import React, { useEffect, useRef, useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  PIXEL SPRITES FOR RETRO ARCADE                                    */
/* ------------------------------------------------------------------ */

// Player pixel avatar grid (Vaibhavi's 16x18 avatar)
const PALETTE = {
  hair: "#3b2418",
  skin: "#f4c99b",
  eye: "#1a1420",
  cup: "#14101f",
  band: "#ff2ec4",
  shirt: "#22c55e",
  collar: "#ffffff",
  mouth: "#8a3d4d",
  badge: "#fde047",
};

const GRID_W = 16;
const GRID_H = 18;

const SPANS = [
  [0, 4, 11, "hair"],
  [1, 3, 12, "hair"],
  [2, 2, 13, "band"],
  [3, 2, 3, "cup"],
  [3, 4, 11, "hair"],
  [3, 12, 13, "cup"],
  [4, 2, 3, "cup"],
  [4, 4, 11, "hair"],
  [4, 12, 13, "cup"],
  [5, 3, 4, "skin"],
  [5, 5, 10, "hair"],
  [5, 11, 12, "skin"],
  [6, 3, 12, "skin"],
  [7, 3, 4, "skin"],
  [7, 5, 6, "eye"],
  [7, 7, 8, "skin"],
  [7, 9, 10, "eye"],
  [7, 11, 12, "skin"],
  [8, 3, 12, "skin"],
  [9, 3, 5, "skin"],
  [9, 6, 9, "mouth"],
  [9, 10, 12, "skin"],
  [10, 3, 12, "skin"],
  [11, 4, 11, "skin"],
  [12, 4, 11, "collar"],
  [13, 3, 12, "shirt"],
  [14, 3, 6, "shirt"],
  [14, 7, 8, "badge"],
  [14, 9, 12, "shirt"],
  [15, 3, 12, "shirt"],
  [16, 3, 12, "shirt"],
  [17, 3, 12, "shirt"],
];

function createPlayerSpriteGrid() {
  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
  SPANS.forEach(([row, start, end, key]) => {
    for (let c = start; c <= end; c++) {
      grid[row][c] = PALETTE[key];
    }
  });
  return grid;
}

const PLAYER_GRID = createPlayerSpriteGrid();

export default function ArcadeMiniGame({
  onXpGain,
  playSfx,
  externalInput, // { up, down, left, right, jump, pulse, start, select }
  onStateChange,
}) {
  const canvasRef = useRef(null);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("retro_high_score") || "0", 10);
    } catch {
      return 0;
    }
  });

  // References for game loop state
  const stateRef = useRef({
    gameState: "PLAYING",
    score: 0,
    lives: 3,
    level: 1,
    playerX: 40,
    playerY: 130,
    baseY: 130,
    velocityY: 0,
    isJumping: false,
    invincibleTimer: 0,
    pulseCooldown: 0,
    pulseActive: 0,
    pulseRadius: 0,
    collectibles: [],
    obstacles: [],
    particles: [],
    stars: [],
    frameCount: 0,
    speed: 3,
  });

  // Track keys pressed internally as well
  const keysRef = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  });

  const triggerPulse = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "PLAYING") return;
    if (s.pulseCooldown <= 0) {
      s.pulseActive = 20; // 20 frames animation
      s.pulseRadius = 10;
      s.pulseCooldown = 180; // ~3 seconds at 60fps
      playSfx("zap");

      // Clear obstacles on screen and spawn particles
      const clearedCount = s.obstacles.length;
      s.obstacles.forEach((obs) => {
        for (let i = 0; i < 8; i++) {
          s.particles.push({
            x: obs.x,
            y: obs.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: "#38bdf8",
            life: 25,
          });
        }
      });
      s.obstacles = [];

      if (clearedCount > 0) {
        const bonus = clearedCount * 25;
        s.score += bonus;
        onXpGain?.(Math.floor(bonus / 2));
      }
    }
  }, [playSfx, onXpGain]);

  const restartGame = useCallback(() => {
    const s = stateRef.current;
    s.gameState = "PLAYING";
    s.score = 0;
    s.lives = 3;
    s.level = 1;
    s.speed = 3;
    s.playerX = 40;
    s.playerY = 130;
    s.velocityY = 0;
    s.isJumping = false;
    s.collectibles = [];
    s.obstacles = [];
    s.particles = [];
    s.pulseCooldown = 0;
    s.pulseActive = 0;
    s.invincibleTimer = 0;

    onStateChange?.("PLAYING");
    playSfx("levelUp");
  }, [playSfx, onStateChange]);

  // Sync external input from Game Boy hardware controls
  useEffect(() => {
    if (!externalInput) return;
    const s = stateRef.current;

    // Movement
    if (externalInput.up) keysRef.current.ArrowUp = true;
    else if (!keysRef.current.KeyW) keysRef.current.ArrowUp = false;

    if (externalInput.down) keysRef.current.ArrowDown = true;
    else if (!keysRef.current.KeyS) keysRef.current.ArrowDown = false;

    if (externalInput.left) keysRef.current.ArrowLeft = true;
    else if (!keysRef.current.KeyA) keysRef.current.ArrowLeft = false;

    if (externalInput.right) keysRef.current.ArrowRight = true;
    else if (!keysRef.current.KeyD) keysRef.current.ArrowRight = false;

    // Jump (A Button)
    if (externalInput.jump) {
      if (s.gameState === "PLAYING" && !s.isJumping) {
        s.velocityY = -8.5;
        s.isJumping = true;
        playSfx("jump");
      } else if (s.gameState === "GAMEOVER") {
        restartGame();
      }
    }

    // Pulse (B Button)
    if (externalInput.pulse) {
      triggerPulse();
    }

    // Start Button (Pause / Play / Restart)
    if (externalInput.start) {
      if (s.gameState === "PLAYING") {
        s.gameState = "PAUSED";
        playSfx("menu");
      } else if (s.gameState === "PAUSED") {
        s.gameState = "PLAYING";
        playSfx("menu");
      } else if (s.gameState === "GAMEOVER") {
        restartGame();
      }
    }
  }, [externalInput, playSfx, triggerPulse, restartGame]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture keys if typing in an input
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      if (e.code === "ArrowUp" || e.code === "KeyW") keysRef.current.ArrowUp = true;
      if (e.code === "ArrowDown" || e.code === "KeyS") keysRef.current.ArrowDown = true;
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.ArrowLeft = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.ArrowRight = true;

      if (e.code === "Space") {
        e.preventDefault();
        const s = stateRef.current;
        if (s.gameState === "PLAYING" && !s.isJumping) {
          s.velocityY = -8.5;
          s.isJumping = true;
          playSfx("jump");
        } else if (s.gameState === "GAMEOVER") {
          restartGame();
        }
      }

      if (e.code === "KeyB" || e.code === "KeyE") {
        triggerPulse();
      }

      if (e.code === "KeyP") {
        const s = stateRef.current;
        if (s.gameState === "PLAYING") {
          s.gameState = "PAUSED";
        } else if (s.gameState === "PAUSED") {
          s.gameState = "PLAYING";
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") keysRef.current.ArrowUp = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") keysRef.current.ArrowDown = false;
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.ArrowLeft = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.ArrowRight = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [triggerPulse, playSfx, restartGame]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    // Initialize stars
    const s = stateRef.current;
    s.stars = Array.from({ length: 30 }, () => ({
      x: Math.random() * 320,
      y: Math.random() * 140,
      speed: 0.5 + Math.random() * 1.5,
      size: Math.random() > 0.6 ? 2 : 1,
      color: Math.random() > 0.4 ? "#fde047" : "#ff9ecf",
    }));

    const render = () => {
      s.frameCount++;
      const W = canvas.width;
      const H = canvas.height;

      // 1. UPDATE GAME STATE
      if (s.gameState === "PLAYING") {
        // Pulse Cooldown
        if (s.pulseCooldown > 0) {
          s.pulseCooldown--;
        }

        // Pulse Animation
        if (s.pulseActive > 0) {
          s.pulseActive--;
          s.pulseRadius += 14;
        }

        // Invincible timer
        if (s.invincibleTimer > 0) s.invincibleTimer--;

        // Horizontal Movement
        if (keysRef.current.ArrowLeft || keysRef.current.KeyA) {
          s.playerX = Math.max(16, s.playerX - 3.2);
        }
        if (keysRef.current.ArrowRight || keysRef.current.KeyD) {
          s.playerX = Math.min(W - 40, s.playerX + 3.2);
        }

        // Vertical Movement / Jump Physics
        if (s.isJumping) {
          s.playerY += s.velocityY;
          s.velocityY += 0.5; // gravity
          if (s.playerY >= s.baseY) {
            s.playerY = s.baseY;
            s.isJumping = false;
            s.velocityY = 0;
          }
        } else {
          // Slight vertical steering if not jumping (within the floor lane)
          if (keysRef.current.ArrowUp || keysRef.current.KeyW) {
            s.baseY = Math.max(110, s.baseY - 1.8);
            s.playerY = s.baseY;
          }
          if (keysRef.current.ArrowDown || keysRef.current.KeyS) {
            s.baseY = Math.min(145, s.baseY + 1.8);
            s.playerY = s.baseY;
          }
        }

        // Level & Speed Progression
        const calculatedLevel = Math.min(5, Math.floor(s.score / 250) + 1);
        if (calculatedLevel !== s.level) {
          s.level = calculatedLevel;
          s.speed = 3 + (calculatedLevel - 1) * 0.8;
          playSfx("levelUp");
        }

        // Spawn Collectibles (Tech Gems)
        if (s.frameCount % 80 === 0 && Math.random() > 0.25) {
          const types = [
            { name: "python", color: "#4ade80", pts: 15, symbol: "🐍", xp: 10 },
            { name: "gpu", color: "#fde047", pts: 30, symbol: "⚡", xp: 20 },
            { name: "neural", color: "#ff2ec4", pts: 50, symbol: "🧠", xp: 35 },
            { name: "docker", color: "#38bdf8", pts: 25, symbol: "🐳", xp: 15 },
          ];
          const chosen = types[Math.floor(Math.random() * types.length)];
          s.collectibles.push({
            x: W + 20,
            y: 90 + Math.random() * 55,
            ...chosen,
            size: 14,
          });
        }

        // Spawn Obstacles (Bugs)
        const spawnInterval = Math.max(70, 130 - s.level * 12);
        if (s.frameCount % spawnInterval === 0) {
          const obsTypes = [
            { type: "memory_leak", name: "MEMORY LEAK", color: "#f43f5e", h: 18, w: 18, isGround: true },
            { type: "null_ptr", name: "NULL PTR", color: "#a855f7", h: 16, w: 16, isGround: false },
            { type: "latency", name: "500 SPIKE", color: "#fbbf24", h: 22, w: 14, isGround: true },
          ];
          const chosen = obsTypes[Math.floor(Math.random() * obsTypes.length)];
          s.obstacles.push({
            x: W + 20,
            y: chosen.isGround ? 138 : 105 + Math.random() * 30,
            ...chosen,
          });
        }

        // Move Collectibles & Check Collision
        s.collectibles.forEach((item, idx) => {
          item.x -= s.speed;
          // Collision with player
          const dx = item.x - (s.playerX + 12);
          const dy = item.y - (s.playerY + 12);
          const dist = Math.hypot(dx, dy);

          if (dist < 22) {
            // Collected!
            s.score += item.pts;
            onXpGain?.(item.xp);
            playSfx("gem");

            // Particle burst
            for (let i = 0; i < 6; i++) {
              s.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: item.color,
                life: 20,
              });
            }
            s.collectibles.splice(idx, 1);
          }
        });
        s.collectibles = s.collectibles.filter((item) => item.x > -30);

        // Move Obstacles & Check Collision
        s.obstacles.forEach((obs) => {
          obs.x -= s.speed + (obs.isGround ? 0 : 0.6);

          // Player hitbox
          const playerBox = {
            x: s.playerX + 4,
            y: s.playerY + 4,
            w: 18,
            h: 22,
          };
          const obsBox = {
            x: obs.x,
            y: obs.y,
            w: obs.w,
            h: obs.h,
          };

          const overlap =
            playerBox.x < obsBox.x + obsBox.w &&
            playerBox.x + playerBox.w > obsBox.x &&
            playerBox.y < obsBox.y + obsBox.h &&
            playerBox.y + playerBox.h > obsBox.y;

          if (overlap && s.invincibleTimer <= 0) {
            // HIT!
            s.lives--;
            s.invincibleTimer = 75; // ~1.2s invulnerability
            playSfx("hit");

            // Glitch particles
            for (let i = 0; i < 10; i++) {
              s.particles.push({
                x: s.playerX + 10,
                y: s.playerY + 10,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: "#ff2ec4",
                life: 30,
              });
            }

            if (s.lives <= 0) {
              s.gameState = "GAMEOVER";
              onStateChange?.("GAMEOVER");
              playSfx("gameOver");

              // Save high score
              if (s.score > highScore) {
                setHighScore(s.score);
                try {
                  localStorage.setItem("retro_high_score", s.score.toString());
                } catch {}
              }
            }
          }
        });
        s.obstacles = s.obstacles.filter((obs) => obs.x > -40);

        // Move Background Stars
        s.stars.forEach((star) => {
          star.x -= star.speed;
          if (star.x < 0) {
            star.x = W;
            star.y = Math.random() * 140;
          }
        });

        // Update particles
        s.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        });
        s.particles = s.particles.filter((p) => p.life > 0);
      }

      // 2. DRAW GRAPHICS
      ctx.imageSmoothingEnabled = false;

      // Clear Screen with 8-bit dark arcade gradient
      ctx.fillStyle = "#0c0c16";
      ctx.fillRect(0, 0, W, H);

      // Starfield
      s.stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
      });

      // Distant Cyber Skyline / Mountains
      ctx.fillStyle = "#151528";
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.lineTo(40, 115);
      ctx.lineTo(90, 140);
      ctx.lineTo(150, 105);
      ctx.lineTo(210, 140);
      ctx.lineTo(270, 110);
      ctx.lineTo(320, 140);
      ctx.lineTo(320, 180);
      ctx.lineTo(0, 180);
      ctx.fill();

      // Cyber Grid Floor
      ctx.fillStyle = "#161626";
      ctx.fillRect(0, 155, W, H - 155);

      // Neon horizon line
      ctx.strokeStyle = "#ff2ec4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 155);
      ctx.lineTo(W, 155);
      ctx.stroke();

      // Scrolling grid lines
      ctx.strokeStyle = "#4ade8022";
      ctx.lineWidth = 1;
      const gridOffset = (s.frameCount * s.speed) % 24;
      for (let x = -gridOffset; x < W; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 155);
        ctx.lineTo(x - 30, H);
        ctx.stroke();
      }

      // Draw Collectibles
      s.collectibles.forEach((item) => {
        ctx.fillStyle = item.color;
        const bob = Math.sin((s.frameCount + item.x) * 0.1) * 3;
        const ix = Math.floor(item.x);
        const iy = Math.floor(item.y + bob);

        // Retro Gem Diamond
        ctx.beginPath();
        ctx.moveTo(ix, iy - 6);
        ctx.lineTo(ix + 6, iy);
        ctx.lineTo(ix, iy + 6);
        ctx.lineTo(ix - 6, iy);
        ctx.closePath();
        ctx.fill();

        // Inner sparkle
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(ix - 1, iy - 1, 2, 2);
      });

      // Draw Obstacles (Bugs)
      s.obstacles.forEach((obs) => {
        ctx.fillStyle = obs.color;
        const ox = Math.floor(obs.x);
        const oy = Math.floor(obs.y);

        if (obs.type === "memory_leak") {
          // Pixel bug with waving legs
          ctx.fillRect(ox + 2, oy, 12, 10);
          ctx.fillRect(ox, oy + 4, 16, 6);
          // Eyes
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(ox + 4, oy + 2, 2, 2);
          ctx.fillRect(ox + 9, oy + 2, 2, 2);
          // Legs
          ctx.fillStyle = obs.color;
          const legWiggle = Math.sin(s.frameCount * 0.4) > 0 ? 2 : 0;
          ctx.fillRect(ox + 1, oy + 10 + legWiggle, 3, 4);
          ctx.fillRect(ox + 12, oy + 10 - legWiggle, 3, 4);
        } else if (obs.type === "null_ptr") {
          // Glitch Drone
          ctx.fillRect(ox, oy + 2, 14, 8);
          ctx.fillRect(ox + 4, oy, 6, 12);
          // Red core
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(ox + 5, oy + 4, 4, 4);
        } else {
          // Latency Spike / Electrical Hazard
          ctx.beginPath();
          ctx.moveTo(ox, oy + obs.h);
          ctx.lineTo(ox + obs.w / 2, oy);
          ctx.lineTo(ox + obs.w, oy + obs.h);
          ctx.fill();
        }
      });

      // Draw Debug Pulse Wave
      if (s.pulseActive > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${s.pulseActive / 20})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(s.playerX + 12, s.playerY + 12, s.pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Particles
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
      });

      // Draw Player (Vaibhavi's Avatar)
      const isBlinking = s.invincibleTimer > 0 && Math.floor(s.invincibleTimer / 4) % 2 === 0;
      if (!isBlinking) {
        const px = Math.floor(s.playerX);
        const py = Math.floor(s.playerY);
        const pixelScale = 1.35;

        // Draw shadow under player
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(px + 11, s.baseY + 24, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Render sprite grid
        PLAYER_GRID.forEach((row, r) => {
          row.forEach((color, c) => {
            if (color) {
              ctx.fillStyle = color;
              ctx.fillRect(
                Math.floor(px + c * pixelScale),
                Math.floor(py + r * pixelScale),
                Math.ceil(pixelScale),
                Math.ceil(pixelScale)
              );
            }
          });
        });
      }

      // In-game HUD
      ctx.fillStyle = "#0c0c14";
      ctx.fillRect(0, 0, W, 22);
      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(W, 22);
      ctx.stroke();

      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.fillStyle = "#fde047";
      ctx.fillText(`SCORE:${String(s.score).padStart(5, "0")}`, 6, 15);

      // Lives
      let hearts = "";
      for (let i = 0; i < s.lives; i++) hearts += "❤ ";
      ctx.fillStyle = "#ff2ec4";
      ctx.fillText(hearts, 160, 15);

      // Pulse Meter
      if (s.pulseCooldown <= 0) {
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("[B]PULSE:READY", 215, 15);
      } else {
        ctx.fillStyle = "#64748b";
        ctx.fillText(`[B]:${Math.ceil(s.pulseCooldown / 60)}s`, 245, 15);
      }

      // OVERLAY SCREENS
      if (s.gameState === "PAUSED") {
        ctx.fillStyle = "rgba(12, 12, 20, 0.75)";
        ctx.fillRect(0, 22, W, H - 22);
        ctx.font = "12px 'Press Start 2P', monospace";
        ctx.fillStyle = "#fde047";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", W / 2, 95);
        ctx.font = "7px 'Press Start 2P', monospace";
        ctx.fillStyle = "#4ade80";
        ctx.fillText("PRESS [START] OR [P] TO RESUME", W / 2, 120);
        ctx.textAlign = "left";
      } else if (s.gameState === "GAMEOVER") {
        ctx.fillStyle = "rgba(12, 12, 20, 0.85)";
        ctx.fillRect(0, 22, W, H - 22);

        ctx.font = "13px 'Press Start 2P', monospace";
        ctx.fillStyle = "#ff2ec4";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", W / 2, 80);

        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillStyle = "#fde047";
        ctx.fillText(`FINAL SCORE: ${s.score}`, W / 2, 105);

        ctx.fillStyle = "#4ade80";
        ctx.fillText(`BEST SCORE: ${Math.max(s.score, highScore)}`, W / 2, 125);

        ctx.fillStyle = "#ffffff";
        ctx.fillText("PRESS [A] OR [SPACE] TO RETRY", W / 2, 155);
        ctx.textAlign = "left";
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [highScore, onXpGain, playSfx, onStateChange]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        width={320}
        height={220}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated",
          background: "#0c0c16",
        }}
      />

      {/* Screen CRT Scanline Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 4px, 6px 100%",
        }}
      />
    </div>
  );
}
