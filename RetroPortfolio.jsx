import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Figma,
  PenTool,
  Image,
  Box,
  Clapperboard,
  Paintbrush,
  Github,
  Mail,
  Linkedin,
  ExternalLink,
  Star,
  Cloud,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA — edit this section to make the portfolio yours              */
/* ------------------------------------------------------------------ */

const PLAYER = {
  name: "Alex Rivera",
  role: "UI / UX & Visual Designer",
  mission:
    "Create thoughtful, intuitive and delightful designs that turn hard problems into simple interfaces.",
  status: "Ready to explore, build, and win.",
};

const TOOLS = [
  { name: "Figma", icon: Figma },
  { name: "Illustrator", icon: PenTool },
  { name: "Photoshop", icon: Image },
  { name: "Blender", icon: Box },
  { name: "After Effects", icon: Clapperboard },
  { name: "Procreate", icon: Paintbrush },
];

const SKILLS = [
  "User Interface Design (UI)",
  "User Research",
  "Design Thinking",
  "Prototyping",
  "Usability Testing",
  "Visual Design",
  "Interaction Design",
];

const EDUCATION = {
  degree: "B.Des in Communication Design",
  school: "State University of Design",
  years: "2021 – 2025",
};

const MISSIONS = [
  {
    tier: "Side Quest",
    title: "Nimbus — Weather App Redesign",
    desc: "Rebuilt a cluttered weather app into a calm, glanceable experience with a new icon system.",
    stack: ["Figma", "Prototyping", "Design System"],
    color: "#4ade80",
  },
  {
    tier: "Boss Battle",
    title: "Fintrack — Banking Dashboard",
    desc: "Led end-to-end UX for a personal finance dashboard, cutting onboarding drop-off by 32%.",
    stack: ["User Research", "UI Design", "Usability Testing"],
    color: "#ff2ec4",
  },
  {
    tier: "Final Boss",
    title: "Orbit — Design System",
    desc: "Built a component library and token system adopted across 6 product teams.",
    stack: ["Design Systems", "Figma", "Documentation"],
    color: "#fbbf24",
  },
  {
    tier: "Side Quest",
    title: "Loop — Habit Tracker",
    desc: "A playful mobile app that gamifies daily habits with streaks, XP, and rewards.",
    stack: ["Mobile UI", "Motion", "Illustration"],
    color: "#4ade80",
  },
];

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhavi-tiwari-28061a329" },
  { icon: Mail, label: "Email", href: "mailto:vaibhavitiwari2021@gmail.com" },
];

/* ------------------------------------------------------------------ */
/*  PIXEL AVATAR — hand-authored sprite drawn on a CSS grid            */
/* ------------------------------------------------------------------ */

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

function buildAvatarGrid() {
  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(null));
  SPANS.forEach(([row, start, end, key]) => {
    if (grid[row]) {
      for (let c = start; c <= end; c++) grid[row][c] = PALETTE[key];
    }
  });
  return grid;
}

const AVATAR_GRID = buildAvatarGrid();

