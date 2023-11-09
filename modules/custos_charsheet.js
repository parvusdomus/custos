export default class CUSTOS_CHAR_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "actor"],
          template: "systems/custos/templates/actors/character.html",
          width: 750,
          height: 800,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "general" }],
          scrollY: ['section.sheet-body']
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'Player') {
        this._prepareCharacterItems(data);
        //this._updateInitiative(data);
        this._updateProvintiaValues(data);
        this._setAgeBonus(data);
        this._calculateCreatioValues(data);
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Weapons = [];
      const Provintia = [];
      for (let i of sheetData.items){
        switch (i.type){
				  case 'weapons':
				  {
            Weapons.push(i);
            break;
				  }
          case 'provintia':
          {
            if (Provintia.length <= 0){
              Provintia.push(i);
            } 
            else{
              ui.notifications.warn(game.i18n.localize("CUSTOS.ui.cantAddMore"));
              this.actor.deleteEmbeddedDocuments("Item", [i._id])
            }
            break;			  
          }
          
        }
      }
      actorData.Provintia = Provintia;
      actorData.settings = {

      }
      actorData.isGM = game.user.isGM;
    }

    _updateProvintiaValues(sheetData){
      const actorData = sheetData;
      if (actorData.Provintia[0]){
        this.actor.update ({ 'system.creatio.provintia.name': actorData.Provintia[0].name });
        this.actor.update ({ 'system.creatio.provintia.bello': actorData.Provintia[0].system.bello });
        this.actor.update ({ 'system.creatio.provintia.corpore': actorData.Provintia[0].system.corpore });
        this.actor.update ({ 'system.creatio.provintia.magia': actorData.Provintia[0].system.magia });
        this.actor.update ({ 'system.creatio.provintia.natura': actorData.Provintia[0].system.natura });
        this.actor.update ({ 'system.creatio.provintia.scientia': actorData.Provintia[0].system.scientia });
        this.actor.update ({ 'system.creatio.provintia.societate': actorData.Provintia[0].system.societate });
      }

    }

    _setAgeBonus(sheetData){
      const actorData = sheetData;
      let vigor=0;
      let coordinatio=0;
      let ingenium=0;
      let auctoritas=0;
      let ratio=0;
      let sensibilitas=0;
      switch (this.actor.system.creatio.age.value){
        case 'iuvenis':
        {
          vigor=3;
          coordinatio=3;
          ingenium=3;
          auctoritas=3;
          ratio=3;
          sensibilitas=3;
          break;
        }
        case 'adultus':
        {
          vigor=2;
          coordinatio=2;
          ingenium=3;
          auctoritas=4;
          ratio=4;
          sensibilitas=3;
          break;
        }
        case 'maturus':
        {
          vigor=1;
          coordinatio=1;
          ingenium=3;
          auctoritas=5;
          ratio=5;
          sensibilitas=3;
          break;
        }
      }
      this.actor.update ({ 'system.creatio.age.vigor.bonus': vigor });
      this.actor.update ({ 'system.creatio.age.coordinatio.bonus': coordinatio });
      this.actor.update ({ 'system.creatio.age.ingenium.bonus': ingenium });
      this.actor.update ({ 'system.creatio.age.auctoritas.bonus': auctoritas });
      this.actor.update ({ 'system.creatio.age.ratio.bonus': ratio });
      this.actor.update ({ 'system.creatio.age.sensibilitas.bonus': sensibilitas });
    }


    _calculateCreatioValues(sheetData){
      const actorData = sheetData;
      let vigor=Number(this.actor.system.creatio.age.vigor.bonus)+Number(this.actor.system.creatio.virtutes.vigor);
      let coordinatio=Number(this.actor.system.creatio.age.coordinatio.bonus)+Number(this.actor.system.creatio.virtutes.coordinatio);
      let ingenium=Number(this.actor.system.creatio.age.ingenium.bonus)+Number(this.actor.system.creatio.virtutes.ingenium);
      let auctoritas=Number(this.actor.system.creatio.age.auctoritas.bonus)+Number(this.actor.system.creatio.virtutes.auctoritas);
      let ratio=Number(this.actor.system.creatio.age.ratio.bonus)+Number(this.actor.system.creatio.virtutes.ratio);
      let sensibilitas=Number(this.actor.system.creatio.age.sensibilitas.bonus)+Number(this.actor.system.creatio.virtutes.sensibilitas);

      let bello=Number(this.actor.system.creatio.half_values.vigor_bello)+Number(this.actor.system.creatio.half_values.auctoritas_bello)+Number(this.actor.system.creatio.provintia.bello);
      let corpore= Number(this.actor.system.creatio.half_values.coordinatio_corpore)+Number(this.actor.system.creatio.half_values.vigor_corpore)+Number(this.actor.system.creatio.provintia.corpore);
      let magia= Number(this.actor.system.creatio.half_values.sensibilitas_magia)+Number(this.actor.system.creatio.half_values.ingenium_magia)+Number(this.actor.system.creatio.provintia.magia);
      let natura= Number(this.actor.system.creatio.half_values.coordinatio_natura)+Number(this.actor.system.creatio.half_values.sensibilitas_natura)+Number(this.actor.system.creatio.provintia.natura);
      let scientia= Number(this.actor.system.creatio.half_values.ingenium_scientia)+Number(this.actor.system.creatio.half_values.ratio_scientia)+Number(this.actor.system.creatio.provintia.scientia);
      let societate= Number(this.actor.system.creatio.half_values.ratio_societate)+Number(this.actor.system.creatio.half_values.auctoritas_societate)+Number(this.actor.system.creatio.provintia.societate);
      
      this.actor.update ({ 'system.creatio.age.vigor.value': vigor})
      this.actor.update ({ 'system.creatio.age.coordinatio.value': coordinatio})
      this.actor.update ({ 'system.creatio.age.ingenium.value': ingenium})
      this.actor.update ({ 'system.creatio.age.auctoritas.value': auctoritas})
      this.actor.update ({ 'system.creatio.age.ratio.value': ratio})
      this.actor.update ({ 'system.creatio.age.sensibilitas.value': sensibilitas})

      this.actor.update ({ 'system.creatio.peritiae.bello': bello})
      this.actor.update ({ 'system.creatio.peritiae.corpore': corpore})
      this.actor.update ({ 'system.creatio.peritiae.magia': magia})
      this.actor.update ({ 'system.creatio.peritiae.natura': natura})
      this.actor.update ({ 'system.creatio.peritiae.scientia': scientia})
      this.actor.update ({ 'system.creatio.peritiae.societate': societate})
    }




    _updateInitiative(sheetData){
      let initiative=""
      if (sheetData.actor.system.trait=="Agile" || sheetData.actor.system.subtrait.reflexes){
        initiative="3d6cs>=5"
      }
      else{
        initiative="2d6cs>=5"
      }
      this.actor.update ({ 'system.initiative': initiative });
    }


    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.item-create').click(this._onItemCreate.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.item-show').click(this._onShowClick.bind(this));
		  html.find('a.item-delete').click(this._onDeleteClick.bind(this));
      html.find('a.writedown').click(this._onWriteDown.bind(this));
      html.find('a.regular-roll').click(this._onDiceRoll.bind(this));
      html.find('a.add-specialty').click(this._onAddSpecialty.bind(this));
      html.find('a.delete-specialty').click(this._onDeleteSpecialty.bind(this));
      html.find('a.virtute-roll').click(this._onVirtuteRoll.bind(this));
    }

    _onItemCreate(event) {
      event.preventDefault();
      const header = event.currentTarget;
      const type = header.dataset.type;
      const data = duplicate(header.dataset);
      const name = `${type.capitalize()}`;
      const itemData = {
        name: name,
        type: type,
        data: data
      };
      // Remove the type from the dataset since it's in the itemData.type prop.
      delete itemData.data["type"];
    
      // Finally, create the item!
      //     return this.actor.createOwnedItem(itemData);
      return Item.create(itemData, {parent: this.actor});
    }

    async _onEditClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
		  item.sheet.render(true);
		  return;
    }

    async _onShowClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let chatData = {}
      let msg_content = "<p><span>"+item.name+" </span>"
      if (item.system.tag != ""){msg_content+="<span style=\"background-color:"+item.system.bg_color+"; color:"+item.system.text_color+"\">&nbsp;"+item.system.tag+"&nbsp;</span>"}
      msg_content+="</p>"
      if (item.system.desc != ""){msg_content+="<hr>"+item.system.desc}
      chatData = {
        content: msg_content,
      };
      ChatMessage.create(chatData);
		  return;
    }
    
    async _onDeleteClick(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      const item = this.actor.items.get(dataset.id);
      Dialog.confirm({
        title: game.i18n.localize("CUSTOS.ui.deleteTitle"),
			  content: game.i18n.localize("CUSTOS.ui.deleteText"),
        yes: () => {
          if (item.type == 'provintia')
          {
            this.actor.update ({ 'system.creatio.provintia.name': '' });
            this.actor.update ({ 'system.creatio.provintia.bello': 0 });
            this.actor.update ({ 'system.creatio.provintia.corpore': 0 });
            this.actor.update ({ 'system.creatio.provintia.magia': 0 });
            this.actor.update ({ 'system.creatio.provintia.natura': 0 });
            this.actor.update ({ 'system.creatio.provintia.scientia': 0 });
            this.actor.update ({ 'system.creatio.provintia.societate': 0 });
          }
          this.actor.deleteEmbeddedDocuments("Item", [dataset.id])
        },
        no: () => {},
        defaultYes: false
         });
      return;
    }

    async _onWriteDown(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
      this.actor.update ({ 'system.virtutes.coordinatio.value': this.actor.system.creatio.age.coordinatio.value });
      this.actor.update ({ 'system.virtutes.auctoritas.value': this.actor.system.creatio.age.auctoritas.value });
      this.actor.update ({ 'system.virtutes.ratio.value': this.actor.system.creatio.age.ratio.value });
      this.actor.update ({ 'system.virtutes.vigor.value': this.actor.system.creatio.age.vigor.value });
      this.actor.update ({ 'system.virtutes.ingenium.value': this.actor.system.creatio.age.ingenium.value });
      this.actor.update ({ 'system.virtutes.sensibilitas.value': this.actor.system.creatio.age.sensibilitas.value });

      this.actor.update ({ 'system.peritiae.bello.value': this.actor.system.creatio.peritiae.bello });
      this.actor.update ({ 'system.peritiae.corpore.value': this.actor.system.creatio.peritiae.corpore });
      this.actor.update ({ 'system.peritiae.magia.value': this.actor.system.creatio.peritiae.magia });
      this.actor.update ({ 'system.peritiae.natura.value': this.actor.system.creatio.peritiae.natura });
      this.actor.update ({ 'system.peritiae.scientia.value': this.actor.system.creatio.peritiae.scientia });
      this.actor.update ({ 'system.peritiae.societate.value': this.actor.system.creatio.peritiae.societate });
		  return;
    }
    

    _onAddSpecialty(event)
    {
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

    async _onVirtuteRoll(event)
    {
      let dados=[];
      let values=[];
      let d6Roll = await new Roll("12d6").roll({async: false});
      for (let i = 0; i < 12; i++) {
        let j=i++;
        dados.push(d6Roll.terms[0].results[i].result);
        let value=Number(d6Roll.terms[0].results[i].result)+Number(d6Roll.terms[0].results[j].result)
        values.push(value)
      }
      await this.actor.update ({ 'system.creatio.values.val1': values[0] });
      await this.actor.update ({ 'system.creatio.values.val2': values[1] });
      await this.actor.update ({ 'system.creatio.values.val3': values[2] });
      await this.actor.update ({ 'system.creatio.values.val4': values[3] });
      await this.actor.update ({ 'system.creatio.values.val5': values[4] });
      await this.actor.update ({ 'system.creatio.values.val6': values[5] });
      await this.actor.update ({ 'system.creatio.virtutes.coordinatio': 0 });
      await this.actor.update ({ 'system.creatio.virtutes.auctoritas': 0 });
      await this.actor.update ({ 'system.creatio.virtutes.ratio': 0 });
      await this.actor.update ({ 'system.creatio.virtutes.vigor': 0 });
      await this.actor.update ({ 'system.creatio.virtutes.ingenium': 0 });
      await this.actor.update ({ 'system.creatio.virtutes.sensibilitas': 0 });
      await this.actor.update ({ 'system.creatio.half_values.vigor_corpore': 0 });
      await this.actor.update ({ 'system.creatio.half_values.vigor_bello': 0 });
      await this.actor.update ({ 'system.creatio.half_values.coordinatio_corpore': 0 });
      await this.actor.update ({ 'system.creatio.half_values.coordinatio_natura': 0 });
      await this.actor.update ({ 'system.creatio.half_values.sensibilitas_natura': 0 });
      await this.actor.update ({ 'system.creatio.half_values.sensibilitas_magia': 0 });
      await this.actor.update ({ 'system.creatio.half_values.ingenium_magia': 0 });
      await this.actor.update ({ 'system.creatio.half_values.ingenium_scientia': 0 });
      await this.actor.update ({ 'system.creatio.half_values.ratio_scientia': 0 });
      await this.actor.update ({ 'system.creatio.half_values.ratio_societate': 0 });
      await this.actor.update ({ 'system.creatio.half_values.auctoritas_societate': 0 });
      await this.actor.update ({ 'system.creatio.half_values.auctoritas_bello': 0 });

    }

    async _onDiceRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      console.log ("DICE ROLL")
      console.log ("DATASET")
      console.log (dataset)
      //DiceRollV2(event);
      return;
    }
  
  }