/**
 * FlavorTablet Types
 * V4.0.0-HYDRE-APEX Compliant
 */

import { Flavor } from '@/lib/store';
import { Group } from 'three';

export interface FlavorTabletProps {
    flavor: Flavor;
    position: [number, number, number];
    taps: number;
    maxTaps: number;
    isCompleted: boolean;
    isSelected: boolean;
    onTap: () => void;
}

export type FlavorTabletRef = Group;
