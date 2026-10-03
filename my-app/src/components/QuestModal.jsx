import React, { useEffect } from "react";
import { ExternalLink, X, Terminal } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function QuestModal({ quest, onClose, playBeep }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!quest) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(12, 12, 20, 0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 580,
          background: "#161626",
          border: `3px solid ${quest.color}`,
          boxShadow: `0 0 25px ${quest.color}44, 0 10px 30px rgba(0,0,0,0.8)`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* MODAL HEADER */}
        <div
          style={{
            background: quest.color,
            color: "#0c0c14",
            padding: "8px 14px",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Terminal size={14} />
            <span>MISSION DOSSIER // {quest.tier.toUpperCase()}</span>
          </div>
          <button
            onClick={() => {
              playBeep?.(400, 0.08);
              onClose();
            }}
            aria-label="Close modal"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 2,
              color: "#0c0c14",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: "20px 22px" }}>
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: quest.color,
              letterSpacing: 1.5,
              display: "inline-block",
              marginBottom: 8,
            }}
          >
            OBJECTIVE CLASSIFIED
          </span>

          <h2
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: "#ffffff",
              margin: "0 0 16px",
              lineHeight: 1.4,
            }}
          >
            {quest.title}
          </h2>

          <div
            style={{
              background: "#0c0c16",
              border: "2px solid #222236",
              padding: 14,
              borderRadius: 4,
              marginBottom: 18,
            }}
          >
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 18,
                color: "#e2e0f0",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {quest.desc}
            </p>
          </div>

          {/* DETAILED HIGHLIGHTS */}
          <div style={{ marginBottom: 18 }}>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: "#4ade80",
                marginBottom: 8,
              }}
            >
              ⚔ WEAPONS / TECH ARSENAL:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quest.stack.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 15,
                    background: "#0c0c14",
                    border: `1px solid ${quest.color}`,
                    color: quest.color,
                    padding: "3px 10px",
                    borderRadius: 2,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              paddingTop: 12,
              borderTop: "2px dashed #2a2a3e",
            }}
          >
            <a
              href="https://github.com/vivi-dot-exe"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playBeep?.(800, 0.08)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: quest.color,
                color: "#0c0c14",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                padding: "10px 16px",
                border: "2px solid #0c0c14",
                textDecoration: "none",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              <FaGithub size={14} /> EXPLORE ON GITHUB <ExternalLink size={12} />
            </a>

            <button
              onClick={() => {
                playBeep?.(400, 0.08);
                onClose();
              }}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: "#9994b0",
                background: "#0c0c14",
                border: "2px solid #2a2a3e",
                padding: "10px 14px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              [ESC] RETURN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
