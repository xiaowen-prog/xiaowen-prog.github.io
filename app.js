'use strict';
document.getElementById('year').textContent=new Date().getFullYear();
const buttons=document.querySelectorAll('[data-filter]');
const projects=document.querySelectorAll('.project');
buttons.forEach(button=>button.addEventListener('click',()=>{
 buttons.forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
 let count=0;
 projects.forEach(project=>{const visible=button.dataset.filter==='all'||project.dataset.type===button.dataset.filter;project.classList.toggle('hidden',!visible);if(visible)count++;});
 document.getElementById('result').textContent=`展示 ${count} 个公开项目`;
}));
const copyWechat=document.getElementById('copy-wechat');
copyWechat.addEventListener('click',async()=>{
 const status=document.getElementById('contact-status');
 try{await navigator.clipboard.writeText('wmbdsg123');document.getElementById('copy-state').textContent='已复制';status.textContent='微信号已复制：wmbdsg123';setTimeout(()=>{document.getElementById('copy-state').textContent='复制';},2500);}
 catch{status.textContent='未能自动复制，请手动复制微信号：wmbdsg123';}
});
