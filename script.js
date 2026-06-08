async function loadTokens() {
  const res = await fetch('tokens.json');
  return res.json();
}

// TODO: replace with real Counterparty API
async function getBalances(address) {
  console.log('Fetching balances for', address);
  // Temporary fake data so you can see the grid:
  return {
    "TOKEN_S1C1": 5,
    "TOKEN_S2C1": 6,
    "TOKEN_S3C1": 10,
    "TOKEN_S4C1": 12
  };
}

function computeChase(tokens, balances) {
  const chase = {};

  for (let card = 1; card <= 21; card++) {
    let total = 0;

    for (let series = 1; series <= 20; series++) {
      const tokenObj = tokens.find(
        t => t.series === series && t.card === card
      );
      if (!tokenObj) continue;
      const amount = balances[tokenObj.token] || 0;
      total += amount;
    }

    chase[card] = total >= 11;
  }

  return chase;
}

function renderGrid(tokens, balances, chase) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  tokens.forEach(t => {
    const cell = document.createElement('div');
    cell.className = 'cell';

    const owned = (balances[t.token] || 0) > 0;
    const isChase = t.series === 21 && chase[t.card];

    if (owned) cell.classList.add('owned');
    if (isChase) cell.classList.add('chase');
    if (t.series === 21) cell.classList.add('series21');

    cell.innerText = `S${t.series} C${t.card}`;
    grid.appendChild(cell);
  });
}

async function main() {
  const tokens = await loadTokens();

  const button = document.getElementById('loadButton');
  const input = document.getElementById('addressInput');

  button.addEventListener('click', async () => {
    const address = input.value.trim();
    if (!address) {
      alert('Please enter an address');
      return;
    }

    const balances = await getBalances(address);
    const chase = computeChase(tokens, balances);
    renderGrid(tokens, balances, chase);
  });
}

main();
