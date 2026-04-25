import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SOKKI_I18N } from './i18n.js';

const STORAGE_LANG = "sokki.lang";
const STORAGE_DEMO = "sokki.demo";
const BUILD_DATE = "2026-04-22";

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved === "en" || saved === "zh") return saved;
  } catch (e) {}
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  return "en";
}

/* ---------- Slow, captioned product mockup ----------
   Phases (slowed 1.5x and now ~9s w/ pauses + captions):
     0  idle / blank
     1  typing  ":da"  (caption: "you type")
     2  filtering      (caption: "Sokki filters")
     3  Tab pressed    (caption: "Tab to expand")
     4  expanded       (caption: "expanded :daily")
     5  pause then loop
*/
function ProductMockup({ lang, t }) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let timers = [];
    const run = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setPhase(0);
      setTyped("");
      timers.push(setTimeout(() => { setTyped(":"); setPhase(1); }, 900));
      timers.push(setTimeout(() => setTyped(":d"), 1200));
      timers.push(setTimeout(() => setTyped(":da"), 1500));
      timers.push(setTimeout(() => setPhase(2), 2200));
      timers.push(setTimeout(() => setPhase(3), 3800));
      timers.push(setTimeout(() => setPhase(4), 4200));
      timers.push(setTimeout(run, 9000));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  const ALL_ROWS = [
    { trig: ":daily",  prev: "## Daily 2026-04-25 · Yesterday: …" },
    { trig: ":dash",   prev: "—" },
    { trig: ":date",   prev: "2026-04-25" },
    { trig: ":daikon", prev: "translate to Japanese", ai: true },
    { trig: ":email",  prev: "sorrycc@gmail.com" },
    { trig: ":sig",    prev: "— Chen Cheng" },
  ];
  const filtered = phase >= 2
    ? ALL_ROWS.filter(r => r.trig.startsWith(":da")).slice(0, 4)
    : ALL_ROWS.slice(0, 4);

  const showExpanded = phase >= 4;

  const captions = t.hero.captions || {};
  const captionText = phase === 0 ? captions.idle
    : phase === 1 ? captions.typing
    : phase === 2 ? captions.filter
    : phase === 3 ? captions.tab
    : captions.expanded;

  return (
    <div className="mockup-stack">
      <div className="menubar" aria-hidden="true">
        <span className="mb-apple"></span>
        <span className="mb-app">Mail</span>
        <span className="mb-item">File</span>
        <span className="mb-item">Edit</span>
        <span className="mb-spacer"></span>
        <span className="mb-tray">
          <span className="mb-tray-icon mb-su">速</span>
          <span className="mb-tray-icon">⌘</span>
          <span className="mb-time">10:24</span>
        </span>
      </div>

      <div className="mockup" aria-hidden="true">
        <div className="mp-search">
          <span className="mp-prompt">›</span>
          <span className="mp-query">{typed || " "}</span>
          {!showExpanded && <span className="mp-caret"></span>}
        </div>

        {!showExpanded ? (
          <ul className="mp-list">
            {filtered.map((r, i) => (
              <li key={r.trig}
                  className={`mp-row ${i === 0 ? "mp-sel" : ""} ${phase === 3 && i === 0 ? "mp-tabhit" : ""}`}>
                <span className="mp-trig">{r.trig}</span>
                <span className="mp-prev">
                  {r.ai && <span className="mp-ai">AI</span>}
                  {r.prev}
                </span>
                {i === 0 && <span className="mp-kbd">⇥</span>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mp-expanded">
            <div className="mp-exp-label">{lang === "zh" ? "已展开 :daily" : "Expanded :daily"}</div>
            <pre>{`## Daily 2026-04-25
Yesterday: shipped v0.0.13
Today:
Blockers:`}</pre>
          </div>
        )}

        <div className="mp-foot">
          <span className="mp-count">
            {phase >= 2
              ? (lang === "zh" ? "4 / 24 匹配" : "4 of 24 matches")
              : (lang === "zh" ? "24 个 snippet" : "24 snippets loaded")}
          </span>
          <span className="mp-kbd-strip">
            <b>↑↓</b> · <b>⇥</b> · <b>↵</b>
          </span>
        </div>
      </div>

      <div className="mockup-caption" key={phase}>
        <span className="mc-dot"></span>
        <span className="mc-text">{captionText}</span>
        <span className="mc-phase">{phase === 0 ? "—" : `${phase}/4`}</span>
      </div>
    </div>
  );
}

/* ---------- Live demo ---------- */

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

function LiveDemo({ t, externalFill }) {
  const [val, setVal] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DEMO);
      if (saved) return saved;
    } catch (e) {}
    return t.try_prefill || "";
  });
  const [pulse, setPulse] = useState(0);
  const [flash, setFlash] = useState(null);
  const taRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_DEMO, val); } catch (e) {}
  }, [val]);

  const triggerRe = useMemo(() => {
    const keys = Object.keys(SNIPPETS)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .sort((a, b) => b.length - a.length);
    return new RegExp("(" + keys.join("|") + ")", "g");
  }, []);

  const triggerFlash = (text) => {
    setFlash({ text, key: Date.now() });
    setTimeout(() => setFlash(null), 900);
  };

  const expandFromValue = useCallback((raw, cursor) => {
    const before = raw.slice(0, cursor);
    const after = raw.slice(cursor);
    let lastMatch = null;
    let m;
    triggerRe.lastIndex = 0;
    while ((m = triggerRe.exec(before)) !== null) {
      lastMatch = { trig: m[0], start: m.index, end: m.index + m[0].length };
    }
    if (lastMatch && lastMatch.end === before.length) {
      const isPrefixOfLonger = Object.keys(SNIPPETS).some(
        k => k !== lastMatch.trig && k.startsWith(lastMatch.trig)
      );
      if (!isPrefixOfLonger) {
        const replacement = SNIPPETS[lastMatch.trig];
        const newBefore = before.slice(0, lastMatch.start) + replacement;
        const next = newBefore + after;
        setVal(next);
        setPulse(p => p + 1);
        triggerFlash(replacement);
        requestAnimationFrame(() => {
          if (taRef.current) {
            const pos = newBefore.length;
            taRef.current.setSelectionRange(pos, pos);
            taRef.current.focus();
          }
        });
        return true;
      }
    }
    return false;
  }, [triggerRe]);

  const handleChange = (e) => {
    const raw = e.target.value;
    const cursor = e.target.selectionStart;
    if (!expandFromValue(raw, cursor)) setVal(raw);
  };

  useEffect(() => {
    if (!externalFill) return;
    const { trig } = externalFill;
    const start = val.length === 0 || /\s$/.test(val) ? val : val + " ";
    let i = 0;
    const ta = taRef.current;
    if (ta) ta.focus();
    const tick = () => {
      i++;
      const next = start + trig.slice(0, i);
      setVal(next);
      if (i < trig.length) {
        setTimeout(tick, 55);
      } else {
        const ok = expandFromValue(next, next.length);
        if (!ok) {
          const replacement = SNIPPETS[trig];
          const newVal = start + replacement;
          setVal(newVal);
          setPulse(p => p + 1);
          triggerFlash(replacement);
          requestAnimationFrame(() => {
            if (taRef.current) {
              taRef.current.setSelectionRange(newVal.length, newVal.length);
              taRef.current.focus();
            }
          });
        }
      }
    };
    setVal(start);
    setTimeout(tick, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFill?.key]);

  const clear = () => {
    setVal("");
    if (taRef.current) taRef.current.focus();
  };

  return (
    <div className={`demo ${pulse ? "demo-pulse" : ""}`} key={pulse}>
      <div className="demo-label">
        <span className="dots"><i/><i/><i/></span>
        <span className="demo-fname">{t.try_label}</span>
        <span className="demo-status">
          {flash ? (
            <span className="demo-flash">↳ {t.flash_label}</span>
          ) : null}
        </span>
      </div>
      <textarea
        ref={taRef}
        className="demo-input"
        rows={4}
        placeholder={t.try_placeholder}
        value={val}
        spellCheck={false}
        onChange={handleChange}
        aria-label={t.try_placeholder}
      />
      <div className="demo-bar">
        <span>{t.try_hint}</span>
        {val ? (
          <button className="demo-clear" onClick={clear}>clear</button>
        ) : null}
      </div>
    </div>
  );
}

