import { procedures } from "./procedures.js";

let currentProcedure = procedures[0];
let currentMode = "ep";              // "ep" or "nwc"
let trainingMode = "normal";         // "normal" or "hard"
let firstLetterMode = false;
let caseSensitive = false;
let hardIndex = 0;

const BASE_HEIGHT_PX = 28;

/* ===============================
   TEXT NORMALIZATION
================================= */
function normalize(text) {
  let cleaned = (text ?? "").replace(/\s+/g, " ").trim();
  if (!caseSensitive) cleaned = cleaned.toLowerCase();
  return cleaned;
}

/* ===============================
   RESIZE
================================= */
function resizeBox(el) {
  if (!el) return;

  const hasText = (el.value ?? "").trim().length > 0;
  el.style.height = hasText ? "0px" : `${BASE_HEIGHT_PX}px`;

  requestAnimationFrame(() => {
    const stillHasText = (el.value ?? "").trim().length > 0;
    if (!stillHasText) {
      el.style.height = `${BASE_HEIGHT_PX}px`;
      return;
    }
    el.style.height = el.scrollHeight + "px";
  });
}

function resizeAllBoxes() {
  document.querySelectorAll(".input-wrap textarea").forEach(resizeBox);
}

/* ===============================
   FIRST LETTER (GHOST OVERLAY)
================================= */
function baseHintString(text) {
  let out = "";
  let start = true;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isAlphaNum = /[A-Za-z0-9]/.test(ch);

    if (isAlphaNum) {
      out += start ? ch : "_";
      start = false;
    } else {
      out += ch;
      if (ch === " " || ch === "/" || ch === "-") start = true;
    }
  }
  return out;
}

// Ghost disappears ONLY where user typed the correct char at that same index.
// Does NOT alter user input.
function progressiveHint(userText, correctText) {
  const base = baseHintString(correctText);

  const u = userText ?? "";
  const c = correctText ?? "";

  // compare with/without case sensitivity, but preserve base chars
  const uCmp = caseSensitive ? u : u.toLowerCase();
  const cCmp = caseSensitive ? c : c.toLowerCase();

  let result = "";
  for (let i = 0; i < c.length; i++) {
    const userHasChar = i < uCmp.length;
    if (userHasChar && uCmp[i] === cCmp[i]) result += " ";
    else result += base[i];
  }
  return result;
}

function forceCaretToEnd(ta) {
  const n = (ta.value ?? "").length;
  ta.setSelectionRange(n, n);
}

function attachFirstLetterHandlers(ta, ghostEl, correctText) {
  const updateGhost = () => {
    ghostEl.textContent = progressiveHint(ta.value, correctText);
    // keep overlay height in sync with auto-resize
    ghostEl.style.height = ta.offsetHeight + "px";
  };

  // Keep caret at end (so “first-letter mode” feels like forward entry),
  // but DO NOT block or modify typing.
  ta.addEventListener("focus", () => {
    requestAnimationFrame(() => forceCaretToEnd(ta));
  });

  ta.addEventListener("mouseup", () => {
    requestAnimationFrame(() => forceCaretToEnd(ta));
  });

  ta.addEventListener("keydown", (e) => {
    if (!firstLetterMode) return;

    // Allow Tab navigation
    if (e.key === "Tab") return;

    // If user tries to move cursor, snap back on next frame
    if (
      e.key === "ArrowLeft" || e.key === "ArrowRight" ||
      e.key === "ArrowUp" || e.key === "ArrowDown" ||
      e.key === "Home" || e.key === "End"
    ) {
      requestAnimationFrame(() => forceCaretToEnd(ta));
    }
  });

  // On any input change, update ghost + resize. Never clamp/trim value.
  ta.addEventListener("input", () => {
    if (!firstLetterMode) return;
    resizeBox(ta);
    updateGhost();
    requestAnimationFrame(() => forceCaretToEnd(ta));
  });

  // Initialize
  ghostEl.textContent = baseHintString(correctText);
  updateGhost();
}

/* ===============================
   QUEUE BUILDING
================================= */
function buildQueue(proc) {
  const queue = [];

  const pushCondition = (text) => queue.push({ kind: "condition", text, graded: false });
  const pushAction = (type, text) => queue.push({ kind: type, text, graded: true });

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
  const container = document.getElementById("content");
  if (!container) return;

  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = currentProcedure.title;
  container.appendChild(title);

  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

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
    } else {
      label.textContent = "";
    }

    const wrap = document.createElement("div");
    wrap.className = "input-wrap";

    const ghost = document.createElement("div");
    ghost.className = "ghost";

    const ta = document.createElement("textarea");
    ta.dataset.index = String(gradedIdx);

    if (trainingMode === "hard" && gradedIdx !== hardIndex) {
      ta.disabled = true;
    }

    const correctText = gradedItems[gradedIdx]?.text ?? "";

    if (firstLetterMode) {
      attachFirstLetterHandlers(ta, ghost, correctText);
    } else {
      ghost.textContent = "";
    }

    wrap.appendChild(ghost);
    wrap.appendChild(ta);

    block.appendChild(label);
    block.appendChild(wrap);
    container.appendChild(block);

    gradedIdx++;
  }

  updateCounter();
  resizeAllBoxes();
}

