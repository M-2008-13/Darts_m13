
const u=currentUser(),s=stats(u),ranks=[['Anfänger',0],['Bronze',20],['Silber',30],['Gold',40],['Platin',50],['Diamant',65],['Master',80]],r=ratingFor(s.avg),idx=ranks.findIndex(x=>x[0]===r),next=ranks[idx+1];
const points=Math.round(s.avg*10);
currentRating.textContent=r;
ratingDescription.textContent=`Rating-Punkte: ${points} · Grundlage: ${s.total} gespeicherte Spiele und dein 3-Dart-Average von ${s.avg.toFixed(1)}.`;
rankList.innerHTML=ranks.map((x,i)=>`<div class="rank-item"><span>${i<=idx?'✓':'○'} ${x[0]}</span><b>${x[1]*10}+ Punkte</b></div>`).join('');
if(next){ratingProgress.style.width=Math.min(100,Math.max(0,(s.avg-ranks[idx][1])/(next[1]-ranks[idx][1])*100))+'%';nextRating.textContent=`Noch ${Math.max(0,Math.round((next[1]-s.avg)*10))} Rating-Punkte bis ${next[0]}`}else{ratingProgress.style.width='100%';nextRating.textContent='Höchste Stufe erreicht'}
ratingHistory.innerHTML=(u.ratingHistory||[]).slice().reverse().map(x=>`<div><span>${new Date(x.date).toLocaleDateString('de-DE')}</span><b>${x.rating} · ${Math.round((x.average||0)*10)} Pkt.</b></div>`).join('')||'<p class="muted">Nach deinen ersten gespeicherten Spielen erscheint hier dein Rating-Verlauf.</p>';
