import CUSTOS_CHAR_SHEET from "./modules/custos_charsheet.js";
import CUSTOS_NPC_SHEET from "./modules/custos_npc.js";
import CUSTOS_ITEM_SHEET from "./modules/custos_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
import {_getInitiativeFormula} from './modules/combat.js';
import {diceToFaces} from "./modules/rolls.js";
import custosChat from "./modules/chat.js";



Hooks.once("init", function(){
  document.getElementById("logo").src = "/systems/custos/style/images/Custos_Logo2.webp";
  console.log("test | INITIALIZING CUSTOS CHARACTER SHEETS...");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("custos", CUSTOS_CHAR_SHEET, {
    makeDefault: true,
    types: ['Player']
    
  });
  Actors.registerSheet("custos", CUSTOS_NPC_SHEET, {
    makeDefault: true,
    types: ['Challenge']
  });
  console.log("test | INITIALIZING CUSTOS ITEM SHEETS...");
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("custos", CUSTOS_ITEM_SHEET,{
    makeDefault: true,
    types: ['provintia','proprium']
  });
  preloadHandlebarsTemplates();

    // Slowing down pings
    CONFIG.Canvas.pings.styles.pulse.duration = 2000
    CONFIG.Canvas.pings.styles.alert.duration = 2000
    CONFIG.Canvas.pings.styles.arrow.duration = 2000

  console.log("test | INITIALIZING CUSTOS SETTINGS...");

  //DICE FACE HELPER
  Handlebars.registerHelper("times", function(n, content)
    {
      let result = "";
      for (let i = 0; i < n; ++i)
      {
          result += content.fn(i);
      }
    
      return result;
    });
    
  Handlebars.registerHelper("face", diceToFaces);

});


Hooks.on("renderPause", () => {
  $("#pause img").attr("class", "fa-spin pause-image");
  $("#pause figcaption").attr("class", "pause-custos");
});

Hooks.on('renderChatLog', (app, html, data) => custosChat.chatListeners(html))

Hooks.on('refreshToken', () => {

})

Hooks.on("createActor", async (actor) =>{
  console.log ("CREATE ACTOR")
  console.log (actor)
  const PJImage="systems/custos/style/icons/centurion-helmet.svg"
  switch (actor.type){
    case 'Player':
    {
      actor.update ({ 'img': PJImage });
      break;
    }
  }
})