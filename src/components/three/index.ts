/**
 * HYDRE V1.0 — Three.js Components Barrel Export
 * V4.0.0-HYDRE-APEX Compliant
 */

// Scene module
export { Scene3D } from './Scene/Scene';
export { SceneContent } from './Scene/SceneContent';
export { LoadingFallback } from './Scene/LoadingFallback';
export type { Scene3DProps, SceneContentProps, SceneState, SceneRefs } from './Scene/Scene.types';

// TabletModel module  
export { TabletModel } from './TabletModel/TabletModel';
export type { TabletModelProps, TabletModelState, TabletModelRef } from './TabletModel/TabletModel.types';

// ParticleSystem module
export { ParticleSystem } from './ParticleSystem/ParticleSystem';
export { IngredientLabels } from './ParticleSystem/IngredientLabels';
export { useParticleAnimation, INGREDIENTS } from './ParticleSystem/useParticleAnimation';
export type {
    ParticleSystemProps,
    IngredientLabelsProps,
    Ingredient,
    ParticleState,
    ParticleSystemRef,
} from './ParticleSystem/ParticleSystem.types';

// FlavorTablet module
export { FlavorTablet } from './FlavorTablet/FlavorTablet';
export type { FlavorTabletProps, FlavorTabletRef } from './FlavorTablet/FlavorTablet.types';

// HydreCoreAssembly module — Declarative Scene Graph Destructuring
export { HydreCoreAssembly } from './HydreCoreAssembly';
export type { HydreCoreAssemblyProps, HydreSceneNodes } from './HydreCoreAssembly';

// HydreProductSection module — Canvas Environmental Wrapper
export { HydreProductSection } from './HydreProductSection';
