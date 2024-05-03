const DefaultResponse = require("../models/defaultResponse");

exports.getCard = async function () {
  return Promise.resolve(
    new DefaultResponse(
      {
        title: "Card title",
        text: "Some example text",
        image: "http://localhost:3000/example.png",
      },
      200,
    ),
  );
};
