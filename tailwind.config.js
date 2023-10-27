module.exports = {
  safelist: [
    {
      pattern: /./,
    },
  ],
  content: ["./src/**/*.{vue,js,ts}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
