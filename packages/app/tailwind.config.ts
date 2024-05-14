import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {},
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    // More details at https://daisyui.com/docs/config/
    themes: [{
      mytheme: {
        "primary": "#fff",
        "secondary": "#fffbd8",
        "accent": "#375bd2",
        "neutral": "#dfdfdf",
        "base-100": "#ffffff",
      },
    }],
  },
}
export default config
