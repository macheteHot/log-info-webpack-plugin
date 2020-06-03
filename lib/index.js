'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getConsoleStr(_ref) {
  var key = _ref.key,
      value = _ref.value;

  var baseStyle = 'font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;';
  var keyStyle = 'color:#fff;background:#000;' + baseStyle + 'border-radius:4px 0 0 4px';
  var valueStyle = 'color:#000;background:#FF9900;' + baseStyle + 'border-radius:0 4px 4px 0';
  return 'console.log("%c' + key + '%c' + value + '","' + keyStyle + '","' + valueStyle + '");';
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
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

var LogInfo = function () {
  function LogInfo(options) {
    _classCallCheck(this, LogInfo);

    this.options = options;
  }

  _createClass(LogInfo, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.emit.tap('log-info-webpack-plugin', function (compilation) {
        var options = _this.options;

        return new Promise(function (resolve) {
          var assets = compilation.assets;

          var html = assets['index.html'].source();
          var infoList = [['Environment', process.env.NODE_ENV], ['Build Date', formatDate(new Date())]];
          if (options.version) {
            infoList.push(['Version', options.version]);
          }
          html = html.replace(/<\/body>/, '<script type="text/javascript">(function logTag(d){var b="font-family: sans-serif;font-weight: bold;font-size: 12px;padding:5px;";var c="color:#fff;background:#000;"+b+"border-radius:4px 0 0 4px";var a="color:#000;background:#FF9900;"+b+"border-radius:0 4px 4px 0";d.forEach(function(e){console.log("%c"+e[0]+"%c"+e[1],c,a)})})(' + JSON.stringify(infoList) + ')</script></body>');
          assets['index.html'].source = function () {
            return html;
          };
          assets['index.html'].size = function () {
            return html.size;
          };
          resolve();
        });
      });
    }
  }]);

  return LogInfo;
}();

module.exports = LogInfo;