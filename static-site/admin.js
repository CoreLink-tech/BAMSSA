// BAMSSA Admin Dashboard
// Sections: Auth, Overview, Administrations, Achievements, Executives, Department Reps, HODs, Gallery

const SECTIONS = ['Overview', 'Administrations', 'Achievements', 'Executives', 'Department Reps', 'HODs', 'Departments', 'Staff', 'News & Updates', 'Gallery', 'E-Library', 'Marketplace', 'Suggestions'];

document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

  async function getValidSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) { return null; }
    return session;
  }

  const authScreen = document.getElementById('auth-screen');
  const app = document.getElementById('app');

  function showAuth() {
    app.style.display = 'none';
    authScreen.style.display = 'block';
    renderAuth();
  }

  function showApp() {
    authScreen.style.display = 'none';
    app.style.display = 'flex';
    renderDashboard();
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      showApp();
    } else {
      showAuth();
    }
  } catch (err) {
    console.error('Startup error:', err);
    showAuth();
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      showAuth();
    }
  });

  function renderAuth() {
    const authScreen = document.getElementById('auth-screen');
    authScreen.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-[#081429] px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <img src="assets/logo-clean.webp" alt="BAMSSA" class="mx-auto h-20 mb-5" />
          <h1 class="text-2xl font-bold text-white tracking-tight">BAMSSA Admin Panel</h1>
          <p class="text-slate-400 text-sm mt-1">Faculty of Basic Medical Sciences — DELSU</p>
        </div>
        <div class="rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl">
          <form id="login-form" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input type="email" id="login-email" required autocomplete="email"
                class="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 placeholder-slate-500 focus:outline-none focus:border-[#2f6df6] focus:ring-2 focus:ring-[#2f6df6]/30 transition"
                placeholder="you@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" id="login-password" required autocomplete="current-password"
                class="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 placeholder-slate-500 focus:outline-none focus:border-[#2f6df6] focus:ring-2 focus:ring-[#2f6df6]/30 transition"
                placeholder="••••••••" />
            </div>
            <div id="login-error" class="hidden rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3"></div>
            <button type="submit" id="login-btn"
              class="w-full py-3 rounded-xl bg-[#2f6df6] text-white font-semibold text-base hover:bg-[#235ee8] transition flex items-center justify-center gap-3">
              <svg id="login-spinner" class="hidden h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span id="login-btn-text">Sign In</span>
            </button>
          </form>
        </div>
        <p class="text-center text-xs text-slate-500 mt-6">Authorized personnel only</p>
      </div>
    </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      const spinner = document.getElementById('login-spinner');
      const btnText = document.getElementById('login-btn-text');
      const btn = document.getElementById('login-btn');

      errorEl.classList.add('hidden');
      spinner.classList.remove('hidden');
      btnText.textContent = 'Signing in...';
      btn.disabled = true;
      btn.classList.add('opacity-75', 'cursor-not-allowed');

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        spinner.classList.add('hidden');
        btnText.textContent = 'Sign In';
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
      } else {
        btnText.textContent = 'Welcome';
        setTimeout(() => {
          showApp();
        }, 600);
      }
    });
  }

  let isSidebarOpen = false;

  function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;
  isSidebarOpen = !isSidebarOpen;
  if (isSidebarOpen) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

function renderDashboard() {
  const app = document.getElementById('app');
  isSidebarOpen = false;
  app.innerHTML = `
    <div class="flex min-h-screen">
      <aside id="sidebar" class="sidebar fixed inset-y-0 left-0 z-50 w-64 -translate-x-full flex-col bg-[#081429] text-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0">
        <div class="p-4">
          <img src="assets/logo-clean.webp" alt="BAMSSA" class="h-10" />
        </div>
        <nav class="flex-1 px-2 space-y-1">
          ${SECTIONS.map((s, i) => `
            <button data-section="${s}" class="nav-link w-full text-left px-4 py-3 rounded-full text-sm lg:py-2 ${i === 0 ? 'bg-white/10' : 'hover:bg-white/5'} transition">${s}</button>
          `).join('')}
        </nav>
        <div class="p-4">
          <button id="logout-btn" class="w-full px-4 py-2 rounded bg-slate-700 text-sm hover:bg-slate-600 transition">Logout</button>
        </div>
      </aside>
      <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-black/50 lg:hidden"></div>
      <main class="flex-1 min-w-0 overflow-y-auto" style="background:#f8fafc;">
        <header class="sticky top-0 z-10 border-b px-4 py-3 lg:px-6 lg:py-4 flex items-center gap-3" style="background:#ffffff;">
          <button id="hamburger" type="button" class="inline-flex items-center justify-center rounded-full p-1.5 text-slate-700 hover:bg-slate-100 lg:hidden">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 id="section-title" class="text-lg sm:text-xl font-semibold truncate text-slate-900">${SECTIONS[0]}</h2>
        </header>
        <div id="section-content" class="p-4 lg:p-6" style="background:#f8fafc;"></div>
      </main>
    </div>
  `;
  document.getElementById('hamburger').addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', toggleSidebar);
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveNav(btn.dataset.section);
      renderSection(btn.dataset.section);
      if (window.innerWidth < 1024 && isSidebarOpen) toggleSidebar();
    });
  });
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    document.getElementById('app').innerHTML = '';
    showAuth();
  });
  renderSection(SECTIONS[0]);
}

function setActiveNav(section) {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('bg-white/10', btn.dataset.section === section);
  });
  document.getElementById('section-title').textContent = section;
}

function renderSection(section) {
  const content = document.getElementById('section-content');
  const title = document.getElementById('section-title');
  if (section === 'Overview') {
    renderOverview(content);
  } else if (section === 'Administrations') {
    renderAdministrations(content, title);
  } else if (section === 'Achievements') {
    renderAchievements(content, title);
  } else if (section === 'Executives') {
    renderExecutives(content, title);
  } else if (section === 'Department Reps') {
    renderDepartmentReps(content, title);
  } else if (section === 'HODs') {
    renderHODs(content, title);
  } else if (section === 'Departments') {
    renderDepartmentImages(content, title);
  } else if (section === 'Staff') {
    renderStaff(content, title);
  } else if (section === 'News & Updates') {
    renderNews(content, title);
  } else if (section === 'Gallery') {
    renderGallery(content, title);
  } else if (section === 'E-Library') {
    renderELibrary(content, title);
  } else if (section === 'Marketplace') {
    renderMarketplaceAdmin(content, title);
  } else if (section === 'Suggestions') {
    renderSuggestions(content, title);
  } else {
    content.innerHTML = `
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-medium text-slate-900 mb-2">${section}</h3>
        <p class="text-slate-500">${section} management interface coming soon.</p>
      </div>
    `;
  }
}

async function fetchAdministrations() {
  const { data, error } = await supabase.from('administrations').select('id, session_label, is_current').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load administrations', 'error'); return []; }
  return data;
}

function getDeptBadgeColor(dept) {
  const map = { 'Anatomy': 'bg-red-100 text-red-800', 'Physiology': 'bg-blue-100 text-blue-800', 'Biochemistry': 'bg-green-100 text-green-800' };
  return map[dept] || 'bg-slate-100 text-slate-800';
}

async function convertToWebp(file, quality = 0.82, maxDimension = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { naturalWidth: w, naturalHeight: h } = img;
        if (w > maxDimension || h > maxDimension) {
          if (w >= h) { h = Math.round(h * (maxDimension / w)); w = maxDimension; }
          else { w = Math.round(w * (maxDimension / h)); h = maxDimension; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('WebP conversion produced no data')); return; }
          const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
          resolve(new File([blob], newName, { type: 'image/webp' }));
        }, 'image/webp', quality);
      };
      img.onerror = () => reject(new Error('Could not load image for conversion'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read file for conversion'));
    reader.readAsDataURL(file);
  });
}

async function uploadPhoto(file, bucketName) {
  if (!file) return null;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) { showToast('Invalid image type. Use JPG, PNG, WebP, or GIF.', 'error'); return null; }
  if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB.', 'error'); return null; }

  // Convert to WebP for faster loading, but leave animated GIFs and existing WebP files untouched.
  let uploadFile = file;
  if (file.type !== 'image/webp' && file.type !== 'image/gif') {
    try {
      uploadFile = await convertToWebp(file);
    } catch (err) {
      console.error('WebP conversion failed, uploading original file instead:', err);
      uploadFile = file;
    }
  }

  const fileExt = uploadFile.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const { error } = await supabase.storage.from(bucketName).upload(fileName, uploadFile, {
    cacheControl: '31536000',
    upsert: false
  });
  if (error) { showToast(error.message, 'error'); return null; }
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data.publicUrl;
}

