const controller = require("../controllers/cards");

const routes = [
  {
    method: "get",
    url: "/",
    handler: controller.getCard,
  },
];

module.exports = function () {
  return {
    prefix: "/cards",
    routes,
  };
};
