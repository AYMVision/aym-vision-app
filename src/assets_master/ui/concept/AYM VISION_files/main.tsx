import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=889edba7"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import "/src/ai/core/fetchPatch.ts";
import "/src/ai/llm/xenovaEnv.ts";
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=889edba7"; const StrictMode = __vite__cjsImport3_react["StrictMode"];
import __vite__cjsImport4_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=889edba7"; const createRoot = __vite__cjsImport4_reactDom_client["createRoot"];
import "/src/index.css?t=1773831832089";
import i18n, { ensureNamespace } from "/src/i18n.ts?t=1773828828725";
import App from "/src/App.tsx?t=1773831832089";
async function bootstrap() {
  const lng = (i18n.resolvedLanguage || i18n.language || "de").split("-")[0];
  await ensureNamespace(lng, "common");
  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Root element #root not found");
  createRoot(rootEl).render(
    /* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
      fileName: "/Users/ann-sofiehobrink/dev/aym-vision-app/src/main.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this) }, void 0, false, {
      fileName: "/Users/ann-sofiehobrink/dev/aym-vision-app/src/main.tsx",
      lineNumber: 25,
      columnNumber: 5
    }, this)
  );
}
bootstrap();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBeUJNO0FBeEJOLE9BQU87QUFDUCxPQUFPO0FBRVAsU0FBU0Esa0JBQWtCO0FBQzNCLFNBQVNDLGtCQUFrQjtBQUUzQixPQUFPO0FBRVAsT0FBT0MsUUFBUUMsdUJBQXVCO0FBQ3RDLE9BQU9DLFNBQVM7QUFFaEIsZUFBZUMsWUFBWTtBQUd6QixRQUFNQyxPQUFPSixLQUFLSyxvQkFBb0JMLEtBQUtNLFlBQVksTUFBTUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUd6RSxRQUFNTixnQkFBZ0JHLEtBQUssUUFBUTtBQUVuQyxRQUFNSSxTQUFTQyxTQUFTQyxlQUFlLE1BQU07QUFDN0MsTUFBSSxDQUFDRixPQUFRLE9BQU0sSUFBSUcsTUFBTSw4QkFBOEI7QUFFM0RaLGFBQVdTLE1BQU0sRUFBRUk7QUFBQUEsSUFDakIsdUJBQUMsY0FDQyxpQ0FBQyxTQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBSSxLQUROO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FFQTtBQUFBLEVBQ0Y7QUFDRjtBQUVBVCxVQUFVIiwibmFtZXMiOlsiU3RyaWN0TW9kZSIsImNyZWF0ZVJvb3QiLCJpMThuIiwiZW5zdXJlTmFtZXNwYWNlIiwiQXBwIiwiYm9vdHN0cmFwIiwibG5nIiwicmVzb2x2ZWRMYW5ndWFnZSIsImxhbmd1YWdlIiwic3BsaXQiLCJyb290RWwiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiRXJyb3IiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL21haW4udHN4XG5pbXBvcnQgJy4vYWkvY29yZS9mZXRjaFBhdGNoJztcbmltcG9ydCAnLi9haS9sbG0veGVub3ZhRW52JztcblxuaW1wb3J0IHsgU3RyaWN0TW9kZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcblxuaW1wb3J0ICcuL2luZGV4LmNzcyc7XG5cbmltcG9ydCBpMThuLCB7IGVuc3VyZU5hbWVzcGFjZSB9IGZyb20gJy4vaTE4bic7IC8vIOKchSBuZXVcbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG5hc3luYyBmdW5jdGlvbiBib290c3RyYXAoKSB7XG4gIC8vIGkxOG4gaW5pdCB3aXJkIGR1cmNoIGltcG9ydCAnLi9pMThuJyBpbiBkZXIgRGF0ZWkgaTE4biBzZWxic3QgZ2VtYWNodFxuICAvLyBXaXIgd2FydGVuIGt1cnosIGJpcyBkaWUgU3ByYWNoZSBmZXN0c3RlaHQ6XG4gIGNvbnN0IGxuZyA9IChpMThuLnJlc29sdmVkTGFuZ3VhZ2UgfHwgaTE4bi5sYW5ndWFnZSB8fCAnZGUnKS5zcGxpdCgnLScpWzBdO1xuXG4gIC8vIOKchSBtaW5kZXN0ZW5zIGNvbW1vbiB2b3JsYWRlbiwgZGFtaXQgQmFzaXMtVUkgbmljaHQgbGVlciBpc3RcbiAgYXdhaXQgZW5zdXJlTmFtZXNwYWNlKGxuZywgJ2NvbW1vbicpO1xuXG4gIGNvbnN0IHJvb3RFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XG4gIGlmICghcm9vdEVsKSB0aHJvdyBuZXcgRXJyb3IoJ1Jvb3QgZWxlbWVudCAjcm9vdCBub3QgZm91bmQnKTtcblxuICBjcmVhdGVSb290KHJvb3RFbCkucmVuZGVyKFxuICAgIDxTdHJpY3RNb2RlPlxuICAgICAgPEFwcCAvPlxuICAgIDwvU3RyaWN0TW9kZT5cbiAgKTtcbn1cblxuYm9vdHN0cmFwKCk7Il0sImZpbGUiOiIvVXNlcnMvYW5uLXNvZmllaG9icmluay9kZXYvYXltLXZpc2lvbi1hcHAvc3JjL21haW4udHN4In0=