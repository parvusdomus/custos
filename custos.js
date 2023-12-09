import CUSTOS_CHAR_SHEET from "./modules/custos_charsheet.js";
import CUSTOS_NPC_SHEET from "./modules/custos_npc.js";
import CUSTOS_BEAST_SHEET from "./modules/custos_beast.js";
import CUSTOS_ITEM_SHEET from "./modules/custos_itemsheet.js";
import { preloadHandlebarsTemplates } from "./modules/preloadTemplates.js";
//import {_getInitiativeFormula} from './modules/combat.js';
import custosChat from "./modules/chat.js";
import leftPanel from "./modules/leftpanel.js";
//import custosDialog from "./modules/dialogs.js";


Hooks.once("init", function(){
  document.getElementById("logo").src = "/systems/custos/style/images/Custos_Logo2.webp";
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
  registerLayers();

  
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

  Handlebars.registerHelper("times", function(n, content)
    {
      let result = "";
      for (let i = 0; i < n; ++i)
      {
          result += content.fn(i);
      }
    
      return result;
    });
    

});

function registerLayers() {
  CONFIG.Canvas.layers.battlemat = { layerClass: ControlsLayer, group: "interface" };
}

Hooks.on("renderPause", () => {
  $("#pause img").attr("class", "fa-spin pause-image");
  $("#pause figcaption").attr("class", "pause-custos");
});

Hooks.on('renderChatLog', (app, html, data) => custosChat.chatListeners(html))

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push(
    {
        name: "battlemat",
        title: "Battlemat",
        icon: "fa-solid fa-swords",
        layer: "battlemat",
        visible: true,
        button: true,
        tools: [
        {
          name: "battlemat",
          title: "Open Battlemat",
          layer: "battlemat",
          icon: "fa-solid fa-swords",
          onClick: () => {
            console.log ("DICE 6");
          },
        }],
        activeTool: "battlemat",
    }
  );
});

Hooks.on('refreshToken', () => {

})

Hooks.on("createActor", async (actor) =>{
  const PJImage="systems/custos/style/icons/centurion-helmet.svg"
  const NPCImage="systems/custos/style/icons/roman-toga.svg"
  const BeastImage="systems/custos/style/icons/hydra.svg"
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
})

