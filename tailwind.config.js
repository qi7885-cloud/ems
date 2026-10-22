/** @type {import('tailwindcss').Config} */

/**
 * 工业控制台设计令牌
 * ---------------------------------------------------------------
 * 所有语义色都指向 CSS 变量（见 src/index.css），因此深色 / 浅色
 * 两套主题只需切换变量值，页面里的 `bg-panel` / `text-ink` 等类名
 * 无需任何改动。
 *
 * 命名约定（工业后台）：
 *   canvas     最底层画布
 *   panel      面板（卡片）主体
 *   panel-2    次级面板 / 表头
 *   inset      凹陷区（输入框、代码块、工具条）
 *   hover      悬停态底色
 *   line       常规分隔线
 *   line-strong 强调边框
 *   ink / ink-2 / ink-3  主 / 次 / 弱文字
 *   accent     控制青（强调、链接、激活态）
 *   ok / warn / danger / info / offline  运行状态语义色
 */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        'panel-2': 'rgb(var(--c-panel-2) / <alpha-value>)',
        inset: 'rgb(var(--c-inset) / <alpha-value>)',
        hover: 'rgb(var(--c-hover) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        'ink-2': 'rgb(var(--c-ink-2) / <alpha-value>)',
        'ink-3': 'rgb(var(--c-ink-3) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-dim': 'rgb(var(--c-accent-dim) / <alpha-value>)',
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        info: 'rgb(var(--c-info) / <alpha-value>)',
        offline: 'rgb(var(--c-offline) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans',
          'PingFang SC',
          'Microsoft YaHei',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Cascadia Mono', 'Consolas', 'Menlo', 'monospace'],
      },
      fontSize: {
        // 工业后台：12px 是密度基线，11px 用于标签
        '2xs': ['11px', { lineHeight: '16px' }],
        xs: ['12px', { lineHeight: '18px' }],
        sm: ['13px', { lineHeight: '20px' }],
      },
      borderRadius: {
        DEFAULT: '3px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        // 工业风：扁平为主，仅保留极轻的层次
        panel: '0 1px 2px 0 rgb(0 0 0 / 0.25)',
        pop: '0 8px 24px -6px rgb(0 0 0 / 0.45)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
};
