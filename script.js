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

document.getElementById('run-btn').addEventListener('click', function() {
    // 1. Get Live Data
    const sInput = document.getElementById('p1').value.trim();
    const dInput = document.getElementById('p2').value.trim();
    const species = document.getElementById('animal-select').value;
    const traits = animalTraits[species];

    // 2. Validate
    if (sInput.length !== 2 || dInput.length !== 2) {
        alert("Enter exactly 2 alleles (e.g. Bb)");
        return;
    }

    const p1 = sInput.split('');
    const p2 = dInput.split('');

    // 3. Render Table
    const table = document.getElementById('punnett-table');
    table.innerHTML = `
        <tr><th></th><th>${p2[0]}</th><th>${p2[1]}</th></tr>
        <tr><th>${p1[0]}</th><td>${formatAllele(p1[0], p2[0])}</td><td>${formatAllele(p1[0], p2[1])}</td></tr>
        <tr><th>${p1[1]}</th><td>${formatAllele(p1[1], p2[0])}</td><td>${formatAllele(p1[1], p2[1])}</td></tr>
    `;

    // 4. Calculate Logic
    const outcomes = [p1[0]+p2[0], p1[0]+p2[1], p1[1]+p2[0], p1[1]+p2[1]];
    let counts = {};
    outcomes.forEach(o => {
        let sorted = formatAllele(o[0], o[1]);
        counts[sorted] = (counts[sorted] || 0) + 1;
    });

    let statHtml = `<h3>${traits.name} Analysis</h3>`;
    for (let g in counts) {
        // If the first letter is uppercase, it shows the dominant trait
        let isDom = g[0] === g[0].toUpperCase();
        let pheno = isDom ? traits.dominant : traits.recessive;
        statHtml += `<div class="stat-bar"><b>${g}:</b> ${(counts[g]/4)*100}% — ${pheno} Trait</div>`;
    }
    document.getElementById('stats-panel').innerHTML = statHtml;
});

function formatAllele(a, b) {
    // Sorts so 'B' always comes before 'b'
    return [a, b].sort((x, y) => x.charCodeAt(0) - y.charCodeAt(0)).join('');
}

function resetLab() {
    document.getElementById('p1').value = "Bb";
    document.getElementById('p2').value = "Bb";
    document.getElementById('punnett-table').innerHTML = "";
    document.getElementById('stats-panel').innerHTML = "";
}
