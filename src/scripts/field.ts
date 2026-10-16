/**
 * Hero field: a slowly turning peptide chain (an alpha helix of residues with
 * short side chains) in a drifting particle haze, drawn as GL points.
 *
 * Plain WebGL, no library: ~1,300 points, one draw call, additive blending.
 * The cursor tilts the scene and pushes nearby particles aside. Rendering
 * pauses when the hero is off screen or the tab is hidden. With `still`, a
 * single frame is drawn and nothing moves.
 *
 * Geometry follows the alpha helix: 3.6 residues per turn (100° each), 1.5 Å
 * rise per residue, 2.3 Å radius — scaled to scene units.
 */

interface FieldOptions {
  still: boolean;
}

const VERT = `
attribute vec3 a_pos;
attribute float a_kind;
attribute float a_seed;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform float u_dpr;
uniform vec2 u_offset;
uniform float u_scale;
varying vec3 v_color;
varying float v_alpha;

mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }

void main(){
  vec3 p = a_pos;
  float t = u_time;
  if (a_kind > 0.5) {
    // Chain: spin about its own long axis, with a slow travelling wave.
    p = rotX(t * 0.16) * p;
    p.y += sin(p.x * 0.22 + t * 0.5) * 0.6;
  } else {
    // Haze: slow independent drift.
    float s = a_seed * 6.2831;
    p += vec3(sin(t * 0.07 + s), cos(t * 0.05 + s * 1.3), sin(t * 0.06 + s * 0.7)) * 0.6;
  }
  p *= u_scale;
  // Three-quarter view so the coil reads in depth, then cursor tilt.
  p = rotY(0.62) * p;
  p = rotZ(-0.38) * p;
  p = rotY(u_mouse.x * 0.3) * rotX(-u_mouse.y * 0.2) * p;
  p.xy += u_offset;

  float camZ = 30.0;
  float z = camZ - p.z;
  float aspect = u_res.x / u_res.y;
  float k = 2.3;
  vec2 ndc = vec2(p.x * k / z / aspect, p.y * k / z);

  // Cursor pushes particles aside.
  vec2 m = u_mouse;
  vec2 d = (ndc - m) * vec2(aspect, 1.0);
  float dist = length(d);
  float push = smoothstep(0.32, 0.0, dist);
  ndc += normalize(d + 1e-5) / vec2(aspect, 1.0) * push * 0.06;

  gl_Position = vec4(ndc, 0.0, 1.0);

  float depth = clamp((z - 20.0) / 20.0, 0.0, 1.0);
  float size;
  vec3 col;
  if (a_kind > 3.5) {        // hydrogen bond (i -> i+4), dotted
    size = 2.6; col = vec3(0.51, 0.78, 0.70) * 0.7;
  } else if (a_kind > 2.5) { // side chain
    size = 5.0; col = vec3(0.51, 0.78, 0.70);
  } else if (a_kind > 1.5) { // residue (alpha carbon)
    size = 12.0; col = vec3(0.84, 0.65, 0.31);
  } else if (a_kind > 0.5) { // backbone
    size = 4.2; col = vec3(0.93, 0.91, 0.88);
  } else {                   // haze
    size = 1.6 + a_seed * 2.2; col = vec3(0.93, 0.91, 0.88);
  }
  gl_PointSize = size * u_dpr * (30.0 / z) * mix(1.35, 0.55, depth);
  v_color = col * (1.0 + push * 0.9);
  float base = a_kind > 0.5 ? 0.95 : 0.28;
  v_alpha = base * (1.0 - depth * 0.85);
}
`;

