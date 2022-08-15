const pluginName = "log-info-webpack-plugin";
const indexFile = "index.html";

function getConsoleStr({ key, value }: { key: string; value: string }) {
  const baseStyle =
    "font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;";
  const keyStyle = `color:#fff;background:#000;${baseStyle}border-radius:4px 0 0 4px`;
  const valueStyle = `color:#000;background:#FF9900;${baseStyle}border-radius:0 4px 4px 0`;
  return `console.log("%c${key}%c${value}","${keyStyle}","${valueStyle}");`;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function dealHtml(html: string, logObj: Record<string, unknown>) {
  const baseList = [
    ["Environment", process.env.NODE_ENV],
    ["Build Date", formatDate(new Date())],
  ];
  const diyList = Object.keys(logObj).map((key) => [key, logObj[key]]);
  return html.replace(
    /<\/body>/,
    `<script type="text/javascript">(function logTag(d){var b="font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;";var c="color:#fff;background:#000;"+b+"border-radius:4px 0 0 4px";var a="color:#000;background:#FF9900;"+b+"border-radius:0 4px 4px 0";d.forEach(function(e){console.log("%c"+e[0]+"%c"+e[1],c,a)})})(${JSON.stringify(
      [...baseList, ...diyList]
    )})</script></body>`
  );
}

class LogInfo {
  logObj: Record<string, unknown>;
  constructor(logObj: Record<string, unknown>) {
    this.logObj = logObj;
  }

  static logInfoVitePlugin(logObj: Record<string, unknown> = {}) {
    return {
      name: pluginName,
      transformIndexHtml(html: string) {
        return dealHtml(html, logObj);
      },
    };
  }

  apply(compiler: any) {
    const { logObj } = this;
    const { webpack } = compiler;

    if (webpack) {
      //webpack v5
      const { Compilation } = webpack;
      const { RawSource } = webpack.sources;

      compiler.hooks.thisCompilation.tap(pluginName, (compilation: any) => {
        compilation.hooks.processAssets.tap(
          {
            name: pluginName,
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          (assets: any) => {
            const asset = assets[indexFile];
            if (asset) {
              let html = dealHtml(asset.source(), logObj);
              compilation.updateAsset(indexFile, new RawSource(html));
            }
          }
        );
      });
    } else {
      compiler.hooks.emit.tap(pluginName, (compilation: any) => {
        return new Promise((resolve) => {
          const { assets } = compilation;
          const asset = assets[indexFile];
          if (asset) {
            let html = dealHtml(asset.source(), logObj);
            assets[indexFile].source = () => html;
            assets[indexFile].size = () => html.length;
            resolve(null);
          }
        });
      });
    }
  }
}

export const logInfoVitePlugin = (logObj: Record<string, unknown>) =>
  LogInfo.logInfoVitePlugin(logObj);

export default LogInfo;
module.exports = LogInfo;
