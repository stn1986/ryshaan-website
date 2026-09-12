import {CONFIG as C} from './config.js';
export class Sound {
  constructor(onError=()=>{}){this.onError=onError;this.buffers={};this.active=new Set();this.lastFx=0;this.hidden=false;}
  async unlock(settings,phase){
    this.settings=settings;this.phase=phase;
    try{
      if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.musicGain=this.ctx.createGain();this.fxGain=this.ctx.createGain();this.musicGain.gain.value=0;this.fxGain.gain.value=0;this.limiter=this.ctx.createDynamicsCompressor();for(const [key,value] of Object.entries(C.audio.limiter))this.limiter[key].value=value;this.musicGain.connect(this.limiter);this.fxGain.connect(this.limiter);this.limiter.connect(this.ctx.destination);this.loading=this.load();}
      if(!document.hidden)await this.ctx.resume();this.update(settings,phase);await this.loading;
      if(!this.music){this.music=this.ctx.createBufferSource();this.music.buffer=this.buffers.theme;this.music.loop=true;this.music.connect(this.musicGain);this.music.start();}
    }catch{this.onError('Geluid kon niet starten. Tik later nog eens op Geluid; je kunt gewoon verder spelen.');}
  }
  async load(){await Promise.all(Object.entries({theme:C.audio.theme,...C.audio.effects}).map(async([key,file])=>{const r=await fetch(new URL(`../audio/${file}`,import.meta.url));if(!r.ok)throw Error(file);this.buffers[key]=await this.ctx.decodeAudioData(await r.arrayBuffer());}));}
  update(settings,phase){this.settings=settings;this.phase=phase;if(!this.ctx)return;const now=this.ctx.currentTime;this.musicGain.gain.setTargetAtTime(settings.music&&!this.hidden?settings.musicVolume*(phase==='shop'?C.audio.shopMusicFactor:1):0,now,C.audio.fadeSeconds);this.fxGain.gain.setTargetAtTime(settings.effects&&!this.hidden?settings.effectsVolume:0,now,C.audio.fadeSeconds);}
  play(key,delay=0){
    if(!this.ctx||this.ctx.state!=='running'||this.hidden||document.hidden||!this.settings.effects||!this.buffers[key]||this.active.size>=C.audio.maxEffects)return;
    const now=performance.now();if(!delay&&now-this.lastFx<C.audio.minEffectGapMs)return;this.lastFx=now;
    const source=this.ctx.createBufferSource();source.buffer=this.buffers[key];source.connect(this.fxGain);this.active.add(source);source.onended=()=>{this.active.delete(source);source.disconnect();};source.start(this.ctx.currentTime+delay);
  }
  async visibility(hidden){this.hidden=hidden;if(!this.ctx)return;this.update(this.settings,this.phase);if(hidden){await new Promise(resolve=>setTimeout(resolve,C.audio.fadeSeconds*1000*3));if(!this.hidden)return;for(const source of this.active){try{source.stop();}catch{}}await this.ctx.suspend();}else{try{await this.ctx.resume();}catch{}this.update(this.settings,this.phase);}}
}
