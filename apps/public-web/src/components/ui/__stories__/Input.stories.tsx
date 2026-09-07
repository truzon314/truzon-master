import type { Meta, StoryObj } from "@storybook/react";
import { Input, Textarea } from "../Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["text", "email", "tel", "password", "number"] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Full Name",
    placeholder: "John Doe",
  },
};

export const WithError: Story = {
  args: {
    label: "Email Address",
    placeholder: "john@example.com",
    type: "email",
    error: "Please enter a valid email address",
  },
};

export const WithHelper: Story = {
  args: {
    label: "Phone Number",
    placeholder: "+91 98765 43210",
    type: "tel",
    helperText: "We'll only use this to contact you about your enquiry",
  },
};

export const Disabled: Story = {
  args: {
    label: "Property Type",
    value: "Villa",
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Input label="Default" placeholder="Enter text..." />
      <Input label="With Error" placeholder="Enter text..." error="This field is required" />
      <Input label="With Helper" placeholder="Enter text..." helperText="Some helper text" />
      <Input label="Disabled" placeholder="Enter text..." disabled />
    </div>
  ),
};

const textareaMeta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export const TextareaDefault: StoryObj<typeof Textarea> = {
  render: () => (
    <div className="w-80">
      <Textarea label="Message" placeholder="Tell us about your requirements..." />
    </div>
  ),
};