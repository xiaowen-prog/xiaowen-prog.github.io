'use strict';
(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const g=window.gsap;
 if(reduce||!g||!window.ScrollTrigger)return;
 const{ScrollTrigger}=window;
 const plugins=[ScrollTrigger];
 if(window.SplitText)plugins.push(window.SplitText);
 if(window.Flip)plugins.push(window.Flip);
 g.registerPlugin(...plugins);
 document.documentElement.style.scrollBehavior='auto';

 // 1. Lenis smooth scroll wired into ScrollTrigger + GSAP ticker
 let lenis=null;
 if(window.Lenis){
  lenis=new window.Lenis({duration:1.1,smoothWheel:true});
  lenis.on('scroll',ScrollTrigger.update);
  g.ticker.add(t=>lenis.raf(t*1000));
  g.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]:not(#project-switch)').forEach(a=>a.addEventListener('click',e=>{
   const id=a.getAttribute('href');
   const target=id==='#'?0:document.querySelector(id);
   if(target===null)return;
   e.preventDefault();
   lenis.scrollTo(target,{offset:0,duration:1.2});
   if(id!=='#')history.replaceState(null,'',id);else history.replaceState(null,'',location.pathname+location.search);
  }));
  window.__portfolioScroll=target=>lenis.scrollTo(target,{offset:-50,duration:1.2});
  if(location.hash&&document.querySelector(location.hash))requestAnimationFrame(()=>lenis.scrollTo(location.hash,{immediate:true}));
 }

 // Hero parallax (subtle)
 const heroImg=document.querySelector('.hero-image');
 if(heroImg){
  g.set(heroImg,{scale:1,transformOrigin:'50% 50%'});
  g.to('.hero-content',{yPercent:-6,opacity:.35,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
 }

 // Section reveals
 const revealSel=['.intro > *','.articles-heading','.article-row','.work-top','.project','.work-foot','.about-layout > div > *','.contact > .eyebrow','.contact-intro','.contact-methods > *','.contact-bottom','footer'];
 revealSel.forEach(sel=>{
  const els=g.utils.toArray(sel);
  if(!els.length)return;
  g.set(els,{autoAlpha:0,y:36});
  ScrollTrigger.batch(els,{start:'top 90%',once:true,onEnter:b=>g.to(b,{autoAlpha:1,y:0,duration:.9,ease:'power3.out',stagger:.08,overwrite:true,clearProps:'transform,opacity,visibility'})});
 });

 // 2. Headline line reveal (SplitText with mask, manual fallback)
 const heads=['.contact h2'].map(s=>document.querySelector(s)).filter(Boolean);
 const manualSplit=el=>{
  // split on <br>: wrap each line in mask + inner span
  const lines=[[]];
  [...el.childNodes].forEach(n=>{if(n.nodeName==='BR')lines.push([]);else lines[lines.length-1].push(n);});
  el.textContent='';
  return lines.map(nodes=>{const m=document.createElement('span');m.style.cssText='display:block;overflow:hidden';const i=document.createElement('span');i.style.display='block';i.className='split-line';nodes.forEach(n=>i.appendChild(n));m.appendChild(i);el.appendChild(m);return i;});
 };
 const runHeads=()=>heads.forEach((el,idx)=>{
  let lines;
  const tmp=el.cloneNode(true);tmp.querySelectorAll('br').forEach(b=>b.replaceWith(' '));
  el.setAttribute('aria-label',tmp.textContent.replace(/\s+/g,' ').trim());
  if(window.SplitText){lines=window.SplitText.create(el,{type:'lines',mask:'lines',linesClass:'split-line',aria:'hidden'}).lines;}
  else{lines=manualSplit(el);[...el.children].forEach(c=>c.setAttribute('aria-hidden','true'));}
  const tween={yPercent:105,duration:1.1,ease:'power4.out',stagger:.12};
  g.from(lines,{...tween,scrollTrigger:{trigger:el,start:'top 85%',once:true}});
 });
 (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(()=>{runHeads();ScrollTrigger.refresh();});
 g.from('#hero-title, .hero .eyebrow, .hero-bottom, .hero-caption',{autoAlpha:0,y:20,duration:1,ease:'power3.out',stagger:.1,delay:.45});

 // 3a. Card tilt + glow (fine pointers only)
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 if(fine){
  const MAX=6;
  document.querySelectorAll('.project').forEach(card=>{
   const cover=card.querySelector('.cover');if(!cover)return;
   const rx=g.quickTo(cover,'rotationX',{duration:.5,ease:'power3.out'});
   const ry=g.quickTo(cover,'rotationY',{duration:.5,ease:'power3.out'});
   g.set(cover,{transformPerspective:900});
   card.addEventListener('pointermove',e=>{
    const r=cover.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    const cx=Math.min(Math.max(px,0),1),cy=Math.min(Math.max(py,0),1);
    ry((cx-.5)*2*MAX);rx(-(cy-.5)*2*MAX);
    cover.style.setProperty('--mx',`${px*100}%`);cover.style.setProperty('--my',`${py*100}%`);
    card.classList.add('is-tilting');
   });
   card.addEventListener('pointerleave',()=>{rx(0);ry(0);card.classList.remove('is-tilting');});
  });
 }

 // 3b. Flip reorder for filter (hooked from app.js)
 if(window.Flip){
  const Flip=window.Flip;
  window.__motion={
   capture:()=>Flip.getState('.project'),
   play:state=>Flip.from(state,{duration:.6,ease:'power2.inOut',absolute:true,scale:false,
    onEnter:els=>g.fromTo(els,{autoAlpha:0,scale:.96},{autoAlpha:1,scale:1,duration:.45,clearProps:'transform,opacity,visibility'}),
    onComplete:()=>ScrollTrigger.refresh()})
  };
 }
})();
