const scoreEl = document.querySelector("#score");
const cardsEl = document.querySelector("#cards");
const feedback1 = document.querySelector("#feedback1");
const uncertainty = document.querySelector("#uncertainty");
const creativeFeedback = document.querySelector("#creativeFeedback");

let score = 0;
let clueBonusGiven = new Set();

const items = [
  { text: "Tu amigo envió otro meme.", answer: 1, icon: "😂" },
  { text: "Mañana habrá clase a la hora habitual.", answer: 1, icon: "🎒" },
  { text: "Tu equipo desbloqueó una misión nueva.", answer: 2, icon: "🎮" },
  { text: "¡Ganaste el torneo sin saber que estabas en la final!", answer: 3, icon: "🏆" },
  { text: "¡Apareció un jefe secreto debajo del mapa!", answer: 3, icon: "👾" },
  { text: "La contraseña correcta empieza por la letra M.", answer: 2, icon: "🔐" }
];

const labels = ["", "Baja", "Media", "Alta"];

function setScore(value) {
  score = value;
  scoreEl.textContent = score;
}

function renderCards() {
  cardsEl.innerHTML = "";
  items.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "quiz-card";
    article.innerHTML = `
      <div class="icon" aria-hidden="true">${item.icon}</div>
      <div>
        <p>${item.text}</p>
        <label>
          Nivel de sorpresa
          <select data-index="${index}">
            <option value="0">Elige…</option>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
          </select>
        </label>
        <div class="result" data-result="${index}"></div>
      </div>
    `;
    cardsEl.appendChild(article);
  });
}

document.querySelector("#check1").addEventListener("click", () => {
  let correct = 0;
  let missing = 0;

  items.forEach((item, index) => {
    const select = document.querySelector(`select[data-index="${index}"]`);
    const result = document.querySelector(`[data-result="${index}"]`);
    const value = Number(select.value);

    if (!value) {
      missing += 1;
      result.textContent = "Selecciona una opción.";
      return;
    }

    if (value === item.answer) {
      correct += 1;
      result.textContent = "✅ Buena lectura de la expectativa.";
    } else {
      result.textContent =
        `💡 Encaja mejor “${labels[item.answer]}”. Piensa en cuánto cambia lo que ya esperabas.`;
    }
  });

  if (missing) {
    feedback1.textContent = `Faltan ${missing} tarjeta(s) por responder.`;
    return;
  }

  setScore(Math.max(score, correct * 10));
  feedback1.textContent =
    `Resultado: ${correct} de ${items.length}. La clave no es si el mensaje es emocionante, sino cuánto cambia lo que esperabas.`;
});

document.querySelector("#reset1").addEventListener("click", () => {
  document.querySelectorAll("#cards select").forEach((select) => {
    select.value = "0";
  });
  document.querySelectorAll("[data-result]").forEach((el) => {
    el.textContent = "";
  });
  feedback1.textContent = "";
});

document.querySelectorAll(".clue").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".place").forEach((place) => {
      place.classList.remove("is-out");
    });

    const removed = button.dataset.eliminate.split(",");
    removed.forEach((name) => {
      const place = document.querySelector(`[data-place="${name}"]`);
      if (place) place.classList.add("is-out");
    });

    const remaining = 4 - removed.length;
    uncertainty.innerHTML =
      remaining === 1
        ? "🚀 Queda una sola posibilidad: <strong>el mensaje redujo muchísimo la incertidumbre.</strong>"
        : `🌪️ Quedan <strong>${remaining} posibilidades abiertas.</strong> El mensaje aportó información, pero aún existe incertidumbre.`;

    const key = button.dataset.eliminate;
    if (!clueBonusGiven.has(key)) {
      clueBonusGiven.add(key);
      setScore(score + removed.length * 3);
    }
  });
});

document.querySelector("#judge").addEventListener("click", () => {
  const predictable = document.querySelector("#predictable").value.trim();
  const surprising = document.querySelector("#surprising").value.trim();

  if (predictable.length < 5 || surprising.length < 5) {
    creativeFeedback.textContent = "Escribe los dos mensajes para completar el reto.";
    return;
  }

  if (!creativeFeedback.dataset.completed) {
    setScore(score + 15);
    creativeFeedback.dataset.completed = "true";
  }

  creativeFeedback.innerHTML =
    "🏅 <strong>Dupla creada.</strong> Intercámbiala con otro equipo: ellos deben decidir cuál reduce más incertidumbre y explicar por qué. +15 puntos.";
});

renderCards();
