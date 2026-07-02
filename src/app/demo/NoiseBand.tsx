"use client";

import { useEffect, useRef } from "react";

/**
 * The kit's ambient WebGL surface: a fluid wave field — amber plasma on
 * near-black, sparse lime motes — breathing on a slow pulse, drifting
 * subtly toward the pointer. Falls back to a static gradient when WebGL
 * is unavailable, and renders a single still frame under
 * prefers-reduced-motion.
 */
export function NoiseBand({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // preserveDrawingBuffer keeps the last frame in the buffer so static
    // captures (screenshots, virtual-time renders) see the field instead
    // of a cleared black canvas.
    const gl = canvas.getContext("webgl", {
      antialias: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      fallbackRef.current?.style.setProperty("opacity", "1");
      return;
    }

    const vert = `
      attribute vec2 p;
      void main() { gl_Position = vec4(p, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_t;
      uniform vec2 u_res;
      uniform vec2 u_ptr;

      float hash(vec2 q) {
        return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 q) {
        vec2 i = floor(q);
        vec2 f = fract(q);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 q) {
        float v = 0.0;
        float a = 0.5;
        for (int k = 0; k < 4; k++) {
          v += a * noise(q);
          q = q * 2.05 + vec2(13.7, 7.3);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 q = uv * vec2(u_res.x / u_res.y, 1.0) * 2.6;
        float breath = 0.72 + 0.28 * sin(u_t * 0.3);
        vec2 drift = (u_ptr - 0.5) * 0.18;
        float n = fbm(q + vec2(u_t * 0.025, -u_t * 0.018) + drift);
        n = fbm(q * 0.9 + n * 1.6 + drift);
        float glow = smoothstep(0.26, 0.78, n) * breath;
        // Sparse bright motes riding the field — the tertiary lime accent.
        float motes = smoothstep(0.94, 1.0, noise(q * 7.0 + u_t * 0.05)) * breath;
        vec3 base = vec3(0.022, 0.014, 0.008);
        vec3 plasma = vec3(0.96, 0.62, 0.04);
        vec3 mote = vec3(0.68, 0.99, 0.05);
        vec3 col = base + glow * plasma * 0.65 + motes * mote * 0.85;
        // CRT scanline whisper + edge vignette.
        col *= 0.94 + 0.06 * sin(gl_FragCoord.y * 1.6);
        float vig = 1.0 - 0.55 * pow(distance(uv, vec2(0.5)), 1.8);
        gl_FragColor = vec4(col * vig, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      fallbackRef.current?.style.setProperty("opacity", "1");
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "u_t");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uPtr = gl.getUniformLocation(prog, "u_ptr");

    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      ptr.tx = (e.clientX - r.left) / Math.max(1, r.width);
      ptr.ty = 1 - (e.clientY - r.top) / Math.max(1, r.height);
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas!.width !== w * dpr || canvas!.height !== h * dpr) {
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }
      // Drift toward the pointer, never snap.
      ptr.x += (ptr.tx - ptr.x) * 0.04;
      ptr.y += (ptr.ty - ptr.y) * 0.04;
      gl!.uniform1f(uT, (performance.now() - start) / 1000);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(uPtr, ptr.x, ptr.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      canvas!.dataset.painted = "1";
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Positioning comes from className (e.g. `absolute inset-0`); defaults
  // to `relative` so the canvas + fallback have something to anchor to.
  return (
    <div className={["overflow-hidden", className ?? "relative"].join(" ")}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* DOM fallback — revealed only when WebGL is unavailable. */}
      <div
        ref={fallbackRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 40%, rgba(245,158,11,0.22) 0%, transparent 55%), radial-gradient(90% 80% at 75% 70%, rgba(251,191,36,0.10) 0%, transparent 60%), #030303",
        }}
      />
    </div>
  );
}
