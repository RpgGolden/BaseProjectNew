import { models, sequelize } from "../models/index.js";
import setupAssociations from "../models/setup-associations.js";

async function initializeDbModels() {
  for (const model of Object.values(models))
    if (typeof model.initialize === "function") model.initialize(sequelize);
  setupAssociations();
  for (const model of Object.values(models)) await model.sync({ alter: true });
  console.log("models initialized");
}

export default {
  initializeDbModels,
};
