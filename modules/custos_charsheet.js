import RegularRollDialog from "../modules/rolldialog.js";
import {CombatSingleRoll} from "../modules/combat.js";
import DamageRollDialogSingle from "../modules/damageRollDialogSingle.js";
export default class CUSTOS_CHAR_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "actor"],
          template: "systems/custos/templates/actors/custos/custos.html",
          width: 750,
          height: 800,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "virtutes" }],
          scrollY: ['section.sheet-body']
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'Custos') {
        this._prepareCharacterItems(data);
        this._calculateResources(data);
        this._calculateXp(data);
        this._statusCheck(data);
        if (this.actor.system.creatio.locked == false){
          this._updateProvintiaValues(data);
          this._setAgeBonus(data);
          this._calculateCreatioValues(data);
        }
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Weapons = [];
      const Armors = [];
      const Shields = [];
      const Objects = [];
      const Provintia = [];
      const Talent = [];
      const Rituals = [];
      const Summonings = [];
      let weight=0;
      for (let i of sheetData.items){
        switch (i.type){
				  case 'weapon':
				  {
            Weapons.push(i);
            if (i.system.equipped !== 'dropped'){
              weight+=i.system.weight;
            }
            break;
				  }
          case 'armor':
				  {
            Armors.push(i);
            if (i.system.equipped !== 'dropped'){
              weight+=i.system.weight;
            }            
            break;
				  }
          case 'shield':
				  {
            Shields.push(i);
            if (i.system.equipped !== 'dropped'){
              weight+=i.system.weight;
            }            
            break;
				  }
          case 'object':
				  {
            Objects.push(i);
            if (i.system.equipped !== 'dropped'){
              weight+=i.system.weight;
            }            
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
          case 'talent':
          {
            if (Talent.length <= 0){
              Talent.push(i);
            } 
            else{
              ui.notifications.warn(game.i18n.localize("CUSTOS.ui.cantAddMoreTalents"));
              this.actor.deleteEmbeddedDocuments("Item", [i._id])
            }
            break;			  
          }
          case 'ritual':
				  {
            Rituals.push(i);
            break;
				  }
          case 'summoning':
				  {
            Summonings.push(i);
            break;
				  }
          
        }
      }
      actorData.Provintia = Provintia;
      actorData.Weapons = Weapons;
      actorData.Armors = Armors;
      actorData.Shields = Shields;
      actorData.Objects = Objects;
      actorData.Talent = Talent;
      actorData.Rituals = Rituals;
      actorData.Summonings = Summonings;
      this.actor.update ({ 'system.total_encumbrance': weight });
      let converted = Number (this.actor.system.resources.life.max) - weight
      this.actor.update ({ 'system.converted_encumbrance': converted });
      actorData.settings = {
        enableCreatio: game.settings.get("custos", "enableCreatio"),
      }
      actorData.isGM = game.user.isGM;
      //actorData.effects = this.actor.getEmbeddedCollection("ActiveEffect").contents
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
        this.actor.update ({ 'system.creatio.provintia.languages': actorData.Provintia[0].system.languages });
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

    _calculateResources(sheetData){
      const actorData = sheetData;
      let life_office_bonus=0;
      let pietas_office_bonus=0;
      switch (this.actor.system.office){
        case 'bellicus':
        {
          life_office_bonus=2;
          pietas_office_bonus=0;
          break;
        }
        case 'auguralis':
        {
          life_office_bonus=0;
          pietas_office_bonus=2;
          break;
        }
        case 'exploratorius':
        {
          life_office_bonus=2;
          pietas_office_bonus=0;
          break;
        }
        case 'sapiens':
        {
          life_office_bonus=0;
          pietas_office_bonus=2;
          break;
        }
        case 'legatorius':
        {
          life_office_bonus=1;
          pietas_office_bonus=1;
          break;
        }
        case 'interfectorius':
        {
          life_office_bonus=1;
          pietas_office_bonus=1;
          break;
        }
      }
      this.actor.update ({ 'system.life_office_bonus': life_office_bonus });
      this.actor.update ({ 'system.pietas_office_bonus': pietas_office_bonus });
      let life=Number(this.actor.system.virtutes.vigor.value)+Number(this.actor.system.virtutes.coordinatio.value)+Number(life_office_bonus)+Number(this.actor.system.life_xp_bonus)
      let pietas=Number(this.actor.system.virtutes.ratio.value)+Number(this.actor.system.virtutes.sensibilitas.value)+Number(pietas_office_bonus)+Number(this.actor.system.pietas_xp_bonus)
      this.actor.update ({ 'system.resources.life.max': life });
      this.actor.update ({ 'system.resources.pietas.max': pietas });
      let remaining_life=life-Number(this.actor.system.resources.life.value)
      let remaining_pietas=pietas-Number(this.actor.system.resources.pietas.value)
      this.actor.update ({ 'system.resources.life.remaining': remaining_life });
      this.actor.update ({ 'system.resources.pietas.remaining': remaining_pietas });
    }

    _statusCheck(sheetData){
      if ((Number(this.actor.system.resources.life.value)+Number(this.actor.system.total_encumbrance)) >= Number(this.actor.system.resources.life.max)){
        this.actor.update ({ 'system.status.fatigued': true });
      }
      else {
        this.actor.update ({ 'system.status.fatigued': false });
      }
    }

    _calculateXp(sheetData){
      const actorData = sheetData;
      let total=0
      let remaining=0
      //DE BELLO
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.bello.extra))*Number(this.actor.system.curriculum.bello.multiplier)
      this.actor.update ({ 'system.curriculum.bello.total': total });
      remaining=Number(this.actor.system.curriculum.bello.total)-Number(this.actor.system.curriculum.bello.spent)
      this.actor.update ({ 'system.curriculum.bello.remaining': remaining });
      //DE CORPORE
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.corpore.extra))*Number(this.actor.system.curriculum.corpore.multiplier)
      this.actor.update ({ 'system.curriculum.corpore.total': total });
      remaining=Number(this.actor.system.curriculum.corpore.total)-Number(this.actor.system.curriculum.corpore.spent)
      this.actor.update ({ 'system.curriculum.corpore.remaining': remaining });
      //DE MAGIA
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.magia.extra))*Number(this.actor.system.curriculum.magia.multiplier)
      this.actor.update ({ 'system.curriculum.magia.total': total });
      remaining=Number(this.actor.system.curriculum.magia.total)-Number(this.actor.system.curriculum.magia.spent)
      this.actor.update ({ 'system.curriculum.magia.remaining': remaining });
      //DE NATURA
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.natura.extra))*Number(this.actor.system.curriculum.natura.multiplier)
      this.actor.update ({ 'system.curriculum.natura.total': total });
      remaining=Number(this.actor.system.curriculum.natura.total)-Number(this.actor.system.curriculum.natura.spent)
      this.actor.update ({ 'system.curriculum.natura.remaining': remaining });
      //DE SCIENTIA
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.scientia.extra))*Number(this.actor.system.curriculum.scientia.multiplier)
      this.actor.update ({ 'system.curriculum.scientia.total': total });
      remaining=Number(this.actor.system.curriculum.scientia.total)-Number(this.actor.system.curriculum.scientia.spent)
      this.actor.update ({ 'system.curriculum.scientia.remaining': remaining });
      //DE SOCIETATE
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.societate.extra))*Number(this.actor.system.curriculum.societate.multiplier)
      this.actor.update ({ 'system.curriculum.societate.total': total });
      remaining=Number(this.actor.system.curriculum.societate.total)-Number(this.actor.system.curriculum.societate.spent)
      this.actor.update ({ 'system.curriculum.societate.remaining': remaining });
      //ARCANORUM
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.arcanorum.extra))*Number(this.actor.system.curriculum.arcanorum.multiplier)
      this.actor.update ({ 'system.curriculum.arcanorum.total': total });
      remaining=Number(this.actor.system.curriculum.arcanorum.total)-Number(this.actor.system.curriculum.arcanorum.spent)
      this.actor.update ({ 'system.curriculum.arcanorum.remaining': remaining });
      //DEORUM
      total=(Number(this.actor.system.curriculum.experience)+Number(this.actor.system.curriculum.deorum.extra))*Number(this.actor.system.curriculum.deorum.multiplier)
      this.actor.update ({ 'system.curriculum.deorum.total': total });
      remaining=Number(this.actor.system.curriculum.deorum.total)-Number(this.actor.system.curriculum.deorum.spent)
      this.actor.update ({ 'system.curriculum.deorum.remaining': remaining });

      //RANGO

      switch (true){
        case (Number(this.actor.system.curriculum.arcanorum.spent) < 100):
        {
          this.actor.update ({ 'system.rank': "gregarius" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 100 && Number(this.actor.system.curriculum.arcanorum.spent) < 210):
        {
          this.actor.update ({ 'system.rank': "duplicarius" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 210 && Number(this.actor.system.curriculum.arcanorum.spent) < 330):
        {
          this.actor.update ({ 'system.rank': "beneficiarius" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 330 && Number(this.actor.system.curriculum.arcanorum.spent) < 460):
        {
          this.actor.update ({ 'system.rank': "veteranus" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 460 && Number(this.actor.system.curriculum.arcanorum.spent) < 600):
        {
          this.actor.update ({ 'system.rank': "decanus" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 600 && Number(this.actor.system.curriculum.arcanorum.spent) < 750):
        {
          this.actor.update ({ 'system.rank': "electus" });
          break;
        }
        case (Number(this.actor.system.curriculum.arcanorum.spent) >= 750):
        {
          this.actor.update ({ 'system.rank': "protector" });
          break;
        }
      }
    }


    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.item-create').click(this._onItemCreate.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.item-show').click(this._onShowClick.bind(this));
		  html.find('a.item-delete').click(this._onDeleteClick.bind(this));
      html.find('a.weapon-equip').click(this._onWeaponEquip.bind(this));
      html.find('a.object-equip').click(this._onObjectEquip.bind(this));
      html.find('a.armor-equip').click(this._onArmorEquip.bind(this));
      html.find('a.writedown').click(this._onWriteDown.bind(this));
      html.find('a.lock-creatio').click(this._onLock.bind(this));
      html.find('a.regular-roll').click(this._onDiceRoll.bind(this));
      html.find('a.add-specialty').click(this._onAddSpecialty.bind(this));
      html.find('a.delete-specialty').click(this._onDeleteSpecialty.bind(this));
      html.find('a.virtute-roll').click(this._onVirtuteRoll.bind(this));
      html.find('a.toggle-status').click(this._onToggleStatus.bind(this));
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
      html.find('a.ritual-roll').click(this._onRitualRoll.bind(this));
      html.find('a.summoning-roll').click(this._onSummoningRoll.bind(this));
      html.find('a.weapon-roll').click(this._onWeaponRoll.bind(this));
      html.find('a.damage-roll').click(this._onDamageRoll.bind(this));
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
      if (this.actor.system.creatio.locked == true && item.type=="provintia"){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.locked"));
        return;
      }
		  item.sheet.render(true);
		  return;
    }

    async _onShowClick(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let itemType=""
      switch (item.type){
        case "talent":
        {
          itemType=game.i18n.localize("TYPES.Item.talent")
          break
        }
        case "ritual":
        {
          itemType=game.i18n.localize("TYPES.Item.ritual")
          break
        }
        case "summoning":
        {
          itemType=game.i18n.localize("TYPES.Item.summoning")
          break
        }
      }
      let itemShow = await renderTemplate("systems/custos/templates/chat/itemShow.html", { 
        itemName: item.name,
        itemImage: item.img,
        itemType: itemType,
        itemDescription: item.system.description
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: itemShow
    };

    ChatMessage.create(chatData);
		  return;
    }
    
    async _onDeleteClick(event, data)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      const item = this.actor.items.get(dataset.id);
      if (this.actor.system.creatio.locked == true && item.type=="provintia"){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.locked"));
        return;
      }
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

    async _onWeaponEquip(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let equipped=""
      switch (item.system.equipped){
        case 'dropped':
        {
          equipped="inbag"
          break;
        }
        case 'inbag':
        {
          equipped="onehand"
          break;
        }
        case 'onehand':
        {
          equipped="twohand"
          break;
        }
        case 'twohand':
        {
          equipped="dropped"
          break;
        }
      }
      item.update ({'system.equipped': equipped});
		  return;
    }

    async _onArmorEquip(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let equipped=""
      switch (item.system.equipped){
        case 'dropped':
        {
          equipped="inbag"
          break;
        }
        case 'inbag':
        {
          equipped="worn"
          break;
        }
        case 'worn':
        {
          equipped="dropped"
          break;
        }
      }
      item.update ({'system.equipped': equipped});
		  return;
    }

    async _onObjectEquip(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
		  const item = this.actor.items.get(dataset.id);
      let equipped=""
      switch (item.system.equipped){
        case 'dropped':
        {
          equipped="inbag"
          break;
        }
        case 'inbag':
        {
          equipped="dropped"
          break;
        }
      }
      item.update ({'system.equipped': equipped});
		  return;
    }

    async _onToggleStatus(event, data)
	  {
      console.log ("TOGGLE STATUS")
      const dataset = event.currentTarget.dataset;
      console.log (dataset)
      event.preventDefault();
      let value=false;
      if (dataset.current == "false"){
        value=true
      }
      switch (dataset.status){
        case 'treated':
        {
          this.actor.update ({'system.status.treated': value});
          break;
        }
        case 'fatigued':
        {
          this.actor.update ({'system.status.fatigued': value});
          break;
        }
        case 'cursed':
        {
          this.actor.update ({'system.status.cursed': value});
          break;
        }
        case 'blinded':
        {
          this.actor.update ({'system.status.blinded': value});
          break;
        }
        case 'weakened':
        {
          this.actor.update ({'system.status.weakened': value});
          break;
        }
        case 'sick':
        {
          this.actor.update ({'system.status.sick': value});
          break;
        }
        case 'poisoned':
        {
          this.actor.update ({'system.status.poisoned': value});
          break;
        }
        case 'unconcious':
        {
          this.actor.update ({'system.status.unconcious': value});
          break;
        }
        case 'dying':
        {
          this.actor.update ({'system.status.dying': value});
          /*if (value==true){
            this.actor.createEmbeddedDocuments("ActiveEffect", [{name: "Dying", statuses:["dying"]}])
          }
          else{
            this.actor.deleteEmbeddedDocuments("ActiveEffect", [{name: "Dying", statuses:["dying"]}])
          }*/
          
          break;
        }
        case 'surprised':
        {
          this.actor.update ({'system.status.surprised': value});
          break;
        }
      }
		  return;
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
      switch (dataset.resource){
        case 'life':
        {
          this.actor.update ({'system.resources.life.value': value});
          break;
        }
        case 'pietas':
        {
          this.actor.update ({'system.resources.pietas.value': value});
          break;
        }
      }
      return;
    }

    async _onWriteDown(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
      if (this.actor.system.creatio.locked == true){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.locked"));
        return;
      }
      Dialog.confirm({
        title: game.i18n.localize("CUSTOS.ui.writedownTitle"),
			  content: game.i18n.localize("CUSTOS.ui.writedownText"),
        yes: () => {
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

          this.actor.update ({ 'system.province': this.actor.system.creatio.provintia.name });
          this.actor.update ({ 'system.languages': this.actor.system.creatio.provintia.languages });

          let age=0;
          switch (this.actor.system.creatio.age.value){
            case 'iuvenis':
            {
              age=16;
              break;
            }
            case 'adultus':
            {
              age=31;
              break;
            }
            case 'maturus':
            {
              age=46;
              break;
            }
          }
          this.actor.update ({ 'system.age': age });
        },
        no: () => {},
        defaultYes: false
         });
      
		  return;
    }

    async _onLock(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
      if (this.actor.system.creatio.locked == true){
        this.actor.update ({ 'system.creatio.locked': false });
      }
      else{
        this.actor.update ({ 'system.creatio.locked': true });
      }
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
      if (this.actor.system.creatio.locked == true){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.locked"));
        return;
      }
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
      let total=Number(dataset.pvalue)+Number(dataset.svalue)
      let fatigued=false;
      if (((Number(this.actor.system.resources.life.value)+Number(this.actor.system.total_encumbrance)) >= Number(this.actor.system.resources.life.max)) || this.actor.system.status.fatigued == true){
        fatigued=true;
        if (total > (Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value))){
          total=Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value)
        }
        if (total < 3){
          total=3
        }
      }
      

      let dice= {
        fatigued: fatigued,
        actor_id: this.actor._id,
        rollTitle: dataset.name,
        total: total,
        current:0,
        ndice: 0,
        fixed_dif: false,
        dif: 3,
        d3: 0,
        d4: 0,
        d5: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d20: 0
    };
      new RegularRollDialog(dice).render(true);
      return;
    }

    async _onRitualRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      if ((Number(this.actor.system.resources.pietas.value)+Number(dataset.cost))> Number(this.actor.system.resources.pietas.max)){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.nopietas"));
        return;
      }
      let msg_content="<div class=\"spent-pietas-message\"><h3>"+this.actor.name+" "+game.i18n.localize("CUSTOS.chat.spentPietasRitual")+dataset.name+" ("+dataset.cost+")"+"</h3></div>"
      let chatData = {
        content: msg_content,
        speaker: ChatMessage.getSpeaker()
      };
      let currentpietas=Number(this.actor.system.resources.pietas.value)+Number(dataset.cost)
      await this.actor.update ({ 'system.resources.pietas.value': currentpietas });
      ChatMessage.create(chatData);
      let svalue=0
      if (dataset.speciality!=""){
        for (let [key, value] of Object.entries(this.actor.system.peritiae.magia.specialties)) {
          if (dataset.speciality===value.name){
            svalue=value.modifier
          }
        }
      }
      let total=Number(this.actor.system.peritiae.magia.value)+Number(svalue)
      let fatigued=false;
      if (((Number(this.actor.system.resources.life.value)+Number(this.actor.system.total_encumbrance)) >= Number(this.actor.system.resources.life.max)) || this.actor.system.status.fatigued == true){
        fatigued=true;
        if (total > (Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value))){
          total=Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value)
        }
        if (total < 3){
          total=3
        }
      }
      

      let dice= {
        fatigued: fatigued,
        actor_id: this.actor._id,
        rollTitle: dataset.name,
        total: total,
        current:0,
        ndice: 0,
        fixed_dif: true,
        dif: dataset.difficulty,
        d3: 0,
        d4: 0,
        d5: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d20: 0
    };
      new RegularRollDialog(dice).render(true);
      return;
    }

    async _onSummoningRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      if (dataset.virtus=="none"){
        return;
      }
      if ((Number(this.actor.system.resources.pietas.value)+Number(dataset.cost))> Number(this.actor.system.resources.pietas.max)){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.nopietas"));
        return;
      }
      let msg_content="<div class=\"spent-pietas-message\"><h3>"+this.actor.name+" "+game.i18n.localize("CUSTOS.chat.spentPietasSummoning")+dataset.name+" ("+dataset.cost+")"+"</h3></div>"
      let chatData = {
        content: msg_content,
        speaker: ChatMessage.getSpeaker()
      };
      let currentpietas=Number(this.actor.system.resources.pietas.value)+Number(dataset.cost)
      await this.actor.update ({ 'system.resources.pietas.value': currentpietas });
      ChatMessage.create(chatData);
      let svalue=0
      let pvalue=this.actor.system.virtutes[dataset.virtus].value

      let total=Number(pvalue)+Number(svalue)
      let fatigued=false;
      if (((Number(this.actor.system.resources.life.value)+Number(this.actor.system.total_encumbrance)) >= Number(this.actor.system.resources.life.max))|| this.actor.system.status.fatigued == true){
        fatigued=true;
        if (total > (Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value))){
          total=Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value)
        }
        if (total < 3){
          total=3
        }
      }
      

      let dice= {
        fatigued: fatigued,
        actor_id: this.actor._id,
        rollTitle: dataset.name,
        total: total,
        current:0,
        ndice: 0,
        fixed_dif: false,
        dif: 3,
        d3: 0,
        d4: 0,
        d5: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d20: 0
    };
      new RegularRollDialog(dice).render(true);
      return;
    }

    async _onWeaponRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let item=this.actor.items.get(dataset.item_id)
      let actor=this.actor
      if (item.system.equipped=="dropped" || item.system.equipped=="inbag"){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.noequipped"));
        return;
      }
      let target= Array.from(game.user.targets)[0]?.actor;
      if (!target){
        Dialog.confirm
            ({
		        title: game.i18n.localize("CUSTOS.ui.notargetTitle"),
			    content: game.i18n.localize("CUSTOS.ui.notarget"),
			    yes: () => {
            let pvalue=actor.system.peritiae[item.system.peritia].value;
            let svalue=0;
            if (item.system.speciality!=""){
              for (let [key, value] of Object.entries(actor.system.peritiae[item.system.peritia].specialties)) {
                if (item.system.speciality===value.name){
                  svalue=value.modifier;
                }
              }
            }
            let total=Number(pvalue)+Number(svalue);
            let fatigued=false;
            if (((Number(this.actor.system.resources.life.value)+Number(this.actor.system.total_encumbrance)) >= Number(this.actor.system.resources.life.max))|| this.actor.system.status.fatigued == true){
              fatigued=true;
              if (total > (Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value))){
                total=Number(this.actor.system.resources.life.max)-Number(this.actor.system.resources.life.value)
              }
              if (total < 3){
                total=3
              }
            }
            let weapondifficulty=item.system.difficulty;
            let weapondamage=item.system.damage;
            let rollname=actor.system.peritiae[item.system.peritia].label;
            if (((Number(actor.system.resources.life.value)+Number(actor.system.total_encumbrance)) >= Number(actor.system.resources.life.max))|| this.actor.system.status.fatigued == true){
              fatigued=true;
              if (total > (Number(actor.system.resources.life.max)-Number(actor.system.resources.life.value))){
                total=Number(actor.system.resources.life.max)-Number(actor.system.resources.life.value)
              }
              if (total < 3){
                total=3
              }
            }
            let dice= {
              fatigued: fatigued,
              actor_id: this.actor._id,
              rollTitle: rollname,
              total: total,
              current:0,
              ndice: 0,
              fixed_dif: true,
              dif: weapondifficulty,
              d3: 0,
              d4: 0,
              d5: 0,
              d6: 0,
              d8: 0,
              d10: 0,
              d12: 0,
              d20: 0
            };
            new RegularRollDialog(dice).render(true);
            return;

            },
			    no: () => {return},
			    defaultYes: false
		    });
      }
      else{
        //let listaObjetivos = game.user.targets;
        //for ( let i = 0; i < listaObjetivos.size; i++) {
          //let target= Array.from(game.user.targets)[i]?.actor;
          //await target.update ({ 'system.resources.life.value': i });
          //CombatSingleRoll (this.actor, item, target)
        //}
        CombatSingleRoll (this.actor, item, target)
      }
      return;
    }

    async _onDamageRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      let item=this.actor.items.get(dataset.item_id)
      let actor=this.actor
      let player=false
      if (item.system.equipped=="dropped" || item.system.equipped=="inbag"){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.noequipped"));
        return;
      }
      if (actor.type=="Custos"){
        player=true
      }
      let target= Array.from(game.user.targets)[0]?.actor;

      let multiplier=1
      let weapondamage=item.system.damage
      let totaldamage=Number(weapondamage)*Number(multiplier)
      let targetarmor=0
      if (target){
        let targetequippedarmor=target.items.find((k) => k.type === "armor" && k.system.equipped === "worn");
        if (targetequippedarmor){targetarmor=targetequippedarmor.system.protection}
        let rollDamageData = {
          actor_id: actor._id,
          player: player,
          rollTitle: game.i18n.localize("CUSTOS.chat.damageroll"),
          total: totaldamage,
          armor: targetarmor,
          fatigued: false,
          pjName: actor.name,
          pjImage: actor.img,
          multiplier: multiplier,
          fixed_multiplier: false,
          weapondamage: weapondamage,
          current:0,
          ndice: 0,
          d3: 0,
          d4: 0,
          d5: 0,
          d6: 0,
          d8: 0,
          d10: 0,
          d12: 0,
          d20: 0
        }
    
        new DamageRollDialogSingle(rollDamageData).render(true);
      }
      else {
        Dialog.confirm
            ({
		        title: game.i18n.localize("CUSTOS.ui.notargetTitle"),
			    content: game.i18n.localize("CUSTOS.ui.notarget"),
			    yes: () => {
            let rollDamageData = {
              actor_id: actor._id,
              player: player,
              rollTitle: game.i18n.localize("CUSTOS.chat.damageroll"),
              total: totaldamage,
              armor: targetarmor,
              fatigued: false,
              pjName: actor.name,
              pjImage: actor.img,
              multiplier: multiplier,
              fixed_multiplier: false,
              weapondamage: weapondamage,
              current:0,
              ndice: 0,
              d3: 0,
              d4: 0,
              d5: 0,
              d6: 0,
              d8: 0,
              d10: 0,
              d12: 0,
              d20: 0
            }
        
            new DamageRollDialogSingle(rollDamageData).render(true);
            },
			    no: () => {return},
			    defaultYes: false
		    });
      }
      
    }

  
  }