/**
 * Módulo de tema global
 * Gerencia o tema light/dark compartilhado entre todas as páginas
 */

const THEME_STORAGE_KEY = "brasilTimeTheme";

class ThemeManager {
  constructor() {
    this.themeToggleBtn = document.getElementById("themeToggleBtn");
    this.init();
  }

  getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
    } catch (error) {
      console.warn("Erro ao recuperar tema do localStorage:", error);
    }
    return "light";
  }

  applyTheme(theme) {
    try {
      const resolvedTheme = theme === "dark" ? "dark" : "light";
      const isDarkTheme = resolvedTheme === "dark";

      document.documentElement.dataset.theme = resolvedTheme;

      if (!this.themeToggleBtn) return;

      this.themeToggleBtn.setAttribute("aria-pressed", String(isDarkTheme));
      const label = isDarkTheme ? "Ativar tema claro" : "Ativar tema escuro";
      this.themeToggleBtn.setAttribute("aria-label", label);
      this.themeToggleBtn.setAttribute("title", label);
    } catch (error) {
      console.error("Erro ao aplicar tema:", error);
    }
  }

  toggleTheme() {
    try {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      this.applyTheme(nextTheme);
    } catch (error) {
      console.error("Erro ao alternar tema:", error);
    }
  }

  detectSystemPreference() {
    try {
      // Verifica a preferência do sistema operacional
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch (error) {
      console.warn("Erro ao detectar preferência do sistema:", error);
    }
    return "light";
  }

  setupStorageListener() {
    try {
      // Sincroniza tema entre abas diferentes
      window.addEventListener("storage", (event) => {
        if (event.key === THEME_STORAGE_KEY && event.newValue) {
          this.applyTheme(event.newValue);
        }
      });
    } catch (error) {
      console.error("Erro ao configurar listener de storage:", error);
    }
  }

  setupSystemPreferenceListener() {
    try {
      // Monitora mudanças de preferência do sistema em tempo real
      if (window.matchMedia) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (e) => {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            // Só aplicar automático se não tiver tema salvo pelo usuário
            if (!savedTheme) {
              const newTheme = e.matches ? "dark" : "light";
              this.applyTheme(newTheme);
            }
          });
      }
    } catch (error) {
      console.warn(
        "Erro ao configurar listener de preferência do sistema:",
        error,
      );
    }
  }

  init() {
    // Tentar usar tema salvo, depois preferência do sistema
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const themeToApply = savedTheme || this.detectSystemPreference();

    this.applyTheme(themeToApply);

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Adicionar sincronização entre abas e detectar mudanças do SO
    this.setupStorageListener();
    this.setupSystemPreferenceListener();
  }
}

// Inicializar tema quando a página estiver pronta
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}
