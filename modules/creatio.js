export default class creatio extends FormApplication {
    constructor(dataset) {
	    super(dataset);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "custos-creatio",
            title: "",
            width: 750,
            height: 1000,
            template: "/systems/custos/templates/actors/custos/parts/creatio.html",
            classes: [ "custos-creatio" ],
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