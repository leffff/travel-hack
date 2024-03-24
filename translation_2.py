#libretranslate [args]

const res = await fetch("https://libretranslate.com/translate", {
  method: "POST",
  body: JSON.stringify({
    q: "Ciao!",
    source: "auto",
    target: "en"
  }),
  headers: { "Content-Type": "application/json" }
});

console.log(await res.json());