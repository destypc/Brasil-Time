/**
 * Classe para gerenciar o relógio digital
 */

class Clock {
  constructor(config = {}) {
    this.timeZone = config.timeZone || "America/Sao_Paulo";
    this.updateInterval = config.updateInterval || 1000;
    this.intervalId = null;

    this.timeElement = document.getElementById(
      config.timeElementId || "resultado",
    );
    this.dateElement = document.getElementById(
      config.dateElementId || "data-completa",
    );
    this.timezoneElement = document.getElementById(
      config.timezoneElementId || "timezone-value",
    );

    if (!this.timeElement) {
      throw new Error("Elemento de tempo não encontrado");
    }

    this.setupFormatters();
    this.start();
  }

  setupFormatters() {
    this.timeFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: this.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    this.dateFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: this.timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    this.zoneFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: this.timeZone,
      timeZoneName: "short",
    });
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  updateTime() {
    try {
      const now = new Date();
      this.timeElement.textContent = this.timeFormatter.format(now);

      if (this.dateElement) {
        this.dateElement.textContent = this.capitalizeFirstLetter(
          this.dateFormatter.format(now),
        );
      }

      if (this.timezoneElement) {
        const zoneParts = this.zoneFormatter.formatToParts(now);
        const zoneName = zoneParts.find((part) => part.type === "timeZoneName");
        this.timezoneElement.textContent = zoneName?.value || this.timeZone;
      }
    } catch (error) {
      console.error("Erro ao atualizar relógio:", error);
    }
  }

  start() {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), this.updateInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  destroy() {
    this.stop();
  }
}

// Inicializar relógio quando a página estiver pronta
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      new Clock();
    } catch (error) {
      console.error("Erro ao inicializar relógio:", error);
    }
  });
} else {
  try {
    new Clock();
  } catch (error) {
    console.error("Erro ao inicializar relógio:", error);
  }
}
