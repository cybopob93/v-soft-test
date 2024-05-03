const express = require("express");
const cards = require("./cards");
const components = require("./components");
const ExpectedException = require("../exceptions/expectedException");
const DefaultResponse = require("../models/defaultResponse");

const router = express.Router();

/**
 * @param  {{ prefix: String, routes: Array }} routes
 */
function applyRoutes(routes) {
  for (let route of routes.routes) {
    router[route.method](routes.prefix + route.url, (req, res) => {
      route
        .handler(req, res)
        .then((response) => {
          if (response instanceof DefaultResponse) {
            res.status(response.status).json(response.data);
          } else {
            res.send(response);
          }
        })
        .catch((err) => {
          if (err instanceof ExpectedException) {
            res.status(err.status).send({
              message: err.message,
            });
          } else {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
          }
        });
    });
  }
}

applyRoutes(cards());
applyRoutes(components());

router.all("*", (req, res) => {
  res.sendStatus(405);
});

module.exports = router;
