export async function DiceRollV2(event)
{
    event.preventDefault();
    const dataset = event.currentTarget.dataset;
    let tirada= ""
    let testResult=""
    let nExitos=0
    let nUnos=0
    let rollText=""
    let dados=[];
    let nDice=dataset.ndice
    let difficulty=Number(document.getElementById("ndiff").value);
    let canSpendKarma=true
    let actor = game.actors.get(ChatMessage.getSpeaker().actor);
    let actor_id = ChatMessage.getSpeaker().actor;
    if (game.user.isGM==false){
        if (actor.system.resources.karma.value <= 0){canSpendKarma=false}
    }
    tirada=nDice+"d6"
    rollText="<label>"+tirada+" VS "+difficulty+"</label>"
    let d6Roll = await new Roll(String(tirada)).roll({async: false});
    for (let i = 0; i < nDice; i++) {
        if (d6Roll.terms[0].results[i].result >= difficulty){nExitos++}
        if (d6Roll.terms[0].results[i].result == 1){nUnos++}
        dados.push(d6Roll.terms[0].results[i].result);
    }
    if (nExitos >= 1){
        testResult="<h3 class=\"regular-success\">"+game.i18n.localize("CUSTOS.ui.regularSuccess")+"</h3>"
        if (nExitos >= 2){
            testResult="<h3 class=\"critical-success\">"+game.i18n.localize("CUSTOS.ui.criticalSuccess")+"</h3>"
        }
    }
    else{
        testResult="<h3 class=\"regular-failure\">"+game.i18n.localize("CUSTOS.ui.regularFailure")+"</h3>"
    }
    if (nUnos >= nDice){
        testResult="<h3 class=\"critical-failure\">"+game.i18n.localize("CUSTOS.ui.criticalFailure")+"</h3>"
        canSpendKarma=false
    }

    let renderedRoll = await renderTemplate("systems/custos/templates/chat/test-result.html", { 
        rollResult: d6Roll, 
        actor_id: actor_id,
        dados:dados,
        nDice: nDice,
        rollText: rollText,
        nDiff: difficulty,
        canSpendKarma: canSpendKarma,
        testResult: testResult
    });

    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };

    d6Roll.toMessage(chatData);
    return;
}

export function diceToFaces(value, content)
{
    switch (Number(value))
    {
        case 1:
            return "fa-dice-one";
        case 2:
            return "fa-dice-two";
        case 3:
            return "fa-dice-three";
        case 4:
            return "fa-dice-four";
        case 5:
            return "fa-dice-five";
        case 6:
            return "fa-dice-six";
    }

    return "fa-dice-d6";
}