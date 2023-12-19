import CombatRollDialogSingle from "../modules/combatRollDialogSingle.js";

export async function CombatSingleRoll (actor, item, target){
    console.log ("COMBAT SINGLE ROLL")
    console.log (actor)
    console.log (target)
    console.log (item)
    console.log ("PERITIA")
    console.log (item.system.peritia)
    console.log ("PERITIA VALUE")
    console.log (actor.system.peritiae[item.system.peritia].value)
    console.log ("ITEM SPECIALITY")
    console.log (item.system.speciality)
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
    let weapondifficulty=item.system.difficulty;
    let weapondamage=item.system.damage;
    let equippedshield=actor.items.find((k) => k.type === "shield" && k.system.equipped === "worn");
    let shield=0;
    if (equippedshield){shield=equippedshield.system.parry}
    console.log ("SHIELD")
    console.log (equippedshield)
    console.log (shield)
    let targetequippedshield=target.items.find((k) => k.type === "shield" && k.system.equipped === "worn");
    let targetshield=0;
    if (targetequippedshield){targetshield=targetequippedshield.system.parry}
    console.log ("TARGET SHIELD")
    console.log (targetequippedshield)
    console.log (targetshield)
    let fatigued=false;
      if ((Number(actor.system.resources.life.value)+Number(actor.system.total_encumbrance)) >= Number(actor.system.resources.life.max)){
        fatigued=true;
        if (total > (Number(actor.system.resources.life.max)-Number(actor.system.resources.life.value))){
          total=Number(actor.system.resources.life.max)-Number(actor.system.resources.life.value)
        }
        if (total < 3){
          total=3
        }
    }
    let rollname=actor.system.peritiae[item.system.peritia].label;
    console.log ("WEAPON DIF AND DAM")
    console.log (weapondifficulty)
    console.log (weapondamage)
    let ndice=0;
    let sides=target.system.diceValue
    for (let [key, value] of Object.entries(target.system.peritiae.one.specialties)) {
        if (value.name==="De Bello"){
            ndice=1;
        }
    }
    for (let [key, value] of Object.entries(target.system.peritiae.two.specialties)) {
        if (value.name==="De Bello"){
            ndice=2;
        }
    }
    for (let [key, value] of Object.entries(target.system.peritiae.three.specialties)) {
        if (value.name==="De Bello"){
            ndice=3;
        }
    }
    let targetroll=ndice+"d"+sides;
    let dice= {
        fatigued: fatigued,
        actor_id: actor._id,
        rollTitle: rollname,
        targetroll: targetroll,
        shield: shield,
        targetshield: targetshield,
        targetname: target.name,
        targetimage: target.img,
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
    console.log ("ALLTOGETHER")
    console.log (dice)
    new CombatRollDialogSingle(dice).render(true);

}