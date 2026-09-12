export const CATEGORIES = [
  {id:'tea',name:'Thee',none:null,names:['Zwarte thee','Jasmijnthee','Matcha'],costs:[40,70,120],colors:['#ae7550','#d7b960','#87a971']},
  {id:'milk',name:'Melk / romige basis',none:'Zonder melk',names:['Gewone melk','Havermelk','Gecondenseerde melk'],costs:[30,50,80],colors:['#f4e6cf','#d9bc8b','#f1d69c']},
  {id:'flavor',name:'Smaak',none:'Geen smaak',names:['Aardbei','Vanille','Perzik'],costs:[30,50,80],colors:['#dd8089','#e4c176','#eda672']},
  {id:'sweet',name:'Zoetstof',none:'Geen zoetstof',names:['Suiker','Honing','Bruine suikersiroop'],costs:[20,40,70],colors:['#f0decb','#ddb050','#95664b']},
  {id:'boba',name:'Boba',none:'Geen boba',names:['Zwarte boba','Crystal boba','Mango popping boba'],costs:[40,70,120],colors:['#624737','#dccdb5','#e9ac44']},
  {id:'topping',name:'Topping',none:'Geen topping',names:['Kokos jelly','Koffie jelly','Aloë vera'],costs:[30,50,80],colors:['#f1e1c1','#9b7154','#b7cf91']},
];
export const INGREDIENTS=CATEGORIES.flatMap(c=>c.names.map((name,i)=>({id:`${c.id}${i+1}`,category:c.id,name,tier:i+1,cost:c.costs[i],color:c.colors[i]})));
export const BY_ID=Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]));
export const CONFIG={
  version:1,storageKey:'boba-tea-shop-v1',startCash:3000,startStock:20,startReputation:3,
  priceBase:200,priceMultiplier:2,errorDiscount:.12,minPayment:.25,
  omissionChance:.2,recipeWeights:{1:[1,0,0],2:[.35,.65,0],3:[.15,.30,.55]},
  dayMs:240000,baseCustomers:10,reputationCustomers:3,minCustomers:6,maxCustomers:16,maxPlanned:24,maxQueue:5,
  firstArrivalMs:1800,arrivalJitter:.28,patienceMinMs:65000,patienceMaxMs:100000,
  difficulties:{easy:{name:'Makkelijk',customers:.75,patience:1.5},normal:{name:'Normaal',customers:1,patience:1},hard:{name:'Moeilijk',customers:1.3,patience:.75}},
  flexibility:.65,reviewChance:.4,satisfactionBase:5,errorSatisfaction:.7,stockPenalty:.5,waitPenalty:.5,stockDeparture:2,patienceDeparture:1,
  reputationOldWeight:.75,levelThresholds:[3.5,4.2],levelMixes:[[1,0,0],[.7,.3,0],[.45,.35,.2]],
  pourMs:560,feedbackMs:10000,maxCartQuantity:999,
  audio:{musicVolume:.28,effectsVolume:.5,shopMusicFactor:.8,maxEffects:4,minEffectGapMs:55,fadeSeconds:.05,limiter:{threshold:-5,knee:6,ratio:20,attack:.003,release:.15},bpm:112,bars:32,key:'C majeur',arrangement:'A–A–B–A',theme:'boba_bubbly_theme.wav',effects:{tik:'fx_tik.wav',bubbels:'fx_bubbels.wav',succes:'fx_succes.wav',fout:'fx_fout.wav',kassa:'fx_kassa.wav',vertrek:'fx_vertrek.wav',dageinde:'fx_dageinde.wav'}},
};
export const money=c=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(c/100);
export const label=(id,category)=>id?BY_ID[id].name:CATEGORIES.find(c=>c.id===category).none;
