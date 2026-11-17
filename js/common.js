
const DB_KEY='dartzone_db_v1', SESSION_KEY='dartzone_session';
function db(){try{return JSON.parse(localStorage.getItem(DB_KEY))||{users:[]}}catch(e){return {users:[]}}}
function saveDb(data){localStorage.setItem(DB_KEY,JSON.stringify(data))}
function session(){return localStorage.getItem(SESSION_KEY)}
function currentUser(){const d=db();return d.users.find(u=>u.id===session())||null}
function updateUser(user){const d=db(),i=d.users.findIndex(u=>u.id===user.id);if(i>=0)d.users[i]=user;saveDb(d)}
function requireAuth(){if(!currentUser())location.href='index.html'}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function ratingFor(avg){if(avg>=80)return 'Master';if(avg>=65)return 'Diamant';if(avg>=50)return 'Platin';if(avg>=40)return 'Gold';if(avg>=30)return 'Silber';if(avg>=20)return 'Bronze';return 'Anfänger'}
function stats(user){const games=user.games||[],wins=games.filter(g=>g.result==='win').length,losses=games.filter(g=>g.result==='loss').length,averages=games.map(g=>Number(g.average)||0),visits=games.flatMap(g=>g.visits||[]);return {total:games.length,wins,losses,winRate:games.length?Math.round(wins/games.length*100):0,avg:averages.length?averages.reduce((a,b)=>a+b,0)/averages.length:0,bestAvg:Math.max(0,...averages),bestVisit:Math.max(0,...visits.map(v=>v.score||0)),darts:games.reduce((s,g)=>s+(g.darts||0),0),oneEighty:visits.filter(v=>v.score===180).length,hundred:visits.filter(v=>v.score>=100).length,visits};}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function modeName(m){return ({501:'501',301:'301',around:'1 bis 20',cricket:'Cricket',highscore:'Highscore'})[m]||m}
function setActiveNav(){const p=location.pathname.split('/').pop().replace('.html','');document.querySelectorAll('.sidebar nav a').forEach(a=>{if(a.dataset.page===p)a.classList.add('active')});const u=currentUser();if(u){const n=document.getElementById('navName'),av=document.getElementById('navAvatar');if(n)n.textContent=u.name;if(av)av.textContent=u.name[0].toUpperCase()}}
document.addEventListener('DOMContentLoaded',()=>{if(!location.pathname.endsWith('index.html')&&!location.pathname.endsWith('/'))requireAuth();setActiveNav();const l=document.getElementById('logoutBtn');if(l)l.onclick=()=>{localStorage.removeItem(SESSION_KEY);location.href='index.html'};const m=document.getElementById('menuBtn');if(m)m.onclick=()=>document.querySelector('.sidebar').classList.toggle('open')});
