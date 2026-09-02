import {makeKataQuery} from "./engine/katago-query.js";

const boardEl=document.querySelector("#board"), infoEl=document.querySelector("#gameInfo");
const queryEl=document.querySelector("#query"), historyEl=document.querySelector("#history");
const statusEl=document.querySelector("#status");
const board=Array(361).fill(null);
const moves=[];
const decisions=[];
let turn="B";

const letters="ABCDEFGHJKLMNOPQRST";
const idx=(r,c)=>r*19+c;
const coord=(r,c)=>letters[c]+(19-r);

function render(){
 boardEl.innerHTML="";
 for(let r=0;r<19;r++)for(let c=0;c<19;c++){
  const b=document.createElement("button");b.className="pt";
  const v=board[idx(r,c)];
  if(v){const s=document.createElement("span");s.className="stone "+(v==="B"?"black":"white");b.appendChild(s)}
  b.onclick=()=>play(r,c);boardEl.appendChild(b);
 }
 infoEl.innerHTML=`手数: <b>${moves.length}</b>　次: <b>${turn==="B"?"黒":"白"}</b><br>履歴は ${moves.length} 手を保持しています。`;
}
function play(r,c){
 const i=idx(r,c); if(board[i])return;
 const m=coord(r,c);
 board[i]=turn;
 moves.push([turn,m]);
 turn=turn==="B"?"W":"B";
 render();
}
function snapshot(){
 return {
  board:[...board],
  moves:moves.map(x=>[x[0],x[1]]),
  turn,
  turnNumber:moves.length,
  capturedAt:new Date().toISOString()
 };
}
function saveDecision(){
 const s=snapshot();
 decisions.push(s);
 localStorage.setItem("igo-ai-v13-decisions",JSON.stringify(decisions));
 renderHistory();
 statusEl.textContent=`第${s.turnNumber}手時点の局面と全着手履歴を保存しました。`;
}
function renderHistory(){
 if(!decisions.length){historyEl.textContent="まだありません。";return}
 historyEl.innerHTML=decisions.map((d,i)=>`<div><b>#${i+1}</b>　${d.turnNumber}手目後　${d.turn==="B"?"黒":"白"}番　${new Date(d.capturedAt).toLocaleString("ja-JP")}</div>`).join("");
}
document.querySelector("#saveBtn").onclick=saveDecision;
document.querySelector("#resetBtn").onclick=()=>{board.fill(null);moves.length=0;decisions.length=0;turn="B";localStorage.removeItem("igo-ai-v13-decisions");queryEl.textContent="まだありません。";statusEl.textContent="リセットしました。";render();renderHistory()};
document.querySelector("#analyzeBtn").onclick=()=>{
 const q=makeKataQuery({moves,board,turn});
 queryEl.textContent=JSON.stringify(q,null,2);
 statusEl.textContent="KataGo用問い合わせを生成しました。";
};
const old=JSON.parse(localStorage.getItem("igo-ai-v13-decisions")||"[]");
if(Array.isArray(old))decisions.push(...old);
render();renderHistory();