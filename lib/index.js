'use strict';

const pluginName = 'log-info-webpack-plugin';
const indexFile = 'index.html';

function getConsoleStr({
  key,
  value
}) {
  const baseStyle = 'font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;';
  const keyStyle = `color:#fff;background:#000;${baseStyle}border-radius:4px 0 0 4px`;
  const valueStyle = `color:#000;background:#FF9900;${baseStyle}border-radius:0 4px 4px 0`;
  return `console.log("%c${key}%c${value}","${keyStyle}","${valueStyle}");`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function dealHtml(html, logObj) {
  const baseList = [['Environment', process.env.NODE_ENV], ['Build Date', formatDate(new Date())]];
  const diyList = Object.keys(logObj).map(key => [key, logObj[key]]);
  return html.replace(/<\/body>/, `<script type="text/javascript">(function logTag(d){var b="font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;";var c="color:#fff;background:#000;"+b+"border-radius:4px 0 0 4px";var a="color:#000;background:#FF9900;"+b+"border-radius:0 4px 4px 0";d.forEach(function(e){console.log("%c"+e[0]+"%c"+e[1],c,a)})})(${JSON.stringify([...baseList, ...diyList])})</script></body>`);
}

class LogInfo {
  constructor(logObj) {
    this.logObj = logObj;
  }

  static logInfoVitePlugin(logObj = {}) {
    return {
      name: pluginName,
      transformIndexHtml(html) {
        return dealHtml(html, logObj);
      }
    };
  }

  apply(compiler) {
    const { logObj } = this;
    const { webpack } = compiler;

    if (webpack) {
      //webpack v5
      const { Compilation } = webpack;
      const { RawSource } = webpack.sources;

      compiler.hooks.thisCompilation.tap(pluginName, compilation => {
        compilation.hooks.processAssets.tap({
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        }, assets => {
          const asset = assets[indexFile];
          if (asset) {
            let html = dealHtml(asset.source(), logObj);
            compilation.updateAsset(indexFile, new RawSource(html));
          }
        });
      });
    } else {
      compiler.hooks.emit.tap(pluginName, compilation => {
        return new Promise(resolve => {
          const {
            assets
          } = compilation;
          const asset = assets[indexFile];
          if (asset) {
            let html = dealHtml(asset.source(), logObj);
            assets[indexFile].source = () => html;
            assets[indexFile].size = () => html.size;
            resolve();
          }
        });
      });
    }
  }
}

module.exports = LogInfo;