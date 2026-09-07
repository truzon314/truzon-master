import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["gold", "outline-light", "dark", "outline-dark"],
    },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Gold: Story = {
  args: {
    variant: "gold",
    children: "GET IN TOUCH",
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    children: "EXPLORE PROJECTS",
  },
};

export const OutlineDark: Story = {
  args: {
    variant: "outline-dark",
    children: "VIEW ALL PROPERTIES",
  },
};

export const OutlineLight: Story = {
  args: {
    variant: "outline-light",
    children: "BOOK SITE VISIT",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AsLink: Story = {
  args: {
    variant: "gold",
    href: "/projects",
    children: "GO TO PROJECTS",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="gold">Gold</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="outline-dark">Outline Dark</Button>
      <Button variant="outline-light">Outline Light</Button>
    </div>
  ),
};