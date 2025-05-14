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
    let rollText=""
    let ndice=0
    for (let i = 0; i < diceData.d3; i++) {
        if (rollText==""){
            rollText+="1d3"
        }
        else {
            rollText+="+1d3"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d4; i++) {
        if (rollText==""){
            rollText+="1d4"
        }
        else {
            rollText+="+1d4"
        }     
        ndice++ 
    }
    for (let i = 0; i < diceData.d5; i++) {
        if (rollText==""){
            rollText+="1d5"
        }
        else {
            rollText+="+1d5"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d6; i++) {
        if (rollText==""){
            rollText+="1d6"
        }
        else {
            rollText+="+1d6"
        }  
        ndice++    
    }
    for (let i = 0; i < diceData.d8; i++) {
        if (rollText==""){
            rollText+="1d8"
        }
        else {
            rollText+="+1d8"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d10; i++) {
        if (rollText==""){
            rollText+="1d10"
        }
        else {
            rollText+="+1d10"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d12; i++) {
        if (rollText==""){
            rollText+="1d12"
        }
        else {
            rollText+="+1d12"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d20; i++) {
        if (rollText==""){
            rollText+="1d20"
        }
        else {
            rollText+="+1d20"
        } 
        ndice++     
    }
    let explode=false
    let totalRoll = 0;
    let dicelist = "";
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
        
		totalRoll += Number(evaluateRoll.total)
        for (let i = 0; i < ndice; i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (dicelist==""){
                dicelist+=diceterm
            }
            else {
                dicelist+=" ,"+diceterm
            }    
        }
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
        dicelist: dicelist,
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
    let rollText=""
    let explode=false
    let totalRoll = 0;
    let dicelist = "";
    let diceMax=Number(diceData.ndice)*Number(diceData.sides)
    for (let i = 0; i < Number(diceData.ndice); i++) {
        if (rollText==""){
            rollText+="1d"+diceData.sides
        }
        else {
            rollText+="+1d"+diceData.sides
        }    
    }
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceMax) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
        for (let i = 0; i < Number(diceData.ndice); i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (dicelist==""){
                dicelist+=diceterm
            }
            else {
                dicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
 
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/simpleTestResult.html", { 
        pjName: actor.name,
        pjImage: actor.img,
        rollTitle: rollTitle,
        totalRoll: totalRoll, 
        dicelist: dicelist,
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
    console.log ("DICEDATA")
    console.log (diceData)
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
    let rollResult=""
    let rollText=""
    let ndice=0
    console.log ("ACTOR")
    console.log (actor)
    if (actor.type=="Custos" && Number(actor.system.resources.pietas.value) < Number(actor.system.resources.pietas.max)){
        hasFate=true
        console.log ("PONGO HASFATE A TRUE")
    }
    for (let i = 0; i < diceData.d3; i++) {
        if (rollText==""){
            rollText+="1d3"
        }
        else {
            rollText+="+1d3"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d4; i++) {
        if (rollText==""){
            rollText+="1d4"
        }
        else {
            rollText+="+1d4"
        }     
        ndice++ 
    }
    for (let i = 0; i < diceData.d5; i++) {
        if (rollText==""){
            rollText+="1d5"
        }
        else {
            rollText+="+1d5"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d6; i++) {
        if (rollText==""){
            rollText+="1d6"
        }
        else {
            rollText+="+1d6"
        }  
        ndice++    
    }
    for (let i = 0; i < diceData.d8; i++) {
        if (rollText==""){
            rollText+="1d8"
        }
        else {
            rollText+="+1d8"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d10; i++) {
        if (rollText==""){
            rollText+="1d10"
        }
        else {
            rollText+="+1d10"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d12; i++) {
        if (rollText==""){
            rollText+="1d12"
        }
        else {
            rollText+="+1d12"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d20; i++) {
        if (rollText==""){
            rollText+="1d20"
        }
        else {
            rollText+="+1d20"
        } 
        ndice++     
    }
    let explode=false
    let totalRoll = 0;
    let dicelist = "";
    let npcdicelist = "";
    let totaltargetRoll = 0;
    let targetndice = Number(diceData.targetndice);
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
        for (let i = 0; i < Number(diceData.ndice); i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (dicelist==""){
                dicelist+=diceterm
            }
            else {
                dicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
    let targetrolltext=""
    for (let i = 0; i < Number(targetndice); i++) {
        if (targetrolltext==""){
            targetrolltext+="1d"+diceData.targetsides+"[grey]"
        }
        else {
            targetrolltext+="+1d"+diceData.targetsides+"[grey]"
        }    
    }
    if (Number(diceData.bonus)<0){
        targetrolltext+="+1d"+Math.abs(Number(diceData.bonus))+"[grey]"
        targetndice++
    }
    do
	{
        explode=false;
		let targetRoll = new Roll (targetrolltext)
		let evaluateRoll = await targetRoll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(targetRoll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && targethasFate){explode = true}
		totaltargetRoll += Number(evaluateRoll.total)
        for (let i = 0; i < Number(targetndice); i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (npcdicelist==""){
                npcdicelist+=diceterm
            }
            else {
                npcdicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
    let margin=0;
    if (Number(totalRoll) > Number(diceData.difficulty) || isExpertus == true){
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
        
    }
    else{
        if (Number(totalRoll) == Number(diceData.difficulty)){
            if (hasFate && pietasOnTie){
            rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-isCombat=\"true\" data-multiplier=\""+multiplier+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"            }
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
        dicelist: dicelist,
        npcdicelist: npcdicelist,
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

export async function RangedCombatRoll (diceData)
{
    let isExpertus=diceData.isExpertus
    let hasFate=false
    let actor=game.actors.get(diceData.actor_id)
    let rollTitle=diceData.rollTitle+" VS "+diceData.weapondifficulty
    let targetimage=diceData.targetimage
    let targetname=diceData.targetname
    let targetshield=diceData.targetshield
    let multiplier=1
    let weapondamage=diceData.damage
    let weapondifficulty=diceData.weapondifficulty
    let difficulty=diceData.difficulty
    let targetarmor=diceData.targetarmor
    let pietasOnTie=game.settings.get ("custos", "enablePietasonTie")
    let margin=0
    let playerattacker=false
    let targethasFate=false
    let rollResult=""
    let rollText=""
    let ndice=0
    if (actor.type=="Custos" && Number(actor.system.resources.pietas.value) < Number(actor.system.resources.pietas.max)){
        hasFate=true
        console.log ("PONGO HASFATE A TRUE")
    }
    for (let i = 0; i < diceData.d3; i++) {
        if (rollText==""){
            rollText+="1d3"
        }
        else {
            rollText+="+1d3"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d4; i++) {
        if (rollText==""){
            rollText+="1d4"
        }
        else {
            rollText+="+1d4"
        }     
        ndice++ 
    }
    for (let i = 0; i < diceData.d5; i++) {
        if (rollText==""){
            rollText+="1d5"
        }
        else {
            rollText+="+1d5"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d6; i++) {
        if (rollText==""){
            rollText+="1d6"
        }
        else {
            rollText+="+1d6"
        }  
        ndice++    
    }
    for (let i = 0; i < diceData.d8; i++) {
        if (rollText==""){
            rollText+="1d8"
        }
        else {
            rollText+="+1d8"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d10; i++) {
        if (rollText==""){
            rollText+="1d10"
        }
        else {
            rollText+="+1d10"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d12; i++) {
        if (rollText==""){
            rollText+="1d12"
        }
        else {
            rollText+="+1d12"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d20; i++) {
        if (rollText==""){
            rollText+="1d20"
        }
        else {
            rollText+="+1d20"
        } 
        ndice++     
    }
    let explode=false
    let totalRoll = 0;
    let dicelist = "";
    let npcdicelist = "";
    let totaltargetRoll = 0;
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
        for (let i = 0; i < ndice; i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (dicelist==""){
                dicelist+=diceterm
            }
            else {
                dicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
    if (Number(totalRoll) > Number(weapondifficulty) || isExpertus == true){
        if (Number(totalRoll) > Number(difficulty)){
            margin=Number(totalRoll) - Number(difficulty)
            margin = Number(totalRoll) - Number(difficulty) - Number (targetshield)
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
        else {
            if (Number(totalRoll) == Number(difficulty)){
                if (hasFate && pietasOnTie){
                    rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-isCombat=\"true\" data-multiplier=\""+multiplier+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"                }
                else{
                    rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td></tr><tr>"
                }
            }
            else {
                rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failure")+"</td></tr><tr>"
            }
        }
        
    }
    else {
        if (Number(totalRoll) == Number(diceData.weapondifficulty)){
            if (hasFate && pietasOnTie){
                rollResult="<td style=\"border:5px outset rgb(29, 0, 0);\" class=\"spend\" data-name=\""+actor.name+"\" data-isCombat=\"true\" data-multiplier=\""+multiplier+"\" data-pjImage=\""+actor.img+"\" data-rollTitle=\""+rollTitle+"\" data-totalRoll=\""+totalRoll+"\" data-actor_id=\""+diceData.actor_id+"\">"+game.i18n.localize("CUSTOS.chat.spendPietas")+"</td>"
            }
            else{
                rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failureweapon")+"</td></tr><tr>"
            }
            
        }
        else{
            rollResult="<td class=\"failure\">"+game.i18n.localize("CUSTOS.chat.failureweapon")+"</td></tr><tr>"
        }

    }
    let renderedRoll = await renderTemplate("systems/custos/templates/chat/combatTestResultRanged.html", { 
        pjName: actor.name,
        pjImage: actor.img,
        targetImage: targetimage,
        targetName: targetname,
        rollTitle: rollTitle,
        totalRoll: totalRoll, 
        dicelist: dicelist,
        npcdicelist: npcdicelist,
        totaltargetRoll: difficulty, 
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
    let rollText=""
    let ndice=0
    for (let i = 0; i < diceData.d3; i++) {
        if (rollText==""){
            rollText+="1d3"
        }
        else {
            rollText+="+1d3"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d4; i++) {
        if (rollText==""){
            rollText+="1d4"
        }
        else {
            rollText+="+1d4"
        }     
        ndice++ 
    }
    for (let i = 0; i < diceData.d5; i++) {
        if (rollText==""){
            rollText+="1d5"
        }
        else {
            rollText+="+1d5"
        }   
        ndice++   
    }
    for (let i = 0; i < diceData.d6; i++) {
        if (rollText==""){
            rollText+="1d6"
        }
        else {
            rollText+="+1d6"
        }  
        ndice++    
    }
    for (let i = 0; i < diceData.d8; i++) {
        if (rollText==""){
            rollText+="1d8"
        }
        else {
            rollText+="+1d8"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d10; i++) {
        if (rollText==""){
            rollText+="1d10"
        }
        else {
            rollText+="+1d10"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d12; i++) {
        if (rollText==""){
            rollText+="1d12"
        }
        else {
            rollText+="+1d12"
        } 
        ndice++     
    }
    for (let i = 0; i < diceData.d20; i++) {
        if (rollText==""){
            rollText+="1d20"
        }
        else {
            rollText+="+1d20"
        } 
        ndice++     
    }
    let armordicelist = "";
    let explode=false
    let totalRoll = 0;
    let dicelist = "";
   do
	{
        explode=false;
		let roll = new Roll(rollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && hasFate){explode = true}
		totalRoll += Number(evaluateRoll.total)
        for (let i = 0; i < ndice; i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (dicelist==""){
                dicelist+=diceterm
            }
            else {
                dicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
    let armorRoll=0;
    let armorRollText="1d"+diceData.armor+"[grey]"
    do
	{
        explode=false;
		let roll = new Roll(armorRollText);
		let evaluateRoll = await roll.evaluate();
        if (game.modules.get('dice-so-nice')?.active){
            game.dice3d.showForRoll(roll,game.user,true,false,null)
        }
        if (Number(evaluateRoll.total)===Number(diceData.current) && targethasFate){explode = true}
		armorRoll += Number(evaluateRoll.total)
        for (let i = 0; i < 1; i++) {
            let diceterm = 0
            let j = i+i
            diceterm =evaluateRoll.terms[j].results[0].result
            if (armordicelist==""){
                armordicelist+=diceterm
            }
            else {
                armordicelist+=" ,"+diceterm
            }    
        }
	}while(explode);
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
        dicelist: dicelist,
        armordicelist: armordicelist,
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
