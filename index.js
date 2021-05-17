const MKoa = require("./lib/index");
const static = require("./lib/static");
const Router = require("./lib/router");

const app = new MKoa();
const router = new Router();

const delay = () => new Promise((res) => setTimeout(() => res(), 2000));

app.use(static());

// app.use(async (ctx, next) => {
//   console.log("开启001");
//   ctx.body = "001";
//   await next();
// });

// app.use(async (ctx, next) => {
//   ctx.body += " 002";
//   await delay();
//   await next();
// });

// app.use(async (ctx, next) => {
//   ctx.body = " 003";
//   await next();
// });

// app.use(async (ctx, next) => {
//   console.log("结束004");
//   ctx.body = " 004";
//   await next();
// });

router.get("/", (ctx, next) => {
  ctx.body = "home";
});

router.get("/index", (ctx, next) => {
  ctx.body = "index";
});

router.post("/index", (ctx, next) => {
  ctx.body = { a: "xxx" };
});

app.use(router.routers());

app.listen(3000);
