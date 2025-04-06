# GLSL Shader Playground

A development environment for experimenting with GLSL shaders using Three.js and TypeScript. This project provides a simple setup to write, test, and visualize GLSL shaders in real-time.

## Overview

This project is built with:
- Vite
- Three.js
- TypeScript
- GLSL

Perfect for:
- Learning GLSL shader programming
- Experimenting with fragment and vertex shaders
- Visualizing shader effects in real-time
- Testing shader concepts and ideas

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.0 or higher)
- npm, pnpm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nkosinathimagagula/LearnIt
```

2. Navigate to the project directory:
```bash
cd 3D/shaders/playground
```

3. Install dependencies:
```bash
npm install
# or
pnpm i
# or
yarn

```

## Running the Project
```bash
npm run dev
# or
pnpm dev
# or
yarn dev

```

## Project Structure
```text
├── src/
│   ├── shaders/                         # GLSL shaders 
|   |   |   ├── shader-name/             # GLSL shader files
│   │   |   |       ├── fragment.glsl    # Fragment shader
│   │   |   |       └── vertex.glsl      # Vertex shader
│   ├── main.ts                          # Main application entry
│   └── style.css                        # Global styles
├── public/                              # Static assets
└── index.html                           # HTML entry point
```

## Working with Shaders
1. Create new shader files in the src/shaders directory
2. Import and use them in your Three.js materials
```typescript
// Import
import vertexShader from "./shaders/shader-name/vertex.glsl?raw";
import fragmentShader from "./shaders/shader-name/fragment.glsl?raw";

...
...
...

// Add them in Three.js material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {},
});

```
3. Hot reload will automatically update the visualization

## Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [The Book of Shaders](https://thebookofshaders.com/)
