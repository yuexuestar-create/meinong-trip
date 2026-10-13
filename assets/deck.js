(()=>{if(location.search.includes('shot'))document.body.classList.add('noanim');if(location.search.includes('full')){document.documentElement.classList.add('full');document.body.classList.add('full')}
const stage=document.getElementById('stage'),slides=[...document.querySelectorAll('.slide')],N=slides.length;
const nav=[...document.querySelectorAll('.nv')],ink=document.querySelector('.nv-ink');
const dotsWrap=document.querySelector('.dots'),fill=document.querySelector('.fill'),pg=document.querySelector('.pg');
const titles=['封面','總覽','啟程','美濃湖','紙傘村','午食','老街','文物館','黃蝶/吃冰','歸途','美食','提醒','結語'];
titles.forEach((t,i)=>{const b=document.createElement('button');b.dataset.t=t;b.dataset.go=i+1;dotsWrap.appendChild(b)});
const dots=[...dotsWrap.children];let cur=0;
const mq=matchMedia('(max-width:760px)');
function fit(){if(mq.matches){stage.style.transform='';return}const s=Math.min(innerWidth/1600,innerHeight/900);stage.style.transform=`translate(-50%,-50%) scale(${s})`}
addEventListener('resize',fit);fit();
function load(i){if(i<0||i>=N)return;slides[i].querySelectorAll('img[data-src]').forEach(im=>{if(im.dataset.srcset)im.srcset=im.dataset.srcset;im.src=im.dataset.src;im.removeAttribute('data-src');im.removeAttribute('data-srcset')})}
const navEl=document.querySelector('.nav');
slides.forEach(s=>{let last=0;s.addEventListener('scroll',()=>{if(!mq.matches)return;const t=s.scrollTop;if(t>last+6&&t>80)stage.classList.add('navhide');else if(t<last-6||t<40)stage.classList.remove('navhide');last=t},{passive:true})});
function go(n,push=true){n=Math.max(1,Math.min(N,n));const i=n-1;if(i===cur&&slides[i].classList.contains('on'))return;
 slides.forEach((s,k)=>{s.classList.toggle('on',k===i);s.classList.toggle('back',k<i)});
 cur=i;fill.style.width=(i/(N-1)*100)+'%';pg.textContent=String(n).padStart(2,'0')+' / '+N;
 dots.forEach((d,k)=>{d.classList.toggle('done',k<=i);d.classList.toggle('cur',k===i)});
 const key=+slides[i].dataset.nav;let hit=null;nav.forEach(b=>{const on=+b.dataset.go===key;b.classList.toggle('on',on);if(on)hit=b});
 if(hit){ink.style.opacity=1;ink.style.transform=`translateX(${hit.offsetLeft}px)`}else ink.style.opacity=0;
 stage.classList.toggle('dark',slides[i].classList.contains('closing'));
 document.querySelector('.prev').disabled=i===0;document.querySelector('.next').disabled=i===N-1;
 load(i);load(i+1);load(i-1);slides[i].scrollTop=0;stage.classList.remove('navhide');
 if(hit&&mq.matches)navEl.scrollTo({left:hit.offsetLeft-navEl.clientWidth/2+hit.offsetWidth/2,behavior:'smooth'});
 if(push)history.replaceState(null,'','#'+n);}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(+g.dataset.go);return}
 const f=e.target.closest('.ph');if(f&&!e.target.closest('.opt')&&!e.target.closest('.fcard')){const lb=document.getElementById('lightbox');lb.querySelector('img').src=f.querySelector('img').src;lb.classList.add('on')}});
document.getElementById('lightbox').onclick=e=>e.currentTarget.classList.remove('on');
document.querySelector('.prev').onclick=()=>go(cur);document.querySelector('.next').onclick=()=>go(cur+2);
addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(cur+2)}if(['ArrowLeft','PageUp'].includes(e.key))go(cur);if(e.key==='Home')go(1);if(e.key==='End')go(N);if(e.key==='Escape')document.getElementById('lightbox').classList.remove('on')});
let sx=null,sy=0,ok=false;addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;ok=!e.target.closest('.nav,.tabs,.credits,#lightbox')},{passive:true});
addEventListener('touchend',e=>{if(sx==null||!ok){sx=null;return}const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>60&&Math.abs(dx)>1.6*Math.abs(dy))go(dx<0?cur+2:cur);sx=null},{passive:true});
// tabs
document.querySelectorAll('.tabs').forEach(t=>{const tabs=[...t.querySelectorAll('.tab')],bar=t.querySelector('.tab-ink'),panes=t.nextElementSibling.querySelectorAll('.pane');
 const set=b=>{tabs.forEach(x=>x.classList.toggle('on',x===b));bar.style.left=b.offsetLeft+'px';bar.style.width=b.offsetWidth+'px';panes.forEach(p=>p.classList.toggle('on',p.dataset.pane===b.dataset.tab))};
 tabs.forEach(b=>b.addEventListener('click',()=>set(b)));requestAnimationFrame(()=>set(tabs[0]));});
// options
document.querySelectorAll('.opts').forEach(w=>w.querySelectorAll('.opt').forEach(o=>o.addEventListener('click',()=>{const was=o.classList.contains('sel');w.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));w.classList.toggle('chosen',!was);if(!was)o.classList.add('sel')})));
const h=parseInt(location.hash.slice(1))||1;requestAnimationFrame(()=>go(h,false));
addEventListener('hashchange',()=>{const n=parseInt(location.hash.slice(1));if(n&&n-1!==cur)go(n,false)});
addEventListener('resize',()=>document.querySelectorAll('.tab.on').forEach(b=>b.click()));
if(location.search.includes('shot'))setTimeout(()=>{document.body.setAttribute('data-ovf',slides.map(s=>s.scrollWidth-s.clientWidth).join(',')+'|doc:'+(document.documentElement.scrollWidth-innerWidth))},1500);
let q=0;addEventListener('load',()=>setTimeout(function idle(){if(q>=N)return;load(q++);setTimeout(idle,mq.matches?1500:600)},2500));
})();
