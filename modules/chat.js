export default class custosChat {
    static chatListeners (html) {
      html.on('click', '.spend', this._spendPietas.bind(this));
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
}