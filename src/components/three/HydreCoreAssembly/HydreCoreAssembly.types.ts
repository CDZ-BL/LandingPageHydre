/**
 * HydreCoreAssembly — Type Definitions
 * V4.0.0-HYDRE-APEX Compliant
 *
 * Declarative Scene Graph Destructuring types
 * for the HYDRE tube+lid+tablet assembly.
 */

import type * as THREE from 'three';

/** Node names as exported from Blender → glTF pipeline */
export interface HydreSceneNodes {
    readonly Mesh_Tube: THREE.Mesh;
    readonly Mesh_Lid: THREE.Mesh;
    readonly Mesh_Tablet_Hero: THREE.Mesh;
}

/** Props forwarded to the assembly root <group> */
export type HydreCoreAssemblyProps = JSX.IntrinsicElements['group'];
