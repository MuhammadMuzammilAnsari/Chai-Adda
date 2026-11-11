const MENU=[
  {id:1,n:'Kadak Chai',d:'Dheemi aanch par pakai, adrak elaichi ke saath.',p:80,c:'Chai',e:'☕'},
  {id:2,n:'Doodh Patti',d:'Gaadha doodh, patti kam, meethi.',p:100,c:'Chai',e:'🥛'},
  {id:3,n:'Kashmiri Chai',d:'Gulabi, namkeen, badaam pista ke saath.',p:180,c:'Chai',e:'🌸'},
  {id:4,n:'Paratha Roll',d:'Anda aur chutney, garam tawa se.',p:220,c:'Nashta',e:'🌯'},
  {id:5,n:'Anda Paratha',d:'Do parathay, ek omelette, achaar.',p:250,c:'Nashta',e:'🍳'},
  {id:6,n:'Bun Kabab',d:'Karachi ka classic, pyaz chutney ke saath.',p:150,c:'Nashta',e:'🍔'},
  {id:7,n:'Samosa (2)',d:'Aloo samosa, imli ki chutney.',p:70,c:'Snacks',e:'🥟'},
  {id:8,n:'Pakoray',d:'Pyaz aur aloo, barish wali plate.',p:120,c:'Snacks',e:'🧆'},
  {id:9,n:'Rusk',d:'Chai mein dubone ke liye.',p:40,c:'Snacks',e:'🍞'}
];
const STR=[
  {n:'Halki',d:'Doodh zyada, patti bas rang ke liye.',c:'#e6c79c'},
  {n:'Theek-thaak',d:'Rozmarra wali, na zyada na kam.',c:'#d4a46c'},
  {n:'Kadak',d:'Patti zyada, doodh theek-thaak.',c:'#b5733a'},
  {n:'Aag',d:'Itni kadak ke neend bhaag jaye.',c:'#7a4420'}
];
const $=s=>document.querySelector(s);
const cart={};
let filter='Sab';

/* theme */
const root=document.documentElement;
$('#theme').onclick=()=>{
  const dark=root.dataset.theme?root.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme=dark?'light':'dark';
};

/* chai strength */
function setStrength(){
  const s=STR[$('#strength').value];
  $('#strengthName').textContent=s.n;
  $('#strengthDesc').textContent=s.d;
  $('#tea').style.setProperty('--tea',s.c);
}
$('#strength').oninput=setStrength; setStrength();

/* menu */
function renderTabs(){
  const cats=['Sab',...new Set(MENU.map(m=>m.c))];
  $('#tabs').innerHTML='';
  cats.forEach(c=>{
    const b=document.createElement('button');
    b.className='tab';b.textContent=c;b.setAttribute('aria-pressed',c===filter);
    b.onclick=()=>{filter=c;renderTabs();renderMenu()};
    $('#tabs').appendChild(b);
  });
}
function renderMenu(){
  const g=$('#menuGrid');g.innerHTML='';
  MENU.filter(m=>filter==='Sab'||m.c===filter).forEach(m=>{
    const el=document.createElement('article');el.className='item';
    el.innerHTML=`<div class="emoji" aria-hidden="true">${m.e}</div><h3>${m.n}</h3><p>${m.d}</p>
      <div class="row"><span class="price">Rs ${m.p}</span><button class="add">Add</button></div>`;
    el.querySelector('.add').onclick=()=>{cart[m.id]=(cart[m.id]||0)+1;renderCart();toast(m.n+' add ho gaya')};
    g.appendChild(el);
  });
}

/* cart */
function renderCart(){
  const ids=Object.keys(cart).filter(k=>cart[k]>0);
  const box=$('#orderBody');
  if(!ids.length){box.innerHTML='<p class="empty">Abhi kuch add nahi hua. Menu se pasandeeda cheez chuno.</p>';return}
  let total=0;
  const lines=ids.map(id=>{
    const m=MENU.find(x=>x.id==id);const q=cart[id];total+=m.p*q;
    return `<li><span>${m.n}</span><span class="qty"><button data-id="${id}" data-d="-1" aria-label="Kam karo">−</button><span>${q}</span><button data-id="${id}" data-d="1" aria-label="Zyada karo">+</button></span><span>Rs ${m.p*q}</span></li>`;
  }).join('');
  box.innerHTML=`<ul>${lines}</ul><div class="total"><span>Total</span><span>Rs ${total}</span></div>
    <div class="actions"><button class="btn alt" id="copy">Order copy karo</button><button class="btn" id="clear">Saaf karo</button></div>`;
  box.querySelectorAll('.qty button').forEach(b=>b.onclick=()=>{cart[b.dataset.id]=Math.max(0,cart[b.dataset.id]+Number(b.dataset.d));renderCart()});
  $('#clear').onclick=()=>{for(const k in cart)delete cart[k];renderCart()};
  $('#copy').onclick=()=>{
    const txt='Chai Adda order ('+STR[$('#strength').value].n+' chai)\n'+ids.map(id=>{const m=MENU.find(x=>x.id==id);return cart[id]+' x '+m.n}).join('\n')+'\nTotal: Rs '+total;
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Order copy ho gaya'),()=>toast('Copy nahi hua, dobara try karo'));
  };
}

let tt;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),1600)}

renderTabs();renderMenu();renderCart();
