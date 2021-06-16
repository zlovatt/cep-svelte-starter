const aeq: AEQuery = require("aequery");

import Log from "../utils/log";
import console from "../utils/console";
import buildError from "../utils/buildError";

export default function explode() {
  Log.trace("Hi from ExtendScript!", [123, 456]);
  Log.error("Error from ExtendScript!", {
    a: 1,
    b: true,
    c: "hey",
    d: { ab: 12, cd: 34 }
  });
  Log.warn("Warn from ExtendScript!");

  const comp = aeq.getActiveComp();

  const layers = aeq.getLayers(comp!);

  if (aeq.isEmpty(layers)) {
    throw buildError("No layers!", "explode.ts");
  }

  layers.forEach((layer, ii) => {
    console.log(layer.name);
    console.warn(layer.index);
    console.error(layer.label);
    layer.name = ii.toString();
  });

  let res: string[] = app.effects.map(function (effect: any) {
    return effect.matchName;
  });

  alert(res[2]);
}
