import DamageRollDialogSingle from "../modules/damageRollDialogSingle.js";
export default class custosChat {
  static chatListeners (html) {
    html.on('click', '.spend', this._spendPietas.bind(this));
    html.on('click', '.damage', this._rollDamage.bind(this));
    html.on('click', '.damageapply', this._applyDamage.bind(this));
  }

  static _spendPietas (event){
    const dataset = event.currentTarget.dataset;
    const element = event.currentTarget;
    const messageId = $(element)
      .parents('[data-message-id]')
      .attr('data-message-id');
    const message = game.messages.get(messageId)
    let actor=game.actors.get(dataset.actor_id)
    let rollResult=""
    if (actor.type=="Custos" && Number(actor.system.resources.pietas.value) < Number(actor.system.resources.pietas.max)){
      let pietasValue = Number(actor.system.resources.pietas.value)+1
      actor.update ({ 'system.resources.pietas.value': pietasValue });
      rollResult="<td class=\"success\">"+game.i18n.localize("CUSTOS.chat.marginal")+"</td>"
      let msg_content="<div class=\"spent-pietas-message\"><h3>"+dataset.name+" "+game.i18n.localize("CUSTOS.chat.spentPietas")+"</h3></div>"
      let chatData = {
        content: msg_content,
        speaker: ChatMessage.getSpeaker()
      };
      ChatMessage.create(chatData);
    }
    else{
      ui.notifications.warn(game.i18n.localize("CUSTOS.ui.nopietas"));
      rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td>"
    }
    const template = 'systems/custos/templates/chat/simpleTestResult.html';
      
    const data = {
      pjName: dataset.name,
      pjImage: dataset.pjimage,
      rollTitle: dataset.rolltitle,
      totalRoll: dataset.totalroll, 
      rollResult: rollResult,
      actor_id: dataset.actor_id
    };

    renderTemplate(template, data).then(
      (chatMessage)=> {
      message.update({id: messageId, content: chatMessage})
    })
    return
  }

  static _rollDamage (event){
    console.log ("ROLL DAMAGE FROM CHAT")
    const dataset = event.currentTarget.dataset;
    const element = event.currentTarget;
    console.log ("DATASET")
    console.log (dataset)
    const messageId = $(element)
      .parents('[data-message-id]')
      .attr('data-message-id');
    const message = game.messages.get(messageId)
    let actor=game.actors.get(dataset.actor_id)
    let totaldamage=Number(dataset.weapondamage)*Number(dataset.multiplier)
    let rollDamageData = {
      actor_id: actor._id,
      rollTitle: game.i18n.localize("CUSTOS.chat.damageroll"),
      total: totaldamage,
      fatigued: false,
      pjName: dataset.name,
      pjImage: dataset.pjimage,
      multiplier: dataset.multiplier,
      fixed_multiplier: true,
      weapondamage: dataset.weapondamage,
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
    console.log ("ROLL DAMAGE DATA")
    console.log (rollDamageData)

    new DamageRollDialogSingle(rollDamageData).render(true);
  }

  static _applyDamage (event){
    console.log ("ON APPLY DAMAGE")
    const dataset = event.currentTarget.dataset;
    const element = event.currentTarget;
    console.log ("DATASET")
    console.log (dataset)
    let selected= Array.from(canvas.tokens.controlled)[0]?.actor;
    if (!selected){
      ui.notifications.warn(game.i18n.localize("CUSTOS.ui.noselected"));
      return
    }
    console.log ("SELECTED")
    console.log (selected)
    let currentdamage=Number(selected.system.resources.life.value)
    console.log ("CURRENT DAMAGE")
    console.log (currentdamage)
    currentdamage+=Number(dataset.damage)
    if(currentdamage > Number(selected.system.resources.life.max)){currentdamage=(selected.system.resources.life.max)}
    selected.update ({ 'system.resources.life.value': currentdamage });
    ui.notifications.info(selected.name+" "+game.i18n.localize("CUSTOS.ui.receivedamage")+dataset.damage);
    if (Number(selected.system.resources.life.value) <= Number(selected.system.resources.life.max)){
      ui.notifications.info(selected.name+" "+game.i18n.localize("CUSTOS.ui.die"));
    }

  }
}