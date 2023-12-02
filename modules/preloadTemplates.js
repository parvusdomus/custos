export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/custos/templates/actors/custos/parts/virtutes.html",
      "/systems/custos/templates/actors/custos/parts/creatio.html",
      "/systems/custos/templates/actors/custos/parts/curriculum.html",
      "/systems/custos/templates/actors/custos/parts/inventory.html",
      "/systems/custos/templates/actors/custos/parts/magic.html",
      "/systems/custos/templates/actors/npc/parts/virtutes.html",
      "/systems/custos/templates/actors/npc/parts/inventory.html",
      "/systems/custos/templates/dialogs/regularRoll.html"
    ];
        return loadTemplates(templatePaths);
};