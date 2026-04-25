// Bilingual strings for Sokki landing page.
// Auto-detects browser language; toggle in nav overrides and persists.

window.SOKKI_I18N = {
  en: {
    locale: "en",
    htmlLang: "en",
    nav: {
      features: "Features",
      workflow: "Workflow",
      uses: "Use cases",
      faq: "FAQ",
      github: "GitHub",
    },
    hero: {
      kicker: "Sokki — 速記",
      headline_a: "Type less.",
      headline_b: "Say more.",
      lede:
        "A native macOS text expander. Type a trigger like ",
      lede_after:
        " and Sokki replaces it with anything you want — system-wide, in any app.",
      cta_primary: "Download for macOS",
      cta_secondary: "Feedback on GitHub",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · Free",
      try_label: "Try it →",
      try_hint: "Just type a trigger like :email — it expands instantly.",
      try_placeholder: "Try typing :email here…",
      try_caption: "Live preview. Nothing leaves this page.",
    },
    triggers: {
      eyebrow: "Sample triggers · click to copy",
    },
    intro: {
      eyebrow: "What it is",
      body:
        "Sokki is a small thing that does one thing well. It watches what you type, and when it sees a trigger you've defined — like :email or :sig — it replaces it with the text, snippet, or AI rewrite you mapped it to. Snippets live in YAML files you can edit in any editor. Your keystrokes never leave your Mac.",
    },
    features: {
      title: "Everything a text expander should be.",
      subtitle:
        "Eight years of muscle memory shouldn't fight your tools. Sokki gets out of the way.",
      items: [
        {
          k: "01",
          h: "System-wide triggers",
          p: "Mail, Slack, your terminal, Figma, Xcode — anywhere you type.",
        },
        {
          k: "02",
          h: "Variables & templates",
          p: "Insert {{clipboard}}, {{date:%Y-%m-%d}}, {{selection}} — chain them with fallbacks.",
        },
        {
          k: "03",
          h: "Command palette",
          p: "Spotlight-style fuzzy search to fire any snippet by name. No memorisation.",
        },
        {
          k: "04",
          h: "AI rewrite",
          p: "Pipe selection or clipboard through Claude with a custom prompt — proofread, translate, summarise.",
        },
        {
          k: "05",
          h: "Recent activity HUD",
          p: "A floating panel shows what just expanded, in case you need to peek at the source.",
        },
        {
          k: "06",
          h: "Undo with backspace",
          p: "Hit backspace right after an expansion to roll it back to the trigger.",
        },
        {
          k: "07",
          h: "Hot-reload YAML",
          p: "Edit snippets in any text editor — Sokki picks up changes instantly.",
        },
        {
          k: "08",
          h: "Pauses in password fields",
          p: "Secure-input detection keeps Sokki out of sensitive contexts automatically.",
        },
      ],
    },
    workflow: {
      eyebrow: "How it works",
      title: "Three keystrokes, one expansion.",
      steps: [
        {
          n: "01",
          h: "Define a trigger",
          p: "Open the YAML file (or the settings UI). Map :email to your email, :sig to your signature, :daily to a stand-up template.",
          code: "- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"",
        },
        {
          n: "02",
          h: "Type it anywhere",
          p: "In any app, anywhere — start typing the trigger. Sokki watches the keystream.",
          code: "Hi, you can reach me at :email|",
        },
        {
          n: "03",
          h: "Watch it expand",
          p: "On Tab, Space, or the boundary character you set, the trigger gets replaced. Backspace once to undo.",
          code: "Hi, you can reach me at sorrycc@gmail.com",
        },
      ],
    },
    uses: {
      eyebrow: "Use cases",
      title: "What I actually use it for.",
      items: [
        {
          tag: "Email",
          h: "Boilerplate replies",
          p: "Three triggers cover 80% of my inbox. :thanks, :scheduling, :followup.",
        },
        {
          tag: "Code",
          h: "Snippet kit that follows me",
          p: "console.log boilerplates, useState scaffolds, license headers — same triggers in VS Code, Xcode, terminal.",
        },
        {
          tag: "Writing",
          h: "AI-assisted rewrites",
          p: "Select a paragraph, type :polish, Sokki sends it through Claude and pastes the result.",
        },
        {
          tag: "Dates",
          h: "Never type a date again",
          p: ":today, :iso, :rfc — all the timestamps your calendar/Git log/changelog wants.",
        },
        {
          tag: "Addresses",
          h: "Forms",
          p: "Shipping, billing, tax ID, ABN — type :addr and tab through the rest.",
        },
        {
          tag: "Glyphs",
          h: "Em dashes & arrows",
          p: ":dash → — , :arrow → → , :tm → ™. Things I shouldn't have to look up.",
        },
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
      meta: "v0.0.13 · macOS 14+ · Apple Silicon",
    },
    footer: {
      a: "Sokki = 速記 (shorthand). Built by ",
      author: "sorrycc",
      b: ".",
      privacy: "Privacy",
    },
    toggle_label: "中",
    toggle_aria: "切换到中文",
  },

  zh: {
    locale: "zh",
    htmlLang: "zh-CN",
    nav: {
      features: "功能",
      workflow: "原理",
      uses: "场景",
      faq: "FAQ",
      github: "GitHub",
    },
    hero: {
      kicker: "Sokki — 速記",
      headline_a: "少敲键。",
      headline_b: "多说话。",
      lede:
        "原生 macOS 文本扩展工具。输入触发词 ",
      lede_after:
        "，Sokki 会把它替换成你预设的任何内容 —— 全系统生效,所有 App 通用。",
      cta_primary: "下载 macOS 版",
      cta_secondary: "GitHub 反馈",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon · 免费",
      try_label: "试试 →",
      try_hint: "直接输入触发词，比如 :email —— 自动展开。",
      try_placeholder: "在这里试着输入 :email …",
      try_caption: "纯本地预览,数据不离开此页面。",
    },
    triggers: {
      eyebrow: "示例触发词 · 点击复制",
    },
    intro: {
      eyebrow: "这是什么",
      body:
        "Sokki 是一个只做一件事的小工具。它监听你的键入,当识别到你定义的触发词 —— 比如 :email 或 :sig —— 就替换成对应的文本、片段或 AI 改写结果。所有片段保存在 YAML 文件里,任何编辑器都能改。你的按键永远不会离开本机。",
    },
    features: {
      title: "一个文本扩展工具该有的,都有。",
      subtitle:
        "八年的肌肉记忆不该跟工具打架。Sokki 安静地待在那里,不挡你的路。",
      items: [
        {
          k: "01",
          h: "全系统触发",
          p: "Mail、Slack、终端、Figma、Xcode —— 任何能输入的地方都生效。",
        },
        {
          k: "02",
          h: "变量与模板",
          p: "插入 {{clipboard}}、{{date:%Y-%m-%d}}、{{selection}},支持链式回退。",
        },
        {
          k: "03",
          h: "命令面板",
          p: "Spotlight 式的模糊搜索,按名字直接执行片段。不用背触发词。",
        },
        {
          k: "04",
          h: "AI 改写",
          p: "把选中文本或剪贴板内容交给 Claude 处理 —— 校对、翻译、总结,任你定义。",
        },
        {
          k: "05",
          h: "最近活动 HUD",
          p: "一个浮窗展示刚刚发生了什么扩展,需要回看时一眼就能看到。",
        },
        {
          k: "06",
          h: "退格撤销",
          p: "扩展完成后立刻按退格,内容会回滚到原始触发词。",
        },
        {
          k: "07",
          h: "YAML 热加载",
          p: "在任何编辑器里改 snippet 文件,Sokki 自动重载。",
        },
        {
          k: "08",
          h: "密码框自动暂停",
          p: "检测到安全输入框时自动让路,不在敏感场景里搞事。",
        },
      ],
    },
    workflow: {
      eyebrow: "原理",
      title: "三步键入,一次替换。",
      steps: [
        {
          n: "01",
          h: "定义触发词",
          p: "打开 YAML 文件(或设置界面)。把 :email 映射到你的邮箱,:sig 映射到签名,:daily 映射到日报模板。",
          code: "- trigger: \":email\"\n  replace: \"sorrycc@gmail.com\"",
        },
        {
          n: "02",
          h: "在任何地方输入",
          p: "任意 App、任意位置 —— 直接键入触发词。Sokki 在底层监听键流。",
          code: "你好,可以通过 :email| 联系我",
        },
        {
          n: "03",
          h: "看它展开",
          p: "按 Tab、空格或你设定的边界字符,触发词被替换。再按一次退格就回退。",
          code: "你好,可以通过 sorrycc@gmail.com 联系我",
        },
      ],
    },
    uses: {
      eyebrow: "场景",
      title: "我每天真的在用它做什么。",
      items: [
        {
          tag: "邮件",
          h: "样板回复",
          p: "三个触发词覆盖收件箱 80% 的内容。:thanks、:scheduling、:followup。",
        },
        {
          tag: "代码",
          h: "随身片段库",
          p: "console.log 模板、useState 骨架、License 头 —— 同一套触发词在 VS Code、Xcode、终端通用。",
        },
        {
          tag: "写作",
          h: "AI 辅助改写",
          p: "选中一段,输入 :polish,Sokki 交给 Claude 处理后粘回来。",
        },
        {
          tag: "时间",
          h: "再也不手敲日期",
          p: ":today、:iso、:rfc —— 日历、Git log、Changelog 想要的格式都有。",
        },
        {
          tag: "地址",
          h: "表单",
          p: "收货、发票、税号 —— 输入 :addr,后面交给 Tab 键。",
        },
        {
          tag: "符号",
          h: "破折号与箭头",
          p: ":dash → — ，:arrow → → ，:tm → ™。本来就不该手敲的字符。",
        },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "系统要求是什么?",
          a: "macOS 14 (Sonoma) 及以上,Apple Silicon (M1 及以上)。Intel Mac 和 macOS 13 不支持。Sokki 需要辅助功能权限来监听按键。",
        },
        {
          q: "我的输入会被发送到任何地方吗?",
          a: "不会。Sokki 在本地处理按键 —— 数据永远不离开你的 Mac。匿名的日活/崩溃遥测会发送到 telemetry.sorrycc.dev,但其中不包含按键内容、剪贴板数据或匹配内容。你可以在设置 → 隐私里关闭。",
        },
        {
          q: "支持自动更新吗?",
          a: "支持。Sokki 使用 Sparkle 配合 EdDSA 签名校验。每次更新都经过 Developer ID 签名、公证并装订。",
        },
        {
          q: "为什么用 YAML 而不是数据库?",
          a: "纯文本可移植。你可以用 iCloud、Dropbox 或 git 同步,可以 diff,可以丢到 gist 里分享。二进制数据库只会把你锁住。",
        },
        {
          q: "怎么提 bug 或新功能?",
          a: "在 GitHub 仓库提 issue 即可。",
        },
      ],
    },
    cta: {
      title: "别再重复敲同一句话了。",
      sub: "免费,原生,不需要账号。一个被键盘敲累了的人写的。",
      meta: "v0.0.13 · macOS 14+ · Apple Silicon",
    },
    footer: {
      a: "Sokki = 速記。作者 ",
      author: "sorrycc",
      b: "。",
      privacy: "隐私",
    },
    toggle_label: "EN",
    toggle_aria: "Switch to English",
  },
};
