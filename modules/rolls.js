export async function RegularDiceRoll (diceData)
{
    let hasFate=false
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle+" VS "+diceData.difficulty
    if (actor.type=="Custos" && Number(actor.system.resources.pietas.value) < Number(actor.system.resources.pietas.max)){
        hasFate=true
    }
    let rollResult=""
    let dice = [];
    if (diceData.d3>0){
        dice.push(diceData.d3+"d3");
    }
    if (diceData.d4>0){
        dice.push(diceData.d4+"d4");
    }
    if (diceData.d5>0){
        dice.push(diceData.d5+"d5");
    }
    if (diceData.d6>0){
        dice.push(diceData.d6+"d6");
    }
    if (diceData.d8>0){
        dice.push(diceData.d8+"d8");
    }
    if (diceData.d10>0){
        dice.push(diceData.d10+"d10");
    }
    if (diceData.d12>0){
        dice.push(diceData.d12+"d12");
    }
    if (diceData.d20>0){
        dice.push(diceData.d20+"d20");
    }
    let rollText=""
    for (let i = 0; i < dice.length; i++) {
        if (i>0)rollText+="+"
        rollText+=dice[i]
    }
    let explode=false
    let totalRoll = 0;

   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        game.dice3d.showForRoll(roll,game.user,true,false,null)
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
    
    if (Number(totalRoll) > Number(diceData.difficulty)){
        let diff=Number(totalRoll)-Number(diceData.difficulty)
        switch (true){
            case (diff <= 3 && diff > 0): 
            {
                rollResult="<td class=\"success\">"+game.i18n.localize("CUSTOS.chat.marginal")+"</td>"
                break;
            }
            case (diff > 3 && diff <= 6):
            {
                rollResult="<td class=\"success\">"+game.i18n.localize("CUSTOS.chat.regular")+"</td>"
                break;
            }
            case (diff >= 7): 
            {
                rollResult="<td class=\"success\">"+game.i18n.localize("CUSTOS.chat.extraordinary")+"</td>"
                break;
            }
        }
    }
    else{
        if (Number(totalRoll) == Number(diceData.difficulty)){
            if (hasFate){
                //rollResult="<td class=\"spend\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
                rollResult="<td class=\"spend\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
            }
            else{
                rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td>"
            }
            
        }
        else{
            rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td>"
        }
    }
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/simpleTestResult.html", { 
        pjName: actor.name,
        pjImage: actor.img,
        rollTitle: rollTitle,
        totalRoll: totalRoll, 
        rollResult: rollResult,
        actor_id: diceData.actor_id
    });

    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };

    ChatMessage.create(chatData);
    return;
}

export async function RegularNPCDiceRoll (diceData)
{
    console.log (diceData)
    
    let actor=game.actors.get(diceData.actor_id)
    let hasFate=actor.system.hasFate
    let rollTitle=diceData.rollTitle
    let rollResult=""
    let rollText=diceData.ndice+"d"+diceData.sides
    let explode=false
    let totalRoll = 0;
    let diceMax=Number(diceData.ndice)*Number(diceData.sides)
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        game.dice3d.showForRoll(roll,game.user,true,false,null)
        if (Number(evaluateRoll.total)===Number(diceMax) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
 
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/simpleTestResult.html", { 
        pjName: actor.name,
        pjImage: actor.img,
        rollTitle: rollTitle,
        totalRoll: totalRoll, 
        rollResult: rollResult,
        actor_id: diceData.actor_id
    });

    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };

    ChatMessage.create(chatData);
    return;
}