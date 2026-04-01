"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";

/**
 * LavaGlow — wraps any element with a WebGL lava-lamp hover canvas overlay.
 * The canvas sits absolutely inside the wrapper and fades in on hover.
 * Cursor-tracking simplex noise creates an organic swirl effect.
 */

type LavaGlowProps = {
  children: ReactNode;
  /** Shader colors as [r,g,b] tuples (0-1). Defaults to warm orange. */
  color1?: [number, number, number];
  color2?: [number, number, number];
  color3?: [number, number, number];
  className?: string;
};

const VERT = `#version 300 es
in vec4 a_pos; out vec2 vUv;
void main(){ vUv=a_pos.xy*.5+.5; gl_Position=a_pos; }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform float uT,uH,uA; uniform vec2 uM; uniform vec3 uC1,uC2,uC3;
vec4 pm(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 ti(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0,.5,1,2);
  vec3 i=floor(v+dot(v,C.yyy)),x0=v-i+dot(i,C.xxx),
    g=step(x0.yzx,x0.xyz),l=1.-g,i1=min(g,l.zxy),i2=max(g,l.zxy),
    x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-D.yyy;
  i=mod(i,289.);
  vec4 p=pm(pm(pm(i.z+vec4(0,i1.z,i2.z,1))+i.y+vec4(0,i1.y,i2.y,1))
    +i.x+vec4(0,i1.x,i2.x,1));
  float n_=1./7.;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z),x_=floor(j*ns.z),y_=floor(j-7.*x_),
    x=x_*ns.x+ns.yyyy,y=y_*ns.x+ns.yyyy,h=1.-abs(x)-abs(y),
    b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw),
    s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.,sh=-step(h,vec4(0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 nm=ti(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
void main(){
  vec2 uv=vUv;uv.x*=uA;vec2 ms=uM;ms.x*=uA;
  float d=length(uv-ms),inf=smoothstep(.8,0.,d),t=uT*.4;
  vec3 c=vec3(uv*2.5,t);c.xy+=(ms-uv)*inf*.6;
  float n1=sn(c),n2=sn(c*2.+vec3(5.2,1.3,t*.7)),n3=sn(c*4.+vec3(8.1,3.7,t*1.1));
  float n=clamp((n1*.5+n2*.3+n3*.2)*.5+.5+inf*.3,0.,1.);
  vec3 col=mix(mix(uC1,uC2,n),uC3,n2*.5+.5);
  float a=smoothstep(.3,.6,n)*(.4+inf*.5)*uH;
  o=vec4(col,a);
}`;

export function LavaGlow({
  children,
  color1 = [1.0, 0.72, 0.4],
  color2 = [1.0, 0.85, 0.6],
  color3 = [0.9, 0.55, 0.2],
  className,
}: LavaGlowProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const st = useRef({
    gl: null as WebGL2RenderingContext | null,
    prog: null as WebGLProgram | null,
    u: {} as Record<string, WebGLUniformLocation | null>,
    hv: 0, hovering: false,
    mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, raf: 0,
  });

  const loop = useCallback(() => {
    const s = st.current, gl = s.gl;
    if (!gl || !s.prog) return;
    s.mx += (s.tx - s.mx) * 0.08;
    s.my += (s.ty - s.my) * 0.08;
    s.hv += ((s.hovering ? 1 : 0) - s.hv) * 0.06;
    gl.uniform1f(s.u.uT, performance.now() * 0.001);
    gl.uniform2f(s.u.uM, s.mx, s.my);
    gl.uniform1f(s.u.uH, s.hv);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (s.hv > 0.01 || s.hovering) s.raf = requestAnimationFrame(loop);
    else s.raf = 0;
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const gl = c.getContext("webgl2", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    const s = st.current;
    s.gl = gl;
    const mk = (t: number, src: string) => {
      const sh = gl.createShader(t)!;
      gl.shaderSource(sh, src); gl.compileShader(sh); return sh;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, mk(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p); gl.useProgram(p); s.prog = p;
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, "a_pos");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(p, n);
    s.u = { uT:u("uT"), uM:u("uM"), uH:u("uH"), uA:u("uA"), uC1:u("uC1"), uC2:u("uC2"), uC3:u("uC3") };
    gl.uniform3f(s.u.uC1, ...color1);
    gl.uniform3f(s.u.uC2, ...color2);
    gl.uniform3f(s.u.uC3, ...color3);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const ro = new ResizeObserver(() => {
      const r = c.parentElement!.getBoundingClientRect();
      const dpr = devicePixelRatio;
      c.width = r.width * dpr; c.height = r.height * dpr;
      c.style.width = r.width + "px"; c.style.height = r.height + "px";
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform1f(s.u.uA, r.width / r.height);
    });
    ro.observe(c.parentElement!);
    return () => { ro.disconnect(); if (s.raf) cancelAnimationFrame(s.raf); };
  }, [color1, color2, color3, loop]);

  const enter = useCallback(() => {
    const s = st.current; s.hovering = true;
    if (!s.raf) s.raf = requestAnimationFrame(loop);
  }, [loop]);

  const leave = useCallback(() => { st.current.hovering = false; }, []);

  const move = useCallback((e: React.MouseEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    st.current.tx = (e.clientX - r.left) / r.width;
    st.current.ty = 1 - (e.clientY - r.top) / r.height;
  }, []);

  return (
    <span
      ref={wrapRef}
      className={className}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onMouseMove={move}
      style={{ position: "relative", display: "inline-flex", overflow: "hidden", borderRadius: "inherit" }}
    >
      <span
        style={{
          position: "absolute", inset: -2, zIndex: 0, overflow: "hidden",
          borderRadius: "inherit", pointerEvents: "none",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block" }} />
      </span>
      {children}
    </span>
  );
}
