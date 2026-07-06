"use client";

import { useEffect, useRef } from "react";

/**
 * The kit's hero surface: a raymarched SDF form rendered as stochastic
 * dither — a dot-matrix stipple of ink on paper, dense in shadow and
 * sparse in light, with a scatter halo at the silhouette so the mass
 * reads as a resolving particle cloud. Moving the cursor toward it
 * condenses a satellite out of nothing (radius scales with pointer
 * proximity) that merges into the core via smooth-min; the satellite
 * dithers in slate against the core's ink and the two swirl at the
 * seam like oil and water paint rather than blending. Pointer speed
 * adds a surge that relaxes back over ~1.5s, viscous rather than
 * springy. Falls back to a static gradient when WebGL is unavailable,
 * and renders a single still frame under prefers-reduced-motion.
 */
export function DitherBlob({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // preserveDrawingBuffer keeps the last frame in the buffer so static
    // captures (screenshots, virtual-time renders) see the blob instead
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
      uniform vec2 u_ptr;   // pointer, 0..1, y up
      uniform float u_amp;  // perturbation energy, decays in JS
      uniform float u_cell; // dither cell size in device pixels

      // Per-cell stochastic threshold.
      float hash(vec2 q) {
        return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Cheap organic displacement — a few incommensurate sines.
      float wobble(vec3 q, float t) {
        return 0.10 * sin(2.1 * q.x + t * 0.7)
             + 0.09 * sin(2.7 * q.y - t * 0.55)
             + 0.08 * sin(3.3 * q.z + t * 0.4)
             + 0.05 * sin(4.6 * q.x + 3.1 * q.y + t * 0.9);
      }

      float smin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
        return mix(b, a, h) - k * h * (1.0 - h);
      }

      mat2 rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }

      vec3 ptrPoint() {
        // Pointer in view space — the satellite rides the cursor.
        vec2 m = (u_ptr - 0.5) * vec2(2.6, 2.0);
        return vec3(m, 0.9);
      }

      // Proximity of the cursor to the core: 0 at the panel edges, 1 at
      // the mass. This is what births the satellite — it condenses from
      // nothing as the pointer approaches.
      float proximity() {
        return smoothstep(1.55, 0.35, length(ptrPoint().xy));
      }

      float sdBody(vec3 p) {
        // Slow tumble so the highlight migrates around the volume.
        p.xz *= rot(u_t * 0.12);
        p.xy *= rot(sin(u_t * 0.07) * 0.3);
        // Ellipsoid base, breathing on a slow pulse.
        float breath = 1.0 + 0.04 * sin(u_t * 0.3);
        vec3 e = vec3(1.30, 0.95, 1.05) * breath;
        vec3 q = p / e;
        float body = (length(q) - 1.0) * min(e.x, min(e.y, e.z));
        return body + wobble(q * 1.5, u_t) * 0.75;
      }

      float sdLobe(vec3 p) {
        // Satellite radius scales with proximity (born tiny at the edge,
        // swelling as it nears the core); pointer energy adds a surge.
        float prox = proximity();
        float r = prox * (0.34 + 0.28 * u_amp);
        if (r < 0.015) return 1e3;
        return length(p - ptrPoint()) - r;
      }

      float map(vec3 p) {
        return smin(sdBody(p), sdLobe(p), 0.38);
      }

      // Material weight at a surface point: 0 = core, 1 = satellite,
      // with a marbled boundary so the two colors swirl like oil and
      // water paint instead of blending.
      float material(vec3 p) {
        float db = sdBody(p);
        float dl = sdLobe(p);
        float w = clamp(0.5 + (db - dl) / 0.55, 0.0, 1.0);
        float marble = sin(7.0 * p.x + 4.0 * sin(3.1 * p.y + u_t * 0.25))
                     * sin(6.0 * p.y + 3.5 * sin(2.6 * p.z - u_t * 0.2));
        return smoothstep(0.44, 0.56, w + 0.28 * marble);
      }

      vec3 normalAt(vec3 p) {
        vec2 h = vec2(0.012, 0.0);
        return normalize(vec3(
          map(p + h.xyy) - map(p - h.xyy),
          map(p + h.yxy) - map(p - h.yxy),
          map(p + h.yyx) - map(p - h.yyx)
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * 1.3;
        vec3 ro = vec3(0.0, 0.0, 3.1);
        vec3 rd = normalize(vec3(uv, -1.55));

        float t = 0.0;
        bool hit = false;
        float dmin = 1e3; // nearest approach — drives the silhouette scatter
        vec3 p = ro;
        for (int i = 0; i < 56; i++) {
          p = ro + rd * t;
          float d = map(p);
          dmin = min(dmin, d);
          if (d < 0.004) { hit = true; break; }
          // Conservative step — the wobble displacement breaks the strict
          // SDF bound, so marching at full distance leaves crease artifacts.
          t += d * 0.6;
          if (t > 6.5) break;
        }

        // Ink density: how likely this cell is to carry a dot.
        float density = 0.0;
        float m = 0.0;
        if (hit) {
          vec3 n = normalAt(p);
          vec3 l = normalize(vec3(-0.45, 0.75, 0.55));
          float dif = clamp(dot(n, l), 0.0, 1.0);
          float spec = pow(clamp(dot(reflect(-l, n), -rd), 0.0, 1.0), 28.0);
          float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
          m = material(p);
          // Stipple shading: dense in shadow, sparse in light, softened
          // under the specular highlight, feathered at the rim so the
          // edge dissolves into scatter instead of cutting a silhouette.
          density = 0.62 - 0.34 * dif - 0.30 * spec - 0.22 * fres;
          // The satellite dithers lighter than the core; the marbled
          // material seam reads as swirls of differing grain.
          density *= mix(1.0, 0.5, m);
          density = clamp(density, 0.06, 0.85);
        } else {
          // Scatter halo: stray dots just outside the surface, plus the
          // faintest atmospheric drift across otherwise clean paper.
          density = 0.22 * exp(-dmin * 26.0)
                  + 0.004 * (0.5 + 0.5 * sin(u_t * 0.3));
        }

        // Stochastic threshold per dither cell; the grain re-seeds a few
        // times a second so the form reads as resolving, not frozen.
        vec2 cell = floor(gl_FragCoord.xy / u_cell);
        float seed = floor(u_t * 5.0);
        float dot_ = step(hash(cell + seed * vec2(7.31, 3.17)), density);

        vec3 paper = vec3(0.937, 0.937, 0.961); // #EFEFF5
        vec3 ink = vec3(0.059, 0.090, 0.165);   // #0F172A
        vec3 slate = vec3(0.580, 0.639, 0.722); // #94A3B8
        vec3 col = mix(paper, mix(ink, slate, m * 0.85), dot_);
        gl_FragColor = vec4(col, 1.0);
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
    const uAmp = gl.getUniformLocation(prog, "u_amp");
    const uCell = gl.getUniformLocation(prog, "u_cell");

    // Pointer state: position eases toward the cursor; energy rises with
    // pointer speed and decays viscously (~1.5s relax).
    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, amp: 0 };
    let last = { x: 0.5, y: 0.5 };
    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      const nx = (e.clientX - r.left) / Math.max(1, r.width);
      const ny = 1 - (e.clientY - r.top) / Math.max(1, r.height);
      ptr.tx = nx;
      ptr.ty = ny;
      const speed = Math.hypot(nx - last.x, ny - last.y);
      ptr.amp = Math.min(1, ptr.amp + speed * 2.2);
      last = { x: nx, y: ny };
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    let prev = start;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame() {
      const now = performance.now();
      const dt = Math.min(0.25, (now - prev) / 1000);
      prev = now;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (canvas!.width !== w * dpr || canvas!.height !== h * dpr) {
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }
      // Ease toward the pointer, never snap; let the lobe energy bleed
      // off. Time-based so behavior is frame-rate independent.
      const ease = 1 - Math.exp(-dt * 3.6);
      ptr.x += (ptr.tx - ptr.x) * ease;
      ptr.y += (ptr.ty - ptr.y) * ease;
      ptr.amp *= Math.exp(-dt * 1.5);
      gl!.uniform1f(uT, (performance.now() - start) / 1000);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform2f(uPtr, ptr.x, ptr.y);
      gl!.uniform1f(uAmp, ptr.amp);
      gl!.uniform1f(uCell, Math.max(2, Math.round(1.5 * dpr)));
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
            "radial-gradient(60% 55% at 50% 48%, rgba(15,23,42,0.35) 0%, rgba(15,23,42,0.08) 55%, transparent 75%), #EFEFF5",
        }}
      />
    </div>
  );
}
