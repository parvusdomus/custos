export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
      "/systems/custos/templates/actors/parts/virtutes.html",
      "/systems/custos/templates/actors/parts/creatio.html"
    ];
        return loadTemplates(templatePaths);
};