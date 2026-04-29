const TIMER_STORAGE_KEY = "timerState";
const DEFAULT_TIMER_DURATION = 5 * 60 * 1000;

let timerInterval;
let audioContext;
let timerState = {
  totalDuration: DEFAULT_TIMER_DURATION,
  remainingTime: DEFAULT_TIMER_DURATION,
  endTimestamp: null,
  isRunning: false,
  status: "idle",
};

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const timerNote = document.getElementById("timerNote");
const configuredTime = document.getElementById("configuredTime");
const statusLabel = document.getElementById("statusLabel");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const startPauseBtn = document.getElementById("startPauseBtn");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");
const presetButtons = document.querySelectorAll(".preset-btn");

function padTime(value) {
  return String(value).padStart(2, "0");
}

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatDuration(ms, rounding = "ceil") {
  const round =
    rounding === "floor"
      ? Math.floor
      : rounding === "round"
        ? Math.round
        : Math.ceil;
  const totalSeconds = Math.max(0, round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function getInputDuration() {
  const hours = clampValue(Number(hoursInput.value) || 0, 0, 99);
  const minutes = clampValue(Number(minutesInput.value) || 0, 0, 59);
  const seconds = clampValue(Number(secondsInput.value) || 0, 0, 59);

  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}

function setInputsFromDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursInput.value = hours;
  minutesInput.value = minutes;
  secondsInput.value = seconds;
}

function saveTimerState() {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerState));
}

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function playAlarmSound() {
  const context = ensureAudioContext();

  if (!context) {
    return;
  }

  const pattern = [
    { offset: 0, frequency: 880, duration: 0.18 },
    { offset: 0.24, frequency: 740, duration: 0.18 },
    { offset: 0.48, frequency: 880, duration: 0.28 },
  ];
  const startAt = context.currentTime + 0.05;

  pattern.forEach((tone) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(tone.frequency, startAt + tone.offset);

    gainNode.gain.setValueAtTime(0.0001, startAt + tone.offset);
    gainNode.gain.exponentialRampToValueAtTime(0.18, startAt + tone.offset + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      startAt + tone.offset + tone.duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(startAt + tone.offset);
    oscillator.stop(startAt + tone.offset + tone.duration + 0.02);
  });
}

