import CUSTOS_CHAR_SHEET from "./modules/custos_charsheet.js";
import CUSTOS_NPC_SHEET from "./modules/custos_npc.js";
import CUSTOS_BEAST_SHEET from "./modules/custos_beast.js";
import CUSTOS_ITEM_SHEET from "./modules/custos_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
import custosChat from "./modules/chat.js";

var __defProp$t = Object.defineProperty;
var __name$t = (target, value) => __defProp$t(target, "name", { value, configurable: true });
const _CustosGamePause = class _CustosGamePause extends foundry.applications.ui.GamePause {
  /** @override */
  async _renderHTML(context, _options) {
    const img = document.createElement("img");
    img.src = "systems/custos/style/images/pause.webp"
    if (context.spin) {
      img.classList.add("fa-spin");
    }
    const caption = document.createElement("figcaption");
    caption.innerText = context.text;
    //caption.innerText = "Tempus Pausae"
    return [img, caption];
  }
};
__name$t(_CustosGamePause, "CustosGamePause");
let CustosGamePause = _CustosGamePause;

Hooks.once("init", function(){
  //document.getElementById("logo").src = "/systems/custos/style/images/Custos_Logo2.webp";
  console.log("test | INITIALIZING CUSTOS CHARACTER SHEETS...");
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("custos", CUSTOS_CHAR_SHEET, {
    makeDefault: true,
    types: ['Custos']
    
  });
  Actors.registerSheet("custos", CUSTOS_NPC_SHEET, {
    makeDefault: true,
    types: ['npc']
  });
  Actors.registerSheet("custos", CUSTOS_BEAST_SHEET, {
    makeDefault: true,
    types: ['beast']
  });

  console.log("test | INITIALIZING CUSTOS ITEM SHEETS...");
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("custos", CUSTOS_ITEM_SHEET,{
    makeDefault: true,
    types: ['provintia','weapon','armor','shield','object','talent','ritual','summoning','special','magic']
  });

  preloadHandlebarsTemplates();

  
    // Slowing down pings
    CONFIG.Canvas.pings.styles.pulse.duration = 2000
    CONFIG.Canvas.pings.styles.alert.duration = 2000
    CONFIG.Canvas.pings.styles.arrow.duration = 2000

  console.log("test | INITIALIZING CUSTOS SETTINGS...");

  game.settings.register("custos", "enablePietasonTie", {
    name: game.i18n.localize("CUSTOS.config.enablePietasonTieName"),
    hint: game.i18n.localize("CUSTOS.config.enablePietasonTieHint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });

  game.settings.register("custos", "enableCreatio", {
    name: game.i18n.localize("CUSTOS.config.enableCreatioName"),
    hint: game.i18n.localize("CUSTOS.config.enableCreatioHint"),
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  game.settings.register("custos", "useFixedValues", {
    name: game.i18n.localize("CUSTOS.config.useFixedValuesName"),
    hint: game.i18n.localize("CUSTOS.config.useFixedValuesHint"),
    scope: "world",
    type: Boolean,
    default: false,
    config: true
  });

  Handlebars.registerHelper("times", function(n, content)
    {
      let result = "";
      for (let i = 0; i < n; ++i)
      {
          result += content.fn(i);
      }
    
      return result;
    });
  CONFIG.ui.pause = CustosGamePause;    

});

//Hooks.on("renderPause", () => {
//  $("#pause img").attr("class", "fa-spin pause-image");
//  $("#pause figcaption").attr("class", "pause-custos");
//});

Hooks.on('renderChatMessage', (message, html) => custosChat.chatListeners(message, html))
//Hooks.on('renderChatMessage', (message, html) => tricubeChat.chatListeners(message, html))


Hooks.on('refreshToken', () => {

})

Hooks.on("createActor", async (actor) =>{
  const PJImage="systems/custos/style/icons/centurion-helmet.svg"
  const NPCImage="systems/custos/style/icons/roman-toga.svg"
  const BeastImage="systems/custos/style/icons/hydra.svg"
  if (actor.img=="icons/svg/mystery-man.svg"){
    switch (actor.type){
      case 'Custos':
      {
        actor.update ({ 'img': PJImage });
        break;
      }
      case 'npc':
      {
        actor.update ({ 'img': NPCImage });
        break;
      }
      case 'beast':
      {
        actor.update ({ 'img': BeastImage });
        break;
      }
    }
  }
})


Hooks.on("createItem", async (item) =>{
  const provintiaImage="systems/custos/style/icons/italia.svg"
  const weaponImage="systems/custos/style/icons/gladius.svg"
  const armorImage="systems/custos/style/icons/lamellar.svg"
  const shieldImage="systems/custos/style/icons/roman-shield.svg"
  const objectImage="systems/custos/style/icons/swap-bag.svg"
  const talentImage="systems/custos/style/icons/eagle-emblem.svg"
  const ritualImage="systems/custos/style/icons/brasero.svg"
  const summoningImage="systems/custos/style/icons/capitol.svg"
  const specialImage="systems/custos/style/icons/discobolus.svg"
  const magicImage="systems/custos/style/icons/medusa-head.svg"
  if (item.img=="icons/svg/item-bag.svg"){
    switch (item.type){
      case 'provintia':
      {
        item.update ({ 'img': provintiaImage });
        break;
      }
      case 'weapon':
      {
        item.update ({ 'img': weaponImage });
        break;
      }
      case 'armor':
      {
        item.update ({ 'img': armorImage });
        break;
      }
      case 'shield':
      {
        item.update ({ 'img': shieldImage });
        break;
      }
      case 'object':
      {
        item.update ({ 'img': objectImage });
        break;
      }
      case 'talent':
      {
        item.update ({ 'img': talentImage });
        break;
      }
      case 'ritual':
      {
        item.update ({ 'img': ritualImage });
        break;
      }
      case 'summoning':
      {
        item.update ({ 'img': summoningImage });
        break;
      }
      case 'special':
      {
        item.update ({ 'img': specialImage });
        break;
      }
      case 'magic':
      {
        item.update ({ 'img': magicImage });
        break;
      }
    }
  }
})

