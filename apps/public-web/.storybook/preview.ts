import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#080d1a" },
        { name: "navy-975", value: "#080d1a" },
        { name: "gray-50", value: "#f9fafb" },
      ],
    },
    layout: "centered",
  },
};

export default preview;