async function renderOverview(content) {
  const [{ count: adminCount, error: adminErr }, { count: execCount, error: execErr }, { count: achCount, error: achErr }, { count: repCount, error: repErr }, { count: galCount, error: galErr }, { data: current, error: curErr }] = await Promise.all([
    supabase.from('administrations').select('*', { count: 'exact', head: true }),
    supabase.from('executives').select('*', { count: 'exact', head: true }),
    supabase.from('achievements').select('*', { count: 'exact', head: true }),
    supabase.from('department_reps').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
    supabase.from('administrations').select('session_label').eq('is_current', true).single()
  ]);

  if (adminErr || execErr || achErr || repErr || galErr || (curErr && !current)) {
    showToast('Failed to load overview data', 'error');
    return;
  }

  const stats = [
    { label: 'Administrations', count: adminCount ?? 0 },
    { label: 'Executives', count: execCount ?? 0 },
    { label: 'Achievements', count: achCount ?? 0 },
    { label: 'Department Reps', count: repCount ?? 0 },
    { label: 'Gallery', count: galCount ?? 0 }
  ];

  content.innerHTML = `
    <div class="space-y-6">
      ${current ? `
        <div class="rounded-[1.75rem] p-6 shadow-sm" style="background:#eff6ff;border:2px solid #2f6df6;">
          <h3 class="text-base font-semibold mb-1" style="color:#081429;">Current Administration</h3>
          <p class="text-2xl font-bold" style="color:#2f6df6;">${escapeHtml(current.session_label)}</p>
        </div>
      ` : ''}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${stats.map(s => `
          <div class="rounded-[1.75rem] p-5 shadow-sm" style="background:#ffffff;border:1px solid #e2e8f0;">
            <p class="text-xs font-medium" style="color:#64748b;">${s.label}</p>
            <p class="text-3xl font-bold mt-2" style="color:#0f172a;">${s.count}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function renderAdministrations(content, title) {
  const { data, error } = await supabase.from('administrations').select('*').order('created_at', { ascending: false });
  if (error) {
    showToast('Failed to load administrations', 'error');
    return;
  }

  title.textContent = 'Administrations';
  content.innerHTML = `
    <div class="space-y-6">
      <form id="add-admin-form" class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Add Administration</h3>
        <div class="flex flex-col sm:flex-row gap-4">
          <input type="text" id="new-session-label" placeholder="Session Label" required class="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" id="new-is-current" class="rounded border-slate-300" />
            Is Current
          </label>
          <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
        </div>
      </form>
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b">
            <tr>
              <th class="px-6 py-3 font-semibold text-slate-700">Session Label</th>
              <th class="px-6 py-3 font-semibold text-slate-700">Status</th>
              <th class="px-6 py-3 font-semibold text-slate-700">Created Date</th>
              <th class="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-table-body" class="divide-y divide-slate-200">
            ${data.map(row => renderAdminRow(row)).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('add-admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const label = document.getElementById('new-session-label').value.trim();
    const isCurrent = document.getElementById('new-is-current').checked;
    const { error } = await supabase.from('administrations').insert([{ session_label: label, is_current: isCurrent }]);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Administration added', 'success');
      renderSection('Administrations');
    }
  });

  document.getElementById('admin-table-body').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    handleAdminAction(action, id);
  });
}

async function handleAdminAction(action, id) {
  if (action === 'set-current') {
    const { error: resetErr } = await supabase.from('administrations').update({ is_current: false }).neq('id', id);
    if (resetErr) { showToast(resetErr.message, 'error'); return; }
    const { error: setErr } = await supabase.from('administrations').update({ is_current: true }).eq('id', id);
    if (setErr) { showToast(setErr.message, 'error'); return; }
    showToast('Current administration updated', 'success');
    renderSection('Administrations');
  } else if (action === 'delete') {
    const { data, error } = await supabase.from('administrations').select('session_label').eq('id', id).single();
    if (error || !data) { showToast('Failed to load administration', 'error'); return; }
    const label = data.session_label;
    const confirmed = await showConfirmWithInput(`Deleting this administration will also delete all linked executives, achievements, and reps. Type the session label to confirm.`, label);
    if (!confirmed) return;
    const { error: delErr } = await supabase.from('administrations').delete().eq('id', id);
    if (delErr) { showToast(delErr.message, 'error'); return; }
    showToast('Administration deleted', 'success');
    renderSection('Administrations');
  } else if (action === 'edit') {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
    const labelSpan = row.querySelector('.admin-label');
    const editInput = row.querySelector('.admin-edit-input');
    if (labelSpan.classList.contains('hidden')) return;
    labelSpan.classList.add('hidden');
    editInput.classList.remove('hidden');
    editInput.focus();
    editInput.addEventListener('blur', async () => { await saveEdit(id, editInput.value); }, { once: true });
    editInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') { editInput.blur(); }
      if (e.key === 'Escape') { renderSection('Administrations'); }
    });
  }
}

async function saveEdit(id, newLabel) {
  const { error } = await supabase.from('administrations').update({ session_label: newLabel.trim() }).eq('id', id);
  if (error) {
    showToast(error.message, 'error');
  } else {
    showToast('Administration updated', 'success');
    renderSection('Administrations');
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderAdminRow(row) {
  const isCurrent = row.is_current;
  return `
    <tr data-id="${row.id}" class="hover:bg-slate-50">
      <td class="px-6 py-4 text-slate-900">
        <span class="admin-label">${escapeHtml(row.session_label)}</span>
        <input type="text" class="admin-edit-input hidden w-full mt-1 px-2 py-1 rounded border border-slate-300" value="${escapeHtml(row.session_label)}" />
      </td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCurrent ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}">${isCurrent ? 'Current' : 'Past'}</span>
      </td>
      <td class="px-6 py-4 text-slate-500">${new Date(row.created_at).toLocaleDateString()}</td>
      <td class="px-6 py-4 text-right space-x-2">
        ${!isCurrent ? `<button data-action="set-current" data-id="${row.id}" class="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-[#2f6df6] hover:bg-blue-100 transition">Set as Current</button>` : ''}
        <button data-action="edit" data-id="${row.id}" class="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
        <button data-action="delete" data-id="${row.id}" class="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
      </td>
    </tr>
  `;
}

function showToast(message, type = 'success') {
  const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const toast = document.createElement('div');
  toast.className = `fixed top-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-4 z-50 ${color} text-white px-4 py-2 rounded shadow-lg`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
    overlay.innerHTML = `
      <div style="background:#ffffff;" class="rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
        <p class="text-slate-900 mb-6">${message}</p>
        <div class="flex justify-end space-x-3">
          <button id="confirm-cancel" class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
          <button id="confirm-ok" class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('confirm-cancel').addEventListener('click', () => { overlay.remove(); resolve(false); });
    document.getElementById('confirm-ok').addEventListener('click', () => { overlay.remove(); resolve(true); });
  });
}

async function showConfirmWithInput(message, expectedValue) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
  overlay.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <p class="text-slate-900 mb-4">${message}</p>
        <input type="text" id="confirm-input" class="w-full px-4 py-2 rounded-lg border border-slate-300 mb-4 focus:outline-none focus:border-[#2f6df6]" placeholder='Type "${expectedValue}" to confirm' />
        <div class="flex justify-end space-x-3">
          <button id="confirm-with-input-cancel" class="px-4 py-2 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
          <button id="confirm-with-input-ok" disabled class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition opacity-50 cursor-not-allowed">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const input = document.getElementById('confirm-input');
    const confirmBtn = document.getElementById('confirm-with-input-ok');
    input.addEventListener('input', () => {
      const match = input.value === expectedValue;
      confirmBtn.disabled = !match;
      confirmBtn.classList.toggle('opacity-50', !match);
      confirmBtn.classList.toggle('cursor-not-allowed', !match);
    });
    document.getElementById('confirm-with-input-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
    document.getElementById('confirm-with-input-ok').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });
    input.focus();
  });
}

function renderExecCard(exec) {
  return `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <img src="${escapeHtml(exec.image_url || '')}" alt="${escapeHtml(exec.name)}" class="h-48 w-full object-cover ${!exec.image_url ? 'bg-slate-100' : ''}" />
      <div class="p-4 flex-1 flex flex-col">
        <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(exec.name)}</h4>
        <p class="text-sm text-slate-500">${escapeHtml(exec.role)}</p>
        <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeptBadgeColor(exec.department)} self-start">${escapeHtml(exec.department)}</span>
        <div class="mt-auto pt-4 flex gap-2">
          <button data-action="edit" data-id="${exec.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
          <button data-action="delete" data-id="${exec.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function renderRepCard(rep) {
  return `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <img src="${escapeHtml(rep.image_url || '')}" alt="${escapeHtml(rep.name)}" class="h-48 w-full object-cover ${!rep.image_url ? 'bg-slate-100' : ''}" />
      <div class="p-4 flex-1 flex flex-col">
        <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(rep.name)}</h4>
        <p class="text-sm text-slate-500">${escapeHtml(rep.role)}</p>
        <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeptBadgeColor(rep.department)} self-start">${escapeHtml(rep.department)}</span>
        <div class="mt-auto pt-4 flex gap-2">
          <button data-action="edit" data-id="${rep.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
          <button data-action="delete" data-id="${rep.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  `;
}

// EXECUTIVES