/* ===============================
   CHECK / RESET / HINT / ALL
================================= */
function check() {
  const inputs = Array.from(document.querySelectorAll(".input-wrap textarea"));
  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

  inputs.forEach((input, i) => {
    const user = normalize(input.value);
    const correct = normalize(gradedItems[i]?.text ?? "");

    if (user === correct) {
      input.classList.add("correct");
      input.classList.remove("incorrect");

      if (trainingMode === "hard" && i === hardIndex) {
        hardIndex = Math.min(hardIndex + 1, gradedItems.length - 1);
        render();
      }
    } else {
      input.classList.add("incorrect");
      input.classList.remove("correct");
    }
  });
}

function reset() {
  hardIndex = 0;
  render();
}

function showAllAnswers() {
  if (trainingMode === "hard") return;

  const inputs = Array.from(document.querySelectorAll(".input-wrap textarea"));
  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

  inputs.forEach((input, i) => {
    input.value = gradedItems[i]?.text ?? "";
    input.classList.add("correct");
    input.classList.remove("incorrect");

    const ghost = input.parentElement.querySelector(".ghost");
    if (ghost) ghost.textContent = "";

    resizeBox(input);
  });
}

function showHint() {
  if (trainingMode === "hard") return;

  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

  const idx = Math.min(hardIndex, gradedItems.length - 1);
  const input = document.querySelectorAll(".input-wrap textarea")[idx];
  if (!input) return;

  if (firstLetterMode) {
    const ghost = input.parentElement.querySelector(".ghost");
    if (ghost) ghost.textContent = baseHintString(gradedItems[idx].text);
  } else {
    input.placeholder = baseHintString(gradedItems[idx].text);
  }
}

/* ===============================
   PAGINATION
================================= */
function updateCounter() {
  const counter = document.getElementById("epCounter");
  if (!counter) return;

  const index = procedures.indexOf(currentProcedure);
  counter.textContent = `${index + 1} of ${procedures.length}`;
}

function prevEp() {
  const index = procedures.indexOf(currentProcedure);
  if (index > 0) {
    currentProcedure = procedures[index - 1];
    hardIndex = 0;
    render();
  }
}

function nextEp() {
  const index = procedures.indexOf(currentProcedure);
  if (index < procedures.length - 1) {
    currentProcedure = procedures[index + 1];
    hardIndex = 0;
    render();
  }
}

function randomEp() {
  const randomIndex = Math.floor(Math.random() * procedures.length);
  currentProcedure = procedures[randomIndex];
  hardIndex = 0;
  render();
}

/* ===============================
   EVENT BINDINGS
================================= */
function bind() {
  document.getElementById("epMode")?.addEventListener("click", () => {
    currentMode = "ep";
    hardIndex = 0;
    render();
  });

  document.getElementById("nwcMode")?.addEventListener("click", () => {
    currentMode = "nwc";
    hardIndex = 0;
    render();
  });

  document.querySelectorAll("input[name='mode']").forEach(radio => {
    radio.addEventListener("change", (e) => {
      trainingMode = e.target.value;
      hardIndex = 0;
      render();
    });
  });

  document.getElementById("firstLetterToggle")?.addEventListener("change", (e) => {
    firstLetterMode = e.target.checked;
    render();
  });

  document.getElementById("caseToggle")?.addEventListener("change", (e) => {
    caseSensitive = e.target.checked;
    // update ghost comparisons immediately
    if (firstLetterMode) render();
  });

  document.getElementById("checkBtn")?.addEventListener("click", check);
  document.getElementById("hintBtn")?.addEventListener("click", showHint);
  document.getElementById("allBtn")?.addEventListener("click", showAllAnswers);
  document.getElementById("resetBtn")?.addEventListener("click", reset);

  document.getElementById("prevEpBtn")?.addEventListener("click", prevEp);
  document.getElementById("nextEpBtn")?.addEventListener("click", nextEp);
  document.getElementById("randomEpBtn")?.addEventListener("click", randomEp);
}

bind();
render();
