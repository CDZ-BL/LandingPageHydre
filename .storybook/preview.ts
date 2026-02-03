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
      default: 'dark',
      values: [
        { name: 'dark', value: '#050505' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;