import type { Meta, StoryObj } from '@storybook/react';
import { FlavorTablet } from './FlavorTablet';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const meta: Meta<typeof FlavorTablet> = {
    title: 'Three/FlavorTablet',
    component: FlavorTablet,
    decorators: [
        (Story) => (
            <div style={{ width: '100%', height: '500px', background: '#0a0a0a' }}>
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <Environment preset="city" />
                    <Story />
                </Canvas>
            </div>
        ),
    ],
    argTypes: {
        flavor: {
            control: 'select',
            options: ['PINEAPPLE', 'COCONUT', 'CHERRY', 'MINT'],
        },
        taps: { control: { type: 'range', min: 0, max: 20 } },
        isCompleted: { control: 'boolean' },
        isSelected: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof FlavorTablet>;

export const Default: Story = {
    args: {
        flavor: 'PINEAPPLE',
        position: [0, 0, 0],
        taps: 0,
        maxTaps: 10,
        isCompleted: false,
        isSelected: false,
        onTap: () => console.log('Tapped'),
    },
};

export const Completed: Story = {
    args: {
        flavor: 'CHERRY',
        position: [0, 0, 0],
        taps: 10,
        maxTaps: 10,
        isCompleted: true,
        isSelected: true,
        onTap: () => { },
    },
};
