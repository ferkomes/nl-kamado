/**
 * SmokeyKamado Netherlands - Market Test Admin Dashboard Logic (English)
 */

(function() {
  "use strict";

  const urlToken = new URLSearchParams(window.location.search).get("token");
  let adminToken = urlToken || sessionStorage.getItem("kk_nl_admin_token") || localStorage.getItem("craft_admin_token") || "";
  if (urlToken) {
    sessionStorage.setItem("kk_nl_admin_token", urlToken);
    history.replaceState(null, "", window.location.pathname);
  }
  let currentIntents = [];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function formatEur(amount) {
    return "€" + Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatPct(val) {
    return (Number(val || 0) * 100).toFixed(1) + "%";
  }

  function formatDate(isoStr) {
    if (!isoStr) return "-";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + " " +
             d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return isoStr;
    }
  }

  function showAuthOverlay() {
    const ov = document.getElementById("authOverlay");
    const dash = document.getElementById("dashboardContent");
    if (ov) ov.style.display = "flex";
    if (dash) dash.style.display = "none";
  }

  function hideAuthOverlay() {
    const ov = document.getElementById("authOverlay");
    const dash = document.getElementById("dashboardContent");
    if (ov) ov.style.display = "none";
    if (dash) dash.style.display = "block";
  }

  async function loadDashboardData() {
    if (!adminToken) {
      showAuthOverlay();
      return;
    }

    try {
      const resp = await fetch("/api/market-test/stats", {
        headers: { "Authorization": "Bearer " + adminToken }
      });

      if (resp.status === 401) {
        sessionStorage.removeItem("kk_nl_admin_token");
      localStorage.removeItem("craft_admin_token");
        adminToken = "";
        showAuthOverlay();
        return;
      }

      if (!resp.ok) throw new Error("Failed to load statistics");

      const data = await resp.json();
      hideAuthOverlay();
      renderDashboard(data);
      await loadInventory();
      if (!mediaLoaded) await loadMedia();
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  }

  let mediaLoaded = false;
  let mediaData = { placements: {} };
  async function loadMedia() {
    const status = document.getElementById('mediaStatus');
    try {
      const response = await fetch('/api/media', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load videos. Refresh to retry.');
      mediaData = await response.json();
      const select = document.getElementById('mediaPlacement');
      const previous = select.value;
      select.replaceChildren();
      for (const [path, name] of Object.entries(mediaData.locations)) {
        const option = document.createElement('option'); option.value = path; option.textContent = name; select.appendChild(option);
      }
      if (previous) select.value = previous;
      const fill = () => {
        document.getElementById('mediaUrls').value = (mediaData.placements[select.value]?.videos || []).map(id => 'https://www.youtube.com/watch?v=' + id).join('\n');
        status.textContent = '';
      };
      select.onchange = fill; fill();
      const button = document.getElementById('saveMediaBtn'); button.disabled = false;
      button.onclick = async () => {
        button.disabled = true; select.disabled = true;
        const urls = document.getElementById('mediaUrls').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        try {
          const response = await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken }, body: JSON.stringify({ placement: select.value, urls, revision: mediaData.placements[select.value]?.revision || 0 }) });
          const data = await response.json();
          if (response.status === 409) throw new Error('Changed in another tab. Copy your links and refresh before saving.');
          if (!response.ok) throw new Error(data.error || 'Save failed');
          await loadMedia(); status.textContent = 'Saved. Videos appear on the selected page; empty lists leave no space.';
        } catch (error) { status.textContent = error.message; }
        finally { button.disabled = false; select.disabled = false; }
      };
      mediaLoaded = true;
    } catch (error) { status.textContent = error.message; }
  }

  async function loadInventory() {
    const status = document.getElementById('inventoryStatus');
    try {
      const response = await fetch('/api/inventory', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load inventory');
      const data = await response.json();
      const body = document.querySelector('#inventoryTable tbody');
      body.replaceChildren();
      for (const [modelKey, colors] of Object.entries(data.stock)) {
        for (const [color, quantity] of Object.entries(colors)) {
          const row = document.createElement('tr');
          const model = document.createElement('td'); model.textContent = modelKey.replace('_', ' ');
          const name = document.createElement('td'); name.textContent = color + ' / ' + data.colors[color].pantone;
          const quantityCell = document.createElement('td');
          const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.max = '100000'; input.step = '1'; input.value = quantity; input.style.width = '90px'; input.setAttribute('aria-label', modelKey + ' ' + color + ' quantity'); quantityCell.appendChild(input);
          const action = document.createElement('td'); const button = document.createElement('button');button.className = 'btn btn-secondary';button.textContent = 'Save';action.appendChild(button);
          button.addEventListener('click', async () => {
            if (!input.reportValidity() || input.value === '') return;
            button.disabled = true;
            try {
              const result = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken }, body: JSON.stringify({modelKey,color,quantity:Number(input.value),previousQuantity:quantity}) });
              if (!result.ok) throw new Error(result.status === 409 ? 'Stock changed in another session. Refresh and try again.' : 'Inventory update failed');
              await loadInventory(); status.textContent = 'Saved: ' + modelKey + ' / ' + color + ' = ' + input.value;
            } catch(error) { status.textContent = error.message; button.disabled = false; }
          });
          row.append(model,name,quantityCell,action);body.appendChild(row);
        }
      }
    } catch(error) { status.textContent = error.message; }
  }

  function renderDashboard(data) {
    const { kpis, models, colors, accessories, configurations, intents } = data;

    // 1. TOP 6 BIG NUMBERS
    if (kpis) {
      document.getElementById("numVisitors").textContent = Number(kpis.visitors || 0).toLocaleString("en-US");
      document.getElementById("numAddToCart").textContent = Number(kpis.addToCart || 0).toLocaleString("en-US");
      document.getElementById("numCheckout").textContent = Number(kpis.checkout || 0).toLocaleString("en-US");
      document.getElementById("numPurchaseIntent").textContent = Number(kpis.purchaseIntent || 0).toLocaleString("en-US");
      document.getElementById("numConversion").textContent = formatPct(kpis.conversionPct);
      document.getElementById("numRevenue").textContent = formatEur(kpis.potentialRevenue);
    }

    // 2. MODELS TABLE
    const modelsTbody = document.querySelector("#modelsTable tbody");
    if (modelsTbody) {
      modelsTbody.innerHTML = "";
      (models || []).forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td><strong>' + m.name + '</strong></td>' +
          '<td>' + formatEur(m.price) + '</td>' +
          '<td><span class="badge badge-primary">' + m.count + ' pcs</span></td>' +
          '<td><strong>' + formatPct(m.share) + '</strong></td>';
        modelsTbody.appendChild(tr);
      });
    }

    // 3. COLORS TABLE
    const colorsTbody = document.querySelector("#colorsTable tbody");
    if (colorsTbody) {
      colorsTbody.innerHTML = "";
      (colors || []).forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td><span class="color-swatch" style="background-color: ' + c.hex + ';"></span><strong>' + c.name + '</strong></td>' +
          '<td><span class="badge badge-primary">' + c.count + ' pcs</span></td>' +
          '<td><strong>' + formatPct(c.share) + '</strong></td>';
        colorsTbody.appendChild(tr);
      });
    }

    // 4. ACCESSORIES TABLE
    const accTbody = document.querySelector("#accessoriesTable tbody");
    if (accTbody) {
      accTbody.innerHTML = "";
      if (!accessories || accessories.length === 0) {
        accTbody.innerHTML = '<tr><td colspan="4" style="color: var(--text-dim);">No accessories selected yet.</td></tr>';
      } else {
        accessories.forEach(a => {
          const tr = document.createElement("tr");
          tr.innerHTML = '<td><strong>' + escapeHtml(a.name) + '</strong></td>' +
            '<td><span class="badge badge-primary">' + a.count + ' pcs</span></td>' +
            '<td><span class="badge badge-success">' + formatPct(a.attachRate) + '</span></td>' +
            '<td>' + formatEur(a.revenue) + '</td>';
          accTbody.appendChild(tr);
        });
      }
    }

    // 5. CONFIGURATIONS TABLE
    const confTbody = document.querySelector("#configurationsTable tbody");
    if (confTbody) {
      confTbody.innerHTML = "";
      if (!configurations || configurations.length === 0) {
        confTbody.innerHTML = '<tr><td colspan="3" style="color: var(--text-dim);">No configurations recorded yet.</td></tr>';
      } else {
        configurations.forEach(cfg => {
          const tr = document.createElement("tr");
          tr.innerHTML = '<td><strong>' + escapeHtml(cfg.description) + '</strong></td>' +
            '<td><span class="badge badge-primary">' + cfg.count + ' pcs</span></td>' +
            '<td><strong>' + formatEur(cfg.totalValue) + '</strong></td>';
          confTbody.appendChild(tr);
        });
      }
    }

    // 6. INTENTS TABLE
    renderIntentsTable(intents || []);
  }

  function renderIntentsTable(intents) {
    currentIntents = intents || [];
    applyIntentsFilter();
  }

  function applyIntentsFilter() {
    const filterQuery = (document.getElementById("intentsSearchInput")?.value || "").toLowerCase().trim();
    const intentsTbody = document.querySelector("#intentsTable tbody");
    if (!intentsTbody) return;

    intentsTbody.innerHTML = "";
    const filtered = currentIntents.filter(item => {
      if (!filterQuery) return true;
      const hay = [
        item.email, item.model_name, item.final_color, item.color_name,
        item.source, item.postal_code, item.city, item.name, item.phone
      ].join(" ").toLowerCase();
      return hay.includes(filterQuery);
    });

    if (filtered.length === 0) {
      intentsTbody.innerHTML = '<tr><td colspan="9" style="color: var(--text-dim); text-align: center; padding: 1.5rem;">' +
        (currentIntents.length === 0 ? "No purchase intents received yet." : "No orders match search query.") +
        '</td></tr>';
      return;
    }

    filtered.forEach(item => {
      const tr = document.createElement("tr");
      let accStr = "-";
      try {
        const accArr = JSON.parse(item.accessories_json || "[]");
        if (accArr.length) {
          accStr = accArr.map(a => a.name + " ×" + (a.qty || 1)).join(", ");
        }
      } catch (e) {}

      const colorText = item.final_color || item.color_name || "Black";
      const modelText = item.model_name || (item.size_inch + "″ Kamado");
      const regionText = (item.postal_code || item.city) ? (item.postal_code + " " + item.city).trim() : "NL";

      tr.innerHTML = '<td><small>' + formatDate(item.created_at) + '</small></td>' +
        '<td><strong>' + escapeHtml(modelText) + '</strong></td>' +
        '<td>' + escapeHtml(colorText) + '</td>' +
        '<td><small>' + escapeHtml(accStr) + '</small></td>' +
        '<td><strong style="color: var(--success);">' + formatEur(item.total_amount_eur) + '</strong></td>' +
        '<td><code>' + escapeHtml((item.email || "-")) + '</code><br><small>' + (item.notification_sent ? 'Owner email sent' : 'Owner email failed: ' + escapeHtml(item.notification_error || 'Not sent')) + '</small></td>' +
        '<td><span class="badge badge-source">' + escapeHtml((item.source || "Direct")) + '</span></td>' +
        '<td><small>' + escapeHtml(regionText) + '</small></td>' +
        '<td style="text-align: right;">' +
          '<button class="btn-delete-lead" data-id="' + escapeHtml(item.id) + '" data-email="' + escapeHtml((item.email || "")) + '" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; transition: all 0.2s;" title="Delete this order / test lead">' +
            '🗑️ Delete' +
          '</button>' +
        '</td>';
      intentsTbody.appendChild(tr);
    });
  }

  async function deleteSingleIntent(id, email) {
    if (!confirm("Are you sure you want to delete this order / test lead (" + (email || id) + ")?\n\nThis will remove it from all database records and immediately recalculate KPIs and conversion metrics.")) {
      return;
    }
    try {
      const res = await fetch("/api/market-test/intent?id=" + encodeURIComponent(id), {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + adminToken }
      });
      const data = await res.json();
      if (data.ok) {
        loadDashboardData();
      } else {
        alert("Failed to delete: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  }

  async function purgeAllTestOrders() {
    const testLeads = currentIntents.filter(item => {
      const em = (item.email || "").toLowerCase();
      return em.includes("test") || em.includes("example.nl") || em.includes("example.com") || em.includes("tezst");
    });

    if (testLeads.length === 0) {
      alert("No test orders found matching test/example email patterns.");
      return;
    }

    if (!confirm("Found " + testLeads.length + " test order(s):\n" + testLeads.map(l => "• " + l.email).join("\n") + "\n\nAre you sure you want to delete all of them?\nThis will immediately update all KPIs.")) {
      return;
    }

    let deleted = 0;
    for (const lead of testLeads) {
      try {
        const res = await fetch("/api/market-test/intent?id=" + encodeURIComponent(lead.id), {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + adminToken }
        });
        if (res.ok) deleted++;
      } catch (e) {}
    }

    alert("Successfully deleted " + deleted + " test order(s).");
    loadDashboardData();
  }

  // --- EVENTS ---
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("intentsTable")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-delete-lead");
      if (btn) {
        const id = btn.getAttribute("data-id");
        const email = btn.getAttribute("data-email");
        if (id) deleteSingleIntent(id, email);
      }
    });

    document.getElementById("intentsSearchInput")?.addEventListener("input", () => {
      applyIntentsFilter();
    });

    document.getElementById("purgeTestsBtn")?.addEventListener("click", () => {
      purgeAllTestOrders();
    });

    document.getElementById("authBtn")?.addEventListener("click", () => {
      const pwd = document.getElementById("adminPwd").value.trim();
      if (!pwd) return;
      adminToken = pwd;
      sessionStorage.setItem("kk_nl_admin_token", pwd);
      loadDashboardData();
    });

    document.getElementById("adminPwd")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("authBtn")?.click();
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      sessionStorage.removeItem("kk_nl_admin_token");
      localStorage.removeItem("craft_admin_token");
      adminToken = "";
      showAuthOverlay();
    });

    document.getElementById("refreshBtn")?.addEventListener("click", loadDashboardData);

    document.getElementById("exportIntentsBtn")?.addEventListener("click", () => {
      window.location.href = "/api/market-test/export-intents.csv?token=" + encodeURIComponent(adminToken);
    });

    loadDashboardData();
  });
})();
