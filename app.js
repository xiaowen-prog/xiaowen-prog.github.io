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
