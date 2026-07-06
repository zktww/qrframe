import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
  type Accessor,
  type JSX,
  type Setter,
} from "solid-js";

export const LANGUAGES = ["zh-CN", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

const LANGUAGE_KEY = "language";

export const LANGUAGE_LABELS: Record<Language, string> = {
  "zh-CN": "简中",
  en: "English",
};

const messages = {
  "zh-CN": {
    footer: {
      bugs: "反馈问题",
      source: "源代码",
      blog: "博客文章",
      language: "语言",
    },
    bugs: {
      githubPrefix: "如果你有 Github 账号，欢迎提交",
      githubIssue: "Github issue",
      githubSuffix: "。",
      emailPrefix: "也可以直接发邮件给我：hi",
    },
    notFound: {
      title: "页面未找到",
      home: "返回首页",
    },
    settings: {
      encodingMode: "编码模式",
      version: "版本",
      minVersion: "最小版本",
      strict: "严格",
      errorTolerance: "容错率",
      minErrorTolerance: "最小容错率",
      maskPattern: "掩码模式",
    },
    options: {
      ecl: {
        Low: "低",
        Medium: "中",
        Quartile: "较高",
        High: "高",
      },
      mode: {
        Auto: "自动",
        Numeric: "数字",
        Alphanumeric: "字母数字",
        Byte: "字节",
      },
      mask: {
        Auto: "自动",
      },
    },
    editor: {
      data: "数据",
      render: "渲染",
      renameTitle: (name: string) => `重命名 ${name}`,
      deleteTitle: (name: string) => `删除 ${name}`,
      duplicateName: (name: string) => `${name} 已存在。`,
      deleteConfirm: "确定要删除这个函数吗？",
      confirm: "确认",
      cancel: "取消",
      presets: "预设",
      rename: "重命名",
      delete: "删除",
      createNew: "新建",
      codeEditor: "代码编辑器",
      loading: "加载中...",
      failedToLoad: (name: string) => `加载 ${name} 失败`,
      bothRenderExports: "不能同时导出 renderSVG 和 renderCanvas",
      missingRenderExport: "必须导出 renderSVG 或 renderCanvas",
    },
    codeEditor: {
      vimMode: "Vim 模式",
      updateThumbnail: "更新缩略图",
      save: "保存",
      noChanges: "无更改",
    },
    pasteDialog: {
      title: "允许粘贴代码？",
      warning: "运行不理解的代码可能有风险。",
      details:
        "这个网站没有可泄露的密钥或密码，但仍然可能发生各种事情：页面可能崩溃、跳转到其他网址，或者出现完全意料之外的结果。",
      deleteHint:
        "如果你需要在不运行代码的情况下删除某个预设，可以右键点击它。",
      acceptQuestion: "你接受这些风险吗？",
      yes: "接受",
      no: "不接受",
    },
    contextMenu: {
      rename: "重命名",
      delete: "删除",
    },
    preview: {
      dataExceedsCapacity: "数据超过最大容量",
      invalidEncoding: (mode: string) => `输入无法用${mode}模式编码`,
      metadataTitle: "QR 元数据",
      version: "版本",
      matrix: (size: number) => `${size}x${size} 矩阵`,
      errorTolerance: "容错率",
      mask: "掩码",
      encoding: "编码",
      copied: "已复制到剪贴板",
      failedToCopy: "复制失败",
      clipboardWriteFailed: "写入剪贴板失败",
      failedToCreateImage: "生成图片失败",
      copyToClipboard: "复制到剪贴板",
      share: "分享",
      nativeSharingFailed: "系统分享失败",
      fileSharingUnsupported: "浏览器不支持文件分享",
    },
    splitButton: {
      download: "下载",
      moreDownloadOptions: "更多下载选项",
      selectSize: "选择尺寸",
      alternateFileType: "其他文件类型",
      customSize: "自定义尺寸",
      downloadCustom: "下载自定义尺寸",
    },
    render: {
      failed: "渲染失败",
    },
    numberInput: {
      increment: "增加",
      decrement: "减少",
    },
    presets: {
      Basic: "基础",
      Gradient: "渐变",
      Markers: "标记",
      Mosaic: "马赛克",
      Material: "材质",
      Glitch: "故障",
      "Image Blend": "图片融合",
      Circle: "圆形",
      Camo: "迷彩",
      Neon: "霓虹",
      Glass: "玻璃",
      Mondrian: "蒙德里安",
      Quantum: "量子",
      Tile: "瓷砖",
      Drawing: "手绘",
      Halftone: "半调",
      Layers: "图层",
      Dots: "圆点",
      Minimal: "极简",
      Blocks: "方块",
      Bubbles: "气泡",
      Alien: "异形",
    },
    params: {
      Margin: "边距",
      Foreground: "前景色",
      Background: "背景色",
      Shape: "形状",
      Frame: "边框",
      Roundness: "圆角",
      "Pixel size": "像素尺寸",
      "Start color": "起始色",
      "End color": "结束色",
      "Finder color": "定位图案颜色",
      "Gradient type": "渐变类型",
      Angle: "角度",
      Logo: "Logo",
      "Logo size": "Logo 尺寸",
      "Show data behind logo": "显示 Logo 背后的数据",
      "Radius offset": "半径偏移",
      "Frame thickness": "边框粗细",
      "Marker color": "标记颜色",
      "Inner color": "内部颜色",
      "Marker style": "标记样式",
      "Data shape": "数据形状",
      "Data size": "数据尺寸",
      Style: "样式",
      "Tile colors": "瓷片颜色",
      "Tile gap": "瓷片间距",
      "Color drift": "颜色漂移",
      Material: "材质",
      Highlight: "高光",
      Shadow: "阴影",
      "Bevel size": "斜面尺寸",
      "Finder pattern": "定位图案",
      "Alignment pattern": "校准图案",
      Seed: "随机种子",
      "Quiet zone": "静区",
      Invert: "反转",
      "Line thickness": "线条粗细",
      "Finder thickness": "定位图案粗细",
      "Glow strength": "发光强度",
      Finder: "定位图案",
      Horizontal: "水平",
      Vertical: "垂直",
      Cross: "交叉",
      "Horizontal thickness": "水平粗细",
      "Vertical thickness": "垂直粗细",
      "Cross thickness": "交叉粗细",
      Image: "图片",
      "Image scale": "图片缩放",
      "Image opacity": "图片透明度",
      Contrast: "对比度",
      Brightness: "亮度",
      "QR background": "二维码背景",
      "Timing pattern": "定时图案",
      "Data pixel size": "数据像素尺寸",
      Dots: "圆点",
      Lines: "线条",
      Shapes: "形状",
      "Stroke width": "描边宽度",
      "Shape gap": "形状间距",
      "Shape opacity": "形状透明度",
      "QR layer": "二维码图层",
      "Large circle": "大圆",
      "Medium circle": "中圆",
      "Small circle": "小圆",
      "Tiny circle": "微圆",
      "Randomize circle size": "随机圆尺寸",
      "Fill style": "填充样式",
      Fill: "填充",
      "Fill weight": "填充粗细",
      "Fill gap": "填充间距",
      Stroke: "描边",
      Roughness: "粗糙度",
      Bowing: "弯曲度",
      Particles: "粒子",
      "Accent 1": "强调色 1",
      "Accent 2": "强调色 2",
      "Glitch strength": "故障强度",
      "Slice chance": "切片概率",
      "Ghost opacity": "重影透明度",
      "Inner square": "内方块",
      "Outer square": "外方块",
      Grout: "缝隙",
      Density: "密度",
      "Finder clarity": "定位清晰度",
      "Mix blend mode": "混合模式",
      "Offset x": "X 偏移",
      "Offset y": "Y 偏移",
      "Dark modules": "深色模块",
      "Light modules": "浅色模块",
      "Module opacity": "模块透明度",
      "Module size": "模块尺寸",
      "Adaptive modules": "自适应模块",
    },
    paramOptions: {
      Linear: "线性",
      Radial: "径向",
      "Square-Circle": "方形-圆形",
      "Diamond-Squircle": "菱形-超椭圆",
      None: "无",
      Corners: "四角",
      Rounded: "圆角",
      Classic: "经典",
      Target: "靶心",
      Brackets: "括号",
      Cutout: "切角",
      Double: "双线",
      Diamond: "菱形",
      Leaf: "叶形",
      Frame: "框架",
      Squircle: "超椭圆",
      Capsule: "胶囊",
      Plus: "加号",
      Spark: "星芒",
      Mosaic: "马赛克",
      Lego: "乐高",
      Collage: "拼贴",
      Acrylic: "亚克力",
      Emboss: "浮雕",
      Chrome: "铬面",
      "Paper Cut": "纸雕",
      Atom: "原子",
      Planet: "行星",
      Above: "上方",
      Below: "下方",
      Minimal: "最小",
      Full: "完整",
      Default: "默认",
      Circle: "圆形",
      Square: "方形",
      Center: "中心",
      Edge: "边缘",
      Random: "随机",
      Hachure: "排线",
      Solid: "实心",
      Zigzag: "之字形",
      "Cross-hatch": "交叉排线",
      Dots: "圆点",
      Dashed: "虚线",
      "Zigzag-line": "之字线",
      normal: "正常",
      multiply: "正片叠底",
      screen: "滤色",
      overlay: "叠加",
      darken: "变暗",
      lighten: "变亮",
      "color-dodge": "颜色减淡",
      "color-burn": "颜色加深",
      "hard-light": "强光",
      "soft-light": "柔光",
      difference: "差值",
      exclusion: "排除",
      hue: "色相",
      saturation: "饱和度",
      color: "颜色",
      luminosity: "亮度",
      "plus-darker": "加深",
      "plus-lighter": "加亮",
    },
  },
  en: {
    footer: {
      bugs: "report bugs",
      source: "source code",
      blog: "blog post",
      language: "Language",
    },
    bugs: {
      githubPrefix: "If you have Github account, feel free to file a",
      githubIssue: "Github issue",
      githubSuffix: ".",
      emailPrefix: "Otherwise, you can just email me at hi",
    },
    notFound: {
      title: "Not Found",
      home: "Home",
    },
    settings: {
      encodingMode: "Encoding mode",
      version: "Version",
      minVersion: "Min version",
      strict: "Strict",
      errorTolerance: "Error tolerance",
      minErrorTolerance: "Min error tolerance",
      maskPattern: "Mask pattern",
    },
    options: {
      ecl: {
        Low: "Low",
        Medium: "Medium",
        Quartile: "Quartile",
        High: "High",
      },
      mode: {
        Auto: "Auto",
        Numeric: "Numeric",
        Alphanumeric: "Alphanumeric",
        Byte: "Byte",
      },
      mask: {
        Auto: "Auto",
      },
    },
    editor: {
      data: "Data",
      render: "Render",
      renameTitle: (name: string) => `Rename ${name}`,
      deleteTitle: (name: string) => `Delete ${name}`,
      duplicateName: (name: string) => `${name} already exists.`,
      deleteConfirm: "Are you sure you want to delete this function?",
      confirm: "Confirm",
      cancel: "Cancel",
      presets: "Presets",
      rename: "Rename",
      delete: "Delete",
      createNew: "Create new",
      codeEditor: "Code editor",
      loading: "Loading...",
      failedToLoad: (name: string) => `Failed to load ${name}`,
      bothRenderExports: "renderSVG and renderCanvas cannot both be exported",
      missingRenderExport: "renderSVG or renderCanvas must be exported",
    },
    codeEditor: {
      vimMode: "Vim mode",
      updateThumbnail: "Update thumbnail",
      save: "Save",
      noChanges: "No changes",
    },
    pasteDialog: {
      title: "Allow pasting code?",
      warning: "Using code you don't understand could be dangerous.",
      details:
        "There are no secrets or passwords that can be leaked from this website, but any number of things could happen. The page may break, you could be redirected to another URL, or get absolutely memed on.",
      deleteHint:
        "In case you need to delete a preset without running its code, you can right click on it.",
      acceptQuestion: "Do you accept these risks?",
      yes: "Yes",
      no: "No, I'm sorry I wasted your time",
    },
    contextMenu: {
      rename: "Rename",
      delete: "Delete",
    },
    preview: {
      dataExceedsCapacity: "Data exceeds max capacity",
      invalidEncoding: (mode: string) =>
        `Input cannot be encoded in ${mode} mode`,
      metadataTitle: "QR Metadata",
      version: "Version",
      matrix: (size: number) => `${size}x${size} matrix`,
      errorTolerance: "Error tolerance",
      mask: "Mask",
      encoding: "Encoding",
      copied: "Copied to clipboard",
      failedToCopy: "Failed to copy",
      clipboardWriteFailed: "Clipboard write failed",
      failedToCreateImage: "Failed to create image",
      copyToClipboard: "Copy to clipboard",
      share: "Share",
      nativeSharingFailed: "Native sharing failed",
      fileSharingUnsupported: "File sharing not supported by browser",
    },
    splitButton: {
      download: "Download",
      moreDownloadOptions: "More download options",
      selectSize: "Select size",
      alternateFileType: "Alternate file type",
      customSize: "Custom size",
      downloadCustom: "Download custom",
    },
    render: {
      failed: "Render failed",
    },
    numberInput: {
      increment: "Increment",
      decrement: "Decrement",
    },
    presets: {},
    params: {},
    paramOptions: {},
  },
} as const;

type Messages = (typeof messages)[Language];

const I18nContext = createContext<{
  language: Accessor<Language>;
  setLanguage: Setter<Language>;
  t: Accessor<Messages>;
}>();

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function I18nProvider(props: { children: JSX.Element }) {
  const [language, setLanguage] = createSignal<Language>("zh-CN");

  onMount(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (isLanguage(stored)) {
      setLanguage(stored);
    }
  });

  createEffect(() => {
    const lang = language();
    document.documentElement.lang = lang;
    localStorage.setItem(LANGUAGE_KEY, lang);
  });

  const t = () => messages[language()];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {props.children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n: used outside I18nProvider");
  }
  return context;
}

export function presetLabel(t: Messages, value: string) {
  return (t.presets as Record<string, string>)[value] ?? value;
}

export function paramLabel(t: Messages, value: string) {
  return (t.params as Record<string, string>)[value] ?? value;
}

export function paramOptionLabel(t: Messages, value: string) {
  return (t.paramOptions as Record<string, string>)[value] ?? value;
}
