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

    getData() {
      const data = super.getData();
      data.officeItem = {
        bellicus: "CUSTOS.ui.warrior",
        auguralis: "CUSTOS.ui.augur",
        exploratorius: "CUSTOS.ui.explorer",
        sapiens: "CUSTOS.ui.savant",
        legatorius: "CUSTOS.ui.diplomat",
        interfectorius: "CUSTOS.ui.assassin"
      }
      data.virtusItem = {
        none: "CUSTOS.ui.none",
        coordinatio: "CUSTOS.virtus.coordinatio",
        auctoritas: "CUSTOS.virtus.auctoritas",
        ratio: "CUSTOS.virtus.ratio",
        vigor: "CUSTOS.virtus.vigor",
        ingenium: "CUSTOS.virtus.ingenium",
        sensibilitas: "CUSTOS.virtus.sensibilitas"
      }
      data.rangeItem = {
        cac: "CUSTOS.ui.cac",
        short: "CUSTOS.ui.short",
        medium: "CUSTOS.ui.medium",
        long: "CUSTOS.ui.long"
      }
      data.peritiaItem = {
        bello: "De Bello",
        corpore: "De Corpore",
        magia: "De Magia",
        natura: "De Natura",
        scientia: "De Scientia",
        societate: "De Societate"
      }
      data.characteristicItem = {
        none: "CUSTOS.ui.none",
        slow: "CUSTOS.ui.slow",
        throwing: "CUSTOS.ui.throwing",
        twohand: "CUSTOS.ui.twohand",
        versatile: "CUSTOS.ui.versatile"
      }
      return data;
    }
  }