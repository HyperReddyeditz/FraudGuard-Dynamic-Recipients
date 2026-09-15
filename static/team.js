const list = document.querySelector('#team-list');
const count = document.querySelector('#directory-count');
const search = document.querySelector('#team-search');
let members = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function renderDirectory() {
  const query = search.value.trim().toLowerCase();
  const visible = members.filter(member =>
    `${member.name} ${member.user_id}`.toLowerCase().includes(query)
  );
  count.textContent = `${visible.length} of ${members.length} member${members.length === 1 ? '' : 's'}`;
  list.innerHTML = visible.length ? visible.map(member => {
    const initial = (member.name || '?').trim().charAt(0).toUpperCase();
    return `<article class="team-member directory-member">
      <div class="recipient-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
      <div class="directory-member-details">
        <b>${escapeHtml(member.name)}</b>
        <span>${escapeHtml(member.user_id)}</span>
        <small>${Number(member.tx_count || 0).toLocaleString()} previous payments</small>
      </div>
      <div class="directory-activity">
        <span>Average payment</span>
        <strong>₹${Number(member.avg_amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
      </div>
    </article>`;
  }).join('') : '<div class="loading">No members match your search.</div>';
}

async function loadDirectory() {
  list.innerHTML = '<div class="loading">Loading directory…</div>';
  try {
    const response = await fetch('/api/team');
    if (!response.ok) throw new Error('Unable to load directory');
    members = await response.json();
    renderDirectory();
  } catch (error) {
    count.textContent = 'Directory unavailable';
    list.innerHTML = '<div class="loading">Unable to load the team directory. Please try again.</div>';
  }
}

search.addEventListener('input', renderDirectory);
loadDirectory();