function PixelAvatar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_H}, 1fr)`,
        width: "100%",
        height: "100%",
        aspectRatio: `${GRID_W} / ${GRID_H}`,
        imageRendering: "pixelated",
      }}
    >
      {AVATAR_GRID.flatMap((row, r) =>
        row.map((color, c) => (
          <div
            key={`${r}-${c}`}
            style={{ background: color || "transparent" }}
          />
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL UI PIECES                                                   */
/* ------------------------------------------------------------------ */

function PixelWindow({ title, accent = "#ff2ec4", children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        border: `3px solid ${accent}`,
        boxShadow: `4px 4px 0 ${accent}55, 0 0 0 3px #0c0c14`,
        background: "#161622",
        borderRadius: 2,
      }}
    >
      <div
        style={{
          background: accent,
          color: "#0c0c14",
          padding: "6px 10px",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{title}</span>
        <span style={{ display: "flex", gap: 4 }}>
          <span style={{ width: 8, height: 8, background: "#0c0c14" }} />
        </span>
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function FloatingBits() {
  const stars = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: (i * 71) % 100,
    top: (i * 37) % 100,
    delay: (i % 7) * 0.6,
    size: 4 + (i % 3) * 3,
  }));
  const clouds = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: 8 + i * 20,
    delay: i * 3,
    dir: i % 2 === 0 ? 1 : -1,
    size: 26 + (i % 2) * 10,
  }));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {stars.map((s) => (
        <Star
          key={s.id}
          size={s.size}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            color: "#fde047",
            fill: "#fde047",
            animation: `twinkle 2.4s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {clouds.map((c) => (
        <Cloud
          key={c.id}
          size={c.size}
          style={{
            position: "absolute",
            top: `${c.top}%`,
            left: c.dir > 0 ? "-10%" : "110%",
            color: "#ff9ecf",
            opacity: 0.5,
            animation: `drift${c.dir > 0 ? "R" : "L"} ${22 + c.id * 4
              }s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                          */
/* ------------------------------------------------------------------ */

export default function RetroPortfolio() {
  const [soundOn, setSoundOn] = useState(false);
  const [xp, setXp] = useState(62);
  const audioCtxRef = useRef(null);
  const missionsRef = useRef(null);
  const skillsRef = useRef(null);

  const playBeep = useCallback(
    (freq = 440, duration = 0.09) => {
      if (!soundOn) return;
      try {
        const ctx =
          audioCtxRef.current ||
          (audioCtxRef.current = new (window.AudioContext ||
            window.webkitAudioContext)());
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + duration
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        /* audio unavailable, ignore */
      }
    },
    [soundOn]
  );

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        playBeep(660, 0.12);
        scrollTo(missionsRef);
      }
      if (e.key.toLowerCase() === "m") {
        playBeep(500, 0.08);
        setSoundOn((s) => !s);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playBeep]);

  useEffect(() => {
    const id = setInterval(() => {
      setXp((x) => (x >= 100 ? 100 : x + 1));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const fontFace = {
    pixel: "'Press Start 2P', monospace",
    mono: "'VT323', monospace",
  };

  return (
    <div
      style={{
        background: "#0c0c14",
        color: "#e9e6f5",
        minHeight: "100vh",
        fontFamily: fontFace.mono,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        @keyframes twinkle { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes driftR { 0%{transform:translateX(0)} 100%{transform:translateX(140vw)} }
        @keyframes driftL { 0%{transform:translateX(0)} 100%{transform:translateX(-140vw)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes scanline { 0%{background-position-y:0} 100%{background-position-y:8px} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .pixel-btn { transition: transform .12s ease, box-shadow .12s ease; cursor:pointer; }
        .pixel-btn:hover { transform: translate(-2px,-2px); }
        .pixel-btn:active { transform: translate(1px,1px); }
        .mission-card { transition: transform .15s ease; }
        .mission-card:hover { transform: translateY(-6px); }
        ::selection { background:#ff2ec4; color:#0c0c14; }
      `}</style>

      {/* HUD */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0c0c14",
          borderBottom: "3px solid #22c55e",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: fontFace.pixel, fontSize: 9, color: "#ff2ec4" }}>
            XP · UI/UX LV.03
          </span>
          <div
            style={{
              width: 90,
              height: 10,
              border: "2px solid #4ade80",
              background: "#0c0c14",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${xp}%`,
                background: "#4ade80",
                transition: "width .6s linear",
              }}
            />
          </div>
        </div>

        <span
          style={{
            fontFamily: fontFace.pixel,
            fontSize: 9,
            color: "#fde047",
            textAlign: "center",
          }}
        >
          PLAYER 01
        </span>

        <button
          className="pixel-btn"
          onClick={() => {
            setSoundOn((s) => !s);
            playBeep(500, 0.08);
          }}
          aria-label="Toggle sound effects"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#161622",
            border: "2px solid #ff2ec4",
            color: "#ff2ec4",
            padding: "6px 10px",
            fontFamily: fontFace.pixel,
            fontSize: 8,
          }}
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {soundOn ? "SFX ON" : "SFX OFF"}
        </button>
      </div>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "60px 20px 80px",
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <FloatingBits />

        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <p
            style={{
              fontFamily: fontFace.pixel,
              fontSize: 10,
              color: "#4ade80",
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            LEVEL 01 — MEET THE PLAYER
          </p>
          <h1
            style={{
              fontFamily: fontFace.pixel,
              fontSize: "clamp(22px, 5vw, 40px)",
              color: "#ff2ec4",
              textShadow: "4px 4px 0 #22c55e55",
              margin: "0 0 30px",
              lineHeight: 1.4,
            }}
          >
            {PLAYER.name}
          </h1>

          <div
            style={{
              maxWidth: 380,
              margin: "0 auto",
              animation: "floaty 4s ease-in-out infinite",
            }}
          >
            <div
              style={{
                background: "#ff2ec4",
                borderRadius: 26,
                padding: "18px 18px 34px",
                boxShadow: "0 10px 0 #99145c, 0 14px 30px rgba(0,0,0,.5)",
              }}
            >
              <div
                style={{
                  background: "#12121a",
                  border: "6px solid #0c0c14",
                  borderRadius: 6,
                  padding: 14,
                }}
              >
                <div style={{ width: "60%", margin: "0 auto 10px" }}>
                  <PixelAvatar />
                </div>
                <p
                  style={{
                    fontFamily: fontFace.pixel,
                    fontSize: 8,
                    color: "#4ade80",
                    margin: "6px 0 2px",
                  }}
                >
                  {PLAYER.role}
                </p>
                <p style={{ fontSize: 15, color: "#c9c6dd", margin: 0 }}>
                  {PLAYER.mission}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  padding: "0 6px",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: "#0c0c14",
                    borderRadius: 4,
                  }}
                />
                <div style={{ display: "flex", gap: 6 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#4ade80",
                    }}
                  />
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#fde047",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            className="pixel-btn"
            onClick={() => {
              playBeep(880, 0.12);
              scrollTo(skillsRef);
            }}
            style={{
              marginTop: 34,
              fontFamily: fontFace.pixel,
              fontSize: 12,
              color: "#0c0c14",
              background: "#4ade80",
              border: "3px solid #0c0c14",
              boxShadow: "4px 4px 0 #166534",
              padding: "12px 26px",
            }}
          >
            ▶ START
          </button>

          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "#7d7a92",
              fontFamily: fontFace.mono,
            }}
          >
            press <kbd style={{ color: "#fde047" }}>SPACE</kbd> to jump to missions ·{" "}
            <kbd style={{ color: "#fde047" }}>M</kbd> to toggle sound
          </p>
        </div>
      </section>

      {/* INVENTORY */}
      <section
        ref={skillsRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "20px 20px 70px",
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: fontFace.pixel,
            fontSize: 10,
            color: "#4ade80",
            marginBottom: 22,
            textAlign: "center",
          }}
        >
          ⚔ WEAPONS &amp; INVENTORY
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          <PixelWindow title="WEAPONS MASTERY" accent="#ff2ec4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
              }}
            >
              {TOOLS.map((t) => (
                <div
                  key={t.name}
                  className="pixel-btn"
                  onMouseEnter={() => playBeep(700, 0.05)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 4px",
                    background: "#0c0c14",
                    border: "2px solid #2a2a3c",
                  }}
                >
                  <t.icon size={20} color="#fde047" />
                  <span style={{ fontSize: 12, color: "#c9c6dd", textAlign: "center" }}>
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </PixelWindow>

          <PixelWindow title="SKILLS MASTERY" accent="#4ade80">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, fontSize: 15 }}>
              {SKILLS.map((s) => (
                <li key={s} style={{ color: "#c9c6dd" }}>
                  {s}
                </li>
              ))}
            </ul>
          </PixelWindow>

          <PixelWindow title="TRAINING LOG" accent="#fde047">
            <p style={{ margin: "0 0 8px", color: "#ff2ec4", fontSize: 16 }}>
              {EDUCATION.degree}
            </p>
            <p style={{ margin: 0, color: "#c9c6dd", fontSize: 15 }}>
              {EDUCATION.school}
              <br />
              {EDUCATION.years}
            </p>
          </PixelWindow>
        </div>
      </section>

      {/* MISSIONS */}
      <section
        ref={missionsRef}
        style={{
          background: "#101018",
          borderTop: "3px dashed #ff2ec4",
          borderBottom: "3px dashed #ff2ec4",
          padding: "50px 20px 70px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: fontFace.pixel,
              fontSize: 10,
              color: "#ff2ec4",
              marginBottom: 26,
              textAlign: "center",
            }}
          >
            🗡 MISSIONS — BOSS BATTLES
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: 22,
            }}
          >
            {MISSIONS.map((m) => (
              <div
                key={m.title}
                className="mission-card"
                onMouseEnter={() => playBeep(320, 0.07)}
                style={{
                  background: "#161622",
                  border: `3px solid ${m.color}`,
                  boxShadow: `5px 5px 0 ${m.color}44`,
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: fontFace.pixel,
                    fontSize: 8,
                    color: m.color,
                    letterSpacing: 1,
                  }}
                >
                  {m.tier}
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: fontFace.pixel,
                    fontSize: 12,
                    color: "#f2f0fa",
                    lineHeight: 1.6,
                  }}
                >
                  {m.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: "#a9a6c0" }}>{m.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {m.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11,
                        background: "#0c0c14",
                        border: `1px solid ${m.color}`,
                        color: m.color,
                        padding: "3px 8px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  className="pixel-btn"
                  onClick={() => playBeep(900, 0.1)}
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: fontFace.pixel,
                    fontSize: 9,
                    color: "#0c0c14",
                    background: m.color,
                    border: "2px solid #0c0c14",
                    padding: "8px 14px",
                  }}
                >
                  VIEW QUEST <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "50px 20px 60px",
          position: "relative",
        }}
      >
        <FloatingBits />
        <p
          style={{
            fontFamily: fontFace.pixel,
            fontSize: 13,
            color: "#4ade80",
            marginBottom: 10,
            animation: "blink 1.4s step-start infinite",
          }}
        >
          CONTINUE?
        </p>
        <p style={{ color: "#a9a6c0", fontSize: 16, marginBottom: 20 }}>
          Let's build something worth leveling up for.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="pixel-btn"
              onClick={() => playBeep(600, 0.08)}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: fontFace.pixel,
                fontSize: 9,
                color: "#0c0c14",
                background: "#fde047",
                border: "2px solid #0c0c14",
                padding: "10px 14px",
                textDecoration: "none",
              }}
            >
              <s.icon size={14} /> {s.label}
            </a>
          ))}
        </div>
        <p style={{ marginTop: 30, fontSize: 12, color: "#4a4860" }}>
          © {new Date().getFullYear()} {PLAYER.name} · press start again anytime
        </p>
      </footer>
    </div>
  );
}