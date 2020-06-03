function getConsoleStr({ key, value }) {
  const baseStyle = 'font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;';
  const keyStyle = `color:#fff;background:#000;${baseStyle}border-radius:4px 0 0 4px`;
  const valueStyle = `color:#000;background:#FF9900;${baseStyle}border-radius:0 4px 4px 0`;
  return `console.log("%c${key}%c${value}","${keyStyle}","${valueStyle}");`;
}

// function logTag(array) {
//   const baseStyle = 'font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;';
//   const keyStyle = `color:#fff;background:#000;${baseStyle}border-radius:4px 0 0 4px`;
//   const valueStyle = `color:#000;background:#FF9900;${baseStyle}border-radius:0 4px 4px 0`;
//   array.forEach((item) => {
//     console.log(`%c${item[0]}%c${item[1]}`, keyStyle, valueStyle);
//   });
// }

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

class AuthorPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('author-plugin', (compilation) => {
      const { options } = this;
      return new Promise((resolve) => {
        const { assets } = compilation;
        let html = assets['index.html'].source();
        const infoList = [
          ['Environment', process.env.NODE_ENV],
          ['Build Date', formatDate(new Date())],
        ];
        if (options.version) {
          infoList.push(['Version', options.version]);
        }
        html = html.replace(/<\/body>/, `<script type="text/javascript">(function logTag(d){var b="font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;";var c="color:#fff;background:#000;"+b+"border-radius:4px 0 0 4px";var a="color:#000;background:#FF9900;"+b+"border-radius:0 4px 4px 0";d.forEach(function(e){console.log("%c"+e[0]+"%c"+e[1],c,a)})})(${JSON.stringify(infoList)})</script></body>`);
        assets['index.html'].source = () => html;
        assets['index.html'].size = () => html.size;
        resolve();
      });
    });
  }
}

module.exports = AuthorPlugin;
