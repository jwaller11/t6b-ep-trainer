import { procedures } from "./procedures.js";
import { briefs } from "./briefs.js";

const allContent = [...procedures, ...briefs];

/* ===============================
   BRIEF PAGE SPLITTER
================================= */

function isBriefMode(mode) {
  return mode === "fam" || mode === "form";
}

function splitBriefIntoPages(brief) {
  const pages = [];
  let currentPage = null;

  for (const step of brief.steps) {
    if (step.type === "condition") {
      if (currentPage) pages.push(currentPage);

      currentPage = {
        id: `${brief.id}_${pages.length + 1}`,
        type: brief.type,
        title: step.text,
        parentTitle: brief.title,
        steps: [step]
      };

      continue;
    }

    if (!currentPage) {
      currentPage = {
        id: `${brief.id}_${pages.length + 1}`,
        type: brief.type,
        title: brief.title,
        parentTitle: brief.title,
        steps: []
      };
    }

    currentPage.steps.push(step);
  }

  if (currentPage) pages.push(currentPage);

  return pages;
}

function getModeContent(mode) {
  if (mode === "ep" || mode === "nwc") {
    return allContent.filter(p => p.type === "ep");
  }

  if (isBriefMode(mode)) {
    return allContent
      .filter(p => p.type === mode)
      .flatMap(splitBriefIntoPages);
  }

  return allContent.filter(p => p.type === mode);
}

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
   FIRST LETTER MODE
   Locked line-break version
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

function getCharCapacity(display) {
  const computed = window.getComputedStyle(display);
  const fontSize = computed.fontSize || "16px";
  const fontFamily = computed.fontFamily || "monospace";

  const probe = document.createElement("span");
  probe.textContent = "0".repeat(100);
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.whiteSpace = "pre";
  probe.style.fontFamily = fontFamily;
  probe.style.fontSize = fontSize;

  document.body.appendChild(probe);
  const charWidth = probe.getBoundingClientRect().width / 100;
  document.body.removeChild(probe);

  const displayWidth = display.clientWidth;
  const usableWidth = Math.max(1, displayWidth - 18); // padding/border cushion
  return Math.max(12, Math.floor(usableWidth / charWidth));
}

function splitIntoLockedLines(text, capacity) {
  const lines = [];
  let i = 0;

  while (i < text.length) {
    let end = Math.min(i + capacity, text.length);

    if (end < text.length) {
      const chunk = text.slice(i, end);
      const lastSpace = chunk.lastIndexOf(" ");

      // Prefer wrapping on spaces, but do not create tiny fragments.
      if (lastSpace > Math.floor(capacity * 0.45)) {
        end = i + lastSpace + 1;
      }
    }

    lines.push({ start: i, end });
    i = end;
  }

  return lines;
}

function renderFirstLetterDisplay(display, correctText, userText) {
  if (!display._lockedLines || !display._lockedCapacity) {
    const capacity = getCharCapacity(display);
    display._lockedCapacity = capacity;
    display._lockedLines = splitIntoLockedLines(correctText, capacity);
  }

  const parts = [];

  for (const line of display._lockedLines) {
    let lineHtml = "";

    for (let i = line.start; i < line.end; i++) {
      const correctCh = correctText[i];
      const typedCh = userText[i];

      if (typedCh !== undefined) {
        const good = normalize(typedCh) === normalize(correctCh);
        lineHtml += `<span class="${good ? "fl-typed" : "fl-typed fl-wrong"}">${escapeHtml(typedCh)}</span>`;
        continue;
      }

      const hint = hintChar(correctText, i);

      if (hint === " ") {
        lineHtml += `<span class="fl-space"> </span>`;
      } else if (hint === "_") {
        lineHtml += `<span class="fl-blank">_</span>`;
      } else {
        lineHtml += `<span class="fl-hint">${escapeHtml(hint)}</span>`;
      }
    }

    parts.push(`<div class="fl-line">${lineHtml}</div>`);
  }

  display.innerHTML = parts.join("");
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

  // Wait one frame so the display has a real width, then lock its line breaks.
  requestAnimationFrame(sync);
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
  let nwcNum = 1;

  const pushCondition = (text) =>
    queue.push({ kind: "condition", text, graded: false });

  const pushAction = (type, text) =>
    queue.push({ kind: type, text, graded: true });

  const pushNwcGroup = (groupType, bullets) => {
    bullets.forEach((bulletLines) => {
      queue.push({
        kind: groupType,
        label: `${nwcNum} ${groupType.toUpperCase()}:`,
        text: bulletLines.join(" "),
        graded: true
      });

      nwcNum++;
    });
  };

  for (const step of proc.steps) {

    if (step.type === "condition") {
      if (!proc.parentTitle) pushCondition(step.text);
      continue;
    }

    if (step.type === "briefLabel") {
      queue.push({
        kind: "briefLabel",
        text: step.text,
        graded: false
      });
      continue;
    }

    // EP / brief actions.
    if (step.type === "action" || step.type === "actionSub") {
      // In NWC mode, do not display EP action boxes.
      if (currentMode !== "nwc") {
        pushAction(step.type, step.text);
      }
      continue;
    }

    // NWC groups appear only in NWC mode.
    if (currentMode === "nwc") {
      if (step.type === "noteGroup") pushNwcGroup("note", step.bullets);
      if (step.type === "warningGroup") pushNwcGroup("warning", step.bullets);
      if (step.type === "cautionGroup") pushNwcGroup("caution", step.bullets);
    }
  }

  return queue;
}

