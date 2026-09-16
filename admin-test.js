/**
 * KundiKamado Netherlands - Market Test Admin Dashboard Logic
 */

(function() {
  'use strict';

  let adminToken = sessionStorage.getItem('kk_nl_admin_token') || '';

  function formatEur(amount) {
    return '€' + Number(amount || 0).toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ',-';
  }

  function formatPct(val) {
    return (Number(val || 0) * 100).toFixed(1) + '%';
  }

  function formatDate(isoStr) {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  }

  // --- AUTH CHECK ---
  function showAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('dashboardContent').style.display = 'none';
  }

  function hideAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
  }

  async function loadDashboardData() {
    if (!adminToken) {
      showAuthOverlay();
      return;
    }

    try {
      const resp = await fetch('/api/market-test/stats', {
        headers: { 'Authorization': 'Bearer ' + adminToken }
      });

      if (resp.status === 401) {
        sessionStorage.removeItem('kk_nl_admin_token');
        adminToken = '';
        showAuthOverlay();
        document.getElementById('authError').textContent = 'Ongeldig wachtwoord.';
        return;
      }

      if (!resp.ok) {
        throw new Error('Fout bij ophalen statistieken.');
      }

      const data = await resp.json();
      hideAuthOverlay();
      renderDashboard(data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      alert('Kon marktstatistieken niet inladen: ' + err.message);
    }
  }

  function renderDashboard(data) {
    const { overview, funnel, models, colors, accessories, combinations, timeline, intents, abandoned } = data;

    // 1. KPI Cards
    document.getElementById('kpiVisitors').textContent = overview.totalVisitors.toLocaleString('nl-NL');
    document.getElementById('kpiCarts').textContent = overview.totalCarts.toLocaleString('nl-NL');
    document.getElementById('kpiCartRate').textContent = `${formatPct(overview.cartConversionRate)} van bezoekers`;

    document.getElementById('kpiCheckouts').textContent = overview.totalCheckouts.toLocaleString('nl-NL');
    document.getElementById('kpiCheckoutRate').textContent = `${formatPct(overview.checkoutConversionRate)} van bezoekers`;

    document.getElementById('kpiIntents').textContent = overview.totalIntents.toLocaleString('nl-NL');
    document.getElementById('kpiIntentRate').textContent = `${formatPct(overview.overallConversionRate)} overall conversie`;

    document.getElementById('kpiRevenue').textContent = formatEur(overview.hypotheticalRevenue);
    document.getElementById('kpiAov').textContent = `Gem. order: ${formatEur(overview.averageOrderValue)}`;

    document.getElementById('kpiKamadoUnits').textContent = overview.totalKamadoUnits.toLocaleString('nl-NL');

    document.getElementById('kpiAbandoned').textContent = overview.totalAbandoned.toLocaleString('nl-NL');
    document.getElementById('kpiLostRevenue').textContent = `${formatEur(overview.lostRevenue)} potentieel verlies`;

    // 2. Funnel Visualizer
    document.getElementById('funnelStep1').textContent = funnel.visitors;
    document.getElementById('funnelStep2').textContent = funnel.carts;
    document.getElementById('funnelRate2').textContent = formatPct(funnel.cartRate);
    document.getElementById('funnelDrop2').textContent = `-${formatPct(funnel.cartDropoff)} drop-off`;

    document.getElementById('funnelStep3').textContent = funnel.checkouts;
    document.getElementById('funnelRate3').textContent = formatPct(funnel.checkoutRate);
    document.getElementById('funnelDrop3').textContent = `-${formatPct(funnel.checkoutDropoff)} drop-off`;

    document.getElementById('funnelStep4').textContent = funnel.intents;
    document.getElementById('funnelRate4').textContent = formatPct(funnel.intentRate);
    document.getElementById('funnelDrop4').textContent = `-${formatPct(funnel.intentDropoff)} drop-off`;

    // 3. Models Table
    const modelsTbody = document.querySelector('#modelsTable tbody');
    modelsTbody.innerHTML = '';
    models.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>KundiKamado ${m.size}″</strong></td>
        <td>${formatEur(m.price)}</td>
        <td><span class="badge badge-primary">${m.count} stuks</span></td>
        <td>${formatPct(m.share)}</td>
        <td><strong>${formatEur(m.revenue)}</strong></td>
      `;
      modelsTbody.appendChild(tr);
    });

    // 4. Colors Table
    const colorsTbody = document.querySelector('#colorsTable tbody');
    colorsTbody.innerHTML = '';
    colors.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.name}</strong></td>
        <td>${c.count} gekozen</td>
        <td>${formatPct(c.share)}</td>
      `;
      colorsTbody.appendChild(tr);
    });

    // 5. Accessories Attachment Table
    const accTbody = document.querySelector('#accessoriesTable tbody');
    accTbody.innerHTML = '';
    accessories.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.name}</strong></td>
        <td>${a.count}x</td>
        <td><span class="badge badge-success">${formatPct(a.attachRate)}</span></td>
        <td>${formatEur(a.revenue)}</td>
      `;
      accTbody.appendChild(tr);
    });

    // 6. Top Combinations Table
    const combTbody = document.querySelector('#combinationsTable tbody');
    combTbody.innerHTML = '';
    combinations.forEach(cb => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cb.description}</td>
        <td><span class="badge badge-primary">${cb.count}x</span></td>
        <td><strong>${formatEur(cb.totalValue)}</strong></td>
      `;
      combTbody.appendChild(tr);
    });

    // 7. Timeline Table
    const timeTbody = document.querySelector('#timelineTable tbody');
    timeTbody.innerHTML = '';
    timeline.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.date}</strong></td>
        <td>${t.visitors}</td>
        <td>${t.carts}</td>
        <td>${t.checkouts}</td>
        <td><span class="badge badge-primary">${t.intents}</span></td>
        <td>${formatPct(t.conversionRate)}</td>
        <td><strong>${formatEur(t.revenue)}</strong></td>
      `;
      timeTbody.appendChild(tr);
    });

    // 8. Detailed Intents Feed
    const intentsTbody = document.querySelector('#intentsDetailTable tbody');
    intentsTbody.innerHTML = '';
    intents.forEach(item => {
      const tr = document.createElement('tr');
      let accStr = '-';
      try {
        const accArr = JSON.parse(item.accessories_json || '[]');
        if (accArr.length) accStr = accArr.map(a => `${a.qty}x ${a.name}`).join(', ');
      } catch (e) {}

      tr.innerHTML = `
        <td><small>${formatDate(item.created_at)}</small></td>
        <td>
          <strong>${item.name}</strong><br>
          <small style="color: var(--text-dim);">${item.email}<br>${item.phone}</small>
        </td>
        <td>${item.city} (${item.postal_code})</td>
        <td><strong>${item.size_inch}″ Kamado</strong></td>
        <td>${item.color_name}<br><small style="color: var(--text-dim);">${item.texture}</small></td>
        <td><small>${accStr}</small></td>
        <td><strong style="color: var(--primary);">${formatEur(item.total_amount_eur)}</strong></td>
        <td><span class="badge badge-success">${(item.payment_method_intent || 'ideal').toUpperCase()}</span></td>
      `;
      intentsTbody.appendChild(tr);
    });

    // 9. Detailed Abandoned Feed
    const abTbody = document.querySelector('#abandonedDetailTable tbody');
    abTbody.innerHTML = '';
    abandoned.forEach(item => {
      const tr = document.createElement('tr');
      let itemsSummary = '';
      try {
        const itemsArr = JSON.parse(item.items_json || '[]');
        itemsSummary = itemsArr.map(i => `${i.qty}x ${i.name}`).join(', ');
      } catch (e) {
        itemsSummary = '-';
      }

      tr.innerHTML = `
        <td><small>${formatDate(item.updated_at)}</small></td>
        <td><code>${item.session_id.substring(0, 10)}...</code></td>
        <td><span class="badge badge-warning">${item.last_step.toUpperCase()}</span></td>
        <td>${item.email || '<em style="color: var(--text-dim);">Onbekend</em>'}</td>
        <td><small>${itemsSummary}</small></td>
        <td><strong>${formatEur(item.total_amount_eur)}</strong></td>
      `;
      abTbody.appendChild(tr);
    });
  }

  // --- EVENTS ---
  document.addEventListener('DOMContentLoaded', () => {
    // Auth login click
    document.getElementById('authBtn').addEventListener('click', () => {
      const pwd = document.getElementById('adminPwd').value;
      if (!pwd) return;
      adminToken = pwd;
      sessionStorage.setItem('kk_nl_admin_token', pwd);
      loadDashboardData();
    });

    document.getElementById('adminPwd').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('authBtn').click();
      }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem('kk_nl_admin_token');
      adminToken = '';
      showAuthOverlay();
    });

    // Refresh
    document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);

    // CSV Export
    document.getElementById('exportIntentsBtn').addEventListener('click', () => {
      window.location.href = '/api/market-test/export-intents.csv?token=' + encodeURIComponent(adminToken);
    });

    // Tabs
    const tabIntentsBtn = document.getElementById('tabIntentsBtn');
    const tabAbandonedBtn = document.getElementById('tabAbandonedBtn');
    const tabIntentsContent = document.getElementById('tabIntentsContent');
    const tabAbandonedContent = document.getElementById('tabAbandonedContent');

    tabIntentsBtn.addEventListener('click', () => {
      tabIntentsBtn.classList.add('active');
      tabAbandonedBtn.classList.remove('active');
      tabIntentsContent.style.display = 'block';
      tabAbandonedContent.style.display = 'none';
    });

    tabAbandonedBtn.addEventListener('click', () => {
      tabAbandonedBtn.classList.add('active');
      tabIntentsBtn.classList.remove('active');
      tabIntentsContent.style.display = 'none';
      tabAbandonedContent.style.display = 'block';
    });

    // Initial load
    loadDashboardData();
  });

})();
