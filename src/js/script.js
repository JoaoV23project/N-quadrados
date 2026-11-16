const THEME_KEY = "chessmath-theme";

function aplicarTema(tema) {
    document.documentElement.dataset.theme = tema;

    const botao = document.getElementById("theme-toggle");
    const temaClaroAtivo = tema === "light";

    botao.setAttribute("aria-pressed", String(tema === "dark"));
    botao.setAttribute(
        "aria-label",
        temaClaroAtivo ? "Ativar modo escuro" : "Ativar modo claro"
    );
    botao.querySelector(".theme-icon").textContent = temaClaroAtivo ? "☾" : "☼";
    botao.querySelector(".theme-label").textContent =
        temaClaroAtivo ? "Modo escuro" : "Modo claro";

    try {
        localStorage.setItem(THEME_KEY, tema);
    } catch (erro) {
        // O tema continua funcionando mesmo se o armazenamento estiver bloqueado.
    }
}

function atualizarTabuleiro() {
    const campo = document.getElementById("numero");
    const board = document.getElementById("board");
    const placeholder = document.getElementById("board-placeholder");
    const overlay = document.getElementById("board-overlay");
    const dimensao = document.getElementById("board-dimension");
    const legenda = document.getElementById("board-caption");

    const n = Number.parseInt(campo.value, 10);

    if (!Number.isInteger(n) || n < 1) {
        board.hidden = true;
        overlay.hidden = true;
        placeholder.hidden = false;
        dimensao.textContent = "— × —";
        legenda.textContent = "A prévia aparecerá aqui.";
        return;
    }

    // Para entradas acima de 8, a prévia é limitada a um tabuleiro 8 × 8.
    const tamanhoVisual = Math.min(n, 8);
    board.replaceChildren();
    board.style.setProperty("--board-size", tamanhoVisual);
    board.setAttribute(
        "aria-label",
        `Tabuleiro de ${tamanhoVisual} por ${tamanhoVisual}${n > 8 ? ", representação limitada" : ""}`
    );

    for (let linha = 0; linha < tamanhoVisual; linha++) {
        for (let coluna = 0; coluna < tamanhoVisual; coluna++) {
            const casa = document.createElement("span");
            casa.className = (linha + coluna) % 2 === 0 ? "square square-light" : "square square-dark";
            casa.setAttribute("aria-hidden", "true");
            board.appendChild(casa);
        }
    }

    placeholder.hidden = true;
    board.hidden = false;
    overlay.hidden = n <= 8;
    dimensao.textContent = n > 8 ? "8 × 8" : `${n} × ${n}`;
    legenda.textContent = n > 8
        ? `Prévia limitada a 8 × 8 para representar o tabuleiro ${n} × ${n}.`
        : `Representação de um tabuleiro ${n} × ${n}.`;
}

function calcular(event) {
    if (event) event.preventDefault();

    const campo = document.getElementById("numero");
    const n = Number(campo.value);

    if (!Number.isInteger(n) || n < 1) {
        campo.focus();
        return;
    }

    const res = n * (n + 1) * (2 * n + 1) / 6;
    const corpo = document.getElementById("corpo");

    corpo.innerHTML = `
        <div id="resultado" class="result-card">
            <span class="result-label">TOTAL DE QUADRADOS</span>
            <strong>${res.toLocaleString("pt-BR")}</strong>
            <span class="result-detail">em um tabuleiro ${n} × ${n}</span>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoTema = document.getElementById("theme-toggle");
    const formulario = document.getElementById("calculator-form");
    const campo = document.getElementById("numero");

    // O modo escuro é o padrão; uma escolha anterior é respeitada.
    let temaInicial = "dark";
    try {
        const temaSalvo = localStorage.getItem(THEME_KEY);
        if (temaSalvo === "light" || temaSalvo === "dark") temaInicial = temaSalvo;
    } catch (erro) {
        // Mantém o padrão escuro.
    }
    aplicarTema(temaInicial);

    botaoTema.addEventListener("click", () => {
        const novoTema = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        aplicarTema(novoTema);
    });

    campo.addEventListener("input", atualizarTabuleiro);
    formulario.addEventListener("submit", calcular);
    atualizarTabuleiro();
});
