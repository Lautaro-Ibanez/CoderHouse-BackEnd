import handlebars from "handlebars";

handlebars.registerHelper("multiplicar", function (a, b) {
  return a * b;
});

export default handlebars;
