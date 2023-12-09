import {RegularDiceRoll} from "../modules/rolls.js";
export default class CombatMat extends FormApplication {
    constructor(dataset) {
	    super(dataset);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "custos-combat-mat",
            title: "",
            width: 750,
            height: 800,
            template: "/systems/custos/templates/dialogs/combatMat.html",
            classes: [ "custos-combat-mat" ],
            popout: false,
            buttons: [],
        });
    }

    /** @override */
    getData(dataset)
    {
        let data= {
            actor_id: this.object.actor_id,
        };
        
        return data;
    }

    activateListeners(html)
    {
        super.activateListeners(html);
        //html.find(".roll-dice").on('click', this._onDieRoll.bind(this));
    }
}