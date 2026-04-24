document.getElementById('run-btn').addEventListener('click', function() {
  const p1 = document.getElementById('p1').value.split('');
  const p2 = document.getElementById('p2').value.split('');
  const table = document.getElementById('punnett-table');
  const stats = document.getElementById('stats-panel');

  // Validation
  if (p1.length < 2 || p2.length < 2) return alert("Enter 2 alleles!");

  // Build the Table Content
  let html = `
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
  
  table.innerHTML = html;
  calculateStats([p1[0]+p2[0], p1[0]+p2[1], p1[1]+p2[0], p1[1]+p2[1]]);
});

// Helper to keep Dominant allele first (e.g., Bb not bB)
function formatAllele(a, b) {
  return [a, b].sort((x, y) => x.charCodeAt(0) - y.charCodeAt(0)).join('');
}

function calculateStats(combos) {
  let counts = {};
  combos.forEach(c => {
      let sorted = formatAllele(c[0], c[1]);
      counts[sorted] = (counts[sorted] || 0) + 1;
  });

  let statHtml = "<h3>Genotype Frequency</h3>";
  for (let g in counts) {
      statHtml += `<div class="stat-bar"><b>${g}:</b> ${(counts[g]/4)*100}%</div>`;
  }
  document.getElementById('stats-panel').innerHTML = statHtml;
}
