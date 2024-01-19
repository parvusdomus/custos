import {RegularNPCDiceRoll} from "../modules/rolls.js";
import DamageRollDialogSingle from "../modules/damageRollDialogSingle.js";
export default class CUSTOS_BEAST_SHEET extends ActorSheet{
    static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
          classes: ["custos", "sheet", "actor"],
          template: "systems/custos/templates/actors/beast/beast.html",
          width: 650,
          height: 600,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "virtutes" }]
        });
  
    }
    getData() {
      const data = super.getData();
      if (this.actor.type == 'beast') {
        this._prepareCharacterItems(data);
      }
      return data;
    }

    _prepareCharacterItems(sheetData){
      const actorData = sheetData;
      const Weapons = [];
      const Armors = [];
      const Shields = [];
      const Objects = [];
      const Special = [];
      const Magic = [];
      for (let i of sheetData.items){
        switch (i.type){
				  case 'weapon':
				  {
            Weapons.push(i);
            break;
				  }
          case 'armor':
				  {
            Armors.push(i);
            break;
				  }
          case 'shield':
				  {
            Shields.push(i);
            break;
				  }
          case 'object':
				  {
            Objects.push(i);
            break;
				  }
          case 'special':
				  {
            Special.push(i);
            break;
				  }
          case 'magic':
				  {
            Magic.push(i);
            break;
				  }
        }
      }
      actorData.Weapons = Weapons;
      actorData.Armors = Armors;
      actorData.Shields = Shields;
      actorData.Objects = Objects;
      actorData.Special = Special;
      actorData.Magic = Magic;
      actorData.settings = {

      }
      actorData.isGM = game.user.isGM;
    }

    activateListeners(html)
	  {
		  super.activateListeners(html);
      html.find('a.add-specialty').click(this._onAddSpecialty.bind(this));
      html.find('a.delete-specialty').click(this._onDeleteSpecialty.bind(this));
      html.find('a.resource-change').click(this._onResourceChange.bind(this));
      html.find('a.fate-toggle').click(this._onFateToggle.bind(this));
      html.find('a.regular-roll').click(this._onDiceRoll.bind(this));
      html.find('a.item-edit').click(this._onEditClick.bind(this));
      html.find('a.item-show').click(this._onShowClick.bind(this));
      html.find('a.knowledge-show').click(this._onShowKnowledge.bind(this));
		  html.find('a.item-delete').click(this._onDeleteClick.bind(this));
      html.find('a.weapon-equip').click(this._onWeaponEquip.bind(this));
      html.find('a.object-equip').click(this._onObjectEquip.bind(this));
      html.find('a.armor-equip').click(this._onArmorEquip.bind(this));
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
        case "special":
        {
          itemType=game.i18n.localize("TYPES.Item.special")
          break
        }
        case "magic":
        {
          itemType=game.i18n.localize("TYPES.Item.magic")
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

    async _onShowKnowledge(event, data)
	  {
      event.preventDefault();
		  const dataset = event.currentTarget.dataset;
      let actor=this.actor
      let knowledgeLevel=""
      let knowledgeText=""
      switch (dataset.level){
        case "one":
        {
          knowledgeLevel=game.i18n.localize("CUSTOS.chat.marginal")
          knowledgeText=actor.system.knowledge.one
          break
        }
        case "two":
        {
          knowledgeLevel=game.i18n.localize("CUSTOS.chat.regular")
          knowledgeText=actor.system.knowledge.two
          break
        }
        case "three":
        {
          knowledgeLevel=game.i18n.localize("CUSTOS.chat.extraordinary")
          knowledgeText=actor.system.knowledge.three
          break
        }
      }
      let knowledgeContent = await renderTemplate("systems/custos/templates/chat/itemShow.html", { 
        itemName: actor.name,
        itemImage: actor.img,
        itemType: knowledgeLevel,
        itemDescription: knowledgeText
    });
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: knowledgeContent
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

    async _onFateToggle(event, data)
    {
      event.preventDefault();
      if (this.actor.system.hasFate){
        this.actor.update ({'system.hasFate': false});
      }
      else{
        this.actor.update ({'system.hasFate': true});
      }
      
      return;
    }

    _onAddSpecialty(event)
    {
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

    async _onDiceRoll(event)
    {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;

      let diceData= {
        actor_id: this.actor._id,
        rollTitle: dataset.name,
        ndice: dataset.ndice,
        sides: dataset.sides
    };
      RegularNPCDiceRoll (diceData)
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