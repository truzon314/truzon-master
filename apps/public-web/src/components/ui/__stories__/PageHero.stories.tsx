import type { Meta, StoryObj } from "@storybook/react";
import { PageHero } from "@/modules/content/PageHero";

const meta: Meta<typeof PageHero> = {
  title: "Layout/PageHero",
  component: PageHero,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof PageHero>;

export const Default: Story = {
  args: {
    title: "About Us",
    subtitle: "Building architectural excellence across Hyderabad and Bangalore.",
    crumbs: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
    ],
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: "Gallery",
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
};

export const DeepCrumbs: Story = {
  args: {
    title: "Blog Post Title",
    crumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Blog Post Title", href: "/blog/my-post" },
    ],
  },
};