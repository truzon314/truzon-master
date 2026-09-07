import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "../Container";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["default", "wide", "narrow"] },
    padded: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-600">Default container (max-w-7xl)</div>,
  },
};

export const Wide: Story = {
  args: {
    size: "wide",
    children: <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-600">Wide container (max-w-[1400px])</div>,
  },
};

export const Narrow: Story = {
  args: {
    size: "narrow",
    children: <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-600">Narrow container (max-w-3xl)</div>,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Container>
        <div className="rounded-lg bg-gold-50 p-4 text-center text-sm">Default</div>
      </Container>
      <Container size="wide">
        <div className="rounded-lg bg-blue-50 p-4 text-center text-sm">Wide</div>
      </Container>
      <Container size="narrow">
        <div className="rounded-lg bg-green-50 p-4 text-center text-sm">Narrow</div>
      </Container>
    </div>
  ),
};