# Abusing Houdini APEX: Bone-Driven RBD Exports for Games

When exporting complex Rigid Body Dynamics (RBD) simulations to game engines like Unreal Engine or Unity, the standard pathway usually involves the SideFX Labs RBD Export tool. While this tool is fantastic for straightforward cases, it often becomes a bottleneck when you need precise control over the skeleton hierarchy, bone names, joint orientations, and optimization of skin weights.

To solve this, we can "abuse" Houdini's APEX (Animation Playback & Effects) rigging system to pin a bone to the centroid of each fractured fragment. This approach turns our simulation into a standard skeletal mesh animation, providing granular control over the export process.

---

## Why APEX?

Traditional exports often generate flat, arbitrarily named hierarchies that are difficult to manage at runtime. By utilizing APEX, we can:
- Define structured bone hierarchies (e.g., nesting fragments under a logical root or parent structure).
- Assign clean, human-readable names to joints based on custom rules.
- Pre-align joint coordinate spaces to match game engine requirements.
- Rig fragments with clean 1:1 skin weights, completely avoiding vertex interpolation artifacts.

---

## The Workflow Step-by-Step

### 1. Extracting Centroids and Transform Matrices
First, we run the RBD simulation. Once the simulation is cached, we extract the centroids of each fractured piece to represent our joint locations. We use a **Point Wrangle** to extract the translation and rotation of each piece:

```c
// Get the transform representation of our packed fragments
matrix3 rot = primintrinsic(0, "transform", @primnum);
vector translation = primintrinsic(0, "pivot", @primnum);

// Store transform components for the APEX rigging network
3@joint_orient = rot;
v@joint_pos = translation;
s@joint_name = sprintf("joint_%s", s@name);
```

### 2. Dynamically Generating the Skeleton with APEX
Instead of drawing joints manually, we feed our points into an APEX network. Using the new APEX Graph, we dynamically generate a skeleton where:
1. A base `root` joint is established.
2. A joint is instantiated for each point using `@joint_name`.
3. The rest transforms are set using `@joint_pos` and `@joint_orient`.

This bypasses the rigid structure of traditional rigging editors and lets us programmatically build skeleton chains on the fly.

### 3. Rigging via 100% Skin Weights
Since rigid fragments shouldn't deform when moving, we must ensure every vertex in a piece is bound to exactly one joint with a weight of `1.0`. 

We can write a quick VEX loop in a **Geometry Wrangle** to build our capture attributes (`boneCapture` or `captgweights`):

```c
// Assign 100% weight to corresponding bone name
s[]@captgjoint = array(s@joint_name);
f[]@captgweight = array(1.0);
```

This guarantees that during export, the vertices of fragment `A` follow joint `A` perfectly with zero soft-skinning calculations.

### 4. Driving Joints with Simulation Channels
With the skeleton generated and the mesh bound, we map our cached simulation transforms onto the APEX joints. Because the APEX graph operates on simple transform streams, we feed our packed primitive simulation transforms directly into the joint animation channels.

### 5. Exporting via FBX
Finally, export the skeletal mesh and animation track. Since it is now structured as standard skeletal animation data, it imports seamlessly into Unreal Engine as a single `SkeletalMesh` asset with a single `AnimSequence` track, matching our exact naming conventions and hierarchy.

---

## Conclusion

Abusing APEX for RBD exports gives VFX TDs the keys to the castle when dealing with game engine constraints. It bridges the gap between procedural destruction and runtime performance, showing that Houdini's rigging tools are just as powerful for FX pipelines as they are for character animation.
