const fs = require("fs");
const path = require("path");

module.exports = (dirPath = "./public") => {
  return async (ctx, next) => {
    const url = ctx.url;
    console.log(url);
    if (url.indexOf("/public") === 0) {
      try {
        const curPath = path.resolve(__dirname, "../", "." + url);
        console.log(curPath);

        const lstat = fs.lstatSync(curPath);

        if (lstat.isDirectory()) {
          const dir = fs.readdirSync(curPath);
          const ret = ['<div style="padding-left:20px">'];
          dir.forEach((filename) => {
            // 简单认为不带小数点的格式，就是文件夹，实际应该用statSync
            if (filename.indexOf(".") > -1) {
              ret.push(
                `<p><a style="color:black" href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            } else {
              // 文件
              ret.push(
                `<p><a href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            }
          });
          ret.push("</div>");
          ctx.body = ret.join("");
        } else {
          const file = fs.readFileSync(curPath);
          ctx.body = file;
        }
      } catch (err) {
        ctx.body = "404 not found";
      }
    } else {
      await next();
    }
  };
};
