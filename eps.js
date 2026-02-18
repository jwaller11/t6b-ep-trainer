import { procedures } from "./procedures.js";

let currentProcedure = procedures[0];
let currentMode = "ep";
let trainingMode = "normal";
let firstLetterMode = false;
let caseSensitive = false;

/* ===============================
   NORMALIZE
================================= */

function normalize(text) {
  let cleaned = (text ?? "").replace(/\s+/g, " ").trim();
  if (!caseSensitive) cleaned = cleaned.toLowerCase();
  return cleaned;
}

/* ===============================
   FIRST LETTER
================================= */

function baseHintString(text) {
  let out = "";
  let start = true;

  for (let ch of text) {
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

function progressiveHint(userText, correctText) {
  const base = baseHintString(correctText);
  const u = caseSensitive ? userText : userText.toLowerCase();
  const c = caseSensitive ? correctText : correctText.toLowerCase();

  let result = "";
  for (let i = 0; i < correctText.length; i++) {
    if (i < u.length && u[i] === c[i]) result += " ";
    else result += base[i];
  }
  return result;
}

/* ===============================
   QUEUE
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
    }

    const wrap = document.createElement("div");
    wrap.className = "input-wrap";

    const ghost = document.createElement("div");
    ghost.className = "ghost";

    const editable = document.createElement("div");
    editable.className = "editable";
    editable.contentEditable = true;

    const correctText = gradedItems[gradedIdx]?.text ?? "";

    if (firstLetterMode) {
      ghost.textContent = baseHintString(correctText);

      editable.addEventListener("input", () => {
        ghost.textContent = progressiveHint(editable.innerText, correctText);
      });
    }

    wrap.appendChild(ghost);
    wrap.appendChild(editable);

    block.appendChild(label);
    block.appendChild(wrap);
    container.appendChild(block);

    gradedIdx++;
  }
}

/* ===============================
   CHECK / RESET / ALL
================================= */

function check() {
  const inputs = Array.from(document.querySelectorAll(".editable"));
  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

  inputs.forEach((input, i) => {
    const user = normalize(input.innerText);
    const correct = normalize(gradedItems[i]?.text ?? "");

    if (user === correct) {
      input.classList.add("correct");
      input.classList.remove("incorrect");
    } else {
      input.classList.add("incorrect");
      input.classList.remove("correct");
    }
  });
}

function reset() {
  render();
}

function showAllAnswers() {
  const inputs = Array.from(document.querySelectorAll(".editable"));
  const queue = buildQueue(currentProcedure);
  const gradedItems = queue.filter(q => q.graded);

  inputs.forEach((input, i) => {
    input.innerText = gradedItems[i]?.text ?? "";
    input.classList.add("correct");

    const ghost = input.parentElement.querySelector(".ghost");
    if (ghost) ghost.textContent = "";
  });
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

  document.getElementById("firstLetterToggle")?.addEventListener("change", (e) => {
    firstLetterMode = e.target.checked;
    render();
  });

  document.getElementById("caseToggle")?.addEventListener("change", (e) => {
    caseSensitive = e.target.checked;
  });

  document.getElementById("checkBtn")?.addEventListener("click", check);
  document.getElementById("allBtn")?.addEventListener("click", showAllAnswers);
  document.getElementById("resetBtn")?.addEventListener("click", reset);
}

bind();
render();
