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
      if (dataset.isCombat=="true"){
        if (dataset.multiplier==0){
          rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.nodamage")+"</td>"
        }
        else{
          rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x1</td>"
        }
      }
      else{
        rollResult="<td class=\"success\">"+game.i18n.localize("CUSTOS.chat.marginal")+"</td>"
      }
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
    const dataset = event.currentTarget.dataset;
    const element = event.currentTarget;
    if (dataset.player == "false" && game.user?.isGM == false){
      ui.notifications.error(game.i18n.localize("CUSTOS.ui.notallowed"));
      return
    }
    const messageId = $(element)
      .parents('[data-message-id]')
      .attr('data-message-id');
    const message = game.messages.get(messageId)
    let actor=game.actors.get(dataset.actor_id)
    let totaldamage=Number(dataset.weapondamage)*Number(dataset.multiplier)
    let rollDamageData = {
      actor_id: actor._id,
      player: dataset.player,
      rollTitle: game.i18n.localize("CUSTOS.chat.damageroll"),
      total: totaldamage,
      armor: dataset.armor,
      targethasFate: dataset.targethasFate,
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

    new DamageRollDialogSingle(rollDamageData).render(true);
  }

  static _applyDamage (event){
    const dataset = event.currentTarget.dataset;
    const element = event.currentTarget;
    if (dataset.player == "false" && game.user?.isGM == false){
      ui.notifications.error(game.i18n.localize("CUSTOS.ui.notallowed"));
      
    }
    else 
    {
      let selected= Array.from(game.user.targets)[0]?.actor;
      //let selected= Array.from(canvas.tokens.controlled)[0]?.actor;
      if (!selected){
        ui.notifications.warn(game.i18n.localize("CUSTOS.ui.noselected"));
      }
      else
      {
        let currentdamage=Number(selected.system.resources.life.value)
        let maxdamage=Number(selected.system.resources.life.max)
        currentdamage+=Number(dataset.damage)
        if(currentdamage > maxdamage){currentdamage=maxdamage}
        selected.update ({ 'system.resources.life.value': currentdamage });
        ui.notifications.info(selected.name+" "+game.i18n.localize("CUSTOS.ui.receivedamage")+dataset.damage);
        if (currentdamage >= maxdamage){
          ui.notifications.info(selected.name+" "+game.i18n.localize("CUSTOS.ui.die"));
        }
      } 
    }
    return
  }
}