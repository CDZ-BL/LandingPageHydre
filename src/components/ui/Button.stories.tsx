import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'lab'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
        glow: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Explore System',
        glow: true,
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Cancel',
    },
};

export const Lab: Story = {
    args: {
        variant: 'lab',
        children: 'Initialize',
        glow: true,
    },
};
