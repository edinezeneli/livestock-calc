// 1. DATA CONFIGURATION (Global Scope)
const farmQuotes = [
    "Holy cow, those genes look good!",
    "Ewe are doing a great job with this selection.",
    "Don't count your chickens before they hatch... but do check their genotypes.",
    "Making Mendel proud, one cross at a time.",
    "Just another day at the office (the barn).",
    "Pigging out on data today, are we?",
    "Stable genetics make for a stable barn.",
    "That's a baaaa-rilliant combination!"
];

const animalTraits = {
    cow: { name: "Bovine", dominant: "Black", recessive: "Red" },
    sheep: { name: "Ovine", dominant: "White", recessive: "Black" },
    pig: { name: "Porcine", dominant: "Pink", recessive: "Black" },
    horse: { name: "Equine", dominant: "Bay", recessive: "Chestnut" }
};

// 2. MAIN EVENT LISTENER
document.getElementById('run-btn').addEventListener('click', function() {
    // Capture user inputs
    const sInput = document.getElementById('p1').value.trim();
    const dInput = document.getElementById('p2').value.trim();
    const species = document.getElementById('animal-select').value;
    const traits = animalTraits[species];

    // Validation
    if (sInput.length !== 2 || dInput.length !== 2) {
        alert("Please enter exactly 2 alleles (e.g., Bb)");
        return;
    }

    const p1 = sInput.split('');
    const p2 = dInput.split('');

    // Render Punnett Square Table
    const table = document.getElementById('punnett-table');
    table.innerHTML = `
        <tr><th></th><th>${p2[0]}</th><th>${p2[1]}</th></tr>
        <tr><th>${p1[0]}</th><td>${formatAllele(p1[0], p2[0])}</td><td>${formatAllele(p1[0], p2[1])}</td></tr>
        <tr><th>${p1[1]}</th><td>${formatAllele(p1[1], p2[0])}</td><td>${formatAllele(p1[1], p2[1])}</td></tr>
    `;

    // Calculate Statistics and Phenotypes
    const outcomes = [p1[0]+p2[0], p1[0]+p2[1], p1[1]+p2[0], p1[1]+p2[1]];
    let counts = {};
    outcomes.forEach(o => {
        let sorted = formatAllele(o[0], o[1]);
        counts[sorted] = (counts[sorted] || 0) + 1;
    });

    let statHtml = `<h3>${traits.name} Analysis</h3>`;
    for (let g in counts) {
        let isDom = g[0] === g[0].toUpperCase();
        let pheno = isDom ? traits.dominant : traits.recessive;
        let percent = (counts[g]/4)*100;
        statHtml += `<div class="stat-bar"><b>${g}:</b> ${percent}% — ${pheno} Trait</div>`;
    }
    document.getElementById('stats-panel').innerHTML = statHtml;

    // Trigger the funny quote
    displayQuote();
});

// 3. HELPER FUNCTIONS
function displayQuote() {
    const quoteArea = document.getElementById('quote-area');
    // Math.random() gives a decimal between 0 and 1. 
    // We multiply by array length and use Math.floor to get a valid index number.
    const randomIndex = Math.floor(Math.random() * farmQuotes.length);
    quoteArea.innerText = `"${farmQuotes[randomIndex]}"`;
}

function formatAllele(a, b) {
    // Sorts by ASCII: UpperCase (65-90) comes before LowerCase (97-122)
    return [a, b].sort((x, y) => x.charCodeAt(0) - y.charCodeAt(0)).join('');
}

function resetLab() {
    document.getElementById('p1').value = "Bb";
    document.getElementById('p2').value = "Bb";
    document.getElementById('punnett-table').innerHTML = "";
    document.getElementById('stats-panel').innerHTML = "";
    document.getElementById('quote-area').innerHTML = ""; 
}
