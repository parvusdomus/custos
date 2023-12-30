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
    console.log ("TIRADA DE DADOS NORMAL")
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        console.log (evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true; console.log ("EXPLODED")}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL:")
    console.log (totalRoll)
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
                rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
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
    
    let actor=game.actors.get(diceData.actor_id)
    let hasFate=actor.system.hasFate
    let rollTitle=diceData.rollTitle
    let rollResult=""
    let rollText=diceData.ndice+"d"+diceData.sides
    let explode=false
    let totalRoll = 0;
    let diceMax=Number(diceData.ndice)*Number(diceData.sides)
    console.log ("TIRADA DE DADOS NPC")
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        console.log (evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceMax) && hasFate){explode = true; console.log ("EXPLODED")}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL:")
    console.log (totalRoll)
 
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
    let isExpertus=diceData.isExpertus
    let hasFate=false
    let targethasFate=diceData.targethasFate
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle+" VS "+diceData.difficulty
    let targetimage=diceData.targetimage
    let targetname=diceData.targetname
    let shield=diceData.shield
    let targetshield=diceData.targetshield
    let playerattacker=false
    let multiplier=1
    let weapondamage=diceData.damage
    let armor=diceData.armor
    let targetarmor=diceData.targetarmor
    let targetweapondamage=diceData.targetdamage
    let targetweapondifficulty=diceData.targetweapondifficulty
    let pietasOnTie=game.settings.get ("custos", "enablePietasonTie")
    console.log ("IN COMBAT ROLL")
    console.log ("IS EXPERTUS")
    console.log (isExpertus)
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
    console.log ("TIRADA DE DADOS COMBATE")
    console.log ("JUGADOR")
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        console.log (evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true; console.log("EXPLODED")}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL")
    console.log (totalRoll)
    let targetrolltext=diceData.targetroll
    if (Number(diceData.bonus)<0){
        targetrolltext+="+1d"+Math.abs(Number(diceData.bonus))
        console.log (targetrolltext)
    }
    console.log ("NPC")
    do
	{
        explode=false;
		let targetRoll = new Roll (targetrolltext)
		let evaluateRoll = targetRoll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(targetRoll,game.user,true,false,null)
        }
        console.log (evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceData.current) && targethasFate){explode = true; console.log("EXPLODED")}
		totaltargetRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL")
    console.log (totalRoll)
    let margin=0;
    if (Number(totalRoll) > Number(diceData.difficulty) || isExpertus == true){
        console.log ("IS EXPERTUS AGAIN")
        if (Number(totalRoll) > Number(totaltargetRoll)){
            margin=Number(totalRoll) - Number(totaltargetRoll)
            rollResult="<td class=\"success\">"+actor.name+" "+game.i18n.localize("CUSTOS.chat.attacker")+" ("+margin+")</td>"
            margin = Number(totalRoll) - Number(totaltargetRoll) - Number (targetshield)
            playerattacker=true
            switch (true){
                case (margin <= 0):
                {
                    multiplier=0
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                    break;
                }
                case (margin > 0 && margin <= 3): 
                {
                    multiplier=1
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                        rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.nodamage")+"</td>"
                    }
                    else{
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\"  data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    }
                    break;
                }
                case (margin > 3 && margin <= 6):
                {
                    multiplier=2
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 6 && margin <= 9): 
                {
                    multiplier=3
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 9 && margin <= 12): 
                {
                    multiplier=4
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 12 && margin <= 15): 
                {
                    multiplier=5
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin >= 16): 
                {
                    multiplier=6
                    if (Number(diceData.difficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-targethasFate=\""+targethasFate+"\" data-weapondamage=\""+weapondamage+"\" data-armor=\""+targetarmor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
            }
        }
        else{
            if (Number(totalRoll) == Number(totaltargetRoll)){
                if (hasFate && pietasOnTie){
                    if (Number(diceData.difficulty)==0){
                        multiplier=0
                    }
                    margin = Number(totaltargetRoll) - Number(totalRoll) - Number (shield)
                    if (margin==0){
                        rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-isCombat=\"true\" data-multiplier=\""+multiplier+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
                    }
                    else{
                        rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.tie")+"</td>"
                    }
                }
                else{
                    multiplier=0
                    rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.tie")+"</td>"
                }
            }
            else{
                margin = Number(totaltargetRoll) - Number(totalRoll)
                rollResult="<td class=\"failure\">"+targetname+" "+game.i18n.localize("CUSTOS.chat.attacker")+" ("+margin+")</td>"
                margin = Number(totaltargetRoll) - Number(totalRoll) - Number (shield)
                switch (true){
                    case (margin <= 0):
                    {
                        multiplier=0
                        rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                        break;
                    }
                    case (margin == 0):
                    {
                        if (Number(totalRoll) == Number(totaltargetRoll)){
                            rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-isCombat=\"true\" data-multiplier=\""+multiplier+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
                        }
                    }
                    case (margin > 0 && margin <= 3): 
                    {
                        multiplier=1
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                            rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.nodamage")+"</td>"
                        }
                        else{
                            rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                            
                            rollResult+="</tr><tr><td class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        }
                        break;
                    }
                    case (margin > 3 && margin <= 6):
                    {
                        multiplier=2
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                        }
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        break;
                    }
                    case (margin > 6 && margin <= 9): 
                    {
                        multiplier=3
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                        }
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        break;
                    }
                    case (margin > 9 && margin <= 12): 
                    {
                        multiplier=4
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                        }
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        break;
                    }
                    case (margin > 12 && margin <= 15): 
                    {
                        multiplier=5
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                        }
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        break;
                    }
                    case (margin >= 16): 
                    {
                        multiplier=6
                        if (Number(targetweapondifficulty)==0){
                            multiplier--
                        }
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                        break;
                    }
                }
            }
        }
        
    }
    else{
        console.log ("IS NOT NOT NOT EXPERTUS AGAIN")
        if (Number(totalRoll) == Number(diceData.difficulty)){
            if (hasFate && pietasOnTie){
                rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spendcombat\" data-name=\""+actor.name+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
            }
            else{
                rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failureweapon")+"</td></tr><tr>"
            }
            
        }
        else{
            rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failureweapon")+"</td></tr><tr>"
        }
        if (Number(totalRoll) < Number(totaltargetRoll)){
            margin = Number(totaltargetRoll) - Number(totalRoll)
            rollResult+="<td class=\"failure\">"+targetname+" "+game.i18n.localize("CUSTOS.chat.attacker")+" ("+margin+")</td>"
            margin = Number(totaltargetRoll) - Number(totalRoll) - Number (shield)
            switch (true){
                case (margin <= 0):
                {
                    rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.shieldblock")+"</td>"
                    break;
                }
                case (margin > 0 && margin <= 3): 
                {
                    multiplier=1
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                        rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.nodamage")+"</td>"
                    }
                    else{
                        rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                        
                        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    }
                    break;
                }
                case (margin > 3 && margin <= 6):
                {
                    multiplier=2
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 6 && margin <= 9): 
                {
                    multiplier=3
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 9 && margin <= 12): 
                {
                    multiplier=4
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin > 12 && margin <= 15): 
                {
                    multiplier=5
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
                    break;
                }
                case (margin >= 16): 
                {
                    multiplier=6
                    if (Number(targetweapondifficulty)==0){
                        multiplier--
                    }
                    rollResult+="</tr><tr><td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.multiplier")+" x"+multiplier+"</td>"
                    
                    rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damage \" data-player=\""+playerattacker+"\" data-name=\""+targetname+"\" data-pjImage=\""+targetimage+"\" data-targethasFate=\""+hasFate+"\" data-weapondamage=\""+targetweapondamage+"\" data-armor=\""+armor+"\" data-multiplier=\""+multiplier+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.rolldamage")+"</td>"
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

export async function SingleDamageRoll (diceData)
{
    let hasFate=false
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle
    let targethasFate=diceData.targethasFate
    
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
    console.log ("DAMAGE ROLL")
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        console.log(evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true;console.log("EXPLODED")}
		totalRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL")
    console.loog (totalRoll)
    let armorRoll=0;
    let armorRollText="1d"+diceData.armor
    console.log ("ARMOR ROLL")
    do
	{
        explode=false;
		let roll = new Roll(armorRollText);
		let evaluateRoll = roll.evaluate({async: false});
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        console.log(evaluateRoll)
        if (Number(evaluateRoll.total)===Number(diceData.current) && targethasFate){explode = true;console.log("EXPLODED")}
		armorRoll += Number(evaluateRoll.total)
	}while(explode);
    console.log ("TOTAL")
    console.log (armorRoll)
    let totalDamage=totalRoll-armorRoll
    if (totalDamage < 0){
        totalDamage = 0
    }
    if (totalDamage > 0){
        rollResult+="</tr><tr><td style=\"border:5px outset rgb(29, 0, 0);\" class=\"failure damageapply \" data-player=\""+diceData.player+"\" data-damage=\""+totalDamage+"\" >"+game.i18n.localize("CUSTOS.chat.damageapply")+"</td>"
    }

    else{
        rollResult+="</tr><tr><td class=\"success\">"+game.i18n.localize("CUSTOS.chat.nodamage")+"</td>"
    }
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/damageTestResult.html", { 
        pjName: diceData.pjName,
        pjImage: diceData.pjImage,
        rollTitle: rollTitle,
        totalRoll: totalDamage, 
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
