
let user=currentUser(),mode='501',mult=1,remaining=501,turnDarts=[],visits=[],darts=0,turn=1,finished=false,aroundTarget=1;
let cricket={active:1,marks:[{},{}],scores:[0,0],closed:[{},{}]};
const cricketNumbers=[20,19,18,17,16,15,'B'];
const checkoutMap={
170:['T20','T20','Bull'],167:['T20','T19','Bull'],164:['T20','T18','Bull'],161:['T20','T17','Bull'],
160:['T20','T20','D20'],158:['T20','T20','D19'],157:['T20','T19','D20'],156:['T20','T20','D18'],
155:['T20','T19','D19'],154:['T20','T18','D20'],153:['T20','T19','D18'],152:['T20','T20','D16'],
151:['T20','T17','D20'],150:['T20','T18','D18'],149:['T20','T19','D16'],148:['T20','T16','D20'],
147:['T20','T17','D18'],146:['T20','T18','D16'],145:['T20','T15','D20'],144:['T20','T20','D12'],
143:['T20','T17','D16'],142:['T20','T14','D20'],141:['T20','T19','D12'],140:['T20','T20','D10'],
139:['T19','T14','D20'],138:['T20','T18','D12'],137:['T19','T16','D16'],136:['T20','T20','D8'],
135:['T20','T17','D12'],134:['T20','T14','D16'],133:['T20','T19','D8'],132:['T20','T16','D12'],
131:['T20','T13','D16'],130:['T20','T18','D8'],129:['T19','T16','D12'],128:['T18','T14','D16'],
127:['T20','T17','D8'],126:['T19','T19','D6'],125:['25','T20','D20'],124:['T20','T16','D8'],
123:['T19','T16','D9'],122:['T18','T18','D7'],121:['T20','T11','D14'],120:['T20','20','D20'],
119:['T19','T12','D13'],118:['T20','18','D20'],117:['T20','17','D20'],116:['T20','16','D20'],
115:['T20','15','D20'],114:['T20','14','D20'],113:['T20','13','D20'],112:['T20','12','D20'],
111:['T20','11','D20'],110:['T20','10','D20'],109:['T19','12','D20'],108:['T20','16','D16'],
107:['T19','10','D20'],106:['T20','14','D16'],105:['T20','13','D16'],104:['T18','18','D16'],
103:['T19','10','D18'],102:['T20','10','D16'],101:['T17','10','D20'],100:['T20','D20'],
99:['T19','10','D16'],98:['T20','D19'],97:['T19','D20'],96:['T20','D18'],95:['T19','D19'],
94:['T18','D20'],93:['T19','D18'],92:['T20','D16'],91:['T17','D20'],90:['T18','D18'],
89:['T19','D16'],88:['T16','D20'],87:['T17','D18'],86:['T18','D16'],85:['T15','D20'],
84:['T20','D12'],83:['T17','D16'],82:['Bull','D16'],81:['T19','D12'],80:['T20','D10'],
79:['T19','D11'],78:['T18','D12'],77:['T19','D10'],76:['T20','D8'],75:['T17','D12'],
74:['T14','D16'],73:['T19','D8'],72:['T16','D12'],71:['T13','D16'],70:['T18','D8'],
69:['T19','D6'],68:['T20','D4'],67:['T17','D8'],66:['T10','D18'],65:['25','D20'],
64:['T16','D8'],63:['T13','D12'],62:['T10','D16'],61:['25','D18'],60:['20','D20'],
59:['19','D20'],58:['18','D20'],57:['17','D20'],56:['16','D20'],55:['15','D20'],
54:['14','D20'],53:['13','D20'],52:['12','D20'],51:['11','D20'],50:['Bull'],
49:['9','D20'],48:['16','D16'],47:['15','D16'],46:['14','D16'],45:['13','D16'],
44:['12','D16'],43:['11','D16'],42:['10','D16'],41:['9','D16'],40:['D20'],
38:['D19'],36:['D18'],34:['D17'],32:['D16'],30:['D15'],28:['D14'],26:['D13'],24:['D12'],
22:['D11'],20:['D10'],18:['D9'],16:['D8'],14:['D7'],12:['D6'],10:['D5'],8:['D4'],6:['D3'],4:['D2'],2:['D1']
};
const grid=document.getElementById('numberGrid');
for(let n=1;n<=20;n++){const b=document.createElement('button');b.textContent=n;b.onclick=()=>addDart(n*mult,`${mult===1?'S':mult===2?'D':'T'}${n}`,{number:n,mult});grid.appendChild(b)}
document.querySelectorAll('.mult').forEach(b=>b.onclick=()=>{mult=Number(b.dataset.mult);document.querySelectorAll('.mult').forEach(x=>x.classList.toggle('active',x===b))});
document.querySelectorAll('[data-special]').forEach(b=>b.onclick=()=>{let v=Number(b.dataset.special);addDart(v,v===0?'MISS':v===25?'BULL':'DBULL',{number:v===50?'B':v===25?'B25':0,mult:1})});
function addDart(value,label,meta={}){if(finished||turnDarts.length>=3)return;
 if(mode==='cricket'){cricketThrow(meta,label);return}
 if(mode==='501'||mode==='301'){
   const old=remaining,next=remaining-value,validDouble=meta.mult===2||label==='DBULL';
   if(next<0||next===1||(next===0&&document.getElementById('outMode').value==='double'&&!validDouble)){
     turnDarts.push({value:0,label:'BUST',actual:value});darts++;completeTurn(true);render();persist();return;
   }
   remaining=next;
 }
 if(mode==='around'&&meta.number){if(meta.number===aroundTarget)aroundTarget++}
 turnDarts.push({value,label,meta});darts++;if(turnDarts.length===3)completeTurn(false);render();persist();
 if((mode==='501'||mode==='301')&&remaining===0)finish(true);
}
function cricketThrow(meta,label){
 const player=cricket.active-1;
 let target=meta.number;
 if(target===25||target==='B25'||target==='B')target='B';
 if(![15,16,17,18,19,20,'B'].includes(target)){turnDarts.push({value:0,label});darts++;if(turnDarts.length===3)completeCricketTurn();render();persist();return}
 const hitMult=target==='B'?(label==='DBULL'?2:1):(meta.mult||1);
 const other=1-player,marksNow=cricket.marks[player][target]||0,opponentMarks=cricket.marks[other][target]||0;
 let remainingMarks=3-marksNow,closedHits=Math.min(hitMult,Math.max(0,remainingMarks));
 cricket.marks[player][target]=Math.min(3,marksNow+hitMult);
 const extra=Math.max(0,hitMult-remainingMarks);
 if((cricket.marks[player][target]||0)>=3&&(cricket.marks[other][target]||0)<3){
   const points=target==='B'?25:target;
   cricket.scores[player]+=extra*points;
 }
 turnDarts.push({value:0,label,meta:{...meta,cricketTarget:target,marks:hitMult}});darts++;
 if(turnDarts.length===3)completeCricketTurn();render();persist();
 const allClosed=cricketNumbers.every(n=>(cricket.marks[player][n]||0)>=3);
 const opponentAhead=cricket.scores[player]>=cricket.scores[other];
 if(allClosed&&opponentAhead)finish(true);
}
function completeCricketTurn(){visits.push({score:0,darts:[...turnDarts],player:cricket.active});turnDarts=[];turn++;cricket.active=cricket.active===1?2:1}
function completeTurn(bust=false){const score=bust?0:turnDarts.reduce((s,d)=>s+d.value,0);visits.push({score,darts:[...turnDarts],bust});turnDarts=[];turn++}
function undo(){if(finished)return;if(mode==='cricket'){gameMessage.textContent='Bei Cricket bitte beende die Aufnahme; einzelne Cricket-Korrekturen sind in dieser Version noch nicht verfügbar.';return}
 if(turnDarts.length){const d=turnDarts.pop();if(mode==='501'||mode==='301')remaining+=d.value;darts=Math.max(0,darts-1)}
 else if(visits.length){const v=visits.pop();remaining+=v.score;darts=Math.max(0,darts-(v.darts?.length||3));turn=Math.max(1,turn-1);turnDarts=v.darts||[]}
 render();persist()}
