import { readable, writable } from "svelte/store";

const locationWritable = writable(window.location.pathname);

export const location = readable(window.location.pathname, (set) =>
  locationWritable.subscribe(set)
);

const originalPushState = history.pushState;
history.pushState = function (...args) {
  const result = originalPushState.apply(this, args);
  locationWritable.set(window.location.pathname);
  return result;
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  const result = originalReplaceState.apply(this, args);
  locationWritable.set(window.location.pathname);
  return result;
};

window.addEventListener("popstate", (e) =>
  locationWritable.set((e.target as Window).location.pathname)
);
