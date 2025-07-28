import {
    Renderer,
    Camera,
    Transform,
    Plane,
    Program,
    Mesh,
  } from 'https://cdn.skypack.dev/ogl';
  
  // ===== Aurora for COUNTRIES =====
  function initCountriesAurora() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
  
    const renderer = new Renderer({ canvas });
    const gl = renderer.gl;
    renderer.setSize(window.innerWidth, 600);
  
    const camera = new Camera(gl);
    camera.position.z = 1;
    const scene = new Transform();
  
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        varying vec2 vUv;
  
        void main() {
          float t = uTime * 0.1;
          vec2 uv = vUv;
          float x = uv.x * 10.0;
          float wave = sin(x + t) * 0.05 + 0.5;
          float intensity = smoothstep(0.48, 0.52, abs(uv.y - wave));
          vec3 color = mix(vec3(0.1, 0.4, 0.8), vec3(0.6, 1.0, 0.8), intensity);
          gl_FragColor = vec4(color, intensity);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
    });
  
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
  
    function update(t) {
      requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene, camera });
    }
    update(0);
  
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, 600);
    });
  }
  
  // ===== Aurora for TRENDING CITIES =====
  function initCitiesAurora() {
    const canvas = document.getElementById('aurora-canvas-cities');
    if (!canvas) return;
  
    const renderer = new Renderer({ canvas });
    const gl = renderer.gl;
    renderer.setSize(window.innerWidth, 600);
  
    const camera = new Camera(gl);
    camera.position.z = 1;
    const scene = new Transform();
  
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        varying vec2 vUv;
  
        void main() {
          vec2 p = vUv;
          float x = p.x * 10.0;
          float y = sin(x + uTime) * 0.1 + 0.5;
          float wave = smoothstep(0.48, 0.5, abs(p.y - y));
          vec3 color = mix(vec3(0.0, 0.1, 0.5), vec3(0.3, 0.9, 1.0), wave);
          gl_FragColor = vec4(color, wave);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new Color(0x0f172a) }, // Dark Slate
        uColorB: { value: new Color(0x334155) }, // Cool Blue Gray
      },
    });
  
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);
  
    function update(t) {
      requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene, camera });
    }
    update(0);
  
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, 600);
    });
  }
  
  // ===== INIT ALL ON PAGE LOAD =====
  window.addEventListener('DOMContentLoaded', () => {
    initCountriesAurora();
    initCitiesAurora();
  });
  