const API='https://sticki-con-redemption-danhues.earthyplume72.chatgpt.site/api/product-event';
const local=location.hostname==='127.0.0.1'||location.hostname==='localhost';
const storage={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
const key='sticki-explorer-visitor-v1';
let visitor=storage.get(key);if(!/^[a-f0-9-]{36}$/.test(visitor||'')){visitor=crypto.randomUUID();storage.set(key,visitor)}
const placement=new URLSearchParams(location.search).get('source');
const source=['bracelet','packaging','booth'].includes(placement)?placement:'direct';
const queueKey='sticki-explorer-events-v1';
let queue=[];try{queue=JSON.parse(storage.get(queueKey)||'[]');if(!Array.isArray(queue))queue=[]}catch{}
let sending=false;
const save=()=>storage.set(queueKey,JSON.stringify(queue.slice(-100)));
async function flush(){if(local||sending||!navigator.onLine)return;sending=true;try{while(queue.length){const event=queue[0];const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),keepalive:true,signal:AbortSignal.timeout(10000)});if(!res.ok){if(res.status>=400&&res.status<500){queue.shift();save();continue}break}queue.shift();save()}}catch{}finally{sending=false}}
function track(kind,product){if(local)return;queue.push({id:crypto.randomUUID(),visitor,source,kind,...(product?{product}:{})});queue=queue.slice(-100);save();flush()}
addEventListener('online',flush);addEventListener('focus',flush);setInterval(flush,30000);
const themes={series3:{accent:'#ed238e',tint:'#ffe0f0',tag:'THE ORIGINAL, REIMAGINED',copy:'Meet your new mini companions and discover the next chapter of Sticki Rolls.'},minecraft:{accent:'#89cf53',tint:'#e7f4d8',tag:'BUILD YOUR COLLECTION',copy:'From your favorite blocks to your backpack. Bring Minecraft into your Sticki world.'},aphmau:{accent:'#be89ed',tint:'#f0e2ff',tag:'A LITTLE CAT-TITUDE',copy:'Step into Aphmau’s world with playful surprises and cat-inspired collectibles.'},stitch2:{accent:'#60c8ef',tint:'#ddf3ff',tag:'OHANA, MEET STICKI',copy:'Stitch, Angel, and a whole lot of personality. Discover the Series 2 collection.'}};
const retailers={amazon:'Amazon',target:'Target',walmart:'Walmart'};
try{
 const response=await fetch('catalog.json');if(!response.ok)throw new Error('Catalog unavailable');const {collections,products}=await response.json();
 const root=document.querySelector('#collections');
 Object.entries(collections).forEach(([id,name],index)=>{const theme=themes[id],items=products.filter(p=>p.collection===id),section=document.createElement('section');section.className='collection';section.id=id;section.dataset.count=items.length;section.style.setProperty('--accent',theme.accent);section.style.setProperty('--tint',theme.tint);
 section.innerHTML=`<div class="collection-inner"><div class="section-head"><div><span class="eyebrow">${theme.tag}</span><h2>${name}</h2><p>${theme.copy}</p></div><span class="collection-number" aria-hidden="true">0${index+1}</span></div><div class="product-grid"></div></div>`;
 const grid=section.querySelector('.product-grid');items.forEach(p=>{const a=document.createElement('a');a.className='product-card';a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';a.dataset.product=p.id;a.setAttribute('aria-label',`${p.name} — shop at ${retailers[p.retailer]} (opens a new tab)`);const bubble=document.createElement('div');bubble.className='bauble';const img=document.createElement('img');img.src=p.image;img.alt=p.name;img.loading='lazy';img.width=300;img.height=300;bubble.append(img);const title=document.createElement('h3');title.textContent=p.name;const description=document.createElement('p');description.textContent=p.description;const label=document.createElement('span');label.className='retailer';label.textContent=`Shop ${retailers[p.retailer]} `;const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');label.append(arrow);a.append(bubble,title,description,label);a.addEventListener('click',()=>track('click',p.id));a.addEventListener('auxclick',e=>{if(e.button===1)track('click',p.id)});grid.append(a)});root.append(section)});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.collection-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('.collection').forEach(section=>observer.observe(section));
 track('view');
}catch{document.querySelector('#collections').innerHTML='<p class="noscript">The collection could not load. Please refresh, or <a href="https://stickirolls.com/">explore Sticki Rolls here</a>.</p>'}
