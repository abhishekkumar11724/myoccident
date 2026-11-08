/**
 * Liquid chrome behaviour (vanilla, ~6 KB gzip):
 *  1. WebGL mercury blob (raw fragment shader: metaball field -> height -> normals -> fake sky/horizon/ground environment map)
 *  2. nav: mobile menu + active section
 *  3. case-study index: hover / focus / click swaps the preview plate
 *  4. pointer edge light on glass cards
 *  5. photo lightbox
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ 1. blob */
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uT; uniform float uN; uniform float uSeed; uniform vec3 uM;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 env(vec3 r,float t){
  float y=r.y+.14+0.08*sin(t*.25);
  float az=atan(r.x,r.z);
  vec3 sky=mix(vec3(.97,.99,1.),vec3(.42,.66,1.),smoothstep(0.,.3,y));
  sky=mix(sky,vec3(.06,.2,.64),smoothstep(.25,.85,y));
  sky=mix(sky,vec3(.015,.045,.2),smoothstep(.8,1.,y));
  float band=smoothstep(.5,.62,sin(az*2.+y*3.+t*.07))*smoothstep(.02,.12,y)*(1.-smoothstep(.3,.62,y));
  sky+=vec3(.55,.66,.9)*band*.5;
  float bar=smoothstep(.05,.0,abs(y-.4)-.03)*(.55+.45*sin(az*3.+t*.1+1.));
  float bar2=smoothstep(.04,.0,abs(y-.72)-.015)*smoothstep(-.2,.6,sin(az*2.-1.+t*.06));
  sky+=vec3(1.)*(bar*.8+bar2*.7);
  vec3 sd=normalize(vec3(-.45,.5,.6));
  sky+=vec3(1.,.96,.9)*pow(max(dot(normalize(vec3(r.x,y,r.z)),sd),0.),380.)*7.;
  float gy=-y;
  vec3 g=mix(vec3(.66,.76,.95),vec3(.1,.17,.38),smoothstep(0.,.22,gy));
  g=mix(g,vec3(.012,.024,.07),smoothstep(.2,.8,gy));
  g+=vec3(.3,.46,.9)*smoothstep(.86,.97,sin(az*5.+t*.08+gy*6.))*smoothstep(0.,.14,gy)*(1.-smoothstep(.3,.7,gy));
  vec3 c=mix(g,sky,smoothstep(-.006,.006,y));
  c+=vec3(.9,.95,1.)*exp(-y*y*7000.)*.85;
  return c;
}
void main(){
  float S=min(uRes.x,uRes.y);
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/S*2.;
  float t=uT;
  float F=0.; vec2 gF=vec2(0.);
  for(int i=0;i<8;i++){
    if(float(i)>=uN) break;
    float fi=float(i)+uSeed;
    vec2 c=vec2(sin(t*(.21+.06*fi)+fi*1.9)*.44+.08*sin(t*.37+fi*2.),cos(t*(.17+.05*fi)+fi*3.1)*.42);
    float r=(i==0)?.33:.17+.07*sin(fi*2.3+t*.22);
    vec2 d=uv-c; float q=dot(d,d)+.0016; float r2=r*r;
    F+=r2/q; gF+=-2.*r2*d/(q*q);
  }
  if(uM.z>0.){
    vec2 d=uv-uM.xy; float q=dot(d,d)+.0016; float r2=.17*.17*uM.z;
    F+=r2/q; gF+=-2.*r2*d/(q*q);
  }
  float g=1.-1./F;
  if(g<=0.){gl_FragColor=vec4(0.);return;}
  vec2 gG=gF/(F*F);
  float edgePx=g/(length(gG)+1e-5)*S*.5;
  float a=clamp(edgePx+.5,0.,1.);
  float sg=max(sqrt(g),.03);
  vec2 dz=.62*.5/sg*gG;
  vec3 n=normalize(vec3(-dz,1.));
  n.xy+=.025*vec2(sin(uv.y*13.+t*.7),cos(uv.x*11.-t*.6))*(1.-n.z);
  n=normalize(n);
  vec3 R=reflect(vec3(0.,0.,-1.),n);
  vec3 col=env(R,t);
  float ndv=n.z, fr=pow(1.-ndv,3.);
  vec3 ir=.5+.5*cos(6.2832*(vec3(0.,.33,.67)+ndv*1.7+t*.015));
  col=mix(col,col*ir*1.6+ir*.1,fr*.6);
  col*=.82+.22*ndv;
  col=col/(1.+.16*col);
  col+=(hash(gl_FragCoord.xy+t)-.5)/200.;
  gl_FragColor=vec4(col*a,a);
}`;

function startBlob(canvas: HTMLCanvasElement): void {
  const wrap = canvas.parentElement as HTMLElement;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' }) as WebGLRenderingContext | null;
  if (!gl) return;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uT = U('uT'), uN = U('uN'), uSeed = U('uSeed'), uM = U('uM');
  gl.uniform1f(uN, Number(canvas.dataset.balls || 5));
  gl.uniform1f(uSeed, Number(canvas.dataset.seed || 1));
  gl.clearColor(0, 0, 0, 0);

  const coarse = matchMedia('(pointer: coarse)').matches;
  let quality = coarse ? 0.8 : 1;
  let visible = true, raf = 0, lastDraw = 0, frames = 0, slow = 0;
  const t0 = performance.now();
  const mouse = { x: 0, y: 0, w: 0, target: 0 };

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  };
  const draw = (t: number) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uT, t);
    mouse.w += (mouse.target - mouse.w) * 0.06;
    gl.uniform3f(uM, mouse.x, mouse.y, mouse.w);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    if (coarse && now - lastDraw < 33) return;       // 30 fps on phones
    const dt = now - lastDraw; lastDraw = now;
    draw((now - t0) / 1000);
    // adaptive resolution: if frames stay slow, render fewer pixels
    if (++frames > 30 && dt > 34) { if (++slow > 20 && quality > 0.5) { quality *= 0.8; slow = 0; frames = 0; size(); } }
  };
  const kick = () => { if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop); };

  size();
  draw(reduce ? 11.3 : 0);
  canvas.classList.add('ready'); wrap.classList.add('gl');

  new ResizeObserver(() => { size(); if (reduce || !raf) draw(reduce ? 11.3 : (performance.now() - t0) / 1000); }).observe(canvas);
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) kick(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }).observe(canvas);
  document.addEventListener('visibilitychange', kick);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); canvas.classList.remove('ready'); wrap.classList.remove('gl'); });

  if (!reduce && !coarse) {
    window.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top - 80 || e.clientY > r.bottom + 80) { mouse.target = 0; return; }
      const S = Math.min(r.width, r.height) / 2;
      mouse.x = Math.max(-.7, Math.min(.7, (e.clientX - (r.left + r.width / 2)) / S));
      mouse.y = Math.max(-.7, Math.min(.7, -((e.clientY - (r.top + r.height / 2)) / S)));
      mouse.target = 1;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { mouse.target = 0; });
  }
  kick();
}
document.querySelectorAll<HTMLCanvasElement>('canvas[data-lc-blob]').forEach((c) => { try { startBlob(c); } catch { /* CSS fallback stays visible */ } });

/* ------------------------------------------------------------------ 2. nav */
const nav = document.getElementById('lc-nav');
const btn = nav?.querySelector<HTMLButtonElement>('.menu-btn');
const closeMenu = () => { nav?.classList.remove('open'); btn?.setAttribute('aria-expanded', 'false'); if (btn) btn.textContent = 'Menu'; };
btn?.addEventListener('click', () => {
  const open = nav!.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
  btn.textContent = open ? 'Close' : 'Menu';
});
nav?.querySelectorAll('.lc-links a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav?.classList.contains('open')) { closeMenu(); btn?.focus(); } });
const links = new Map<string, HTMLAnchorElement>();
nav?.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((a) => links.set(a.dataset.nav!, a));
const io = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    links.forEach((a, id) => (id === en.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }
}, { rootMargin: '-45% 0px -50% 0px' });
['hero', ...links.keys()].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });

/* ------------------------------------------------------------------ 3. case-study index */
const idx = document.querySelector<HTMLElement>('[data-lc-index]');
if (idx) {
  const rows = [...idx.querySelectorAll<HTMLAnchorElement>('.idx-row')];
  const plates = [...idx.querySelectorAll<HTMLElement>('.cs')];
  const desk = matchMedia('(min-width: 1000px)');
  const set = (i: number) => {
    rows.forEach((r, k) => (k === i ? r.setAttribute('aria-current', 'true') : r.removeAttribute('aria-current')));
    plates.forEach((p, k) => p.classList.toggle('on', k === i));
  };
  rows.forEach((r, i) => {
    r.addEventListener('pointerenter', () => { if (desk.matches) set(i); });
    r.addEventListener('focus', () => { if (desk.matches) set(i); });
    r.addEventListener('click', (e) => { if (desk.matches) { e.preventDefault(); set(i); } });
    r.addEventListener('keydown', (e) => {
      if (!desk.matches) return;
      const k = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (k) { e.preventDefault(); rows[(i + k + rows.length) % rows.length].focus(); }
    });
  });
  // a deep link to a plate selects it on desktop; the stacked mobile layout needs nothing
  const fromHash = () => { const h = decodeURIComponent(location.hash.slice(1)); const i = plates.findIndex((p) => p.id === h); if (i >= 0 && desk.matches) set(i); };
  fromHash(); addEventListener('hashchange', fromHash);
}

/* ------------------------------------------------------------------ 4. pointer edge light */
if (!reduce) {
  document.addEventListener('pointermove', (e) => {
    const g = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('.glass');
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty('--mx', `${e.clientX - r.left}px`); g.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}

/* ------------------------------------------------------------------ 5. lightbox */
const lb = document.getElementById('lc-lb') as HTMLDialogElement | null;
if (lb) {
  const shots = [...document.querySelectorAll<HTMLButtonElement>('button[data-lb]')];
  let img: HTMLImageElement | null = null;
  const cap = document.getElementById('lc-lb-cap')!, orig = document.getElementById('lc-lb-orig') as HTMLAnchorElement;
  let cur = 0;
  const show = (i: number) => {
    cur = (i + shots.length) % shots.length;
    const b = shots[cur];
    if (!img) { img = document.createElement('img'); lb.querySelector('.frame')!.appendChild(img); }
    img.src = b.dataset.full!; img.alt = b.dataset.alt || ''; cap.textContent = b.dataset.cap || ''; orig.href = b.dataset.orig!;
  };
  shots.forEach((b, i) => b.addEventListener('click', () => { show(i); lb.showModal(); }));
  lb.querySelector('[data-lb-close]')?.addEventListener('click', () => lb.close());
  lb.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(cur - 1));
  lb.querySelector('[data-lb-next]')?.addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1); });
}
export {};
