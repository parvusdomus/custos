export default class leftPanel {
  
    static leftSideBar(controls){
      console.log ("------------------------LEFT SIDEBAR-----------------")
      if (canvas == null) {
        //return;
      }
      controls.push(
        {
            name: "CombatMat",
            title: "CombatMat",
            icon: "fas fa-dice",
            layer: "dices",
            visible: true,
            button: true,
            onClick: () => {
                console.log ("COMBAT MAT")
            }
        }
      );
    }


}