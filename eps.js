import { procedures } from "./procedures.js";
import { briefs } from "./briefs.js";

const allContent = [...procedures, ...briefs];

let currentMode = "ep";
let filteredProcedures = [];
let currentProcedure = null;

let firstLetterMode = false;
let currentGradedItems = [];

const BASE_HEIGHT_PX = 28;

/* ===============================
   NORMALIZE
================================= */

function normalize(text) {
  return (text ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* ===============================
   FIRST LETTER DISPLAY
================================= */

function isWordChar(ch) {
  return /[A-Za-z0-9]/.test(ch);
}

function isWordStart(text, index) {
  if (!isWordChar(text[index])) return false;
  if (index === 0) return true;

  const prev = text[index - 1];

  return (
    prev === " " ||
    prev === "/" ||
    prev === "-" ||
    prev === "(" ||
    prev === ")" ||
    prev === '"' ||
    prev === "'" ||
    prev === "‘" ||
    prev === "’" ||
    prev === "“" ||
    prev === "”"
  );
}

function hintChar(correctText, index) {
  const ch = correctText[index];

  if (!isWordChar(ch)) return ch;
  return isWordStart(correctText, index) ? ch : "_";
}

function escapeHtml(ch) {
  return String(ch)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderFirstLetterDisplay(display, correctText, userText) {
  let html = "";

  for (let i = 0; i < correctText.length; i++) {
    const correctCh = correctText[i];
    const typedCh = userText[i];

    if (typedCh !== undefined) {
      const good = normalize(typedCh) === normalize(correctCh);
      html += `<span class="${good ? "fl-typed" : "fl-typed fl-wrong"}">${escapeHtml(typedCh)}</span>`;
      continue;
    }

    const hint = hintChar(correctText, i);

    if (hint === " ") {
      html += `<span class="fl-space"> </span>`;
    } else if (hint === "_") {
      html += `<span class="fl-blank">_</span>`;
    } else {
      html += `<span class="fl-hint">${escapeHtml(hint)}</span>`;
    }
  }

  display.innerHTML = html;
}

function bindFirstLetterTyping(display, hiddenInput, correctText) {
  const sync = () => {
    renderFirstLetterDisplay(display, correctText, hiddenInput.value);
  };

  display.addEventListener("click", () => display.focus());

  display.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    let value = hiddenInput.value;

    if (e.key === "Backspace") {
      e.preventDefault();
      hiddenInput.value = value.slice(0, -1);
      sync();
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      sync();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      hiddenInput.value += "\n";
      sync();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      hiddenInput.value += " ";
      sync();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      hiddenInput.value += e.key;
      sync();
    }
  });

  renderFirstLetterDisplay(display, correctText, hiddenInput.value);
}

/* ===============================
   RESIZE
================================= */

function resizeBox(el) {
  if (!el) return;

  el.style.height = "0px";

  requestAnimationFrame(() => {
    if (!el.value.trim()) {
      el.style.height = BASE_HEIGHT_PX + "px";
    } else {
      el.style.height = el.scrollHeight + "px";
    }
  });
}

/* ===============================
   QUEUE
================================= */

function buildQueue(proc) {
  const queue = [];

  const pushCondition = (text) =>
    queue.push({ kind: "condition", text, graded: false });

  const pushAction = (type, text) =>
    queue.push({ kind: type, text, graded: true });

  const pushGroup = (groupType, bullets) => {
    queue.push({ kind: "groupHeader", text: groupType.toUpperCase(), graded: false });

    bullets.forEach((bulletLines, letterIdx) => {
      bulletLines.forEach((line, lineIdx) => {
        queue.push({
          kind: groupType,
          label: String.fromCharCode(65 + letterIdx) + (lineIdx + 1) + ".",
          text: line,
          graded: true
        });
      });
    });
  };

  for (const step of proc.steps) {
    if (step.type === "condition") {
      pushCondition(step.text);
      continue;
    }

    if (step.type === "action" || step.type === "actionSub") {
      pushAction(step.type, step.text);
      continue;
    }

    if (currentMode === "nwc") {
      if (step.type === "noteGroup") pushGroup("note", step.bullets);
      if (step.type === "warningGroup") pushGroup("warning", step.bullets);
      if (step.type === "cautionGroup") pushGroup("caution", step.bullets);
    }
  }

  return queue;
}

/* ===============================
   RENDER
================================= */

function render() {
  if (currentMode === "ep" || currentMode === "nwc") {
    filteredProcedures = allContent.filter(p => p.type === "ep");
  } else {
    filteredProcedures = allContent.filter(p => p.type === currentMode);
  }

  const container = document.getElementById("content");
  container.innerHTML = "";

  if (!filteredProcedures.length) {
    container.innerHTML = "<h2>No items in this mode.</h2>";
    updateCounter();
    return;
  }

  if (!currentProcedure || !filteredProcedures.includes(currentProcedure)) {
    currentProcedure = filteredProcedures[0];
  }

  const title = document.createElement("h2");
  title.textContent = currentProcedure.title;
  container.appendChild(title);

  const queue = buildQueue(currentProcedure);
  currentGradedItems = queue.filter(q => q.graded);

  let gradedIdx = 0;
  let actionNum = 1;
  let subLetter = 0;

  for (const item of queue) {
    if (item.kind === "condition") {
      const cond = document.createElement("div");
      cond.className = "condition-label";
      cond.textContent = item.text;
      container.appendChild(cond);
      continue;
    }

    if (item.kind === "groupHeader") {
      const header = document.createElement("div");
      header.className = "group-header";
      header.textContent = item.text + ":";
      container.appendChild(header);
      continue;
    }

    const block = document.createElement("div");
    block.className = "line-block";

    if (item.kind === "note") block.classList.add("note-block");
    if (item.kind === "warning") block.classList.add("warning-block");
    if (item.kind === "caution") block.classList.add("caution-block");

    const label = document.createElement("div");
    label.className = "line-label";

    if (item.kind === "action") {
      label.textContent = `${actionNum}.`;
      actionNum++;
      subLetter = 0;
    } else if (item.kind === "actionSub") {
      label.textContent = String.fromCharCode(97 + subLetter) + ".";
      subLetter++;
    } else if (item.label) {
      label.textContent = item.label;
    }

    const wrap = document.createElement("div");
    wrap.className = "input-wrap";

    const correctText = currentGradedItems[gradedIdx]?.text ?? "";

    if (firstLetterMode) {
      wrap.classList.add("first-letter-wrap");

      const hiddenInput = document.createElement("textarea");
      hiddenInput.className = "first-letter-hidden-input";
      hiddenInput.setAttribute("aria-hidden", "true");
      hiddenInput.tabIndex = -1;

      const display = document.createElement("div");
      display.className = "first-letter-display";
      display.tabIndex = 0;
      display.setAttribute("role", "textbox");
      display.setAttribute("aria-label", "First letter answer input");

      bindFirstLetterTyping(display, hiddenInput, correctText);

      wrap.appendChild(display);
      wrap.appendChild(hiddenInput);
    } else {
      const ta = document.createElement("textarea");
      ta.autocomplete = "off";
      ta.spellcheck = false;

      resizeBox(ta);
      ta.addEventListener("input", () => resizeBox(ta));

      wrap.appendChild(ta);
    }

    block.appendChild(label);
    block.appendChild(wrap);
    container.appendChild(block);

    gradedIdx++;
  }

  updateCounter();
}

/* ===============================
   CHECK / RESET / ALL
================================= */

function check() {
  const inputs = Array.from(document.querySelectorAll(".input-wrap textarea"));

  inputs.forEach((input, i) => {
    const user = normalize(input.value);
    const correct = normalize(currentGradedItems[i]?.text ?? "");

    const display = input.parentElement.querySelector(".first-letter-display");

    if (user === correct) {
      input.classList.add("correct");
      input.classList.remove("incorrect");
      if (display) {
        display.classList.add("correct");
        display.classList.remove("incorrect");
      }
    } else {
      input.classList.add("incorrect");
      input.classList.remove("correct");
      if (display) {
        display.classList.add("incorrect");
        display.classList.remove("correct");
      }
    }
  });
}

function reset() {
  render();
}

function showAllAnswers() {
  const inputs = Array.from(document.querySelectorAll(".input-wrap textarea"));

  inputs.forEach((input, i) => {
    const correctText = currentGradedItems[i]?.text ?? "";
    input.value = correctText;
    input.classList.add("correct");
    input.classList.remove("incorrect");

    const display = input.parentElement.querySelector(".first-letter-display");
    if (display) {
      renderFirstLetterDisplay(display, correctText, input.value);
      display.classList.add("correct");
      display.classList.remove("incorrect");
    } else {
      resizeBox(input);
    }
  });
}

/* ===============================
   PAGINATION
================================= */

function updateCounter() {
  const counter = document.getElementById("epCounter");
  if (!counter) return;

  const index = filteredProcedures.indexOf(currentProcedure);
  counter.textContent = filteredProcedures.length
    ? `${index + 1} of ${filteredProcedures.length}`
    : "0 of 0";
}

function prevEp() {
  const index = filteredProcedures.indexOf(currentProcedure);
  if (index > 0) {
    currentProcedure = filteredProcedures[index - 1];
    render();
  }
}

function nextEp() {
  const index = filteredProcedures.indexOf(currentProcedure);
  if (index < filteredProcedures.length - 1) {
    currentProcedure = filteredProcedures[index + 1];
    render();
  }
}

function randomEp() {
  if (!filteredProcedures.length) return;
  currentProcedure =
    filteredProcedures[Math.floor(Math.random() * filteredProcedures.length)];
  render();
}

/* ===============================
   EVENTS
================================= */

function bind() {
  document.getElementById("epMode")?.addEventListener("click", () => {
    currentMode = "ep";
    render();
  });

  document.getElementById("nwcMode")?.addEventListener("click", () => {
    currentMode = "nwc";
    render();
  });

  document.getElementById("famMode")?.addEventListener("click", () => {
    currentMode = "fam";
    render();
  });

  document.getElementById("inavMode")?.addEventListener("click", () => {
    currentMode = "inav";
    render();
  });

  document.getElementById("formMode")?.addEventListener("click", () => {
    currentMode = "form";
    render();
  });

  document.getElementById("firstLetterToggle")?.addEventListener("change", (e) => {
    firstLetterMode = e.target.checked;
    render();
  });

  document.getElementById("checkBtn")?.addEventListener("click", check);
  document.getElementById("allBtn")?.addEventListener("click", showAllAnswers);
  document.getElementById("resetBtn")?.addEventListener("click", reset);

  document.getElementById("prevEpBtn")?.addEventListener("click", prevEp);
  document.getElementById("nextEpBtn")?.addEventListener("click", nextEp);
  document.getElementById("randomEpBtn")?.addEventListener("click", randomEp);
}

bind();
render();
