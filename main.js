// Progressive enhancement: pages and navigation remain readable without JavaScript.
document.documentElement.classList.add("js");
const menu = document.querySelector(".menu-button");
const links = document.querySelector("#nav-menu");
if (menu && links) {
  const closeMenu = () => {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.textContent = "Menu";
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    links.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav")) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
}
document.querySelectorAll("[data-print]").forEach((button) => {
  button.hidden = false;
  button.addEventListener("click", () => window.print());
});

// A website-made explainer of duration, not a claim about Claire's work.
const study = document.querySelector("[data-interaction-study]");
if (study) {
  const frame = study.querySelector(".study-frame");
  const button = study.querySelector("#gesture-button");
  const reset = study.querySelector("#gesture-reset");
  const progress = study.querySelector("#gesture-progress");
  const output = study.querySelector("#gesture-output");
  const feedback = study.querySelector("#study-feedback");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let startedAt = null;
  let animationFrame = null;
  const limit = 4;

  const render = (seconds, settled = false) => {
    progress.value = seconds;
    output.textContent = `${seconds.toFixed(1)} s`;
    if (!reducedMotion.matches || settled) {
      frame.style.setProperty("--revealed", `${(seconds / limit) * 100}%`);
    }
  };
  const finish = () => {
    const seconds = Math.min((performance.now() - startedAt) / 1000, limit);
    cancelAnimationFrame(animationFrame);
    startedAt = null;
    render(seconds, true);
    button.textContent = "Try another gesture";
    feedback.textContent = `Your gesture lasted ${seconds.toFixed(1)} seconds. ${Math.round((seconds / limit) * 100)}% of the image is revealed. Try a different duration to compare.`;
  };
  const tick = () => {
    const seconds = Math.min((performance.now() - startedAt) / 1000, limit);
    render(seconds);
    if (seconds >= limit) finish();
    else animationFrame = requestAnimationFrame(tick);
  };
  button.addEventListener("click", () => {
    if (startedAt !== null) {
      finish();
      return;
    }
    startedAt = performance.now();
    render(0, true);
    button.textContent = "Release gesture";
    feedback.textContent =
      "Gesture in progress. Release to keep this trace; the image is fully revealed at four seconds.";
    animationFrame = requestAnimationFrame(tick);
  });
  reset.addEventListener("click", () => {
    cancelAnimationFrame(animationFrame);
    startedAt = null;
    render(0, true);
    button.textContent = "Begin gesture";
    feedback.textContent =
      "Reset. Begin, wait, then release. A longer pause reveals more of the image, up to four seconds.";
  });
  render(0, true);
  study.querySelector(".study-live-controls").hidden = false;
  study.querySelector(".study-fallback").hidden = true;
}
