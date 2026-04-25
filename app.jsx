/* Sokki landing — main React app
 * Loaded as Babel JSX. Uses window.SOKKI_I18N from i18n.js
 */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const STORAGE_LANG = "sokki.lang";

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved === "en" || saved === "zh") return saved;
  } catch (e) {}
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  return "en";
}

/* ---------- Hero ---------- */

function Sparkles() {
  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      const delay = (i * 0.22) % 3.2;
      const cls = i % 3 === 0 ? "s2" : i % 5 === 0 ? "s3" : "";
      const top = 50 + (Math.sin(i) * 22);
      const left = 50 + (Math.cos(i * 1.3) * 8);
      arr.push({ delay, cls, top, left });
    }
    return arr;
  }, []);
  return (
    <div className="sparkles" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className={`sparkle ${d.cls}`}
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Live demo input — type :email and watch it expand */

const SNIPPETS = {
  ":email": "sorrycc@gmail.com",
  ":sig": "— Chen Cheng / sorrycc",
  ":now": new Date().toISOString().slice(0, 16).replace("T", " "),
  ":addr": "1 Infinite Loop, Cupertino, CA",
  ":shrug": "¯\\_(ツ)_/¯",
  ":dash": "—",
  ":arrow": "→",
  ":tm": "™",
};

function LiveDemo({ t }) {
  const [val, setVal] = useState("");
  const [pulse, setPulse] = useState(0);
  const taRef = useRef(null);

  // Build a regex that matches any known trigger
  const triggerRe = useMemo(() => {
    const keys = Object.keys(SNIPPETS)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length); // longest first
    return new RegExp("(" + keys.join("|") + ")", "g");
  }, []);

  const handleChange = (e) => {
    const el = e.target;
    const raw = el.value;
    const cursor = el.selectionStart;

    // Look at text up to cursor for any trigger that just completed
    const before = raw.slice(0, cursor);
    const after = raw.slice(cursor);

    // Find last trigger occurrence in `before`
    let lastMatch = null;
    let m;
    triggerRe.lastIndex = 0;
    while ((m = triggerRe.exec(before)) !== null) {
      lastMatch = { trig: m[0], start: m.index, end: m.index + m[0].length };
    }

    if (lastMatch && lastMatch.end === before.length) {
      // Don't expand if this trigger is a prefix of a longer trigger
      // (e.g. :em is a prefix of :email — wait until user disambiguates)
      const isPrefixOfLonger = Object.keys(SNIPPETS).some(
        k => k !== lastMatch.trig && k.startsWith(lastMatch.trig)
      );
      if (!isPrefixOfLonger) {
        const replacement = SNIPPETS[lastMatch.trig];
        const newBefore = before.slice(0, lastMatch.start) + replacement;
        const next = newBefore + after;
        setVal(next);
        setPulse(p => p + 1);
        requestAnimationFrame(() => {
          if (taRef.current) {
            const pos = newBefore.length;
            taRef.current.setSelectionRange(pos, pos);
          }
        });
        return;
      }
    }

    setVal(raw);
  };

  return (
    <div className={`demo ${pulse ? "demo-pulse" : ""}`} key={pulse}>
      <div className="demo-label">
        <span className="dots"><i/><i/><i/></span>
        <span>{t.try_label}</span>
      </div>
      <textarea
        ref={taRef}
        className="demo-input"
        rows={3}
        placeholder={t.try_placeholder}
        value={val}
        spellCheck={false}
        onChange={handleChange}
        aria-label={t.try_placeholder}
      />
      <div className="demo-bar">
        <span>{t.try_hint}</span>
        <span className="kbd">
          <b>:email</b>
        </span>
      </div>
    </div>
  );
}

/* ---------- Trigger chips ---------- */

