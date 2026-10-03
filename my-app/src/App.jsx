import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  ExternalLink,
  Star,
  Cloud,
  Code,
  Database,
  Cpu,
  Server,
  GitBranch,
  Terminal,
  Mail,
  Trophy,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import RetroGameboy from "./components/RetroGameboy";
import QuestModal from "./components/QuestModal";

/* ------------------------------------------------------------------ */
/*  DATA — Personal Portfolio Information                             */
/* ------------------------------------------------------------------ */

const PLAYER = {
  name: "Vaibhavi Tiwari",
  role: "AI/ML Engineer | Agentic AI",
  mission: "Create thoughtful, intuitive, and delightful systems that turn hard problems into simple interfaces.",
  status: "Ready to explore, build, and win.",
};

const TOOLS = [
  { name: "Python", icon: Code },
  { name: "Pandas", icon: Database },
  { name: "NumPy", icon: Cpu },
  { name: "SQL", icon: Server },
  { name: "Git / GitHub", icon: GitBranch },
  { name: "Linux CLI", icon: Terminal },
];

const SKILLS = [
  "Machine Learning & MLOps",
  "Agentic AI & Automation",
  "Data Pipelines & Wrangling",
  "Cybersecurity & Auth Systems",
  "Data Structures & Algorithms",
  "Database Management (DBMS)",
  "Network Security & Analysis",
];

const EDUCATION = {
  degree: "B.Tech in Computer Engineering",
  school: "University of Mumbai",
  years: "2024 – Present",
};

const MISSIONS = [
  {
    tier: "Boss Battle",
    title: "Cortex: Hybrid RAG Document Assistant",
    desc: "Built a full-stack document assistant combining Next.js, FastAPI, BM25 + vector search, and dynamic LLM provider routing with page-accurate citations.",
    stack: ["FastAPI", "Next.js", "ChromaDB", "BM25", "OpenAI / Ollama"],
    color: "#ff2ec4",
  },
  {
    tier: "Boss Battle",
    title: "Multi-Category Financial Expense Engine",
    desc: "Built an algorithmic bill-splitting pipeline eliminating calculation discrepancies with conditional branching and custom category logic.",
    stack: ["Python", "Math Module", "Automation"],
    color: "#4ade80",
  },
  {
    tier: "Final Boss",
    title: "NIVARAN: Semantic NLP & Geo-Clustering Engine",
    desc: "Engineered zero-shot text classification and HDBSCAN/UMAP clustering on ticket streams to automate municipal grievance triage and SLA breach alerts.",
    stack: ["Python", "FastAPI", "BERTopic", "Leaflet.js", "TypeScript"],
    color: "#fbbf24",
  },
];