/* ===============================
   RENDER
================================= */

function render() {
  filteredProcedures = getModeContent(currentMode);

  const container = document.getElementById("content");
  container.innerHTML = "";

  if (!filteredProcedures.length) {
    container.innerHTML = "<h2>No items in this mode.</h2>";
    updateCounter();
    return;
  }

  if (!currentProcedure) {
    currentProcedure = filteredProcedures[0];
  } else {
    const sameProcedure = filteredProcedures.find(p => p.id === currentProcedure.id);
    currentProcedure = sameProcedure ?? filteredProcedures[0];
  }

  const title = document.createElement("h2");

  if (currentProcedure.parentTitle) {
    title.textContent = currentProcedure.title;
  } else {
    title.textContent = currentProcedure.title;
  }

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

    if (item.kind === "briefLabel") {
      const briefLabel = document.createElement("div");
      briefLabel.className = "brief-label";
      briefLabel.textContent = item.text;
      container.appendChild(briefLabel);
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

    if (item.label) {

      label.textContent = item.label;
      label.style.width = "95px";
      label.style.flex = "0 0 95px";

    } else if (item.kind === "action") {

      // Brief modes use embedded numbering like (1), (a), etc.
      if (
        currentMode === "fam" ||
        currentMode === "form"
      ) {

        const match = item.text.match(/^\((\d+|[a-zA-Z])\)/);

        if (match) {
          label.textContent = `(${match[1]})`;
        } else {
          label.textContent = "";
          label.style.width = "10px";
          label.style.flex = "0 0 10px";
        }

      } else {

        // EP actions have their own separate count.
        label.textContent = `${actionNum}.`;
        actionNum++;
        subLetter = 0;
      }

    } else if (item.kind === "actionSub") {

      if (
        currentMode === "fam" ||
        currentMode === "form"
      ) {

        const match = item.text.match(/^\((\d+|[a-zA-Z])\)/);

        if (match) {
          label.textContent = `(${match[1]})`;
        } else {
          label.textContent = "";
          label.style.width = "10px";
          label.style.flex = "0 0 10px";
        }

      } else {

        label.textContent =
          String.fromCharCode(97 + subLetter) + ".";

        subLetter++;
      }
    }

    if (label.textContent === "") {
      label.style.width = "10px";
      label.style.flex = "0 0 10px";
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

      wrap.appendChild(display);
      wrap.appendChild(hiddenInput);

      bindFirstLetterTyping(display, hiddenInput, correctText);
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

  const index = filteredProcedures.findIndex(p => p.id === currentProcedure?.id);
  counter.textContent = filteredProcedures.length
    ? `${index + 1} of ${filteredProcedures.length}`
    : "0 of 0";
}

function prevEp() {
  const index = filteredProcedures.findIndex(p => p.id === currentProcedure?.id);
  if (index > 0) {
    currentProcedure = filteredProcedures[index - 1];
    render();
  }
}

function nextEp() {
  const index = filteredProcedures.findIndex(p => p.id === currentProcedure?.id);
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
    currentProcedure = null;
    render();
  });

  document.getElementById("nwcMode")?.addEventListener("click", () => {
    currentMode = "nwc";
    currentProcedure = null;
    render();
  });

  document.getElementById("famMode")?.addEventListener("click", () => {
    currentMode = "fam";
    currentProcedure = null;
    render();
  });

  document.getElementById("formMode")?.addEventListener("click", () => {
    currentMode = "form";
    currentProcedure = null;
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
