let xLib: ExternalObject | undefined;
try {
  xLib = new ExternalObject("lib:PlugPlugExternalObject");
} catch (e) {
  alert("Missing ExternalObject: " + e);
}

// send an event to the tool VM
function dispatch(type: string, data: string) {
  if (!xLib) {
    return;
  }
  const eventObj = new CSXSEvent();
  eventObj.type = type;
  eventObj.data = data || "";
  eventObj.dispatch();
}

function sendEvent(args: any[], eventId: string) {
  const safeArgs = args.map((arg) => {
    try {
      JSON.stringify(arg);
      if (Array.isArray(arg)) {
        return arg;
      }
      if (typeof arg === "object") {
        return Object.keys(arg).reduce((memo: any, key: string) => {
          if (typeof arg[key] === "function") {
            memo[key] = `[function ${arg[key].name}]`;
            return memo;
          }
          if (typeof arg[key] === "undefined") {
            memo[key] = "[undefined]";
            return memo;
          }
          memo[key] = arg[key];
          return memo;
        }, {});
      }
      return arg;
    } catch (e) {
      return arg.toString();
    }
  });

  dispatch(`JSX_${eventId}`, JSON.stringify(safeArgs));
}

export default sendEvent;
