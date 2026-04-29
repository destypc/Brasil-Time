const HOLIDAY_TIME_ZONE = "America/Sao_Paulo";
const OFFICIAL_CALENDAR_URL_2026 =
  "https://www.gov.br/gestao/pt-br/assuntos/noticias/2025/dezembro/confira-o-calendario-oficial-de-feriados-nacionais-e-pontos-facultativos-em-2026";

const holidayList = document.getElementById("holidayList");
const holidayYear = document.getElementById("holidayYear");
const holidayVisibleCount = document.getElementById("holidayVisibleCount");
const pastHolidayCount = document.getElementById("pastHolidayCount");
const nextHolidayLabel = document.getElementById("nextHolidayLabel");
const holidaysTitle = document.getElementById("holidaysTitle");
const holidaysDescription = document.getElementById("holidaysDescription");
const holidaysUpdated = document.getElementById("holidaysUpdated");
const holidayFilters = document.getElementById("holidayFilters");

const FILTER_OPTIONS = [
  { key: "all", label: "Todos" },
  { key: "national", label: "Nacionais" },
  { key: "optional", label: "Facultativos" },
  { key: "partial", label: "Parciais" },
];

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeZone: HOLIDAY_TIME_ZONE,
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: HOLIDAY_TIME_ZONE,
});

const metricDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: HOLIDAY_TIME_ZONE,
});

const datePartsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: HOLIDAY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

let activeFilterKey = "all";

function capitalizeText(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function createDate(year, monthIndex, day) {
  return new Date(Date.UTC(year, monthIndex, day, 12, 0, 0));
}

function createFixedDateFactory(monthIndex, day) {
  return (year) => createDate(year, monthIndex, day);
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
}

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return createDate(year, month - 1, day);
}

function getTodayInBrazil() {
  const now = new Date();
  const parts = datePartsFormatter.formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return createDate(year, month - 1, day);
}

function getDayDifference(targetDate, referenceDate) {
  const utcTarget = Date.UTC(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate(),
  );
  const utcReference = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );

  return Math.round((utcTarget - utcReference) / 86400000);
}

