const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class MKoa {
  constructor() {}
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const body = this.callback(req, res);

      res.end(body);
    });

    server.listen(...args, () => {
      console.log(args, "开启了服务");
    });
  }

  createContext(req, res) {
    const ctx = Object.create(context);
  }

  use(callback) {
    this.callback = callback;
  }
}

module.exports = MKoa;
