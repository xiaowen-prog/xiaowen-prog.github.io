'use strict';
// Content stays visible; movement is reserved for direct pointer feedback.
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 document.querySelectorAll('.project').forEach(card=>{
  const cover=card.querySelector('.cover');
  function reset(){cover.style.transform='';card.classList.remove('is-tilting');}
  card.addEventListener('pointermove',event=>{
   if(reduce.matches||!fine.matches)return;
   const r=cover.getBoundingClientRect();
   const x=Math.max(0,Math.min(1,(event.clientX-r.left)/r.width));
   const y=Math.max(0,Math.min(1,(event.clientY-r.top)/r.height));
   cover.style.transform=`perspective(900px) rotateX(${-(y-.5)*6}deg) rotateY(${(x-.5)*6}deg)`;
   cover.style.setProperty('--mx',`${x*100}%`);cover.style.setProperty('--my',`${y*100}%`);card.classList.add('is-tilting');
  });
  card.addEventListener('pointerleave',reset);reduce.addEventListener('change',reset);
 });
})();