const FRAG = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  float a = smoothstep(0.5, 0.0, r);
  a = a * a;
  gl_FragColor = vec4(v_color * a * v_alpha, a * v_alpha);
}
`;

function buildGeometry(): { data: Float32Array; count: number } {
  const out: number[] = [];
  const push = (x: number, y: number, z: number, kind: number, seed: number): void => {
    out.push(x, y, z, kind, seed);
  };

  // Units: 1 scene unit ≈ 1 Å.
  const residues = 26;
  const rise = 1.5;
  const radius = 2.3;
  const turn = (100 * Math.PI) / 180;
  const length = (residues - 1) * rise;
  const x0 = -length / 2;
  const backbonePerResidue = 18;

  for (let i = 0; i < residues; i++) {
    for (let k = 0; k < backbonePerResidue; k++) {
      const s = i + k / backbonePerResidue;
      if (s > residues - 1) break;
      const a = s * turn;
      // Three strands give the backbone a ribbon's width, so its twist shows.
      for (const r of [radius - 0.32, radius, radius + 0.32]) {
        push(x0 + s * rise, Math.cos(a) * r, Math.sin(a) * r, 1, Math.random());
      }
    }
    const a = i * turn;
    const cx = x0 + i * rise;
    const cy = Math.cos(a) * radius;
    const cz = Math.sin(a) * radius;
    push(cx, cy, cz, 2, Math.random());
    // Side chain: a short stalk pointing outward from the helix axis.
    const stalk = 2 + (i % 3);
    for (let j = 1; j <= stalk; j++) {
      const r = radius + j * 0.75;
      push(cx + j * 0.12, Math.cos(a) * r, Math.sin(a) * r, 3, Math.random());
    }
  }

  // Hydrogen bonds: residue i to i+4, the bond that holds an alpha helix together.
  for (let i = 0; i + 4 < residues; i++) {
    const a1 = i * turn;
    const a2 = (i + 4) * turn;
    const p1 = [x0 + i * rise, Math.cos(a1) * radius, Math.sin(a1) * radius];
    const p2 = [x0 + (i + 4) * rise, Math.cos(a2) * radius, Math.sin(a2) * radius];
    for (let k = 1; k < 9; k++) {
      const t = k / 9;
      push(p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t, p1[2] + (p2[2] - p1[2]) * t, 4, Math.random());
    }
  }

  // Haze: a wide shallow slab of particles.
  for (let i = 0; i < 900; i++) {
    push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 34, (Math.random() - 0.5) * 18, 0, Math.random());
  }

  return { data: new Float32Array(out), count: out.length / 5 };
}

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error('shader');
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'compile');
  return sh;
}

export function mountField(host: HTMLElement, { still }: FieldOptions): void {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return;

  const prog = gl.createProgram();
  if (!prog) return;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const { data, count } = buildGeometry();
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const stride = 5 * 4;
  const attr = (name: string, size: number, offset: number): void => {
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
  };
  attr('a_pos', 3, 0);
  attr('a_kind', 1, 12);
  attr('a_seed', 1, 16);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uTime = u('u_time');
  const uMouse = u('u_mouse');
  const uRes = u('u_res');
  const uDpr = u('u_dpr');
  const uOffset = u('u_offset');
  const uScale = u('u_scale');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  host.appendChild(canvas);

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = (): void => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uDpr, dpr);
    const wide = w / h > 1.1;
    // Desktop: chain sits upper right behind the portrait column.
    // Phones: centred in the upper half, scaled to the narrow viewport.
    gl.uniform2f(uOffset, wide ? 8.5 : 0.8, wide ? 0.6 : 5.2);
    gl.uniform1f(uScale, wide ? 0.95 : 0.5);
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!still && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        const r = host.getBoundingClientRect();
        mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
      },
      { passive: true }
    );
  }

  const draw = (time: number): void => {
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, count);
  };

  if (still) {
    draw(12);
    canvas.dataset.ready = 'true';
    return;
  }

  let visible = true;
  let raf = 0;
  const t0 = performance.now();
  const loop = (now: number): void => {
    draw(8 + (now - t0) / 1000);
    raf = requestAnimationFrame(loop);
  };
  const run = (): void => {
    cancelAnimationFrame(raf);
    if (visible && !document.hidden) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    run();
  }).observe(host);
  document.addEventListener('visibilitychange', run);

  draw(8);
  requestAnimationFrame(() => (canvas.dataset.ready = 'true'));
  run();
}
