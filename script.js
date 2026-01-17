const { Renderer, Stave, StaveNote, Formatter, Barline } = Vex.Flow;

const output = document.getElementById("output");
const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const correctEl = document.getElementById("correct");
const wrongEl = document.getElementById("wrong");
const timeEl = document.getElementById("time");
const timeRadios = document.querySelectorAll('input[name="time"]');
const darkToggle = document.getElementById("darkToggle");
const keys = document.querySelectorAll(".white, .black");

const notes = [
  "c/3","d/3","e/3","f/3","g/3","a/3","b/3",
  "c/4","d/4","e/4","f/4","g/4","a/4","b/4",
  "c/5","d/5","e/5","f/5","g/5","a/5","b/5",
  "c/6","d/6","e/6","f/6","g/6","a/6","b/6"
];

let renderer, context, stave;
let currentNote = null;
let running = false;
let timer = null;

/* ===== OSNOVA ===== */
function drawEmptyStave() {
  output.innerHTML = "";

  renderer = new Renderer(output, Renderer.Backends.SVG);
  renderer.resize(740, 160);
  context = renderer.getContext();

  const color = document.body.classList.contains("dark") ? "#fff" : "#000";
  context.setStrokeStyle(color);
  context.setFillStyle(color);

  stave = new Stave(20, 40, 700);
  stave.setBegBarType(Barline.type.NONE);
  stave.setEndBarType(Barline.type.NONE);
  stave.addClef("treble");
  stave.setContext(context).draw();
}

/* ===== NOTA ===== */
function drawNote() {
  drawEmptyStave();

  currentNote = notes[Math.floor(Math.random() * notes.length)];

  const note = new StaveNote({
    clef: "treble",
    keys: [currentNote],
    duration: "q"
  });

  note.setStyle({
    fillStyle: document.body.classList.contains("dark") ? "#fff" : "#000"
  });

  Formatter.FormatAndDraw(context, stave, [note]);
}

/* ===== START ===== */
function startTest() {
  running = true;
  correctEl.textContent = 0;
  wrongEl.textContent = 0;

  let timeLeft = Number([...timeRadios].find(r => r.checked).value);
  timeEl.textContent = timeLeft;

  drawNote();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endTest();
  }, 1000);
}

/* ===== KONEC ===== */
function endTest() {
  clearInterval(timer);
  running = false;
  output.innerHTML = "";
}

/* ===== KLAVIATURA ===== */
keys.forEach(k => {
  k.addEventListener("click", () => {
    if (!running || !k.dataset.note) return;

    if (k.dataset.note === currentNote) {
      correctEl.textContent = Number(correctEl.textContent) + 1;
      drawNote();
    } else {
      wrongEl.textContent = Number(wrongEl.textContent) + 1;
    }
  });
});

/* ===== DARK MODE ===== */
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  drawEmptyStave();
});

startBtn.addEventListener("click", startTest);
endBtn.addEventListener("click", endTest);

drawEmptyStave();
