// 1. Data Dictionary for Species
const animalTraits = {
    cow: { name: "Bovine", dominant: "Black", recessive: "Red" },
    sheep: { name: "Ovine", dominant: "White", recessive: "Black" },
    pig: { name: "Porcine", dominant: "Pink", recessive: "Black" },
    horse: { name: "Equine", dominant: "Bay", recessive: "Chestnut" }
};

// 2. The Main Engine
document.getElementById('run-btn').addEventListener('click', function() {
    // FRESH data capture: Grab exactly what is in the boxes RIGHT NOW
    const sInput = document.getElementById('p1').value.trim();
    const dInput = document.getElementById('p2').value.trim();
    
    const p1 = sInput.split('');
    const p2 = dInput.split('');
    const selectedAnimal = document.getElementById('animal-select').value;
    const traits = animalTraits[selectedAnimal];

    // Validation: Ensure we have 2 alleles per parent
    if (p1.length !== 2 || p2.length !== 2) {
        alert("Please enter exactly 2 alleles (e.g., Bb)");
        return;
    }

    // Build the Punnett Square
    const table = document.getElementById('punnett-table');
    table.innerHTML = `
        <tr>
            <th></th>
            <th>${p2[0]}</th>
            <th>${p2[1]}</th>
        </tr>
        <tr>
            <th>${p1[0]}</th>
            <td class="cell">${formatAllele(p1[0], p2[0])}</td>
            <td class="cell">${formatAllele(p1[0], p2[1])}</td>
        </tr>
        <tr>
            <th>${p1[1]}</th>
            <td class="cell">${formatAllele(p1[1], p2[0])}</td>
            <td class="cell">${formatAllele(p1[1], p2[1])}</td>
        </tr>
    `;

    // 3. Calculate Stats for the Panel
    const outcomes = [
        p1[0] + p2[0], p1[0] + p2[1], 
        p1[1] + p2[0], p1[1] + p2[1]
    ];

    let counts = {};
    outcomes.forEach(o => {
        let sorted = formatAllele(o[0], o[1]);
        counts[sorted] = (counts[sorted] || 0) + 1;
    });

    let statHtml = `<h3>${traits.name} Analysis</h3>`;
    for (let genotype in counts) {
        let isDominant = genotype[0] === genotype[0].toUpperCase();
        let phenotype = isDominant ? traits.dominant : traits.recessive;
        let percent = (counts[genotype] / 4) * 100;
        
        statHtml += `
            <div class="stat-bar">
                <strong>${genotype}</strong>: ${percent}% 
                <span>(${phenotype} trait)</span>
            </div>`;
    }
    document.getElementById('stats-panel').innerHTML = statHtml;
});

// Helper: Ensures "Bb" instead of "bB" (Bioinformatics standard)
function formatAllele(a, b) {
    return [a, b].sort((x, y) => x.charCodeAt(0) - y.charCodeAt(0)).join('');
}

// 4. Reset Button Functionality
function resetLab() {
    document.getElementById('p1').value = "Bb";
    document.getElementById('p2').value = "Bb";
    document.getElementById('punnett-table').innerHTML = "";
    document.getElementById('stats-panel').innerHTML = "";
}