const HOLIDAY_DEFINITIONS = [
  {
    id: "new-year",
    name: "Confraterniza\u00E7\u00E3o Universal",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Ano-novo civil",
    getDate: createFixedDateFactory(0, 1),
    sourceUrl: "https://pt.wikipedia.org/wiki/Ano-novo",
  },
  {
    id: "carnival-monday",
    name: "Carnaval",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Segunda-feira de Carnaval",
    getDate: (year) => addDays(getEasterDate(year), -48),
    sourceUrl: "https://pt.wikipedia.org/wiki/Carnaval",
  },
  {
    id: "carnival-tuesday",
    name: "Carnaval",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Ter\u00E7a-feira de Carnaval",
    getDate: (year) => addDays(getEasterDate(year), -47),
    sourceUrl: "https://pt.wikipedia.org/wiki/Carnaval",
  },
  {
    id: "ash-wednesday",
    name: "Quarta-feira de Cinzas",
    filterKey: "partial",
    typeLabel: "Ponto facultativo parcial",
    detail: "At\u00E9 as 14h",
    getDate: (year) => addDays(getEasterDate(year), -46),
    sourceUrl: "https://pt.wikipedia.org/wiki/Quarta-feira_de_Cinzas",
  },
  {
    id: "good-friday",
    name: "Paix\u00E3o de Cristo",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Sexta-feira Santa",
    getDate: (year) => addDays(getEasterDate(year), -2),
    sourceUrl: "https://pt.wikipedia.org/wiki/Sexta-feira_Santa",
  },
  {
    id: "april-20",
    name: "Ponto facultativo de 20 de abril",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Data extra prevista na portaria oficial de 2026",
    getDate: (year) => (year === 2026 ? createDate(year, 3, 20) : null),
    sourceUrl: OFFICIAL_CALENDAR_URL_2026,
  },
  {
    id: "tiradentes",
    name: "Tiradentes",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Mem\u00F3ria de Joaquim Jos\u00E9 da Silva Xavier",
    getDate: createFixedDateFactory(3, 21),
    sourceUrl: "https://pt.wikipedia.org/wiki/Tiradentes",
  },
  {
    id: "labor-day",
    name: "Dia do Trabalho",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Dia Mundial do Trabalho",
    getDate: createFixedDateFactory(4, 1),
    sourceUrl: "https://pt.wikipedia.org/wiki/Dia_do_Trabalhador",
  },
  {
    id: "corpus-christi",
    name: "Corpus Christi",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Quinta-feira ap\u00F3s a Sant\u00EDssima Trindade",
    getDate: (year) => addDays(getEasterDate(year), 60),
    sourceUrl: "https://pt.wikipedia.org/wiki/Corpus_Christi",
  },
  {
    id: "june-5",
    name: "Ponto facultativo de 5 de junho",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Data extra prevista na portaria oficial de 2026",
    getDate: (year) => (year === 2026 ? createDate(year, 5, 5) : null),
    sourceUrl: OFFICIAL_CALENDAR_URL_2026,
  },
  {
    id: "independence",
    name: "Independ\u00EAncia do Brasil",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Celebra\u00E7\u00E3o do 7 de Setembro",
    getDate: createFixedDateFactory(8, 7),
    sourceUrl: "https://pt.wikipedia.org/wiki/Independ%C3%AAncia_do_Brasil",
  },
  {
    id: "our-lady-aparecida",
    name: "Nossa Senhora Aparecida",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Padroeira do Brasil",
    getDate: createFixedDateFactory(9, 12),
    sourceUrl: "https://pt.wikipedia.org/wiki/Nossa_Senhora_Aparecida",
  },
  {
    id: "public-servant",
    name: "Dia do Servidor P\u00FAblico",
    filterKey: "optional",
    typeLabel: "Ponto facultativo",
    detail: "Observado pela administra\u00E7\u00E3o p\u00FAblica federal",
    getDate: createFixedDateFactory(9, 28),
    sourceUrl: OFFICIAL_CALENDAR_URL_2026,
  },
  {
    id: "finados",
    name: "Finados",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Dia dos Fi\u00E9is Defuntos",
    getDate: createFixedDateFactory(10, 2),
    sourceUrl: "https://pt.wikipedia.org/wiki/Dia_dos_Fi%C3%A9is_Defuntos",
  },
  {
    id: "republic-proclamation",
    name: "Proclama\u00E7\u00E3o da Rep\u00FAblica",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Celebra\u00E7\u00E3o do 15 de Novembro",
    getDate: createFixedDateFactory(10, 15),
    sourceUrl:
      "https://pt.wikipedia.org/wiki/Proclama%C3%A7%C3%A3o_da_Rep%C3%BAblica_do_Brasil",
  },
  {
    id: "black-awareness",
    name: "Dia Nacional de Zumbi e da Consci\u00EAncia Negra",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Feriado nacional desde 2023",
    getDate: createFixedDateFactory(10, 20),
    sourceUrl:
      "https://pt.wikipedia.org/wiki/Dia_Nacional_de_Zumbi_e_da_Consci%C3%AAncia_Negra",
  },
  {
    id: "christmas-eve",
    name: "V\u00E9spera de Natal",
    filterKey: "partial",
    typeLabel: "Ponto facultativo parcial",
    detail: "Ap\u00F3s as 13h",
    getDate: createFixedDateFactory(11, 24),
    sourceUrl: OFFICIAL_CALENDAR_URL_2026,
  },
  {
    id: "christmas",
    name: "Natal",
    filterKey: "national",
    typeLabel: "Feriado nacional",
    detail: "Celebra\u00E7\u00E3o de Natal",
    getDate: createFixedDateFactory(11, 25),
    sourceUrl: "https://pt.wikipedia.org/wiki/Natal",
  },
  {
    id: "new-years-eve",
    name: "V\u00E9spera de Ano Novo",
    filterKey: "partial",
    typeLabel: "Ponto facultativo parcial",
    detail: "Ap\u00F3s as 13h",
    getDate: createFixedDateFactory(11, 31),
    sourceUrl: OFFICIAL_CALENDAR_URL_2026,
  },
];

