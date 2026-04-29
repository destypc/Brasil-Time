/**
 * Classe para gerenciar o cronômetro
 */

class Stopwatch {
  constructor(config = {}) {
    this.storageKey = config.storageKey || "stopwatch";
    this.updateInterval = config.updateInterval || 10;

    this.startPauseBtn = document.getElementById(
      config.startPauseBtnId || "startPauseBtn",
    );
    this.lapBtn = document.getElementById(config.lapBtnId || "lapBtn");
    this.resetBtn = document.getElementById(config.resetBtnId || "resetBtn");
    this.displayElement = document.getElementById(
      config.displayElementId || "stopwatch",
    );
    this.lapsList = document.getElementById(config.lapsListId || "lapsList");

    if (!this.displayElement) {
      throw new Error("Elemento de display não encontrado");
    }

    this.time = 0;
    this.isRunning = false;
    this.laps = [];
    this.intervalId = null;

    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.updateDisplay();
    this.renderLaps();
  }

  setupEventListeners() {
    if (this.startPauseBtn) {
      this.startPauseBtn.addEventListener("click", () => this.toggleStart());
    }
    if (this.lapBtn) {
      this.lapBtn.addEventListener("click", () => this.addLap());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.reset());
    }
  }

  formatTime(ms) {
    try {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const centiseconds = Math.floor((ms % 1000) / 10);

      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
    } catch (error) {
      console.error("Erro ao formatar tempo:", error);
      return "00:00.00";
    }
  }

  updateDisplay() {
    try {
      this.displayElement.textContent = this.formatTime(this.time);
    } catch (error) {
      console.error("Erro ao atualizar display:", error);
    }
  }

  toggleStart() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    try {
      if (this.isRunning) return;

      this.isRunning = true;
      const startTime = Date.now() - this.time;

      if (this.startPauseBtn) {
        this.startPauseBtn.textContent = "Pausar";
        this.startPauseBtn.classList.add("paused");
      }
      if (this.lapBtn) {
        this.lapBtn.disabled = false;
      }

      this.intervalId = setInterval(() => {
        this.time = Date.now() - startTime;
        this.updateDisplay();
      }, this.updateInterval);
    } catch (error) {
      console.error("Erro ao iniciar cronômetro:", error);
    }
  }

  pause() {
    try {
      this.isRunning = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      if (this.startPauseBtn) {
        this.startPauseBtn.textContent = "Continuar";
        this.startPauseBtn.classList.remove("paused");
      }
      if (this.resetBtn) {
        this.resetBtn.disabled = false;
      }

      this.saveData();
    } catch (error) {
      console.error("Erro ao pausar cronômetro:", error);
    }
  }

  addLap() {
    try {
      if (!this.isRunning) return;
      this.laps.push(this.time);
      this.renderLaps();
      this.saveData();
    } catch (error) {
      console.error("Erro ao adicionar volta:", error);
    }
  }

  reset() {
    try {
      this.time = 0;
      this.laps = [];
      this.isRunning = false;

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      this.updateDisplay();
      this.renderLaps();

      if (this.startPauseBtn) {
        this.startPauseBtn.textContent = "Iniciar";
        this.startPauseBtn.classList.remove("paused");
      }
      if (this.lapBtn) {
        this.lapBtn.disabled = true;
      }
      if (this.resetBtn) {
        this.resetBtn.disabled = true;
      }

      this.clearStorage();
    } catch (error) {
      console.error("Erro ao redefinir cronômetro:", error);
    }
  }

  renderLaps() {
    try {
      if (!this.lapsList) return;

      this.lapsList.innerHTML = "";

      if (this.laps.length === 0) return;

      const header = document.createElement("div");
      header.className = "laps-header";
      header.innerHTML = "<span>Volta</span><span>Tempo</span>";
      this.lapsList.appendChild(header);

      this.laps.forEach((lap, index) => {
        const lapTime = index === 0 ? lap : lap - this.laps[index - 1];
        const lapItem = document.createElement("div");
        lapItem.className = "lap-item";
        lapItem.innerHTML = `<span>#${index + 1}</span><span>${this.formatTime(lapTime)}</span>`;
        this.lapsList.appendChild(lapItem);
      });
    } catch (error) {
      console.error("Erro ao renderizar voltas:", error);
    }
  }

  saveData() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          time: this.time,
          laps: this.laps,
        }),
      );
    } catch (error) {
      console.warn("Erro ao salvar dados do cronômetro:", error);
    }
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this.time = data.time || 0;
        this.laps = data.laps || [];
      }
    } catch (error) {
      console.warn("Erro ao carregar dados do cronômetro:", error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn("Erro ao limpar armazenamento:", error);
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

// Inicializar cronômetro quando a página estiver pronta
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      new Stopwatch();
    } catch (error) {
      console.error("Erro ao inicializar cronômetro:", error);
    }
  });
} else {
  try {
    new Stopwatch();
  } catch (error) {
    console.error("Erro ao inicializar cronômetro:", error);
  }
}
