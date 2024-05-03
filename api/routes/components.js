const controller = require("../controllers/components");

const routes = [
  {
    method: "post",
    url: "/:name",
    handler: controller.saveConfig,
  },
  {
    method: "get",
    url: "/:name",
    handler: controller.getConfig,
  },
];

module.exports = function () {
  return {
    prefix: "/components",
    routes,
  };
};
