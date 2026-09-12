import {CONFIG} from './config.js';
import {fresh,validSave} from './engine.js';
export function load(storage){
  try{
    const raw=storage.getItem(CONFIG.storageKey);if(!raw)return {state:fresh()};
    let state;try{state=JSON.parse(raw);}catch{}
    if(validSave(state))return {state,resumed:true};
    // Preserve the damaged bytes; never silently replace existing progress.
    return {state:fresh(),blocked:true,message:'De opgeslagen voortgang is beschadigd of van een andere versie. Je bestaande opslag blijft bewaard. Download een kopie of kies bewust Nieuw spel.'};
  }catch{return {state:fresh(),unavailable:true,message:'Automatisch opslaan is niet beschikbaar. Je kunt spelen, maar voortgang kan verloren gaan als je deze pagina sluit.'};}
}
export function save(storage,state){try{storage.setItem(CONFIG.storageKey,JSON.stringify(state));return true;}catch{return false;}}
