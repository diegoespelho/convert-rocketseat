// Obtendo os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");

// Objeto para armazenar as cotações atualizadas
let rates = {};

// Buscar cotações em tempo real
async function fetchRates() {
  try {
    const url =
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL";
    const response = await fetch(url);
    const data = await response.json();

    rates = {
      USD: Number(data.USDBRL.bid),
      EUR: Number(data.EURBRL.bid),
      GBP: Number(data.GBPBRL.bid),
    };

    console.log("Cotações atualizadas:", rates);
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);
    alert("Erro ao buscar cotações. Tente novamente mais tarde.");
  }
}

// Buscar as cotações ao carregar a página
fetchRates();

// Atualiza valores a cada 5 minutos (opcional)
setInterval(fetchRates, 5 * 60 * 1000);

// Manipulando o input amount para receber somente números
amount.addEventListener("input", () => {
  const hasCharactersRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharactersRegex, "");
});

// Capturando o evento de submit (enviar) do formulário
form.onsubmit = event => {
  event.preventDefault();

  if (!rates[currency.value]) {
    alert("As cotações ainda não foram carregadas. Tente novamente.");
    return;
  }

  convertCurrency(amount.value, rates[currency.value], currency.value);
};

// Função para conversão
function convertCurrency(amount, price, code) {
  try {
    const symbol = { USD: "US$", EUR: "€", GBP: "£" }[code];

    // Exibindo a cotação da moeda selecionada
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price)}`;

    // Calcula o total
    let total = amount * price;

    // Formatar o valor total
    total = formatCurrencyBRL(total).replace("R$", "");

    // Exibe resultado
    result.textContent = `${total} Reais`;

    footer.classList.add("show-result");
  } catch (error) {
    footer.classList.remove("show-result");
    console.log(error);
    alert("Não foi possível converter. Tente novamente mais tarde.");
  }
}

// Formata a moeda em Real Brasileiro
function formatCurrencyBRL(value) {
  // Converte para Number para utilizar o toLocaleString para formatar em BRL
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
