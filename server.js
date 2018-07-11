const cors = require("cors");
const next = require("next");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const Sentiment = require("sentiment");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev }); // ??
const handler = app.getRequestHandler();
const sentiment = new Sentiment();

// Initializing pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true
});

/**
 * Initializing express application
 *
 * 1. Set up cors
 * 2. Set up bodyParser
 * 3. Set up request handling
 */
app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    server.get("*", (req, res) => {
      return handler(req, res);
    });

    const chatHistory = { messages: [] };

    server.post("/message", (req, res, next) => {
      const { user = null, message = "", timestamp = +new Date() } = req.body; // body-parser puts all the data coming in into the request.body object
      const setimentScore = sentiment.analyze(message).score;

      const chat = { user, message, timestamp, sentiment: setimentScore };

      chatHistory.messages.push(chat);
      pusher.trigger("chat-room", "new-message", { chat }); // Channel, event, event data
    });

    server.post("/messages", (req, res, next) => {
      res.json({ ...chatHistory, status: "success" });
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