const holidayDefinitionById = new Map(
  HOLIDAY_DEFINITIONS.map((definition) => [definition.id, definition]),
);

function buildHoliday(definition, year) {
  const date = definition.getDate(year);

  if (!date) {
    return null;
  }

  return {
    ...definition,
    date,
    year,
  };
}

function getBrazilHolidayCalendar(year) {
  return HOLIDAY_DEFINITIONS.map((definition) => buildHoliday(definition, year))
    .filter(Boolean)
    .sort((firstHoliday, secondHoliday) => firstHoliday.date - secondHoliday.date);
}

function filterHolidays(holidays, filterKey) {
  if (filterKey === "all") {
    return holidays;
  }

  return holidays.filter((holiday) => holiday.filterKey === filterKey);
}

function getFilterCount(holidays, filterKey) {
  return filterHolidays(holidays, filterKey).length;
}

function getRelativeStatus(diffDays) {
  if (diffDays === 0) {
    return { text: "\u00C9 hoje", className: "is-today" };
  }

  if (diffDays > 0) {
    return {
      text: `Faltam ${diffDays} dia${diffDays === 1 ? "" : "s"}`,
      className: "is-future",
    };
  }

  const elapsedDays = Math.abs(diffDays);
  return {
    text: `Passou h\u00E1 ${elapsedDays} dia${elapsedDays === 1 ? "" : "s"}`,
    className: "is-past",
  };
}

function getAdjacentOccurrences(holiday, today) {
  const diffDays = getDayDifference(holiday.date, today);
  const definition = holidayDefinitionById.get(holiday.id);

  if (diffDays === 0) {
    return {
      previousOccurrence: holiday,
      nextOccurrence: holiday,
    };
  }

  if (diffDays > 0) {
    return {
      previousOccurrence: buildHoliday(definition, holiday.year - 1),
      nextOccurrence: holiday,
    };
  }

  return {
    previousOccurrence: holiday,
    nextOccurrence: buildHoliday(definition, holiday.year + 1),
  };
}

function formatOccurrenceValue(occurrence, today, direction) {
  if (!occurrence) {
    return direction === "past"
      ? "Sem data oficial anterior"
      : "Sem data oficial futura";
  }

  const diffDays = Math.abs(getDayDifference(occurrence.date, today));

  if (diffDays === 0) {
    return "\u00C9 hoje";
  }

  if (direction === "past") {
    return `H\u00E1 ${diffDays} dia${diffDays === 1 ? "" : "s"}`;
  }

  return `Faltam ${diffDays} dia${diffDays === 1 ? "" : "s"}`;
}

function formatOccurrenceDate(occurrence) {
  return occurrence ? capitalizeText(metricDateFormatter.format(occurrence.date)) : "";
}