function TriggerChips({ t, onPick, label }) {
  const triggers = [":email", ":sig", ":now", ":addr", ":shrug", ":dash", ":arrow", ":tm"];
  const [active, setActive] = useState(null);
  const handle = (trig) => {
    setActive(trig);
    onPick(trig);
    setTimeout(() => setActive(null), 600);
  };
  return (
    <div className="chip-row">
      <span className="chip-label">{label}</span>
      <ul className="chips">
        {triggers.map((trig) => (
          <li key={trig}>
            <button
              type="button"
              className={active === trig ? "copied" : ""}
              onClick={() => handle(trig)}
            >
              {trig}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

/* ---------- YAML highlighter w/ optional annotations ---------- */

function YamlBlock({ code, annotations }) {
  const lines = code.split("\n");
  const annoMap = {};
  if (annotations) annotations.forEach(a => { annoMap[a.line] = a; });

  return (
    <pre className="yaml">
      {lines.map((line, i) => {
        const lineNo = i + 1;
        const cm = line.match(/^(\s*)(#.*)$/);
        let body;
        if (cm) {
          body = <>{cm[1]}<span className="y-cmt">{cm[2]}</span></>;
        } else {
          let parts = line;
          const out = [];
          const km = parts.match(/^(\s*-?\s*)([A-Za-z_]+)(:)/);
          if (km) {
            out.push(<span key="lead">{km[1]}</span>);
            out.push(<span key="key" className="y-key">{km[2]}</span>);
            out.push(<span key="col">{km[3]}</span>);
            parts = parts.slice(km[0].length);
          }
          const strRe = /"([^"]*)"/g;
          let last = 0; let m2; let idx = 0;
          while ((m2 = strRe.exec(parts)) !== null) {
            if (m2.index > last) out.push(<span key={`t${idx}`}>{parts.slice(last, m2.index)}</span>);
            out.push(<span key={`s${idx}`} className="y-str">"{m2[1]}"</span>);
            last = m2.index + m2[0].length;
            idx++;
          }
          if (last < parts.length) {
            const tail = parts.slice(last);
            const varRe = /\{\{[^}]+\}\}/g;
            let l2 = 0; let m3; let j = 0;
            while ((m3 = varRe.exec(tail)) !== null) {
              if (m3.index > l2) out.push(<span key={`p${idx}-${j}`}>{tail.slice(l2, m3.index)}</span>);
              out.push(<span key={`v${idx}-${j}`} className="y-var">{m3[0]}</span>);
              l2 = m3.index + m3[0].length;
              j++;
            }
            if (l2 < tail.length) out.push(<span key={`f${idx}`}>{tail.slice(l2)}</span>);
          }
          body = out.length ? out : (line || " ");
        }
        const anno = annoMap[lineNo];
        return (
          <div className={`yl ${anno ? "yl-anno" : ""} ${anno ? `yl-${anno.side}` : ""}`} key={i}>
            {body}
            {anno && <span className="yl-pin">{anno.label}</span>}
          </div>
        );
      })}
    </pre>
  );
}

/* ---------- Compact starter card (no chrome) ---------- */
function StarterCard({ s }) {
  return (
    <article className="starter">
      <header>
        <code className="starter-trig">{s.trig}</code>
        <span className="starter-desc">{s.desc}</span>
      </header>
      <YamlBlock code={s.code} />
    </article>
  );
}

/* ---------- App ---------- */

function App() {
  const [lang, setLang] = useState(detectInitialLang);
  const t = SOKKI_I18N[lang];
  const scrolled = useScrolled();
  const [demoFill, setDemoFill] = useState(null);
  const demoRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = lang === "zh"
      ? "Sokki — 少敲键，多说话。"
      : "Sokki — Type less. Say more.";
    try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
  }, [lang, t]);

  useReveal();

  const toggle = () => setLang((l) => l === "en" ? "zh" : "en");

  const pickTrigger = (trig) => {
    setDemoFill({ trig, key: Date.now() });
    if (demoRef.current) {
      demoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <>
      <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
        <div className="shell topbar-inner">
          <a href="#top" className="brand" aria-label="Sokki home">
            <span className="brand-mark">Sokki</span>
            <span className="brand-zh">速記</span>
          </a>
          <nav className="nav">
            <a href="#workflow">{t.nav.workflow}</a>
            <a href="#faq">{t.nav.faq}</a>
            <a href="https://github.com/sorrycc/Sokki" className="nav-gh">{t.nav.github}</a>
            <a
              href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg"
              className={`nav-dl ${scrolled ? "show" : ""}`}
            >↓ {t.nav.download}</a>
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
        <section className="hero shell-wide">
          <div className="hero-grid">
            <div className="hero-text">
              <p className="kicker">{t.hero.kicker}</p>
              <h1>
                <span className="a">{t.hero.headline_a}</span>
                <span className="b">{t.hero.headline_b}</span>
              </h1>
              <p className="lede">
                {t.hero.lede}
                <code className="trigger-inline">:email</code>
                {t.hero.lede_after}
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg">
                  ↓ {t.hero.cta_primary}
                </a>
                <a className="textlink" href="https://github.com/sorrycc/Sokki">
                  {t.hero.cta_secondary} →
                </a>
              </div>
              <p className="meta">{t.hero.meta}</p>
            </div>
            <figure className="hero-figure">
              <ProductMockup lang={lang} t={t} />
            </figure>
          </div>
        </section>

        {/* Social proof */}
        <section className="proof shell-wide reveal">
          <p className="eyebrow">{t.proof.eyebrow}</p>

          <div className="proof-hero">
            <div className="ph-num">{t.proof.hero_stat.n}</div>
            <p className="ph-label">{t.proof.hero_stat.l}</p>
          </div>

          <div className="proof-stats">
            {t.proof.stats.map((s, i) => (
              <div className="ps" key={i}>
                <div className="ps-n">{s.n}</div>
                <div className="ps-l">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="proof-quotes">
            {t.proof.quotes.map((q, i) => (
              <figure key={i}>
                <blockquote>“{q.q}”</blockquote>
                <figcaption>
                  <span className="qa">{q.a}</span>
                  <span className="qr">{q.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Demo */}
        <section id="demo" className="demo-section shell reveal" ref={demoRef}>
          <p className="eyebrow">{t.demo.eyebrow}</p>
          <h2>{t.demo.title}</h2>
          <p className="sub">{t.demo.sub}</p>
          <LiveDemo t={t.demo} externalFill={demoFill} />
          <TriggerChips t={t} onPick={pickTrigger} label={t.demo.chips_label} />
        </section>

        {/* Intro w/ proper drop cap */}
        <section className="intro reveal">
          <div className="shell intro-grid">
            <p className="eyebrow">{t.intro.eyebrow}</p>
            <p className="intro-body">
              <span className="dropcap" aria-hidden="true">{t.intro.drop}</span>
              {t.intro.body}
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section shell reveal">
          <p className="eyebrow">01 / {lang === "zh" ? "功能" : "Features"}</p>
          <h2>{t.features.title}</h2>
          <p className="sub">{t.features.subtitle}</p>

          <div className="feat-hero feat-hero-light">
            {t.features.hero_items.map((f) => (
              <article className="fh fh-light" key={f.k}>
                <p className="fh-num">{f.k}</p>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
                {f.chip_a ? (
                  <div className="fh-flow">
                    <span className="fhf-pill fhf-trig">{f.chip_a}</span>
                    <span className="fhf-arrow">⟶</span>
                    <span className="fhf-pill fhf-claude">{f.chip_b}</span>
                    <span className="fhf-arrow">⟶</span>
                    <span className="fhf-pill fhf-done">{f.chip_c}</span>
                  </div>
                ) : (
                  <pre className="fh-yamlmini">
                    {f.ll.map((l, i) => (
                      <div className="yl" key={i}>{l}</div>
                    ))}
                  </pre>
                )}
              </article>
            ))}
          </div>

          <ul className="feat-grid">
            {t.features.list.map((it, i) => (
              <li key={i}>
                <strong>{it.h}</strong>
                <p>{it.p}</p>
              </li>
            ))}
          </ul>

          <div className="compare">
            <p className="compare-label">{t.features.compare.label}</p>
            <ul>
              {t.features.compare.items.map((c, i) => (
                <li key={i}>
                  <span className="cmp-name">vs. {c.name}</span>
                  <span className="cmp-p">{c.p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Workflow — YAML-FIRST, no step boxes */}
        <section id="workflow" className="section section-tinted shell-wide reveal">
          <div className="shell">
            <p className="eyebrow">02 / {t.workflow.eyebrow}</p>
            <h2>{t.workflow.title}</h2>
            <p className="sub">{t.workflow.sub}</p>
          </div>
          <div className="yaml-break">
            <div className="yaml-wrap">
              <div className="yaml-head">
                <span className="yh-dots"><i/><i/><i/></span>
                <span className="yh-name">~/.sokki/snippets.yaml</span>
                <span className="yh-meta">— {t.workflow.yaml_caption}</span>
              </div>
              <YamlBlock code={t.workflow.yaml} annotations={t.workflow.annotations} />
            </div>
          </div>
        </section>

        {/* Mid-page CTA */}
        <section className="midcta reveal">
          <div className="shell midcta-inner">
            <div>
              <p className="eyebrow">{t.midcta.eyebrow}</p>
              <h3>{t.midcta.title}</h3>
            </div>
            <div className="midcta-actions">
              <a className="btn btn-primary" href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg">
                ↓ {t.midcta.cta}
              </a>
              <p className="meta">{t.midcta.meta}</p>
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section id="not" className="section shell reveal">
          <p className="eyebrow">03 / {t.not.eyebrow}</p>
          <h2>{t.not.title_pos}</h2>
          <p className="sub">{t.not.sub_pos}</p>
          <ul className="not-list">
            {t.not.items.map((it, i) => (
              <li key={i}>
                <span className="not-x" aria-hidden="true">×</span>
                <h3>{it.h}</h3>
                <p>{it.p}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* First five triggers */}
        <section id="uses" className="section section-tinted shell reveal">
          <p className="eyebrow">04 / {t.uses.eyebrow}</p>
          <h2>{t.uses.title}</h2>
          <p className="sub">{t.uses.sub}</p>
          <div className="starter-list starter-list-recipe">
            {t.uses.starter.map((s) => <StarterCard key={s.trig} s={s} />)}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section shell reveal">
          <p className="eyebrow">05 / FAQ</p>
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

        {/* Final CTA — DARK, FILLED with mockup loop + install one-liner */}
        <section className="cta-final reveal">
          <div className="shell cta-final-inner">
            <div className="cta-left">
              <h2>{t.cta.title}</h2>
              <p className="sub">{t.cta.sub}</p>
              <div className="cta-row">
                <a className="btn btn-inverse" href="https://download.sorrycc.dev/sokki/Sokki-latest.dmg">
                  ↓ {t.cta.cta_primary}
                </a>
              </div>
              <p className="cta-or">{t.cta.install}</p>
              <pre className="cta-cmd">{t.cta.install_cmd}</pre>
              <p className="meta">{t.cta.meta}</p>
              <p className="cta-ps">{t.cta.ps}</p>
            </div>
            <div className="cta-right">
              <div className="cta-mockup-frame">
                <ProductMockup lang={lang} t={t} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div className="f-col f-col-main">
            <p className="f-built">
              {t.footer.built_by} <a href="https://x.com/chenchengpro" target="_blank" rel="noopener">{t.footer.author}</a>.
            </p>
            <p className="f-line">{t.footer.compiled}</p>
            <p className="f-line">{t.footer.since}</p>
          </div>
          <div className="f-col">
            <p className="f-h">{t.footer.colophon_label}</p>
            {t.footer.colophon_lines.map((l, i) => (
              <p className="f-line" key={i}>{l}</p>
            ))}
          </div>
          <div className="f-col">
            <p className="f-h">{t.footer.links_label}</p>
            {t.footer.links.map((lk, i) => (
              <p className="f-line" key={i}><a href={lk.href}>{lk.label}</a></p>
            ))}
          </div>
        </div>
        <div className="shell footer-curse">
          <p>— {t.footer.curse}</p>
        </div>
        <div className="shell footer-foot">
          <span>{t.footer.build}</span>
          <span className="f-stamp">速</span>
        </div>
      </footer>
    </>
  );
}

function renderInlineCode(s) {
  let out = String(s).replace(/\{\{[^}]+\}\}/g, (m) => `<code>${escapeHtml(m)}</code>`);
  out = out.replace(/(^|[\s,(])(:[a-zA-Z]+)/g, (_, pre, m) => `${pre}<code>${escapeHtml(m)}</code>`);
  out = out.replace(/(telemetry\.sorrycc\.dev)/g, "<code>$1</code>");
  return out;
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default App;