function renderCricket(){cricketBoard.classList.toggle('hidden',mode!=='cricket');if(mode!=='cricket')return;cricketTurn.textContent=`Spieler ${cricket.active} am Zug`;cricketScore1.textContent=cricket.scores[0];cricketScore2.textContent=cricket.scores[1];cricketTable.innerHTML=cricketNumbers.map(n=>{let a=cricket.marks[0][n]||0,b=cricket.marks[1][n]||0;return `<div class="cricket-cell"><b>${n==='B'?'BULL':n}</b><small>${'✕'.repeat(a)}${'○'.repeat(3-a)} / ${'✕'.repeat(b)}${'○'.repeat(3-b)}</small></div>`}).join('')}
function render(){document.getElementById('remaining').textContent=(mode==='501'||mode==='301')?remaining:mode==='around'?`#${aroundTarget}`:mode==='highscore'?visits.reduce((a,v)=>a+v.score,0):'Cricket';document.getElementById('liveAverage').textContent=(darts?visits.reduce((a,v)=>a+v.score,0)/Math.max(1,darts)*3:0).toFixed(1);document.getElementById('lastScore').textContent=visits.length?visits[visits.length-1].score:'–';document.getElementById('turnPill').textContent='Aufnahme '+turn;document.getElementById('throwLabel').textContent=`Spieler ${mode==='cricket'?cricket.active:1} · Dart ${turnDarts.length+1} von 3`;document.getElementById('pendingTotal').textContent='Aufnahme: '+turnDarts.reduce((a,d)=>a+d.value,0)+' Punkte';document.getElementById('dartHistory').innerHTML=[0,1,2].map(i=>`<span>${turnDarts[i]?.label||'–'}</span>`).join('');document.getElementById('visits').textContent=visits.length;document.getElementById('darts').textContent=darts;document.getElementById('highVisit').textContent=Math.max(0,...visits.map(v=>v.score));updateCheckout();renderCricket()}
function updateCheckout(){const panel=document.getElementById('checkoutPanel');if(mode!=='501'&&mode!=='301'){panel.classList.add('hidden');return}panel.classList.remove('hidden');let val=remaining,legs=checkoutMap[val];if(val>170||val===169||val===168||val===166||val===165||val===163||val===162||val===159){checkoutValue.textContent='Kein Checkout mit 3 Darts';checkoutHint.textContent='Stelle dir ein Finish unter 171 Punkten.';return}if(val===0){checkoutValue.textContent='CHECKOUT!';checkoutHint.textContent='Leg beendet.';return}if(!legs){checkoutValue.textContent='Kein Standard-Finish';checkoutHint.textContent='Versuche, auf eine günstige Doppelzahl zu stellen.';return}checkoutValue.innerHTML=`<div class="checkout-legs">${legs.map(x=>`<span>${x}</span>`).join('')}</div>`;checkoutHint.textContent=`${val} Punkte · ${legs.length} Dart${legs.length===1?'':'s'} · Double-Out`;}
function persist(){localStorage.setItem('dartzone_active_'+user.id,JSON.stringify({mode,remaining,turnDarts,visits,darts,turn,aroundTarget,opponent:document.getElementById('opponent').value,outMode:document.getElementById('outMode').value,cricket}))}
function start(){mode=document.getElementById('mode').value;remaining=mode==='301'?301:501;turnDarts=[];visits=[];darts=0;turn=1;finished=false;aroundTarget=1;cricket={active:1,marks:[{},{}],scores:[0,0]};document.getElementById('gameHeading').textContent=modeName(mode)+(mode==='501'||mode==='301'?' – '+document.getElementById('outMode').value+' Out':'');document.getElementById('gameMessage').textContent='';render();persist()}
function finish(auto=false){if(finished)return;finished=true;if(turnDarts.length){if(mode==='cricket')completeCricketTurn();else completeTurn(false)}let total=visits.reduce((a,v)=>a+v.score,0),avg=darts?total/darts*3:0;let result=mode==='cricket'?(cricket.scores[0]>=cricket.scores[1]?'win':'loss'):(mode==='501'||mode==='301')?(remaining===0?'win':'loss'):'practice';const g={id:uid(),date:new Date().toISOString(),mode,opponent:mode==='cricket'?'Spieler 2':document.getElementById('opponent').value,remaining,visits,darts,average:Number(avg.toFixed(2)),highest:Math.max(0,...visits.map(v=>v.score)),result,cricket:mode==='cricket'?cricket:null,checkout:remaining===0};user.games.push(g);let r=ratingFor(stats(user).avg);user.ratingHistory=user.ratingHistory||[];user.ratingHistory.push({date:g.date,rating:r,average:g.average});updateUser(user);localStorage.removeItem('dartzone_active_'+user.id);document.getElementById('gameStatus').textContent='Gespeichert';document.getElementById('gameMessage').textContent=auto?'Spiel beendet und gespeichert.':'Spiel wurde gespeichert. Du findest es in deiner Spielhistorie.';render()}
document.getElementById('undoBtn').onclick=undo;document.getElementById('newGameBtn').onclick=()=>{if(confirm('Aktuelles Spiel verwerfen und neu starten?'))start()};document.getElementById('finishBtn').onclick=()=>finish(false);document.getElementById('manualBtn').onclick=()=>{const n=Number(document.getElementById('manualScore').value);if(mode==='cricket'){gameMessage.textContent='Manuelle Aufnahme ist für Cricket deaktiviert.';return}if(!Number.isInteger(n)||n<0||n>180){gameMessage.textContent='Bitte einen Wert zwischen 0 und 180 eingeben.';return}if(mode==='501'||mode==='301'){let next=remaining-n;if(next<0||next===1||(next===0&&document.getElementById('outMode').value==='double')){visits.push({score:0,darts:[{value:0,label:'BUST'}],bust:true});darts+=3;turn++;gameMessage.textContent='Bust: Der Reststand bleibt unverändert.'}else{remaining=next;visits.push({score:n,darts:[{value:n,label:'Manuell'}]});darts+=3;turn++}}else{visits.push({score:n,darts:[{value:n,label:'Manuell'}]});darts+=3;turn++}document.getElementById('manualScore').value='';render();persist();if((mode==='501'||mode==='301')&&remaining===0)finish(true)};
document.getElementById('mode').onchange=start;document.getElementById('outMode').onchange=persist;document.getElementById('opponent').oninput=persist;
const saved=localStorage.getItem('dartzone_active_'+user.id);if(saved){try{const x=JSON.parse(saved);mode=x.mode;remaining=x.remaining;turnDarts=x.turnDarts||[];visits=x.visits||[];darts=x.darts||0;turn=x.turn||1;aroundTarget=x.aroundTarget||1;cricket=x.cricket||{active:1,marks:[{},{}],scores:[0,0]};document.getElementById('mode').value=mode;document.getElementById('opponent').value=x.opponent||'';document.getElementById('outMode').value=x.outMode||'straight';}catch(e){start()}}else start();render();