function createHolidayCard(holiday, today) {
  const diffDays = getDayDifference(holiday.date, today);
  const relative = getRelativeStatus(diffDays);
  const { previousOccurrence, nextOccurrence } = getAdjacentOccurrences(
    holiday,
    today,
  );
  const holidayCard = document.createElement("article");
  const previousValue = formatOccurrenceValue(previousOccurrence, today, "past");
  const nextValue = formatOccurrenceValue(nextOccurrence, today, "future");
  const previousDate = formatOccurrenceDate(previousOccurrence);
  const nextDate = formatOccurrenceDate(nextOccurrence);
  const sourceButtonLabel = holiday.sourceUrl === OFFICIAL_CALENDAR_URL_2026
    ? "Ver calend\u00E1rio oficial"
    : "Saber mais";

  holidayCard.className = "holiday-card";
  holidayCard.innerHTML = `
    <div class="holiday-top">
      <div class="holiday-heading">
        <span class="holiday-type">${holiday.typeLabel}</span>
        <h3 class="holiday-name">${holiday.name}</h3>
        <p class="holiday-note">${holiday.detail}</p>
      </div>
      <span class="holiday-status ${relative.className}">${relative.text}</span>
    </div>
    <p class="holiday-date">${capitalizeText(dateFormatter.format(holiday.date))}</p>
    <div class="holiday-metrics">
      <div class="holiday-metric">
        <span class="holiday-metric-label">Desde a \u00FAltima vez</span>
        <strong class="holiday-metric-value">${previousValue}</strong>
        ${
          previousDate
            ? `<span class="holiday-metric-date">${previousDate}</span>`
            : ""
        }
      </div>
      <div class="holiday-metric">
        <span class="holiday-metric-label">At\u00E9 a pr\u00F3xima</span>
        <strong class="holiday-metric-value">${nextValue}</strong>
        ${nextDate ? `<span class="holiday-metric-date">${nextDate}</span>` : ""}
      </div>
    </div>
    <div class="holiday-actions">
      <a
        class="btn btn-secondary holiday-link"
        href="${holiday.sourceUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${sourceButtonLabel}
      </a>
    </div>
  `;

  return holidayCard;
}

function renderFilterButtons(holidays) {
  holidayFilters.innerHTML = "";

  FILTER_OPTIONS.forEach((filterOption) => {
    const button = document.createElement("button");
    const filterCount = getFilterCount(holidays, filterOption.key);
    const isActive = filterOption.key === activeFilterKey;

    button.type = "button";
    button.className = `holiday-filter-btn${isActive ? " is-active" : ""}`;
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `
      <span>${filterOption.label}</span>
      <span class="holiday-filter-count">${filterCount}</span>
    `;

    button.addEventListener("click", () => {
      activeFilterKey = filterOption.key;
      renderHolidays();
    });

    holidayFilters.appendChild(button);
  });
}

function updateHolidayTexts(currentYear) {
  holidaysTitle.textContent = `Feriados e pontos facultativos do Brasil em ${currentYear}`;

  if (currentYear === 2026) {
    holidaysDescription.textContent =
      "Calend\u00E1rio oficial federal de 2026 com feriados nacionais, pontos facultativos e datas parciais. Feriados estaduais e municipais variam conforme a localidade.";
    return;
  }

  holidaysDescription.textContent =
    "Calend\u00E1rio nacional com feriados fixos, datas m\u00F3veis e pontos facultativos recorrentes. Emendas administrativas extras dependem da portaria oficial de cada ano.";
}

function renderEmptyState() {
  holidayList.innerHTML = `
      <div class="holiday-empty">
      Nenhuma data encontrada para esse filtro no calend\u00E1rio atual.
    </div>
  `;
}

function renderHolidays() {
  const today = getTodayInBrazil();
  const currentYear = today.getUTCFullYear();
  const holidays = getBrazilHolidayCalendar(currentYear);
  const visibleHolidays = filterHolidays(holidays, activeFilterKey);
  const pastHolidays = visibleHolidays.filter(
    (holiday) => getDayDifference(holiday.date, today) < 0,
  );
  const nextHoliday = visibleHolidays.find(
    (holiday) => getDayDifference(holiday.date, today) >= 0,
  );

  updateHolidayTexts(currentYear);
  renderFilterButtons(holidays);

  holidaysUpdated.textContent = `Hoje em Bras\u00EDlia: ${capitalizeText(dateFormatter.format(today))}`;
  holidayYear.textContent = String(currentYear);
  holidayVisibleCount.textContent = String(visibleHolidays.length);
  pastHolidayCount.textContent = String(pastHolidays.length);
  nextHolidayLabel.textContent = nextHoliday
    ? `${capitalizeText(shortDateFormatter.format(nextHoliday.date))} - ${nextHoliday.name}`
    : "Nenhuma restante neste filtro";

  holidayList.innerHTML = "";

  if (!visibleHolidays.length) {
    renderEmptyState();
    return;
  }

  visibleHolidays.forEach((holiday) => {
    holidayList.appendChild(createHolidayCard(holiday, today));
  });
}

renderHolidays();
