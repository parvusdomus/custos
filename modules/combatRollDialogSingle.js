import {SingleCombatRoll} from "../modules/rolls.js";
export default class CombatRollDialogSingle extends FormApplication {
    constructor(dataset) {
	    super(dataset);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "custos-roll-dialog",
            title: "",
            template: "/systems/custos/templates/dialogs/CombatRollSingle.html",
            classes: [ "custos-roll-dialog" ],
            popout: false,
            buttons: [],
        });
    }

    /** @override */
    getData(dataset)
    {
        let data= {
            bonus: this.object.bonus,
            fatigued: this.object.fatigued,
            actor_id: this.object.actor_id,
            rollTitle: this.object.rollTitle,
            targetimage: this.object.targetimage,
            targetname: this.object.targetname,
            targetroll: this.object.targetroll,
            shield: this.object.shield,
            armor: this.object.armor,
            targetarmor: this.object.targetarmor,
            targetshield: this.object.targetshield,
            targethasFate: this.object.targethasFate,
            damage: this.object.damage,
            targetdamage: this.object.targetdamage,
            targetweapondifficulty: this.object.targetweapondifficulty,
            fixed_dif: this.object.fixed_dif,
            dif: this.object.dif,
            current: this.object.current,
            total: this.object.total,
            base: this.object.base,
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
        html.find(".change_bonus").on('click', this._onChangeBonus.bind(this));
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
                        bonus: this.object.bonus,
                        difficulty: this.object.dif,
                        rollTitle: this.object.rollTitle,
                        actor_id: this.object.actor_id,
                        current: this.object.current,
                        total: this.object.total,
                        base: this.object.base,
                        targetimage: this.object.targetimage,
                        targetname: this.object.targetname,
                        targetroll: this.object.targetroll,
                        shield: this.object.shield,
                        targetshield: this.object.targetshield,
                        armor: this.object.armor,
                        targetarmor: this.object.targetarmor,
                        targethasFate: this.object.targethasFate,
                        damage: this.object.damage,
                        targetdamage: this.object.targetdamage,
                        targetweapondifficulty: this.object.targetweapondifficulty,
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
                    SingleCombatRoll (diceData)
                    this.close();
                },
			    no: () => {return},
			    defaultYes: false
		    });
        }

        if (Number(this.object.current) == Number(this.object.total)){
            if (this.object.fixed_dif==true){
                this.object.dif=this.object.dif;
            }
            else{
                this.object.dif= document.getElementById("difficulty").value;
            }
            diceData= {
                bonus: this.object.bonus,
                difficulty: this.object.dif,
                actor_id: this.object.actor_id,
                rollTitle: this.object.rollTitle,
                targetimage: this.object.targetimage,
                targetname: this.object.targetname,
                targetroll: this.object.targetroll,
                shield: this.object.shield,
                targetshield: this.object.targetshield,
                armor: this.object.armor,
                targetarmor: this.object.targetarmor,
                targethasFate: this.object.targethasFate,
                damage: this.object.damage,
                targetdamage: this.object.targetdamage,
                targetweapondifficulty: this.object.targetweapondifficulty,
                current: this.object.current,
                total: this.object.total,
                base: this.object.base,
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
            SingleCombatRoll (diceData)
            this.close();
            
        }
        
    }

    _onChangeDice(event)
    {
        const element = event.currentTarget;
        const dataset = event.currentTarget.dataset;
        if (this.object.fixed_dif==true){
            this.object.dif=this.object.dif;
        }
        else{
            this.object.dif= document.getElementById("difficulty").value;
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

    _onChangeBonus(event)
    {
        const element = event.currentTarget;
        const dataset = event.currentTarget.dataset;
        this.object.bonus= Number(document.getElementById("bonus").value);
        if (Number(this.object.bonus)>0)
        {
            this.object.total=Number(this.object.base)+Number(this.object.bonus)
        }
        this.render()
    }

}
