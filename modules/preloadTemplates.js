export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/custos/templates/actors/parts/virtutes.html",
      "/systems/custos/templates/actors/parts/creatio.html",
      "/systems/custos/templates/actors/parts/curriculum.html",
      "/systems/custos/templates/actors/parts/inventory.html",
      "/systems/custos/templates/actors/parts/magic.html"
    ];
        return loadTemplates(templatePaths);
};