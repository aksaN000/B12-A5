(() => {
  // Utility helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const heartEl = $('#heartCount');
  const coinEl = $('#coinCount');
  const copyEl = $('#copyCount');
  const historyList = $('#callHistory');
  const clearBtn = $('#clearHistory');

  // State
  let hearts = parseInt(heartEl?.textContent || '0', 10) || 0;
  let coins = parseInt(coinEl?.textContent || '0', 10) || 0;
  let copies = parseInt(copyEl?.textContent || '0', 10) || 0;

  // Format current local time string
  function getNowString() {
    const d = new Date();
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }

  // Render helpers
  function updateCounters() {
    if (heartEl) heartEl.textContent = String(hearts);
    if (coinEl) coinEl.textContent = String(coins);
    if (copyEl) copyEl.textContent = String(copies);
  }

  function addHistoryItem(serviceName, number) {
    if (!historyList) return;
    const li = document.createElement('li');
    li.className = 'bg-white rounded-md p-3 flex items-center justify-between border border-gray-100';
    const when = getNowString();
    li.innerHTML = `
      <div class="flex-1">
        <div class="font-medium text-gray-800">${serviceName}</div>
        <div class="text-sm text-gray-600">${number}</div>
      </div>
    <div class="ml-4 text-sm">${when}</div>
    `;
    historyList.prepend(li);
  }

  // Event delegation for the whole document
  document.addEventListener('click', async (e) => {
    const target = e.target;

    // Find nearest article (card)
    const card = target.closest?.('article');

    // Heart (favorite) button anywhere inside the absolute button
    if (target.closest?.('article button[aria-label="favorite"]')) {
      hearts += 1;
      updateCounters();
      return;
    }

    // Copy button
    const copyBtn = target.closest?.('.copy-btn');
    if (copyBtn && card) {
      const number = copyBtn.getAttribute('data-number')
        || card.getAttribute('data-number');
      const service = card.getAttribute('data-service') || 'Service';
      const englishName = card.querySelector?.('p')?.textContent?.trim() || service;
      try {
        if (navigator.clipboard && number) {
          await navigator.clipboard.writeText(number);
        }
        alert(`${englishName} number copied: ${number}`);
        copies += 1;
        updateCounters();
      } catch (err) {
        console.error('Copy failed', err);
        alert('Could not copy. Please copy manually: ' + number);
      }
      return;
    }

    // Call button
    const callBtn = target.closest?.('.call-btn');
    if (callBtn && card) {
      const number = callBtn.getAttribute('data-number')
        || card.getAttribute('data-number');
      const service = card.getAttribute('data-service') || 'Service';
      const banglaName = card.querySelector?.('h3')?.textContent?.trim() || service;
      const englishName = card.querySelector?.('p')?.textContent?.trim() || service;

      if (coins < 20) {
        alert('Not enough coins to make a call. You need at least 20 coins.');
        return;
      }

      alert(`Calling ${englishName} at ${number}...`);
      coins -= 20;
      updateCounters();
      addHistoryItem(banglaName, number);
      return;
    }

    // Clear history
    if (clearBtn && (target === clearBtn || target.closest?.('#clearHistory'))) {
      if (historyList) historyList.innerHTML = '';
      return;
    }
  });

  // Initialize
  updateCounters();
})();