function clearTimerInterval() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function setTimerInputsDisabled(disabled) {
  [hoursInput, minutesInput, secondsInput].forEach((input) => {
    input.disabled = disabled;
  });

  presetButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function hasPendingInputChange() {
  return getInputDuration() !== timerState.totalDuration;
}

function getElapsedTime() {
  return Math.max(0, timerState.totalDuration - timerState.remainingTime);
}

function syncRunningTimer() {
  if (!timerState.isRunning || !timerState.endTimestamp) {
    return;
  }

  timerState.remainingTime = Math.max(0, timerState.endTimestamp - Date.now());

  if (timerState.remainingTime === 0) {
    finishTimer();
  }
}

function setStatusVisual(stateClass) {
  timerStatus.classList.remove("is-running", "is-paused", "is-finished");
  statusLabel.classList.remove("is-running", "is-paused", "is-finished");

  if (stateClass) {
    timerStatus.classList.add(stateClass);
    statusLabel.classList.add(stateClass);
  }
}

function renderTimer() {
  if (timerState.isRunning) {
    syncRunningTimer();
  }

  const elapsedTime = getElapsedTime();
  const draftDuration = getInputDuration();
  const pendingInputChange = hasPendingInputChange();

  timerDisplay.textContent = formatDuration(timerState.remainingTime);
  configuredTime.textContent = formatDuration(timerState.totalDuration);
  setTimerInputsDisabled(timerState.isRunning);
  applyBtn.disabled = timerState.isRunning || draftDuration <= 0 || !pendingInputChange;

  if (timerState.isRunning) {
    timerStatus.textContent = `Tempo decorrido: ${formatDuration(elapsedTime, "floor")}`;
    statusLabel.textContent = "Em andamento";
    timerNote.textContent = "O temporizador está rodando. Pause para fazer ajustes.";
    startPauseBtn.textContent = "Pausar";
    resetBtn.disabled = false;
    setStatusVisual("is-running");
  } else if (timerState.status === "paused") {
    timerStatus.textContent = `Tempo decorrido: ${formatDuration(elapsedTime, "floor")}`;
    statusLabel.textContent = "Pausado";
    timerNote.textContent = pendingInputChange
      ? "Há um novo tempo preenchido. Clique em Aplicar para trocar a duração ou em Continuar para retomar a contagem atual."
      : "Clique em Continuar para retomar de onde parou.";
    startPauseBtn.textContent = "Continuar";
    resetBtn.disabled = false;
    setStatusVisual("is-paused");
  } else if (timerState.status === "finished") {
    timerStatus.textContent = "Tempo encerrado";
    statusLabel.textContent = "Concluído";
    timerNote.textContent = pendingInputChange
      ? "Há um novo tempo preenchido. Clique em Aplicar para preparar a próxima contagem."
      : "O tempo acabou. Clique em Iniciar para repetir a mesma duração ou em Redefinir para voltar ao início.";
    startPauseBtn.textContent = "Iniciar";
    resetBtn.disabled = timerState.totalDuration <= 0;
    setStatusVisual("is-finished");
  } else if (timerState.status === "empty") {
    timerStatus.textContent = pendingInputChange
      ? `Novo tempo preenchido: ${formatDuration(draftDuration)}`
      : "Defina um tempo para começar";
    statusLabel.textContent = pendingInputChange ? "Pendente" : "Aguardando";
    timerNote.textContent = pendingInputChange
      ? "Clique em Aplicar para salvar essa duração ou em Iniciar para aplicar e começar."
      : "Escolha uma duração maior que zero para iniciar.";
    startPauseBtn.textContent = "Iniciar";
    resetBtn.disabled = true;
    setStatusVisual("");
  } else {
    timerStatus.textContent = pendingInputChange
      ? `Novo tempo preenchido: ${formatDuration(draftDuration)}`
      : "Pronto para iniciar";
    statusLabel.textContent = pendingInputChange ? "Pendente" : "Parado";
    timerNote.textContent = pendingInputChange
      ? "Clique em Aplicar para atualizar o temporizador sem iniciar, ou em Iniciar para aplicar e começar."
      : "Ajuste a duração e use Aplicar para definir uma nova contagem.";
    startPauseBtn.textContent = "Iniciar";
    resetBtn.disabled = timerState.totalDuration <= 0;
    setStatusVisual("");
  }

  if (timerState.isRunning) {
    startPauseBtn.disabled = false;
    return;
  }

  if (timerState.status === "paused") {
    startPauseBtn.disabled = timerState.remainingTime <= 0;
    return;
  }

  if (pendingInputChange) {
    startPauseBtn.disabled = draftDuration <= 0;
    return;
  }

  startPauseBtn.disabled =
    timerState.remainingTime <= 0 && timerState.totalDuration <= 0;
}

function syncTimerWithInputs() {
  timerState.totalDuration = getInputDuration();
  timerState.remainingTime = timerState.totalDuration;
  timerState.endTimestamp = null;
  timerState.isRunning = false;
  timerState.status = timerState.totalDuration > 0 ? "idle" : "empty";
  clearTimerInterval();
  saveTimerState();
  renderTimer();
}

function applyNewDuration() {
  syncTimerWithInputs();
}

function startTimerLoop() {
  if (timerInterval) {
    return;
  }

  timerInterval = setInterval(() => {
    syncRunningTimer();
    renderTimer();
  }, 250);
}

function startOrPauseTimer() {
  if (timerState.isRunning) {
    timerState.remainingTime = Math.max(0, timerState.endTimestamp - Date.now());
    timerState.endTimestamp = null;
    timerState.isRunning = false;
    timerState.status = timerState.remainingTime > 0 ? "paused" : "finished";
    clearTimerInterval();
    saveTimerState();
    renderTimer();
    return;
  }

  if (timerState.status !== "paused" && hasPendingInputChange()) {
    syncTimerWithInputs();
  } else if (
    timerState.status === "empty" ||
    timerState.status === "finished"
  ) {
    syncTimerWithInputs();
  }

  if (timerState.remainingTime <= 0) {
    return;
  }

  ensureAudioContext();
  timerState.endTimestamp = Date.now() + timerState.remainingTime;
  timerState.isRunning = true;
  timerState.status = "running";
  saveTimerState();
  renderTimer();
  startTimerLoop();
}

function resetTimer() {
  clearTimerInterval();
  timerState.remainingTime = timerState.totalDuration;
  timerState.endTimestamp = null;
  timerState.isRunning = false;
  timerState.status = timerState.totalDuration > 0 ? "idle" : "empty";
  setInputsFromDuration(timerState.totalDuration);
  saveTimerState();
  renderTimer();
}

function finishTimer(shouldPlayAlarm = true) {
  clearTimerInterval();
  timerState.remainingTime = 0;
  timerState.endTimestamp = null;
  timerState.isRunning = false;
  timerState.status = "finished";
  saveTimerState();

  if (shouldPlayAlarm) {
    playAlarmSound();
  }

  renderTimer();
}

function handleInputChange() {
  hoursInput.value = clampValue(Number(hoursInput.value) || 0, 0, 99);
  minutesInput.value = clampValue(Number(minutesInput.value) || 0, 0, 59);
  secondsInput.value = clampValue(Number(secondsInput.value) || 0, 0, 59);

  renderTimer();
}

function applyPreset(minutes) {
  setInputsFromDuration(minutes * 60 * 1000);
  renderTimer();
}

function loadTimerState() {
  const savedState = localStorage.getItem(TIMER_STORAGE_KEY);

  if (!savedState) {
    setInputsFromDuration(DEFAULT_TIMER_DURATION);
    syncTimerWithInputs();
    return;
  }

  try {
    const parsedState = JSON.parse(savedState);
    const savedTotalDuration = Number(parsedState.totalDuration);
    const savedRemainingTime = Number(parsedState.remainingTime);

    timerState = {
      totalDuration: Number.isFinite(savedTotalDuration)
        ? savedTotalDuration
        : DEFAULT_TIMER_DURATION,
      remainingTime: Number.isFinite(savedRemainingTime)
        ? savedRemainingTime
        : DEFAULT_TIMER_DURATION,
      endTimestamp: parsedState.endTimestamp || null,
      isRunning: Boolean(parsedState.isRunning),
      status: parsedState.status || "idle",
    };

    setInputsFromDuration(timerState.totalDuration);

    if (timerState.isRunning && timerState.endTimestamp) {
      timerState.remainingTime = Math.max(0, timerState.endTimestamp - Date.now());

      if (timerState.remainingTime === 0) {
        finishTimer(false);
        return;
      } else {
        timerState.status = "running";
        startTimerLoop();
      }
    }

    if (!timerState.isRunning && timerState.remainingTime <= 0) {
      timerState.status = timerState.totalDuration > 0 ? "finished" : "empty";
    }

    renderTimer();
  } catch (error) {
    setInputsFromDuration(DEFAULT_TIMER_DURATION);
    syncTimerWithInputs();
  }
}

startPauseBtn.addEventListener("click", startOrPauseTimer);
applyBtn.addEventListener("click", applyNewDuration);
resetBtn.addEventListener("click", resetTimer);

[hoursInput, minutesInput, secondsInput].forEach((input) => {
  input.addEventListener("input", handleInputChange);
  input.addEventListener("change", handleInputChange);
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(Number(button.dataset.minutes));
  });
});

loadTimerState();
