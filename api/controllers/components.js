const express = require("express");
const YAML = require("yaml");
const fs = require("fs/promises");
const path = require("path");
const DefaultResponse = require("../models/defaultResponse");
const ExpectedException = require("../exceptions/expectedException");

const pathToComponentsFolder = path.join(__dirname, "..", "savedComponents");

/**
 * @param {express.Request} req
 * @returns {Promise<unknown>}
 */
exports.saveConfig = function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = YAML.stringify({
        template: req.body.template,
        style: req.body.style,
      });
      await fs.writeFile(
        `${pathToComponentsFolder}/${req.params.name}.yml`,
        data,
      );
      return resolve(new DefaultResponse(req.body, 201));
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * @param {express.Request} req
 * @returns {Promise<unknown>}
 */
exports.getConfig = function (req) {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.access(`${pathToComponentsFolder}/${req.params.name}.yml`);

      const yamlData = await fs.readFile(
        `${pathToComponentsFolder}/${req.params.name}.yml`,
        "utf8",
      );

      return resolve(new DefaultResponse(YAML.parse(yamlData), 200));
    } catch (e) {
      reject(
        new ExpectedException(
          `Config for component "${req.params.name}" does not exist`,
          404,
        ),
      );
    }
  });
};
