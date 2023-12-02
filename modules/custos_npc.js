export default class CUSTOS_NPC_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "actor"],
          template: "systems/custos/templates/actors/npc/npc.html",
          width: 650,
          height: 550,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "virtutes" }]
        });
  
    }
    getData() {
      const data = super.getData();
      return data;
    }

    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.add-specialty').click(this._onAddSpecialty.bind(this));
      html.find('a.delete-specialty').click(this._onDeleteSpecialty.bind(this));
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
    }

    async _onResourceChange(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let value=0;
      if (Number(dataset.number)==0){
          if (Number(this.actor.system.resources[dataset.resource].value)==0){
            value=1;
          }
          else{
            value=0;
          }
      }
      else{
        value=Number(dataset.number)+1
      }
      this.actor.update ({'system.resources.life.value': value});
      return;
    }

    _onAddSpecialty(event)
    {
      console.log ("ADD SPECIALITY")
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let specialtyList = this.object.system.peritiae?.[dataset.peritiaid]?.specialties ?? [];
      const currentSpecialties = duplicate( Object.values (specialtyList));
      let key = currentSpecialties.length;
      let keystring = key.toString()
      let name = game.i18n.localize("CUSTOS.ui.name")+keystring
      this.actor.update({[`system.peritiae.${dataset.peritiaid}.specialties`]: [...currentSpecialties, { 'name':name, 'modifier': 0}] });
    }

    _onDeleteSpecialty(event)
    {
      console.log ("DELETE SPECIALITY")
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      Dialog.confirm
      ({
		    title: game.i18n.localize("CUSTOS.ui.deleteTitle"),
			  content: game.i18n.localize("CUSTOS.ui.deleteText"),
			  yes: () => {
          let specialityList = this.object.system.peritiae?.[dataset.peritiaid]?.specialties ?? [];
          const currentSpecialties = duplicate(Object.values (specialityList)).filter(item => item.name!==dataset.specialityid);
          this.actor.update({[`system.peritiae.${dataset.peritiaid}.specialties`]: [...currentSpecialties] });
        },
			  no: () => {},
			  defaultYes: false
		  });
      return 
    }

  
  }