/**
 * One page-scroll lock shared by every overlay. Overlays can hand over to each
 * other (the genre sheet closes as the video modal opens), so each one saving
 * and restoring `body.style.overflow` on its own leaves the page stuck; a count
 * releases the page only when the last holder lets go.
 */
let holders = 0;
let previous = "";

export function lockPageScroll(): () => void {
  if (holders === 0) {
    previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  holders += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) document.body.style.overflow = previous;
  };
}
