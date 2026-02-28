"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────
type Mode = "research" | "math";
type StatusType = "idle" | "run" | "done" | "err";

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

interface RecentItem {
  text: string;
  mode: Mode;
}

const BACKEND = "https://agentic-research.vishwajeetadkine705.workers.dev";

// ─── Helpers ──────────────────────────────
function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ResearchAgentPage() {
  const [mode, setModeState] = useState<Mode>("research");
  const [running, setRunning] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("idle");
  const [statusLabel, setStatusLabel] = useState("Ready");
  const [papers, setPapers] = useState(0);
  const [mathSolved, setMathSolved] = useState(0);
  const [diagramsTotal, setDiagramsTotal] = useState(0);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [historyState, setHistoryState] = useState<HistoryEntry[]>([]);
  const [mermaidReady, setMermaidReady] = useState(false);

  const msgsRef = useRef<HTMLDivElement>(null);
  const msgsWrapRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const diagIdRef = useRef(0);
  const mermaidRef = useRef<typeof import("mermaid") | null>(null);

  // Load mermaid once
  useEffect(() => {
    import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "DM Sans, sans-serif",
        fontSize: 13,
        flowchart: { curve: "basis", padding: 18 },
      } as Parameters<typeof m.default.initialize>[0]);
      mermaidRef.current = m.default;
      setMermaidReady(true);
    });
  }, []);

  function scrollBottom() {
    if (msgsWrapRef.current) {
      msgsWrapRef.current.scrollTop = msgsWrapRef.current.scrollHeight;
    }
  }

  function setMode(m: Mode) {
    setModeState(m);
  }

  function hint(m: Mode, text: string) {
    setMode(m);
    setInputVal(text);
    taRef.current?.focus();
  }

  function clearChat() {
    if (msgsRef.current) msgsRef.current.innerHTML = "";
    setShowWelcome(true);
    setHistoryState([]);
    setPapers(0);
    setMathSolved(0);
    setDiagramsTotal(0);
    setRecentItems([]);
    setStatusType("idle");
    setStatusLabel("Ready");
    setRunning(false);
  }

  function addRecent(text: string, m: Mode) {
    setRecentItems((prev) => {
      const next = [{ text, mode: m }, ...prev].slice(0, 5);
      return next;
    });
  }

  function cardHtml(type: "ok" | "work" | "math" | "err", text: string) {
    const cls = {
      ok: "card-ok",
      work: "card-work",
      math: "card-math",
      err: "card-err",
    };
    const icons: Record<string, string> = {
      ok: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      work: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      math: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
      err: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    };
    return `<div class="ra-card ${cls[type]||"card-ok"}">${icons[type]||""} ${text}</div>`;
  }

  function appendMsgRow(role: "user" | "agent", htmlContent: string) {
    if (!msgsRef.current) return null;
    setShowWelcome(false);
    const row = document.createElement("div");
    row.className = "ra-msg-row";
    const isAgent = role === "agent";
    row.innerHTML = `
      <div class="ra-av ${isAgent ? "ra-av-agent" : "ra-av-user"}">
        ${isAgent
          ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`
          : "Y"}
      </div>
      <div class="ra-msg-body">
        <div class="ra-msg-who">${isAgent ? "Stremini Agent" : "You"} <span class="ra-msg-time">${now()}</span></div>
        <div class="ra-msg-content">${htmlContent}</div>
      </div>`;
    msgsRef.current.appendChild(row);
    scrollBottom();
    return row;
  }

  function addThinking() {
    if (!msgsRef.current) return;
    setShowWelcome(false);
    const row = document.createElement("div");
    row.className = "ra-thinking-row";
    row.id = "ra-thinking";
    row.innerHTML = `
      <div class="ra-av ra-av-agent">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
        </svg>
      </div>
      <div class="ra-msg-body">
        <div class="ra-msg-who">Stremini Agent</div>
        <div class="ra-dots"><span></span><span></span><span></span></div>
      </div>`;
    msgsRef.current.appendChild(row);
    scrollBottom();
  }

  function removeThinking() {
    document.getElementById("ra-thinking")?.remove();
  }

  function parseContent(content: string) {
    const parts: Array<
      | { kind: "text"; txt: string }
      | { kind: "diagram"; dtype: string; title: string; code: string }
    > = [];
    const re =
      /<diagram\s+type=["']?(\w+)["']?\s+title=["']?([^"'>]*)["']?\s*>([\s\S]*?)<\/diagram>/gi;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      if (m.index > last)
        parts.push({ kind: "text", txt: content.slice(last, m.index) });
      parts.push({
        kind: "diagram",
        dtype: m[1],
        title: m[2],
        code: m[3].trim(),
      });
      last = m.index + m[0].length;
    }
    if (last < content.length)
      parts.push({ kind: "text", txt: content.slice(last) });
    return parts;
  }

  async function renderPaper(content: string, isMath: boolean) {
    const parts = parseContent(content);
    let diagramsFound = 0;

    const wrap = document.createElement("div");
    const block = document.createElement("div");
    block.className = "ra-paper-block";

    const pid = "p" + Date.now();
    const hClass = isMath ? "math" : "research";
    const hLabel = isMath ? "Math Solution" : "Research Paper";
    const hIcon = isMath
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>`;

    block.innerHTML = `
      <div class="ra-paper-hd">
        <div class="ra-paper-hd-left ${hClass}">${hIcon} ${hLabel}</div>
        <button class="ra-copy-btn" id="cpbtn-${pid}">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy
        </button>
      </div>`;

    const body = document.createElement("div");
    body.className = isMath ? "ra-paper-bd ra-math-bd" : "ra-paper-bd";
    body.id = pid;

    for (const part of parts) {
      if (part.kind === "text") {
        if (part.txt.trim()) {
          const d = document.createElement("div");
          d.className = "ra-paper-text";
          d.textContent = part.txt;
          body.appendChild(d);
        }
      } else {
        diagramsFound++;
        const dw = document.createElement("div");
        dw.className = "ra-diagram-wrap";
        dw.innerHTML = `<div class="ra-diagram-bar">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          ${part.dtype.toUpperCase()} DIAGRAM${part.title ? " — " + esc(part.title) : ""}
        </div>`;
        const dr = document.createElement("div");
        dr.className = "ra-diagram-render";
        try {
          const uid = "d" + ++diagIdRef.current + "_" + Date.now();
          const result = await mermaidRef.current!.render(uid, part.code);
          dr.innerHTML = (result as { svg: string }).svg;
        } catch (e) {
          dr.className = "ra-diagram-err";
          dr.textContent = "Diagram render error: " + (e as Error).message;
        }
        dw.appendChild(dr);
        body.appendChild(dw);
      }
    }

    block.appendChild(body);
    wrap.appendChild(block);

    setTimeout(() => {
      const btn = document.getElementById("cpbtn-" + pid);
      if (btn)
        btn.onclick = () => {
          navigator.clipboard
            .writeText(document.getElementById(pid)?.innerText || "")
            .then(() => {
              btn.textContent = "✓ Copied";
              setTimeout(
                () =>
                  (btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`),
                2000
              );
            })
            .catch(() => {});
        };
    }, 50);

    const dlRow = document.createElement("div");
    dlRow.className = "ra-dl-row";

    const dlTxt = document.createElement("button");
    dlTxt.className = "ra-dl-btn ra-dl-txt";
    dlTxt.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download .txt`;
    dlTxt.onclick = () => {
      const text = document.getElementById(pid)?.innerText || "";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = `stremini-${isMath ? "solution" : "paper"}-${Date.now()}.txt`;
      a.click();
    };
    dlRow.appendChild(dlTxt);

    if (!isMath) {
      const dlRtf = document.createElement("button");
      dlRtf.className = "ra-dl-btn ra-dl-rtf";
      dlRtf.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Download .rtf (Word)`;
      dlRtf.onclick = () => {
        const text = document.getElementById(pid)?.innerText || "";
        const safe = text
          .replace(/\\/g, "\\\\")
          .replace(/\{/g, "\\{")
          .replace(/\}/g, "\\}")
          .replace(/\n/g, "\\par\n");
        const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}\n{\\f0\\fs28 ${safe}}\n}`;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([rtf], { type: "application/rtf" }));
        a.download = `stremini-paper-${Date.now()}.rtf`;
        a.click();
      };
      dlRow.appendChild(dlRtf);
    }

    wrap.appendChild(dlRow);
    return { el: wrap, diagramsFound };
  }

  async function handleSend() {
    const query = inputVal.trim();
    if (!query || running) return;

    appendMsgRow("user", esc(query));
    addRecent(query, mode);
    const newHistory: HistoryEntry[] = [
      ...historyState,
      { role: "user", content: query },
    ];
    setHistoryState(newHistory);

    setInputVal("");
    setRunning(true);
    setStatusType("run");
    setStatusLabel(mode === "math" ? "Solving…" : "Researching…");
    addThinking();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    try {
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          mode,
          history: newHistory.slice(-10),
          iteration: 0,
        }),
      });
      data = await res.json();
    } catch (err) {
      removeThinking();
      appendMsgRow(
        "agent",
        cardHtml("err", "Network error: " + esc((err as Error).message))
      );
      setStatusType("err");
      setStatusLabel("Error");
      setRunning(false);
      return;
    }

    removeThinking();

    if (data.status === "PAPER" || data.status === "SOLUTION") {
      const isMath = data.status === "SOLUTION";
      const content = data.content || "";

      if (!msgsRef.current) return;
      setShowWelcome(false);

      const row = document.createElement("div");
      row.className = "ra-msg-row";
      row.innerHTML = `
        <div class="ra-av ra-av-agent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
          </svg>
        </div>
        <div class="ra-msg-body">
          <div class="ra-msg-who">Stremini Agent <span class="ra-msg-time">${now()}</span></div>
          <div class="ra-msg-content" id="agentSlot"></div>
        </div>`;
      msgsRef.current.appendChild(row);
      scrollBottom();

      const slot = document.getElementById("agentSlot");
      if (slot) {
        slot.innerHTML = cardHtml(
          "work",
          isMath ? "Rendering solution…" : "Rendering paper & diagrams…"
        );

        const { el, diagramsFound } = await renderPaper(content, isMath);
        slot.innerHTML = cardHtml(
          isMath ? "math" : "ok",
          isMath
            ? "Math solution complete"
            : `Research paper complete — ${diagramsFound} diagram${diagramsFound !== 1 ? "s" : ""} rendered`
        );
        slot.appendChild(el);
        scrollBottom();
      }

      if (isMath) {
        setMathSolved((n) => n + 1);
        setHistoryState((h) => [
          ...h,
          { role: "assistant", content: "Solved math problem" },
        ]);
        setStatusType("done");
        setStatusLabel("Solved");
      } else {
        setPapers((n) => n + 1);
        setDiagramsTotal((n) => n + (await renderPaper(content, false)).diagramsFound);
        setHistoryState((h) => [
          ...h,
          { role: "assistant", content: "Drafted paper: " + (data.title || "") },
        ]);
        setStatusType("done");
        setStatusLabel("Paper Ready");
      }
    } else if (data.status === "COMPLETED") {
      appendMsgRow("agent", `<p>${esc(data.solution || "")}</p>`);
      setHistoryState((h) => [
        ...h,
        { role: "assistant", content: data.solution || "" },
      ]);
      setStatusType("done");
      setStatusLabel("Done");
    } else if (data.status === "ERROR") {
      appendMsgRow("agent", cardHtml("err", esc(data.message || "Unknown error")));
      setStatusType("err");
      setStatusLabel("Error");
    } else {
      appendMsgRow("agent", cardHtml("err", "Unexpected response from agent."));
      setStatusType("err");
      setStatusLabel("Error");
    }

    setRunning(false);
  }

  const statusClsMap: Record<StatusType, string> = {
    idle: "ra-badge-idle",
    run: "ra-badge-run",
    done: "ra-badge-done",
    err: "ra-badge-err",
  };

  return (
    <>
      <style>{`
        /* ── Reset scoped to research agent ── */
        .ra-root *,
        .ra-root *::before,
        .ra-root *::after { box-sizing: border-box; }

        .ra-root {
          --ra-bg: #f7f5f2;
          --ra-surface: #fff;
          --ra-surface2: #f2f0ec;
          --ra-border: #e4e0d8;
          --ra-border2: #ece9e2;
          --ra-txt: #1a1814;
          --ra-txt2: #6b6459;
          --ra-muted: #9e9589;
          --ra-amber: #d97706;
          --ra-amber2: #b45309;
          --ra-amber-bg: #fffbf5;
          --ra-violet: #7c3aed;
          --ra-violet-bg: #f5f3ff;
          --ra-green: #059669;
          --ra-green-bg: #d1fae5;
          --ra-red: #991b1b;
          --ra-red-bg: #fee2e2;
          --ra-shadow: 0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
          --ra-shadow-md: 0 4px 14px rgba(0,0,0,.09),0 2px 6px rgba(0,0,0,.04);
          --ra-r: 10px;
          --ra-r2: 6px;
          font-family: 'DM Sans', sans-serif;
          color: var(--ra-txt);
          -webkit-font-smoothing: antialiased;
          background: var(--ra-bg);
          height: calc(100vh - 56px); /* account for sidebar top bar on mobile */
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .ra-root {
            height: 100vh;
          }
        }

        /* Layout */
        .ra-layout { display: grid; grid-template-columns: 270px 1fr; height: 100%; overflow: hidden; }
        @media(max-width: 720px) { .ra-layout { grid-template-columns: 1fr; } .ra-sidebar { display: none; } }

        /* Sidebar */
        .ra-sidebar { background: var(--ra-surface); border-right: 1px solid var(--ra-border); display: flex; flex-direction: column; overflow-y: auto; }
        .ra-sb-head { padding: 20px 18px 16px; border-bottom: 1px solid var(--ra-border2); }
        .ra-logo { display: flex; align-items: center; gap: 9px; margin-bottom: 18px; }
        .ra-logo-icon { width: 30px; height: 30px; background: var(--ra-txt); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ra-logo-name { font-family: 'Lora', Georgia, serif; font-size: 16px; font-weight: 600; letter-spacing: -.3px; }
        .ra-logo-sub { font-size: 10px; color: var(--ra-muted); text-transform: uppercase; letter-spacing: .5px; }
        .ra-sb-label { font-size: 11px; font-weight: 600; color: var(--ra-txt2); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 8px; }
        .ra-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .ra-mode-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 10px 8px; background: var(--ra-surface2); border: 1.5px solid var(--ra-border); border-radius: var(--ra-r2); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--ra-txt2); cursor: pointer; transition: all .15s; outline: none; }
        .ra-mode-btn svg { width: 17px; height: 17px; }
        .ra-mode-btn:hover { border-color: var(--ra-amber); color: var(--ra-amber); background: var(--ra-amber-bg); }
        .ra-mode-btn.on-research { border-color: var(--ra-amber); color: var(--ra-amber); background: var(--ra-amber-bg); }
        .ra-mode-btn.on-math { border-color: var(--ra-violet); color: var(--ra-violet); background: var(--ra-violet-bg); }
        .ra-sb-sec { padding: 14px 18px; border-bottom: 1px solid var(--ra-border2); }
        .ra-sb-sec:last-child { border-bottom: none; }
        .ra-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .ra-badge-idle { background: var(--ra-surface2); color: var(--ra-muted); }
        .ra-badge-run { background: #fef3c7; color: #92400e; }
        .ra-badge-done { background: var(--ra-green-bg); color: #065f46; }
        .ra-badge-err { background: var(--ra-red-bg); color: var(--ra-red); }
        .ra-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
        .ra-badge-run .ra-dot { animation: ra-pulse 1.2s infinite; }
        @keyframes ra-pulse { 0%,100%{opacity:1}50%{opacity:.3} }
        .ra-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-top: 2px; }
        .ra-stat-box { background: var(--ra-surface2); border: 1px solid var(--ra-border2); border-radius: var(--ra-r2); padding: 9px 6px; text-align: center; }
        .ra-stat-n { font-family: 'Lora', Georgia, serif; font-size: 19px; font-weight: 500; line-height: 1; }
        .ra-stat-l { font-size: 10px; color: var(--ra-muted); text-transform: uppercase; letter-spacing: .3px; margin-top: 3px; }
        .ra-recent-list { display: flex; flex-direction: column; gap: 4px; max-height: 140px; overflow-y: auto; }
        .ra-recent-item { display: flex; align-items: flex-start; gap: 7px; padding: 7px 9px; background: var(--ra-surface2); border-radius: var(--ra-r2); font-size: 12px; color: var(--ra-txt2); cursor: pointer; transition: all .12s; line-height: 1.4; }
        .ra-recent-item:hover { background: var(--ra-amber-bg); color: var(--ra-amber); }
        .ra-ri-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ra-muted); flex-shrink: 0; margin-top: 5px; }
        .ra-muted-note { font-size: 12px; color: var(--ra-muted); font-style: italic; }
        .ra-new-btn { display: flex; align-items: center; gap: 7px; width: 100%; padding: 9px 11px; background: transparent; border: 1.5px dashed var(--ra-border); border-radius: var(--ra-r2); font-family: 'DM Sans', sans-serif; font-size: 12.5px; color: var(--ra-txt2); cursor: pointer; transition: all .15s; }
        .ra-new-btn:hover { border-color: var(--ra-amber); color: var(--ra-amber); background: var(--ra-amber-bg); }

        /* Main */
        .ra-main { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--ra-bg); }
        .ra-topbar { padding: 12px 24px; background: var(--ra-bg); border-bottom: 1px solid var(--ra-border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .ra-tl { display: flex; align-items: center; gap: 10px; }
        .ra-mode-pill { display: flex; align-items: center; gap: 6px; padding: 4px 11px; border: 1px solid var(--ra-border); border-radius: 20px; font-size: 12px; font-weight: 500; background: var(--ra-surface); box-shadow: var(--ra-shadow); }
        .ra-mode-pill.research { color: var(--ra-amber); border-color: #fde68a; background: var(--ra-amber-bg); }
        .ra-mode-pill.math { color: var(--ra-violet); border-color: #ddd6fe; background: var(--ra-violet-bg); }
        .ra-ghost-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; background: transparent; border: 1.5px solid var(--ra-border); border-radius: var(--ra-r2); font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; color: var(--ra-txt2); cursor: pointer; transition: all .15s; outline: none; }
        .ra-ghost-btn:hover { background: var(--ra-surface); border-color: var(--ra-muted); }

        /* Messages */
        .ra-msgs-wrap { flex: 1; overflow-y: auto; padding: 24px 0; scroll-behavior: smooth; }
        .ra-msgs { max-width: 820px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; }

        /* Welcome */
        .ra-welcome { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 360px; text-align: center; padding: 20px 0; }
        .ra-w-icon { width: 58px; height: 58px; background: var(--ra-txt); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: var(--ra-shadow-md); }
        .ra-welcome h2 { font-family: 'Lora', Georgia, serif; font-size: 24px; font-weight: 500; margin-bottom: 8px; letter-spacing: -.4px; }
        .ra-welcome p { font-size: 14px; color: var(--ra-txt2); line-height: 1.65; max-width: 420px; margin-bottom: 24px; }
        .ra-hint-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; max-width: 500px; }
        @media(max-width:480px) { .ra-hint-grid { grid-template-columns: 1fr; } }
        .ra-hint { display: flex; align-items: flex-start; gap: 10px; padding: 12px 13px; background: var(--ra-surface); border: 1px solid var(--ra-border); border-radius: var(--ra-r); text-align: left; cursor: pointer; transition: all .15s; box-shadow: var(--ra-shadow); }
        .ra-hint:hover { border-color: var(--ra-amber); background: var(--ra-amber-bg); transform: translateY(-1px); box-shadow: var(--ra-shadow-md); }
        .ra-hint.math-h:hover { border-color: var(--ra-violet); background: var(--ra-violet-bg); }
        .ra-hint-em { font-size: 19px; flex-shrink: 0; margin-top: 1px; }
        .ra-hint strong { display: block; font-size: 12px; font-weight: 500; margin-bottom: 2px; }
        .ra-hint small { font-size: 11px; color: var(--ra-muted); }

        /* Message row */
        .ra-msg-row { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--ra-border2); animation: ra-fadein .3s ease; }
        .ra-msg-row:last-child { border-bottom: none; }
        @keyframes ra-fadein { from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)} }
        .ra-av { width: 31px; height: 31px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-top: 2px; }
        .ra-av-agent { background: var(--ra-txt); color: #fff; }
        .ra-av-user { background: var(--ra-amber); color: #fff; }
        .ra-msg-body { flex: 1; min-width: 0; }
        .ra-msg-who { font-size: 12px; font-weight: 600; color: var(--ra-txt2); margin-bottom: 5px; display: flex; align-items: center; gap: 7px; }
        .ra-msg-time { font-weight: 400; font-size: 11px; color: var(--ra-muted); }
        .ra-msg-content { font-size: 14px; line-height: 1.7; color: var(--ra-txt); }

        /* Thinking */
        .ra-thinking-row { display: flex; gap: 12px; padding: 16px 0; }
        .ra-dots { display: flex; gap: 4px; align-items: center; }
        .ra-dots span { width: 6px; height: 6px; background: var(--ra-muted); border-radius: 50%; animation: ra-bonce 1.2s infinite; }
        .ra-dots span:nth-child(2) { animation-delay: .15s; }
        .ra-dots span:nth-child(3) { animation-delay: .3s; }
        @keyframes ra-bonce { 0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)} }

        /* Action cards */
        .ra-card { display: flex; align-items: center; gap: 9px; padding: 10px 13px; border-radius: var(--ra-r); margin: 4px 0; font-size: 13px; font-weight: 500; }
        .card-ok { background: var(--ra-green-bg); color: #065f46; border: 1px solid #a7f3d0; }
        .card-work { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .card-math { background: var(--ra-violet-bg); color: #5b21b6; border: 1px solid #ddd6fe; }
        .card-err { background: var(--ra-red-bg); color: var(--ra-red); border: 1px solid #fecaca; }

        /* Paper block */
        .ra-paper-block { background: var(--ra-surface); border: 1px solid var(--ra-border); border-radius: var(--ra-r); overflow: hidden; margin: 8px 0 6px; box-shadow: var(--ra-shadow); }
        .ra-paper-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid var(--ra-border); background: var(--ra-surface2); }
        .ra-paper-hd-left { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; }
        .ra-paper-hd-left.research { color: var(--ra-amber); }
        .ra-paper-hd-left.math { color: var(--ra-violet); }
        .ra-copy-btn { background: none; border: 1px solid var(--ra-border); cursor: pointer; font-size: 11px; color: var(--ra-muted); font-family: 'DM Sans', sans-serif; display: flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 4px; transition: all .15s; }
        .ra-copy-btn:hover { background: var(--ra-border); color: var(--ra-txt); }
        .ra-paper-bd { padding: 22px 26px; font-family: 'Times New Roman', Times, serif; font-size: 15px; line-height: 1.88; color: #1a1814; max-height: 560px; overflow-y: auto; }
        .ra-math-bd { font-family: 'DM Mono', 'Courier New', monospace; font-size: 13px; line-height: 1.85; background: #fafaf9; }
        .ra-paper-text { white-space: pre-wrap; word-break: break-word; }

        /* Diagram */
        .ra-diagram-wrap { margin: 14px 0; background: #fafaf8; border: 1px solid var(--ra-border); border-radius: var(--ra-r2); overflow: hidden; }
        .ra-diagram-bar { display: flex; align-items: center; gap: 7px; padding: 7px 13px; background: var(--ra-surface2); border-bottom: 1px solid var(--ra-border); font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: var(--ra-txt2); text-transform: uppercase; letter-spacing: .4px; }
        .ra-diagram-render { padding: 18px; display: flex; justify-content: center; overflow-x: auto; min-height: 60px; }
        .ra-diagram-render svg { max-width: 100%; height: auto; }
        .ra-diagram-err { padding: 12px 16px; font-family: 'DM Mono', monospace; font-size: 11.5px; color: var(--ra-red); background: var(--ra-red-bg); }

        /* Download row */
        .ra-dl-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
        .ra-dl-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 14px; border: none; border-radius: var(--ra-r2); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; }
        .ra-dl-txt { background: var(--ra-txt); color: #fff; }
        .ra-dl-txt:hover { background: #2d2a26; transform: translateY(-1px); box-shadow: var(--ra-shadow-md); }
        .ra-dl-rtf { background: #2563eb; color: #fff; }
        .ra-dl-rtf:hover { background: #1d4ed8; transform: translateY(-1px); }

        /* Input */
        .ra-input-bar { padding: 14px 24px 18px; background: var(--ra-bg); border-top: 1px solid var(--ra-border); flex-shrink: 0; }
        .ra-input-inner { max-width: 820px; margin: 0 auto; }
        .ra-input-wrap { display: flex; align-items: flex-end; gap: 9px; background: var(--ra-surface); border: 1.5px solid var(--ra-border); border-radius: 12px; padding: 8px 10px; box-shadow: var(--ra-shadow); transition: border-color .15s, box-shadow .15s; }
        .ra-input-wrap:focus-within { border-color: var(--ra-amber); box-shadow: 0 0 0 3px rgba(217,119,6,.1), var(--ra-shadow); }
        .ra-task-ta { flex: 1; border: none; background: transparent; padding: 3px; box-shadow: none; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.6; min-height: 22px; max-height: 150px; resize: none; overflow-y: auto; outline: none; color: var(--ra-txt); }
        .ra-task-ta::placeholder { color: var(--ra-muted); }
        .ra-send-btn { width: 33px; height: 33px; background: var(--ra-txt); border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; flex-shrink: 0; }
        .ra-send-btn:hover { background: #2d2a26; transform: scale(1.05); }
        .ra-send-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
        .ra-input-hint { margin-top: 6px; font-size: 11px; color: var(--ra-muted); text-align: center; }

        /* Scrollbar */
        .ra-root ::-webkit-scrollbar { width: 5px; height: 5px; }
        .ra-root ::-webkit-scrollbar-track { background: transparent; }
        .ra-root ::-webkit-scrollbar-thumb { background: var(--ra-border); border-radius: 3px; }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="ra-root">
        <div className="ra-layout">
          {/* ── Sidebar ── */}
          <aside className="ra-sidebar">
            <div className="ra-sb-head">
              <div className="ra-logo">
                <div className="ra-logo-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                  </svg>
                </div>
                <div>
                  <div className="ra-logo-name">Stremini</div>
                  <div className="ra-logo-sub">Research Agent</div>
                </div>
              </div>
              <div className="ra-sb-label">Mode</div>
              <div className="ra-mode-grid">
                <button
                  className={`ra-mode-btn ${mode === "research" ? "on-research" : ""}`}
                  onClick={() => setMode("research")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                  </svg>
                  Research
                </button>
                <button
                  className={`ra-mode-btn ${mode === "math" ? "on-math" : ""}`}
                  onClick={() => setMode("math")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="19" y1="5" x2="5" y2="19"/>
                    <circle cx="6.5" cy="6.5" r="2.5"/>
                    <circle cx="17.5" cy="17.5" r="2.5"/>
                  </svg>
                  Math
                </button>
              </div>
            </div>

            <div className="ra-sb-sec">
              <div className="ra-sb-label">Status</div>
              <div className={`ra-badge ${statusClsMap[statusType]}`}>
                <span className="ra-dot" />
                {statusLabel}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--ra-muted)" }}>
                {mode === "research"
                  ? "Research — drafts full papers with diagrams"
                  : "Math — solves problems step by step"}
              </div>
            </div>

            <div className="ra-sb-sec">
              <div className="ra-sb-label">Session Stats</div>
              <div className="ra-stat-row">
                <div className="ra-stat-box">
                  <div className="ra-stat-n">{papers}</div>
                  <div className="ra-stat-l">Papers</div>
                </div>
                <div className="ra-stat-box">
                  <div className="ra-stat-n">{mathSolved}</div>
                  <div className="ra-stat-l">Solved</div>
                </div>
                <div className="ra-stat-box">
                  <div className="ra-stat-n">{diagramsTotal}</div>
                  <div className="ra-stat-l">Diagrams</div>
                </div>
              </div>
            </div>

            <div className="ra-sb-sec" style={{ flex: 1 }}>
              <div className="ra-sb-label">Recent</div>
              <div className="ra-recent-list">
                {recentItems.length === 0 ? (
                  <div className="ra-muted-note">No queries yet</div>
                ) : (
                  recentItems.map((item, i) => (
                    <div
                      key={i}
                      className="ra-recent-item"
                      onClick={() => hint(item.mode, item.text)}
                    >
                      <div className="ra-ri-dot" />
                      {item.text.slice(0, 55)}
                      {item.text.length > 55 ? "…" : ""}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="ra-sb-sec">
              <button className="ra-new-btn" onClick={clearChat}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New session
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="ra-main">
            <div className="ra-topbar">
              <div className="ra-tl">
                <div className={`ra-mode-pill ${mode}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {mode === "research" ? (
                      <>
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                      </>
                    ) : (
                      <>
                        <line x1="19" y1="5" x2="5" y2="19"/>
                        <circle cx="6.5" cy="6.5" r="2.5"/>
                        <circle cx="17.5" cy="17.5" r="2.5"/>
                      </>
                    )}
                  </svg>
                  <span>{mode === "research" ? "Research Mode" : "Math Mode"}</span>
                </div>
              </div>
              <button className="ra-ghost-btn" onClick={clearChat}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
                Clear
              </button>
            </div>

            <div className="ra-msgs-wrap" ref={msgsWrapRef}>
              <div className="ra-msgs" ref={msgsRef}>
                {showWelcome && (
                  <div className="ra-welcome">
                    <div className="ra-w-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" width="30" height="30">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                      </svg>
                    </div>
                    <h2>Research &amp; Math Agent</h2>
                    <p>Write complete academic papers or solve math problems step-by-step. Papers include auto-generated diagrams — flowcharts, timelines, mindmaps and more.</p>
                    <div className="ra-hint-grid">
                      <div
                        className="ra-hint"
                        onClick={() => hint("research", "Write a research paper on the impact of large language models on scientific discovery")}
                      >
                        <div className="ra-hint-em">📄</div>
                        <div><strong>Research Paper</strong><small>Full paper + auto diagrams</small></div>
                      </div>
                      <div
                        className="ra-hint"
                        onClick={() => hint("research", "Write a comprehensive paper on quantum computing and cryptographic implications")}
                      >
                        <div className="ra-hint-em">🔬</div>
                        <div><strong>Scientific Review</strong><small>Literature review &amp; analysis</small></div>
                      </div>
                      <div
                        className="ra-hint math-h"
                        onClick={() => hint("math", "Solve the integral of x squared times e to the x, dx, using integration by parts")}
                      >
                        <div className="ra-hint-em">∫</div>
                        <div><strong>Calculus Problem</strong><small>Step-by-step solution</small></div>
                      </div>
                      <div
                        className="ra-hint math-h"
                        onClick={() => hint("math", "Prove that the square root of 2 is irrational")}
                      >
                        <div className="ra-hint-em">📐</div>
                        <div><strong>Mathematical Proof</strong><small>Rigorous formal proof</small></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="ra-input-bar">
              <div className="ra-input-inner">
                <div className="ra-input-wrap">
                  <textarea
                    ref={taRef}
                    id="ta"
                    className="ra-task-ta"
                    rows={1}
                    placeholder={
                      mode === "research"
                        ? "Enter a research topic or question…"
                        : "Enter a math problem or proof…"
                    }
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 150) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button
                    className="ra-send-btn"
                    disabled={running || !mermaidReady}
                    onClick={handleSend}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                      <line x1="12" y1="19" x2="12" y2="5"/>
                      <polyline points="5 12 12 5 19 12"/>
                    </svg>
                  </button>
                </div>
                <div className="ra-input-hint">
                  Enter to send · Shift+Enter for new line · Papers include auto-generated diagrams
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
