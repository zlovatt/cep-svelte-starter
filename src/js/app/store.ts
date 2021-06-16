import { readable, derived, writable } from "svelte/store";

export const prefix = writable("");

export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

export const start = new Date();