async function renderExecutives(content, title) {
  const admins = await fetchAdministrations();
  const currentAdmin = admins.find(a => a.is_current) || admins[0];
  const filterId = currentAdmin ? currentAdmin.id : 'all';
  
  title.textContent = 'Executives';
  
  let execs = [];
  if (filterId !== 'all') {
    const { data, error } = await supabase.from('executives').select('*').eq('administration_id', filterId).order('display_order', { ascending: true });
    if (error) { showToast('Failed to load executives', 'error'); return; }
    execs = data;
  } else {
    const { data, error } = await supabase.from('executives').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load executives', 'error'); return; }
    execs = data;
  }
  
  const depts = ['Anatomy', 'Physiology', 'Biochemistry'];
  
  function renderExecForm(exec = null) {
    const isEdit = !!exec;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">${isEdit ? 'Edit Executive' : 'Add Executive'}</h3>
        <form id="exec-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Administration</label>
              <select id="exec-admin" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
                ${admins.map(a => `<option value="${a.id}" ${exec && exec.administration_id == a.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" id="exec-name" required value="${exec ? escapeHtml(exec.name) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input type="text" id="exec-role" required value="${exec ? escapeHtml(exec.role) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select id="exec-dept" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
                ${depts.map(d => `<option value="${d}" ${exec && exec.department === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Level</label>
              <input type="text" id="exec-level" value="${exec ? escapeHtml(exec.level || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input type="number" id="exec-order" value="${exec ? exec.display_order || 0 : 0}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" id="exec-email" value="${exec ? escapeHtml(exec.email || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" id="exec-phone" value="${exec ? escapeHtml(exec.phone || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Summary</label>
            <textarea id="exec-summary" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${exec ? escapeHtml(exec.summary || '') : ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Focus</label>
            <textarea id="exec-focus" rows="2" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${exec ? escapeHtml(exec.focus || '') : ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Photo</label>
            <input type="file" id="exec-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            ${exec && exec.image_url ? `<img src="${escapeHtml(exec.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
            <img id="exec-photo-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">${isEdit ? 'Update' : 'Save'}</button>
            ${isEdit ? `<button type="button" id="exec-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>` : ''}
          </div>
        </form>
      </div>
    `;
  }
  
let editingId = null;
  let isAddMode = false;
  
  async function renderExecs() {
    if (editingId || isAddMode) {
      const exec = editingId ? execs.find(e => e.id === editingId) : null;
        content.innerHTML = renderExecForm(exec) + `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${execs.map(renderExecCard).join('')}</div>`;
    } else {
      content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <select id="exec-filter" class="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            <option value="all">All Administrations</option>
            ${admins.map(a => `<option value="${a.id}" ${filterId == a.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
          </select>
          <button id="exec-add" class="px-4 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Add Executive</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${execs.map(renderExecCard).join('')}
        </div>
      `;
    }
    bindExecEvents();
  }
  
  function bindExecEvents() {
    const addBtn = document.getElementById('exec-add');
    const cancelBtn = document.getElementById('exec-cancel');
    
    if (addBtn) addBtn.addEventListener('click', () => { isAddMode = true; editingId = null; renderExecs(); });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { isAddMode = false; editingId = null; renderSection('Executives'); });
    const filterEl = document.getElementById('exec-filter');
    if (filterEl) filterEl.addEventListener('change', () => { renderSection('Executives'); });
    
    const photoInput = document.getElementById('exec-photo');
    const preview = document.getElementById('exec-photo-preview');
    if (photoInput && preview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
          reader.readAsDataURL(file);
        }
      });
    }
    
    document.getElementById('exec-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const adminId = document.getElementById('exec-admin').value;
      const name = document.getElementById('exec-name').value.trim();
      const role = document.getElementById('exec-role').value.trim();
      const dept = document.getElementById('exec-dept').value;
      const level = document.getElementById('exec-level').value.trim();
      const order = parseInt(document.getElementById('exec-order').value) || 0;
      const email = document.getElementById('exec-email').value.trim();
      const phone = document.getElementById('exec-phone').value.trim();
      const summary = document.getElementById('exec-summary').value.trim();
      const focus = document.getElementById('exec-focus').value.trim();
      const photoFile = document.getElementById('exec-photo').files[0];
      
      let image_url = execs.find(e => e.id === editingId)?.image_url || null;
      if (photoFile) {
        const url = await uploadPhoto(photoFile, 'executives');
        if (!url) return;
        image_url = url;
      }
      
      const payload = { administration_id: adminId, name, role, department: dept, level, summary, focus, email, phone, display_order: order, image_url };
      
      let error;
      if (editingId) {
        ({ error } = await supabase.from('executives').update(payload).eq('id', editingId));
      } else {
        ({ error } = await supabase.from('executives').insert([payload]));
      }
      
      if (error) { showToast(error.message, 'error'); } else { showToast(editingId ? 'Executive updated' : 'Executive added', 'success'); renderSection('Executives'); }
    });
    
    document.querySelectorAll('[data-action="edit"][data-id]').forEach(btn => {
      btn.addEventListener('click', () => { isAddMode = false; editingId = btn.dataset.id; renderExecs(); });
    });
    document.querySelectorAll('[data-action="delete"][data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const confirmed = await showConfirm('Delete this executive? This cannot be undone.');
        if (!confirmed) return;
        const { error } = await supabase.from('executives').delete().eq('id', id);
        if (error) { showToast(error.message, 'error'); } else { showToast('Executive deleted', 'success'); renderSection('Executives'); }
      });
    });
  }
  
  await renderExecs();
}

// DEPARTMENT REPS

async function renderDepartmentReps(content, title) {
  const admins = await fetchAdministrations();
  const currentAdmin = admins.find(a => a.is_current) || admins[0];
  const filterId = currentAdmin ? currentAdmin.id : 'all';
  
  title.textContent = 'Department Reps';
  
  let reps = [];
  if (filterId !== 'all') {
    const { data, error } = await supabase.from('department_reps').select('*').eq('administration_id', filterId).order('display_order', { ascending: true });
    if (error) { showToast('Failed to load department reps', 'error'); return; }
    reps = data;
  } else {
    const { data, error } = await supabase.from('department_reps').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load department reps', 'error'); return; }
    reps = data;
  }
  
  const depts = ['Anatomy', 'Physiology', 'Biochemistry'];
  
  function renderRepForm(rep = null) {
    const isEdit = !!rep;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">${isEdit ? 'Edit Department Rep' : 'Add Department Rep'}</h3>
        <form id="rep-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Administration</label>
              <select id="rep-admin" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
                ${admins.map(a => `<option value="${a.id}" ${rep && rep.administration_id == a.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" id="rep-name" required value="${rep ? escapeHtml(rep.name) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Role / Title</label>
              <input type="text" id="rep-role" required value="${rep ? escapeHtml(rep.role) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select id="rep-dept" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
                ${depts.map(d => `<option value="${d}" ${rep && rep.department === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input type="number" id="rep-order" value="${rep ? rep.display_order || 0 : 0}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" id="rep-email" value="${rep ? escapeHtml(rep.email || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" id="rep-phone" value="${rep ? escapeHtml(rep.phone || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Bio / Quote</label>
            <textarea id="rep-bio" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${rep ? escapeHtml(rep.bio || '') : ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Photo</label>
            <input type="file" id="rep-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            ${rep && rep.image_url ? `<img src="${escapeHtml(rep.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
            <img id="rep-photo-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">${isEdit ? 'Update' : 'Save'}</button>
            ${isEdit ? `<button type="button" id="rep-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>` : ''}
          </div>
        </form>
      </div>
    `;
  }
  
  let editingRepId = null;
  let isRepAddMode = false;
  
  async function renderReps() {
    if (editingRepId || isRepAddMode) {
      const rep = editingRepId ? reps.find(r => r.id === editingRepId) : null;
      content.innerHTML = renderRepForm(rep) + `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${reps.map(renderRepCard).join('')}</div>`;
    } else {
      content.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <select id="rep-filter" class="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            <option value="all">All Administrations</option>
            ${admins.map(a => `<option value="${a.id}" ${filterId == a.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
          </select>
          <button id="rep-add" class="px-4 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Add Department Rep</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${reps.map(renderRepCard).join('')}
        </div>
      `;
    }
    bindRepEvents();
  }
  
  function bindRepEvents() {
    const addBtn = document.getElementById('rep-add');
    const cancelBtn = document.getElementById('rep-cancel');
    const filterEl = document.getElementById('rep-filter');
    
    if (addBtn) addBtn.addEventListener('click', () => { isRepAddMode = true; editingRepId = null; renderReps(); });
    if (cancelBtn) cancelBtn.addEventListener('click', () => { isRepAddMode = false; editingRepId = null; renderSection('Department Reps'); });
    if (filterEl) filterEl.addEventListener('change', () => { renderSection('Department Reps'); });
    
    const photoInput = document.getElementById('rep-photo');
    const preview = document.getElementById('rep-photo-preview');
    if (photoInput && preview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
          reader.readAsDataURL(file);
        }
      });
    }
    
    document.getElementById('rep-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const adminId = document.getElementById('rep-admin').value;
      const name = document.getElementById('rep-name').value.trim();
      const role = document.getElementById('rep-role').value.trim();
      const dept = document.getElementById('rep-dept').value;
      const order = parseInt(document.getElementById('rep-order').value) || 0;
      const email = document.getElementById('rep-email').value.trim();
      const phone = document.getElementById('rep-phone').value.trim();
      const bio = document.getElementById('rep-bio').value.trim();
      const photoFile = document.getElementById('rep-photo').files[0];
      
      let image_url = reps.find(r => r.id === editingRepId)?.image_url || null;
      if (photoFile) {
        const url = await uploadPhoto(photoFile, 'reps');
        if (!url) return;
        image_url = url;
      }
      
      const payload = { administration_id: adminId, name, role, department: dept, bio, email, phone, display_order: order, image_url };
      
      let error;
      if (editingRepId) {
        ({ error } = await supabase.from('department_reps').update(payload).eq('id', editingRepId));
      } else {
        ({ error } = await supabase.from('department_reps').insert([payload]));
      }
      
      if (error) { showToast(error.message, 'error'); } else { showToast(editingRepId ? 'Department rep updated' : 'Department rep added', 'success'); renderSection('Department Reps'); }
    });
    
    document.querySelectorAll('[data-action="edit"][data-id]').forEach(btn => {
      btn.addEventListener('click', () => { isRepAddMode = false; editingRepId = btn.dataset.id; renderReps(); });
    });
    document.querySelectorAll('[data-action="delete"][data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const confirmed = await showConfirm('Delete this department rep? This cannot be undone.');
        if (!confirmed) return;
        const { error } = await supabase.from('department_reps').delete().eq('id', id);
        if (error) { showToast(error.message, 'error'); } else { showToast('Department rep deleted', 'success'); renderSection('Department Reps'); }
      });
    });
  }
  
  await renderReps();
}// HODS

async function renderHODs(content, title) {
  const { data, error } = await supabase.from('hods').select('*').order('department', { ascending: true });
  if (error) { showToast('Failed to load HODs', 'error'); return; }
  
  title.textContent = 'HODs';
  
  const depts = ['Anatomy', 'Physiology', 'Biochemistry'];
  
  function renderHODCard(hod) {
    const editing = hod.department === window._editingHodId;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6" data-hod-dept="${hod.department}">
        ${editing ? `
          <form id="hod-form" class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">${escapeHtml(hod.department)} HOD</h3>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" id="hod-name" value="${escapeHtml(hod.name)}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" id="hod-email" value="${escapeHtml(hod.email || '')}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" id="hod-phone" value="${escapeHtml(hod.phone || '')}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea id="hod-bio" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${escapeHtml(hod.bio || '')}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Photo</label>
              <input type="file" id="hod-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
              ${hod.image_url ? `<img src="${escapeHtml(hod.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" id="hod-current-img" />` : ''}
              <img id="hod-photo-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
            </div>
            <div class="flex gap-3">
              <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
              <button type="button" id="hod-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
            </div>
          </form>
        ` : `
          <h3 class="text-xl font-semibold text-slate-900 mb-2">${escapeHtml(hod.department)}</h3>
          <p class="text-lg font-medium text-slate-700">${escapeHtml(hod.name)}</p>
          ${hod.image_url ? `<img src="${escapeHtml(hod.image_url)}" class="mt-3 h-48 w-full object-cover rounded-lg" />` : ''}
          <button data-action="edit-hod" data-dept="${hod.department}" class="mt-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
        `}
      </div>
    `;
  }
  
  content.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${depts.map(d => {
        const hod = data.find(h => h.department === d) || { department: d, name: '', image_url: '', bio: '', email: '', phone: '' };
        return renderHODCard(hod);
      }).join('')}
    </div>
  `;
  
  document.querySelectorAll('[data-action="edit-hod"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window._editingHodId = btn.dataset.dept;
      renderHODs(content, title);
    });
  });
  
  if (window._editingHodId) {
    document.getElementById('hod-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('hod-name').value.trim();
      const email = document.getElementById('hod-email').value.trim();
      const phone = document.getElementById('hod-phone').value.trim();
      const bio = document.getElementById('hod-bio').value.trim();
      const photoFile = document.getElementById('hod-photo').files[0];
      
      let image_url = data.find(h => h.department === window._editingHodId)?.image_url || null;
      if (photoFile) {
        const url = await uploadPhoto(photoFile, 'executives');
        if (!url) return;
        image_url = url;
      }
      
      const { error } = await supabase.from('hods').upsert({ department: window._editingHodId, name, email, phone, bio, image_url }, { onConflict: ['department'] });
      if (error) { showToast(error.message, 'error'); } else { showToast('HOD updated', 'success'); delete window._editingHodId; renderSection('HODs'); }
    });
    
    document.getElementById('hod-cancel').addEventListener('click', () => { delete window._editingHodId; renderSection('HODs'); });
    
    const photoInput = document.getElementById('hod-photo');
    const preview = document.getElementById('hod-photo-preview');
    if (photoInput && preview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}

// DEPARTMENT IMAGES (card image shown on the public Departments page)

async function renderDepartmentImages(content, title) {
  const { data, error } = await supabase.from('departments').select('*');
  if (error) { showToast('Failed to load departments', 'error'); return; }

  title.textContent = 'Departments';

  const depts = ['Anatomy', 'Physiology', 'Biochemistry'];

  function renderDeptCard(dept) {
    const editing = dept.department === window._editingDeptId;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6" data-dept-name="${dept.department}">
        ${editing ? `
          <form id="dept-form" class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">${escapeHtml(dept.department)}</h3>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Department Image</label>
              <input type="file" id="dept-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
              ${dept.image_url ? `<img src="${escapeHtml(dept.image_url)}" class="mt-2 h-32 w-full object-cover rounded" id="dept-current-img" />` : ''}
              <img id="dept-photo-preview" class="mt-2 h-32 w-full object-cover rounded hidden" />
            </div>
            <div class="flex gap-3">
              <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
              <button type="button" id="dept-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
            </div>
          </form>
        ` : `
          <h3 class="text-xl font-semibold text-slate-900 mb-3">${escapeHtml(dept.department)}</h3>
          ${dept.image_url
            ? `<img src="${escapeHtml(dept.image_url)}" class="h-40 w-full object-cover rounded-lg" />`
            : `<div class="h-40 w-full rounded-lg bg-slate-100 flex items-center justify-center"><span class="text-xs text-slate-400">No image uploaded</span></div>`}
          <button data-action="edit-dept" data-dept="${dept.department}" class="mt-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
        `}
      </div>
    `;
  }

  content.innerHTML = `
    <p class="text-sm text-slate-500 mb-5">Set the card image shown for each department on the public Departments page.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${depts.map(d => {
        const dept = data.find(x => x.department === d) || { department: d, image_url: '' };
        return renderDeptCard(dept);
      }).join('')}
    </div>
  `;

  document.querySelectorAll('[data-action="edit-dept"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window._editingDeptId = btn.dataset.dept;
      renderDepartmentImages(content, title);
    });
  });

  if (window._editingDeptId) {
    document.getElementById('dept-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const photoFile = document.getElementById('dept-photo').files[0];

      let image_url = data.find(d => d.department === window._editingDeptId)?.image_url || null;
      if (photoFile) {
        const url = await uploadPhoto(photoFile, 'gallery');
        if (!url) return;
        image_url = url;
      } else if (!image_url) {
        showToast('Please choose an image to upload', 'error');
        return;
      }

      const { error } = await supabase.from('departments').upsert({ department: window._editingDeptId, image_url }, { onConflict: ['department'] });
      if (error) { showToast(error.message, 'error'); } else { showToast('Department image updated', 'success'); delete window._editingDeptId; renderSection('Departments'); }
    });

    document.getElementById('dept-cancel').addEventListener('click', () => { delete window._editingDeptId; renderSection('Departments'); });

    const photoInput = document.getElementById('dept-photo');
    const preview = document.getElementById('dept-photo-preview');
    if (photoInput && preview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}

// STAFF

function renderStaffCard(staff) {
  return `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <img src="${escapeHtml(staff.image_url || '')}" alt="${escapeHtml(staff.name)}" class="h-48 w-full object-cover ${!staff.image_url ? 'bg-slate-100' : ''}" />
      <div class="p-4 flex-1 flex flex-col">
        <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(staff.name)}</h4>
        <p class="text-sm text-slate-500">${escapeHtml(staff.role)}</p>
        ${staff.department ? `<span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeptBadgeColor(staff.department)} self-start">${escapeHtml(staff.department)}</span>` : ''}
        <div class="mt-auto pt-4 flex gap-2">
          <button data-action="edit-staff" data-id="${staff.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
          <button data-action="delete-staff" data-id="${staff.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  `;
}

async function renderStaff(content, title) {
  title.textContent = 'Staff';

  const staffDepts = ['Anatomy', 'Physiology', 'Biochemistry', 'Administration'];
  const leadershipRoles = ['Dean', 'Provost'];

  const [{ data: staffList, error: staffErr }, { data: leadership, error: leadErr }] = await Promise.all([
    supabase.from('staff').select('*').order('display_order', { ascending: true }),
    supabase.from('college_leadership').select('*').order('role', { ascending: true }),
  ]);
  if (staffErr) { showToast('Failed to load staff', 'error'); return; }
  if (leadErr) { showToast('Failed to load college leadership', 'error'); return; }

  function renderLeadershipCard(entry) {
    const editing = entry.role === window._editingLeadershipRole;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6" data-leadership-role="${entry.role}">
        ${editing ? `
          <form id="leadership-form" class="space-y-4">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">${escapeHtml(entry.role)}</h3>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" id="leadership-name" value="${escapeHtml(entry.name || '')}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea id="leadership-bio" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${escapeHtml(entry.bio || '')}</textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Photo</label>
              <input type="file" id="leadership-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
              ${entry.image_url ? `<img src="${escapeHtml(entry.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
              <img id="leadership-photo-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
            </div>
            <div class="flex gap-3">
              <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
              <button type="button" id="leadership-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
            </div>
          </form>
        ` : `
          <h3 class="text-xl font-semibold text-slate-900 mb-2">${escapeHtml(entry.role)}</h3>
          <p class="text-lg font-medium text-slate-700">${escapeHtml(entry.name || 'Not yet assigned')}</p>
          ${entry.image_url ? `<img src="${escapeHtml(entry.image_url)}" class="mt-3 h-48 w-full object-cover rounded-lg" />` : ''}
          ${entry.bio ? `<p class="mt-3 text-sm text-slate-600">${escapeHtml(entry.bio)}</p>` : ''}
          <button data-action="edit-leadership" data-role="${entry.role}" class="mt-4 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
        `}
      </div>
    `;
  }

  function renderStaffForm(staffMember = null) {
    const isEdit = !!staffMember;
    return `
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">${isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
        <form id="staff-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" id="staff-name" required value="${staffMember ? escapeHtml(staffMember.name) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <input type="text" id="staff-role" required value="${staffMember ? escapeHtml(staffMember.role) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select id="staff-dept" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
                ${staffDepts.map(d => `<option value="${d}" ${staffMember && staffMember.department === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input type="number" id="staff-order" value="${staffMember ? staffMember.display_order || 0 : 0}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" id="staff-email" value="${staffMember ? escapeHtml(staffMember.email || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" id="staff-phone" value="${staffMember ? escapeHtml(staffMember.phone || '') : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea id="staff-bio" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${staffMember ? escapeHtml(staffMember.bio || '') : ''}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Photo</label>
            <input type="file" id="staff-photo" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            ${staffMember && staffMember.image_url ? `<img src="${escapeHtml(staffMember.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
            <img id="staff-photo-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">${isEdit ? 'Update' : 'Save'}</button>
            ${isEdit ? `<button type="button" id="staff-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>` : ''}
          </div>
        </form>
      </div>
    `;
  }

  let editingStaffId = null;
  let isStaffAddMode = false;

  async function renderStaffSection() {
    const leadershipBlock = `
      <div class="mb-8">
        <h3 class="text-base font-semibold text-slate-900 mb-3">Faculty Leadership</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          ${leadershipRoles.map(r => {
            const entry = leadership.find(l => l.role === r) || { role: r, name: '', image_url: '', bio: '' };
            return renderLeadershipCard(entry);
          }).join('')}
        </div>
      </div>
    `;

    if (editingStaffId || isStaffAddMode) {
      const staffMember = editingStaffId ? staffList.find(s => s.id === editingStaffId) : null;
      content.innerHTML = leadershipBlock + renderStaffForm(staffMember) + `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${staffList.map(renderStaffCard).join('')}</div>`;
    } else {
      content.innerHTML = leadershipBlock + `
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-base font-semibold text-slate-900">Department & Admin Staff</h3>
          <button id="staff-add" class="px-4 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Add Staff Member</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${staffList.length ? staffList.map(renderStaffCard).join('') : '<p class="text-slate-500 col-span-full">No staff members yet.</p>'}
        </div>
      `;
    }
    bindStaffEvents();
  }

  function bindStaffEvents() {
    document.getElementById('staff-add')?.addEventListener('click', () => { isStaffAddMode = true; editingStaffId = null; renderStaffSection(); });
    document.getElementById('staff-cancel')?.addEventListener('click', () => { isStaffAddMode = false; editingStaffId = null; renderSection('Staff'); });

    const photoInput = document.getElementById('staff-photo');
    const preview = document.getElementById('staff-photo-preview');
    if (photoInput && preview) {
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
          reader.readAsDataURL(file);
        }
      });
    }

    document.getElementById('staff-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('staff-name').value.trim();
      const role = document.getElementById('staff-role').value.trim();
      const dept = document.getElementById('staff-dept').value;
      const order = parseInt(document.getElementById('staff-order').value) || 0;
      const email = document.getElementById('staff-email').value.trim();
      const phone = document.getElementById('staff-phone').value.trim();
      const bio = document.getElementById('staff-bio').value.trim();
      const photoFile = document.getElementById('staff-photo').files[0];

      let image_url = staffList.find(s => s.id === editingStaffId)?.image_url || null;
      if (photoFile) {
        const url = await uploadPhoto(photoFile, 'staff');
        if (!url) return;
        image_url = url;
      }

      const payload = { name, role, department: dept, bio, email, phone, display_order: order, image_url };

      let error;
      if (editingStaffId) {
        ({ error } = await supabase.from('staff').update(payload).eq('id', editingStaffId));
      } else {
        ({ error } = await supabase.from('staff').insert([payload]));
      }

      if (error) { showToast(error.message, 'error'); } else { showToast(editingStaffId ? 'Staff member updated' : 'Staff member added', 'success'); renderSection('Staff'); }
    });

    document.querySelectorAll('[data-action="edit-staff"][data-id]').forEach(btn => {
      btn.addEventListener('click', () => { isStaffAddMode = false; editingStaffId = btn.dataset.id; renderStaffSection(); });
    });
    document.querySelectorAll('[data-action="delete-staff"][data-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const confirmed = await showConfirm('Delete this staff member? This cannot be undone.');
        if (!confirmed) return;
        const { error } = await supabase.from('staff').delete().eq('id', id);
        if (error) { showToast(error.message, 'error'); } else { showToast('Staff member deleted', 'success'); renderSection('Staff'); }
      });
    });

    document.querySelectorAll('[data-action="edit-leadership"]').forEach(btn => {
      btn.addEventListener('click', () => { window._editingLeadershipRole = btn.dataset.role; renderStaffSection(); });
    });

    if (window._editingLeadershipRole) {
      document.getElementById('leadership-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const role = window._editingLeadershipRole;
        const name = document.getElementById('leadership-name').value.trim();
        const bio = document.getElementById('leadership-bio').value.trim();
        const photoFile = document.getElementById('leadership-photo').files[0];

        let image_url = leadership.find(l => l.role === role)?.image_url || null;
        if (photoFile) {
          const url = await uploadPhoto(photoFile, 'staff');
          if (!url) return;
          image_url = url;
        }

        const { error } = await supabase.from('college_leadership').upsert({ role, name, bio, image_url }, { onConflict: ['role'] });
        if (error) { showToast(error.message, 'error'); } else { showToast(`${role} info updated`, 'success'); delete window._editingLeadershipRole; renderSection('Staff'); }
      });
      document.getElementById('leadership-cancel')?.addEventListener('click', () => { delete window._editingLeadershipRole; renderSection('Staff'); });

      const leadershipPhotoInput = document.getElementById('leadership-photo');
      const leadershipPreview = document.getElementById('leadership-photo-preview');
      if (leadershipPhotoInput && leadershipPreview) {
        leadershipPhotoInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => { leadershipPreview.src = ev.target.result; leadershipPreview.classList.remove('hidden'); };
            reader.readAsDataURL(file);
          }
        });
      }
    }
  }

  await renderStaffSection();
}

// NEWS & UPDATES

const newsTags = ['Announcement', 'Academic', 'Outreach', 'Event', 'Welfare'];

function renderNewsCard(item) {
  return `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col" data-id="${item.id}">
      ${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" class="h-40 w-full object-cover" />` : ''}
      <div class="p-4 flex-1 flex flex-col">
        <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(item.title)}</h4>
        ${item.tag ? `<span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 self-start">${escapeHtml(item.tag)}</span>` : ''}
        <p class="text-xs text-slate-500 mt-2">${item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</p>
        <div class="mt-3 text-sm text-slate-600 line-clamp-3">${item.body || ''}</div>
        <div class="mt-auto pt-4 flex gap-2">
          <button data-action="edit-news" data-id="${item.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
          <button data-action="delete-news" data-id="${item.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
        </div>
      </div>
    </div>
  `;
}

async function renderNews(content, title) {
  title.textContent = 'News & Updates';

  const { data: newsList, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load news', 'error'); return; }

  content.innerHTML = `
    <div class="space-y-6">
      <form id="add-news-form" class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Post an Update</h3>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input type="text" id="news-title" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Body</label>
          <div id="news-editor" class="bg-white rounded-lg border border-slate-300" style="min-height: 120px;"></div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
          <select id="news-tag" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            ${newsTags.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Image (optional)</label>
          <input type="file" id="news-image" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <img id="news-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <button type="submit" class="mt-4 px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Publish</button>
      </form>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${newsList.length ? newsList.map(renderNewsCard).join('') : '<p class="text-slate-500 col-span-full">No updates posted yet.</p>'}
      </div>
    </div>
  `;

  initQuill('#news-editor');

  document.getElementById('news-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('news-preview').src = ev.target.result; document.getElementById('news-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('add-news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newsTitle = document.getElementById('news-title').value.trim();
    const body = _quillInstance.root.innerHTML;
    const tag = document.getElementById('news-tag').value;
    const file = document.getElementById('news-image').files[0];

    let image_url = null;
    if (file) {
      const url = await uploadPhoto(file, 'news');
      if (!url) return;
      image_url = url;
    }

    const { error: insertErr } = await supabase.from('news').insert([{ title: newsTitle, body, tag, image_url }]);
    if (insertErr) { showToast(insertErr.message, 'error'); } else { showToast('Update published', 'success'); renderSection('News & Updates'); }
  });

  document.querySelectorAll('[data-action="edit-news"]').forEach(btn => {
    btn.addEventListener('click', () => { editNews(btn.dataset.id); });
  });

  document.querySelectorAll('[data-action="delete-news"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmed = await showConfirm('Permanently delete this update? This cannot be undone.');
      if (!confirmed) return;
      const { error: delErr } = await supabase.from('news').delete().eq('id', id);
      if (delErr) { showToast(delErr.message, 'error'); } else { showToast('Update deleted', 'success'); renderSection('News & Updates'); }
    });
  });
}

async function editNews(id) {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
  if (error) { showToast('Failed to load update', 'error'); return; }

  const content = document.getElementById('section-content');
  const title = document.getElementById('section-title');
  title.textContent = 'Edit Update';

  content.innerHTML = `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Edit Update</h3>
      <form id="edit-news-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input type="text" id="edit-news-title" value="${escapeHtml(data.title)}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Body</label>
          <div id="edit-news-editor" class="bg-white rounded-lg border border-slate-300" style="min-height: 120px;"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
          <select id="edit-news-tag" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            ${newsTags.map(t => `<option value="${t}" ${data.tag === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" id="edit-news-image" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          ${data.image_url ? `<img src="${escapeHtml(data.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
          <img id="edit-news-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <div class="flex gap-3">
          <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
          <button type="button" id="edit-news-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
        </div>
      </form>
    </div>
  `;

  initQuill('#edit-news-editor', data.body);

  document.getElementById('edit-news-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('edit-news-preview').src = ev.target.result; document.getElementById('edit-news-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('edit-news-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newsTitle = document.getElementById('edit-news-title').value.trim();
    const body = _quillInstance.root.innerHTML;
    const tag = document.getElementById('edit-news-tag').value;
    const file = document.getElementById('edit-news-image').files[0];

    let image_url = data.image_url;
    if (file) {
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        await supabase.storage.from('news').remove([oldPath]);
      }
      const url = await uploadPhoto(file, 'news');
      if (!url) return;
      image_url = url;
    }

    const { error: updateErr } = await supabase.from('news').update({ title: newsTitle, body, tag, image_url }).eq('id', id);
    if (updateErr) { showToast(updateErr.message, 'error'); } else { showToast('Update saved', 'success'); renderSection('News & Updates'); }
  });

  document.getElementById('edit-news-cancel').addEventListener('click', () => { renderSection('News & Updates'); });
}

// MARKETPLACE (moderation only — listings are posted publicly with no login)

async function renderMarketplaceAdmin(content, title) {
  title.textContent = 'Marketplace';

  const { data, error } = await supabase.from('marketplace_products').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load marketplace listings', 'error'); return; }

  function isExpired(p) { return new Date(p.expires_at).getTime() < Date.now(); }

  content.innerHTML = `
    <p class="text-sm text-slate-500 mb-4">Anyone can post a listing without logging in. Use this page to remove anything inappropriate or spammy before its 5-day window ends.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${data.length ? data.map(p => `
        <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          ${p.image_urls && p.image_urls[0] ? `<img src="${escapeHtml(p.image_urls[0])}" class="h-40 w-full object-cover" />` : ''}
          <div class="p-4 flex-1 flex flex-col">
            <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 self-start">${escapeHtml(p.category || 'Other')}</span>
            <h4 class="text-lg font-semibold text-slate-900 mt-2">${escapeHtml(p.title)}</h4>
            <p class="text-sm text-slate-600">₦${Number(p.price).toLocaleString()}</p>
            <p class="text-xs text-slate-500 mt-1">WhatsApp: ${escapeHtml(p.whatsapp_number)}</p>
            <p class="text-xs ${isExpired(p) ? 'text-red-500' : 'text-slate-400'} mt-1">${isExpired(p) ? 'Expired' : 'Expires'} ${new Date(p.expires_at).toLocaleDateString()}</p>
            <div class="mt-auto pt-4">
              <button data-action="delete-product" data-id="${p.id}" class="w-full text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete Listing</button>
            </div>
          </div>
        </div>
      `).join('') : '<p class="text-slate-500 col-span-full">No marketplace listings yet.</p>'}
    </div>
  `;

  document.querySelectorAll('[data-action="delete-product"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const product = data.find(p => p.id === id);
      const confirmed = await showConfirm('Delete this listing? This cannot be undone.');
      if (!confirmed) return;
      if (product && product.image_urls && product.image_urls.length) {
        const paths = product.image_urls.map(url => url.split('/').pop());
        await supabase.storage.from('marketplace').remove(paths);
      }
      const { error: delErr } = await supabase.from('marketplace_products').delete().eq('id', id);
      if (delErr) { showToast(delErr.message, 'error'); } else { showToast('Listing deleted', 'success'); renderSection('Marketplace'); }
    });
  });
}

// E-LIBRARY

async function renderELibrary(content, title) {
  title.textContent = 'E-Library';

  const { data, error } = await supabase.from('site_links').select('*').eq('key', 'e_library').maybeSingle();
  if (error) { showToast('Failed to load E-Library link', 'error'); return; }

  content.innerHTML = `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6 max-w-xl">
      <h3 class="text-lg font-semibold text-slate-900 mb-2">E-Library Link</h3>
      <p class="text-sm text-slate-500 mb-4">Paste the Google Drive link students should land on when they tap "E-Library" in the navbar.</p>
      <form id="elibrary-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Google Drive Link</label>
          <input type="url" id="elibrary-url" required placeholder="https://drive.google.com/..." value="${data && data.url ? escapeHtml(data.url) : ''}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save Link</button>
      </form>
      ${data && data.url ? `<p class="mt-4 text-xs text-slate-500">Currently live: <a href="${escapeHtml(data.url)}" target="_blank" class="text-[#2f6df6] hover:underline">${escapeHtml(data.url)}</a></p>` : '<p class="mt-4 text-xs text-slate-500">No link set yet — the E-Library button will tell students to check back soon.</p>'}
    </div>
  `;

  document.getElementById('elibrary-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('elibrary-url').value.trim();
    if (!/^https?:\/\//i.test(url)) { showToast('Please enter a valid link starting with http:// or https://', 'error'); return; }
    const { error: upsertErr } = await supabase.from('site_links').upsert({ key: 'e_library', url, updated_at: new Date().toISOString() }, { onConflict: ['key'] });
    if (upsertErr) { showToast(upsertErr.message, 'error'); } else { showToast('E-Library link saved', 'success'); renderSection('E-Library'); }
  });
}

// GALLERY

async function renderGallery(content, title) {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Failed to load gallery', 'error'); return; }
  
  title.textContent = 'Gallery';
  
  const depts = ['All', 'Anatomy', 'Physiology', 'Biochemistry', 'General'];
  window._galleryFilter = window._galleryFilter || 'All';
  
  const filteredData = window._galleryFilter === 'All' ? data : data.filter(item => item.department === window._galleryFilter);
  
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex gap-2 mb-4">
        ${depts.map(d => `
          <button data-filter="${d}" class="px-4 py-2 rounded-full text-sm ${window._galleryFilter === d ? 'bg-[#2f6df6] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition">${d}</button>
        `).join('')}
      </div>
      
      <form id="add-gallery-form" class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Add Image</h3>
        <div class="mb-4">
          <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" id="gallery-show-details" class="h-4 w-4 rounded border-slate-300 text-[#2f6df6] focus:ring-[#2f6df6]" />
            Add title, caption &amp; tag (optional)
          </label>
        </div>
        <div id="gallery-details-fields" class="hidden">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" id="gallery-title" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Caption</label>
            <textarea id="gallery-caption" rows="2" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]"></textarea>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
            <input type="text" id="gallery-tag" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select id="gallery-dept" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            ${depts.slice(1).map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" id="gallery-image" accept="image/*" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <img id="gallery-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <button type="submit" class="mt-4 px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
      </form>
      
      <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Bulk Upload</h3>
        <div class="flex flex-col sm:flex-row gap-4">
          <input type="file" id="bulk-images" accept="image/*" multiple class="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <select id="bulk-dept" required class="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
            ${depts.slice(1).map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
          <button id="bulk-upload-btn" class="px-6 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition">Upload</button>
        </div>
        <p id="bulk-progress" class="mt-2 text-sm text-slate-500 hidden"></p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${filteredData.map(item => `
          <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col" data-id="${item.id}">
            <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" class="h-48 w-full object-cover" />
            <div class="p-4 flex-1 flex flex-col">
              <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(item.title)}</h4>
              <p class="text-sm text-slate-500 mt-1 line-clamp-2">${escapeHtml(item.caption || '')}</p>
              <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeptBadgeColor(item.department)} self-start">${escapeHtml(item.department)}</span>
              <p class="text-xs text-slate-400 mt-2">${escapeHtml(item.tag || '')}</p>
              <div class="mt-auto pt-4 flex gap-2">
                <button data-action="edit-gallery" data-id="${item.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
                <button data-action="delete-gallery" data-id="${item.id}" data-url="${escapeHtml(item.image_url)}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => { window._galleryFilter = btn.dataset.filter; renderGallery(content, title); });
  });
  
  document.getElementById('gallery-show-details')?.addEventListener('change', (e) => {
    document.getElementById('gallery-details-fields').classList.toggle('hidden', !e.target.checked);
  });

  document.getElementById('add-gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dept = document.getElementById('gallery-dept').value;
    const caption = document.getElementById('gallery-caption')?.value.trim() || '';
    const tag = document.getElementById('gallery-tag')?.value.trim() || '';
    const file = document.getElementById('gallery-image').files[0];

    if (!file) return;
    const titleVal = document.getElementById('gallery-title')?.value.trim() || file.name.replace(/\.[^/.]+$/, '');
    const url = await uploadPhoto(file, 'gallery');
    if (!url) return;
    
    const { error } = await supabase.from('gallery').insert([{ title: titleVal, department: dept, caption, tag, image_url: url }]);
    if (error) { showToast(error.message, 'error'); } else { showToast('Image added', 'success'); renderSection('Gallery'); }
  });
  
  document.getElementById('gallery-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('gallery-preview').src = ev.target.result; document.getElementById('gallery-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById('bulk-upload-btn').addEventListener('click', async () => {
    const files = document.getElementById('bulk-images').files;
    const dept = document.getElementById('bulk-dept').value;
    if (!files.length) return;
    
    const progress = document.getElementById('bulk-progress');
    progress.classList.remove('hidden');
    
    for (let i = 0; i < files.length; i++) {
      progress.textContent = `Uploading ${i + 1} of ${files.length}...`;
      const file = files[i];
      const titleVal = file.name.replace(/\.[^/.]+$/, '');
      const url = await uploadPhoto(file, 'gallery');
      if (!url) continue;
      await supabase.from('gallery').insert([{ title: titleVal, department: dept, caption: '', tag: '', image_url: url }]);
    }
    
    showToast(`${files.length} images uploaded`, 'success');
    renderSection('Gallery');
  });
  
  document.querySelectorAll('[data-action="edit-gallery"]').forEach(btn => {
    btn.addEventListener('click', () => { editGallery(btn.dataset.id); });
  });
  
    document.querySelectorAll('[data-action="delete-gallery"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const url = btn.dataset.url;
        const confirmed = await showConfirm('Delete this image? This cannot be undone.');
        if (!confirmed) return;
        if (url) {
          const path = url.split('/').pop();
          await supabase.storage.from('gallery').remove([path]);
        }
        await supabase.from('gallery').delete().eq('id', id);
        showToast('Image deleted', 'success');
        renderSection('Gallery');
      });
    });
}

// SUGGESTIONS

async function renderSuggestions(content, title) {
  await supabase.from('suggestions').delete().lt('created_at', new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString());

  const { data, error, count } = await supabase.from('suggestions').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (error) { showToast('Failed to load suggestions', 'error'); return; }

  title.textContent = 'Suggestions';

  const suggestions = data || [];

  content.innerHTML = `
    <div class="mb-4">
      <p class="text-sm text-slate-500">${count ?? suggestions.length} suggestions received</p>
    </div>
    ${suggestions.length === 0 ? `<p class="text-slate-500">No suggestions yet.</p>` : `
      <div class="space-y-4">
        ${suggestions.map(s => `
          <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
            <p class="text-slate-900 whitespace-pre-wrap">${escapeHtml(s.message)}</p>
            <p class="mt-3 text-xs text-slate-400">${new Date(s.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <button data-action="delete-suggestion" data-id="${s.id}" class="mt-3 px-4 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition text-xs">Delete</button>
          </div>
        `).join('')}
      </div>
    `}
  `;

  document.querySelectorAll('[data-action="delete-suggestion"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const { error } = await supabase.from('suggestions').delete().eq('id', btn.dataset.id);
      if (error) { showToast(error.message, 'error'); } else { showToast('Suggestion deleted', 'success'); renderSuggestions(content, title); }
    });
  });
}

async function editGallery(id) {
  const { data, error } = await supabase.from('gallery').select('*').eq('id', id).single();
  if (error) { showToast('Failed to load image', 'error'); return; }
  
  const content = document.getElementById('section-content');
  const title = document.getElementById('section-title');
  
  title.textContent = 'Edit Image';
  content.innerHTML = `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Edit Image</h3>
      <form id="edit-gallery-form" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" id="edit-gallery-title" value="${escapeHtml(data.title)}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select id="edit-gallery-dept" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
              <option value="Anatomy" ${data.department === 'Anatomy' ? 'selected' : ''}>Anatomy</option>
              <option value="Physiology" ${data.department === 'Physiology' ? 'selected' : ''}>Physiology</option>
              <option value="Biochemistry" ${data.department === 'Biochemistry' ? 'selected' : ''}>Biochemistry</option>
              <option value="General" ${data.department === 'General' ? 'selected' : ''}>General</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Caption</label>
          <textarea id="edit-gallery-caption" rows="2" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">${escapeHtml(data.caption || '')}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
          <input type="text" id="edit-gallery-tag" value="${escapeHtml(data.tag || '')}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" id="edit-gallery-image" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          ${data.image_url ? `<img src="${escapeHtml(data.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
          <img id="edit-gallery-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <div class="flex gap-3">
          <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
          <button type="button" id="edit-gallery-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
        </div>
      </form>
    </div>
  `;
  
  document.getElementById('edit-gallery-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const titleVal = document.getElementById('edit-gallery-title').value.trim();
    const dept = document.getElementById('edit-gallery-dept').value;
    const caption = document.getElementById('edit-gallery-caption').value.trim();
    const tag = document.getElementById('edit-gallery-tag').value.trim();
    const file = document.getElementById('edit-gallery-image').files[0];
    
    let image_url = data.image_url;
    if (file) {
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        await supabase.storage.from('gallery').remove([oldPath]);
      }
      const url = await uploadPhoto(file, 'gallery');
      if (!url) return;
      image_url = url;
    }
    
    const { error: updateErr } = await supabase.from('gallery').update({ title: titleVal, department: dept, caption, tag, image_url }).eq('id', id);
    if (updateErr) { showToast(updateErr.message, 'error'); } else { showToast('Image updated', 'success'); renderSection('Gallery'); }
  });
  
  document.getElementById('edit-gallery-cancel').addEventListener('click', () => { renderSection('Gallery'); });
  
  document.getElementById('edit-gallery-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('edit-gallery-preview').src = ev.target.result; document.getElementById('edit-gallery-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });
}
// ACHIEVEMENTS

let _quillInstance = null;

function initQuill(selector, initialContent = '') {
  if (_quillInstance) { _quillInstance.destroy(); }
  _quillInstance = new Quill(selector, {
    theme: 'snow',
    placeholder: 'Description...',
    modules: { toolbar: [['bold', 'italic', 'underline', 'link'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]] }
  });
  if (initialContent) { _quillInstance.clipboard.dangerouslyPasteHTML(initialContent); }
  return _quillInstance;
}

async function renderAchievements(content, title) {
  const admins = await fetchAdministrations();
  const currentAdmin = admins.find(a => a.is_current) || admins[0];
  const filterId = currentAdmin ? currentAdmin.id : 'all';
  
  title.textContent = 'Achievements';
  
  const { data: achievements, error } = await supabase.from('achievements').select("*, administrations!inner(session_label)").order('created_at', { ascending: false });
  if (error) { showToast('Failed to load achievements', 'error'); return; }
  
  const acheiveTags = ['Academic', 'Welfare', 'Outreach', 'Sports', 'Community', 'Financial'];
  
  content.innerHTML = `
    <div class="space-y-6">
      <select id="achieve-filter" class="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
        <option value="all">All Administrations</option>
        ${admins.map(a => `<option value="${a.id}" ${filterId == a.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
      </select>
      
      <form id="add-achieve-form" class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Add Achievement</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Administration</label>
            <select id="achieve-admin" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
              ${admins.map(a => `<option value="${a.id}" ${currentAdmin && a.id == currentAdmin.id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" id="achieve-title" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <div id="achieve-editor" class="bg-white rounded-lg border border-slate-300" style="min-height: 120px;"></div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" id="achieve-date" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
          <input type="text" id="achieve-tag" placeholder="${acheiveTags.join(', ')}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" id="achieve-image" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <img id="achieve-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <button type="submit" class="mt-4 px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
      </form>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${achievements.map(ach => `
          <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col" data-id="${ach.id}">
            ${ach.image_url ? `<img src="${escapeHtml(ach.image_url)}" alt="${escapeHtml(ach.title)}" class="h-40 w-full object-cover" />` : ''}
            <div class="p-4 flex-1 flex flex-col">
              <h4 class="text-lg font-semibold text-slate-900">${escapeHtml(ach.title)}</h4>
              <span class="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 self-start">${escapeHtml(ach.tag || '')}</span>
              <p class="text-xs text-slate-500 mt-2">${ach.administrations?.session_label || ''}</p>
              <p class="text-xs text-slate-500 mt-1">${ach.date ? new Date(ach.date).toLocaleDateString() : ''}</p>
              <p class="text-sm text-slate-600 mt-2 line-clamp-2">${escapeHtml(ach.description || '')}</p>
              <div class="mt-auto pt-4 flex gap-2">
                <button data-action="edit-achieve" data-id="${ach.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Edit</button>
                <button data-action="delete-achieve" data-id="${ach.id}" class="flex-1 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition">Delete</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  initQuill('#achieve-editor');
  
  document.getElementById('achieve-filter').addEventListener('change', () => { renderSection('Achievements'); });
  
  document.getElementById('add-achieve-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminId = document.getElementById('achieve-admin').value;
    const title = document.getElementById('achieve-title').value.trim();
    const description = _quillInstance.root.innerHTML;
    const date = document.getElementById('achieve-date').value;
    const tag = document.getElementById('achieve-tag').value.trim();
    const file = document.getElementById('achieve-image').files[0];
    
    let image_url = null;
    if (file) {
      const url = await uploadPhoto(file, 'executives');
      if (!url) return;
      image_url = url;
    }
    
    const { data: inserted, error } = await supabase.from('achievements').insert([{ administration_id: adminId, title, description, date, tag, image_url }]).select().single();
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Achievement added — add gallery images below', 'success');
    editAchievement(inserted.id);
  });
  
  document.getElementById('achieve-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('achieve-preview').src = ev.target.result; document.getElementById('achieve-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });
  
  document.querySelectorAll('[data-action="edit-achieve"]').forEach(btn => {
    btn.addEventListener('click', () => { editAchievement(btn.dataset.id); });
  });
  
  document.querySelectorAll('[data-action="delete-achieve"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const confirmed = await showConfirm('Delete this achievement? This cannot be undone.');
      if (!confirmed) return;
      await supabase.from('achievements').delete().eq('id', id);
      showToast('Achievement deleted', 'success');
      renderSection('Achievements');
    });
  });
}

async function editAchievement(id) {
  const { data, error } = await supabase.from('achievements').select("*, administrations!inner(session_label)").eq('id', id).single();
  if (error) { showToast('Failed to load achievement', 'error'); return; }
  
  const content = document.getElementById('section-content');
  const title = document.getElementById('section-title');
  const admins = await fetchAdministrations();
  
  title.textContent = 'Edit Achievement';
  content.innerHTML = `
    <div class="bg-white rounded-[1.75rem] border border-slate-200 shadow-sm p-6">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Edit Achievement</h3>
      <form id="edit-achieve-form" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Administration</label>
            <select id="edit-achieve-admin" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]">
              ${admins.map(a => `<option value="${a.id}" ${a.id == data.administration_id ? 'selected' : ''}>${escapeHtml(a.session_label)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" id="edit-achieve-title" value="${escapeHtml(data.title)}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <div id="edit-achieve-editor" class="bg-white rounded-lg border border-slate-300" style="min-height: 120px;"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" id="edit-achieve-date" value="${data.date || ''}" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tag</label>
          <input type="text" id="edit-achieve-tag" value="${escapeHtml(data.tag || '')}" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Image</label>
          <input type="file" id="edit-achieve-image" accept="image/*" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          ${data.image_url ? `<img src="${escapeHtml(data.image_url)}" class="mt-2 h-24 w-24 object-cover rounded" />` : ''}
          <img id="edit-achieve-preview" class="mt-2 h-24 w-24 object-cover rounded hidden" />
        </div>
        <div class="flex gap-3">
          <button type="submit" class="px-6 py-2 rounded-lg bg-[#2f6df6] text-white font-semibold hover:bg-blue-600 transition">Save</button>
          <button type="button" id="edit-achieve-cancel" class="px-6 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition">Cancel</button>
        </div>
      </form>
      <div class="mt-8 pt-6 border-t border-slate-200">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Gallery Images</h4>
        <p class="text-sm text-slate-500 mb-4">These extra photos show up on the achievement's "See more" detail page.</p>
        <div id="achieve-gallery-list" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"></div>
        <div class="flex items-center gap-3">
          <input type="file" id="achieve-gallery-add-input" accept="image/*" class="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#2f6df6]" />
          <button type="button" id="achieve-gallery-add-btn" class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition whitespace-nowrap">Add Image</button>
        </div>
      </div>
    </div>
  `;

  async function loadAchievementGallery() {
    const listEl = document.getElementById('achieve-gallery-list');
    if (!listEl) return;
    const { data: images, error: imgErr } = await supabase.from('achievement_images').select('*').eq('achievement_id', id).order('display_order', { ascending: true });
    if (imgErr) { listEl.innerHTML = '<p class="text-sm text-red-500 col-span-full">Could not load gallery images.</p>'; return; }
    listEl.innerHTML = images.length
      ? images.map(img => `
          <div class="relative group" data-img-id="${img.id}">
            <img src="${escapeHtml(img.image_url)}" class="h-24 w-full object-cover rounded-lg" />
            <button type="button" data-action="delete-achieve-img" data-id="${img.id}" data-path="${escapeHtml(img.image_url.split('/').pop())}" class="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700">&times;</button>
          </div>
        `).join('')
      : '<p class="text-sm text-slate-500 col-span-full">No gallery images yet.</p>';

    listEl.querySelectorAll('[data-action="delete-achieve-img"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const confirmed = await showConfirm('Remove this image from the gallery?');
        if (!confirmed) return;
        await supabase.storage.from('executives').remove([btn.dataset.path]);
        await supabase.from('achievement_images').delete().eq('id', btn.dataset.id);
        showToast('Image removed', 'success');
        loadAchievementGallery();
      });
    });
  }

  document.getElementById('achieve-gallery-add-btn').addEventListener('click', async () => {
    const input = document.getElementById('achieve-gallery-add-input');
    const file = input.files[0];
    if (!file) { showToast('Choose an image first', 'error'); return; }
    const url = await uploadPhoto(file, 'executives');
    if (!url) return;
    const { error: insertErr } = await supabase.from('achievement_images').insert([{ achievement_id: id, image_url: url }]);
    if (insertErr) { showToast(insertErr.message, 'error'); return; }
    input.value = '';
    showToast('Image added', 'success');
    loadAchievementGallery();
  });

  loadAchievementGallery();
  
  initQuill('#edit-achieve-editor', data.description);
  
  document.getElementById('edit-achieve-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const adminId = document.getElementById('edit-achieve-admin').value;
    const title = document.getElementById('edit-achieve-title').value.trim();
    const description = _quillInstance.root.innerHTML;
    const date = document.getElementById('edit-achieve-date').value;
    const tag = document.getElementById('edit-achieve-tag').value.trim();
    const file = document.getElementById('edit-achieve-image').files[0];
    
    let image_url = data.image_url;
    if (file) {
      if (data.image_url) {
        const oldPath = data.image_url.split('/').pop();
        await supabase.storage.from('executives').remove([oldPath]);
      }
      const url = await uploadPhoto(file, 'executives');
      if (!url) return;
      image_url = url;
    }
    
    const { error: updateErr } = await supabase.from('achievements').update({ administration_id: adminId, title, description, date, tag, image_url }).eq('id', id);
    if (updateErr) { showToast(updateErr.message, 'error'); } else { showToast('Achievement updated', 'success'); renderSection('Achievements'); }
  });
  
  document.getElementById('edit-achieve-cancel').addEventListener('click', () => { renderSection('Achievements'); });
  
  document.getElementById('edit-achieve-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { document.getElementById('edit-achieve-preview').src = ev.target.result; document.getElementById('edit-achieve-preview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  });
}

});
