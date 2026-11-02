'use strict';
document.getElementById('year').textContent=new Date().getFullYear();
const buttons=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.project');
buttons.forEach(button=>button.addEventListener('click',()=>{
 buttons.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
 const motion=window.__motion;const state=motion&&motion.capture?motion.capture():null;
 let count=0;
 projects.forEach(project=>{const visible=button.dataset.filter==='all'||project.dataset.type===button.dataset.filter;project.classList.toggle('hidden',!visible);if(visible)count++;});
 document.getElementById('result').textContent=`展示 ${count} 个公开项目`;
 if(state)motion.play(state);
}));
const copyWechat=document.getElementById('copy-wechat');
copyWechat.addEventListener('click',async()=>{
 const status=document.getElementById('contact-status');
 try{await navigator.clipboard.writeText('wmbdsg123');document.getElementById('copy-state').textContent='已复制';status.textContent='微信号已复制：wmbdsg123';setTimeout(()=>{document.getElementById('copy-state').textContent='复制';},2500);}
 catch{status.textContent='未能自动复制，请手动复制微信号：wmbdsg123';}
});

// A small decoding moment: each resolved name points to its actual project.
(()=>{
 const link=document.getElementById('project-switch');
 const word=document.getElementById('project-word');
 if(!link||!word)return;
 const entries=[...projects].map(card=>({name:card.querySelector('h3').textContent.trim(),label:({'project-learning':'COACH.','project-teardown':'RESEARCH.','project-discovery':'DISCOVERY.','project-design':'DESIGN.','project-website':'PORTFOLIO.'})[card.id],id:card.id}));
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const chars='01/<>_+*';
 let index=-1,timer=0,frame=0,paused=false,inView=true,lastTick=0;
 function cancel(){clearTimeout(timer);cancelAnimationFrame(frame);}
 function fit(){word.style.fontSize='';const available=link.clientWidth;const natural=word.scrollWidth;if(available>0&&natural>available){word.style.fontSize=(parseFloat(getComputedStyle(word).fontSize)*available/natural*.97)+'px';}}
 function resolve(){if(index<0)return;word.textContent=entries[index].label;link.classList.add('is-project');fit();}
 function schedule(delay=3400){clearTimeout(timer);if(!paused&&inView&&!document.hidden&&!motion.matches)timer=setTimeout(next,delay);}
 function next(){
  cancel();index=(index+1)%entries.length;
  const entry=entries[index];link.href='#'+entry.id;link.setAttribute('aria-label','查看'+entry.name+'项目');link.classList.add('is-project');
  if(motion.matches){resolve();return;}
  const target=Array.from(entry.label);const start=performance.now();lastTick=0;
  function draw(now){const elapsed=now-start;
   if(now-lastTick>55){const revealed=Math.floor(Math.max(0,(elapsed-120)/650)*target.length);word.textContent=target.map((char,i)=>i<revealed?char:chars[Math.floor(Math.random()*chars.length)]).join('');fit();lastTick=now;}
   if(elapsed<800)frame=requestAnimationFrame(draw);else{resolve();schedule();}
  }frame=requestAnimationFrame(draw);
 }
 function pause(){paused=true;cancel();resolve();}
 function resume(){paused=false;schedule();}
 link.addEventListener('pointerenter',pause);link.addEventListener('pointerleave',resume);
 link.addEventListener('focus',pause);link.addEventListener('blur',resume);
 link.addEventListener('click',event=>{
  event.preventDefault();cancel();if(index<0)index=0;resolve();const entry=entries[index];
  const card=document.getElementById(entry.id);const filtered=buttons[0].getAttribute('aria-pressed')!=='true';if(filtered)buttons[0].click();
  const arrive=()=>{if(!motion.matches&&window.__portfolioScroll)window.__portfolioScroll(card);else card.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'center'});history.replaceState(null,'','#'+entry.id);card.focus({preventScroll:true});card.classList.add('is-arrival');setTimeout(()=>card.classList.remove('is-arrival'),2200);};
  if(filtered&&window.__motion&&!motion.matches)setTimeout(arrive,700);else arrive();
 });
 document.addEventListener('visibilitychange',()=>{cancel();resolve();if(!document.hidden)schedule();});
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;cancel();resolve();if(inView)schedule(index<0?1500:3400);}).observe(link);
 new ResizeObserver(fit).observe(link);
 motion.addEventListener('change',()=>{cancel();if(motion.matches){if(index<0)index=0;resolve();}else schedule();});
 if(motion.matches){index=0;resolve();}else schedule(1500);
})();
