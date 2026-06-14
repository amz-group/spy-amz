import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#050B1F",
  bgCard: "rgba(10, 20, 50, 0.6)",
  cyan: "#00D4FF",
  violet: "#7B2FFF",
  gold: "#FFD166",
  white: "#F0F4FF",
  muted: "#8A9CC0",
  danger: "#FF4D6D",
  green: "#00E5A0",
};

const glassStyle = {
  background: "rgba(10, 20, 50, 0.55)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(0, 212, 255, 0.15)",
  borderRadius: "20px",
};

// ── Animated Hand SVG ──────────────────────────────────────────────────────────
function AnimatedHand({ size = 180, color = "#00D4FF" }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    var t = setInterval(function () {
      setFrame(function (f) { return (f + 1) % 60; });
    }, 40);
    return function () { clearInterval(t); };
  }, []);

  var wave = Math.sin((frame / 60) * Math.PI * 2);
  var fingerBend = Math.max(0, wave);
  var rotation = wave * 8;

  return (
    <svg width={size} height={size} viewBox="0 0 180 180" style={{ filter: "drop-shadow(0 0 24px " + color + "88)", transform: "rotate(" + rotation + "deg)", transition: "transform 0.04s linear" }}>
      <defs>
        <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0.7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Palm */}
      <ellipse cx="90" cy="115" rx="38" ry="42" fill="url(#hg)" filter="url(#glow)" opacity="0.95" />
      {/* Thumb */}
      <ellipse cx="50" cy="110" rx="10" ry="22" fill="url(#hg)" transform={"rotate(-30 50 110)"} opacity="0.9" />
      {/* Fingers */}
      {[62, 78, 94, 110].map(function (x, i) {
        var bendY = (fingerBend * (i === 1 || i === 2 ? 18 : 12));
        return (
          <rect key={i} x={x - 6} y={55 + bendY} width={12} height={48 - bendY} rx="6" fill="url(#hg)" opacity={0.85 + i * 0.03} />
        );
      })}
      {/* Sparkles */}
      {[0, 1, 2].map(function (i) {
        var angle = (frame / 60) * Math.PI * 2 + i * (Math.PI * 2 / 3);
        var rx = 60 + Math.sin(angle) * 6;
        var ry = 90 + Math.cos(angle) * 8;
        return (
          <circle key={i} cx={rx} cy={ry} r={3} fill={color} opacity={0.6 + Math.sin(angle) * 0.3} />
        );
      })}
    </svg>
  );
}

