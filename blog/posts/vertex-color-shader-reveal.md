# Procedural Flow & Reveal Shaders: Baking Houdini Sims into Vertex Colors

In game development, rendering dense runtime fluid simulations for effects like blood filling engraved channels, glowing runic inscriptions, or lava flowing through cracks is prohibitively expensive. 

To achieve high-fidelity, art-directed growth animations under tight runtime budgets, we can pre-calculate the simulation inside Houdini, bake the time-of-arrival data directly into the mesh's vertex colors, and use a custom vertex/pixel shader to drive the reveal in real-time.

---

## The Concept

Instead of exporting an expensive blendshape animation or a heavy vertex animation texture (VAT), we export a static mesh. 

Each vertex stores a scalar value in its vertex color (e.g., the Red channel) representing the exact moment in time that the fluid passes over it. In-engine, the shader compares this value against a runtime variable (like `RevealProgress` from 0.0 to 1.0) to dynamically mask and reveal the material.

---

## Phase 1: Houdini Processing

### 1. Generating the Flow Network
To create the channels, we can use a procedural growth setup. The **Find Shortest Path** SOP is perfect for this:
- Distribute start points (sources) and end points (destinations) across the target geometry.
- Use a **Find Shortest Path** node to trace pathways along the mesh edges, adding noise to the edge cost to make the growth organic and jagged.

### 2. VDB Conversion for Organic Merging
Curves generated from shortest paths look thin and artificial. To make them look like viscous fluid:
1. Sweep the curves into geometry using the **Polywire** SOP.
2. Convert the polywires into a volume using **VDB from Polygons**.
3. Apply a **VDB Smooth** to melt the intersections together.
4. Convert back to polygons using **Convert VDB** to create a single, clean organic mesh.

### 3. Baking the Timeline (The VEX Part)
As the simulation grows, we capture the frame number at which each vertex is first intersected by the fluid. 

Inside a Solver SOP, we compare the current frame's fluid volume against our static mesh. If a vertex is inside the fluid, we lock in its arrival time:

```c
// Run inside a Solver Wrangle comparing static mesh (Input 0) to current fluid volume (Input 1)
float dist = xyzdist(1, @P);

// If within the collision threshold, record current normalized frame
if (dist < chf("threshold") && f@reveal_time == 0.0) {
    f@reveal_time = (float)@Frame / chf("total_frames");
}
```

Once the simulation completes, we map `@reveal_time` into the vertex color attribute `@Cd`:

```c
// Map normalized reveal time to Red channel, leaving Green and Blue for other data
@Cd = set(f@reveal_time, 0.0, 0.0);
```

---

## Phase 2: The Engine Shader

In the game engine (Unreal Material Graph or Unity Shader Graph), the math to compute the reveal is extremely lightweight.

```hlsl
// HLSL logic inside the pixel shader
float revealTime = Input.VertexColor.r;
float progress = RevealProgress; // Scalar parameter driven by Blueprint / script

// Basic cut-off mask
float mask = step(revealTime, progress);

// Optional: Create a glowing leading edge
float edgeWidth = 0.05;
float edgeMask = smoothstep(progress - edgeWidth, progress, revealTime) * (1.0 - mask);
float3 finalColor = lerp(BaseColor, FluidColor, mask) + (GlowColor * edgeMask * GlowIntensity);
```

---

## Why This Technique Rules

- **Extremely Cheap**: The mesh is static (no vertex deformations), and the shader math relies on simple scalar comparisons.
- **Perfect Control**: You can scrub the animation forward, backward, pause it, or tie it to player actions via a single shader parameter.
- **Infinite Resolution**: By using bilinear interpolation of vertex colors, the reveal appears smooth and organic even on mid-poly meshes.

By shifting the computational burden of simulation to Houdini's offline solvers and baking the results into static vertex attributes, we can deliver premium, cinematic visual effects at runtime performance.
