export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/custos/templates/actors/custos/parts/virtutes.html",
      "/systems/custos/templates/actors/custos/parts/creatio.html",
      "/systems/custos/templates/actors/custos/parts/curriculum.html",
      "/systems/custos/templates/actors/custos/parts/inventory.html",
      "/systems/custos/templates/actors/custos/parts/magic.html",
      "/systems/custos/templates/actors/npc/parts/virtutes.html",
      "/systems/custos/templates/actors/npc/parts/inventory.html",
      "/systems/custos/templates/actors/npc/parts/special.html",
      "/systems/custos/templates/actors/beast/parts/virtutes.html",
      "/systems/custos/templates/actors/beast/parts/inventory.html",
      "/systems/custos/templates/actors/beast/parts/special.html",
      "/systems/custos/templates/actors/beast/parts/knowledge.html",
      "/systems/custos/templates/dialogs/regularRoll.html"
    ];
        return loadTemplates(templatePaths);
};