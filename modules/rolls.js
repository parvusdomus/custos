export async function RegularDiceRoll (diceData)
{
    let hasFate=false
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle+" VS "+diceData.difficulty
    let pietasOnTie=game.settings.get ("custos", "enablePietasonTie")
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
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        
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
            if (hasFate && pietasOnTie){
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

export async function SingleCombatRoll (diceData)
{
    let hasFate=false
    let targethasFate=false
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle+" VS "+diceData.difficulty
    let targetimage=diceData.targetimage
    let targetname=diceData.targetname
    let shield=diceData.shield
    let targetshield=diceData.targetshield
    console.log ("SINGLE COMBAT ROLL")
    console.log ("SHIELD")
    console.log (shield)
    console.log ("TARGET SHIELD")
    console.log (targetshield)
    let pietasOnTie=game.settings.get ("custos", "enablePietasonTie")
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
    let totaltargetRoll = 0;

   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);

    do
	{
        explode=false;
		let targetRoll = new Roll (diceData.targetroll)
		let evaluateRoll = targetRoll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(targetRoll,game.user,true,false,null)
        }
        
        if (Number(evaluateRoll.total)===Number(diceData.current) && targethasFate){explode = true}
		totaltargetRoll += Number(evaluateRoll.total)
	}while(explode);
    let margin=0;
    if (Number(totalRoll) > Number(diceData.difficulty)){
        if (Number(totalRoll) > Number(totaltargetRoll)){
            rollResult="<td class=\"success\">"+actor.name+" "+game.i18n.localize("CUSTOS.chat.attacker")+"</td>"
            margin = Number(totalRoll) - Number(totaltargetRoll) - Number (targetshield)
            switch (true){
                case (margin <= 0):
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                    break;
                }
                case (margin > 0 && margin <= 3): 
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x1</td>"
                    break;
                }
                case (margin > 3 && margin <= 6):
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x2</td>"
                    break;
                }
                case (margin > 6 && margin <= 9): 
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x3</td>"
                    break;
                }
                case (margin > 9 && margin <= 12): 
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x4</td>"
                    break;
                }
                case (margin > 12 && margin <= 15): 
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x5</td>"
                    break;
                }
                case (margin >= 16): 
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x6</td>"
                    break;
                }
            }
        }
        else{
            if (Number(totalRoll) == Number(totaltargetRoll)){
                if (hasFate && pietasOnTie){
                    rollResult="<td class=\"spend\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
                }
                else{
                    rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.tie")+"</td>"
                }
            }
            else{
                rollResult="<td class=\"failure\">"+targetname+" "+game.i18n.localize("CUSTOS.chat.attacker")+"</td>"
                margin = Number(totaltargetRoll) - Number(totalRoll) - Number (shield)
                switch (true){
                    case (margin <= 0):
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                        break;
                    }
                    case (margin > 0 && margin <= 3): 
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x1</td>"
                        break;
                    }
                    case (margin > 3 && margin <= 6):
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x2</td>"
                        break;
                    }
                    case (margin > 6 && margin <= 9): 
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x3</td>"
                        break;
                    }
                    case (margin > 9 && margin <= 12): 
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x4</td>"
                        break;
                    }
                    case (margin > 12 && margin <= 15): 
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x5</td>"
                        break;
                    }
                    case (margin >= 16): 
                    {
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x6</td>"
                        break;
                    }
                }
            }
        }
        
    }
    else{
        if (Number(totalRoll) == Number(diceData.difficulty)){
            if (hasFate && pietasOnTie){
                rollResult="<td class=\"spend\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
            }
            else{
                rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td>"
            }
            
        }
        else{
            rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td>"
        }
        if (Number(totalRoll) < Number(totaltargetRoll)){
            rollResult="<td class=\"failure\">"+targetname+" "+game.i18n.localize("CUSTOS.chat.attacker")+"</td>"
            margin = Number(totaltargetRoll) - Number(totalRoll) - Number (shield)
            switch (true){
                case (margin <= 0):
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                    break;
                }
                case (margin > 0 && margin <= 3): 
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x1</td>"
                    break;
                }
                case (margin > 3 && margin <= 6):
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x2</td>"
                    break;
                }
                case (margin > 6 && margin <= 9): 
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x3</td>"
                    break;
                }
                case (margin > 9 && margin <= 12): 
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x4</td>"
                    break;
                }
                case (margin > 12 && margin <= 15): 
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x5</td>"
                    break;
                }
                case (margin >= 16): 
                {
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x6</td>"
                    break;
                }
            }
        }
    }
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/combatTestResult.html", { 
        pjName: actor.name,
        pjImage: actor.img,
        targetImage: targetimage,
        targetName: targetname,
        rollTitle: rollTitle,
        totalRoll: totalRoll, 
        totaltargetRoll: totaltargetRoll, 
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