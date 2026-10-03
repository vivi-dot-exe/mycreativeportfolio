import React, { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------
   PIXEL TIC TAC TOE — playable inside the Retro Gameboy screen
   Player is X, AI is O (minimax AI)
   ------------------------------------------------------------------ */

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== null)) return { winner: "DRAW", line: [] };
  return null;
}

function minimax(board, isMaximizing) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === "O") return 10;
    if (result.winner === "X") return -10;
    return 0;
  }
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const moveVal = minimax(board, false);
      board[i] = null;
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export default function TicTacToe({ playSfx, onXpGain }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [thinking, setThinking] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [animCells, setAnimCells] = useState([]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult(null);
    setThinking(false);
    setAnimCells([]);
  }, []);

  const handleCellClick = (idx) => {
    if (!isPlayerTurn || board[idx] || result || thinking) return;
    playSfx?.("menu");
    const newBoard = [...board];
    newBoard[idx] = "X";
    setAnimCells([idx]);
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setResult(res);
      if (res.winner === "X") {
        playSfx?.("levelUp");
        onXpGain?.(25);
        setScores((s) => ({ ...s, player: s.player + 1 }));
      } else if (res.winner === "DRAW") {
        playSfx?.("gem");
        setScores((s) => ({ ...s, draws: s.draws + 1 }));
      }
      return;
    }
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (isPlayerTurn || result) return;
    setThinking(true);
    const timer = setTimeout(() => {
      const boardCopy = [...board];
      const move = getBestMove(boardCopy);
      if (move === -1) { setThinking(false); return; }
      playSfx?.("zap");
      const newBoard = [...board];
      newBoard[move] = "O";
      setAnimCells([move]);
      setBoard(newBoard);
      const res = checkWinner(newBoard);
      if (res) {
        setResult(res);
        if (res.winner === "O") {
          playSfx?.("hit");
          setScores((s) => ({ ...s, ai: s.ai + 1 }));
        } else if (res.winner === "DRAW") {
          playSfx?.("gem");
          setScores((s) => ({ ...s, draws: s.draws + 1 }));
        }
      } else {
        setIsPlayerTurn(true);
      }
      setThinking(false);
    }, 480);
    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, result, playSfx]);

  const getCellStyle = (idx) => {
    const isWinCell = result?.line?.includes(idx);
    const isHovered = hoveredCell === idx && !board[idx] && !result && isPlayerTurn;
    const isAnim = animCells.includes(idx);
    return {
      width: "100%",
      aspectRatio: "1",
      background: isWinCell
        ? (result?.winner === "X" ? "#22c55e22" : "#ff2ec422")
        : isHovered ? "#ffffff0a" : "#0c0c14",
      border: isWinCell
        ? `2px solid ${result?.winner === "X" ? "#4ade80" : "#ff2ec4"}`
        : "2px solid #2a2a3c",
      borderRadius: 4,
      cursor: (!board[idx] && !result && isPlayerTurn) ? "pointer" : "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "clamp(16px, 4.5vw, 26px)",
      fontFamily: "'Press Start 2P', monospace",
      color: board[idx] === "X" ? "#4ade80" : board[idx] === "O" ? "#ff2ec4" : "#333",
      transition: "all 0.12s ease",
      boxShadow: isWinCell
        ? `0 0 10px ${result?.winner === "X" ? "#4ade8088" : "#ff2ec488"}`
        : isHovered ? "inset 0 0 8px #ffffff15" : "none",
      transform: isAnim ? "scale(1.15)" : "scale(1)",
    };
  };

  let statusText = "";
  let statusColor = "#fde047";
  if (result) {
    if (result.winner === "X") { statusText = "YOU WIN! +25XP"; statusColor = "#4ade80"; }
    else if (result.winner === "O") { statusText = "AI WINS!"; statusColor = "#ff2ec4"; }
    else { statusText = "DRAW!"; statusColor = "#fde047"; }
  } else if (thinking) {
    statusText = "AI THINKING..."; statusColor = "#ff9ecf";
  } else if (isPlayerTurn) {
    statusText = "YOUR TURN [X]"; statusColor = "#4ade80";
  }

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "8px 10px", boxSizing: "border-box",
      background: "#0c0c14",
    }}>
      {/* SCORE BAR */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#4ade80" }}>YOU</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: "#4ade80" }}>{scores.player}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: "#a9a6c0" }}>DRAW</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#a9a6c0" }}>{scores.draws}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#ff2ec4" }}>AI</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: "#ff2ec4" }}>{scores.ai}</div>
        </div>
      </div>

      {/* STATUS */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace", fontSize: 6.5,
        color: statusColor, letterSpacing: 0.5, minHeight: 14, textAlign: "center",
        animation: result ? "blink 0.6s step-start 4" : "none",
      }}>
        {statusText}
      </div>

      {/* BOARD */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: 5, width: "100%", maxWidth: 172, flex: 1, alignContent: "center",
      }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            onMouseEnter={() => setHoveredCell(idx)}
            onMouseLeave={() => setHoveredCell(null)}
            style={getCellStyle(idx)}
            aria-label={`Cell ${idx + 1}`}
          >
            {cell === "X" ? "✕" : cell === "O" ? "○" : ""}
          </button>
        ))}
      </div>

      {/* RESET */}
      <button
        onClick={() => { playSfx?.("levelUp"); resetGame(); }}
        style={{
          marginTop: 6,
          fontFamily: "'Press Start 2P', monospace", fontSize: 6,
          color: result ? "#0c0c14" : "#a9a6c0",
          background: result ? "#fde047" : "#1a1a2e",
          border: `2px solid ${result ? "#fde047" : "#4a4a6c"}`,
          padding: "5px 12px", borderRadius: 3, cursor: "pointer",
          letterSpacing: 0.5, boxShadow: result ? "0 3px 0 #b45309" : "none",
          transition: "all 0.15s ease",
        }}
      >
        {result ? "► PLAY AGAIN" : "↺ RESET"}
      </button>
    </div>
  );
}
