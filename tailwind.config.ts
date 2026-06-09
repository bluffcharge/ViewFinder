import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        canvas:  "var(--surface-canvas)",
        card:    "var(--surface-card)",
        subtle:  "var(--surface-subtle)",
        raised:  "var(--surface-raised)",
        overlay: "var(--surface-overlay)",

        border: {
          DEFAULT: "var(--border-default)",
          subtle:  "var(--border-subtle)",
          strong:  "var(--border-strong)",
        },

        ink: {
          DEFAULT:  "var(--text-default)",
          title:    "var(--text-title)",
          body:     "var(--text-body)",
          subtitle: "var(--text-subtitle)",
          caption:  "var(--text-caption)",
          disabled: "var(--text-disabled)",
          link:     "var(--text-link)",
          inverse:  "var(--text-on-dark)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          soft:    "var(--accent-soft)",
        },

        success: "var(--color-success)",
        error:   "var(--color-error)",
        warn:    "var(--color-warn)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        xs:    "var(--radius-xs)",
        sm:    "var(--radius-sm)",
        md:    "var(--radius-md)",
        lg:    "var(--radius-lg)",
        xl:    "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill:  "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionTimingFunction: {
        snap:     "var(--ease-snap)",
        standard: "var(--ease-standard)",
      },
      transitionDuration: {
        fast: "150ms",
        med:  "250ms",
        slow: "400ms",
      },
    },
  },
  plugins: [],
};
export default config;
