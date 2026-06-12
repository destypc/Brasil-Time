<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:3b82f6&height=220&section=header&text=Brasil%20Time&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Sempre%20no%20hor%C3%A1rio%20de%20Bras%C3%ADlia&descAlignY=60&descSize=20&descAlignX=50" width="100%" />

<a href="https://github.com/destypc/Brasil-Time">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=26&duration=2800&pause=800&color=3B82F6&center=true&vCenter=true&width=720&height=70&lines=A+hora+oficial+de+Bras%C3%ADlia+%E2%8F%B0;Cron%C3%B4metro+de+alta+precis%C3%A3o;Temporizador+com+contagem+regressiva;Feriados+nacionais+brasileiros" alt="Typing SVG" />
</a>




[![HTML5](https://img.shields.io/badge/HTML5-2563EB?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1D4ED8?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-1E40AF?style=for-the-badge&logo=javascript&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Hospedado%20no-GitHub%20Pages-1E3A8A?style=for-the-badge&logo=github&logoColor=white)](https://destypc.github.io/Brasil-Time/)




### 🌐 [**ACESSAR A DEMO AO VIVO**](https://destypc.github.io/Brasil-Time/)

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:1e3a8a,100:3b82f6&height=3&section=header" width="100%" />

## 📖 Sobre o projeto

**Brasil Time** é uma aplicação web leve e responsiva construída inteiramente em tecnologias nativas do navegador — sem frameworks nem dependências externas. O foco é entregar uma experiência rápida, precisa e elegante para quem precisa acompanhar o horário oficial de Brasília (BRT) e ferramentas de tempo do dia a dia.

Toda a lógica roda no lado do cliente, o que torna o projeto leve, instantâneo no carregamento e **hospedado gratuitamente via GitHub Pages**.

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| 🕐 **Relógio digital** | Hora atual no fuso de Brasília (BRT), atualizada em tempo real. |
| ⏱️ **Cronômetro** | Contagem progressiva com precisão de centésimos de segundo — iniciar, pausar e zerar. |
| ⏳ **Temporizador** | Contagem regressiva configurável com alerta ao final. |
| 📅 **Feriados** | Consulta rápida aos feriados nacionais brasileiros. |
| 🌗 **Tema claro/escuro** | Alternância de tema com preferência salva no navegador. |
| 📱 **Responsivo** | Layout adaptável para desktop, tablet e celular. |

> **Nota:** o cronômetro é progressivo e o temporizador é regressivo, seguindo o uso convencional. Se a sua implementação inverter essa lógica, basta ajustar a tabela.

## 🖼️ Preview

<div align="center">

<!-- Substitua pelos seus screenshots ou GIFs reais (de preferência com o tema azul ativo) -->
<!-- ![Tela do relógio](docs/preview-relogio.png) -->

*Adicione aqui um GIF ou capturas de tela da aplicação em funcionamento.*

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:3b82f6,100:1e3a8a&height=3&section=header" width="100%" />

## 🚀 Começando

Por ser uma aplicação 100% estática, não há etapa de build nem instalação de pacotes.

### Acesso online

A versão publicada está disponível diretamente pelo GitHub Pages:

🔗 **https://destypc.github.io/Brasil-Time/**

### Execução local

Clone o repositório:

```bash
git clone https://github.com/destypc/Brasil-Time.git
cd Brasil-Time
```

Abra o `index.html` no navegador **ou** suba um servidor estático para evitar restrições de origem:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve
```

Depois acesse `http://localhost:8000` no navegador.

### Publicando no GitHub Pages

1. Vá em **Settings → Pages** no repositório.
2. Em **Source**, selecione a branch (`main`) e a pasta raiz (`/root`).
3. Salve — em alguns instantes o site estará no ar em `https://destypc.github.io/Brasil-Time/`.

## 🧭 Como usar

Navegue entre as seções pelo menu principal:

1. **Relógio** — exibe a hora atual de Brasília.
2. **Cronômetro** — mede o tempo decorrido com precisão de centésimos.
3. **Temporizador** — define uma contagem regressiva com alerta.
4. **Feriados** — lista os feriados nacionais brasileiros.

Use o botão de tema para alternar entre claro e escuro — a escolha é mantida na próxima visita.

## 📁 Estrutura do projeto

```
Brasil-Time/
├── index.html              # Página principal (Relógio)
├── paginas/
│   ├── stopwatch.html      # Cronômetro
│   ├── timer.html          # Temporizador
│   └── holidays.html       # Feriados
├── scripts/
│   ├── clock.js            # Lógica do relógio
│   ├── stopwatch.js        # Lógica do cronômetro
│   ├── timer.js            # Lógica do temporizador
│   ├── holidays.js         # Dados dos feriados
│   └── theme.js            # Gerenciamento de tema
├── estilos/
│   └── style.css           # Estilos da aplicação
└── README.md               # Este arquivo
```

## 🛠️ Tecnologias

- **HTML5** — estrutura semântica das páginas
- **CSS3** — estilização e layout responsivo com Flexbox
- **JavaScript (Vanilla)** — toda a lógica de tempo e interatividade
- **Web Storage API (`localStorage`)** — persistência da preferência de tema
- **GitHub Pages** — hospedagem estática gratuita
- **Sem dependências externas** — nenhum framework ou biblioteca de terceiros

## ⚙️ Detalhes técnicos

- **Fuso horário preciso:** a hora é formatada com a API `Intl.DateTimeFormat` usando o timezone `America/Sao_Paulo`, garantindo o horário correto de Brasília independentemente do fuso local do usuário.
- **Persistência de tema:** a preferência (claro/escuro) é salva no `localStorage` e reaplicada automaticamente a cada visita.
- **Layout responsivo:** construído com Flexbox para se adaptar a diferentes tamanhos de tela.
- **Carregamento instantâneo:** sem dependências externas, todo o conteúdo é servido de forma estática.

## 🗺️ Roadmap

- [ ] Suporte a múltiplos fusos horários brasileiros (AMT, ACT, FNT)
- [ ] Sons de alerta personalizáveis no temporizador
- [ ] Cálculo automático de feriados móveis (Carnaval, Páscoa, Corpus Christi)
- [ ] Exportação de marcações do cronômetro
- [ ] Progressive Web App (uso offline)

## 🤝 Contribuindo

Contribuições são bem-vindas! Para sugerir melhorias:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autores

**Enzinxz, Luizeh, Lumi e Erick**

[![GitHub](https://img.shields.io/badge/GitHub-@destypc-1E40AF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/destypc) 
[![GitHub](https://img.shields.io/badge/GitHub-@luizeh-1E40AF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/luizeh) 
[![GitHub](https://img.shields.io/badge/GitHub-@erick-1E40AF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/er1ck-xyz) 
[![GitHub](https://img.shields.io/badge/GitHub-@lumi-1E40AF?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lumivivos) 


<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,100:1e3a8a&height=120&section=footer&text=Sempre%20no%20hor%C3%A1rio%20de%20Bras%C3%ADlia%20%E2%8F%B0&fontSize=20&fontColor=ffffff&fontAlignY=75" width="100%" />