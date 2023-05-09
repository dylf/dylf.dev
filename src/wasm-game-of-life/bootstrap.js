if (typeof window !== "undefined") {

  import("./game-of-life.ts")
    .catch(e => console.error("Error importing `index.mjs`:", e));
}
