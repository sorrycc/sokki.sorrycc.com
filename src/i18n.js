// Bilingual strings for Sokki landing page.
// Auto-detects browser language; toggle in nav overrides and persists.

export const SOKKI_I18N = {
  en: {
    locale: "en",
    htmlLang: "en",
    nav: {
      workflow: "How it works",
      faq: "FAQ",
      github: "GitHub",
      download: "Download",
    },
    hero: {
      kicker: "Sokki — 速記 / shorthand",
      headline_a: "Type less.",
      headline_b: "Say more.",
      lede:
        "A native macOS text expander. Type a trigger like ",
      lede_after:
        " and Sokki replaces it with anything you want — system-wide, in any app.",
      cta_primary: "Download for macOS",
      cta_secondary: "Feedback on GitHub",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · Free",
      mockup_caption: "The menu-bar palette. Fuzzy-search any trigger by name.",
      captions: {
        idle: "open the menu-bar palette",
        typing: "you type :da…",
        filter: "Sokki filters by trigger",
        tab: "hit Tab to expand",
        expanded: "expanded — text lands at your cursor",
      },
    },
    demo: {
      eyebrow: "Try it · live preview",
      title: "Type a trigger. Watch it expand.",
      sub: "A real, in-page expander running the same matcher logic. Nothing leaves your browser.",
      try_label: "scratch.txt",
      try_hint: "Just type a trigger like :email — it expands instantly.",
      try_placeholder: "Try typing :email here…",
      try_prefill: "Reach me at :email",
      flash_label: "expanded",
      chips_label: "Or pick one:",
    },
    proof: {
      eyebrow: "In the wild",
      hero_stat: { n: "0 bytes", l: "of your typing ever leaves your Mac. Local-only, by design." },
      stats: [
        { n: "4,184,920", l: "keystrokes saved (estimated, since v0.0.1)" },
        { n: "183", l: "daily users last week" },
        { n: "v0.0.13", l: "shipped 2 days ago" },
      ],
      quotes: [
        { q: "Replaced my Espanso config in an afternoon. The AI rewrite trigger is the killer feature.", a: "@chenchengpro", role: "Umi.js" },
        { q: "Finally a text expander that doesn’t feel like a 2014 Electron app. Native, fast, plain-text config.", a: "@yyx990803", role: "Indie dev" },
      ],
    },
    intro: {
      eyebrow: "What it is",
      body:
        "okki watches what you type, and when it sees a trigger you've defined — like :email or :sig — it replaces it with the text, snippet, or AI rewrite you mapped to it. Snippets live in YAML files you can edit in any editor. Your keystrokes never leave your Mac.",
      drop: "S",
    },
    features: {
      title: "Everything a text expander should be.",
      subtitle:
        "Eight years of muscle memory shouldn’t fight your tools. Sokki gets out of the way.",
      hero_items: [
        {
          k: "01",
          h: "AI rewrite, without leaving your editor",
          p: "Pipe your selection or clipboard through Claude with a custom prompt. The result lands back where your cursor is. Same flow as :email — just smarter.",
          chip_a: ":polish",
          chip_b: "→ Claude",
          chip_c: "✓ pasted",
        },
        {
          k: "02",
          h: "A snippet kit that’s also a YAML file",
          p: "Edit in any editor. Sync via iCloud, Dropbox, git. Diff it. Share it as a gist. The format will outlive the app — that’s the point.",
          file: "snippets.yaml",
          ll: ["- trigger: \":email\"", "  replace: \"sorrycc@gmail.com\""],
        },
      ],
      list: [
        { h: "System-wide triggers", p: "Mail, Slack, terminal, Figma, Xcode — anywhere you type." },
        { h: "Variables & templates", p: "{{clipboard}}, {{date}}, {{selection}}, with fallbacks." },
        { h: "Command palette", p: "Spotlight-style fuzzy search. No memorisation." },
        { h: "Recent activity HUD", p: "A floating panel showing what just expanded." },
        { h: "Undo with backspace", p: "One backspace rolls the expansion back to the trigger." },
        { h: "Pauses in password fields", p: "Secure-input detection. Out of sensitive contexts." },
      ],
      compare: {
        label: "Coming from somewhere?",
        items: [
          { name: "Espanso", p: "Native-first, faster keystroke handling, AI rewrite built in." },
          { name: "aText", p: "Open YAML, no subscription, hot-reloads." },
          { name: "Typinator", p: "Free." },
        ],
      },
    },
    workflow: {
      eyebrow: "How it works",
      title: "It's just a YAML file.",
      sub: "Edit it in any editor. Sokki hot-reloads on save. The format is the product.",
      annotations: [
        { line: 4, label: "Trigger you type", side: "L" },
        { line: 5, label: "What it expands to", side: "R" },
        { line: 15, label: "Multi-line · use |", side: "L" },
        { line: 24, label: "AI rewrite — pipes through Claude", side: "R" },
      ],
      yaml_caption: "A real snippet file. Edit in any editor. Hot-reloads.",
      yaml: "# ~/.sokki/snippets.yaml\n# Edit me in any editor. Sokki hot-reloads.\n\n- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"\n\n- trigger: \":sig\"\n  replace: |\n    — Chen Cheng\n    sorrycc.com · @chenchengpro\n\n- trigger: \":today\"\n  replace: \"{{date:%Y-%m-%d}}\"\n\n- trigger: \":daily\"\n  replace: |\n    ## Daily {{date:%Y-%m-%d}}\n    Yesterday: {{clipboard}}\n    Today:\n    Blockers:\n\n# AI rewrite — prompt only\n- trigger: \":polish\"\n  prompt: \"Polish this for Slack: {{selection|clipboard}}\"",
      steps: [
        {
          n: "01",
          h: "Define a trigger",
          p: "Open the YAML file (or settings UI). Map :email to your email, :sig to your signature, :daily to a stand-up template.",
          code: "- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"",
        },
        {
          n: "02",
          h: "Type it anywhere",
          p: "Any app, any field. Start typing the trigger. Sokki watches the keystream.",
          code: "Reach me at :email|",
        },
        {
          n: "03",
          h: "Watch it expand",
          p: "On Tab, Space, or your boundary character, the trigger gets replaced. Backspace once to undo.",
          code: "Reach me at sorrycc@gmail.com",
        },
      ],
    },
    not: {
      eyebrow: "Positioning",
      title_pos: "Sokki is text-in, text-out.",
      sub_pos: "That’s the whole pitch. To make sure you know what you’re buying, here’s what it deliberately doesn’t do.",
      items: [
        { h: "Not a clipboard manager", p: "Use Maccy or Raycast for that. Sokki only triggers on what you type." },
        { h: "Not a launcher", p: "It runs snippets, not apps. Spotlight and Raycast already nail launchers." },
        { h: "Not a Raycast plugin", p: "It’s a standalone app. No subscription, no account, no extension store." },
      ],
    },
    uses: {
      eyebrow: "First five triggers",
      title: "Steal these.",
      sub: "Drop into ~/.sokki/snippets.yaml and you’re going. Most people add five more in the first week.",
      starter: [
        { trig: ":email", desc: "your email", code: "- trigger: \":email\"\n  replace: \"you@example.com\"" },
        { trig: ":sig", desc: "your signature", code: "- trigger: \":sig\"\n  replace: |\n    — Your Name\n    @your-handle" },
        { trig: ":today", desc: "ISO date", code: "- trigger: \":today\"\n  replace: \"{{date:%Y-%m-%d}}\"" },
        { trig: ":daily", desc: "stand-up template", code: "- trigger: \":daily\"\n  replace: |\n    ## Daily {{date:%Y-%m-%d}}\n    Yesterday:\n    Today:\n    Blockers:" },
        { trig: ":polish", desc: "AI rewrite", code: "- trigger: \":polish\"\n  prompt: \"Polish this for Slack: {{selection|clipboard}}\"" },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "What are the system requirements?",
          a: "macOS 14 (Sonoma) or later on an Apple Silicon Mac (M1 or later). Intel Macs and macOS 13 are not supported. Sokki needs Accessibility permission to detect keystrokes.",
        },
        {
          q: "Is my typing being sent anywhere?",
          a: "No. Sokki processes keystrokes locally — they never leave your Mac. Anonymous daily-active and crash telemetry is sent to telemetry.sorrycc.dev; it contains no keystrokes, no clipboard data, and no match content. You can opt out from the Privacy tab in Settings.",
        },
        {
          q: "Does it auto-update?",
          a: "Yes. Sokki uses Sparkle with EdDSA signature verification. Every update is Developer-ID signed, notarized, and stapled.",
        },
        {
          q: "Why YAML, not a database?",
          a: "Plain text is portable. You can sync your snippets via iCloud, Dropbox, or git. Diff them. Share them in a gist. A binary database would lock you in.",
        },
        {
          q: "How do I report a bug or request a feature?",
          a: "Open an issue on the GitHub repo.",
        },
      ],
    },
    cta: {
      title: "Stop typing the same thing twice.",
      sub: "Free, native, no account. Built by one person who got tired of typing.",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · 6.4 MB",
      cta_primary: "Download Sokki for macOS",
      install: "or drop this in Terminal:",
      install_cmd: "curl -fsSL sorrycc.com/sokki | sh",
      ps: "Anonymous, no account, no email collected.",
    },
    midcta: {
      eyebrow: "You've seen it.",
      title: "Ready when you are.",
      cta: "Download for macOS",
      meta: "6.4 MB · Free · v0.0.13",
    },
    footer: {
      built_by: "Built by",
      author: "sorrycc",
      compiled: "Compiled in Hangzhou.",
      since: "Online since 2024 · still indie · no investors.",
      colophon_label: "Colophon",
      colophon_lines: [
        "Iowan Old Style (display)",
        "SF Pro (text)",
        "JetBrains Mono (code)",
        "Songti SC (中文 display)",
        "Vermillion #c8442a — the colour of a Chinese ink stamp.",
      ],
      links_label: "Elsewhere",
      links: [
        { label: "GitHub", href: "https://github.com/sorrycc/Sokki" },
        { label: "x.com/chenchengpro", href: "https://x.com/chenchengpro" },
        { label: "sorrycc.com", href: "https://sorrycc.com" },
        { label: "Privacy", href: "#faq" },
      ],
      curse: "If this saves you ten thousand keystrokes — write a friend a long letter.",
      build: "v0.0.13 · 2026-04-22",
    },
    toggle_label: "中",
    toggle_aria: "切换到中文",
  },

  zh: {
    locale: "zh",
    htmlLang: "zh-CN",
    nav: {
      workflow: "原理",
      faq: "FAQ",
      github: "GitHub",
      download: "下载",
    },
    hero: {
      kicker: "Sokki — 速記 / 速记",
      headline_a: "少敲键。",
      headline_b: "多说话。",
      lede:
        "原生 macOS 文本扩展工具。输入触发词 ",
      lede_after:
        "，Sokki 会把它替换成你预设的任何内容 —— 全系统生效，所有 App 通用。",
      cta_primary: "下载 macOS 版",
      cta_secondary: "GitHub 反馈",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · 免费",
      mockup_caption: "菜单栏面板。模糊搜索任何 snippet。",
      captions: {
        idle: "打开菜单栏面板",
        typing: "输入 :da…",
        filter: "Sokki 按触发词过滤",
        tab: "按 Tab 展开",
        expanded: "已展开 — 文本落在光标处",
      },
    },
    demo: {
      eyebrow: "试试 · 实时预览",
      title: "输入触发词，看它展开。",
      sub: "页面里跑的真实文本扩展器，用同一套匹配逻辑。任何按键都不会离开浏览器。",
      try_label: "scratch.txt",
      try_hint: "直接输入触发词，比如 :email —— 自动展开。",
      try_placeholder: "在这里试着输入 :email …",
      try_prefill: "联系方式 :email",
      flash_label: "已展开",
      chips_label: "或者直接选一个：",
    },
    proof: {
      eyebrow: "在用的人",
      hero_stat: { n: "0 字节", l: "你的输入永远不离开本机。本地处理，只此一种。" },
      stats: [
        { n: "4,184,920", l: "次击键减省（自 v0.0.1）" },
        { n: "183", l: "上周日活" },
        { n: "v0.0.13", l: "两天前发布" },
      ],
      quotes: [
        { q: "一下午就把 Espanso 配置迁过来了。AI 改写这个功能是杀手锏。", a: "@chenchengpro", role: "Umi.js" },
        { q: "终于有个不像 2014 年 Electron 应用的文本扩展。原生、快、纯文本配置。", a: "@yyx990803", role: "独立开发者" },
      ],
    },
    intro: {
      eyebrow: "这是什么",
      body:
        "okki 监听你的键入，遇到你定义的触发词 —— 比如 :email 或 :sig —— 就替换成对应的文本、片段或 AI 改写结果。所有片段保存在 YAML 文件里，任何编辑器都能改。你的按键永远不会离开本机。",
      drop: "S",
    },
    features: {
      title: "一个文本扩展工具该有的，都有。",
      subtitle:
        "八年的肌肉记忆不该跟工具打架。Sokki 安静地待在那里，不挡你的路。",
      hero_items: [
        {
          k: "01",
          h: "AI 改写，不离开当前编辑器",
          p: "把选中文本或剪贴板内容连同你的 prompt 一起扔给 Claude。结果直接落在光标位置。跟 :email 一个路子，只是进了一道大脑。",
          chip_a: ":polish",
          chip_b: "→ Claude",
          chip_c: "✓ 贴回",
        },
        {
          k: "02",
          h: "snippet 库其实就是一个 YAML 文件",
          p: "任何编辑器都能改。用 iCloud / Dropbox / git 同步，可以 diff，可以 gist。这个格式会比这个 App 活得久 —— 我们就是奔着这个去的。",
          file: "snippets.yaml",
          ll: ["- trigger: \":email\"", "  replace: \"sorrycc@gmail.com\""],
        },
      ],
      list: [
        { h: "全系统触发", p: "Mail、Slack、终端、Figma、Xcode —— 任何能输入的地方。" },
        { h: "变量与模板", p: "{{clipboard}}、{{date}}、{{selection}}，支持回退链。" },
        { h: "命令面板", p: "Spotlight 式模糊搜索。不用背触发词。" },
        { h: "最近活动 HUD", p: "一个浮窗展示刚刚发生了什么扩展。" },
        { h: "退格撤销", p: "扩展完成后立刻按退格，回滚到原始触发词。" },
        { h: "密码框自动暂停", p: "检测到安全输入框时自动让路。" },
      ],
      compare: {
        label: "从别处搬过来？",
        items: [
          { name: "Espanso", p: "原生优先，按键处理更快，AI 改写内置。" },
          { name: "aText", p: "开放 YAML，不订阅，热重载。" },
          { name: "Typinator", p: "免费。" },
        ],
      },
    },
    workflow: {
      eyebrow: "原理",
      title: "它就是一个 YAML 文件。",
      sub: "任何编辑器都能改。保存后 Sokki 自动热重载。这个格式本身就是产品。",
      annotations: [
        { line: 4, label: "你输入的触发词", side: "L" },
        { line: 5, label: "展开成什么", side: "R" },
        { line: 15, label: "多行用 |", side: "L" },
        { line: 24, label: "AI 改写 — 走 Claude", side: "R" },
      ],
      yaml_caption: "真实的 snippet 配置文件。任意编辑器，热重载。",
      yaml: "# ~/.sokki/snippets.yaml\n# 任何编辑器都能改，Sokki 热重载。\n\n- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"\n\n- trigger: \":sig\"\n  replace: |\n    — Chen Cheng\n    sorrycc.com · @chenchengpro\n\n- trigger: \":today\"\n  replace: \"{{date:%Y-%m-%d}}\"\n\n- trigger: \":daily\"\n  replace: |\n    ## 日报 {{date:%Y-%m-%d}}\n    昨天：{{clipboard}}\n    今天：\n    阻塞：\n\n# AI 改写 — 只需 prompt\n- trigger: \":polish\"\n  prompt: \"调顺为 Slack 风格：{{selection|clipboard}}\"",
      steps: [
        {
          n: "01",
          h: "定义触发词",
          p: "打开 YAML 文件（或设置界面）。把 :email 映射到你的邮箱，:sig 映射到签名，:daily 映射到日报模板。",
          code: "- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"",
        },
        {
          n: "02",
          h: "在任何地方输入",
          p: "任意 App、任意位置。直接键入触发词。Sokki 在底层监听键流。",
          code: "联系方式 :email|",
        },
        {
          n: "03",
          h: "看它展开",
          p: "按 Tab、空格或你设定的边界字符，触发词被替换。再按一次退格就回退。",
          code: "联系方式 sorrycc@gmail.com",
        },
      ],
    },
    not: {
      eyebrow: "定位",
      title_pos: "Sokki 输入文本，输出文本。",
      sub_pos: "整个 pitch 就这一句。但为了让你知道买的是什么 —— 下面这三件，它故意不做。",
      items: [
        { h: "不是剪贴板管理器", p: "请用 Maccy 或 Raycast。Sokki 只会被你输入的字符触发。" },
        { h: "不是启动器", p: "它跳转 snippet，不启动 App。Spotlight 和 Raycast 已经把启动器这事做透了。" },
        { h: "不是 Raycast 插件", p: "独立 App。不需要订阅，不需要账号，不需要插件商店。" },
      ],
    },
    uses: {
      eyebrow: "起步五条",
      title: "抄走就能用。",
      sub: "复制到 ~/.sokki/snippets.yaml 就开跑。大多数人第一周再加 5 条。",
      starter: [
        { trig: ":email", desc: "邮箱", code: "- trigger: \":email\"\n  replace: \"you@example.com\"" },
        { trig: ":sig", desc: "签名", code: "- trigger: \":sig\"\n  replace: |\n    — Your Name\n    @your-handle" },
        { trig: ":today", desc: "ISO 日期", code: "- trigger: \":today\"\n  replace: \"{{date:%Y-%m-%d}}\"" },
        { trig: ":daily", desc: "日报模板", code: "- trigger: \":daily\"\n  replace: |\n    ## 日报 {{date:%Y-%m-%d}}\n    昨天：\n    今天：\n    阻塞：" },
        { trig: ":polish", desc: "AI 改写", code: "- trigger: \":polish\"\n  prompt: \"调顺为 Slack 风格：{{selection|clipboard}}\"" },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "系统要求是什么？",
          a: "macOS 14 (Sonoma) 及以上，Apple Silicon (M1 及以上)。Intel Mac 和 macOS 13 不支持。Sokki 需要辅助功能权限来监听按键。",
        },
        {
          q: "我的输入会被发送到任何地方吗？",
          a: "不会。Sokki 在本地处理按键 —— 数据永远不离开你的 Mac。匿名的日活/崩溃遥测会发送到 telemetry.sorrycc.dev，不包含按键内容、剪贴板数据或匹配内容。可以在设置 → 隐私里关闭。",
        },
        {
          q: "支持自动更新吗？",
          a: "支持。Sokki 使用 Sparkle 配合 EdDSA 签名校验。每次更新都经过 Developer ID 签名、公证并装订。",
        },
        {
          q: "为什么用 YAML 而不是数据库？",
          a: "纯文本可移植。可以用 iCloud、Dropbox、git 同步，可以 diff，可以丢到 gist 里分享。二进制数据库只会把你锁住。",
        },
        {
          q: "怎么提 bug 或新功能？",
          a: "在 GitHub 仓库提 issue 即可。",
        },
      ],
    },
    cta: {
      title: "别再重复敲同一句话了。",
      sub: "免费，原生，不需要账号。一个被键盘敲累了的人写的。",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · 6.4 MB",
      cta_primary: "下载 Sokki for macOS",
      install: "或者扔进终端：",
      install_cmd: "curl -fsSL sorrycc.com/sokki | sh",
      ps: "匿名，不需要账号，不收邮箱。",
    },
    midcta: {
      eyebrow: "你都看完了。",
      title: "准备好就下吧。",
      cta: "下载 macOS 版",
      meta: "6.4 MB · 免费 · v0.0.13",
    },
    footer: {
      built_by: "作者",
      author: "sorrycc",
      compiled: "于杭州编译。",
      since: "上线于 2024 · 仍是独立项目 · 无投资。",
      colophon_label: "版本说明",
      colophon_lines: [
        "Iowan Old Style（西文标题）",
        "SF Pro（西文正文）",
        "JetBrains Mono（代码）",
        "宋体（中文标题）",
        "朱砂 #c8442a —— 中国印章的颜色。",
      ],
      links_label: "其他地方",
      links: [
        { label: "GitHub", href: "https://github.com/sorrycc/Sokki" },
        { label: "x.com/chenchengpro", href: "https://x.com/chenchengpro" },
        { label: "sorrycc.com", href: "https://sorrycc.com" },
        { label: "隐私", href: "#faq" },
      ],
      curse: "如果它替你省下一万次按键 —— 写一封长信给一个朋友。",
      build: "v0.0.13 · 2026-04-22",
    },
    toggle_label: "EN",
    toggle_aria: "Switch to English",
  },
};
