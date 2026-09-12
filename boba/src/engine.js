import {CONFIG as C,CATEGORIES,INGREDIENTS,BY_ID} from './config.js';
const clone=x=>structuredClone(x);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const blankCounts=()=>Object.fromEntries(INGREDIENTS.map(i=>[i.id,0]));
const stats=()=>({served:0,left:0,perfect:0,errors:0,revenue:0,discount:0,usedCost:0,purchases:0,used:blankCounts(),wasted:blankCounts(),reviews:[],visits:[]});
export function fresh(){return {version:C.version,phase:'welcome',day:1,cash:C.startCash,stock:Object.fromEntries(INGREDIENTS.map(i=>[i.id,i.tier===1?C.startStock:0])),reputation:C.startReputation,reviews:[],totals:{revenue:0,purchases:0,usedCost:0},settings:{difficulty:'normal',music:true,effects:true,musicVolume:C.audio.musicVolume,effectsVolume:C.audio.effectsVolume},cart:blankCounts(),filters:{tier:'all',category:'all'},today:stats(),queue:[],active:null,feedback:null,plan:[],nextArrival:0,lastTime:0,snapshot:null};}
export function forecast(s,day=s.day+1){
  const base=clamp(C.baseCustomers+Math.round(C.reputationCustomers*(s.reputation-3)),C.minCustomers,C.maxCustomers);
  const count=clamp(Math.round(base*C.difficulties[s.settings.difficulty].customers),1,C.maxPlanned);
  const mix=day===1?C.levelMixes[0]:C.levelMixes[s.reputation<C.levelThresholds[0]?0:s.reputation<C.levelThresholds[1]?1:2];
  return {count,mix:[...mix]};
}
function weighted(weights,rng){let v=rng();for(let i=0;i<weights.length;i++){v-=weights[i];if(v<0)return i+1;}return weights.length;}
export function recipe(level,rng=Math.random,previous=null){
  let r;
  for(let attempt=0;attempt<6;attempt++){
    r=Object.fromEntries(CATEGORIES.map(c=>[c.id,c.none&&rng()<C.omissionChance?null:`${c.id}${weighted(C.recipeWeights[level],rng)}`]));
    if(JSON.stringify(r)!==JSON.stringify(previous))break;
  }return r;
}
function patience(s,rng){return Math.round((C.patienceMinMs+rng()*(C.patienceMaxMs-C.patienceMinMs))*C.difficulties[s.settings.difficulty].patience);}
const names=['Noor','Milan','Yara','Sam','Luca','Amira','Jules','Bo','Robin','Kai','Lina','Ravi'];
export function openDay(s,now=Date.now(),rng=Math.random,replay=false){
  if(!['welcome','shop'].includes(s.phase)||!INGREDIENTS.some(i=>i.category==='tea'&&s.stock[i.id]>0))return false;
  if(s.phase==='shop'&&!replay)s.day++;
  s.today=stats();s.cart=blankCounts();s.queue=[];s.active=null;s.feedback=null;s.nextArrival=0;
  s.snapshot=clone({...s,snapshot:null,plan:[]});
  const f=forecast(s,s.day);s.dayForecast=f;s.startTime=now;s.closeTime=now+C.dayMs;s.lastTime=now;s.phase='day';
  let previous=null;
  s.plan=Array.from({length:f.count},(_,i)=>{
    const level=weighted(f.mix,rng),order=recipe(level,rng,previous);previous=order;
    const arrival=now+(i===0?C.firstArrivalMs:Math.round(i*C.dayMs/f.count+(rng()-.5)*C.dayMs/f.count*C.arrivalJitter));
    return {id:`${s.day}-${i}`,name:names[Math.floor(rng()*names.length)],look:Math.floor(rng()*12),level,original:clone(order),order,flexible:rng()<C.flexibility,writesReview:rng()<C.reviewChance,queuePatience:patience(s,rng),servicePatience:patience(s,rng),arrival};
  }).sort((a,b)=>a.arrival-b.arrival);return true;
}
export const missing=(s)=>s.active?CATEGORIES.filter(c=>s.active.order[c.id]&&s.stock[s.active.order[c.id]]<1):[];
export function alternatives(s,category){return INGREDIENTS.filter(i=>i.category===category&&i.tier<=s.active.level&&s.stock[i.id]>0).map(i=>i.id).concat(category==='tea'?[]:[null]);}
function recordVisit(s,c,score,reason,events){
  const review=clamp(Math.round(score),1,5);
  s.today.visits.push({id:c.id,name:c.name,satisfaction:score,reason});
  if(c.writesReview){const r={id:c.id,day:s.day,name:c.name,score:review,reason};s.today.reviews.push(r);s.reviews.push(r);}
  return c.writesReview?review:null;
}
function depart(s,c,reason,events,now){
  s.today.left++;const score=reason==='stock'?C.stockDeparture:C.patienceDeparture;
  const review=recordVisit(s,c,score,reason,events);
  if(s.active?.id===c.id){
    Object.values(s.active.made).filter(Boolean).forEach(id=>s.today.wasted[id]++);
    s.active=null;s.feedback={kind:'left',name:c.name,look:c.look,review,reason,until:now+C.feedbackMs};
  }
  events.push('vertrek');
}
export function takeCustomer(s,now=Date.now()){
  if(s.phase!=='day'||s.active||s.feedback||!s.queue.length)return false;
  const c=s.queue.shift();s.active={...c,stage:'read',deadline:now+c.servicePatience,serviceStart:now,machine:0,made:{},selection:{},lockUntil:0,replaced:false};return true;
}
export function negotiate(s,now,events=[]){
  const c=s.active;if(!c||c.stage!=='read'||!missing(s).length)return false;
  if(!c.flexible||!alternatives(s,'tea').length){depart(s,c,'stock',events,now);return true;}
  c.stage='negotiate';return true;
}
export function substitute(s,category,id){
  const c=s.active;if(!c||c.stage!=='negotiate'||!missing(s).some(x=>x.id===category)||!alternatives(s,category).includes(id))return false;
  c.order[category]=id;c.replaced=true;
  if(!missing(s).length)c.stage='read';return true;
}
export function remember(s){if(!s.active||s.active.stage!=='read'||missing(s).length)return false;s.active.stage='prepare';return true;}
export function select(s,category,id){
  const c=s.active;if(!c||c.stage!=='prepare'||c.lockUntil||!CATEGORIES.slice(c.machine*2,c.machine*2+2).some(x=>x.id===category))return false;
  if(id===null?category==='tea':!BY_ID[id]||BY_ID[id].category!==category||s.stock[id]<1)return false;
  c.selection[category]=id;return true;
}
export function confirmMachine(s,machine,now=Date.now(),events=[]){
  const c=s.active;if(!c||c.stage!=='prepare'||c.lockUntil||c.machine!==machine||now>=c.deadline)return false;
  const cats=CATEGORIES.slice(machine*2,machine*2+2);
  if(!cats.every(cat=>Object.hasOwn(c.selection,cat.id)))return false;
  if(!cats.every(cat=>c.selection[cat.id]===null?cat.id!=='tea':s.stock[c.selection[cat.id]]>0))return false;
  for(const cat of cats){const id=c.selection[cat.id];c.made[cat.id]=id;if(id){s.stock[id]--;s.today.used[id]++;s.today.usedCost+=BY_ID[id].cost;s.totals.usedCost+=BY_ID[id].cost;}}
  c.lockUntil=now+C.pourMs;events.push('bubbels');return true;
}
export function assess(order,made,replaced=false,waitFraction=0){
  const errors=CATEGORIES.filter(c=>order[c.id]!==made[c.id]).map(c=>({category:c.id,wanted:order[c.id],made:made[c.id]}));
  const price=C.priceBase+C.priceMultiplier*Object.values(order).reduce((sum,id)=>sum+(id?BY_ID[id].cost:0),0);
  const paid=Math.round(price*Math.max(C.minPayment,1-errors.length*C.errorDiscount));
  const satisfaction=clamp(C.satisfactionBase-C.errorSatisfaction*errors.length-(replaced?C.stockPenalty:0)-C.waitPenalty*clamp(waitFraction,0,1),1,5);
  return {errors,price,paid,discount:price-paid,satisfaction};
}
function serve(s,now,events){
  const c=s.active;const result=assess(c.order,c.made,c.replaced,(now-c.serviceStart)/c.servicePatience);
  s.cash+=result.paid;s.totals.revenue+=result.paid;s.today.revenue+=result.paid;s.today.discount+=result.discount;s.today.served++;s.today.errors+=result.errors.length;if(!result.errors.length)s.today.perfect++;
  const review=recordVisit(s,c,result.satisfaction,result.errors.length?'errors':'perfect',events);
  s.feedback={kind:'served',name:c.name,look:c.look,...result,review,order:c.order,made:c.made,replaced:c.replaced,until:now+C.feedbackMs};s.active=null;
  events.push(result.errors.length?'fout':'succes','kassa');
}
function expire(s,time,events){
  if(s.active&&s.active.deadline<=time)depart(s,s.active,'patience',events,s.active.deadline);
  s.queue=s.queue.filter(c=>{if(c.deadline<=time){depart(s,c,'patience',events,c.deadline);return false;}return true;});
}
function finish(s,events){
  s.previousReputation=s.reputation;
  if(s.today.reviews.length){const avg=s.today.reviews.reduce((a,r)=>a+r.score,0)/s.today.reviews.length;s.reputation=C.reputationOldWeight*s.reputation+(1-C.reputationOldWeight)*avg;}
  s.phase='summary';s.feedback=null;events.push('dageinde');
}
// Process elapsed wall-clock time chronologically, including arrivals while the tab was closed.
export function tick(s,now=Date.now(),events=[]){
  if(s.phase!=='day')return false;
  now=Math.max(now,s.lastTime);let changed=false;
  // Bounded event simulation: catch-up follows the same chronology as visible play.
  for(;;){
    const arrival=s.plan[s.nextArrival]?.arrival ?? Infinity;
    const at=Math.min(arrival<=s.closeTime?arrival:Infinity,s.active?.lockUntil||Infinity,s.active?.deadline||Infinity,...s.queue.map(c=>c.deadline),s.feedback?.until||Infinity);
    if(at>now)break;
    expire(s,at,events);
    if(s.active?.lockUntil&&s.active.lockUntil<=at){s.active.lockUntil=0;if(s.active.machine===2)serve(s,at,events);else{s.active.machine++;s.active.selection={};}}
    if(arrival===at){const c=s.plan[s.nextArrival++];if(s.queue.length<C.maxQueue)s.queue.push({...clone(c),deadline:c.arrival+c.queuePatience});else depart(s,c,'patience',events,at);}
    if(s.feedback&&s.feedback.until<=at)s.feedback=null;
    changed=true;
  }
  s.lastTime=now;
  if(now>=s.closeTime&&!s.queue.length&&!s.active){finish(s,events);changed=true;}
  return changed;
}
export function cartTotal(s){return INGREDIENTS.reduce((sum,i)=>sum+s.cart[i.id]*i.cost,0);}
export function changeCart(s,id,delta){if(s.phase!=='shop'||!BY_ID[id]||!Number.isInteger(delta))return false;s.cart[id]=clamp(s.cart[id]+delta,0,C.maxCartQuantity);return true;}
export function purchase(s,events=[]){
  const total=cartTotal(s);if(s.phase!=='shop'||total<=0||total>s.cash||!INGREDIENTS.every(i=>Number.isInteger(s.cart[i.id])&&s.cart[i.id]>=0&&s.cart[i.id]<=C.maxCartQuantity))return false;
  s.cash-=total;s.today.purchases+=total;s.totals.purchases+=total;for(const i of INGREDIENTS)s.stock[i.id]+=s.cart[i.id];s.cart=blankCounts();events.push('kassa');return true;
}
export function restartDay(s,now=Date.now(),rng=Math.random){
  if(!s.snapshot||!['summary','shop'].includes(s.phase))return false;
  const restored=clone(s.snapshot);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,restored);s.phase='welcome';return openDay(s,now,rng,true);
}
export function validSave(s,depth=0){
  const phases=['welcome','day','summary','shop'];
  const count=x=>Number.isSafeInteger(x)&&x>=0;
  const validRecipe=r=>r&&CATEGORIES.every(c=>r[c.id]===null?!!c.none:BY_ID[r[c.id]]?.category===c.id);
  const partial=r=>r&&typeof r==='object'&&Object.entries(r).every(([category,id])=>CATEGORIES.some(c=>c.id===category)&&(id===null?category!=='tea':BY_ID[id]?.category===category));
  const customer=c=>c&&typeof c.name==='string'&&Number.isInteger(c.level)&&c.level>=1&&c.level<=3&&count(c.look)&&c.look<12&&validRecipe(c.order)&&validRecipe(c.original)&&Number.isFinite(c.arrival)&&Number.isFinite(c.queuePatience)&&c.queuePatience>0&&Number.isFinite(c.servicePatience)&&c.servicePatience>0&&typeof c.flexible==='boolean'&&typeof c.writesReview==='boolean';
  const review=r=>r&&typeof r.name==='string'&&Number.isInteger(r.score)&&r.score>=1&&r.score<=5&&['perfect','errors','stock','patience'].includes(r.reason);
  try{return !!(
    s.version===C.version&&phases.includes(s.phase)&&count(s.cash)&&count(s.day)&&s.day>0&&Number.isFinite(s.reputation)&&s.reputation>=1&&s.reputation<=5&&
    INGREDIENTS.every(i=>count(s.stock[i.id])&&count(s.cart[i.id])&&s.cart[i.id]<=C.maxCartQuantity&&count(s.today.used[i.id])&&count(s.today.wasted[i.id]))&&
    ['served','left','perfect','errors','revenue','discount','usedCost','purchases'].every(k=>count(s.today[k]))&&['revenue','purchases','usedCost'].every(k=>count(s.totals[k]))&&
    C.difficulties[s.settings.difficulty]&&typeof s.settings.music==='boolean'&&typeof s.settings.effects==='boolean'&&['musicVolume','effectsVolume'].every(k=>Number.isFinite(s.settings[k])&&s.settings[k]>=0&&s.settings[k]<=1)&&
    ['all','1','2','3'].includes(s.filters.tier)&&['all',...CATEGORIES.map(c=>c.id)].includes(s.filters.category)&&
    Array.isArray(s.reviews)&&s.reviews.every(review)&&Array.isArray(s.today.reviews)&&s.today.reviews.every(review)&&Array.isArray(s.today.visits)&&
    Array.isArray(s.plan)&&s.plan.every(customer)&&Array.isArray(s.queue)&&s.queue.length<=C.maxQueue&&s.queue.every(c=>customer(c)&&Number.isFinite(c.deadline))&&
    (!s.active||(customer(s.active)&&['read','negotiate','prepare'].includes(s.active.stage)&&Number.isFinite(s.active.deadline)&&Number.isFinite(s.active.serviceStart)&&count(s.active.machine)&&s.active.machine<=2&&count(s.active.lockUntil)&&partial(s.active.made)&&partial(s.active.selection)))&&
    (s.phase!=='day'||(Number.isFinite(s.startTime)&&Number.isFinite(s.closeTime)&&Number.isFinite(s.lastTime)&&count(s.nextArrival)&&s.nextArrival<=s.plan.length))&&
    (!s.feedback||(Number.isFinite(s.feedback.until)&&['served','left'].includes(s.feedback.kind)&&typeof s.feedback.name==='string'&&(s.feedback.kind!=='served'||(validRecipe(s.feedback.order)&&validRecipe(s.feedback.made)&&Array.isArray(s.feedback.errors)&&count(s.feedback.paid)))))&&
    (!['summary','shop'].includes(s.phase)||Number.isFinite(s.previousReputation))&&
    (!s.snapshot||(depth===0&&!s.snapshot.snapshot&&validSave(s.snapshot,depth+1)))
  );
  }catch{return false;}
}
