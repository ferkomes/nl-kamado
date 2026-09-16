/**
 * CraftKamado Netherlands - Market Test Admin Dashboard Logic (English)
 */

(function() {
  "use strict";

  let adminToken = sessionStorage.getItem("kk_nl_admin_token") || "";

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
    document.getElementById("authOverlay").style.display = "flex";
    document.getElementById("dashboardContent").style.display = "none";
  }

  function hideAuthOverlay() {
    document.getElementById("authOverlay").style.display = "none";
    document.getElementById("dashboardContent").style.display = "block";
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
        adminToken = "";
        showAuthOverlay();
        return;
      }

      if (!resp.ok) throw new Error("Failed to load statistics");

      const data = await resp.json();
      hideAuthOverlay();
      renderDashboard(data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  }

  function renderDashboard(data) {
    const { kpis, models, colors, accessories, configurations, intents } = data;

    // 1. TOP 6 BIG NUMBERS
    document.getElementById("numVisitors").textContent = Number(kpis.visitors || 0).toLocaleString("en-US");
    document.getElementById("numAddToCart").textContent = Number(kpis.addToCart || 0).toLocaleString("en-US");
    document.getElementById("numCheckout").textContent = Number(kpis.checkout || 0).toLocaleString("en-US");
    document.getElementById("numPurchaseIntent").textContent = Number(kpis.purchaseIntent || 0).toLocaleString("en-US");
    document.getElementById("numConversion").textContent = formatPct(kpis.conversionPct);
    document.getElementById("numRevenue").textContent = formatEur(kpis.potentialRevenue);

    // 2. MODELS TABLE (18 Basic / 18 Premium / 21 / 23 / 27)
    const modelsTbody = document.querySelector("#modelsTable tbody");
    modelsTbody.innerHTML = "";
    (models || []).forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${m.name}</strong></td>
        <td>${formatEur(m.price)}</td>
        <td><span class="badge badge-primary">${m.count} pcs</span></td>
        <td><strong>${formatPct(m.share)}</strong></td>
      `;
      modelsTbody.appendChild(tr);
    });

    // 3. COLORS TABLE (Black, Burgundy, Blue, Green, Orange, Beige, Yellow)
    const colorsTbody = document.querySelector("#colorsTable tbody");
    colorsTbody.innerHTML = "";
    (colors || []).forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <span class="color-swatch" style="background-color: ${c.hex};"></span>
          <strong>${c.name}</strong>
        </td>
        <td><span class="badge badge-primary">${c.count} pcs</span></td>
        <td><strong>${formatPct(c.share)}</strong></td>
      `;
      colorsTbody.appendChild(tr);
    });

    // 4. ACCESSORIES TABLE
    const accTbody = document.querySelector("#accessoriesTable tbody");
    accTbody.innerHTML = "";
    if (!accessories || accessories.length === 0) {
      accTbody.innerHTML = "<tr><td colspan="4" style="color: var(--text-dim);">No accessories selected yet.</td></tr>";
    } else {
      accessories.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${a.name}</strong></td>
          <td><span class="badge badge-primary">${a.count} pcs</span></td>
          <td><span class="badge badge-success">${formatPct(a.attachRate)}</span></td>
          <td>${formatEur(a.revenue)}</td>
        `;
        accTbody.appendChild(tr);
      });
    }

    // 5. CONFIGURATIONS TABLE
    const confTbody = document.querySelector("#configurationsTable tbody");
    confTbody.innerHTML = "";
    if (!configurations || configurations.length === 0) {
      confTbody.innerHTML = "<tr><td colspan="3" style="color: var(--text-dim);">No configurations recorded yet.</td></tr>";
    } else {
      configurations.forEach(cfg => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${cfg.description}</strong></td>
          <td><span class="badge badge-primary">${cfg.count} pcs</span></td>
          <td><strong>${formatEur(cfg.totalValue)}</strong></td>
        `;
        confTbody.appendChild(tr);
      });
    }

    // 6. DEDICATED PURCHASE INTENTS TABLE
    // Date | Model | Color | Accessories | Total | Email | Source | Region
    const intentsTbody = document.querySelector("#intentsTable tbody");
    intentsTbody.innerHTML = "";
    if (!intents || intents.length === 0) {
      intentsTbody.innerHTML = "<tr><td colspan="8" style="color: var(--text-dim);">No purchase intents received yet.</td></tr>";
    } else {
      intents.forEach(item => {
        const tr = document.createElement("tr");
        let accStr = "-";
        try {
          const accArr = JSON.parse(item.accessories_json || "[]");
          if (accArr.length) {
            accStr = accArr.map(a => `${a.name} ×${a.qty || 1}`).join(", ");
          }
        } catch (e) {}

        const colorText = item.final_color || item.color_name || "Black";
        const modelText = item.model_name || `${item.size_inch}″ Kamado`;
        const regionText = (item.postal_code || item.city) ? `${item.postal_code || ""} ${item.city || ""}`.trim() : "NL";

        tr.innerHTML = `
          <td><small>${formatDate(item.created_at)}</small></td>
          <td><strong>${modelText}</strong></td>
          <td>${colorText}</td>
          <td><small>${accStr}</small></td>
          <td><strong style="color: var(--success);">${formatEur(item.total_amount_eur)}</strong></td>
          <td><code>${item.email || "-"}</code></td>
          <td><span class="badge badge-source">${item.source || "Direct"}</span></td>
          <td><small>${regionText}</small></td>
        `;
        intentsTbody.appendChild(tr);
      });
    }
  }

  // --- EVENTS ---
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("authBtn").addEventListener("click", () => {
      const pwd = document.getElementById("adminPwd").value.trim();
      if (!pwd) return;
      adminToken = pwd;
      sessionStorage.setItem("kk_nl_admin_token", pwd);
      loadDashboardData();
    });

    document.getElementById("adminPwd").addEventListener("keydown", (e) => {
      if (e.key === "Enter") document.getElementById("authBtn").click();
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem("kk_nl_admin_token");
      adminToken = "";
      showAuthOverlay();
    });

    document.getElementById("refreshBtn").addEventListener("click", loadDashboardData);

    document.getElementById("exportIntentsBtn").addEventListener("click", () => {
      window.location.href = "/api/market-test/export-intents.csv?token=" + encodeURIComponent(adminToken);
    });

    loadDashboardData();
  });
})();
