const animalTraits = {
  cow: { name: "Bovine", dominant: "Black", recessive: "Red" },
  sheep: { name: "Ovine", dominant: "White", recessive: "Black" },
  pig: { name: "Porcine", dominant: "Pink", recessive: "Black" },
  horse: { name: "Equine", dominant: "Bay", recessive: "Chestnut" }
};

const form = document.getElementById("cross-form");
const animalSelect = document.getElementById("animal-select");
const p1Input = document.getElementById("p1");
const p2Input = document.getElementById("p2");
const table = document.getElementById("punnett-table");
const statsPanel = document.getElementById("stats-panel");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runGeneticCross();
});

animalSelect.addEventListener("change", () => {
  runGeneticCross();
});

function runGeneticCross() {
  const parentOne = sanitizeGenotype(p1Input.value);
  const parentTwo = sanitizeGenotype(p2Input.value);

  if (!parentOne || !parentTwo) {
    showError("Each parent must have exactly two alleles, using only B or b.");
    clearResults();
    return;
  }

  showError("");

  const combos = [
    formatAllele(parentOne[0], parentTwo[0]),
    formatAllele(parentOne[0], parentTwo[1]),
    formatAllele(parentOne[1], parentTwo[0]),
    formatAllele(parentOne[1], parentTwo[1])
  ];

  renderPunnettTable(parentOne, parentTwo, combos);
  renderStats(combos, animalTraits[animalSelect.value]);
}

function sanitizeGenotype(value) {
  const trimmed = value.trim();
  if (!/^[Bb]{2}$/.test(trimmed)) {
    return null;
  }

  return trimmed.split("").map(normalizeAllele);
}

function normalizeAllele(allele) {
  return allele.toUpperCase() === "B" ? "B" : "b";
}

function formatAllele(a, b) {
  return [normalizeAllele(a), normalizeAllele(b)]
    .sort((left, right) => left.charCodeAt(0) - right.charCodeAt(0))
    .join("");
}

function renderPunnettTable(parentOne, parentTwo, combos) {
  table.replaceChildren();

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th"));
  headerRow.appendChild(createCell("th", parentTwo[0]));
  headerRow.appendChild(createCell("th", parentTwo[1]));
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");
  const rows = [
    [parentOne[0], combos[0], combos[1]],
    [parentOne[1], combos[2], combos[3]]
  ];

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.appendChild(createCell("th", row[0]));
    tr.appendChild(createCell("td", row[1], "cell"));
    tr.appendChild(createCell("td", row[2], "cell"));
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
}

function renderStats(combos, traits) {
  const genotypeCounts = combos.reduce((counts, combo) => {
    counts[combo] = (counts[combo] || 0) + 1;
    return counts;
  }, {});

  const phenotypeCounts = combos.reduce((counts, combo) => {
    const phenotype = combo.includes("B") ? traits.dominant : traits.recessive;
    counts[phenotype] = (counts[phenotype] || 0) + 1;
    return counts;
  }, {});

  statsPanel.replaceChildren();
  statsPanel.appendChild(createHeading(`${traits.name} Analysis`));
  statsPanel.appendChild(createHeading("Genotype Frequency", 4));
  statsPanel.appendChild(buildStatsGroup(genotypeCounts, false));
  statsPanel.appendChild(createHeading("Predicted Phenotype", 4));
  statsPanel.appendChild(buildStatsGroup(phenotypeCounts, true));
}

function buildStatsGroup(counts, includeTraitLabel) {
  const wrapper = document.createElement("div");
  wrapper.className = "stats-grid";

  Object.entries(counts).forEach(([label, count]) => {
    const card = document.createElement("div");
    card.className = "stat-bar";

    const statLabel = document.createElement("strong");
    statLabel.textContent = includeTraitLabel ? `${label} trait` : label;

    const statValue = document.createElement("span");
    statValue.textContent = `${formatPercent(count, 4)} (${count}/4)`;

    card.append(statLabel, statValue);
    wrapper.appendChild(card);
  });

  return wrapper;
}

function formatPercent(count, total) {
  return `${(count / total) * 100}%`;
}

function createHeading(text, level = 3) {
  const heading = document.createElement(`h${level}`);
  heading.textContent = text;
  return heading;
}

function createCell(tagName, text, className = "") {
  const cell = document.createElement(tagName);
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  return cell;
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearResults() {
  table.replaceChildren();
  statsPanel.replaceChildren();
}

runGeneticCross();
