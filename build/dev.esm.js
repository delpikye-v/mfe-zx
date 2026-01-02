/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var RUNTIME_EVENTS = {
    INTENT_DISPATCH: "intent:dispatch",
    INTENT_RESOLVE_START: "intent:resolve:start",
    INTENT_RESOLVE_END: "intent:resolve:end",
    INTENT_RESOLVE_ERROR: "intent:resolve:error",
    MFE_LOAD_START: "mfe:load:start",
    MFE_LOAD_END: "mfe:load:end",
    MFE_MOUNT_START: "mfe:mount:start",
    MFE_MOUNT_END: "mfe:mount:end",
    MFE_RELOAD_START: "mfe:reload:start",
    MFE_RELOAD_END: "mfe:reload:end",
    MFE_ERROR: "mfe:error",
};

// --------------------
// Client-side notify (remote app)
// --------------------
function setupMFEDefNotify(_a) {
    var _b;
    var name = _a.name, _c = _a.version, version = _c === void 0 ? "dev" : _c, _d = _a.wsUrl, wsUrl = _d === void 0 ? "ws://localhost:3000/__mfe_reload" : _d;
    if (typeof window === "undefined")
        return;
    var devMode = typeof import.meta !== "undefined" ? (_b = import.meta.env) === null || _b === void 0 ? void 0 : _b.DEV : true;
    if (!devMode)
        return;
    var ws = null;
    var connect = function () {
        ws = new WebSocket(wsUrl);
        ws.onopen = function () {
            ws === null || ws === void 0 ? void 0 : ws.send(JSON.stringify({ type: "REGISTER", name: name, version: version }));
        };
        ws.onclose = function () { return setTimeout(connect, 1000); };
        ws.onerror = function (err) { return console.warn("[mfe-runtime] WS error:", err); };
    };
    connect();
    // HMR integration
    try {
        if (typeof import.meta !== "undefined" && import.meta.hot) {
            import.meta.hot.accept(function () {
                if ((ws === null || ws === void 0 ? void 0 : ws.readyState) === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "RELOAD", name: name }));
                }
            });
        }
    }
    catch (_e) {
        // no-op
    }
}
function startMFEDevServer(onReload, port) {
    if (port === void 0) { port = 3000; }
    var WebSocketServer;
    try {
        WebSocketServer = require("ws").WebSocketServer;
    }
    catch (_a) {
        console.warn("[mfe-runtime] ws not available. Dev server disabled.");
        return;
    }
    var wss = new WebSocketServer({ port: port, path: "/__mfe_reload" });
    var remotes = new Set();
    wss.on("connection", function (ws) {
        ws.on("message", function (raw) {
            try {
                var msg = JSON.parse(raw.toString());
                if (msg.type === "REGISTER") {
                    remotes.add(msg.name);
                    console.log("[mfe-runtime] registered remote: ".concat(msg.name));
                }
                if (msg.type === "RELOAD" && remotes.has(msg.name)) {
                    console.log("[mfe-runtime] reload triggered for: ".concat(msg.name));
                    onReload(msg.name);
                }
            }
            catch (_a) {
                // ignore dev-only errors
            }
        });
    });
    console.log("[mfe-runtime] dev reload server started on ws://localhost:".concat(port, "/__mfe_reload"));
}
// --------------------
// Host helper to reload remotes
// --------------------
function createMFEReloadServer(host, remotes) {
    return function start() {
        var _this = this;
        startMFEDevServer(function (name) { return __awaiter(_this, void 0, void 0, function () {
            var remote, traceId, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        remote = remotes[name];
                        if (!remote)
                            return [2 /*return*/];
                        traceId = "dev-reload:".concat(name, ":").concat(Date.now());
                        host.getEventBus().emit(RUNTIME_EVENTS.MFE_RELOAD_START, { name: name, traceId: traceId });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, host.reload({
                                name: name,
                                url: remote.url,
                                global: remote.global,
                                el: remote.el(),
                                isolate: remote.isolate,
                                shadowMode: remote.shadowMode,
                                traceId: traceId,
                            })];
                    case 2:
                        _a.sent();
                        host.getEventBus().emit(RUNTIME_EVENTS.MFE_RELOAD_END, { name: name, traceId: traceId });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        host.getEventBus().emit(RUNTIME_EVENTS.MFE_ERROR, { name: name, traceId: traceId, error: error_1, phase: "reload" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}

export { createMFEReloadServer, setupMFEDefNotify, startMFEDevServer };
