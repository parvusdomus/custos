import {SingleDamageRoll} from "../modules/rolls.js";
export default class DamageRollDialogSingle extends FormApplication {
    constructor(dataset) {
	    super(dataset);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "custos-roll-dialog",
            title: "",
            template: "/systems/custos/templates/dialogs/DamageRollSingle.html",
            classes: [ "custos-roll-dialog" ],
            popout: false,
            buttons: [],
        });
    }

    /** @override */
    getData(dataset)
    {
        console.log ("DAMAGE ROLL DIALOG GET DATA")
        let data= {
            actor_id: this.object.actor_id,
            player: this.object.player,
            rollTitle: this.object.rollTitle,
            total: this.object.total,
            fatigued: this.object.fatigued,
            pjName: this.object.pjName,
            pjImage: this.object.pjImage,
            multiplier: this.object.multiplier,
            fixed_multiplier: this.object.fixed_multiplier,
            weapondamage: this.object.weapondamage,
            current: this.object.current,
            ndice: this.object.ndice,
            d3: this.object.d3,
            d4: this.object.d4,
            d5: this.object.d5,
            d6: this.object.d6,
            d8: this.object.d8,
            d10: this.object.d10,
            d12: this.object.d12,
            d20: this.object.d20
        };
        
        return data;
    }

    activateListeners(html)
    {
        super.activateListeners(html);
        html.find(".roll-dice").on('click', this._onDieRoll.bind(this));
        html.find(".change_dice").on('click', this._onChangeDice.bind(this));
    }
    
    async _onDieRoll(event)
    {
        event.preventDefault();
        const element = event.currentTarget;
        let diceData={}
        if (this.object.ndice == 0){
            ui.notifications.warn(game.i18n.localize("CUSTOS.ui.nodice"));
            return;
        }
        if (Number(this.object.ndice) > 3){
            ui.notifications.warn(game.i18n.localize("CUSTOS.ui.manydice"));
            return;
        }

        if (Number(this.object.current) > Number(this.object.total)){
            ui.notifications.warn(game.i18n.localize("CUSTOS.ui.manypoints"));
            return;
        }

        if (Number(this.object.current) < Number(this.object.total)){
            ui.notifications.warn(game.i18n.localize("CUSTOS.ui.fewpoints"));
            if (this.object.fixed_dif==true){
                this.object.dif=this.object.dif;
            }
            else{
                this.object.dif= document.getElementById("difficulty").value;
            }
            Dialog.confirm
            ({
		        title: game.i18n.localize("CUSTOS.ui.fewpointsTitle"),
			    content: game.i18n.localize("CUSTOS.ui.fewpoints"),
			    yes: () => {
                    diceData= {
                        actor_id: this.object.actor_id,
                        player: this.object.player,
                        rollTitle: this.object.rollTitle,
                        total: this.object.total,
                        fatigued: this.object.fatigued,
                        pjName: this.object.pjName,
                        pjImage: this.object.pjImage,
                        multiplier: this.object.multiplier,
                        fixed_multiplier: this.object.fixed_multiplier,
                        weapondamage: this.object.weapondamage,
                        current: this.object.current,
                        ndice: this.object.ndice,
                        d3: this.object.d3,
                        d4: this.object.d4,
                        d5: this.object.d5,
                        d6: this.object.d6,
                        d8: this.object.d8,
                        d10: this.object.d10,
                        d12: this.object.d12,
                        d20: this.object.d20
                    };
                    SingleDamageRoll (diceData)
                    this.close();
                },
			    no: () => {return},
			    defaultYes: false
		    });
        }

        if (Number(this.object.current) == Number(this.object.total)){
            diceData= {
                actor_id: this.object.actor_id,
                player: this.object.player,
                rollTitle: this.object.rollTitle,
                total: this.object.total,
                fatigued: this.object.fatigued,
                pjName: this.object.pjName,
                pjImage: this.object.pjImage,
                multiplier: this.object.multiplier,
                fixed_multiplier: this.object.fixed_multiplier,
                weapondamage: this.object.weapondamage,
                current: this.object.current,
                ndice: this.object.ndice,
                d3: this.object.d3,
                d4: this.object.d4,
                d5: this.object.d5,
                d6: this.object.d6,
                d8: this.object.d8,
                d10: this.object.d10,
                d12: this.object.d12,
                d20: this.object.d20
            };
            SingleDamageRoll (diceData)
            this.close();
            
        }
        
    }

    _onChangeDice(event)
    {
        const element = event.currentTarget;
        const dataset = event.currentTarget.dataset;
        if (this.object.fixed_multiplier==true){
            this.object.multiplier=this.object.multiplier;
        }
        else{
            this.object.multiplier= Number(document.getElementById("multiplier").value)*Number(this.object.weapondamage);
        }
        
        switch (dataset.sides){
            case '3':
            {
                if (this.object.d3 < 3){
                    this.object.d3++;
                }
                else{
                    this.object.d3=0;
                }
                
                break;
            }
            case '4':
            {
                if (this.object.d4 < 3){
                    this.object.d4++;
                }
                else{
                    this.object.d4=0;
                }
                break;   
            }
            case '5':
            {
                if (this.object.d5 < 3){
                    this.object.d5++;
                }
                else{
                    this.object.d5=0;
                }
                break;   
            }
            case '6':
            {
                if (this.object.d6 < 3){
                    this.object.d6++;
                }
                else{
                    this.object.d6=0;
                }
                break;   
            }
            case '8':
            {
                if (this.object.d8 < 3){
                    this.object.d8++;
                }
                else{
                    this.object.d8=0;
                }
                break;   
            }
            case '10':
            {
                if (this.object.d10 < 3){
                    this.object.d10++;
                }
                else{
                    this.object.d10=0;
                }
                break;   
            }
            case '12':
            {
                if (this.object.d12 < 3){
                    this.object.d12++;
                }
                else{
                    this.object.d12=0;
                }
                break;   
            }
            case '20':
            {
                if (this.object.d20 < 3){
                    this.object.d20++;
                }
                else{
                    this.object.d20=0;
                }
                break;   
            }
            
        }

        this.object.current=(this.object.d3*3)+(this.object.d4*4)+(this.object.d5*5)+(this.object.d6*6)+(this.object.d8*8)+(this.object.d10*10)+(this.object.d12*12)+(this.object.d20*20)
        this.object.ndice=this.object.d3+this.object.d4+this.object.d5+this.object.d6+this.object.d8+this.object.d10+this.object.d12+this.object.d20
        this.render()
    }

}