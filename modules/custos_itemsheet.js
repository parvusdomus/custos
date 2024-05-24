export default class CUSTOS_ITEM_SHEET extends ItemSheet{
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "item"],
          template: "systems/custos/templates/actors/character.html",
          width: 420,
          height: 530
        });
  
    }
    get template(){
        return `systems/custos/templates/items/${this.item.type}.html`;
    }


  
  }