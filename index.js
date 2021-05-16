const MKoa = require("./lib/index");

const app = new MKoa();

app.use((req) => {
  console.log(req.method);
  return "abcs";
});

app.listen(3000);
