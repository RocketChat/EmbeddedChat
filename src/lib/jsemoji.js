import JSEMOJI from "emoji-js";

function memoizeJsEmoji() {
  let jsemoji = JSON.parse(localStorage.getItem('jsemoji'));
  if (jsemoji) {
    return jsemoji;
  } else {
    jsemoji = new JSEMOJI();
    jsemoji.img_set = "emojione";
    jsemoji.img_sets.emojione.path =
      "https://cdn.jsdelivr.net/joypixels/assets/6.6/png/unicode/32";
    jsemoji.supports_css = false;
    jsemoji.allow_native = false;
    jsemoji.replace_mode = "unified";
    localStorage.setItem('jsemoji', JSON.stringify(jsemoji));
  }
  return jsemoji;
}

export const jsemoji = memoizeJsEmoji();
