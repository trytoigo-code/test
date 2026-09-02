const letters="ABCDEFGHJKLMNOPQRST";
function coord(r,c){return letters[c]+(19-r)}
export function makeKataQuery({moves,board,turn}){
 // 実戦履歴が存在する場合は、局面を石配置だけで再構成せずmovesを優先する。
 // これによりKataGo側でko/superkoや履歴依存の情報を扱える。
 const initialStones=[];
 if(moves.length===0){
  for(let r=0;r<19;r++)for(let c=0;c<19;c++){
   const v=board[r*19+c]; if(v)initialStones.push([v,coord(r,c)]);
  }
 }
 return {
  id:"igo-ai-v13-"+Date.now(),
  initialStones,
  moves:moves.map(x=>[x[0],x[1]]),
  initialPlayer:moves.length===0?turn:undefined,
  rules:"japanese",
  komi:6.5,
  boardXSize:19,
  boardYSize:19,
  analyzeTurns:[moves.length],
  maxVisits:200,
  analysisPVLen:8
 };
}