function TriggerChips({ t, onCopy }) {
  const triggers = [":email", ":sig", ":now", ":addr", ":shrug", ":dash", ":arrow", ":tm"];
  const [copied, setCopied] = useState(null);
  const handle = async (trig) => {
    try {
      await navigator.clipboard.writeText(trig);
    } catch (e) {}
    setCopied(trig);
    onCopy(trig);
    setTimeout(() => setCopied(null), 900);
  };
  return (
    <section className="triggers shell">
      <p className="eyebrow">{t.triggers.eyebrow}</p>
      <ul className="chips">
        {triggers.map((trig) => (
          <li key={trig}>
            <button
              type="button"
              className={copied === trig ? "copied" : ""}
              onClick={() => handle(trig)}
            >
              {copied === trig ? "✓ copied" : trig}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Step pre rendering with caret in step 02 ---------- */

function StepCode({ code, idx }) {
  if (idx === 1) {
    // step 2: render with blinking caret
    const parts = code.split("|");
    return (
      <pre>
        <span>{parts[0]}</span>
        <span className="caret" />
        <span>{parts[1] || ""}</span>
      </pre>
    );
  }
  if (idx === 0) {
    // highlight ":email" and the email
    const re = /(":email")|("sorrycc@gmail\.com")/g;
    const segs = [];
    let last = 0;
    let m;
    while ((m = re.exec(code)) !== null) {
      if (m.index > last) segs.push({ t: code.slice(last, m.index) });
      segs.push({ t: m[0], a: true });
      last = m.index + m[0].length;
    }
    if (last < code.length) segs.push({ t: code.slice(last) });
    return (
      <pre>
        {segs.map((s, i) => s.a ? <span key={i} className="accent">{s.t}</span> : <span key={i}>{s.t}</span>)}
      </pre>
    );
  }
  return <pre>{code}</pre>;
}

/* ---------- Reveal on scroll ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("on");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

/* ---------- Toast ---------- */

function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef(null);
  const show = useCallback((m) => {
    setMsg(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 1600);
  }, []);
  return { msg, show };
}

/* ---------- App ---------- */

function App() {
  const [lang, setLang] = useState(detectInitialLang);
  const t = window.SOKKI_I18N[lang];
  const toast = useToast();

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = lang === "zh"
      ? "Sokki — 少敲键,多说话。"
      : "Sokki — Type less. Say more.";
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
  }, [lang, t]);

  useReveal();

  const toggle = () => setLang((l) => l === "en" ? "zh" : "en");

  // headline pieces — use serif italic for english; for zh use plain
  const Headline = () => (
    <h1>
      <span className="a">{t.hero.headline_a}</span>
      <span className="b">{t.hero.headline_b}</span>
    </h1>
  );

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <a href="#top" className="brand" aria-label="Sokki home">
            <span className="stamp">速</span>
            <span className="name">Sokki</span>
            <span className="name-zh">/ 速記</span>
          </a>
          <nav className="nav">
            <a href="#features">{t.nav.features}</a>
            <a href="#workflow">{t.nav.workflow}</a>
            <a href="#uses">{t.nav.uses}</a>
            <a href="#faq">{t.nav.faq}</a>
            <a href="https://github.com/sorrycc/Sokki">{t.nav.github}</a>
            <button
              className="lang-toggle"
              onClick={toggle}
              aria-label={t.toggle_aria}
              title={t.toggle_aria}
            >{t.toggle_label}</button>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero shell">
          <p className="kicker">{t.hero.kicker}</p>
          <Headline />
          <p className="lede">
            {t.hero.lede}
            <code className="trigger-inline">:email</code>
            {t.hero.lede_after}
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg">
              ↓ {t.hero.cta_primary}
            </a>
            <a className="btn btn-ghost" href="https://github.com/sorrycc/Sokki">
              {t.hero.cta_secondary} →
            </a>
          </div>
          <p className="meta">{t.hero.meta}</p>

          {/* Stage with keycap + live demo */}
          <div className="stage stage-grid">
            <div className="stage-inner">
              <div className="keycap-wrap">
                <div className="keycap"><span className="glyph">速</span></div>
                <Sparkles />
              </div>
              <LiveDemo t={t.hero} />
            </div>
          </div>
        </section>

        {/* Trigger chips */}
        <TriggerChips t={t} onCopy={(trig) => toast.show(`${trig} → ${SNIPPETS[trig] || ""}`)} />

        {/* Intro */}
        <section className="intro shell reveal">
          <p>
            <span className="drop">{lang === "zh" ? "速" : "S"}</span>
            {t.intro.body}
          </p>
        </section>

        {/* Features */}
        <section id="features" className="section shell reveal">
          <p className="eyebrow">{t.features.title.length > 0 ? "01 / " + (lang === "zh" ? "功能" : "Features") : ""}</p>
          <h2>{t.features.title}</h2>
          <p className="sub">{t.features.subtitle}</p>
          <ul className="feat-grid">
            {t.features.items.map((f) => (
              <li key={f.k}>
                <p className="num">{f.k}</p>
                <h3>{f.h}</h3>
                <p dangerouslySetInnerHTML={{ __html: renderInlineCode(f.p) }} />
              </li>
            ))}
          </ul>
        </section>

        {/* Workflow */}
        <section id="workflow" className="section shell reveal">
          <p className="eyebrow">02 / {t.workflow.eyebrow}</p>
          <h2>{t.workflow.title}</h2>
          <div className="flow">
            {t.workflow.steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="n">{s.n}</div>
                <div>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                  <StepCode code={s.code} idx={i} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section id="uses" className="section shell reveal">
          <p className="eyebrow">03 / {t.uses.eyebrow}</p>
          <h2>{t.uses.title}</h2>
          <div className="uses-grid">
            {t.uses.items.map((u, i) => (
              <article key={i}>
                <span className="tag">{u.tag}</span>
                <h3>{u.h}</h3>
                <p>{u.p}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section shell reveal">
          <p className="eyebrow">04 / FAQ</p>
          <h2>{t.faq.title}</h2>
          <div className="faq-list">
            {t.faq.items.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>{f.q}</summary>
                <p dangerouslySetInnerHTML={{ __html: renderInlineCode(f.a) }} />
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-final shell reveal">
          <h2>{t.cta.title}</h2>
          <p className="sub">{t.cta.sub}</p>
          <div className="cta-row" style={{ justifyContent: "center" }}>
            <a className="btn btn-primary" href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg">
              ↓ {t.hero.cta_primary}
            </a>
          </div>
          <p className="meta">{t.cta.meta}</p>
        </section>
      </main>

      <footer className="shell">
        <p>
          <span className="stamp-mark">速</span>
          {t.footer.a}
          <a href="https://x.com/chenchengpro" target="_blank" rel="noopener">{t.footer.author}</a>
          {t.footer.b}
        </p>
        <p>
          v0.0.13 · <a href="https://github.com/sorrycc/Sokki">GitHub</a> · <a href="#faq">{t.footer.privacy}</a>
        </p>
      </footer>

      <div className={`toast ${toast.msg ? "on" : ""}`} role="status" aria-live="polite">
        {toast.msg || ""}
      </div>
    </>
  );
}

function renderInlineCode(s) {
  // Wrap {{...}}, :word, and known fenced bits in <code>
  let out = String(s).replace(/\{\{[^}]+\}\}/g, (m) => `<code>${escapeHtml(m)}</code>`);
  out = out.replace(/(^|[\s,(])(:[a-zA-Z]+)/g, (_, pre, m) => `${pre}<code>${escapeHtml(m)}</code>`);
  out = out.replace(/(telemetry\.sorrycc\.dev)/g, "<code>$1</code>");
  return out;
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
