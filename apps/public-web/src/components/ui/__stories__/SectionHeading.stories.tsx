import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "../SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "UI/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    align: { control: "select", options: ["left", "center"] },
    showGoldBar: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {
  args: {
    title: "Why Choose Truzon Homes",
    subtitle: "15+ years of architectural excellence across Hyderabad and Bangalore.",
  },
};

export const Centered: Story = {
  args: {
    title: "Our Services",
    subtitle: "Everything it takes to turn a plot of land into a home you're proud of.",
    align: "center",
  },
};

export const WithoutBar: Story = {
  args: {
    title: "Featured Projects",
    showGoldBar: false,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Testimonials",
  },
};