export default class CUSTOS_NPC_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "actor"],
          template: "systems/custos/templates/actors/npc.html",
          width: 600,
          height: 505,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }]
        });
  
    }
    getData() {
      const data = super.getData();
      return data;
    }

    activateListeners(html)
	  {
		  super.activateListeners(html);
    }
  
  }