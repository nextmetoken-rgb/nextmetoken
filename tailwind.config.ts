import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--c-bg)",
        surface: "var(--c-surface)",
        "surface-2": "var(--c-surface-2)",
        skeleton: "var(--c-skeleton)",
        border: "var(--c-border)",
        "border-strong": "var(--c-border-strong)",
        text: "var(--c-text)",
        "text-2": "var(--c-text-2)",
        "text-3": "var(--c-text-3)",
        "text-disabled": "var(--c-text-disabled)",
        accent: "var(--c-accent)",
        "accent-hover": "var(--c-accent-hover)",
        "accent-pressed": "var(--c-accent-pressed)",
        "accent-soft": "var(--c-accent-soft)",
        "accent-soft-border": "var(--c-accent-soft-border)",
        "on-accent": "var(--c-on-accent)",
        next: "var(--c-next)",
        "next-soft": "var(--c-next-soft)",
        "next-strong": "var(--c-next-strong)",
        "on-next": "var(--c-on-next)",
        success: "var(--c-success)",
        "success-soft": "var(--c-success-soft)",
        danger: "var(--c-danger)",
        "danger-hover": "var(--c-danger-hover)",
        "danger-soft": "var(--c-danger-soft)",
        "disabled-bg": "var(--c-disabled-bg)",
        scrim: "var(--c-scrim)",
        "toast-bg": "var(--c-toast-bg)",
        focus: "var(--c-focus)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        0: "var(--shadow-0)",
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
      },
      zIndex: {
        sticky: "10",
        banner: "15",
        nav: "20",
        scrim: "40",
        sheet: "50",
        dialog: "60",
        toast: "70",
      },
      transitionDuration: {
        instant: "90ms",
        fast: "120ms",
        base: "200ms",
        slow: "300ms",
        number: "250ms",
      },
    },
  },
  plugins: [],
};

export default config;