// ── Particles Background ───────────────────────────────────────────────────────
function ParticleBg() {
  var particles = [];
  for (var i = 0; i < 28; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      dur: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      color: i % 3 === 0 ? "#00D4FF" : i % 3 === 1 ? "#7B2FFF" : "#FFD166",
      opacity: 0.15 + Math.random() * 0.3,
    });
  }
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {/* Gradient orbs */}
      <div style={{ position: "absolute", top: "5%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,255,0.09) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,209,102,0.05) 0%, transparent 70%)", filter: "blur(60px)", transform: "translate(-50%,-50%)" }} />
      {/* Floating particles */}
      {particles.map(function (p) {
        return (
          <div key={p.id} style={{
            position: "absolute",
            left: p.x + "%",
            top: p.y + "%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: p.opacity,
            animation: "floatUp " + p.dur + "s " + p.delay + "s infinite ease-in-out alternate",
          }} />
        );
      })}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar({ activePage, onNav }) {
  var links = [
    { id: "home", label: "Home" },
    { id: "translator", label: "Translator" },
    { id: "learn", label: "Learn" },
    { id: "emergency", label: "Emergency" },
    { id: "dashboard", label: "Dashboard" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      ...glassStyle,
      borderRadius: 0,
      borderBottom: "1px solid rgba(0,212,255,0.18)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", height: 64,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={function () { onNav("home"); }}>
        <AnimatedHand size={36} color="#00D4FF" />
        <span style={{ fontWeight: 800, fontSize: 20, color: COLORS.white, letterSpacing: 1 }}>
          Sign<span style={{ color: COLORS.cyan }}>Bridge</span> <span style={{ color: COLORS.violet, fontSize: 14, fontWeight: 600 }}>AI</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(function (l) {
          return (
            <button key={l.id} onClick={function () { onNav(l.id); }} style={{
              background: activePage === l.id ? "rgba(0,212,255,0.12)" : "transparent",
              border: activePage === l.id ? "1px solid rgba(0,212,255,0.35)" : "1px solid transparent",
              color: activePage === l.id ? COLORS.cyan : COLORS.muted,
              padding: "7px 16px", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            }}>
              {l.label}
            </button>
          );
        })}
      </div>
      <button style={{
        background: "linear-gradient(135deg, #00D4FF22, #7B2FFF33)",
        border: "1px solid rgba(0,212,255,0.4)",
        color: COLORS.cyan, padding: "8px 20px", borderRadius: 10,
        cursor: "pointer", fontSize: 13, fontWeight: 700,
      }}>
        Get Started
      </button>
    </nav>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function HomePage({ onNav }) {
  var features = [
    { icon: "🤟", title: "Sign → Text", desc: "Real-time AI gesture recognition converts signs to text instantly.", color: COLORS.cyan, id: "translator" },
    { icon: "💬", title: "Text → Sign", desc: "3D avatar animates sign language from any typed sentence.", color: COLORS.violet, id: "translator" },
    { icon: "🎙️", title: "Speech → Sign", desc: "Speak naturally — watch your words transform into sign language.", color: COLORS.gold, id: "translator" },
    { icon: "📚", title: "Learn Signs", desc: "Interactive lessons with quizzes, progress tracking, and achievements.", color: COLORS.green, id: "learn" },
    { icon: "🚨", title: "Emergency Mode", desc: "One-tap critical phrases. Works offline. Saves lives.", color: COLORS.danger, id: "emergency" },
    { icon: "📊", title: "Analytics", desc: "Track your learning journey, usage stats and communication history.", color: "#FF9F43", id: "dashboard" },
  ];

  var stats = [
    { val: "98.7%", label: "Recognition Accuracy" },
    { val: "<50ms", label: "Real-time Latency" },
    { val: "500+", label: "Signs Supported" },
    { val: "12+", label: "Languages" },
  ];

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, width: "100%", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: "inline-block", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 20 }}>
              <span style={{ color: COLORS.cyan, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>🤖 AI-Powered • Real-Time • Accessible</span>
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, color: COLORS.white, lineHeight: 1.1, margin: "0 0 16px 0", letterSpacing: -1 }}>
              Communication<br />
              <span style={{ background: "linear-gradient(135deg, #00D4FF, #7B2FFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Without Barriers.</span>
            </h1>
            <p style={{ fontSize: 18, color: COLORS.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 500 }}>
              SignBridge AI uses cutting-edge computer vision and machine learning to bridge the gap between deaf and hearing communities — in real time, in any language.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={function () { onNav("translator"); }} style={{
                background: "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                border: "none", color: "#fff", padding: "14px 28px",
                borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700,
                boxShadow: "0 0 30px rgba(0,212,255,0.3)",
              }}>
                🤟 Start Translating
              </button>
              <button onClick={function () { onNav("learn"); }} style={{
                background: "transparent", border: "1px solid rgba(0,212,255,0.35)",
                color: COLORS.cyan, padding: "14px 28px", borderRadius: 12,
                cursor: "pointer", fontSize: 15, fontWeight: 600,
              }}>
                📚 Learn Sign Language
              </button>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: 24, marginTop: 48, flexWrap: "wrap" }}>
              {stats.map(function (s, i) {
                return (
                  <div key={i}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.cyan }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Hero Visual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, rgba(0,212,255,0.15), rgba(123,47,255,0.1), transparent)",
              border: "1px solid rgba(0,212,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              boxShadow: "0 0 80px rgba(0,212,255,0.12), inset 0 0 60px rgba(123,47,255,0.08)",
            }}>
              <AnimatedHand size={220} color="#00D4FF" />
              {/* Orbit rings */}
              <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px dashed rgba(0,212,255,0.15)", animation: "spin 20s linear infinite" }} />
              <div style={{ position: "absolute", inset: -44, borderRadius: "50%", border: "1px dashed rgba(123,47,255,0.1)", animation: "spinR 30s linear infinite" }} />
              {/* floating labels */}
              {[
                { text: "ASL", top: "8%", right: "-10%", c: COLORS.cyan },
                { text: "BSL", bottom: "15%", right: "-14%", c: COLORS.violet },
                { text: "ISL", bottom: "8%", left: "-10%", c: COLORS.gold },
              ].map(function (lb, i) {
                return (
                  <div key={i} style={{
                    position: "absolute", ...{ top: lb.top, right: lb.right, bottom: lb.bottom, left: lb.left },
                    background: "rgba(10,20,50,0.8)", border: "1px solid " + lb.c + "44",
                    borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: lb.c,
                  }}>{lb.text}</div>
                );
              })}
            </div>
            <div style={{ ...glassStyle, padding: "12px 20px", textAlign: "center" }}>
              <div style={{ color: COLORS.cyan, fontWeight: 700, fontSize: 14 }}>✦ HELLO — Recognized</div>
              <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Confidence: 98.4% · 12ms latency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: COLORS.cyan, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>PLATFORM FEATURES</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: COLORS.white, margin: 0 }}>Everything You Need to Connect</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {features.map(function (f, i) {
            return (
              <div key={i} onClick={function () { onNav(f.id); }} style={{
                ...glassStyle,
                padding: "28px 24px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
                onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px " + f.color + "22"; }}
                onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, " + f.color + ", transparent)" }} />
                <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.white, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.6 }}>{f.desc}</div>
                <div style={{ marginTop: 16, color: f.color, fontSize: 13, fontWeight: 600 }}>Explore →</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: COLORS.violet, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: COLORS.white, margin: 0 }}>AI Pipeline in 3 Steps</h2>
        </div>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {[
            { num: "01", title: "Capture", desc: "Camera detects your hand using MediaPipe Hands with sub-pixel precision — 21 key landmarks tracked per frame.", icon: "📸", c: COLORS.cyan },
            { num: "02", title: "Analyze", desc: "TensorFlow model classifies the gesture in <50ms, predicts sentence context, and corrects ambiguous signs automatically.", icon: "🧠", c: COLORS.violet },
            { num: "03", title: "Deliver", desc: "Translated text appears instantly. Speech synthesis reads it aloud. History is saved. All in real time.", icon: "⚡", c: COLORS.gold },
          ].map(function (step, i) {
            return (
              <div key={i} style={{ flex: 1, padding: "0 16px", position: "relative", textAlign: "center" }}>
                {i < 2 && <div style={{ position: "absolute", top: 24, left: "60%", right: "-40%", height: 1, background: "linear-gradient(90deg, " + step.c + "44, transparent)", zIndex: 0 }} />}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: step.c + "18", border: "2px solid " + step.c + "55", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, position: "relative", zIndex: 1 }}>
                  {step.icon}
                </div>
                <div style={{ color: step.c, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>{step.num}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: COLORS.white, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── TRANSLATOR PAGE ────────────────────────────────────────────────────────────
function TranslatorPage() {
  var [mode, setMode] = useState("sign-to-text");
  var [inputText, setInputText] = useState("");
  var [output, setOutput] = useState("");
  var [confidence, setConfidence] = useState(0);
  var [isProcessing, setIsProcessing] = useState(false);
  var [cameraOn, setCameraOn] = useState(false);
  var [history, setHistory] = useState([
    { from: "Hello, how are you?", to: "Sign sequence: HELLO + HOW + YOU", time: "2m ago" },
    { from: "I need help", to: "NEED + HELP", time: "5m ago" },
  ]);
  var videoRef = useRef(null);

  var modes = [
    { id: "sign-to-text", label: "🤟 Sign → Text", color: COLORS.cyan },
    { id: "text-to-sign", label: "💬 Text → Sign", color: COLORS.violet },
    { id: "speech-to-sign", label: "🎙️ Speech → Sign", color: COLORS.gold },
    { id: "conversation", label: "🔄 Conversation", color: COLORS.green },
  ];

  function handleTranslate() {
    if (!inputText.trim() && mode !== "sign-to-text") return;
    setIsProcessing(true);
    setConfidence(0);
    var timer = setInterval(function () {
      setConfidence(function (c) {
        if (c >= 97) {
          clearInterval(timer);
          setIsProcessing(false);
          var result = mode === "text-to-sign"
            ? "Avatar animating: " + inputText.split(" ").map(function (w) { return w.toUpperCase(); }).join(" → ")
            : mode === "speech-to-sign"
            ? "Listening... → " + inputText.split(" ").map(function (w) { return w.toUpperCase(); }).join(" + ")
            : "Translated: " + inputText;
          setOutput(result);
          setHistory(function (h) { return [{ from: inputText, to: result, time: "just now" }, ...h.slice(0, 9)]; });
          return 97;
        }
        return c + 3;
      });
    }, 50);
  }

  function toggleCamera() {
    setCameraOn(function (prev) {
      if (!prev) {
        if (videoRef.current) {
          navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            videoRef.current.srcObject = stream;
          }).catch(function () {});
        }
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(function (t) { t.stop(); });
          videoRef.current.srcObject = null;
        }
      }
      return !prev;
    });
  }

  return (
    <div style={{ paddingTop: 80, padding: "96px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, margin: "0 0 8px 0" }}>AI Translator</h2>
        <p style={{ color: COLORS.muted, margin: 0 }}>Real-time sign language translation powered by MediaPipe & TensorFlow</p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {modes.map(function (m) {
          return (
            <button key={m.id} onClick={function () { setMode(m.id); setOutput(""); setConfidence(0); }} style={{
              background: mode === m.id ? m.color + "22" : "transparent",
              border: "1px solid " + (mode === m.id ? m.color + "55" : "rgba(255,255,255,0.1)"),
              color: mode === m.id ? m.color : COLORS.muted,
              padding: "10px 18px", borderRadius: 10, cursor: "pointer",
              fontSize: 13, fontWeight: 700, transition: "all 0.2s",
            }}>{m.label}</button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Input Panel */}
        <div style={{ ...glassStyle, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15 }}>
              {mode === "sign-to-text" ? "📹 Camera Input" : mode === "speech-to-sign" ? "🎙️ Speech Input" : "⌨️ Text Input"}
            </div>
            {mode === "sign-to-text" && (
              <button onClick={toggleCamera} style={{
                background: cameraOn ? COLORS.danger + "22" : COLORS.cyan + "22",
                border: "1px solid " + (cameraOn ? COLORS.danger : COLORS.cyan) + "44",
                color: cameraOn ? COLORS.danger : COLORS.cyan,
                padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
              }}>{cameraOn ? "⏹ Stop" : "▶ Start Camera"}</button>
            )}
          </div>

          {mode === "sign-to-text" ? (
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#000", height: 240 }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {!cameraOn && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <AnimatedHand size={80} color={COLORS.cyan} />
                  <div style={{ color: COLORS.muted, fontSize: 13 }}>Click "Start Camera" to begin</div>
                </div>
              )}
              {cameraOn && (
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "4px 8px" }}>
                  <span style={{ color: COLORS.danger, fontSize: 10, fontWeight: 700 }}>● LIVE</span>
                </div>
              )}
              {/* Hand tracking overlay */}
              {cameraOn && (
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "6px 10px" }}>
                  <div style={{ color: COLORS.cyan, fontSize: 11, fontWeight: 700 }}>🤟 Detecting: HELLO · 21 landmarks tracked</div>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={inputText}
              onChange={function (e) { setInputText(e.target.value); }}
              placeholder={mode === "speech-to-sign" ? "Click 🎙️ to speak, or type here..." : "Enter text to translate into sign language..."}
              style={{
                width: "100%", height: 200, background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(0,212,255,0.15)", borderRadius: 10,
                color: COLORS.white, padding: 14, fontSize: 15, resize: "none",
                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
              }}
            />
          )}

          <button onClick={handleTranslate} disabled={isProcessing} style={{
            width: "100%", marginTop: 14,
            background: isProcessing ? "rgba(0,212,255,0.1)" : "linear-gradient(135deg, #00D4FF, #7B2FFF)",
            border: "none", color: "#fff", padding: "13px", borderRadius: 10,
            cursor: isProcessing ? "wait" : "pointer", fontSize: 14, fontWeight: 700,
          }}>
            {isProcessing ? "⚙️ Processing..." : "⚡ Translate Now"}
          </button>
        </div>

        {/* Output Panel */}
        <div style={{ ...glassStyle, padding: 24 }}>
          <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 16 }}>
            {mode === "sign-to-text" ? "📝 Text Output" : "🤟 Sign Animation"}
          </div>

          {isProcessing && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>AI Processing...</span>
                <span style={{ color: COLORS.cyan, fontSize: 12, fontWeight: 700 }}>{confidence}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: confidence + "%", background: "linear-gradient(90deg, #00D4FF, #7B2FFF)", borderRadius: 2, transition: "width 0.1s" }} />
              </div>
            </div>
          )}

          <div style={{ minHeight: 200, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16, position: "relative" }}>
            {output ? (
              <div>
                <div style={{ color: COLORS.white, fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{output}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: COLORS.green + "22", border: "1px solid " + COLORS.green + "44", color: COLORS.green, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                    ✓ Confidence: {confidence}%
                  </span>
                  <span style={{ background: COLORS.cyan + "15", border: "1px solid " + COLORS.cyan + "30", color: COLORS.cyan, borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>
                    ASL · {Math.floor(Math.random() * 30) + 15}ms
                  </span>
                </div>
                {mode !== "sign-to-text" && (
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", height: 100 }}>
                    <AnimatedHand size={100} color={COLORS.violet} />
                    <div style={{ marginLeft: 16 }}>
                      <div style={{ color: COLORS.violet, fontWeight: 700, fontSize: 13 }}>3D Avatar Signing</div>
                      <div style={{ color: COLORS.muted, fontSize: 11 }}>Step-by-step animation active</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, color: COLORS.muted }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
                <div style={{ fontSize: 13 }}>Translation will appear here</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {["🔊 Speak", "📋 Copy", "💾 Save", "↗ Share"].map(function (btn) {
              return (
                <button key={btn} disabled={!output} style={{
                  flex: 1, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
                  color: output ? COLORS.cyan : COLORS.muted, padding: "8px 4px", borderRadius: 8,
                  cursor: output ? "pointer" : "default", fontSize: 11, fontWeight: 600,
                }}>{btn}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ ...glassStyle, padding: 24 }}>
        <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 16 }}>📜 Translation History</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map(function (h, i) {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: 8, borderLeft: "2px solid " + COLORS.cyan + "44" }}>
                <div>
                  <div style={{ color: COLORS.white, fontSize: 13, fontWeight: 600 }}>{h.from}</div>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{h.to}</div>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{h.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LEARN PAGE ─────────────────────────────────────────────────────────────────
function LearnPage() {
  var [activeLesson, setActiveLesson] = useState(null);
  var [quizActive, setQuizActive] = useState(false);
  var [quizAnswer, setQuizAnswer] = useState(null);
  var [progress, setProgress] = useState({ alphabet: 60, numbers: 40, phrases: 20, conversation: 5 });

  var lessons = [
    { id: "alphabet", title: "Alphabet A–Z", icon: "🔤", signs: 26, done: 16, color: COLORS.cyan },
    { id: "numbers", title: "Numbers 0–20", icon: "🔢", signs: 21, done: 8, color: COLORS.violet },
    { id: "phrases", title: "Common Phrases", icon: "💬", signs: 40, done: 8, color: COLORS.gold },
    { id: "conversation", title: "Daily Conversation", icon: "🗣️", signs: 60, done: 3, color: COLORS.green },
    { id: "emergency", title: "Emergency Signs", icon: "🆘", signs: 15, done: 0, color: COLORS.danger },
    { id: "family", title: "Family & Relationships", icon: "👨‍👩‍👧", signs: 20, done: 0, color: "#FF9F43" },
  ];

  var alphabetSigns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];
  var quiz = { question: "Which sign means 'HELLO'?", options: ["Wave open hand", "Closed fist", "Point finger", "Cross arms"], correct: 0 };

  return (
    <div style={{ paddingTop: 80, padding: "96px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, margin: "0 0 8px 0" }}>Learn Sign Language</h2>
        <p style={{ color: COLORS.muted }}>Interactive lessons · AI-powered feedback · Track your progress</p>
      </div>

      {/* Overall Progress */}
      <div style={{ ...glassStyle, padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 700, color: COLORS.white, marginBottom: 16, fontSize: 15 }}>📈 Your Learning Progress</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {Object.entries(progress).map(function (entry) {
            var key = entry[0], val = entry[1];
            var label = key.charAt(0).toUpperCase() + key.slice(1);
            var colors = { alphabet: COLORS.cyan, numbers: COLORS.violet, phrases: COLORS.gold, conversation: COLORS.green };
            var c = colors[key];
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: COLORS.white, fontSize: 13, fontWeight: 600 }}>{label}</span>
                  <span style={{ color: c, fontSize: 13, fontWeight: 700 }}>{val}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                  <div style={{ height: "100%", width: val + "%", background: "linear-gradient(90deg, " + c + ", " + c + "88)", borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lessons Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
        {lessons.map(function (l) {
          var pct = Math.round((l.done / l.signs) * 100);
          return (
            <div key={l.id} onClick={function () { setActiveLesson(l.id === activeLesson ? null : l.id); }} style={{
              ...glassStyle, padding: "20px 20px", cursor: "pointer",
              border: activeLesson === l.id ? "1px solid " + l.color + "55" : "1px solid rgba(0,212,255,0.15)",
              boxShadow: activeLesson === l.id ? "0 0 20px " + l.color + "15" : "none",
              transition: "all 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{l.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.white }}>{l.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{l.done}/{l.signs} signs learned</div>
                </div>
                <div style={{ background: l.color + "22", border: "1px solid " + l.color + "44", borderRadius: 20, padding: "4px 10px", color: l.color, fontSize: 12, fontWeight: 700 }}>{pct}%</div>
              </div>
              <div style={{ marginTop: 12, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg, " + l.color + ", " + l.color + "88)", borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Lesson - Alphabet */}
      {activeLesson === "alphabet" && (
        <div style={{ ...glassStyle, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 20 }}>🔤 Alphabet Lesson — Tap a letter to see the sign</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {alphabetSigns.map(function (letter, i) {
              return (
                <div key={letter} style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: i < 16 ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.05)",
                  border: "1px solid " + (i < 16 ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 16, color: i < 16 ? COLORS.cyan : COLORS.muted,
                  cursor: "pointer", position: "relative",
                }}>
                  {letter}
                  {i < 16 && <div style={{ position: "absolute", bottom: 3, right: 4, fontSize: 7, color: COLORS.green }}>✓</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quiz Section */}
      <div style={{ ...glassStyle, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15 }}>🎯 Quick Quiz</div>
          <button onClick={function () { setQuizActive(true); setQuizAnswer(null); }} style={{
            background: COLORS.violet + "22", border: "1px solid " + COLORS.violet + "44",
            color: COLORS.violet, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          }}>Start Quiz</button>
        </div>
        {quizActive ? (
          <div>
            <div style={{ color: COLORS.white, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{quiz.question}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {quiz.options.map(function (opt, i) {
                var isCorrect = i === quiz.correct;
                var isSelected = quizAnswer === i;
                var bg = quizAnswer !== null
                  ? isCorrect ? COLORS.green + "22" : isSelected ? COLORS.danger + "22" : "rgba(0,0,0,0.2)"
                  : "rgba(0,0,0,0.2)";
                var borderC = quizAnswer !== null
                  ? isCorrect ? COLORS.green + "55" : isSelected ? COLORS.danger + "44" : "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.1)";
                return (
                  <button key={i} onClick={function () { setQuizAnswer(i); }} style={{
                    background: bg, border: "1px solid " + borderC,
                    color: quizAnswer !== null && isCorrect ? COLORS.green : COLORS.white,
                    padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                    fontSize: 14, fontWeight: isSelected || (quizAnswer !== null && isCorrect) ? 700 : 400,
                    textAlign: "left", transition: "all 0.2s",
                  }}>
                    {quizAnswer !== null && isCorrect ? "✓ " : ""}{opt}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div style={{ marginTop: 14, padding: "12px 16px", background: (quizAnswer === quiz.correct ? COLORS.green : COLORS.danger) + "15", borderRadius: 8, color: quizAnswer === quiz.correct ? COLORS.green : COLORS.danger, fontWeight: 700 }}>
                {quizAnswer === quiz.correct ? "🎉 Correct! Great job!" : "❌ Not quite — the correct answer is: " + quiz.options[quiz.correct]}
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: COLORS.muted, fontSize: 14 }}>Test your knowledge with interactive sign language quizzes. Earn points and unlock achievements!</div>
        )}
      </div>
    </div>
  );
}

// ── EMERGENCY PAGE ─────────────────────────────────────────────────────────────
function EmergencyPage() {
  var [activePhrase, setActivePhrase] = useState(null);
  var [activated, setActivated] = useState(false);

  var phrases = [
    { emoji: "🆘", text: "I need help", sign: "NEED + HELP", color: COLORS.danger, critical: true },
    { emoji: "🚑", text: "Call an ambulance", sign: "CALL + AMBULANCE", color: "#FF6B35", critical: true },
    { emoji: "🏥", text: "I need a doctor", sign: "NEED + DOCTOR", color: COLORS.gold, critical: true },
    { emoji: "📍", text: "I am lost", sign: "I + LOST", color: COLORS.violet, critical: false },
    { emoji: "👨‍👩‍👧", text: "Please contact my family", sign: "CONTACT + FAMILY", color: COLORS.cyan, critical: false },
    { emoji: "🔥", text: "There is a fire", sign: "FIRE + DANGER", color: "#FF4D4D", critical: true },
    { emoji: "💊", text: "I need my medication", sign: "NEED + MEDICINE", color: COLORS.green, critical: false },
    { emoji: "🛑", text: "Stop — I feel unsafe", sign: "STOP + UNSAFE", color: COLORS.danger, critical: true },
  ];

  return (
    <div style={{ paddingTop: 80, padding: "96px 24px 40px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <div style={{ display: "inline-block", background: COLORS.danger + "22", border: "1px solid " + COLORS.danger + "44", borderRadius: 100, padding: "6px 20px", marginBottom: 16 }}>
          <span style={{ color: COLORS.danger, fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>🚨 EMERGENCY COMMUNICATION — WORKS OFFLINE</span>
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, margin: "0 0 8px 0" }}>Emergency Mode</h2>
        <p style={{ color: COLORS.muted }}>One-touch critical communication. No internet required. Instantly recognized.</p>
      </div>

      {/* SOS Button */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <button onClick={function () { setActivated(function (v) { return !v; }); }} style={{
          width: 120, height: 120, borderRadius: "50%",
          background: activated ? COLORS.danger : "radial-gradient(circle, " + COLORS.danger + "44, " + COLORS.danger + "11)",
          border: "3px solid " + COLORS.danger + (activated ? "" : "55"),
          color: COLORS.white, fontSize: activated ? 28 : 36, fontWeight: 900,
          cursor: "pointer",
          boxShadow: activated ? "0 0 40px " + COLORS.danger + ", 0 0 80px " + COLORS.danger + "44" : "0 0 20px " + COLORS.danger + "33",
          animation: activated ? "pulse 1s infinite" : "none",
          transition: "all 0.3s",
        }}>
          {activated ? "📢" : "SOS"}
        </button>
        {activated && <div style={{ marginTop: 16, color: COLORS.danger, fontWeight: 700, fontSize: 16, animation: "blink 1s infinite" }}>⚡ EMERGENCY SIGNAL ACTIVATED</div>}
      </div>

      {/* Quick Phrases */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
        {phrases.map(function (p, i) {
          var isActive = activePhrase === i;
          return (
            <button key={i} onClick={function () { setActivePhrase(isActive ? null : i); }} style={{
              ...glassStyle,
              border: "1px solid " + (isActive ? p.color : p.color + "33"),
              background: isActive ? p.color + "22" : "rgba(10,20,50,0.55)",
              color: COLORS.white, cursor: "pointer", textAlign: "left",
              padding: 20, transition: "all 0.2s",
              boxShadow: isActive ? "0 0 20px " + p.color + "33" : "none",
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: p.critical ? p.color : COLORS.white, marginBottom: 4 }}>{p.text}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{p.sign}</div>
              {p.critical && <div style={{ marginTop: 8, color: p.color, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>⚠ CRITICAL</div>}
              {isActive && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <AnimatedHand size={40} color={p.color} />
                  <div style={{ color: p.color, fontSize: 12, fontWeight: 700 }}>Signing now...</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ ...glassStyle, padding: 20, marginTop: 24, textAlign: "center" }}>
        <div style={{ color: COLORS.muted, fontSize: 13 }}>
          🔒 <strong style={{ color: COLORS.white }}>100% Offline</strong> — Emergency phrases stored locally. No internet needed. Available in 12+ languages.
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────────
function DashboardPage() {
  var stats = [
    { label: "Total Translations", value: "1,247", icon: "🔄", color: COLORS.cyan, delta: "+12% this week" },
    { label: "Signs Learned", value: "184", icon: "📚", color: COLORS.violet, delta: "+8 today" },
    { label: "Accuracy Rate", value: "97.3%", icon: "🎯", color: COLORS.green, delta: "+0.4% this month" },
    { label: "Streak Days", value: "23", icon: "🔥", color: COLORS.gold, delta: "Personal best!" },
  ];

  var recentActivity = [
    { action: "Translated", detail: '"Good morning" → ASL', time: "2m ago", icon: "🤟" },
    { action: "Learned", detail: "Letter Q in alphabet lesson", time: "15m ago", icon: "📖" },
    { action: "Completed", detail: "Numbers quiz — 9/10 score", time: "1h ago", icon: "✅" },
    { action: "Used Emergency", detail: '"I need help" phrase', time: "3h ago", icon: "🆘" },
    { action: "Translated", detail: '"Thank you" → Text', time: "5h ago", icon: "💬" },
  ];

  var weekData = [
    { day: "Mon", count: 18 },
    { day: "Tue", count: 32 },
    { day: "Wed", count: 27 },
    { day: "Thu", count: 45 },
    { day: "Fri", count: 38 },
    { day: "Sat", count: 52 },
    { day: "Sun", count: 29 },
  ];
  var maxCount = 52;

  var topSigns = [
    { sign: "HELLO", count: 89, pct: 89 },
    { sign: "THANK YOU", count: 74, pct: 74 },
    { sign: "PLEASE", count: 61, pct: 61 },
    { sign: "HELP", count: 53, pct: 53 },
    { sign: "YES / NO", count: 47, pct: 47 },
  ];

  return (
    <div style={{ paddingTop: 80, padding: "96px 24px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, margin: "0 0 4px 0" }}>Analytics Dashboard</h2>
        <p style={{ color: COLORS.muted, margin: 0 }}>Your communication journey at a glance</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map(function (s, i) {
          return (
            <div key={i} style={{ ...glassStyle, padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, " + s.color + ", transparent)" }} />
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.color, marginTop: 6, fontWeight: 600 }}>↑ {s.delta}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Weekly Chart */}
        <div style={{ ...glassStyle, padding: 24 }}>
          <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 20 }}>📊 Translations This Week</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
            {weekData.map(function (d) {
              var h = (d.count / maxCount) * 100;
              var isToday = d.day === "Sat";
              return (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: COLORS.cyan, fontWeight: 700 }}>{d.count}</div>
                  <div style={{
                    width: "100%", height: h + "%",
                    background: isToday ? "linear-gradient(180deg, #00D4FF, #7B2FFF)" : "rgba(0,212,255,0.2)",
                    borderRadius: "4px 4px 0 0", minHeight: 4,
                    boxShadow: isToday ? "0 0 12px rgba(0,212,255,0.4)" : "none",
                  }} />
                  <div style={{ fontSize: 10, color: isToday ? COLORS.cyan : COLORS.muted, fontWeight: isToday ? 700 : 400 }}>{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Signs */}
        <div style={{ ...glassStyle, padding: 24 }}>
          <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 16 }}>🏆 Most Used Signs</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topSigns.map(function (s, i) {
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: COLORS.white, fontSize: 13, fontWeight: 600 }}>{i + 1}. {s.sign}</span>
                    <span style={{ color: COLORS.muted, fontSize: 12 }}>{s.count}x</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: s.pct + "%", background: "linear-gradient(90deg, #00D4FF, #7B2FFF)", borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ ...glassStyle, padding: 24 }}>
        <div style={{ fontWeight: 700, color: COLORS.white, fontSize: 15, marginBottom: 16 }}>🕒 Recent Activity</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {recentActivity.map(function (a, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: COLORS.cyan, fontWeight: 700, fontSize: 13 }}>{a.action}</span>
                  <span style={{ color: COLORS.white, fontSize: 13 }}> — {a.detail}</span>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 11, flexShrink: 0 }}>{a.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function SignBridgeAI() {
  var [page, setPage] = useState("home");

  var pageComponents = {
    home: <HomePage onNav={setPage} />,
    translator: <TranslatorPage />,
    learn: <LearnPage />,
    emergency: <EmergencyPage />,
    dashboard: <DashboardPage />,
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: COLORS.white, position: "relative" }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          100% { transform: translateY(-30px) scale(1.3); opacity: 0.1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinR {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px #FF4D6D, 0 0 60px #FF4D6D44; }
          50% { box-shadow: 0 0 60px #FF4D6D, 0 0 120px #FF4D6D44; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050B1F; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 3px; }
        button { font-family: inherit; }
        textarea { font-family: inherit; line-height: 1.6; }
      `}</style>

      <ParticleBg />
      <Navbar activePage={page} onNav={setPage} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {pageComponents[page]}
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid rgba(0,212,255,0.1)",
        padding: "28px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AnimatedHand size={28} color={COLORS.cyan} />
          <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.white }}>SignBridge <span style={{ color: COLORS.cyan }}>AI</span></span>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 12 }}>Breaking communication barriers with AI · Built for inclusion · Powered by MediaPipe & TensorFlow</div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Privacy", "Accessibility", "Open Source", "API"].map(function (l) {
            return <span key={l} style={{ color: COLORS.muted, fontSize: 12, cursor: "pointer" }}>{l}</span>;
          })}
        </div>
      </footer>
    </div>
  );
}
