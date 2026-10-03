import React, { useState, useCallback } from "react";
import TicTacToe from "./TicTacToe";
import { Gamepad2, User } from "lucide-react";

export default function RetroGameboy({
  player,
  pixelAvatarComponent: PixelAvatar,
  soundOn,
  onXpGain,
}) {
  const [mode, setMode] = useState("PROFILE"); // "PROFILE" or "GAME"

  const [activeDpadDir, setActiveDpadDir] = useState(null);
  const [activeBtnA, setActiveBtnA] = useState(false);
  const [activeBtnB, setActiveBtnB] = useState(false);
  const [activeBtnStart, setActiveBtnStart] = useState(false);

  // Sound synthesizer for arcade SFX
  const playSfx = useCallback(
    (type) => {
      if (!soundOn) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "jump") {
          osc.type = "square";
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === "gem") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.setValueAtTime(900, now + 0.05);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
          osc.start(now);
          osc.stop(now + 0.14);
        } else if (type === "zap") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(950, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === "hit") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(60, now + 0.18);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === "levelUp") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554, now + 0.08);
          osc.frequency.setValueAtTime(659, now + 0.16);
          osc.frequency.setValueAtTime(880, now + 0.24);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === "gameOver") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.setValueAtTime(320, now + 0.1);
          osc.frequency.setValueAtTime(260, now + 0.2);
          osc.frequency.setValueAtTime(190, now + 0.3);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        } else {
          // Menu beep
          osc.type = "square";
          osc.frequency.setValueAtTime(520, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch {
        // audio unavailable
      }
    },
    [soundOn]
  );

  // D-Pad Pointer Handlers
  const handleDpadDown = (dir) => {
    setActiveDpadDir(dir);
    playSfx("menu");
  };

  const handleDpadUp = () => {
    setActiveDpadDir(null);
  };

  // Action Buttons Pointer Handlers
  const handleButtonADown = () => {
    setActiveBtnA(true);
    if (mode === "PROFILE") {
      setMode("GAME");
      playSfx("levelUp");
    }
  };

  const handleButtonAUp = () => {
    setActiveBtnA(false);
  };

  const handleButtonBDown = () => {
    setActiveBtnB(true);
  };

  const handleButtonBUp = () => {
    setActiveBtnB(false);
  };

  const handleStartDown = () => {
    setActiveBtnStart(true);
    playSfx("menu");
    if (mode === "PROFILE") {
      setMode("GAME");
      playSfx("levelUp");
    }
  };

  const handleStartUp = () => {
    setActiveBtnStart(false);
  };

  const handleSelectClick = () => {
    playSfx("menu");
    setMode((m) => (m === "PROFILE" ? "GAME" : "PROFILE"));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* Quick Mode Switcher Tabs */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          background: "#12121e",
          padding: "6px 10px",
          borderRadius: 8,
          border: "2px solid #2a2a3c",
        }}
      >
        <button
          onClick={() => {
            playSfx("menu");
            setMode("PROFILE");
          }}
          style={{
            background: mode === "PROFILE" ? "#4ade80" : "transparent",
            color: mode === "PROFILE" ? "#0c0c14" : "#a9a6c0",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <User size={13} /> BIO
        </button>

        <button
          onClick={() => {
            playSfx("levelUp");
            setMode("GAME");
          }}
          style={{
            background: mode === "GAME" ? "#ff2ec4" : "transparent",
            color: mode === "GAME" ? "#0c0c14" : "#a9a6c0",
            border: "none",
            borderRadius: 4,
            padding: "6px 14px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: mode === "GAME" ? "0 0 10px #ff2ec488" : "none",
          }}
        >
          <Gamepad2 size={14} /> TIC TAC TOE
        </button>
      </div>

      {/* GAME BOY HANDHELD CONSOLE CASING */}
      <div
        className="gameboy-casing"
        style={{
          width: "100%",
          maxWidth: 380,
          background: "linear-gradient(145deg, #ff2ec4, #d91a9f)",
          borderRadius: "28px 28px 45px 28px",
          padding: "20px 20px 30px",
          boxShadow:
            "0 12px 0 #8b0f64, 0 20px 35px rgba(0, 0, 0, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.35)",
          border: "3px solid #730a52",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* Top Cartridge Notch & Bevel Lines */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 4,
            background: "#99145c",
            borderRadius: 2,
          }}
        />

        {/* SCREEN BEZEL CONTAINER */}
        <div
          style={{
            background: "#181824",
            border: "4px solid #0e0e16",
            borderRadius: "14px 14px 28px 14px",
            padding: "16px 14px 14px",
            boxShadow: "inset 0 4px 10px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.15)",
            position: "relative",
          }}
        >
          {/* Bezel Top Bar: Power LED & Dot Matrix Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              padding: "0 4px",
            }}
          >
            {/* POWER LED */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: soundOn || mode === "GAME" ? "#22c55e" : "#ef4444",
                  boxShadow:
                    soundOn || mode === "GAME"
                      ? "0 0 8px #22c55e, 0 0 14px #22c55e"
                      : "0 0 6px #ef4444",
                  transition: "all 0.3s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: "#7e7b99",
                  letterSpacing: 0.5,
                }}
              >
                POWER
              </span>
            </div>

            {/* SCREEN TITLE */}
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 6.5,
                color: "#ff2ec4",
                letterSpacing: 1.5,
              }}
            >
              8-BIT PIPELINE ENGINE
            </span>
          </div>

          {/* ACTUAL DISPLAY SCREEN */}
          <div
            style={{
              width: "100%",
              height: 230,
              background: "#0c0c14",
              border: "3px solid #000000",
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
              boxShadow: "inset 0 0 12px rgba(0, 0, 0, 0.95)",
            }}
          >
            {mode === "GAME" ? (
              <TicTacToe
                playSfx={playSfx}
                onXpGain={onXpGain}
              />
            ) : (
              /* PROFILE VIEW — click to play TicTacToe */
              <div
                onClick={() => {
                  playSfx("levelUp");
                  setMode("GAME");
                }}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 14px",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ width: 85, height: 95, marginBottom: 8 }}>
                  <PixelAvatar />
                </div>

                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: "#4ade80",
                    margin: "0 0 4px",
                    letterSpacing: 0.5,
                  }}
                >
                  {player.role}
                </p>

                <p
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 14,
                    color: "#c9c6dd",
                    margin: "0 0 10px",
                    lineHeight: 1.25,
                    maxHeight: 40,
                    overflow: "hidden",
                  }}
                >
                  {player.mission}
                </p>

                {/* Blinking Press Start Prompt */}
                <div
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 7.5,
                    color: "#fde047",
                    background: "#1a1a2e",
                    border: "1px dashed #fde047",
                    padding: "4px 8px",
                    borderRadius: 2,
                    animation: "blink 1.2s step-start infinite",
                  }}
                >
                  ► TAP TO PLAY TIC TAC TOE ◄
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bezel Brand Label */}
          <div
            style={{
              textAlign: "center",
              marginTop: 6,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7.5,
              color: "#6b678c",
              letterSpacing: 2,
            }}
          >
            VAIBHAVI-BOY <span style={{ color: "#4ade80" }}>COLOR</span>
          </div>
        </div>

        {/* CONTROLS SECTION */}
        <div
          className="gameboy-controls"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 22,
            padding: "0 6px",
          }}
        >
          {/* DIRECTIONAL D-PAD */}
          <div
            style={{
              width: 96,
              height: 96,
              position: "relative",
            }}
          >
            {/* D-Pad Center Base */}
            <div
              style={{
                position: "absolute",
                top: 32,
                left: 32,
                width: 32,
                height: 32,
                background: "#181822",
                boxShadow: "inset 0 0 4px #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#111118",
                }}
              />
            </div>

            {/* UP BUTTON */}
            <button
              onPointerDown={() => handleDpadDown("up")}
              onPointerUp={handleDpadUp}
              onPointerLeave={handleDpadUp}
              aria-label="D-Pad Up"
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                width: 32,
                height: 34,
                background: activeDpadDir === "up" ? "#0c0c14" : "#1f1f2e",
                border: "2px solid #0c0c14",
                borderRadius: "6px 6px 0 0",
                color: "#e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                boxShadow:
                  activeDpadDir === "up"
                    ? "inset 0 2px 4px #000"
                    : "0 -2px 0 #33334d, inset 0 1px 2px rgba(255,255,255,0.2)",
                transform: activeDpadDir === "up" ? "translateY(2px)" : "none",
              }}
            >
              ▲
            </button>

            {/* DOWN BUTTON */}
            <button
              onPointerDown={() => handleDpadDown("down")}
              onPointerUp={handleDpadUp}
              onPointerLeave={handleDpadUp}
              aria-label="D-Pad Down"
              style={{
                position: "absolute",
                bottom: 0,
                left: 32,
                width: 32,
                height: 34,
                background: activeDpadDir === "down" ? "#0c0c14" : "#1f1f2e",
                border: "2px solid #0c0c14",
                borderRadius: "0 0 6px 6px",
                color: "#e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                boxShadow:
                  activeDpadDir === "down"
                    ? "inset 0 2px 4px #000"
                    : "0 3px 0 #0c0c14, inset 0 1px 2px rgba(255,255,255,0.2)",
                transform: activeDpadDir === "down" ? "translateY(2px)" : "none",
              }}
            >
              ▼
            </button>

            {/* LEFT BUTTON */}
            <button
              onPointerDown={() => handleDpadDown("left")}
              onPointerUp={handleDpadUp}
              onPointerLeave={handleDpadUp}
              aria-label="D-Pad Left"
              style={{
                position: "absolute",
                top: 32,
                left: 0,
                width: 34,
                height: 32,
                background: activeDpadDir === "left" ? "#0c0c14" : "#1f1f2e",
                border: "2px solid #0c0c14",
                borderRadius: "6px 0 0 6px",
                color: "#e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                boxShadow:
                  activeDpadDir === "left"
                    ? "inset 0 2px 4px #000"
                    : "-2px 0 0 #0c0c14, inset 0 1px 2px rgba(255,255,255,0.2)",
                transform: activeDpadDir === "left" ? "translateX(-1px)" : "none",
              }}
            >
              ◀
            </button>

            {/* RIGHT BUTTON */}
            <button
              onPointerDown={() => handleDpadDown("right")}
              onPointerUp={handleDpadUp}
              onPointerLeave={handleDpadUp}
              aria-label="D-Pad Right"
              style={{
                position: "absolute",
                top: 32,
                right: 0,
                width: 34,
                height: 32,
                background: activeDpadDir === "right" ? "#0c0c14" : "#1f1f2e",
                border: "2px solid #0c0c14",
                borderRadius: "0 6px 6px 0",
                color: "#e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                boxShadow:
                  activeDpadDir === "right"
                    ? "inset 0 2px 4px #000"
                    : "2px 0 0 #0c0c14, inset 0 1px 2px rgba(255,255,255,0.2)",
                transform: activeDpadDir === "right" ? "translateX(1px)" : "none",
              }}
            >
              ▶
            </button>
          </div>

          {/* ACTION BUTTONS (B & A) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              transform: "rotate(-22deg)",
            }}
          >
            {/* BUTTON B (Pulse/EMP) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <button
                onPointerDown={handleButtonBDown}
                onPointerUp={handleButtonBUp}
                onPointerLeave={handleButtonBUp}
                aria-label="Button B"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: activeBtnB ? "#99145c" : "#fde047",
                  border: "3px solid #0c0c14",
                  boxShadow: activeBtnB
                    ? "inset 0 2px 5px #000"
                    : "0 4px 0 #b45309, 0 6px 10px rgba(0,0,0,0.4)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  color: "#0c0c14",
                  transform: activeBtnB ? "translateY(3px)" : "none",
                }}
              >
                B
              </button>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  color: "#ffe4f4",
                }}
              >
                PULSE
              </span>
            </div>

            {/* BUTTON A (Jump/Select) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <button
                onPointerDown={handleButtonADown}
                onPointerUp={handleButtonAUp}
                onPointerLeave={handleButtonAUp}
                aria-label="Button A"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: activeBtnA ? "#166534" : "#4ade80",
                  border: "3px solid #0c0c14",
                  boxShadow: activeBtnA
                    ? "inset 0 2px 5px #000"
                    : "0 4px 0 #15803d, 0 6px 10px rgba(0,0,0,0.4)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  color: "#0c0c14",
                  transform: activeBtnA ? "translateY(3px)" : "none",
                }}
              >
                A
              </button>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  color: "#ffe4f4",
                }}
              >
                JUMP
              </span>
            </div>
          </div>
        </div>

        {/* SELECT & START BUTTONS + SPEAKER SLITS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 24,
            padding: "0 14px",
          }}
        >
          {/* SELECT & START BUTTONS */}
          <div style={{ display: "flex", gap: 16 }}>
            {/* SELECT BUTTON */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <button
                onClick={handleSelectClick}
                aria-label="Select button"
                style={{
                  width: 34,
                  height: 11,
                  background: "#1f1f2e",
                  border: "2px solid #0c0c14",
                  borderRadius: 6,
                  cursor: "pointer",
                  transform: "rotate(-25deg)",
                  boxShadow: "0 2px 0 #000",
                }}
              />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  color: "#7e0c52",
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}
              >
                SELECT
              </span>
            </div>

            {/* START BUTTON */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <button
                onPointerDown={handleStartDown}
                onPointerUp={handleStartUp}
                aria-label="Start button"
                style={{
                  width: 34,
                  height: 11,
                  background: activeBtnStart ? "#0c0c14" : "#1f1f2e",
                  border: "2px solid #0c0c14",
                  borderRadius: 6,
                  cursor: "pointer",
                  transform: "rotate(-25deg)",
                  boxShadow: activeBtnStart ? "none" : "0 2px 0 #000",
                }}
              />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 6,
                  color: "#7e0c52",
                  letterSpacing: 0.5,
                  marginTop: 2,
                }}
              >
                START
              </span>
            </div>
          </div>

          {/* SPEAKER SLITS */}
          <div
            style={{
              display: "flex",
              gap: 5,
              transform: "rotate(-28deg)",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 24,
                  background: "#730a52",
                  borderRadius: 2,
                  boxShadow: "inset 0 1px 2px #000",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CONTROLS GUIDE BANNER */}
      <div
        style={{
          marginTop: 18,
          background: "#141420",
          border: "2px dashed #4ade8055",
          borderRadius: 8,
          padding: "10px 14px",
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7.5,
            color: "#4ade80",
            marginBottom: 6,
          }}
        >
          🕹 CONTROLS GUIDE
        </p>
        <p
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: 14,
            color: "#a9a6c0",
            lineHeight: 1.4,
          }}
        >
          <span style={{ color: "#4ade80" }}>BIO</span>: View profile ·{" "}
          <span style={{ color: "#ff2ec4" }}>TIC TAC TOE</span>: Play game ·{" "}
          <span style={{ color: "#fde047" }}>CLICK cells</span>: Make move ·{" "}
          <span style={{ color: "#38bdf8" }}>WIN</span>: Earn +25 XP
        </p>
      </div>
    </div>
  );
}