const SOCIALS = [
  { icon: FaGithub, label: "GitHub", href: "https://github.com/vivi-dot-exe" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vaibhavi-tiwari-28061a329" },
  { icon: Mail, label: "Email", href: "mailto:vaibhavitiwari2021@gmail.com" },
];

/* ------------------------------------------------------------------ */
/*  PIXEL AVATAR SPRITE                                               */
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
    for (let c = start; c <= end; c++) grid[row][c] = PALETTE[key];
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
/*  PIXEL WINDOW CONTAINER                                            */
/* ------------------------------------------------------------------ */

function PixelWindow({ title, accent = "#ff2ec4", children, className = "" }) {
  return (
    <div
      className={className}
      style={{
        border: `3px solid ${accent}`,
        boxShadow: `5px 5px 0 ${accent}44, 0 0 0 3px #0c0c14`,
        background: "#161622",
        borderRadius: 3,
      }}
    >
      <div
        style={{
          background: accent,
          color: "#0c0c14",
          padding: "7px 12px",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9.5,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>{title}</span>
        <span style={{ display: "flex", gap: 5 }}>
          <span style={{ width: 8, height: 8, background: "#0c0c14" }} />
          <span style={{ width: 8, height: 8, background: "#0c0c14", opacity: 0.5 }} />
        </span>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function FloatingBits() {
  const stars = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: (i * 67) % 100,
    top: (i * 39) % 100,
    delay: (i % 7) * 0.5,
    size: 4 + (i % 3) * 3,
  }));
  const clouds = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: 8 + i * 20,
    delay: i * 3.5,
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
            animation: `twinkle 2.5s ease-in-out ${s.delay}s infinite`,
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
            opacity: 0.35,
            animation: `drift${c.dir > 0 ? "R" : "L"} ${24 + c.id * 4}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                          */
/* ------------------------------------------------------------------ */

export default function App() {
  const [soundOn, setSoundOn] = useState(false);
  const [totalXp, setTotalXp] = useState(362);
  const [activeQuest, setActiveQuest] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const audioCtxRef = useRef(null);
  const heroRef = useRef(null);
  const missionsRef = useRef(null);
  const skillsRef = useRef(null);

  // Dynamic Level based on total XP
  const playerLevel = Math.floor(totalXp / 100);
  const currentLevelProgress = totalXp % 100;

  const playBeep = useCallback(
    (freq = 440, duration = 0.09) => {
      if (!soundOn) return;
      try {
        const ctx =
          audioCtxRef.current ||
          (audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)());
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio unavailable */
      }
    },
    [soundOn]
  );

  const handleXpGain = useCallback((gained) => {
    setTotalXp((prev) => {
      const next = prev + gained;
      // Check if leveled up
      const oldLevel = Math.floor(prev / 100);
      const newLevel = Math.floor(next / 100);
      if (newLevel > oldLevel) {
        setToastMessage(`🎉 LEVEL UP! YOU ARE NOW LV.${String(newLevel).padStart(2, "0")}!`);
        setTimeout(() => setToastMessage(null), 3500);
      }
      return next;
    });
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space" && !activeQuest) {
        // Space jumps to missions if not playing
        // (Handled cleanly)
      }
      if (e.key.toLowerCase() === "m") {
        playBeep(500, 0.08);
        setSoundOn((s) => !s);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [playBeep, activeQuest]);

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
        width: "100%",
        fontFamily: fontFace.mono,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes driftR { 0%{transform:translateX(0)} 100%{transform:translateX(140vw)} }
        @keyframes driftL { 0%{transform:translateX(0)} 100%{transform:translateX(-140vw)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 10px #ff2ec444} 50%{box-shadow:0 0 22px #ff2ec488} }
        .pixel-btn { transition: transform .12s ease, box-shadow .12s ease; cursor:pointer; }
        .pixel-btn:hover { transform: translate(-2px,-2px); }
        .pixel-btn:active { transform: translate(1px,1px); }
        .mission-card { transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease; }
        .mission-card:hover { transform: translateY(-6px); box-shadow: 0 10px 24px rgba(0,0,0,0.5); }
      `}</style>

      {/* TOP FLOATING LEVEL UP NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99,
            background: "#fde047",
            color: "#0c0c14",
            padding: "10px 18px",
            border: "3px solid #0c0c14",
            boxShadow: "0 6px 0 #99145c, 0 10px 20px rgba(0,0,0,0.5)",
            fontFamily: fontFace.pixel,
            fontSize: 10,
            letterSpacing: 1,
            animation: "blink 0.4s 2",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* TOP HUD BAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0c0c14ee",
          backdropFilter: "blur(8px)",
          borderBottom: "3px solid #22c55e",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* XP & LEVEL DISPLAY */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: fontFace.pixel, fontSize: 9, color: "#ff2ec4" }}>
            XP · AI/ML LV.{String(playerLevel).padStart(2, "0")}
          </span>
          <div
            style={{
              width: 110,
              height: 12,
              border: "2px solid #4ade80",
              background: "#0c0c14",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${currentLevelProgress}%`,
                background: "linear-gradient(90deg, #22c55e, #4ade80)",
                transition: "width .4s ease-out",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: "#4ade80" }}>{currentLevelProgress}/100 XP</span>
        </div>

        {/* CENTER PLAYER TAG */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: fontFace.pixel,
              fontSize: 9,
              color: "#fde047",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Trophy size={13} color="#fde047" /> PLAYER 01: VAIBHAVI
          </span>
        </div>

        {/* SFX & NAVIGATION */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="pixel-btn"
            onClick={() => scrollTo(missionsRef)}
            style={{
              background: "#161622",
              border: "2px solid #fde047",
              color: "#fde047",
              padding: "6px 12px",
              fontFamily: fontFace.pixel,
              fontSize: 8,
            }}
          >
            MISSIONS
          </button>

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
            {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
            {soundOn ? "SFX ON" : "SFX OFF"}
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH PLAYABLE GAMEBOY */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          padding: "50px 20px 70px",
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
              marginBottom: 10,
            }}
          >
            LEVEL 01 — MEET THE PLAYER
          </p>

          <h1
            style={{
              fontFamily: fontFace.pixel,
              fontSize: "clamp(24px, 5.5vw, 42px)",
              color: "#ff2ec4",
              textShadow: "4px 4px 0 #22c55e55, 0 0 15px #ff2ec466",
              margin: "0 0 10px",
              lineHeight: 1.35,
            }}
          >
            {PLAYER.name}
          </h1>

          <p
            style={{
              fontSize: 20,
              color: "#fde047",
              fontFamily: fontFace.mono,
              margin: "0 auto 30px",
              maxWidth: 600,
            }}
          >
            {PLAYER.role}
          </p>

          {/* THE REAL PLAYABLE GAMEBOY CONSOLE */}
          <RetroGameboy
            player={PLAYER}
            pixelAvatarComponent={PixelAvatar}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
            playBeep={playBeep}
            onXpGain={handleXpGain}
          />

          {/* QUICK HERO JUMP BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginTop: 34,
              flexWrap: "wrap",
            }}
          >
            <button
              className="pixel-btn"
              onClick={() => {
                playBeep(880, 0.12);
                scrollTo(skillsRef);
              }}
              style={{
                fontFamily: fontFace.pixel,
                fontSize: 10,
                color: "#0c0c14",
                background: "#4ade80",
                border: "3px solid #0c0c14",
                boxShadow: "4px 4px 0 #166534",
                padding: "12px 22px",
              }}
            >
              ⚔ VIEW INVENTORY
            </button>

            <button
              className="pixel-btn"
              onClick={() => {
                playBeep(750, 0.12);
                scrollTo(missionsRef);
              }}
              style={{
                fontFamily: fontFace.pixel,
                fontSize: 10,
                color: "#0c0c14",
                background: "#ff2ec4",
                border: "3px solid #0c0c14",
                boxShadow: "4px 4px 0 #99145c",
                padding: "12px 22px",
              }}
            >
              🗡 BOSS BATTLES
            </button>
          </div>
        </div>
      </section>

      {/* WEAPONS & INVENTORY SECTION */}
      <section
        ref={skillsRef}
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "30px 20px 70px",
          position: "relative",
        }}
      >
        <p
          style={{
            fontFamily: fontFace.pixel,
            fontSize: 11,
            color: "#4ade80",
            marginBottom: 24,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          ⚔ WEAPONS &amp; INVENTORY
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
          }}
        >
          {/* WEAPONS MASTERY */}
          <PixelWindow title="WEAPONS MASTERY" accent="#ff2ec4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
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
                    padding: "12px 6px",
                    background: "#0c0c14",
                    border: "2px solid #2a2a3c",
                    borderRadius: 2,
                  }}
                >
                  <t.icon size={22} color="#fde047" />
                  <span style={{ fontSize: 13, color: "#c9c6dd", textAlign: "center" }}>
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </PixelWindow>

          {/* SKILLS MASTERY */}
          <PixelWindow title="SKILLS MASTERY" accent="#4ade80">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.85, fontSize: 16 }}>
              {SKILLS.map((s) => (
                <li key={s} style={{ color: "#c9c6dd" }}>
                  {s}
                </li>
              ))}
            </ul>
          </PixelWindow>

          {/* TRAINING LOG */}
          <PixelWindow title="TRAINING LOG" accent="#fde047">
            <p
              style={{
                margin: "0 0 10px",
                color: "#ff2ec4",
                fontSize: 18,
                fontFamily: fontFace.pixel,
                lineHeight: 1.4,
              }}
            >
              {EDUCATION.degree}
            </p>
            <p style={{ margin: 0, color: "#c9c6dd", fontSize: 17, lineHeight: 1.5 }}>
              {EDUCATION.school}
              <br />
              <span style={{ color: "#4ade80" }}>{EDUCATION.years}</span>
            </p>
          </PixelWindow>
        </div>
      </section>

      {/* MISSIONS — BOSS BATTLES */}
      <section
        ref={missionsRef}
        style={{
          background: "#101018",
          borderTop: "3px dashed #ff2ec4",
          borderBottom: "3px dashed #ff2ec4",
          padding: "60px 20px 80px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: fontFace.pixel,
              fontSize: 11,
              color: "#ff2ec4",
              marginBottom: 10,
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            🗡 MISSIONS — BOSS BATTLES
          </p>
          <p
            style={{
              fontSize: 16,
              color: "#a9a6c0",
              textAlign: "center",
              marginBottom: 34,
            }}
          >
            Click any mission to inspect the tactical architectural dossier.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 24,
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
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  borderRadius: 2,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: fontFace.pixel,
                      fontSize: 8.5,
                      color: m.color,
                      letterSpacing: 1,
                    }}
                  >
                    {m.tier}
                  </span>
                  <span style={{ fontSize: 13, color: "#8a86a6" }}>READY</span>
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontFamily: fontFace.pixel,
                    fontSize: 12.5,
                    color: "#f2f0fa",
                    lineHeight: 1.6,
                  }}
                >
                  {m.title}
                </h3>

                <p style={{ margin: 0, fontSize: 16, color: "#a9a6c0", lineHeight: 1.45 }}>
                  {m.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {m.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 12,
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
                  onClick={() => {
                    playBeep(900, 0.1);
                    setActiveQuest(m);
                  }}
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
                    padding: "9px 16px",
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
          padding: "60px 20px 70px",
          position: "relative",
        }}
      >
        <FloatingBits />
        <p
          style={{
            fontFamily: fontFace.pixel,
            fontSize: 14,
            color: "#4ade80",
            marginBottom: 12,
            animation: "blink 1.4s step-start infinite",
          }}
        >
          CONTINUE?
        </p>
        <p style={{ color: "#a9a6c0", fontSize: 18, marginBottom: 24 }}>
          Let's build something worth leveling up for.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn"
              onClick={() => playBeep(600, 0.08)}
              aria-label={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: fontFace.pixel,
                fontSize: 9.5,
                color: "#0c0c14",
                background: "#fde047",
                border: "2px solid #0c0c14",
                padding: "10px 18px",
                textDecoration: "none",
                borderRadius: 2,
              }}
            >
              <s.icon size={15} /> {s.label}
            </a>
          ))}
        </div>
        <p style={{ marginTop: 36, fontSize: 13, color: "#615e7a" }}>
          © {new Date().getFullYear()} {PLAYER.name} · PRESS START TO PLAY AGAIN
        </p>
      </footer>

      {/* INTERACTIVE MISSION DOSSIER MODAL */}
      <QuestModal
        quest={activeQuest}
        onClose={() => setActiveQuest(null)}
        playBeep={playBeep}
      />
    </div>
  );
}
