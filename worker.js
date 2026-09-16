/**
 * KundiKamado Netherlands - Cloudflare Worker
 * - Serves 100% Dutch Storefront & Market-Test Admin Dashboard
 * - Comprehensive Funnel Tracking (visitor -> cart -> checkout -> purchase_intent)
 * - R2 Asset streaming
 * - Instant owner email notifications upon PURCHASE_INTENT
 */

const HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"nl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>CraftKamado Nederland | Premium Keramische BBQ's All-Inclusive</title>\n  <meta name=\"description\" content=\"Ontdek CraftKamado in Nederland. Premium Mullite keramische kamado BBQ's met Air Hinge scharnier, Divide & Conquer systeem en All-Inclusive uitrusting. Gratis verzekerde palletbezorging.\">\n  <link rel=\"icon\" type=\"image/png\" href=\"/assets/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"/assets/apple-touch-icon.png\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <style>\n/* ==========================================================================\n   CraftKamado Netherlands - Premium Dark BBQ Design System\n   ========================================================================== */\n\n:root {\n  --bg-main: #0c0d10;\n  --bg-card: #15161c;\n  --bg-card-hover: #1c1d25;\n  --bg-card-light: #232530;\n  --bg-elevated: #282a36;\n  --border-color: #2b2d3a;\n  --border-active: #ff6b35;\n\n  --primary: #ff6b35;\n  --primary-hover: #ff5214;\n  --primary-light: rgba(255, 107, 53, 0.15);\n  --accent: #f7931e;\n  --accent-glow: rgba(247, 147, 30, 0.35);\n\n  --text-main: #f8fafc;\n  --text-muted: #94a3b8;\n  --text-dim: #64748b;\n  --success: #10b981;\n  --danger: #ef4444;\n\n  --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;\n  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;\n  --radius-sm: 6px;\n  --radius-md: 12px;\n  --radius-lg: 18px;\n  --radius-xl: 24px;\n  --shadow-main: 0 10px 30px -10px rgba(0, 0, 0, 0.5);\n  --shadow-glow: 0 0 25px rgba(255, 107, 53, 0.25);\n  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  scroll-behavior: smooth;\n  font-size: 16px;\n}\n\nbody {\n  background-color: var(--bg-main);\n  color: var(--text-main);\n  font-family: var(--font-body);\n  line-height: 1.6;\n  -webkit-font-smoothing: antialiased;\n  overflow-x: hidden;\n}\n\n/* Typography */\nh1, h2, h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  color: var(--text-main);\n  font-weight: 700;\n  line-height: 1.25;\n}\n\np {\n  color: var(--text-muted);\n}\n\na {\n  color: var(--primary);\n  text-decoration: none;\n  transition: var(--transition);\n}\n\na:hover {\n  color: var(--primary-hover);\n}\n\n/* Container */\n.container {\n  width: 100%;\n  max-width: 1240px;\n  margin: 0 auto;\n  padding: 0 1.5rem;\n}\n\n/* Top Banner */\n.top-banner {\n  background: linear-gradient(90deg, #b91c1c 0%, #c2410c 50%, #ea580c 100%);\n  color: #ffffff;\n  padding: 0.6rem 0;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n\n.top-banner-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n\n.banner-badge {\n  background: rgba(0, 0, 0, 0.3);\n  padding: 0.2rem 0.6rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n}\n\n/* Header */\n.site-header {\n  position: sticky;\n  top: 0;\n  z-index: 100;\n  background-color: rgba(12, 13, 16, 0.92);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid var(--border-color);\n  padding: 1rem 0;\n}\n\n.header-inner {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.brand-logo {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.logo-img {\n  height: 42px;\n  width: auto;\n  object-fit: contain;\n}\n\n.brand-text {\n  font-family: var(--font-heading);\n  font-size: 1.45rem;\n  font-weight: 800;\n  letter-spacing: -0.02em;\n  color: #ffffff;\n}\n\n.brand-text span {\n  color: var(--primary);\n}\n\n.country-tag {\n  background: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--accent);\n  padding: 0.15rem 0.45rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  margin-left: 0.3rem;\n  vertical-align: middle;\n}\n\n.main-nav {\n  display: flex;\n  gap: 2rem;\n}\n\n.main-nav a {\n  color: var(--text-muted);\n  font-weight: 500;\n  font-size: 0.95rem;\n}\n\n.main-nav a:hover {\n  color: #ffffff;\n}\n\n\n.header-actions {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.lang-switch {\n  display: inline-flex;\n  align-items: center;\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-md);\n  padding: 3px;\n  gap: 2px;\n}\n\n.lang-btn {\n  background: transparent;\n  border: none;\n  color: var(--text-muted);\n  font-size: 0.8rem;\n  font-weight: 700;\n  padding: 0.35rem 0.65rem;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: all 0.2s;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  line-height: 1;\n}\n\n.lang-btn:hover {\n  color: #ffffff;\n}\n\n.lang-btn.active {\n  background-color: var(--primary);\n  color: #ffffff;\n  box-shadow: 0 1px 4px rgba(255, 107, 53, 0.3);\n}\n\n.cart-trigger {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n  padding: 0.55rem 1.1rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  font-weight: 600;\n  font-size: 0.95rem;\n  transition: var(--transition);\n}\n\n.cart-trigger:hover {\n  border-color: var(--primary);\n  background-color: var(--bg-card-hover);\n}\n\n.cart-badge {\n  background-color: var(--primary);\n  color: #ffffff;\n  font-size: 0.75rem;\n  font-weight: 700;\n  padding: 0.15rem 0.5rem;\n  border-radius: 999px;\n}\n\n/* Buttons */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.6rem;\n  font-family: var(--font-heading);\n  font-weight: 600;\n  border-radius: var(--radius-md);\n  padding: 0.75rem 1.5rem;\n  cursor: pointer;\n  transition: var(--transition);\n  border: none;\n  text-align: center;\n  text-decoration: none;\n}\n\n.btn-primary {\n  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);\n  color: #ffffff;\n  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);\n  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);\n  transform: translateY(-2px);\n  color: #ffffff;\n}\n\n.btn-secondary {\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n}\n\n.btn-secondary:hover:not(:disabled) {\n  border-color: var(--primary);\n  color: #ffffff;\n  transform: translateY(-2px);\n}\n\n.btn-outline {\n  background: transparent;\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n}\n\n.btn-outline:hover {\n  border-color: var(--primary);\n  color: var(--primary);\n}\n\n.btn-lg {\n  padding: 0.9rem 1.8rem;\n  font-size: 1.05rem;\n}\n\n.btn-xl {\n  padding: 1.1rem 2rem;\n  font-size: 1.15rem;\n  border-radius: var(--radius-lg);\n}\n\n.btn-block {\n  width: 100%;\n}\n\n.btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none !important;\n}\n\n/* Hero Section */\n.hero-section {\n  padding: 4.5rem 0 3.5rem;\n  background: radial-gradient(circle at 75% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 60%);\n  border-bottom: 1px solid var(--border-color);\n}\n\n.hero-grid {\n  display: grid;\n  grid-template-columns: 1.1fr 0.9fr;\n  gap: 3.5rem;\n  align-items: center;\n}\n\n.hero-label {\n  display: inline-block;\n  background: rgba(255, 107, 53, 0.12);\n  border: 1px solid rgba(255, 107, 53, 0.3);\n  color: var(--primary);\n  font-size: 0.85rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  padding: 0.35rem 0.85rem;\n  border-radius: 999px;\n  margin-bottom: 1.25rem;\n}\n\n.hero-title {\n  font-size: 3.25rem;\n  letter-spacing: -0.03em;\n  margin-bottom: 1.25rem;\n}\n\n.hero-title .highlight {\n  background: linear-gradient(135deg, var(--primary) 0%, #ff9e42 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\n.hero-subtitle {\n  font-size: 1.15rem;\n  line-height: 1.7;\n  margin-bottom: 2rem;\n}\n\n.hero-usps {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  margin-bottom: 2.25rem;\n}\n\n.usp-pill {\n  color: #cbd5e1;\n  font-weight: 500;\n  font-size: 0.95rem;\n}\n\n.hero-cta-group {\n  display: flex;\n  gap: 1.25rem;\n  flex-wrap: wrap;\n}\n\n.hero-media {\n  position: relative;\n}\n\n.hero-image-wrap {\n  position: relative;\n  border-radius: var(--radius-xl);\n  overflow: hidden;\n  border: 1px solid var(--border-color);\n  box-shadow: var(--shadow-main);\n}\n\n.hero-main-img {\n  width: 100%;\n  height: auto;\n  display: block;\n  object-fit: cover;\n  transition: transform 0.6s ease;\n}\n\n.hero-main-img:hover {\n  transform: scale(1.03);\n}\n\n.hero-floating-badge {\n  position: absolute;\n  bottom: 1.5rem;\n  left: 1.5rem;\n  background: rgba(21, 22, 28, 0.88);\n  backdrop-filter: blur(12px);\n  border: 1px solid var(--border-color);\n  padding: 0.75rem 1.25rem;\n  border-radius: var(--radius-md);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);\n}\n\n.badge-icon {\n  font-size: 1.5rem;\n}\n\n.badge-info strong {\n  display: block;\n  font-size: 1.15rem;\n  color: #ffffff;\n}\n\n.badge-info small {\n  color: var(--accent);\n  font-weight: 600;\n}\n\n/* Sections */\n.section {\n  padding: 5rem 0;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.section-header {\n  margin-bottom: 3rem;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.section-tag {\n  display: inline-block;\n  color: var(--primary);\n  text-transform: uppercase;\n  font-size: 0.8rem;\n  letter-spacing: 0.1em;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n\n.section-title {\n  font-size: 2.35rem;\n  margin-bottom: 0.75rem;\n}\n\n.section-desc {\n  font-size: 1.05rem;\n  max-width: 650px;\n  margin: 0 auto;\n}\n\n/* Size Tabs */\n.size-tabs {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n  margin-bottom: 2.5rem;\n}\n\n.size-tab {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.25rem 1rem;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  position: relative;\n}\n\n.size-tab:hover {\n  background-color: var(--bg-card-hover);\n  border-color: #3b3d4f;\n}\n\n.size-tab.active {\n  background: linear-gradient(180deg, var(--bg-card-light) 0%, var(--bg-card) 100%);\n  border-color: var(--primary);\n  box-shadow: var(--shadow-glow);\n}\n\n.tab-title {\n  font-family: var(--font-heading);\n  font-size: 1.15rem;\n  font-weight: 700;\n  color: var(--text-main);\n}\n\n.tab-badge {\n  color: var(--accent);\n  font-weight: 700;\n  font-size: 1rem;\n}\n\n.popular-tag {\n  position: absolute;\n  top: -10px;\n  background: linear-gradient(90deg, #ea580c, #f97316);\n  color: #ffffff;\n  font-size: 0.7rem;\n  font-weight: 700;\n  padding: 0.2rem 0.6rem;\n  border-radius: 999px;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n\n/* Configurator Card */\n.config-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-xl);\n  padding: 2.5rem;\n  box-shadow: var(--shadow-main);\n}\n\n.config-grid {\n  display: grid;\n  grid-template-columns: 1fr 1.15fr;\n  gap: 3rem;\n}\n\n.main-preview-wrap {\n  position: relative;\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  background-color: #08080a;\n  border: 1px solid var(--border-color);\n  aspect-ratio: 1 / 1;\n}\n\n.config-img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  display: block;\n}\n\n.config-status-badge {\n  position: absolute;\n  top: 1rem;\n  left: 1rem;\n  background: rgba(255, 107, 53, 0.9);\n  color: #ffffff;\n  font-size: 0.8rem;\n  font-weight: 700;\n  padding: 0.35rem 0.85rem;\n  border-radius: 999px;\n  box-shadow: 0 4px 10px rgba(0,0,0,0.3);\n}\n\n.gallery-thumbs {\n  display: flex;\n  gap: 0.75rem;\n  margin-top: 1rem;\n  overflow-x: auto;\n  padding-bottom: 0.5rem;\n}\n\n.thumb-item {\n  width: 70px;\n  height: 70px;\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border-color);\n  background-color: #08080a;\n  cursor: pointer;\n  overflow: hidden;\n  flex-shrink: 0;\n  opacity: 0.7;\n  transition: var(--transition);\n}\n\n.thumb-item:hover, .thumb-item.active {\n  opacity: 1;\n  border-color: var(--primary);\n}\n\n.thumb-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n/* Config Details */\n.model-header h3 {\n  font-size: 2rem;\n  margin-bottom: 0.5rem;\n}\n\n.model-pricing {\n  display: flex;\n  align-items: baseline;\n  gap: 1rem;\n  margin-bottom: 1.25rem;\n  flex-wrap: wrap;\n}\n\n.current-price {\n  font-family: var(--font-heading);\n  font-size: 2.25rem;\n  font-weight: 800;\n  color: var(--primary);\n}\n\n.original-price {\n  font-size: 1.25rem;\n  color: var(--text-dim);\n  text-decoration: line-through;\n}\n\n.vat-tag {\n  font-size: 0.85rem;\n  color: var(--text-muted);\n}\n\n.model-desc {\n  margin-bottom: 1.5rem;\n  line-height: 1.65;\n}\n\n.specs-mini-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 0.75rem;\n  margin-bottom: 1.75rem;\n  background-color: var(--bg-card-light);\n  padding: 1rem;\n  border-radius: var(--radius-md);\n  border: 1px solid var(--border-color);\n}\n\n.spec-box {\n  display: flex;\n  flex-direction: column;\n}\n\n.spec-label {\n  font-size: 0.75rem;\n  color: var(--text-dim);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n\n.spec-box strong {\n  font-size: 0.95rem;\n  color: var(--text-main);\n}\n\n/* Options */\n.option-block {\n  margin-bottom: 1.5rem;\n}\n\n.option-label {\n  display: block;\n  font-weight: 600;\n  font-size: 0.95rem;\n  margin-bottom: 0.6rem;\n}\n\n.selected-val {\n  color: var(--accent);\n  font-weight: 700;\n}\n\n.color-options {\n  display: flex;\n  gap: 0.85rem;\n}\n\n.color-dot {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: 2px solid #333;\n  cursor: pointer;\n  transition: var(--transition);\n  position: relative;\n}\n\n.color-dot:hover {\n  transform: scale(1.15);\n}\n\n.color-dot.active {\n  border-color: #ffffff;\n  box-shadow: 0 0 0 3px var(--primary);\n}\n\n.texture-selector {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.85rem;\n}\n\n.texture-radio {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 0.75rem 1rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  font-size: 0.85rem;\n  transition: var(--transition);\n}\n\n.texture-radio.active {\n  border-color: var(--primary);\n  background-color: rgba(255, 107, 53, 0.08);\n}\n\n.texture-radio input {\n  accent-color: var(--primary);\n}\n\n.config-actions {\n  display: grid;\n  grid-template-columns: 1.3fr 0.9fr;\n  gap: 1rem;\n  margin-top: 2rem;\n  margin-bottom: 1rem;\n}\n\n.reassurance-text {\n  font-size: 0.8rem;\n  color: var(--text-dim);\n  text-align: center;\n}\n\n/* Included Grid */\n.included-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1.5rem;\n}\n\n.included-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.75rem 1.5rem;\n  transition: var(--transition);\n}\n\n.included-card:hover {\n  border-color: var(--primary);\n  transform: translateY(-4px);\n}\n\n.inc-icon {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.included-card h4 {\n  font-size: 1.15rem;\n  margin-bottom: 0.5rem;\n}\n\n.included-card p {\n  font-size: 0.9rem;\n  line-height: 1.55;\n}\n\n/* Accessories Section */\n.accessories-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.75rem;\n}\n\n.acc-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  transition: var(--transition);\n}\n\n.acc-card:hover {\n  border-color: #4b4e63;\n  transform: translateY(-3px);\n}\n\n.acc-img-wrap {\n  height: 200px;\n  background-color: #0a0b0d;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 1rem;\n}\n\n.acc-img {\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n}\n\n.acc-size-badge {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--accent);\n  font-size: 0.75rem;\n  font-weight: 700;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n}\n\n.acc-body {\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n}\n\n.acc-title {\n  font-size: 1.15rem;\n  margin-bottom: 0.4rem;\n}\n\n.acc-desc {\n  font-size: 0.85rem;\n  margin-bottom: 1.25rem;\n  flex-grow: 1;\n}\n\n.acc-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: auto;\n  border-top: 1px solid var(--border-color);\n  padding-top: 1rem;\n}\n\n.acc-price {\n  font-family: var(--font-heading);\n  font-size: 1.35rem;\n  font-weight: 800;\n  color: var(--primary);\n}\n\n/* Why Section */\n.why-grid {\n  display: grid;\n  grid-template-columns: 1.1fr 0.9fr;\n  gap: 3.5rem;\n  align-items: center;\n}\n\n.why-features {\n  margin-top: 2rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n\n.why-feat {\n  display: flex;\n  gap: 1.25rem;\n  align-items: flex-start;\n}\n\n.feat-bullet {\n  width: 38px;\n  height: 38px;\n  background: rgba(255, 107, 53, 0.15);\n  border: 1px solid var(--primary);\n  color: var(--primary);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-family: var(--font-heading);\n  flex-shrink: 0;\n}\n\n.why-feat h4 {\n  font-size: 1.1rem;\n  margin-bottom: 0.25rem;\n}\n\n.why-visual img {\n  width: 100%;\n  border-radius: var(--radius-xl);\n  border: 1px solid var(--border-color);\n  box-shadow: var(--shadow-main);\n}\n\n/* Reviews */\n.reviews-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.75rem;\n}\n\n.review-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 2rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.review-stars {\n  color: #fbbf24;\n  font-size: 1.25rem;\n  margin-bottom: 1rem;\n}\n\n.review-quote {\n  font-size: 0.95rem;\n  font-style: italic;\n  margin-bottom: 1.5rem;\n  flex-grow: 1;\n  color: #cbd5e1;\n}\n\n.review-author strong {\n  display: block;\n  color: #ffffff;\n}\n\n.review-author span {\n  font-size: 0.8rem;\n  color: var(--accent);\n}\n\n/* Cart Drawer */\n.cart-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(4px);\n  z-index: 200;\n  opacity: 0;\n  visibility: hidden;\n  transition: var(--transition);\n}\n\n.cart-backdrop.open {\n  opacity: 1;\n  visibility: visible;\n}\n\n.cart-drawer {\n  position: fixed;\n  top: 0;\n  right: -450px;\n  width: 100%;\n  max-width: 440px;\n  height: 100vh;\n  background-color: var(--bg-card);\n  border-left: 1px solid var(--border-color);\n  z-index: 201;\n  display: flex;\n  flex-direction: column;\n  transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);\n  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);\n}\n\n.cart-drawer.open {\n  right: 0;\n}\n\n.cart-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.close-btn {\n  background: none;\n  border: none;\n  color: var(--text-muted);\n  font-size: 2rem;\n  cursor: pointer;\n  line-height: 1;\n}\n\n.close-btn:hover {\n  color: #ffffff;\n}\n\n.cart-items {\n  flex-grow: 1;\n  overflow-y: auto;\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.empty-cart-msg {\n  text-align: center;\n  color: var(--text-dim);\n  margin-top: 3rem;\n  font-size: 1.05rem;\n}\n\n.cart-item {\n  display: flex;\n  gap: 1rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 1rem;\n  border-radius: var(--radius-md);\n  position: relative;\n}\n\n.cart-item-img {\n  width: 65px;\n  height: 65px;\n  object-fit: contain;\n  background: #000;\n  border-radius: var(--radius-sm);\n}\n\n.cart-item-info {\n  flex-grow: 1;\n}\n\n.cart-item-title {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin-bottom: 0.2rem;\n}\n\n.cart-item-meta {\n  font-size: 0.75rem;\n  color: var(--text-dim);\n  margin-bottom: 0.5rem;\n}\n\n.cart-item-price {\n  font-weight: 700;\n  color: var(--primary);\n  font-size: 1rem;\n}\n\n.cart-item-qty {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.qty-btn {\n  width: 26px;\n  height: 26px;\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: #ffffff;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.qty-val {\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.remove-item-btn {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n  background: none;\n  border: none;\n  color: var(--text-dim);\n  cursor: pointer;\n  font-size: 1.1rem;\n}\n\n.remove-item-btn:hover {\n  color: var(--danger);\n}\n\n.cart-summary {\n  padding: 1.5rem;\n  border-top: 1px solid var(--border-color);\n  background-color: var(--bg-main);\n}\n\n.summary-row {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.6rem;\n  font-size: 0.95rem;\n}\n\n.text-free {\n  color: var(--success);\n  font-weight: 700;\n}\n\n.total-row {\n  border-top: 1px solid var(--border-color);\n  padding-top: 0.75rem;\n  margin-top: 0.75rem;\n  font-size: 1.2rem;\n  font-weight: 800;\n  color: #ffffff;\n}\n\n.total-row span:last-child {\n  color: var(--primary);\n}\n\n/* Modals */\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(6px);\n  z-index: 300;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  opacity: 0;\n  visibility: hidden;\n  transition: var(--transition);\n}\n\n.modal-backdrop.open {\n  opacity: 1;\n  visibility: visible;\n}\n\n.modal-dialog {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-xl);\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);\n  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n@keyframes modalIn {\n  from { transform: scale(0.95) translateY(10px); opacity: 0; }\n  to { transform: scale(1) translateY(0); opacity: 1; }\n}\n\n.checkout-modal {\n  max-width: 600px;\n}\n\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.modal-body {\n  padding: 1.75rem;\n}\n\n.checkout-step-title {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: var(--accent);\n  margin-bottom: 1rem;\n  margin-top: 1.5rem;\n}\n\n.checkout-step-title:first-of-type {\n  margin-top: 0;\n}\n\n.form-group {\n  margin-bottom: 1rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.form-group label {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.35rem;\n  color: #cbd5e1;\n}\n\n.form-group input, .form-group select {\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  color: #ffffff;\n  padding: 0.75rem 1rem;\n  border-radius: var(--radius-md);\n  font-family: var(--font-body);\n  font-size: 0.95rem;\n  outline: none;\n  transition: var(--transition);\n}\n\n.form-group input:focus, .form-group select:focus {\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);\n}\n\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n\n.address-row .grow-2 { grid-column: span 2; }\n@media (min-width: 500px) {\n  .address-row {\n    grid-template-columns: 2fr 1fr;\n  }\n  .address-row .grow-2 { grid-column: auto; }\n}\n\n.payment-methods-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n\n.payment-opt {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 0.85rem 1.25rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  transition: var(--transition);\n}\n\n.payment-opt.active {\n  border-color: var(--primary);\n  background-color: rgba(255, 107, 53, 0.08);\n}\n\n.payment-opt input {\n  accent-color: var(--primary);\n}\n\n.payment-opt-info strong {\n  display: block;\n  font-size: 0.95rem;\n}\n\n.payment-opt-info small {\n  color: var(--text-dim);\n  font-size: 0.8rem;\n}\n\n.checkout-summary-box {\n  background-color: #0a0b0e;\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-md);\n  padding: 1.25rem;\n  margin-bottom: 1.5rem;\n}\n\n.summary-line {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n}\n\n.summary-line.total {\n  border-top: 1px solid var(--border-color);\n  padding-top: 0.75rem;\n  margin-top: 0.75rem;\n  font-size: 1.15rem;\n  font-weight: 800;\n  color: #ffffff;\n}\n\n.summary-line.total strong {\n  color: var(--primary);\n}\n\n.form-errors {\n  color: var(--danger);\n  font-size: 0.85rem;\n  margin-bottom: 1rem;\n}\n\n.checkout-notice {\n  display: block;\n  text-align: center;\n  color: var(--text-dim);\n  font-size: 0.8rem;\n  margin-top: 0.75rem;\n}\n\n/* Notice Modal (Demand Test) */\n.notice-modal {\n  max-width: 550px;\n  padding: 2.5rem 2rem;\n  text-align: center;\n}\n\n.notice-icon {\n  font-size: 3.5rem;\n  margin-bottom: 1rem;\n}\n\n.notice-title {\n  font-size: 1.85rem;\n  margin-bottom: 0.5rem;\n}\n\n.notice-badge {\n  display: inline-block;\n  background: var(--primary-light);\n  color: var(--primary);\n  border: 1px solid rgba(255, 107, 53, 0.3);\n  padding: 0.25rem 0.75rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  margin-bottom: 1.25rem;\n}\n\n.notice-text {\n  font-size: 1rem;\n  line-height: 1.6;\n  margin-bottom: 1.75rem;\n}\n\n.notice-highlight-card {\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.25rem;\n  text-align: left;\n  margin-bottom: 1.75rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.hl-item {\n  display: flex;\n  gap: 0.85rem;\n}\n\n.hl-icon {\n  color: var(--success);\n  font-weight: 800;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n}\n\n.hl-item strong {\n  display: block;\n  font-size: 0.95rem;\n  color: #ffffff;\n  margin-bottom: 0.2rem;\n}\n\n.hl-item p {\n  font-size: 0.85rem;\n  line-height: 1.5;\n}\n\n.registered-summary {\n  background: #08090b;\n  border: 1px dashed var(--border-color);\n  border-radius: var(--radius-md);\n  padding: 1rem;\n  font-size: 0.85rem;\n  text-align: left;\n  margin-bottom: 1.75rem;\n}\n\n/* Footer */\n.site-footer {\n  background-color: #070709;\n  border-top: 1px solid var(--border-color);\n  padding: 4.5rem 0 2rem;\n}\n\n.footer-grid {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr 1.2fr 1fr;\n  gap: 3rem;\n  margin-bottom: 3rem;\n}\n\n.footer-logo {\n  margin-bottom: 1rem;\n}\n\n.footer-col h4 {\n  font-size: 1.05rem;\n  margin-bottom: 1.25rem;\n  color: #ffffff;\n}\n\n.footer-col ul {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n}\n\n.footer-col li, .footer-col a {\n  font-size: 0.9rem;\n  color: var(--text-muted);\n}\n\n.footer-col a:hover {\n  color: #ffffff;\n}\n\n.copyright {\n  margin-top: 1.5rem;\n  font-size: 0.8rem;\n  color: var(--text-dim);\n}\n\n.payment-badges {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n  margin-bottom: 0.75rem;\n}\n\n.pay-badge {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  padding: 0.3rem 0.6rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: #cbd5e1;\n}\n\n.ssl-note {\n  color: var(--text-dim);\n  font-size: 0.75rem;\n}\n\n/* Responsive Breakpoints */\n@media (max-width: 1024px) {\n  .hero-grid {\n    grid-template-columns: 1fr;\n    gap: 2.5rem;\n  }\n  .config-grid {\n    grid-template-columns: 1fr;\n    gap: 2rem;\n  }\n  .included-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .accessories-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .footer-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .why-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 768px) {\n  .main-nav {\n    display: none;\n  }\n  .hero-title {\n    font-size: 2.5rem;\n  }\n  .size-tabs {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .specs-mini-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .texture-selector {\n    grid-template-columns: 1fr;\n  }\n  .config-actions {\n    grid-template-columns: 1fr;\n  }\n  .reviews-grid {\n    grid-template-columns: 1fr;\n  }\n  .accessories-grid {\n    grid-template-columns: 1fr;\n  }\n  .included-grid {\n    grid-template-columns: 1fr;\n  }\n  .footer-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n</style>\n</head>\n<body>\n\n  <!-- Header -->\n  <header class=\"site-header\">\n    <div class=\"container header-inner\">\n      <a href=\"/\" class=\"brand-logo\">\n        <img src=\"/assets/craft-logo.png?v=3\" alt=\"CraftKamado Logo\" class=\"logo-img\">\n        <span class=\"brand-text\">Craft<span>Kamado</span></span>\n      </a>\n      <nav class=\"main-nav\">\n        <a href=\"#modellen\" id=\"navModellen\">Kamado Modellen</a>\n        <a href=\"#all-inclusive\" id=\"navAllInclusive\">All-Inclusive Uitrusting</a>\n        <a href=\"#accessoires\" id=\"navAccessoires\">Accessoires</a>\n        <a href=\"#waarom-craftkamado\" id=\"navWaarom\">Waarom CraftKamado?</a>\n        <a href=\"#reviews\" id=\"navReviews\">Ervaringen</a>\n      </nav>\n      <div class=\"header-actions\">\n        <div class=\"lang-switch\" id=\"langSwitch\" aria-label=\"Taalkeuze / Language\">\n          <button type=\"button\" class=\"lang-btn active\" data-lang=\"nl\" id=\"btnLangNl\" title=\"Nederlands\">🇳🇱 NL</button>\n          <button type=\"button\" class=\"lang-btn\" data-lang=\"en\" id=\"btnLangEn\" title=\"English\">🇬🇧 EN</button>\n        </div>\n        <button id=\"cartBtn\" class=\"cart-trigger\" aria-label=\"Winkelwagen openen\">\n          <span class=\"cart-icon\">🛒</span>\n          <span class=\"cart-text\" id=\"cartTriggerText\">Winkelwagen</span>\n          <span id=\"cartCountBadge\" class=\"cart-badge\">0</span>\n        </button>\n      </div>\n    </div>\n  </header>\n\n  <!-- Hero Section -->\n  <section class=\"hero-section\">\n    <div class=\"container hero-grid\">\n      <div class=\"hero-content\">\n        <div class=\"hero-label\">🔥 Dé Nieuwe Standaard in Buiten Koken</div>\n        <h1 class=\"hero-title\">Keramisch Meesterschap.<br><span class=\"highlight\">All-Inclusive</span> Geleverd.</h1>\n        <p class=\"hero-subtitle\">\n          Geen verborgen kosten, geen losse accessoires bijkopen. CraftKamado levert de meest complete keramische barbecue van Nederland, vervaardigd uit zwaar Mullite keramiek met gepatenteerd Air Hinge scharnier.\n        </p>\n        <div class=\"hero-usps\">\n          <div class=\"usp-pill\">✓ Levenslange garantie op keramiek</div>\n          <div class=\"usp-pill\">✓ Compleet met onderstel & zijtafels</div>\n          <div class=\"usp-pill\">✓ Gratis verzekerde palletbezorging</div>\n        </div>\n        <div class=\"hero-cta-group\">\n          <a href=\"#modellen\" class=\"btn btn-primary btn-lg\">Kies Jouw Kamado</a>\n          <a href=\"#all-inclusive\" class=\"btn btn-outline btn-lg\">Bekijk Uitrusting</a>\n        </div>\n      </div>\n      <div class=\"hero-media\">\n        <div class=\"hero-image-wrap\">\n          <img src=\"/assets/hero.webp\" alt=\"CraftKamado Premium BBQ\" class=\"hero-main-img\">\n          <div class=\"hero-floating-badge\">\n            <span class=\"badge-icon\">⭐</span>\n            <div class=\"badge-info\">\n              <strong>Vanaf €599,-</strong>\n              <small>Volledig compleet</small>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Model Selector & Configurator -->\n  <section id=\"modellen\" class=\"section models-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\" id=\"modelsSectionTag\">Formaten & Uitvoeringen</span>\n        <h2 class=\"section-title\" id=\"modelsSectionTitle\">Kies Jouw Perfecte CraftKamado</h2>\n        <p class=\"section-desc\" id=\"modelsSectionDesc\">Selecteer een model, formaat en kleur. Alle modellen worden geleverd met ons complete All-Inclusive pakket.</p>\n      </div>\n\n      <!-- Size Tabs -->\n      <div class=\"size-tabs\" id=\"sizeTabs\">\n        <button class=\"size-tab\" data-model-key=\"18_basic\">\n          <span class=\"tab-title\" id=\"tabTitle_18_basic\">18″ Basic</span>\n          <span class=\"tab-badge\">€599</span>\n        </button>\n        <button class=\"size-tab\" data-model-key=\"18_premium\">\n          <span class=\"tab-title\" id=\"tabTitle_18_premium\">18″ Premium</span>\n          <span class=\"tab-badge\">€699</span>\n        </button>\n        <button class=\"size-tab\" data-model-key=\"21\">\n          <span class=\"tab-title\" id=\"tabTitle_21\">21″ Veelzijdig</span>\n          <span class=\"tab-badge\">€889</span>\n        </button>\n        <button class=\"size-tab active\" data-model-key=\"23\">\n          <span class=\"popular-tag\" id=\"tabPopularTag\">Meest Gekozen</span>\n          <span class=\"tab-title\" id=\"tabTitle_23\">23″ Bestseller</span>\n          <span class=\"tab-badge\">€1.019</span>\n        </button>\n        <button class=\"size-tab\" data-model-key=\"27\">\n          <span class=\"tab-title\" id=\"tabTitle_27\">27″ HoReCa Reus</span>\n          <span class=\"tab-badge\">€1.319</span>\n        </button>\n      </div>\n\n      <!-- Interactive Configurator Box -->\n      <div class=\"config-card\" id=\"configCard\">\n        <div class=\"config-grid\">\n          <!-- Gallery / Preview -->\n          <div class=\"config-gallery\">\n            <div class=\"main-preview-wrap\">\n              <img id=\"activeModelImg\" src=\"/images/kamado_23_front.jpg\" alt=\"CraftKamado 23 inch\" class=\"config-img\">\n              <span id=\"activeModelBadge\" class=\"config-status-badge\">🔥 Meest Gekozen</span>\n            </div>\n            <div class=\"gallery-thumbs\" id=\"galleryThumbs\">\n              <!-- Dynamically populated thumbs -->\n            </div>\n          </div>\n\n          <!-- Options & Details -->\n          <div class=\"config-details\">\n            <div class=\"model-header\">\n              <h3 id=\"activeModelName\">CraftKamado 23″ Bestseller</h3>\n              <div class=\"model-pricing\">\n                <span class=\"current-price\" id=\"activeModelPrice\">€1.019,-</span>\n                <span class=\"original-price\" id=\"activeModelOrigPrice\">€1.178,-</span>\n                <span class=\"vat-tag\" id=\"modelVatTag\">Inclusief 21% BTW & Gratis Bezorging</span>\n              </div>\n            </div>\n\n            <p class=\"model-desc\" id=\"activeModelDesc\">\n              De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.\n            </p>\n\n            <!-- Specs Grid -->\n            <div class=\"specs-mini-grid\">\n              <div class=\"spec-box\">\n                <span class=\"spec-label\" id=\"specLabelGrate\">Grillrooster</span>\n                <strong id=\"specGrate\">Ø 52.3 cm</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\" id=\"specLabelBody\">Buitendiameter</span>\n                <strong id=\"specBody\">59.5 cm</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\" id=\"specLabelPeople\">Capaciteit</span>\n                <strong id=\"specPeople\">4–8 personen</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\" id=\"specLabelWeight\">Gewicht</span>\n                <strong id=\"specWeight\">89 kg</strong>\n              </div>\n            </div>\n\n            <!-- Color Options -->\n            <div class=\"option-block\">\n              <label class=\"option-label\"><span id=\"colorPickerLabel\">Kies Kleur:</span> <span id=\"selectedColorName\" class=\"selected-val\">Black (Onyx Zwart)</span></label>\n              <div class=\"color-options\" id=\"colorOptions\">\n                <button class=\"color-dot active\" data-color-id=\"black\" data-color-name=\"Black\" data-display-name=\"Black (Onyx Zwart)\" style=\"background-color: #171717;\" title=\"Black (Onyx Zwart)\"></button>\n                <button class=\"color-dot\" data-color-id=\"burgundy\" data-color-name=\"Burgundy\" data-display-name=\"Burgundy (Bordeaux Rood)\" style=\"background-color: #781d2e;\" title=\"Burgundy (Bordeaux Rood)\"></button>\n                <button class=\"color-dot\" data-color-id=\"blue\" data-color-name=\"Blue\" data-display-name=\"Blue (Marine Blauw)\" style=\"background-color: #1b3f75;\" title=\"Blue (Marine Blauw)\"></button>\n                <button class=\"color-dot\" data-color-id=\"green\" data-color-name=\"Green\" data-display-name=\"Green (Bosgroen)\" style=\"background-color: #235338;\" title=\"Green (Bosgroen)\"></button>\n                <button class=\"color-dot\" data-color-id=\"orange\" data-color-name=\"Orange\" data-display-name=\"Orange (Craft Oranje)\" style=\"background-color: #df5417;\" title=\"Orange (Craft Oranje)\"></button>\n                <button class=\"color-dot\" data-color-id=\"beige\" data-color-name=\"Beige\" data-display-name=\"Beige (Zand Beige)\" style=\"background-color: #d6cbb6;\" title=\"Beige (Zand Beige)\"></button>\n                <button class=\"color-dot\" data-color-id=\"yellow\" data-color-name=\"Yellow\" data-display-name=\"Yellow (Warm Okergeel)\" style=\"background-color: #dca326;\" title=\"Yellow (Warm Okergeel)\"></button>\n              </div>\n            </div>\n\n            <!-- Action Buttons -->\n            <div class=\"config-actions\">\n              <button id=\"addModelToCartBtn\" class=\"btn btn-primary btn-xl\">\n                <span>In Winkelwagen Leggen</span>\n                <strong id=\"addBtnPrice\">€1.019,-</strong>\n              </button>\n              <button id=\"directCheckoutBtn\" class=\"btn btn-secondary btn-xl\">\n                <span>Direct Bestellen</span>\n              </button>\n            </div>\n            <div class=\"reassurance-text\">\n              🔒 Veilig bestellen • 14 dagen zichttermijn • Gratis bezorging op afspraak\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- All-Inclusive Inbegrepen Pakket -->\n  <section id=\"all-inclusive\" class=\"section included-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\" id=\"incSectionTag\">Ongeëvenaarde Waarde</span>\n        <h2 class=\"section-title\" id=\"incSectionTitle\">Wat zit er Standaard in het Pakket?</h2>\n        <p class=\"section-desc\" id=\"incSectionDesc\">Bij andere merken betaal je honderden euro's extra voor accessoires. Bij CraftKamado is alles direct inbegrepen.</p>\n      </div>\n      <div class=\"included-grid\">\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">⚙️</div>\n          <h4 id=\"incCardTitle1\">Air Hinge Veerscharnier</h4>\n          <p id=\"incCardDesc1\">Moeiteloos openen en sluiten. De zware deksel blijft op elke gewenste stand veilig zweven zonder dicht te klappen.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🥩</div>\n          <h4 id=\"incCardTitle2\">Divide & Conquer Kooksysteem</h4>\n          <p id=\"incCardDesc2\">Tweedelig flexibel kooksysteem op verschillende hoogtes. Combineer tegelijkertijd direct grillen en indirect roken.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🛡️</div>\n          <h4 id=\"incCardTitle3\">Gietijzeren Halve Maan Rooster</h4>\n          <p id=\"incCardDesc3\">Inclusief zwaar gietijzeren rooster voor sensationele grillstrepen en sublieme karamellisatie van je vlees.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🧹</div>\n          <h4 id=\"incCardTitle4\">RVS Aslade & Schraper</h4>\n          <p id=\"incCardDesc4\">Gemakkelijk as verwijderen in een handomdraai zonder knoeien via de uitschuifbare RVS aslade.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🪵</div>\n          <h4 id=\"incCardTitle5\">Rookhout Toevoerpoort</h4>\n          <p id=\"incCardDesc5\">Voeg houtsnippers of chunks toe tijdens lange rooksessies zonder het deksel te openen en warmte te verliezen.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🌧️</div>\n          <h4 id=\"incCardTitle6\">Zware Weersbestendige Hoes</h4>\n          <p id=\"incCardDesc6\">Extra dikke, UV- en waterbestendige beschermhoes op maat, zodat jouw kamado in elk seizoen beschermd buiten staat.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🛞</div>\n          <h4 id=\"incCardTitle7\">Zwaar Rolbaar Onderstel</h4>\n          <p id=\"incCardDesc7\">Gepoedercoat stalen frame met 4 grote industriële zwenkwielen (waarvan 2 met stevige remvoet).</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🎋</div>\n          <h4 id=\"incCardTitle8\">Inklapbare Bamboe Zijtafels</h4>\n          <p id=\"incCardDesc8\">Stevige natuurlijke bamboe zijtafels met praktische haken voor je spatels, vleestangen en theedoeken.</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Size-Dependent Accessories Showcase -->\n  <section id=\"accessoires\" class=\"section accessories-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\" id=\"accSectionTag\">Maatwerk Accessoires</span>\n        <h2 class=\"section-title\" id=\"accSectionTitle\">Optionele Uitbreidingen op Maat</h2>\n        <p class=\"section-desc\" id=\"accSectionDesc\">\n          Prijzen en afmetingen van onderstaande accessoires passen zich automatisch aan op jouw geselecteerde <strong id=\"accSelectedSizeLabel\">23″ Kamado</strong>.\n        </p>\n      </div>\n\n      <div class=\"accessories-grid\" id=\"accessoriesGrid\">\n        <!-- Dynamically rendered accessories -->\n      </div>\n    </div>\n  </section>\n\n  <!-- Why CraftKamado -->\n  <section id=\"waarom-craftkamado\" class=\"section why-section\">\n    <div class=\"container\">\n      <div class=\"why-grid\">\n        <div class=\"why-text\">\n          <span class=\"section-tag\" id=\"whySectionTag\">Superieure Bouwkwaliteit</span>\n          <h2 class=\"section-title\" id=\"whySectionTitle\">Ontwikkeld voor Echte BBQ Fanaten</h2>\n          <p id=\"whySectionDesc\">\n            CraftKamado is ontstaan uit één heldere filosofie: een compromisloze keramische barbecue bouwen met de allerbeste materialen, zónder de torenhoge marketingopslagen van gevestigde merken.\n          </p>\n          <div class=\"why-features\">\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">1</span>\n              <div>\n                <h4 id=\"whyFeatTitle1\">Speciaal Mullite Keramiek</h4>\n                <p id=\"whyFeatDesc1\">Uitzonderlijk bestand tegen thermische schokken en temperaturen tot wel 1.000°C. Scheurt niet bij vrieskou of plotse hitte.</p>\n              </div>\n            </div>\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">2</span>\n              <div>\n                <h4 id=\"whyFeatTitle2\">30% Zuiniger Houtskoolverbruik</h4>\n                <p id=\"whyFeatDesc2\">Dankzij de superieure thermische massa kook je met één lading kwaliteits-houtskool tot wel 24 uur continu op 110°C.</p>\n              </div>\n            </div>\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">3</span>\n              <div>\n                <h4 id=\"whyFeatTitle3\">Direct Contact & Persoonlijke Service</h4>\n                <p id=\"whyFeatDesc3\">Onze experts staan altijd voor je klaar met advies over recepten, onderhoud en techniek.</p>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"why-visual\">\n          <img src=\"/images/kamado_bbq_lifestyle.jpg\" alt=\"Kamado Lifestyle Grilling\" class=\"why-img\">\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Customer Reviews -->\n  <section id=\"reviews\" class=\"section reviews-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\" id=\"revSectionTag\">Beoordelingen</span>\n        <h2 class=\"section-title\" id=\"revSectionTitle\">Wat Zeggen BBQ Liefhebbers?</h2>\n      </div>\n      <div class=\"reviews-grid\">\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\" id=\"revQuote1\">\"De prijs-kwaliteitverhouding is ongeëvenaard. Je krijgt een kamado van topniveau met scharnier en divide & conquer waar je bij anderen honderden euro's meer voor betaalt.\"</p>\n          <div class=\"review-author\">\n            <strong>Jan van der Meer</strong>\n            <span>Utrecht • CraftKamado 23″</span>\n          </div>\n        </div>\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\" id=\"revQuote2\">\"Het Air Hinge scharnier is een openbaring. De deksel van de 23 inch voelt vederlicht aan. Mijn vrouw kan hem nu ook gemakkelijk openen zonder angst.\"</p>\n          <div class=\"review-author\">\n            <strong>Mark de Jong</strong>\n            <span>Eindhoven • CraftKamado 23″</span>\n          </div>\n        </div>\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\" id=\"revQuote3\">\"Fantastische temperatuurstabiliteit! Eerste brisket van 14 uur gemaakt zonder de schuiven aan te hoeven raken. Ziet er prachtig uit in de tuin.\"</p>\n          <div class=\"review-author\">\n            <strong>Sander Bakker</strong>\n            <span>Haarlem • CraftKamado 21″</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Cart Drawer (Offcanvas) -->\n  <div class=\"cart-backdrop\" id=\"cartBackdrop\"></div>\n  <aside class=\"cart-drawer\" id=\"cartDrawer\">\n    <div class=\"cart-header\">\n      <h3 id=\"cartDrawerTitle\">Jouw Winkelwagen</h3>\n      <button id=\"closeCartBtn\" class=\"close-btn\" aria-label=\"Sluiten\">&times;</button>\n    </div>\n    <div class=\"cart-items\" id=\"cartItemsList\">\n      <div class=\"empty-cart-msg\">Je winkelwagen is nog leeg.</div>\n    </div>\n    <div class=\"cart-summary\" id=\"cartSummary\">\n      <div class=\"summary-row\">\n        <span id=\"cartRowKamadoLabel\">Kamado:</span>\n        <span id=\"cartKamadoSubtotal\">€0,-</span>\n      </div>\n      <div class=\"summary-row\">\n        <span id=\"cartRowAccLabel\">Accessoires:</span>\n        <span id=\"cartAccSubtotal\">€0,-</span>\n      </div>\n      <div class=\"summary-row\">\n        <span id=\"cartRowDeliveryLabel\">Palletbezorging (Nederland):</span>\n        <span class=\"text-free\" id=\"cartFreeLabel\">GRATIS</span>\n      </div>\n      <div class=\"summary-row total-row\">\n        <span id=\"cartRowTotalLabel\">Totaal (incl. BTW):</span>\n        <span id=\"cartTotal\">€0,-</span>\n      </div>\n      <button id=\"goToCheckoutBtn\" class=\"btn btn-primary btn-block btn-lg\" disabled>\n        Doorgaan naar Bestellen\n      </button>\n    </div>\n  </aside>\n\n  <!-- Checkout Modal -->\n  <div class=\"modal-backdrop\" id=\"checkoutModalBackdrop\">\n    <div class=\"modal-dialog checkout-modal\">\n      <div class=\"modal-header\">\n        <h3 id=\"chkModalTitle\">Afrekenen & Gegevens</h3>\n        <button id=\"closeCheckoutBtn\" class=\"close-btn\" aria-label=\"Sluiten\">&times;</button>\n      </div>\n      <div class=\"modal-body\">\n        <form id=\"checkoutForm\" novalidate>\n          <div class=\"checkout-step-title\" id=\"chkStep1Title\">1. Contactgegevens</div>\n          <div class=\"form-row\">\n            <div class=\"form-group\">\n              <label for=\"custEmail\" id=\"chkLabelEmail\">E-mailadres *</label>\n              <input type=\"email\" id=\"custEmail\" name=\"email\" autocomplete=\"email\" placeholder=\"bijv. jan@example.nl\" required>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"custPhone\" id=\"chkLabelPhone\">Telefoonnummer *</label>\n              <input type=\"tel\" id=\"custPhone\" name=\"phone\" autocomplete=\"tel\" placeholder=\"bijv. 06 12345678\" required>\n            </div>\n          </div>\n\n          <div class=\"checkout-step-title\" id=\"chkStep2Title\">2. Bezorgadres in Nederland</div>\n          <div class=\"form-group\">\n            <label for=\"custName\" id=\"chkLabelName\">Volledige Naam *</label>\n            <input type=\"text\" id=\"custName\" name=\"name\" autocomplete=\"name\" placeholder=\"Voor- en achternaam\" required>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"custStreet\" id=\"chkLabelStreet\">Straat en huisnummer</label>\n            <input type=\"text\" id=\"custStreet\" name=\"street\" autocomplete=\"street-address\" placeholder=\"bijv. Keizersgracht 42\">\n          </div>\n          <div class=\"form-row\">\n            <div class=\"form-group\">\n              <label for=\"custZip\" id=\"chkLabelZip\">Postcode *</label>\n              <input type=\"text\" id=\"custZip\" name=\"zip\" autocomplete=\"postal-code\" placeholder=\"bijv. 1015 CR\" required>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"custCity\" id=\"chkLabelCity\">Woonplaats *</label>\n              <input type=\"text\" id=\"custCity\" name=\"city\" autocomplete=\"address-level2\" placeholder=\"bijv. Amsterdam\" required>\n            </div>\n          </div>\n\n          <div class=\"checkout-step-title\" id=\"chkStep3Title\">3. Kies Betaalmethode</div>\n          <div class=\"payment-methods-grid\">\n            <label class=\"payment-opt active\">\n              <input type=\"radio\" name=\"payment_method\" value=\"ideal\" checked>\n              <div class=\"payment-opt-info\">\n                <strong>iDEAL</strong>\n                <small id=\"chkIdealSub\">Direct en veilig via Rabobank, ING, ABN AMRO, etc.</small>\n              </div>\n            </label>\n            <label class=\"payment-opt\">\n              <input type=\"radio\" name=\"payment_method\" value=\"creditcard\">\n              <div class=\"payment-opt-info\">\n                <strong>Creditcard</strong>\n                <small>Mastercard, Visa, American Express</small>\n              </div>\n            </label>\n            <label class=\"payment-opt\">\n              <input type=\"radio\" name=\"payment_method\" value=\"klarna\">\n              <div class=\"payment-opt-info\">\n                <strong>Klarna</strong>\n                <small id=\"chkKlarnaSub\">Achteraf betalen binnen 30 dagen</small>\n              </div>\n            </label>\n          </div>\n\n          <div class=\"checkout-summary-box\">\n            <div class=\"summary-line\">\n              <span id=\"chkSumModelLabel\">Gekozen model:</span>\n              <strong id=\"checkoutModelSummary\">-</strong>\n            </div>\n            <div class=\"summary-line\">\n              <span id=\"chkSumKamadoLabel\">Kamado prijs:</span>\n              <span id=\"checkoutKamadoPrice\">€0,-</span>\n            </div>\n            <div class=\"summary-line\">\n              <span id=\"chkSumAccLabel\">Accessoires:</span>\n              <span id=\"checkoutAccPrice\">€0,-</span>\n            </div>\n            <div class=\"summary-line\">\n              <span id=\"chkSumShipLabel\">Palletbezorging:</span>\n              <span class=\"text-free\" id=\"chkSumFreeLabel\">Gratis</span>\n            </div>\n            <div class=\"summary-line total\">\n              <span id=\"chkSumTotalLabel\">Totaalbedrag:</span>\n              <strong id=\"checkoutTotalAmount\">€0,-</strong>\n            </div>\n          </div>\n\n          <div class=\"form-errors\" id=\"formErrors\"></div>\n\n          <button type=\"submit\" id=\"submitIntentBtn\" class=\"btn btn-primary btn-block btn-xl\">\n            Doorgaan naar betaling\n          </button>\n          <small class=\"checkout-notice\" id=\"chkSslNotice\">\n            🔒 Veilig afrekenen via 256-bit SSL verbinding\n          </small>\n        </form>\n      </div>\n    </div>\n  </div>\n\n  <!-- Final Dutch Demand Notice Modal (DUTCH LEGAL COMPLIANT FLOW) -->\n  <div class=\"modal-backdrop\" id=\"intentNoticeBackdrop\">\n    <div class=\"modal-dialog notice-modal\" style=\"max-width: 580px; text-align: left;\">\n      <h2 style=\"font-size: 1.6rem; color: #fff; margin-bottom: 1rem; line-height: 1.3;\">\n        <span id=\"noticeTitle\">Bedankt voor je interesse in CraftKamado!</span>\n      </h2>\n\n      <div style=\"background: rgba(255, 107, 53, 0.08); border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.5rem;\">\n        <p id=\"noticeBody1\" style=\"color: #f1f5f9; font-size: 1.05rem; margin-bottom: 0.75rem; line-height: 1.6;\">\n          De door jou gekozen CraftKamado is momenteel nog niet beschikbaar in Nederland. We bereiden onze Nederlandse introductie voor.\n        </p>\n        <p id=\"noticeBody2\" style=\"color: #cbd5e1; font-size: 0.95rem; margin: 0; font-weight: 600;\">\n          Je bestelling is niet geplaatst en er is niets in rekening gebracht.\n        </p>\n      </div>\n\n      <p id=\"noticePrompt\" style=\"color: #cbd5e1; font-size: 1rem; margin-bottom: 1rem;\">\n        Wil je als eerste bericht krijgen zodra jouw gekozen Kamado beschikbaar is?\n      </p>\n\n      <div id=\"vipEmailContainer\" style=\"display: none; margin-bottom: 1rem;\">\n        <input type=\"email\" id=\"vipEmailInput\" placeholder=\"Jouw e-mailadres...\" style=\"width: 100%; padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid var(--border-color); background: #08090c; color: #fff;\">\n      </div>\n\n      <div id=\"vipConfirmationMsg\" style=\"display: none; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; padding: 1rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.95rem; font-weight: 600;\">\n        <!-- Filled dynamically -->\n      </div>\n\n      <button id=\"vipNotifyBtn\" class=\"btn btn-primary btn-block btn-lg\" style=\"font-size: 1.1rem;\">\n        Ja, houd mij op de hoogte\n      </button>\n      <button id=\"closeNoticeBtn\" class=\"btn btn-secondary btn-block\" style=\"margin-top: 0.75rem;\">\n        Sluiten\n      </button>\n    </div>\n  </div>\n\n  <!-- Footer -->\n  <footer class=\"site-footer\">\n    <div class=\"container footer-grid\">\n      <div class=\"footer-col\">\n        <div class=\"brand-logo footer-logo\">\n          <img src=\"/assets/craft-logo.png?v=3\" alt=\"CraftKamado Logo\" class=\"logo-img\">\n          <span class=\"brand-text\">Craft<span>Kamado</span></span>\n        </div>\n        <p id=\"footerDesc\">Dé all-inclusive keramische barbecue met levenslange garantie op het keramiek. Kwaliteit zonder concessies.</p>\n        <p class=\"copyright\" id=\"footerCopyright\">© 2026 CraftKamado Nederland. Alle rechten voorbehouden.</p>\n      </div>\n      <div class=\"footer-col\">\n        <h4 id=\"footerColQuick\">Snelle Links</h4>\n        <ul>\n          <li><a href=\"#modellen\" id=\"footerLinkModellen\">Kamado Modellen</a></li>\n          <li><a href=\"#all-inclusive\" id=\"footerLinkAllInc\">Inbegrepen Pakket</a></li>\n          <li><a href=\"#accessoires\" id=\"footerLinkAcc\">Maatwerk Accessoires</a></li>\n          <li><a href=\"#waarom-craftkamado\" id=\"footerLinkWaarom\">Onze Filosofie</a></li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <h4 id=\"footerColSupport\">Klantenservice</h4>\n        <ul>\n          <li>E-mail: <a href=\"mailto:contact@craftkamado.nl\">contact@craftkamado.nl</a></li>\n          <li id=\"footerSupportShip\">Verzending: Gratis palletlevering in heel Nederland</li>\n          <li id=\"footerSupportWarranty\">Garantie: Levenslang op keramiek, 5 jaar op scharnieren</li>\n          <li id=\"footerSupportReturns\">Retourneren: 30 dagen bedenktermijn</li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <h4 id=\"footerColSecurity\">Veiligheid & Betaalmethoden</h4>\n        <div class=\"payment-badges\">\n          <span class=\"pay-badge\">iDEAL</span>\n          <span class=\"pay-badge\">Mastercard</span>\n          <span class=\"pay-badge\">VISA</span>\n          <span class=\"pay-badge\">Klarna</span>\n        </div>\n        <small class=\"ssl-note\" id=\"footerSslNote\">🔒 256-bit SSL Beveiligde Verbinding</small>\n      </div>\n    </div>\n  </footer>\n\n  <script>\n/**\n * CraftKamado Netherlands - Market Demand Storefront Logic\n * - Full Dual-Language Support: Dutch (NL) & English (EN)\n * - Removed test indicators for 100% authentic e-commerce perception\n * - Funnel telemetry: visitor -> add_to_cart -> checkout -> purchase_intent\n * - Model selection: 18 Basic, 18 Premium, 21, 23, 27\n * - Color selection: Black, Burgundy, Blue, Green, Orange, Beige, Yellow\n * - Size-specific accessories matrix & attach rates\n * - Legal Dutch/English demand validation notice modal\n */\n\n(function() {\n  \"use strict\";\n\n  // --- CATALOG DATA ---\n  const KAMADO_MODELS = {\n    \"18_basic\": {\n      key: \"18_basic\",\n      name: { nl: \"CraftKamado 18″ Basic\", en: \"CraftKamado 18″ Basic\" },\n      sizeInch: \"18\",\n      modelCode: \"CK-18BAS\",\n      badge: { nl: \"Compact & Scherp Geprijsd\", en: \"Compact & Best Value\" },\n      price: 599,\n      origPrice: 749,\n      grate: \"Ø 38.5 cm\",\n      body: \"45.0 cm (17.7″)\",\n      people: { nl: \"2–4 personen\", en: \"2–4 people\" },\n      weight: \"55.0 kg\",\n      desc: {\n        nl: \"Compacte keramische kamado barbecue met uitstekende warmte-isolatie. Ideaal voor balkons, stadstuinen of kleine gezinnen.\",\n        en: \"Compact ceramic kamado BBQ with outstanding thermal insulation. Ideal for balconies, urban gardens or small families.\"\n      },\n      image: \"/images/kamado_18_front.jpg\",\n      thumbs: [\n        \"/images/kamado_18_front.jpg\",\n        \"/images/kamado_divide_open.jpg\",\n        \"/images/kamado_detail_vent.jpg\",\n        \"/images/kamado_bbq_lifestyle.jpg\"\n      ]\n    },\n    \"18_premium\": {\n      key: \"18_premium\",\n      name: { nl: \"CraftKamado 18″ Premium\", en: \"CraftKamado 18″ Premium\" },\n      sizeInch: \"18\",\n      modelCode: \"CK-18PREM\",\n      badge: { nl: \"Compact & Familie\", en: \"Compact & Family\" },\n      price: 699,\n      origPrice: 898,\n      grate: \"Ø 38.5 cm\",\n      body: \"45.0 cm (17.7″)\",\n      people: { nl: \"2–4 personen\", en: \"2–4 people\" },\n      weight: \"59.5 kg\",\n      desc: {\n        nl: \"Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.\",\n        en: \"High-end compact Mullite ceramic kamado. Complete All-Inclusive package with Air Hinge spring counter-balance, Divide & Conquer cooking system, cast iron grate, slide-out ash drawer, wood chip feeder and heavy weather cover.\"\n      },\n      image: \"/images/kamado_18_front.jpg\",\n      thumbs: [\n        \"/images/kamado_18_front.jpg\",\n        \"/images/kamado_divide_open.jpg\",\n        \"/images/kamado_detail_vent.jpg\",\n        \"/images/kamado_detail_hinge.jpg\",\n        \"/images/kamado_bbq_lifestyle.jpg\"\n      ]\n    },\n    \"21\": {\n      key: \"21\",\n      name: { nl: \"CraftKamado 21″ Veelzijdig\", en: \"CraftKamado 21″ Versatile\" },\n      sizeInch: \"21\",\n      modelCode: \"CK-21ALL\",\n      badge: { nl: \"Veelzijdig & Familie+\", en: \"Versatile & Family+\" },\n      price: 889,\n      origPrice: 1108,\n      grate: \"Ø 47.5 cm\",\n      body: \"53.6 cm (21.1″)\",\n      people: { nl: \"4–6 personen\", en: \"4–6 people\" },\n      weight: \"75.0 kg\",\n      desc: {\n        nl: \"Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.\",\n        en: \"The quintessential all-round size! Generous cooking surface for family and friends, featuring the full multi-level cooking rack, half-moon cast iron grate, and luxury finish.\"\n      },\n      image: \"/images/kamado_21_front.jpg\",\n      thumbs: [\n        \"/images/kamado_21_front.jpg\",\n        \"/images/kamado_divide_open.jpg\",\n        \"/images/kamado_detail_vent.jpg\",\n        \"/images/kamado_detail_hinge.jpg\",\n        \"/images/kamado_bbq_lifestyle.jpg\"\n      ]\n    },\n    \"23\": {\n      key: \"23\",\n      name: { nl: \"CraftKamado 23″ Bestseller\", en: \"CraftKamado 23″ Bestseller\" },\n      sizeInch: \"23\",\n      modelCode: \"CK-23BEST\",\n      badge: { nl: \"🔥 Bestseller / Meest Gekozen\", en: \"🔥 Bestseller / Most Popular\" },\n      price: 1019,\n      origPrice: 1178,\n      grate: \"Ø 52.3 cm\",\n      body: \"59.5 cm (23.5″)\",\n      people: { nl: \"4–8 personen (Ideaal)\", en: \"4–8 people (Optimal)\" },\n      weight: \"89.0 kg\",\n      desc: {\n        nl: \"De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.\",\n        en: \"The most popular kamado size in the Netherlands! Superb capacity for multiple whole chickens, racks of ribs, briskets or stone-baked pizza at once. Delivered fully All-Inclusive with rolling cart and side tables.\"\n      },\n      image: \"/images/kamado_23_front.jpg\",\n      thumbs: [\n        \"/images/kamado_23_front.jpg\",\n        \"/images/kamado_divide_open.jpg\",\n        \"/images/kamado_detail_vent.jpg\",\n        \"/images/kamado_detail_hinge.jpg\",\n        \"/images/kamado_bbq_lifestyle.jpg\"\n      ]\n    },\n    \"27\": {\n      key: \"27\",\n      name: { nl: \"CraftKamado 27″ HoReCa Reus\", en: \"CraftKamado 27″ Heavy Duty Giant\" },\n      sizeInch: \"27\",\n      modelCode: \"CK-27PRO\",\n      badge: { nl: \"Reus / HoReCa & Heavy Duty\", en: \"Giant / Commercial & Heavy Duty\" },\n      price: 1319,\n      origPrice: 1410,\n      grate: \"Ø 57.5 cm\",\n      body: \"67.7 cm (26.6″)\",\n      people: { nl: \"6–12+ personen\", en: \"6–12+ people\" },\n      weight: \"94.6 kg\",\n      desc: {\n        nl: \"Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.\",\n        en: \"Gigantic capacity for large gatherings, catering and heavy-duty commercial use. 57.5 cm stainless steel grate, dual precision air vent, and weightless lid balance.\"\n      },\n      image: \"/images/kamado_27_front.jpg\",\n      thumbs: [\n        \"/images/kamado_27_front.jpg\",\n        \"/images/kamado_divide_open.jpg\",\n        \"/images/kamado_detail_vent.jpg\",\n        \"/images/kamado_detail_hinge.jpg\",\n        \"/images/kamado_bbq_lifestyle.jpg\"\n      ]\n    }\n  };\n\n  const ACCESSORIES = [\n    {\n      id: \"cover\",\n      name: { nl: \"All-Weather Beschermhoes\", en: \"All-Weather Protective Cover\" },\n      isSizeDependent: true,\n      sizePrices: { \"18\": 39, \"21\": 45, \"23\": 49, \"27\": 59 },\n      desc: {\n        nl: \"Zware kwaliteit waterdichte en UV-bestendige hoes, precies op maat voor het gekozen formaat.\",\n        en: \"Heavy-duty waterproof and UV-resistant cover, tailor-made for your selected kamado size.\"\n      },\n      image: \"/images/cover.jpg\"\n    },\n    {\n      id: \"rotisserie\",\n      name: { nl: \"Draaispit / Rotisserie met motor\", en: \"Rotisserie Spit with Motor\" },\n      isSizeDependent: true,\n      sizePrices: { \"18\": 139, \"21\": 159, \"23\": 159, \"27\": 189 },\n      desc: {\n        nl: \"Krachtige 230V/batterij motor met RVS spies voor ultiem sappig gevogelte en braadstukken.\",\n        en: \"Powerful 230V/battery motor with food-grade stainless spit rod for extraordinarily juicy poultry and roasts.\"\n      },\n      image: \"/images/rotisserie.jpg\"\n    },\n    {\n      id: \"cast-iron-halfmoon\",\n      name: { nl: \"Gietijzeren Halve Maan Rooster / Plancha\", en: \"Cast Iron Half-Moon Grate / Plancha\" },\n      isSizeDependent: true,\n      sizePrices: { \"18\": 49, \"21\": 59, \"23\": 69, \"27\": 79 },\n      desc: {\n        nl: \"Tweezijdig bruikbaar: geribbeld voor grillstrepen, vlakke plancha voor burgers en groenten.\",\n        en: \"Reversible: ribbed side for authentic grill marks, flat plancha side for burgers, seafood and veggies.\"\n      },\n      image: \"/images/cast-iron.jpg\"\n    },\n    {\n      id: \"pizza-stone\",\n      name: { nl: \"Cordieriet Pizzasteen (Extra Dik)\", en: \"Cordierite Pizza Stone (Extra Thick)\" },\n      isSizeDependent: true,\n      sizePrices: { \"18\": 49, \"21\": 59, \"23\": 69, \"27\": 79 },\n      desc: {\n        nl: \"Bestand tegen 400°C voor de perfecte knapperige Napolitaanse pizzabodem.\",\n        en: \"Withstands up to 400°C to bake crispy, authentic Italian stone-oven pizzas.\"\n      },\n      image: \"/images/pizza.jpg\"\n    },\n    {\n      id: \"electric-starter\",\n      name: { nl: \"Elektrische Houtskoolaansteker (2000W)\", en: \"Electric Charcoal Lighter (2000W)\" },\n      isSizeDependent: false,\n      price: 59,\n      desc: {\n        nl: \"Binnen 60-90 seconden gloeiende houtskool met hete lucht, zonder chemicaliën.\",\n        en: \"Glowing charcoal in 60-90 seconds using clean superheated airflow without harmful lighter fluid.\"\n      },\n      image: \"/images/heat.jpg\"\n    },\n    {\n      id: \"bbq-gloves\",\n      name: { nl: \"Hittebestendige BBQ Handschoenen (350°C)\", en: \"Heat-Resistant BBQ Gloves (350°C)\" },\n      isSizeDependent: false,\n      price: 32,\n      desc: {\n        nl: \"Antislip siliconen voor het veilig beetpakken van hete grillroosters en pannen.\",\n        en: \"Non-slip silicone heat protection for safely handling hot grates and cast iron cookware.\"\n      },\n      image: \"/images/gloves.jpg\"\n    }\n  ];\n\n  const COLOR_OPTIONS = [\n    { id: \"black\", name: \"Black\", hex: \"#171717\", displayName: { nl: \"Black (Onyx Zwart)\", en: \"Black (Onyx Black)\" } },\n    { id: \"burgundy\", name: \"Burgundy\", hex: \"#781d2e\", displayName: { nl: \"Burgundy (Bordeaux Rood)\", en: \"Burgundy (Wine Red)\" } },\n    { id: \"blue\", name: \"Blue\", hex: \"#1b3f75\", displayName: { nl: \"Blue (Marine Blauw)\", en: \"Blue (Navy Blue)\" } },\n    { id: \"green\", name: \"Green\", hex: \"#235338\", displayName: { nl: \"Green (Bosgroen)\", en: \"Green (Forest Green)\" } },\n    { id: \"orange\", name: \"Orange\", hex: \"#df5417\", displayName: { nl: \"Orange (Craft Oranje)\", en: \"Orange (Craft Orange)\" } },\n    { id: \"beige\", name: \"Beige\", hex: \"#d6cbb6\", displayName: { nl: \"Beige (Zand Beige)\", en: \"Beige (Sand Beige)\" } },\n    { id: \"yellow\", name: \"Yellow\", hex: \"#dca326\", displayName: { nl: \"Yellow (Warm Okergeel)\", en: \"Yellow (Warm Ochre)\" } }\n  ];\n\n  // --- I18N DICTIONARY ---\n  const TRANSLATIONS = {\n    nl: {\n      topBanner: \"🇳🇱 <strong>Gratis verzekerde palletlevering</strong> in heel Nederland • Tijdelijke voorjaarsactie: All-Inclusive pakket inbegrepen!\",\n      navModellen: \"Kamado Modellen\",\n      navAllInclusive: \"All-Inclusive Uitrusting\",\n      navAccessoires: \"Accessoires\",\n      navWaarom: \"Waarom CraftKamado?\",\n      navReviews: \"Ervaringen\",\n      cartTriggerText: \"Winkelwagen\",\n      heroTitle: \"Keramisch Meesterschap.<br><span class=\\\"highlight\\\">All-Inclusive</span> Geleverd.\",\n      heroSubtitle: \"Geen verborgen kosten, geen losse accessoires bijkopen. CraftKamado levert de meest complete keramische barbecue van Nederland, vervaardigd uit zwaar Mullite keramiek met gepatenteerd Air Hinge scharnier.\",\n      \n      // Modellen Section\n      modelsSectionTag: \"Formaten & Uitvoeringen\",\n      modelsSectionTitle: \"Kies Jouw Perfecte CraftKamado\",\n      modelsSectionDesc: \"Selecteer een model, formaat en kleur. Alle modellen worden geleverd met ons complete All-Inclusive pakket.\",\n      tabTitle_18_basic: \"18″ Basic\",\n      tabTitle_18_premium: \"18″ Premium\",\n      tabTitle_21: \"21″ Veelzijdig\",\n      tabTitle_23: \"23″ Bestseller\",\n      tabTitle_27: \"27″ HoReCa Reus\",\n      tabPopularTag: \"Meest Gekozen\",\n      specLabelGrate: \"Grillrooster\",\n      specLabelBody: \"Buitendiameter\",\n      specLabelPeople: \"Capaciteit\",\n      specLabelWeight: \"Gewicht\",\n      colorPickerLabel: \"Kies Kleur:\",\n      modelVatTag: \"Inclusief 21% BTW & Gratis Bezorging\",\n      addKamadoBtnText: \"In Winkelwagen Leggen\",\n      \n      // All-Inclusive Section\n      incSectionTag: \"Ongeëvenaarde Waarde\",\n      incSectionTitle: \"Wat zit er Standaard in het Pakket?\",\n      incSectionDesc: \"Bij andere merken betaal je honderden euro's extra voor accessoires. Bij CraftKamado is alles direct inbegrepen.\",\n      incCardTitle1: \"Air Hinge Veerscharnier\",\n      incCardDesc1: \"Moeiteloos openen en sluiten. De zware deksel blijft op elke gewenste stand veilig zweven zonder dicht te klappen.\",\n      incCardTitle2: \"Divide & Conquer Kooksysteem\",\n      incCardDesc2: \"Tweedelig flexibel kooksysteem op verschillende hoogtes. Combineer tegelijkertijd direct grillen en indirect roken.\",\n      incCardTitle3: \"Gietijzeren Halve Maan Rooster\",\n      incCardDesc3: \"Inclusief zwaar gietijzeren rooster voor sensationele grillstrepen en sublieme karamellisatie van je vlees.\",\n      incCardTitle4: \"RVS Aslade & Schraper\",\n      incCardDesc4: \"Gemakkelijk as verwijderen in een handomdraai zonder knoeien via de uitschuifbare RVS aslade.\",\n      incCardTitle5: \"Rookhout Toevoerpoort\",\n      incCardDesc5: \"Voeg houtsnippers of chunks toe tijdens lange rooksessies zonder het deksel te openen en warmte te verliezen.\",\n      incCardTitle6: \"Zware Weersbestendige Hoes\",\n      incCardDesc6: \"Extra dikke, UV- en waterbestendige beschermhoes op maat, zodat jouw kamado in elk seizoen beschermd buiten staat.\",\n      incCardTitle7: \"Zwaar Rolbaar Onderstel\",\n      incCardDesc7: \"Gepoedercoat stalen frame met 4 grote industriële zwenkwielen (waarvan 2 met stevige remvoet).\",\n      incCardTitle8: \"Inklapbare Bamboe Zijtafels\",\n      incCardDesc8: \"Stevige natuurlijke bamboe zijtafels met praktische haken voor je spatels, vleestangen en theedoeken.\",\n\n      // Accessories Section\n      accSectionTag: \"Maatwerk Accessoires\",\n      accSectionTitle: \"Optionele Uitbreidingen op Maat\",\n      accSectionDescTemplate: \"Prijzen en afmetingen van onderstaande accessoires passen zich automatisch aan op jouw geselecteerde <strong id=\\\"accSelectedSizeLabel\\\">{size}″ Kamado</strong>.\",\n      addAccBtn: \"+ Toevoegen\",\n      addedAccBtn: \"✓ Toegevoegd\",\n\n      // Waarom Section\n      whySectionTag: \"Superieure Bouwkwaliteit\",\n      whySectionTitle: \"Ontwikkeld voor Echte BBQ Fanaten\",\n      whySectionDesc: \"CraftKamado is ontstaan uit één heldere filosofie: een compromisloze keramische barbecue bouwen met de allerbeste materialen, zónder de torenhoge marketingopslagen van gevestigde merken.\",\n      whyFeatTitle1: \"Speciaal Mullite Keramiek\",\n      whyFeatDesc1: \"Uitzonderlijk bestand tegen thermische schokken en temperaturen tot wel 1.000°C. Scheurt niet bij vrieskou of plotse hitte.\",\n      whyFeatTitle2: \"30% Zuiniger Houtskoolverbruik\",\n      whyFeatDesc2: \"Dankzij de superieure thermische massa kook je met één lading kwaliteits-houtskool tot wel 24 uur continu op 110°C.\",\n      whyFeatTitle3: \"Direct Contact & Persoonlijke Service\",\n      whyFeatDesc3: \"Onze experts staan altijd voor je klaar met advies over recepten, onderhoud en techniek.\",\n\n      // Reviews Section\n      revSectionTag: \"Beoordelingen\",\n      revSectionTitle: \"Wat Zeggen BBQ Liefhebbers?\",\n      revQuote1: \"\\\"De prijs-kwaliteitverhouding is ongeëvenaard. Je krijgt een kamado van topniveau met scharnier en divide & conquer waar je bij anderen honderden euro's meer voor betaalt.\\\"\",\n      revQuote2: \"\\\"Het Air Hinge scharnier is een openbaring. De deksel van de 23 inch voelt vederlicht aan. Mijn vrouw kan hem nu ook gemakkelijk openen zonder angst.\\\"\",\n      revQuote3: \"\\\"Fantastische temperatuurstabiliteit! Eerste brisket van 14 uur gemaakt zonder de schuiven aan te hoeven raken. Ziet er prachtig uit in de tuin.\\\"\",\n\n      // Cart Drawer\n      cartDrawerTitle: \"Jouw Winkelwagen\",\n      cartRowKamadoLabel: \"Kamado:\",\n      cartRowAccLabel: \"Accessoires:\",\n      cartRowDeliveryLabel: \"Palletbezorging (Nederland):\",\n      cartFreeLabel: \"GRATIS\",\n      cartRowTotalLabel: \"Totaal (incl. BTW):\",\n      emptyCartMsg: \"Je winkelwagen is nog leeg.\",\n      goToCheckoutBtn: \"Doorgaan naar Bestellen\",\n\n      // Checkout Modal\n      chkModalTitle: \"Afrekenen & Gegevens\",\n      chkStep1Title: \"1. Contactgegevens\",\n      chkLabelEmail: \"E-mailadres *\",\n      chkLabelPhone: \"Telefoonnummer *\",\n      chkStep2Title: \"2. Bezorgadres in Nederland\",\n      chkLabelName: \"Volledige Naam *\",\n      chkLabelStreet: \"Straat en huisnummer\",\n      chkLabelZip: \"Postcode *\",\n      chkLabelCity: \"Woonplaats *\",\n      chkStep3Title: \"3. Kies Betaalmethode\",\n      chkIdealSub: \"Direct en veilig via Rabobank, ING, ABN AMRO, etc.\",\n      chkKlarnaSub: \"Achteraf betalen binnen 30 dagen\",\n      chkSumModelLabel: \"Gekozen model:\",\n      chkSumKamadoLabel: \"Kamado prijs:\",\n      chkSumAccLabel: \"Accessoires:\",\n      chkSumShipLabel: \"Palletbezorging:\",\n      chkSumFreeLabel: \"Gratis\",\n      chkSumTotalLabel: \"Totaalbedrag:\",\n      submitIntentBtn: \"Doorgaan naar betaling\",\n      chkSslNotice: \"🔒 Veilig afrekenen via 256-bit SSL verbinding\",\n\n      // Notice Modal\n      noticeTitle: \"Bedankt voor je interesse in CraftKamado!\",\n      noticeBody1: \"De door jou gekozen CraftKamado is momenteel nog niet beschikbaar in Nederland. We bereiden onze Nederlandse introductie voor.\",\n      noticeBody2: \"Je bestelling is niet geplaatst en er is niets in rekening gebracht.\",\n      noticePrompt: \"Wil je als eerste bericht krijgen zodra jouw gekozen Kamado beschikbaar is?\",\n      vipNotifyBtn: \"Ja, houd mij op de hoogte\",\n      closeNoticeBtn: \"Sluiten\",\n      vipAckMsg: \"✓ Dankjewel! We hebben je e-mailadres (<strong>{email}</strong>) genoteerd. Zodra jouw gekozen Kamado beschikbaar is, ontvang je direct bericht als eerste!\",\n\n      // Footer\n      footerDesc: \"Dé all-inclusive keramische barbecue met levenslange garantie op het keramiek. Kwaliteit zonder concessies.\",\n      footerCopyright: \"© 2026 CraftKamado Nederland. Alle rechten voorbehouden.\",\n      footerColQuick: \"Snelle Links\",\n      footerLinkModellen: \"Kamado Modellen\",\n      footerLinkAllInc: \"Inbegrepen Pakket\",\n      footerLinkAcc: \"Maatwerk Accessoires\",\n      footerLinkWaarom: \"Onze Filosofie\",\n      footerColSupport: \"Klantenservice\",\n      footerSupportShip: \"Verzending: Gratis palletlevering in heel Nederland\",\n      footerSupportWarranty: \"Garantie: Levenslang op keramiek, 5 jaar op scharnieren\",\n      footerSupportReturns: \"Retourneren: 30 dagen bedenktermijn\",\n      footerColSecurity: \"Veiligheid & Betaalmethoden\",\n      footerSslNote: \"🔒 256-bit SSL Beveiligde Verbinding\"\n    },\n    en: {\n      topBanner: \"🇳🇱 <strong>Free insured pallet delivery</strong> throughout the Netherlands • Temporary spring promotion: All-Inclusive package included!\",\n      navModellen: \"Kamado Models\",\n      navAllInclusive: \"All-Inclusive Gear\",\n      navAccessoires: \"Accessories\",\n      navWaarom: \"Why CraftKamado?\",\n      navReviews: \"Reviews\",\n      cartTriggerText: \"Cart\",\n      heroTitle: \"Ceramic Mastery.<br><span class=\\\"highlight\\\">All-Inclusive</span> Delivered.\",\n      heroSubtitle: \"No hidden costs, no separate accessories to purchase. CraftKamado delivers the most complete ceramic BBQ in the Netherlands, crafted from heavy-duty Mullite ceramic with patented Air Hinge counter-balance.\",\n      \n      // Modellen Section\n      modelsSectionTag: \"Sizes & Editions\",\n      modelsSectionTitle: \"Choose Your Perfect CraftKamado\",\n      modelsSectionDesc: \"Select a model, size and color. All models arrive complete with our comprehensive All-Inclusive package.\",\n      tabTitle_18_basic: \"18″ Basic\",\n      tabTitle_18_premium: \"18″ Premium\",\n      tabTitle_21: \"21″ Versatile\",\n      tabTitle_23: \"23″ Bestseller\",\n      tabTitle_27: \"27″ HoReCa Giant\",\n      tabPopularTag: \"Most Popular\",\n      specLabelGrate: \"Cooking Grate\",\n      specLabelBody: \"Outer Diameter\",\n      specLabelPeople: \"Capacity\",\n      specLabelWeight: \"Weight\",\n      colorPickerLabel: \"Choose Color:\",\n      modelVatTag: \"Includes 21% VAT & Free Insured Delivery\",\n      addKamadoBtnText: \"Add to Shopping Cart\",\n      \n      // All-Inclusive Section\n      incSectionTag: \"Unmatched Value\",\n      incSectionTitle: \"What's Included as Standard?\",\n      incSectionDesc: \"Other brands charge hundreds of euros extra for essential gear. With CraftKamado, everything is fully included out of the box.\",\n      incCardTitle1: \"Air Hinge Spring System\",\n      incCardDesc1: \"Effortless opening and closing. Heavy lid stays safely counter-balanced at any desired angle without slamming shut.\",\n      incCardTitle2: \"Divide & Conquer Cooking System\",\n      incCardDesc2: \"Two-level flexible cooking system. Simultaneously grill direct and smoke indirect at different heat levels.\",\n      incCardTitle3: \"Cast Iron Half-Moon Grate\",\n      incCardDesc3: \"Includes heavy-duty cast iron grate for restaurant-grade searing and mouthwatering caramelization.\",\n      incCardTitle4: \"Stainless Ash Drawer & Scraper\",\n      incCardDesc4: \"Effortless ash disposal in seconds without mess via the sliding stainless steel drawer and ash tool.\",\n      incCardTitle5: \"Wood Chip Feeder Port\",\n      incCardDesc5: \"Add smoking chips or chunks mid-cook without lifting the dome or losing heat.\",\n      incCardTitle6: \"Heavy All-Weather Cover\",\n      incCardDesc6: \"Heavy-duty waterproof and UV-resistant custom fitted cover to keep your kamado protected outdoors all year round.\",\n      incCardTitle7: \"Heavy Rolling Cart\",\n      incCardDesc7: \"Powder-coated steel cart with 4 large industrial caster wheels (including 2 heavy foot locks).\",\n      incCardTitle8: \"Folding Bamboo Side Shelves\",\n      incCardDesc8: \"Sturdy natural bamboo shelves with integrated accessory hooks for spatulas, meat tongs and towels.\",\n\n      // Accessories Section\n      accSectionTag: \"Custom Accessories\",\n      accSectionTitle: \"Optional Tailored Accessories\",\n      accSectionDescTemplate: \"Prices and dimensions of the accessories below automatically match your selected <strong id=\\\"accSelectedSizeLabel\\\">{size}″ Kamado</strong>.\",\n      addAccBtn: \"+ Add to Cart\",\n      addedAccBtn: \"✓ Added\",\n\n      // Waarom Section\n      whySectionTag: \"Superior Build Quality\",\n      whySectionTitle: \"Engineered for True BBQ Enthusiasts\",\n      whySectionDesc: \"CraftKamado was born from a clear principle: build an uncompromising ceramic grill using the finest materials, without the inflated markups of traditional brands.\",\n      whyFeatTitle1: \"Specialized Mullite Ceramic\",\n      whyFeatDesc1: \"Exceptional thermal shock resistance up to 1,000°C. Resists cracking during sudden temperature spikes or winter frosts.\",\n      whyFeatTitle2: \"30% Lower Charcoal Consumption\",\n      whyFeatDesc2: \"Superior thermal mass enables low & slow cooking for up to 24 hours continuously on a single batch of quality lump charcoal.\",\n      whyFeatTitle3: \"Direct Contact & Dedicated Support\",\n      whyFeatDesc3: \"Our barbecue specialists are always available with hands-on advice for setup, recipes and maintenance.\",\n\n      // Reviews Section\n      revSectionTag: \"Customer Reviews\",\n      revSectionTitle: \"What BBQ Lovers Say\",\n      revQuote1: \"\\\"The value for money is unmatched. You get a top-tier kamado with spring hinge and divide & conquer where other brands charge hundreds more.\\\"\",\n      revQuote2: \"\\\"The Air Hinge counter-balance is a revelation. The heavy lid of the 23-inch feels feather-light. My wife can easily open it with one hand.\\\"\",\n      revQuote3: \"\\\"Superb temperature stability! Cooked my first 14-hour brisket without having to adjust the dampers once. Looks gorgeous in our garden.\\\"\",\n\n      // Cart Drawer\n      cartDrawerTitle: \"Your Shopping Cart\",\n      cartRowKamadoLabel: \"Kamado:\",\n      cartRowAccLabel: \"Accessories:\",\n      cartRowDeliveryLabel: \"Pallet Delivery (Netherlands):\",\n      cartFreeLabel: \"FREE\",\n      cartRowTotalLabel: \"Total (incl. VAT):\",\n      emptyCartMsg: \"Your shopping cart is currently empty.\",\n      goToCheckoutBtn: \"Proceed to Checkout\",\n\n      // Checkout Modal\n      chkModalTitle: \"Checkout & Shipping\",\n      chkStep1Title: \"1. Contact Details\",\n      chkLabelEmail: \"Email Address *\",\n      chkLabelPhone: \"Phone Number *\",\n      chkStep2Title: \"2. Delivery Address in the Netherlands\",\n      chkLabelName: \"Full Name *\",\n      chkLabelStreet: \"Street and house number\",\n      chkLabelZip: \"Postal Code *\",\n      chkLabelCity: \"City *\",\n      chkStep3Title: \"3. Select Payment Method\",\n      chkIdealSub: \"Fast and secure via Dutch bank transfer (Rabobank, ING, ABN AMRO, etc.)\",\n      chkKlarnaSub: \"Pay later within 30 days\",\n      chkSumModelLabel: \"Selected model:\",\n      chkSumKamadoLabel: \"Kamado price:\",\n      chkSumAccLabel: \"Accessories:\",\n      chkSumShipLabel: \"Pallet delivery:\",\n      chkSumFreeLabel: \"Free\",\n      chkSumTotalLabel: \"Total amount:\",\n      submitIntentBtn: \"Continue to payment\",\n      chkSslNotice: \"🔒 Secure checkout via 256-bit SSL encryption\",\n\n      // Notice Modal\n      noticeTitle: \"Thank you for your interest in CraftKamado!\",\n      noticeBody1: \"The CraftKamado you selected is currently not yet available in the Netherlands. We are preparing our launch in the Netherlands.\",\n      noticeBody2: \"Your order has not been placed and nothing has been charged.\",\n      noticePrompt: \"Would you like to be the first to know as soon as your chosen Kamado becomes available?\",\n      vipNotifyBtn: \"Yes, keep me updated\",\n      closeNoticeBtn: \"Close\",\n      vipAckMsg: \"✓ Thank you! We have noted your email address (<strong>{email}</strong>). As soon as your chosen Kamado is available, you will be the first to know!\",\n\n      // Footer\n      footerDesc: \"The all-inclusive ceramic barbecue with lifetime warranty on ceramics. Uncompromising quality.\",\n      footerCopyright: \"© 2026 CraftKamado Netherlands. All rights reserved.\",\n      footerColQuick: \"Quick Links\",\n      footerLinkModellen: \"Kamado Models\",\n      footerLinkAllInc: \"Included Gear\",\n      footerLinkAcc: \"Tailored Accessories\",\n      footerLinkWaarom: \"Our Philosophy\",\n      footerColSupport: \"Customer Support\",\n      footerSupportShip: \"Shipping: Free insured pallet delivery in the Netherlands\",\n      footerSupportWarranty: \"Warranty: Lifetime on ceramics, 5 years on hardware\",\n      footerSupportReturns: \"Returns: 30-day return policy\",\n      footerColSecurity: \"Security & Payment Methods\",\n      footerSslNote: \"🔒 256-bit SSL Secure Connection\"\n    }\n  };\n\n  // --- ATTRIBUTION DETECTION ---\n  function getUrlParams() {\n    const params = {};\n    new URLSearchParams(window.location.search).forEach((v, k) => {\n      params[k] = v;\n    });\n    return params;\n  }\n\n  function detectSource() {\n    const params = getUrlParams();\n    if (params.utm_source) {\n      return params.utm_medium ? `${params.utm_source} / ${params.utm_medium}` : params.utm_source;\n    }\n    const ref = document.referrer || \"\";\n    if (ref.includes(\"facebook\") || ref.includes(\"fb.me\") || ref.includes(\"instagram\")) return \"Facebook / Meta Ad\";\n    if (ref.includes(\"google\")) return \"Google Search\";\n    if (ref.includes(\"tiktok\")) return \"TikTok\";\n    return ref ? ref.replace(/https?:\\/\\/(www\\.)?/, \"\").split(\"/\")[0] : \"Direct\";\n  }\n\n  const trafficSource = detectSource();\n\n  // --- STATE ---\n  let currentLang = localStorage.getItem(\"craft_nl_lang\") || (new URLSearchParams(window.location.search).get(\"lang\") === \"en\" ? \"en\" : \"nl\");\n  let activeModelKey = \"23\";\n  let initialColor = \"Black\";\n  let currentColor = COLOR_OPTIONS[0];\n  let cart = [];\n  let checkoutEmailEntered = \"\";\n\n  function getSessionId() {\n    let sid = localStorage.getItem(\"craft_nl_session\");\n    if (!sid) {\n      sid = \"nl_\" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);\n      localStorage.setItem(\"craft_nl_session\", sid);\n    }\n    return sid;\n  }\n\n  const sessionId = getSessionId();\n\n  // --- TELEMETRY ---\n  async function trackEvent(eventType, payload = {}) {\n    try {\n      await fetch(\"/api/market-test/track\", {\n        method: \"POST\",\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify({\n          sessionId,\n          eventType,\n          payload: {\n            ...payload,\n            lang: currentLang,\n            source: trafficSource,\n            landingPage: window.location.pathname + window.location.search,\n            initialColor,\n            finalColor: currentColor.name,\n            timestamp: new Date().toISOString()\n          }\n        })\n      });\n    } catch (e) {}\n  }\n\n  async function syncCartTelemetry(lastStep = \"cart\") {\n    try {\n      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);\n      await fetch(\"/api/market-test/cart-update\", {\n        method: \"POST\",\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify({\n          sessionId,\n          items: cart,\n          totalAmount,\n          lastStep,\n          source: trafficSource,\n          email: checkoutEmailEntered || null\n        })\n      });\n    } catch (e) {}\n  }\n\n  function formatEur(amount) {\n    return \"€\" + Number(amount || 0).toLocaleString(\"nl-NL\") + \",-\";\n  }\n\n  // --- I18N SWITCHER ---\n  function setLanguage(lang) {\n    currentLang = lang === \"en\" ? \"en\" : \"nl\";\n    localStorage.setItem(\"craft_nl_lang\", currentLang);\n    document.documentElement.lang = currentLang;\n\n    // Toggle button active states\n    document.getElementById(\"btnLangNl\")?.classList.toggle(\"active\", currentLang === \"nl\");\n    document.getElementById(\"btnLangEn\")?.classList.toggle(\"active\", currentLang === \"en\");\n\n    const t = TRANSLATIONS[currentLang];\n\n    const setElemText = (id, text) => {\n      const el = document.getElementById(id);\n      if (el && text !== undefined) el.textContent = text;\n    };\n    const setElemHtml = (id, html) => {\n      const el = document.getElementById(id);\n      if (el && html !== undefined) el.innerHTML = html;\n    };\n\n    // Nav\n    setElemText(\"navModellen\", t.navModellen);\n    setElemText(\"navAllInclusive\", t.navAllInclusive);\n    setElemText(\"navAccessoires\", t.navAccessoires);\n    setElemText(\"navWaarom\", t.navWaarom);\n    setElemText(\"navReviews\", t.navReviews);\n    setElemText(\"cartTriggerText\", t.cartTriggerText);\n\n    // Hero\n    const heroTitleEl = document.querySelector(\".hero-title\");\n    if (heroTitleEl) heroTitleEl.innerHTML = t.heroTitle;\n    const heroSubEl = document.querySelector(\".hero-subtitle\");\n    if (heroSubEl) heroSubEl.textContent = t.heroSubtitle;\n\n    // Modellen\n    setElemText(\"modelsSectionTag\", t.modelsSectionTag);\n    setElemText(\"modelsSectionTitle\", t.modelsSectionTitle);\n    setElemText(\"modelsSectionDesc\", t.modelsSectionDesc);\n    setElemText(\"tabTitle_18_basic\", t.tabTitle_18_basic);\n    setElemText(\"tabTitle_18_premium\", t.tabTitle_18_premium);\n    setElemText(\"tabTitle_21\", t.tabTitle_21);\n    setElemText(\"tabTitle_23\", t.tabTitle_23);\n    setElemText(\"tabTitle_27\", t.tabTitle_27);\n    setElemText(\"tabPopularTag\", t.tabPopularTag);\n    setElemText(\"specLabelGrate\", t.specLabelGrate);\n    setElemText(\"specLabelBody\", t.specLabelBody);\n    setElemText(\"specLabelPeople\", t.specLabelPeople);\n    setElemText(\"specLabelWeight\", t.specLabelWeight);\n    setElemText(\"colorPickerLabel\", t.colorPickerLabel);\n    setElemText(\"modelVatTag\", t.modelVatTag);\n    setElemText(\"addKamadoBtnText\", t.addKamadoBtnText);\n\n    // All-Inclusive\n    setElemText(\"incSectionTag\", t.incSectionTag);\n    setElemText(\"incSectionTitle\", t.incSectionTitle);\n    setElemText(\"incSectionDesc\", t.incSectionDesc);\n    for (let i = 1; i <= 8; i++) {\n      setElemText(`incCardTitle${i}`, t[`incCardTitle${i}`]);\n      setElemText(`incCardDesc${i}`, t[`incCardDesc${i}`]);\n    }\n\n    // Accessoires Section\n    setElemText(\"accSectionTag\", t.accSectionTag);\n    setElemText(\"accSectionTitle\", t.accSectionTitle);\n    const curSize = KAMADO_MODELS[activeModelKey]?.sizeInch || \"23\";\n    setElemHtml(\"accSectionDesc\", t.accSectionDescTemplate.replace(\"{size}\", curSize));\n\n    // Waarom\n    setElemText(\"whySectionTag\", t.whySectionTag);\n    setElemText(\"whySectionTitle\", t.whySectionTitle);\n    setElemText(\"whySectionDesc\", t.whySectionDesc);\n    setElemText(\"whyFeatTitle1\", t.whyFeatTitle1);\n    setElemText(\"whyFeatDesc1\", t.whyFeatDesc1);\n    setElemText(\"whyFeatTitle2\", t.whyFeatTitle2);\n    setElemText(\"whyFeatDesc2\", t.whyFeatDesc2);\n    setElemText(\"whyFeatTitle3\", t.whyFeatTitle3);\n    setElemText(\"whyFeatDesc3\", t.whyFeatDesc3);\n\n    // Reviews\n    setElemText(\"revSectionTag\", t.revSectionTag);\n    setElemText(\"revSectionTitle\", t.revSectionTitle);\n    setElemText(\"revQuote1\", t.revQuote1);\n    setElemText(\"revQuote2\", t.revQuote2);\n    setElemText(\"revQuote3\", t.revQuote3);\n\n    // Cart Drawer\n    setElemText(\"cartDrawerTitle\", t.cartDrawerTitle);\n    setElemText(\"cartRowKamadoLabel\", t.cartRowKamadoLabel);\n    setElemText(\"cartRowAccLabel\", t.cartRowAccLabel);\n    setElemText(\"cartRowDeliveryLabel\", t.cartRowDeliveryLabel);\n    setElemText(\"cartFreeLabel\", t.cartFreeLabel);\n    setElemText(\"cartRowTotalLabel\", t.cartRowTotalLabel);\n    setElemText(\"goToCheckoutBtn\", t.goToCheckoutBtn);\n\n    // Checkout Modal\n    setElemText(\"chkModalTitle\", t.chkModalTitle);\n    setElemText(\"chkStep1Title\", t.chkStep1Title);\n    setElemText(\"chkLabelEmail\", t.chkLabelEmail);\n    setElemText(\"chkLabelPhone\", t.chkLabelPhone);\n    setElemText(\"chkStep2Title\", t.chkStep2Title);\n    setElemText(\"chkLabelName\", t.chkLabelName);\n    setElemText(\"chkLabelStreet\", t.chkLabelStreet);\n    setElemText(\"chkLabelZip\", t.chkLabelZip);\n    setElemText(\"chkLabelCity\", t.chkLabelCity);\n    setElemText(\"chkStep3Title\", t.chkStep3Title);\n    setElemText(\"chkIdealSub\", t.chkIdealSub);\n    setElemText(\"chkKlarnaSub\", t.chkKlarnaSub);\n    setElemText(\"chkSumModelLabel\", t.chkSumModelLabel);\n    setElemText(\"chkSumKamadoLabel\", t.chkSumKamadoLabel);\n    setElemText(\"chkSumAccLabel\", t.chkSumAccLabel);\n    setElemText(\"chkSumShipLabel\", t.chkSumShipLabel);\n    setElemText(\"chkSumFreeLabel\", t.chkSumFreeLabel);\n    setElemText(\"chkSumTotalLabel\", t.chkSumTotalLabel);\n    setElemText(\"submitIntentBtn\", t.submitIntentBtn);\n    setElemText(\"chkSslNotice\", t.chkSslNotice);\n\n    // Input placeholders\n    const emailInp = document.getElementById(\"custEmail\");\n    if (emailInp) emailInp.placeholder = currentLang === \"en\" ? \"e.g. john@example.com\" : \"bijv. jan@example.nl\";\n    const phoneInp = document.getElementById(\"custPhone\");\n    if (phoneInp) phoneInp.placeholder = currentLang === \"en\" ? \"e.g. +31 6 12345678\" : \"bijv. 06 12345678\";\n    const nameInp = document.getElementById(\"custName\");\n    if (nameInp) nameInp.placeholder = currentLang === \"en\" ? \"First and last name\" : \"Voor- en achternaam\";\n    const streetInp = document.getElementById(\"custStreet\");\n    if (streetInp) streetInp.placeholder = currentLang === \"en\" ? \"e.g. Keizersgracht 42\" : \"bijv. Keizersgracht 42\";\n    const zipInp = document.getElementById(\"custZip\");\n    if (zipInp) zipInp.placeholder = currentLang === \"en\" ? \"e.g. 1015 CR\" : \"bijv. 1015 CR\";\n    const cityInp = document.getElementById(\"custCity\");\n    if (cityInp) cityInp.placeholder = currentLang === \"en\" ? \"e.g. Amsterdam\" : \"bijv. Amsterdam\";\n\n    // Notice Modal\n    setElemText(\"noticeTitle\", t.noticeTitle);\n    setElemText(\"noticeBody1\", t.noticeBody1);\n    setElemText(\"noticeBody2\", t.noticeBody2);\n    setElemText(\"noticePrompt\", t.noticePrompt);\n    setElemText(\"vipNotifyBtn\", t.vipNotifyBtn);\n    setElemText(\"closeNoticeBtn\", t.closeNoticeBtn);\n\n    // Footer\n    setElemText(\"footerDesc\", t.footerDesc);\n    setElemText(\"footerCopyright\", t.footerCopyright);\n    setElemText(\"footerColQuick\", t.footerColQuick);\n    setElemText(\"footerLinkModellen\", t.footerLinkModellen);\n    setElemText(\"footerLinkAllInc\", t.footerLinkAllInc);\n    setElemText(\"footerLinkAcc\", t.footerLinkAcc);\n    setElemText(\"footerLinkWaarom\", t.footerLinkWaarom);\n    setElemText(\"footerColSupport\", t.footerColSupport);\n    setElemText(\"footerSupportShip\", t.footerSupportShip);\n    setElemText(\"footerSupportWarranty\", t.footerSupportWarranty);\n    setElemText(\"footerSupportReturns\", t.footerSupportReturns);\n    setElemText(\"footerColSecurity\", t.footerColSecurity);\n    setElemText(\"footerSslNote\", t.footerSslNote);\n\n    updateModelConfigurator();\n    renderCart();\n  }\n\n  // --- UI RENDERERS ---\n  function updateModelConfigurator() {\n    const model = KAMADO_MODELS[activeModelKey];\n    if (!model) return;\n\n    const mName = model.name[currentLang] || model.name.nl;\n    const mDesc = model.desc[currentLang] || model.desc.nl;\n    const mBadge = model.badge[currentLang] || model.badge.nl;\n    const mPeople = model.people[currentLang] || model.people.nl;\n\n    const elName = document.getElementById(\"activeModelName\");\n    if (elName) elName.textContent = mName;\n    const elPrice = document.getElementById(\"activeModelPrice\");\n    if (elPrice) elPrice.textContent = formatEur(model.price);\n    const elOrig = document.getElementById(\"activeModelOrigPrice\");\n    if (elOrig) elOrig.textContent = formatEur(model.origPrice);\n    const elDesc = document.getElementById(\"activeModelDesc\");\n    if (elDesc) elDesc.textContent = mDesc;\n    const elAddPrice = document.getElementById(\"addBtnPrice\");\n    if (elAddPrice) elAddPrice.textContent = formatEur(model.price);\n\n    const elGrate = document.getElementById(\"specGrate\");\n    if (elGrate) elGrate.textContent = model.grate;\n    const elBody = document.getElementById(\"specBody\");\n    if (elBody) elBody.textContent = model.body;\n    const elPeople = document.getElementById(\"specPeople\");\n    if (elPeople) elPeople.textContent = mPeople;\n    const elWeight = document.getElementById(\"specWeight\");\n    if (elWeight) elWeight.textContent = model.weight;\n\n    const activeImg = document.getElementById(\"activeModelImg\");\n    if (activeImg) activeImg.src = model.image;\n    const elBadge = document.getElementById(\"activeModelBadge\");\n    if (elBadge) elBadge.textContent = mBadge;\n\n    const thumbsContainer = document.getElementById(\"galleryThumbs\");\n    if (thumbsContainer) {\n      thumbsContainer.innerHTML = \"\";\n      model.thumbs.forEach((src, idx) => {\n        const thumb = document.createElement(\"div\");\n        thumb.className = `thumb-item ${idx === 0 ? \"active\" : \"\"}`;\n        thumb.innerHTML = `<img src=\"${src}\" alt=\"Thumbnail ${idx + 1}\">`;\n        thumb.onclick = () => {\n          document.querySelectorAll(\".thumb-item\").forEach(t => t.classList.remove(\"active\"));\n          thumb.classList.add(\"active\");\n          if (activeImg) activeImg.src = src;\n        };\n        thumbsContainer.appendChild(thumb);\n      });\n    }\n\n    const accDescEl = document.getElementById(\"accSectionDesc\");\n    if (accDescEl && TRANSLATIONS[currentLang]) {\n      accDescEl.innerHTML = TRANSLATIONS[currentLang].accSectionDescTemplate.replace(\"{size}\", model.sizeInch);\n    }\n\n    const colorDisp = currentColor.displayName[currentLang] || currentColor.displayName.nl;\n    const colorLabel = document.getElementById(\"selectedColorName\");\n    if (colorLabel) colorLabel.textContent = colorDisp;\n\n    renderAccessories();\n  }\n\n  function renderAccessories() {\n    const grid = document.getElementById(\"accessoriesGrid\");\n    if (!grid) return;\n\n    const currentSize = KAMADO_MODELS[activeModelKey]?.sizeInch || \"23\";\n    const t = TRANSLATIONS[currentLang];\n\n    grid.innerHTML = \"\";\n    ACCESSORIES.forEach(acc => {\n      let price = acc.price;\n      let sizeBadge = \"\";\n\n      if (acc.isSizeDependent) {\n        price = acc.sizePrices[currentSize] || acc.sizePrices[\"23\"];\n        sizeBadge = `<span class=\"acc-size-badge\">${currentLang === \"en\" ? \"Size\" : \"Maat\"} ${currentSize}″</span>`;\n      }\n\n      const accName = acc.name[currentLang] || acc.name.nl;\n      const accDesc = acc.desc[currentLang] || acc.desc.nl;\n\n      const card = document.createElement(\"div\");\n      card.className = \"acc-card\";\n      card.innerHTML = `\n        <div class=\"acc-img-wrap\">\n          <img src=\"${acc.image}\" alt=\"${accName}\" class=\"acc-img\">\n          ${sizeBadge}\n        </div>\n        <div class=\"acc-body\">\n          <h4 class=\"acc-title\">${accName}</h4>\n          <p class=\"acc-desc\">${accDesc}</p>\n          <div class=\"acc-footer\">\n            <div class=\"acc-price\">${formatEur(price)}</div>\n            <button class=\"btn btn-secondary add-acc-btn\" data-id=\"${acc.id}\">\n              ${t.addAccBtn}\n            </button>\n          </div>\n        </div>\n      `;\n\n      const addBtn = card.querySelector(\".add-acc-btn\");\n      addBtn.addEventListener(\"click\", () => {\n        addAccessoryToCart(acc, price, currentSize);\n        addBtn.textContent = t.addedAccBtn;\n        addBtn.classList.add(\"btn-primary\");\n        addBtn.classList.remove(\"btn-secondary\");\n        setTimeout(() => {\n          addBtn.textContent = t.addAccBtn;\n          addBtn.classList.remove(\"btn-primary\");\n          addBtn.classList.add(\"btn-secondary\");\n        }, 1200);\n      });\n\n      grid.appendChild(card);\n    });\n  }\n\n  // --- CART OPERATIONS ---\n  function saveCart() {\n    localStorage.setItem(\"craft_nl_cart\", JSON.stringify(cart));\n    renderCart();\n  }\n\n  function loadCart() {\n    try {\n      cart = JSON.parse(localStorage.getItem(\"craft_nl_cart\") || \"[]\");\n    } catch (e) {\n      cart = [];\n    }\n  }\n\n  function addModelToCart() {\n    const model = KAMADO_MODELS[activeModelKey];\n    if (!model) return;\n\n    const mName = model.name[currentLang] || model.name.nl;\n    const cDisp = currentColor.displayName[currentLang] || currentColor.displayName.nl;\n\n    const existingIndex = cart.findIndex(i => i.type === \"kamado\");\n    const kamadoItem = {\n      id: \"kamado_\" + model.key,\n      type: \"kamado\",\n      modelKey: model.key,\n      sizeInch: model.sizeInch,\n      name: mName,\n      colorId: currentColor.id,\n      colorName: currentColor.name,\n      colorDisplayName: cDisp,\n      price: model.price,\n      qty: 1,\n      image: model.image\n    };\n\n    if (existingIndex > -1) {\n      cart[existingIndex] = kamadoItem;\n    } else {\n      cart.unshift(kamadoItem);\n    }\n\n    saveCart();\n    openCart();\n    trackEvent(\"add_to_cart\", { item: kamadoItem });\n    syncCartTelemetry(\"cart\");\n  }\n\n  function addAccessoryToCart(acc, price, sizeInch) {\n    const accName = acc.name[currentLang] || acc.name.nl;\n    const itemKey = acc.isSizeDependent ? `${acc.id}_${sizeInch}` : acc.id;\n    const displayName = acc.isSizeDependent ? `${accName} (${sizeInch}″)` : accName;\n\n    const existing = cart.find(i => i.id === itemKey);\n    if (existing) {\n      existing.qty += 1;\n    } else {\n      cart.push({\n        id: itemKey,\n        type: \"accessory\",\n        accessoryId: acc.id,\n        name: displayName,\n        sizeInch: acc.isSizeDependent ? sizeInch : null,\n        price,\n        qty: 1,\n        image: acc.image\n      });\n    }\n\n    saveCart();\n    openCart();\n    trackEvent(\"add_to_cart\", { item: { id: itemKey, name: displayName, price } });\n    syncCartTelemetry(\"cart\");\n  }\n\n  function renderCart() {\n    const listEl = document.getElementById(\"cartItemsList\");\n    const countBadge = document.getElementById(\"cartCountBadge\");\n    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);\n    const t = TRANSLATIONS[currentLang];\n\n    if (countBadge) countBadge.textContent = totalCount;\n\n    if (!listEl) return;\n\n    if (cart.length === 0) {\n      listEl.innerHTML = `<div class=\"empty-cart-msg\">${t.emptyCartMsg}</div>`;\n      document.getElementById(\"cartKamadoSubtotal\").textContent = formatEur(0);\n      document.getElementById(\"cartAccSubtotal\").textContent = formatEur(0);\n      document.getElementById(\"cartTotal\").textContent = formatEur(0);\n      document.getElementById(\"goToCheckoutBtn\").disabled = true;\n      return;\n    }\n\n    document.getElementById(\"goToCheckoutBtn\").disabled = false;\n    listEl.innerHTML = \"\";\n\n    let kamadoSubtotal = 0;\n    let accSubtotal = 0;\n\n    cart.forEach((item, index) => {\n      const itemTotal = item.price * item.qty;\n      if (item.type === \"kamado\") {\n        kamadoSubtotal += itemTotal;\n      } else {\n        accSubtotal += itemTotal;\n      }\n\n      const itemEl = document.createElement(\"div\");\n      itemEl.className = \"cart-item\";\n      itemEl.innerHTML = `\n        <img src=\"${item.image}\" alt=\"${item.name}\" class=\"cart-item-img\">\n        <div class=\"cart-item-info\">\n          <div class=\"cart-item-title\">${item.name}</div>\n          ${item.colorDisplayName ? `<div class=\"cart-item-variant\">${currentLang === \"en\" ? \"Color\" : \"Kleur\"}: ${item.colorDisplayName}</div>` : \"\"}\n          <div class=\"cart-item-price\">${formatEur(item.price)} ${item.qty > 1 ? `× ${item.qty}` : \"\"}</div>\n        </div>\n        <div class=\"cart-item-actions\">\n          <button class=\"cart-remove-btn\" aria-label=\"Verwijderen\" data-index=\"${index}\">&times;</button>\n        </div>\n      `;\n\n      itemEl.querySelector(\".cart-remove-btn\").addEventListener(\"click\", () => {\n        cart.splice(index, 1);\n        saveCart();\n        syncCartTelemetry(\"cart\");\n      });\n\n      listEl.appendChild(itemEl);\n    });\n\n    const total = kamadoSubtotal + accSubtotal;\n    document.getElementById(\"cartKamadoSubtotal\").textContent = formatEur(kamadoSubtotal);\n    document.getElementById(\"cartAccSubtotal\").textContent = formatEur(accSubtotal);\n    document.getElementById(\"cartTotal\").textContent = formatEur(total);\n  }\n\n  function openCart() {\n    document.getElementById(\"cartDrawer\")?.classList.add(\"open\");\n    document.getElementById(\"cartBackdrop\")?.classList.add(\"open\");\n    trackEvent(\"open_cart\", { totalItems: cart.length });\n  }\n\n  function closeCart() {\n    document.getElementById(\"cartDrawer\")?.classList.remove(\"open\");\n    document.getElementById(\"cartBackdrop\")?.classList.remove(\"open\");\n  }\n\n  // --- CHECKOUT MODAL ---\n  function openCheckout() {\n    closeCart();\n    const modal = document.getElementById(\"checkoutModalBackdrop\");\n    modal?.classList.add(\"open\");\n\n    const kamadoItem = cart.find(i => i.type === \"kamado\");\n    let modelSummaryText = kamadoItem\n      ? `${kamadoItem.name} (${kamadoItem.colorDisplayName})`\n      : (currentLang === \"en\" ? \"Accessories only\" : \"Alleen accessoires\");\n\n    const kamadoSub = cart.filter(i => i.type === \"kamado\").reduce((s, i) => s + (i.price * i.qty), 0);\n    const accSub = cart.filter(i => i.type === \"accessory\").reduce((s, i) => s + (i.price * i.qty), 0);\n    const total = kamadoSub + accSub;\n\n    document.getElementById(\"checkoutModelSummary\").textContent = modelSummaryText;\n    document.getElementById(\"checkoutKamadoPrice\").textContent = formatEur(kamadoSub);\n    document.getElementById(\"checkoutAccPrice\").textContent = formatEur(accSub);\n    document.getElementById(\"checkoutTotalAmount\").textContent = formatEur(total);\n    document.getElementById(\"formErrors\").textContent = \"\";\n\n    trackEvent(\"checkout_start\", { totalAmount: total, kamadoSub, accSub });\n    syncCartTelemetry(\"checkout\");\n  }\n\n  function closeCheckout() {\n    document.getElementById(\"checkoutModalBackdrop\")?.classList.remove(\"open\");\n  }\n\n  function setupContactTracking() {\n    const emailInput = document.getElementById(\"custEmail\");\n    if (emailInput) {\n      emailInput.addEventListener(\"blur\", () => {\n        const val = emailInput.value.trim();\n        if (val.includes(\"@\")) {\n          checkoutEmailEntered = val;\n          trackEvent(\"contact_complete\", { email: val });\n          syncCartTelemetry(\"checkout\");\n        }\n      });\n    }\n  }\n\n  // --- FINAL PURCHASE INTENT SUBMIT ---\n  async function handleCheckoutSubmit(e) {\n    e.preventDefault();\n    const errorEl = document.getElementById(\"formErrors\");\n    errorEl.textContent = \"\";\n\n    const email = document.getElementById(\"custEmail\").value.trim();\n    const phone = document.getElementById(\"custPhone\").value.trim();\n    const name = document.getElementById(\"custName\").value.trim();\n    const street = (document.getElementById(\"custStreet\")?.value || \"\").trim();\n    const zip = document.getElementById(\"custZip\").value.trim();\n    const city = document.getElementById(\"custCity\").value.trim();\n\n    if (!email || !email.includes(\"@\")) {\n      errorEl.textContent = currentLang === \"en\" ? \"Please provide a valid email address.\" : \"Vul een geldig e-mailadres in.\";\n      return;\n    }\n    if (!phone || phone.length < 7) {\n      errorEl.textContent = currentLang === \"en\" ? \"Please provide a valid phone number.\" : \"Vul een geldig telefoonnummer in.\";\n      return;\n    }\n    if (!name) {\n      errorEl.textContent = currentLang === \"en\" ? \"Please provide your full name.\" : \"Vul uw volledige naam in.\";\n      return;\n    }\n    if (!zip || !city) {\n      errorEl.textContent = currentLang === \"en\" ? \"Please enter your postal code and city.\" : \"Vul postcode en woonplaats in.\";\n      return;\n    }\n\n    const submitBtn = document.getElementById(\"submitIntentBtn\");\n    submitBtn.disabled = true;\n    submitBtn.textContent = currentLang === \"en\" ? \"Processing...\" : \"Verwerken...\";\n\n    const kamadoItem = cart.find(i => i.type === \"kamado\") || {};\n    const kamadoSub = cart.filter(i => i.type === \"kamado\").reduce((s, i) => s + (i.price * i.qty), 0);\n    const accSub = cart.filter(i => i.type === \"accessory\").reduce((s, i) => s + (i.price * i.qty), 0);\n    const totalAmount = kamadoSub + accSub;\n\n    const paymentOpt = document.querySelector(`input[name=\"payment_method\"]:checked`)?.value || \"ideal\";\n\n    const payload = {\n      sessionId,\n      customer: {\n        name,\n        email,\n        phone,\n        street,\n        postalCode: zip,\n        city,\n        country: \"NL\"\n      },\n      paymentMethod: paymentOpt,\n      source: trafficSource,\n      landingPage: window.location.pathname + window.location.search,\n      initialColor,\n      finalColor: currentColor.name,\n      modelName: kamadoItem.name || `${activeModelKey}″ CraftKamado`,\n      sizeInch: kamadoItem.sizeInch || \"23\",\n      items: cart,\n      accessories: cart.filter(i => i.type === \"accessory\"),\n      kamadoPriceEur: kamadoSub,\n      accessoriesPriceEur: accSub,\n      totalAmountEur: totalAmount\n    };\n\n    try {\n      const resp = await fetch(\"/api/market-test/purchase-intent\", {\n        method: \"POST\",\n        headers: { \"Content-Type\": \"application/json\" },\n        body: JSON.stringify(payload)\n      });\n\n      if (!resp.ok) {\n        const errJson = await resp.json().catch(() => ({}));\n        throw new Error(errJson.error || (currentLang === \"en\" ? \"An error occurred while saving.\" : \"Er trad een fout op bij het opslaan.\"));\n      }\n\n      trackEvent(\"purchase_intent\", {\n        model: payload.modelName,\n        color: payload.finalColor,\n        totalEur: totalAmount,\n        email\n      });\n\n      // Close checkout modal & Open exact Dutch / English demand notice modal\n      closeCheckout();\n      showDemandNoticeModal(email);\n\n      // Clear cart\n      cart = [];\n      saveCart();\n    } catch (err) {\n      errorEl.textContent = err.message || (currentLang === \"en\" ? \"An error occurred. Please try again.\" : \"Er trad een fout op. Probeer het opnieuw.\");\n    } finally {\n      submitBtn.disabled = false;\n      submitBtn.textContent = TRANSLATIONS[currentLang].submitIntentBtn;\n    }\n  }\n\n  function showDemandNoticeModal(customerEmail) {\n    const noticeModal = document.getElementById(\"intentNoticeBackdrop\");\n    const emailContainer = document.getElementById(\"vipEmailContainer\");\n    const emailInput = document.getElementById(\"vipEmailInput\");\n    const notifyBtn = document.getElementById(\"vipNotifyBtn\");\n    const confirmationMsg = document.getElementById(\"vipConfirmationMsg\");\n    const t = TRANSLATIONS[currentLang];\n\n    confirmationMsg.style.display = \"none\";\n    notifyBtn.style.display = \"block\";\n    notifyBtn.textContent = t.vipNotifyBtn;\n\n    if (customerEmail) {\n      // Email was already provided in checkout! Do NOT ask again!\n      emailContainer.style.display = \"none\";\n      notifyBtn.onclick = () => {\n        confirmationMsg.innerHTML = t.vipAckMsg.replace(\"{email}\", customerEmail);\n        confirmationMsg.style.display = \"block\";\n        notifyBtn.style.display = \"none\";\n      };\n    } else {\n      // Prompt email if missing\n      emailContainer.style.display = \"block\";\n      notifyBtn.onclick = async () => {\n        const mail = emailInput.value.trim();\n        if (!mail || !mail.includes(\"@\")) {\n          alert(currentLang === \"en\" ? \"Please enter a valid email address.\" : \"Vul een geldig e-mailadres in.\");\n          return;\n        }\n        confirmationMsg.innerHTML = t.vipAckMsg.replace(\"{email}\", mail);\n        confirmationMsg.style.display = \"block\";\n        notifyBtn.style.display = \"none\";\n        emailContainer.style.display = \"none\";\n      };\n    }\n\n    noticeModal?.classList.add(\"open\");\n  }\n\n  // --- INITIALIZATION ---\n  document.addEventListener(\"DOMContentLoaded\", () => {\n    loadCart();\n\n    // 1. Language Toggle Buttons\n    document.getElementById(\"btnLangNl\")?.addEventListener(\"click\", () => setLanguage(\"nl\"));\n    document.getElementById(\"btnLangEn\")?.addEventListener(\"click\", () => setLanguage(\"en\"));\n\n    // 2. Initial Telemetry\n    trackEvent(\"page_view\", {\n      path: window.location.pathname,\n      url: window.location.href,\n      lang: currentLang\n    });\n\n    // 3. Size Tabs\n    const tabs = document.querySelectorAll(\".size-tab\");\n    tabs.forEach(tab => {\n      tab.addEventListener(\"click\", () => {\n        tabs.forEach(t => t.classList.remove(\"active\"));\n        tab.classList.add(\"active\");\n        activeModelKey = tab.getAttribute(\"data-model-key\");\n        updateModelConfigurator();\n      });\n    });\n\n    // 4. Color dots\n    const dots = document.querySelectorAll(\".color-dot\");\n    dots.forEach(dot => {\n      dot.addEventListener(\"click\", () => {\n        dots.forEach(d => d.classList.remove(\"active\"));\n        dot.classList.add(\"active\");\n\n        const cid = dot.getAttribute(\"data-color-id\");\n        const cObj = COLOR_OPTIONS.find(c => c.id === cid) || {\n          id: cid,\n          name: dot.getAttribute(\"data-color-name\"),\n          displayName: { nl: dot.getAttribute(\"data-display-name\"), en: dot.getAttribute(\"data-display-name\") }\n        };\n\n        currentColor = cObj;\n        const colorLabel = document.getElementById(\"selectedColorName\");\n        if (colorLabel) colorLabel.textContent = cObj.displayName[currentLang] || cObj.displayName.nl || cObj.name;\n\n        trackEvent(\"select_color\", { color: currentColor.name });\n      });\n    });\n\n    // 5. Cart Drawer Triggers\n    document.getElementById(\"cartBtn\")?.addEventListener(\"click\", openCart);\n    document.getElementById(\"closeCartBtn\")?.addEventListener(\"click\", closeCart);\n    document.getElementById(\"cartBackdrop\")?.addEventListener(\"click\", closeCart);\n\n    // 6. Add to cart actions\n    document.getElementById(\"addModelToCartBtn\")?.addEventListener(\"click\", addModelToCart);\n    document.getElementById(\"directCheckoutBtn\")?.addEventListener(\"click\", () => {\n      addModelToCart();\n      openCheckout();\n    });\n\n    // 7. Checkout triggers\n    document.getElementById(\"goToCheckoutBtn\")?.addEventListener(\"click\", openCheckout);\n    document.getElementById(\"closeCheckoutBtn\")?.addEventListener(\"click\", closeCheckout);\n\n    // 8. Payment selector in checkout\n    document.querySelectorAll(\".payment-opt\").forEach(opt => {\n      opt.addEventListener(\"click\", () => {\n        document.querySelectorAll(\".payment-opt\").forEach(o => o.classList.remove(\"active\"));\n        opt.classList.add(\"active\");\n      });\n    });\n\n    // 9. Form submit & contact tracking\n    setupContactTracking();\n    document.getElementById(\"checkoutForm\")?.addEventListener(\"submit\", handleCheckoutSubmit);\n\n    // 10. Close notice modal\n    document.getElementById(\"closeNoticeBtn\")?.addEventListener(\"click\", () => {\n      document.getElementById(\"intentNoticeBackdrop\")?.classList.remove(\"open\");\n    });\n\n    // Set initial language & render\n    setLanguage(currentLang);\n  });\n})();\n\n</script>\n</body>\n</html>\n";
const ADMIN_HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>CraftKamado NL | Market Demand Test Dashboard</title>\n  <link rel=\"icon\" type=\"image/png\" href=\"/assets/favicon.png\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <style>\n    :root {\n      --bg: #0b0c10;\n      --card: #14161f;\n      --card-border: #232634;\n      --text: #f1f5f9;\n      --text-dim: #94a3b8;\n      --primary: #ff6b35;\n      --accent: #f7931e;\n      --success: #10b981;\n      --danger: #ef4444;\n      --font-head: \"Outfit\", sans-serif;\n      --font-body: \"Inter\", sans-serif;\n    }\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body {\n      background-color: var(--bg);\n      color: var(--text);\n      font-family: var(--font-body);\n      line-height: 1.5;\n      padding: 1.5rem;\n    }\n    h1, h2, h3, h4 { font-family: var(--font-head); color: #fff; }\n    .header-bar {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 2rem;\n      padding-bottom: 1rem;\n      border-bottom: 1px solid var(--card-border);\n      flex-wrap: wrap;\n      gap: 1rem;\n    }\n    .brand-area { display: flex; align-items: center; gap: 0.75rem; }\n    .brand-tag {\n      background: var(--primary);\n      color: #fff;\n      font-size: 0.75rem;\n      font-weight: 700;\n      padding: 0.2rem 0.5rem;\n      border-radius: 4px;\n      text-transform: uppercase;\n      letter-spacing: 0.05em;\n    }\n    .header-actions { display: flex; gap: 0.75rem; align-items: center; }\n    .btn {\n      background: var(--primary);\n      color: #fff;\n      border: none;\n      padding: 0.6rem 1.2rem;\n      border-radius: 6px;\n      font-family: var(--font-head);\n      font-weight: 600;\n      cursor: pointer;\n      font-size: 0.9rem;\n      transition: opacity 0.2s;\n      text-decoration: none;\n      display: inline-flex;\n      align-items: center;\n      gap: 0.4rem;\n    }\n    .btn:hover { opacity: 0.9; }\n    .btn-secondary { background: #232634; color: var(--text); border: 1px solid #363a4f; }\n    .btn-secondary:hover { background: #2f3346; }\n\n    /* 6 BIG NUMBERS AT TOP */\n    .big-numbers-grid {\n      display: grid;\n      grid-template-columns: repeat(6, 1fr);\n      gap: 1rem;\n      margin-bottom: 2rem;\n    }\n    @media (max-width: 1200px) {\n      .big-numbers-grid { grid-template-columns: repeat(3, 1fr); }\n    }\n    @media (max-width: 650px) {\n      .big-numbers-grid { grid-template-columns: repeat(2, 1fr); }\n    }\n    .big-num-card {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      padding: 1.25rem 1rem;\n      border-radius: 10px;\n      text-align: center;\n      position: relative;\n    }\n    .big-num-card.highlight {\n      border-color: var(--primary);\n      background: rgba(255, 107, 53, 0.05);\n    }\n    .big-num-card.revenue {\n      border-color: var(--success);\n      background: rgba(16, 185, 129, 0.05);\n    }\n    .big-label {\n      font-size: 0.8rem;\n      text-transform: uppercase;\n      color: var(--text-dim);\n      font-weight: 700;\n      letter-spacing: 0.04em;\n      margin-bottom: 0.4rem;\n    }\n    .big-val {\n      font-size: 2.1rem;\n      font-family: var(--font-head);\n      font-weight: 800;\n      color: #fff;\n      line-height: 1.1;\n    }\n    .big-num-card.highlight .big-val { color: var(--primary); }\n    .big-num-card.revenue .big-val { color: var(--success); }\n\n    /* Section Boxes */\n    .section-box {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      border-radius: 12px;\n      padding: 1.5rem;\n      margin-bottom: 2rem;\n    }\n    .section-title {\n      font-size: 1.2rem;\n      margin-bottom: 1.25rem;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n\n    .two-cols {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 1.5rem;\n      margin-bottom: 2rem;\n    }\n    @media (max-width: 900px) {\n      .two-cols { grid-template-columns: 1fr; }\n    }\n\n    /* Tables */\n    .data-table {\n      width: 100%;\n      border-collapse: collapse;\n      font-size: 0.9rem;\n      text-align: left;\n    }\n    .data-table th {\n      background: #1a1c27;\n      padding: 0.75rem 1rem;\n      color: var(--text-dim);\n      font-weight: 600;\n      border-bottom: 1px solid var(--card-border);\n    }\n    .data-table td {\n      padding: 0.85rem 1rem;\n      border-bottom: 1px solid var(--card-border);\n      color: var(--text);\n    }\n    .data-table tr:hover td { background: #1c1f2d; }\n    .badge {\n      display: inline-block;\n      padding: 0.2rem 0.55rem;\n      border-radius: 4px;\n      font-size: 0.75rem;\n      font-weight: 700;\n    }\n    .badge-primary { background: rgba(255, 107, 53, 0.2); color: var(--primary); }\n    .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); }\n    .badge-source { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }\n\n    .color-swatch {\n      display: inline-block;\n      width: 14px;\n      height: 14px;\n      border-radius: 50%;\n      margin-right: 8px;\n      vertical-align: middle;\n      border: 1px solid rgba(255,255,255,0.2);\n    }\n\n    /* Auth modal */\n    .auth-overlay {\n      position: fixed;\n      inset: 0;\n      background: #0b0c10;\n      z-index: 1000;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 1.5rem;\n    }\n    .auth-card {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      border-radius: 12px;\n      padding: 2.5rem 2rem;\n      max-width: 420px;\n      width: 100%;\n      text-align: center;\n    }\n    .auth-input {\n      width: 100%;\n      background: #0d0e14;\n      border: 1px solid var(--card-border);\n      color: #fff;\n      padding: 0.75rem 1rem;\n      border-radius: 6px;\n      font-size: 1rem;\n      margin: 1.25rem 0 1rem;\n      outline: none;\n    }\n    .auth-input:focus { border-color: var(--primary); }\n  </style>\n</head>\n<body>\n\n  <!-- Password Overlay -->\n  <div id=\"authOverlay\" class=\"auth-overlay\" style=\"display: none;\">\n    <div class=\"auth-card\">\n      <h2>Secure Admin Access</h2>\n      <p style=\"color: var(--text-dim); margin-top: 0.5rem;\">Enter the administrator password to view the Market Demand Analytics Dashboard.</p>\n      <input type=\"password\" id=\"adminPwd\" class=\"auth-input\" placeholder=\"Password...\" autofocus>\n      <button id=\"authBtn\" class=\"btn\" style=\"width: 100%; justify-content: center;\">Sign In</button>\n    </div>\n  </div>\n\n  <!-- Dashboard Container -->\n  <div id=\"dashboardContent\">\n    <div class=\"header-bar\">\n      <div class=\"brand-area\">\n        <h1>CraftKamado Netherlands</h1>\n        <span class=\"brand-tag\">Market Demand Analytics</span>\n      </div>\n      <div class=\"header-actions\">\n        <button id=\"refreshBtn\" class=\"btn btn-secondary\">🔄 Refresh</button>\n        <button id=\"exportIntentsBtn\" class=\"btn\">📥 Export Intents (CSV)</button>\n        <button id=\"logoutBtn\" class=\"btn btn-secondary\">Sign Out</button>\n      </div>\n    </div>\n\n    <!-- 6 BIG NUMBERS AT TOP -->\n    <div class=\"big-numbers-grid\">\n      <div class=\"big-num-card\">\n        <div class=\"big-label\">Visitors</div>\n        <div class=\"big-val\" id=\"numVisitors\">0</div>\n      </div>\n      <div class=\"big-num-card\">\n        <div class=\"big-label\">Add to cart</div>\n        <div class=\"big-val\" id=\"numAddToCart\">0</div>\n      </div>\n      <div class=\"big-num-card\">\n        <div class=\"big-label\">Checkout</div>\n        <div class=\"big-val\" id=\"numCheckout\">0</div>\n      </div>\n      <div class=\"big-num-card highlight\">\n        <div class=\"big-label\">Purchase Intent</div>\n        <div class=\"big-val\" id=\"numPurchaseIntent\">0</div>\n      </div>\n      <div class=\"big-num-card\">\n        <div class=\"big-label\">Conversion %</div>\n        <div class=\"big-val\" id=\"numConversion\">0.0%</div>\n      </div>\n      <div class=\"big-num-card revenue\">\n        <div class=\"big-label\">Potential Revenue</div>\n        <div class=\"big-val\" id=\"numRevenue\">€0</div>\n      </div>\n    </div>\n\n    <!-- Models & Colors Breakdown -->\n    <div class=\"two-cols\">\n      <!-- Models: 18 Basic / 18 Premium / 21 / 23 / 27 -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">\n          <span>Model Popularity</span>\n          <small style=\"color: var(--text-dim); font-size: 0.85rem;\">18 Basic, 18 Premium, 21, 23, 27</small>\n        </div>\n        <table class=\"data-table\" id=\"modelsTable\">\n          <thead>\n            <tr>\n              <th>Model</th>\n              <th>Price</th>\n              <th>Intents Count</th>\n              <th>Share (%)</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Dynamic rows -->\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Colors: Black / Burgundy / Blue / Green / Orange / Beige / Yellow -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">\n          <span>Color Popularity</span>\n          <small style=\"color: var(--text-dim); font-size: 0.85rem;\">Black, Burgundy, Blue, Green, Orange, Beige, Yellow</small>\n        </div>\n        <table class=\"data-table\" id=\"colorsTable\">\n          <thead>\n            <tr>\n              <th>Color</th>\n              <th>Selected Count</th>\n              <th>Share (%)</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Dynamic rows -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <!-- Accessories & Configurations -->\n    <div class=\"two-cols\">\n      <!-- Accessories per size -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">\n          <span>Accessories Demand (per size)</span>\n        </div>\n        <table class=\"data-table\" id=\"accessoriesTable\">\n          <thead>\n            <tr>\n              <th>Accessory</th>\n              <th>Intents Count</th>\n              <th>Attach Rate</th>\n              <th>Potential Revenue</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Dynamic rows -->\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Concrete Configurations -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">\n          <span>Concrete Product Configurations</span>\n        </div>\n        <table class=\"data-table\" id=\"configurationsTable\">\n          <thead>\n            <tr>\n              <th>Configuration Bundle</th>\n              <th>Count</th>\n              <th>Total Potential Value</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Dynamic rows -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <!-- Dedicated Purchase Intents Table -->\n    <div class=\"section-box\">\n      <div class=\"section-title\">\n        <span>Purchase Intents Ledger</span>\n        <small style=\"color: var(--text-dim); font-size: 0.85rem;\">All registered high-intent customer requests</small>\n      </div>\n      <div style=\"overflow-x: auto;\">\n        <table class=\"data-table\" id=\"intentsTable\">\n          <thead>\n            <tr>\n              <th>Date</th>\n              <th>Model</th>\n              <th>Color</th>\n              <th>Accessories</th>\n              <th>Total</th>\n              <th>Email</th>\n              <th>Source</th>\n              <th>Region</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Dynamic rows -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n\n  <script src=\"/admin-test.js\"></script>\n</body>\n</html>";
const ADMIN_JS_CONTENT = "/**\n * CraftKamado Netherlands - Market Test Admin Dashboard Logic (English)\n */\n\n(function() {\n  \"use strict\";\n\n  let adminToken = sessionStorage.getItem(\"kk_nl_admin_token\") || \"\";\n\n  function formatEur(amount) {\n    return \"€\" + Number(amount || 0).toLocaleString(\"en-US\", { minimumFractionDigits: 0, maximumFractionDigits: 0 });\n  }\n\n  function formatPct(val) {\n    return (Number(val || 0) * 100).toFixed(1) + \"%\";\n  }\n\n  function formatDate(isoStr) {\n    if (!isoStr) return \"-\";\n    try {\n      const d = new Date(isoStr);\n      return d.toLocaleDateString(\"en-GB\", { day: \"2-digit\", month: \"short\" }) + \" \" +\n             d.toLocaleTimeString(\"en-GB\", { hour: \"2-digit\", minute: \"2-digit\" });\n    } catch (e) {\n      return isoStr;\n    }\n  }\n\n  function showAuthOverlay() {\n    document.getElementById(\"authOverlay\").style.display = \"flex\";\n    document.getElementById(\"dashboardContent\").style.display = \"none\";\n  }\n\n  function hideAuthOverlay() {\n    document.getElementById(\"authOverlay\").style.display = \"none\";\n    document.getElementById(\"dashboardContent\").style.display = \"block\";\n  }\n\n  async function loadDashboardData() {\n    if (!adminToken) {\n      showAuthOverlay();\n      return;\n    }\n\n    try {\n      const resp = await fetch(\"/api/market-test/stats\", {\n        headers: { \"Authorization\": \"Bearer \" + adminToken }\n      });\n\n      if (resp.status === 401) {\n        sessionStorage.removeItem(\"kk_nl_admin_token\");\n        adminToken = \"\";\n        showAuthOverlay();\n        return;\n      }\n\n      if (!resp.ok) throw new Error(\"Failed to load statistics\");\n\n      const data = await resp.json();\n      hideAuthOverlay();\n      renderDashboard(data);\n    } catch (err) {\n      console.error(\"Error loading dashboard:\", err);\n    }\n  }\n\n  function renderDashboard(data) {\n    const { kpis, models, colors, accessories, configurations, intents } = data;\n\n    // 1. TOP 6 BIG NUMBERS\n    document.getElementById(\"numVisitors\").textContent = Number(kpis.visitors || 0).toLocaleString(\"en-US\");\n    document.getElementById(\"numAddToCart\").textContent = Number(kpis.addToCart || 0).toLocaleString(\"en-US\");\n    document.getElementById(\"numCheckout\").textContent = Number(kpis.checkout || 0).toLocaleString(\"en-US\");\n    document.getElementById(\"numPurchaseIntent\").textContent = Number(kpis.purchaseIntent || 0).toLocaleString(\"en-US\");\n    document.getElementById(\"numConversion\").textContent = formatPct(kpis.conversionPct);\n    document.getElementById(\"numRevenue\").textContent = formatEur(kpis.potentialRevenue);\n\n    // 2. MODELS TABLE (18 Basic / 18 Premium / 21 / 23 / 27)\n    const modelsTbody = document.querySelector(\"#modelsTable tbody\");\n    modelsTbody.innerHTML = \"\";\n    (models || []).forEach(m => {\n      const tr = document.createElement(\"tr\");\n      tr.innerHTML = `\n        <td><strong>${m.name}</strong></td>\n        <td>${formatEur(m.price)}</td>\n        <td><span class=\"badge badge-primary\">${m.count} pcs</span></td>\n        <td><strong>${formatPct(m.share)}</strong></td>\n      `;\n      modelsTbody.appendChild(tr);\n    });\n\n    // 3. COLORS TABLE (Black, Burgundy, Blue, Green, Orange, Beige, Yellow)\n    const colorsTbody = document.querySelector(\"#colorsTable tbody\");\n    colorsTbody.innerHTML = \"\";\n    (colors || []).forEach(c => {\n      const tr = document.createElement(\"tr\");\n      tr.innerHTML = `\n        <td>\n          <span class=\"color-swatch\" style=\"background-color: ${c.hex};\"></span>\n          <strong>${c.name}</strong>\n        </td>\n        <td><span class=\"badge badge-primary\">${c.count} pcs</span></td>\n        <td><strong>${formatPct(c.share)}</strong></td>\n      `;\n      colorsTbody.appendChild(tr);\n    });\n\n    // 4. ACCESSORIES TABLE\n    const accTbody = document.querySelector(\"#accessoriesTable tbody\");\n    accTbody.innerHTML = \"\";\n    if (!accessories || accessories.length === 0) {\n      accTbody.innerHTML = \"<tr><td colspan=\"4\" style=\"color: var(--text-dim);\">No accessories selected yet.</td></tr>\";\n    } else {\n      accessories.forEach(a => {\n        const tr = document.createElement(\"tr\");\n        tr.innerHTML = `\n          <td><strong>${a.name}</strong></td>\n          <td><span class=\"badge badge-primary\">${a.count} pcs</span></td>\n          <td><span class=\"badge badge-success\">${formatPct(a.attachRate)}</span></td>\n          <td>${formatEur(a.revenue)}</td>\n        `;\n        accTbody.appendChild(tr);\n      });\n    }\n\n    // 5. CONFIGURATIONS TABLE\n    const confTbody = document.querySelector(\"#configurationsTable tbody\");\n    confTbody.innerHTML = \"\";\n    if (!configurations || configurations.length === 0) {\n      confTbody.innerHTML = \"<tr><td colspan=\"3\" style=\"color: var(--text-dim);\">No configurations recorded yet.</td></tr>\";\n    } else {\n      configurations.forEach(cfg => {\n        const tr = document.createElement(\"tr\");\n        tr.innerHTML = `\n          <td><strong>${cfg.description}</strong></td>\n          <td><span class=\"badge badge-primary\">${cfg.count} pcs</span></td>\n          <td><strong>${formatEur(cfg.totalValue)}</strong></td>\n        `;\n        confTbody.appendChild(tr);\n      });\n    }\n\n    // 6. DEDICATED PURCHASE INTENTS TABLE\n    // Date | Model | Color | Accessories | Total | Email | Source | Region\n    const intentsTbody = document.querySelector(\"#intentsTable tbody\");\n    intentsTbody.innerHTML = \"\";\n    if (!intents || intents.length === 0) {\n      intentsTbody.innerHTML = \"<tr><td colspan=\"8\" style=\"color: var(--text-dim);\">No purchase intents received yet.</td></tr>\";\n    } else {\n      intents.forEach(item => {\n        const tr = document.createElement(\"tr\");\n        let accStr = \"-\";\n        try {\n          const accArr = JSON.parse(item.accessories_json || \"[]\");\n          if (accArr.length) {\n            accStr = accArr.map(a => `${a.name} ×${a.qty || 1}`).join(\", \");\n          }\n        } catch (e) {}\n\n        const colorText = item.final_color || item.color_name || \"Black\";\n        const modelText = item.model_name || `${item.size_inch}″ Kamado`;\n        const regionText = (item.postal_code || item.city) ? `${item.postal_code || \"\"} ${item.city || \"\"}`.trim() : \"NL\";\n\n        tr.innerHTML = `\n          <td><small>${formatDate(item.created_at)}</small></td>\n          <td><strong>${modelText}</strong></td>\n          <td>${colorText}</td>\n          <td><small>${accStr}</small></td>\n          <td><strong style=\"color: var(--success);\">${formatEur(item.total_amount_eur)}</strong></td>\n          <td><code>${item.email || \"-\"}</code></td>\n          <td><span class=\"badge badge-source\">${item.source || \"Direct\"}</span></td>\n          <td><small>${regionText}</small></td>\n        `;\n        intentsTbody.appendChild(tr);\n      });\n    }\n  }\n\n  // --- EVENTS ---\n  document.addEventListener(\"DOMContentLoaded\", () => {\n    document.getElementById(\"authBtn\").addEventListener(\"click\", () => {\n      const pwd = document.getElementById(\"adminPwd\").value.trim();\n      if (!pwd) return;\n      adminToken = pwd;\n      sessionStorage.setItem(\"kk_nl_admin_token\", pwd);\n      loadDashboardData();\n    });\n\n    document.getElementById(\"adminPwd\").addEventListener(\"keydown\", (e) => {\n      if (e.key === \"Enter\") document.getElementById(\"authBtn\").click();\n    });\n\n    document.getElementById(\"logoutBtn\").addEventListener(\"click\", () => {\n      sessionStorage.removeItem(\"kk_nl_admin_token\");\n      adminToken = \"\";\n      showAuthOverlay();\n    });\n\n    document.getElementById(\"refreshBtn\").addEventListener(\"click\", loadDashboardData);\n\n    document.getElementById(\"exportIntentsBtn\").addEventListener(\"click\", () => {\n      window.location.href = \"/api/market-test/export-intents.csv?token=\" + encodeURIComponent(adminToken);\n    });\n\n    loadDashboardData();\n  });\n})();\n";

const MIME_TYPES = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  json: "application/json",
  css: "text/css",
  js: "application/javascript"
};

/**
 * Email notification service for new PURCHASE_INTENT
 * Sent ONLY upon final PURCHASE_INTENT submit
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = env.NOTIFY_EMAIL || 'info@kundikamado.hu';
  const totalFormatted = '€' + Number(intent.totalAmountEur || 0).toLocaleString('nl-NL');
  const kamadoFormatted = '€' + Number(intent.kamadoPriceEur || 0).toLocaleString('nl-NL');
  const accFormatted = '€' + Number(intent.accessoriesPriceEur || 0).toLocaleString('nl-NL');

  const lines = [];
  lines.push(`${intent.modelName || 'Kamado'} – ${intent.finalColor || intent.colorName || 'Black'} ×1`);

  (intent.accessories || []).forEach(acc => {
    lines.push(`${acc.name} ×${acc.qty || 1}`);
  });

  const subject = `New NL Purchase Intent – ${totalFormatted}`;

  const plainText = `
New NL Purchase Intent – ${totalFormatted}

${lines.join('\n')}

Kamado: ${kamadoFormatted} | Accessories: ${accFormatted} | Total: ${totalFormatted}
Customer: ${intent.customer?.email || intent.email || 'Geen email'}
Name: ${intent.customer?.name || intent.name || '-'}
Phone: ${intent.customer?.phone || intent.phone || '-'}
Region: ${intent.customer?.postalCode || intent.postalCode || ''} ${intent.customer?.city || intent.city || ''} (NL)
Source: ${intent.source || 'Direct'}
Landing page: ${intent.landingPage || '/'}
Initial color: ${intent.initialColor || '-'} | Final color: ${intent.finalColor || intent.colorName || '-'}
  `.trim();

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; line-height: 1.6;">
      <div style="background-color: #0c0d10; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ff6b35; margin: 0; font-size: 20px;">CraftKamado Nederland – New Purchase Intent</h2>
        <p style="color: #bbb; margin: 6px 0 0 0; font-size: 14px;">Marktvalidatie Inzending (~1 Maand Vraagtest)</p>
      </div>

      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background: #ffffff;">
        <div style="font-size: 18px; font-weight: bold; color: #ff6b35; margin-bottom: 16px;">
          Totaalwaarde: ${totalFormatted}
        </div>

        <div style="background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #ff6b35; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #111;">Gekozen Configuratie:</h4>
          <div style="font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 6px;">
            ${intent.modelName || 'Kamado'} – ${intent.finalColor || intent.colorName || 'Black'} ×1
          </div>
          ${(intent.accessories || []).map(a => `<div style="font-size: 14px; color: #475569;">+ ${a.name} ×${a.qty || 1}</div>`).join('')}
          <div style="margin-top: 10px; font-size: 13px; color: #64748b;">
            Kamado: <strong>${kamadoFormatted}</strong> | Accessoires: <strong>${accFormatted}</strong> | Totaal: <strong>${totalFormatted}</strong>
          </div>
        </div>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 140px;">Klant:</td>
            <td style="padding: 6px 0;"><strong>${intent.customer?.name || intent.name || '-'}</strong> (<a href="mailto:${intent.customer?.email || intent.email}">${intent.customer?.email || intent.email}</a>)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Telefoon:</td>
            <td style="padding: 6px 0;"><a href="tel:${intent.customer?.phone || intent.phone}">${intent.customer?.phone || intent.phone || '-'}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Regio:</td>
            <td style="padding: 6px 0;"><strong>${intent.customer?.postalCode || intent.postalCode || ''} ${intent.customer?.city || intent.city || ''} (NL)</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Herkomst (Source):</td>
            <td style="padding: 6px 0;"><strong style="color: #2563eb;">${intent.source || 'Direct'}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Landing Page:</td>
            <td style="padding: 6px 0;"><code>${intent.landingPage || '/'}</code></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Kleurkeuze verloop:</td>
            <td style="padding: 6px 0;">Eerste: <em>${intent.initialColor || '-'}</em> ➔ Definitief: <strong>${intent.finalColor || intent.colorName || '-'}</strong></td>
          </tr>
        </table>

        <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
          Dit is een automatische notificatie van de Nederlandse vraagtest. Alle statistieken zijn te vinden op <a href="https://nl-kamado.ferkomes.workers.dev/admin/market-test">/admin/market-test</a>.
        </div>
      </div>
    </div>
  `;

  // 1. Try configured mail sender service
  const mailSenderUrl = env.MAIL_SENDER_URL || 'https://mail-sender.ferkomes.workers.dev';
  try {
    const res = await fetch(mailSenderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: subject,
        html: htmlBody,
        text: plainText
      })
    });
    if (res.ok) return { success: true, method: 'mail-sender' };
  } catch (err) {
    console.warn('Mail-sender error:', err);
  }

  // 2. MailChannels fallback
  try {
    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient, name: 'CraftKamado Admin' }] }],
        from: { email: 'noreply@craftkamado.nl', name: 'CraftKamado NL Demand Test' },
        subject: subject,
        content: [
          { type: 'text/plain', value: plainText },
          { type: 'text/html', value: htmlBody }
        ]
      })
    });
    if (mcRes.ok) return { success: true, method: 'mailchannels' };
  } catch (err) {
    console.warn('MailChannels error:', err);
  }

  return { success: false, error: 'Could not deliver notification email' };
}



/**
 * Market Test Tracking, D1 Database Storage, and Metrics Aggregator
 */



async function ensureTables(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_sessions (
      session_id TEXT PRIMARY KEY,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      source TEXT,
      landing_page TEXT,
      initial_color TEXT,
      final_color TEXT,
      created_at TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      reached_cart INTEGER DEFAULT 0,
      reached_checkout INTEGER DEFAULT 0,
      reached_contact INTEGER DEFAULT 0,
      reached_intent INTEGER DEFAULT 0
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload_json TEXT,
      created_at TEXT NOT NULL
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS purchase_intents (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      postal_code TEXT,
      city TEXT,
      country TEXT DEFAULT 'NL',
      source TEXT DEFAULT 'Direct',
      landing_page TEXT,
      initial_color TEXT,
      final_color TEXT,
      model_name TEXT NOT NULL,
      size_inch TEXT NOT NULL,
      items_json TEXT NOT NULL,
      accessories_json TEXT,
      kamado_price_eur REAL NOT NULL DEFAULT 0,
      accessories_price_eur REAL NOT NULL DEFAULT 0,
      total_amount_eur REAL NOT NULL DEFAULT 0,
      payment_method_intent TEXT,
      notification_sent INTEGER DEFAULT 0,
      notification_error TEXT
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS abandoned_carts (
      session_id TEXT PRIMARY KEY,
      updated_at TEXT NOT NULL,
      email TEXT,
      name TEXT,
      postal_code TEXT,
      city TEXT,
      source TEXT,
      items_json TEXT NOT NULL,
      total_amount_eur REAL NOT NULL,
      last_step TEXT NOT NULL DEFAULT 'cart',
      converted_to_intent INTEGER DEFAULT 0
    );
  `).run();
}

function detectTrafficSource(referer, urlParams = {}) {
  const utmSource = urlParams.utm_source;
  if (utmSource) {
    const med = urlParams.utm_medium ? ` / ${urlParams.utm_medium}` : '';
    return `${utmSource}${med}`;
  }
  if (!referer) return 'Direct';
  try {
    const refHost = new URL(referer).hostname.toLowerCase();
    if (refHost.includes('google')) return 'Google Search';
    if (refHost.includes('facebook') || refHost.includes('fb.me') || refHost.includes('meta')) return 'Facebook Ad';
    if (refHost.includes('instagram')) return 'Instagram';
    if (refHost.includes('tiktok')) return 'TikTok';
    if (refHost.includes('linkedin')) return 'LinkedIn';
    return refHost.replace('www.', '');
  } catch (e) {
    return referer.substring(0, 30);
  }
}

async function trackEvent(db, { sessionId, eventType, payload = {}, ip = '', userAgent = '', referer = '' }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const source = payload.source || detectTrafficSource(referer, payload.urlParams || {});
  const landingPage = payload.landingPage || payload.path || '/';
  const initialColor = payload.initialColor || payload.color || null;
  const finalColor = payload.finalColor || payload.color || initialColor || null;

  const reachedCart = ['add_to_cart', 'open_cart'].includes(eventType) ? 1 : 0;
  const reachedCheckout = eventType === 'checkout_start' ? 1 : 0;
  const reachedContact = eventType === 'contact_complete' ? 1 : 0;
  const reachedIntent = eventType === 'purchase_intent' ? 1 : 0;

  await db.prepare(`
    INSERT INTO market_sessions (
      session_id, ip_hash, user_agent, referer, source, landing_page,
      initial_color, final_color, created_at, last_active_at,
      reached_cart, reached_checkout, reached_contact, reached_intent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
    ON CONFLICT(session_id) DO UPDATE SET
      last_active_at = excluded.last_active_at,
      final_color = COALESCE(excluded.final_color, market_sessions.final_color),
      reached_cart = MAX(market_sessions.reached_cart, excluded.reached_cart),
      reached_checkout = MAX(market_sessions.reached_checkout, excluded.reached_checkout),
      reached_contact = MAX(market_sessions.reached_contact, excluded.reached_contact),
      reached_intent = MAX(market_sessions.reached_intent, excluded.reached_intent)
  `).bind(
    sessionId ?? null, ip ?? null, userAgent ?? null, referer ?? null, source ?? "Direct", landingPage ?? "/",
    initialColor ?? null, finalColor ?? null, now, now,
    reachedCart ?? 0, reachedCheckout ?? 0, reachedContact ?? 0, reachedIntent ?? 0
  ).run();

  await db.prepare(`
    INSERT INTO market_events (session_id, event_type, payload_json, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, eventType, JSON.stringify(payload), now).run();
}

async function updateCart(db, { sessionId, items = [], totalAmount = 0, lastStep = 'cart', email = null, name = null, postalCode = null, city = null, source = null }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const isCheckout = lastStep === 'checkout';
  const isContact = Boolean(email && email.includes('@'));

  await db.prepare(`
    UPDATE market_sessions
    SET last_active_at = ?,
        reached_cart = 1,
        reached_checkout = CASE WHEN ? = 1 THEN 1 ELSE reached_checkout END,
        reached_contact = CASE WHEN ? = 1 THEN 1 ELSE reached_contact END
    WHERE session_id = ?
  `).bind(now, isCheckout ? 1 : 0, isContact ? 1 : 0, sessionId).run();

  if (items && items.length > 0) {
    await db.prepare(`
      INSERT INTO abandoned_carts (
        session_id, updated_at, email, name, postal_code, city, source, items_json, total_amount_eur, last_step, converted_to_intent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(session_id) DO UPDATE SET
        updated_at = excluded.updated_at,
        email = COALESCE(excluded.email, abandoned_carts.email),
        name = COALESCE(excluded.name, abandoned_carts.name),
        postal_code = COALESCE(excluded.postal_code, abandoned_carts.postal_code),
        city = COALESCE(excluded.city, abandoned_carts.city),
        source = COALESCE(excluded.source, abandoned_carts.source),
        items_json = excluded.items_json,
        total_amount_eur = excluded.total_amount_eur,
        last_step = excluded.last_step
      WHERE abandoned_carts.converted_to_intent = 0
    `).bind(sessionId ?? null, now, email ?? null, name ?? null, postalCode ?? null, city ?? null, source ?? null, JSON.stringify(items || []), Number(totalAmount) || 0, lastStep || "cart").run();
  }
}

async function recordPurchaseIntent(env, intentData) {
  const db = env.DB;
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  const intentId = 'intent_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const now = new Date().toISOString();

  const cust = intentData.customer || {};
  const items = intentData.items || [];
  const accessories = intentData.accessories || [];

  // Find Kamado & separate prices
  const kamadoItem = items.find(i => i.type === 'kamado') || {};
  const kamadoPrice = (kamadoItem.price || 0) * (kamadoItem.qty || 1);
  const accPrice = accessories.reduce((sum, a) => sum + (a.price || 0) * (a.qty || 1), 0);
  const totalAmount = intentData.totalAmountEur || (kamadoPrice + accPrice);

  const modelName = kamadoItem.name || intentData.modelName || 'CraftKamado';
  const sizeInch = String(kamadoItem.sizeInch || intentData.sizeInch || '23');
  const initialColor = intentData.initialColor || intentData.colorName || 'Black';
  const finalColor = intentData.finalColor || kamadoItem.colorName || intentData.colorName || 'Black';
  const source = intentData.source || 'Direct';
  const landingPage = intentData.landingPage || '/';

  // Extract postal region (first 4 digits or prefix)
  const postalCode = (cust.postalCode || '').trim();
  const city = (cust.city || '').trim();

  // 1. Insert into purchase_intents
  await db.prepare(`
    INSERT INTO purchase_intents (
      id, session_id, created_at, email, name, phone,
      postal_code, city, country, source, landing_page,
      initial_color, final_color, model_name, size_inch,
      items_json, accessories_json,
      kamado_price_eur, accessories_price_eur, total_amount_eur,
      payment_method_intent, notification_sent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?,
      ?, 0
    )
  `).bind(
    intentId,
    intentData.sessionId,
    now,
    cust.email || intentData.email || '',
    cust.name || '',
    cust.phone || '',
    postalCode,
    city,
    'NL',
    source,
    landingPage,
    initialColor,
    finalColor,
    modelName,
    sizeInch,
    JSON.stringify(items),
    JSON.stringify(accessories),
    kamadoPrice,
    accPrice,
    totalAmount,
    intentData.paymentMethod || 'ideal'
  ).run();

  // 2. Update session
  await db.prepare(`
    UPDATE market_sessions
    SET reached_cart = 1,
        reached_checkout = 1,
        reached_contact = 1,
        reached_intent = 1,
        final_color = ?,
        last_active_at = ?
    WHERE session_id = ?
  `).bind(finalColor, now, intentData.sessionId).run();

  // 3. Mark abandoned cart converted
  await db.prepare(`
    UPDATE abandoned_carts
    SET converted_to_intent = 1,
        email = ?,
        name = ?,
        postal_code = ?,
        city = ?
    WHERE session_id = ?
  `).bind(cust.email || '', cust.name || '', postalCode, city, intentData.sessionId).run();

  // 4. Send email notification asynchronously
  try {
    const notifyResult = await sendPurchaseIntentNotification(env, {
      id: intentId,
      modelName,
      sizeInch,
      finalColor,
      initialColor,
      accessories,
      kamadoPriceEur: kamadoPrice,
      accessoriesPriceEur: accPrice,
      totalAmountEur: totalAmount,
      customer: cust,
      source,
      landingPage
    });
    if (notifyResult.success) {
      await db.prepare(`UPDATE purchase_intents SET notification_sent = 1 WHERE id = ?`).bind(intentId).run();
    }
  } catch (err) {
    console.error('Failed to notify owner:', err);
    await db.prepare(`UPDATE purchase_intents SET notification_error = ? WHERE id = ?`).bind(err.message, intentId).run();
  }

  return { ok: true, intentId };
}

async function getMarketStats(db) {
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  // 1. Funnel counts from market_sessions
  const sessionRow = await db.prepare(`
    SELECT
      COUNT(*) AS total_visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) AS total_carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) AS total_checkouts,
      SUM(CASE WHEN reached_contact = 1 THEN 1 ELSE 0 END) AS total_contacts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) AS total_intents
    FROM market_sessions
  `).first() || {};

  const visitors = Number(sessionRow.total_visitors || 0);
  const addToCart = Number(sessionRow.total_carts || 0);
  const checkouts = Number(sessionRow.total_checkouts || 0);
  const contacts = Number(sessionRow.total_contacts || 0);
  const purchaseIntents = Number(sessionRow.total_intents || 0);
  const conversionPct = visitors > 0 ? (purchaseIntents / visitors) : 0;

  // 2. Revenue & AOV
  const revRow = await db.prepare(`
    SELECT
      COUNT(*) AS intent_count,
      COALESCE(SUM(total_amount_eur), 0) AS potential_revenue,
      COALESCE(SUM(kamado_price_eur), 0) AS kamado_revenue,
      COALESCE(SUM(accessories_price_eur), 0) AS accessories_revenue
    FROM purchase_intents
  `).first() || {};

  const potentialRevenue = Number(revRow.potential_revenue || 0);
  const intentCount = Number(revRow.intent_count || 0);
  const aov = intentCount > 0 ? (potentialRevenue / intentCount) : 0;

  // 3. Models breakdown (18 Basic / 18 Premium / 21 / 23 / 27)
  const targetModels = [
    { key: '18_basic', name: '18″ Basic', size: '18', price: 599, count: 0, share: 0 },
    { key: '18_premium', name: '18″ Premium', size: '18', price: 699, count: 0, share: 0 },
    { key: '21', name: '21″ Veelzijdig', size: '21', price: 889, count: 0, share: 0 },
    { key: '23', name: '23″ Bestseller', size: '23', price: 1019, count: 0, share: 0 },
    { key: '27', name: '27″ HoReCa Reus', size: '27', price: 1319, count: 0, share: 0 }
  ];

  const allIntentsRows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();
  const intentsList = allIntentsRows.results || [];

  intentsList.forEach(row => {
    const mName = (row.model_name || '').toLowerCase();
    const sz = String(row.size_inch || '');
    let found = null;
    if (sz === '18' && mName.includes('basic')) found = targetModels[0];
    else if (sz === '18') found = targetModels[1];
    else if (sz === '21') found = targetModels[2];
    else if (sz === '23') found = targetModels[3];
    else if (sz === '27') found = targetModels[4];

    if (found) found.count += 1;
  });

  const totalKamados = intentsList.length;
  targetModels.forEach(m => {
    m.share = totalKamados > 0 ? (m.count / totalKamados) : 0;
  });

  // 4. Colors breakdown (Black / Burgundy / Blue / Green / Orange / Beige / Yellow)
  const targetColors = [
    { key: 'Black', name: 'Black (Onyx Zwart)', hex: '#171717', count: 0, share: 0 },
    { key: 'Burgundy', name: 'Burgundy (Bordeaux Rood)', hex: '#781d2e', count: 0, share: 0 },
    { key: 'Blue', name: 'Blue (Marine Blauw)', hex: '#1b3f75', count: 0, share: 0 },
    { key: 'Green', name: 'Green (Bosgroen)', hex: '#235338', count: 0, share: 0 },
    { key: 'Orange', name: 'Orange (Craft Oranje)', hex: '#df5417', count: 0, share: 0 },
    { key: 'Beige', name: 'Beige (Zand Beige)', hex: '#d6cbb6', count: 0, share: 0 },
    { key: 'Yellow', name: 'Yellow (Warm Okergeel)', hex: '#dca326', count: 0, share: 0 }
  ];

  intentsList.forEach(row => {
    const col = (row.final_color || row.initial_color || '').toLowerCase();
    const match = targetColors.find(c => col.includes(c.key.toLowerCase()) || col.includes(c.name.toLowerCase()));
    if (match) match.count += 1;
  });

  targetColors.forEach(c => {
    c.share = totalKamados > 0 ? (c.count / totalKamados) : 0;
  });

  // 5. Accessories breakdown (with size where applicable)
  const accStatsMap = new Map();
  intentsList.forEach(row => {
    try {
      const accList = JSON.parse(row.accessories_json || '[]');
      accList.forEach(a => {
        const itemKey = a.sizeInch ? `${a.name} (${a.sizeInch}″)` : a.name;
        const curr = accStatsMap.get(itemKey) || { name: itemKey, count: 0, revenue: 0 };
        curr.count += (a.qty || 1);
        curr.revenue += (a.price || 0) * (a.qty || 1);
        accStatsMap.set(itemKey, curr);
      });
    } catch (e) {}
  });

  const accessoriesStats = Array.from(accStatsMap.values()).map(a => ({
    ...a,
    attachRate: totalKamados > 0 ? (a.count / totalKamados) : 0
  })).sort((a, b) => b.count - a.count);

  // 6. Concrete Configurations Matrix
  // e.g. "23 Premium + Blue + Rotisserie + Pizza Stone — 14 db"
  const combMap = new Map();
  intentsList.forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      const kamado = items.find(i => i.type === 'kamado') || {};
      const modelLabel = kamado.name || `${row.size_inch}″ Premium`;
      const colorLabel = row.final_color || kamado.colorName || 'Black';
      const accLabels = (items.filter(i => i.type === 'accessory').map(i => i.name)).sort().join(' + ');

      const combKey = `${modelLabel} + ${colorLabel}` + (accLabels ? ` + ${accLabels}` : '');
      const curr = combMap.get(combKey) || { description: combKey, count: 0, totalValue: 0 };
      curr.count += 1;
      curr.totalValue += (row.total_amount_eur || 0);
      combMap.set(combKey, curr);
    } catch (e) {}
  });

  const configurations = Array.from(combMap.values()).sort((a, b) => b.count - a.count);

  // 7. Abandoned carts
  const abandonedRows = await db.prepare(`
    SELECT * FROM abandoned_carts WHERE converted_to_intent = 0 ORDER BY updated_at DESC LIMIT 50
  `).all();

  return {
    // 6 Big Numbers at the top:
    kpis: {
      visitors,
      addToCart,
      checkout: checkouts,
      purchaseIntent: purchaseIntents,
      conversionPct,
      potentialRevenue
    },
    // Detailed sections:
    models: targetModels,
    colors: targetColors,
    accessories: accessoriesStats,
    configurations,
    intents: intentsList,
    abandoned: abandonedRows.results || []
  };
}

async function exportIntentsCsv(db) {
  if (!db) return '';
  await ensureTables(db);
  const rows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();

  const headers = [
    'Datum', 'Model', 'Kleur', 'Accessoires', 'Kamado Prijs EUR', 'Accessoires Prijs EUR',
    'Totaal EUR', 'Email', 'Naam', 'Telefoon', 'Regio', 'Bron (Source)', 'Landing Page'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const lines = [headers.join(',')];

  (rows.results || []).forEach(r => {
    let accStr = '';
    try {
      const accList = JSON.parse(r.accessories_json || '[]');
      accStr = accList.map(a => `${a.name} ×${a.qty || 1}`).join('; ');
    } catch (e) {}

    lines.push([
      escapeCsv(r.created_at?.substring(0, 16).replace('T', ' ')),
      escapeCsv(r.model_name),
      escapeCsv(r.final_color || r.color_name),
      escapeCsv(accStr),
      escapeCsv(r.kamado_price_eur),
      escapeCsv(r.accessories_price_eur),
      escapeCsv(r.total_amount_eur),
      escapeCsv(r.email),
      escapeCsv(r.name),
      escapeCsv(r.phone),
      escapeCsv(`${r.postal_code || ''} ${r.city || ''}`.trim()),
      escapeCsv(r.source),
      escapeCsv(r.landing_page)
    ].join(','));
  });

  return lines.join('\r\n');
}




function authenticateAdmin(request, env) {
  const url = new URL(request.url);
  const tokenQuery = url.searchParams.get('token');
  const authHeader = request.headers.get('Authorization') || '';
  const tokenHeader = authHeader.replace(/^Bearer\s+/i, '');

  const expected = env.ADMIN_PASSWORD || 'S33puoxIF10C79DuZjk1tPr22VnBzFn-SBhlbq7Vp1w';
  return (tokenQuery === expected || tokenHeader === expected);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // 1. Static Storefront HTML
    if (pathname === '/' || pathname === '/index.html') {
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    // 2. Admin Dashboard & Admin JS
    if (pathname === '/admin/market-test' || pathname === '/admin' || pathname === '/admin/') {
      return new Response(ADMIN_HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    if (pathname === '/admin-test.js') {
      return new Response(ADMIN_JS_CONTENT, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // 3. Asset & Image Serving (R2 with multiple key fallbacks)
    if (pathname.startsWith('/assets/') || pathname.startsWith('/images/') || pathname === '/favicon.ico' || pathname === '/favicon.png') {
      let r2Key = pathname.replace(/^\/(assets|images)\//, '');
      if (r2Key.startsWith('/')) r2Key = r2Key.substring(1);

      const candidateKeys = [
        r2Key,
        pathname.substring(1),
        'images/' + r2Key,
        'assets/' + r2Key
      ];
      if (pathname.includes('favicon')) {
        candidateKeys.push('assets/favicon.png', 'favicon.png', 'favicon.ico');
      }

      if (env && env.ASSETS && typeof env.ASSETS.get === 'function') {
        for (const key of candidateKeys) {
          try {
            const object = await env.ASSETS.get(key);
            if (object) {
              const ext = key.split('.').pop().toLowerCase();
              const contentType = MIME_TYPES[ext] || 'application/octet-stream';
              const headers = new Headers();
              object.writeHttpMetadata(headers);
              headers.set('Content-Type', contentType);
              headers.set('Access-Control-Allow-Origin', '*');
              headers.set('Cache-Control', 'public, max-age=31536000, immutable');
              return new Response(object.body, { headers });
            }
          } catch (r2Err) {}
        }
      }

      // External CDN fallback if missing in local R2 (never proxy logo or favicon)
      if (pathname.includes("logo") || pathname.includes("favicon")) {
        return new Response("Not found", { status: 404 });
      }
      try {
        const proxyUrl = 'https://kundikamado.ferkomes.workers.dev' + pathname;
        const proxyResp = await fetch(proxyUrl);
        if (proxyResp.ok) {
          const proxyHeaders = new Headers(proxyResp.headers);
          proxyHeaders.set('Access-Control-Allow-Origin', '*');
          proxyHeaders.set('Cache-Control', 'public, max-age=86400');
          return new Response(proxyResp.body, { status: 200, headers: proxyHeaders });
        }
      } catch (proxyErr) {}

      return new Response('Asset not found', { status: 404 });
    }

    // 4. Funnel Telemetry (POST /api/market-test/track)
    if (pathname === '/api/market-test/track' && method === 'POST') {
      try {
        const body = await request.json();
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const userAgent = request.headers.get('User-Agent') || '';
        const referer = request.headers.get('Referer') || '';

        await trackEvent(env.DB, {
          sessionId: body.sessionId,
          eventType: body.eventType,
          payload: body.payload,
          ip,
          userAgent,
          referer
        });

        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 5. Cart Update / Abandoned Cart (POST /api/market-test/cart-update)
    if (pathname === '/api/market-test/cart-update' && method === 'POST') {
      try {
        const body = await request.json();
        await updateCart(env.DB, body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 6. Purchase Intent (POST /api/market-test/purchase-intent)
    if (pathname === '/api/market-test/purchase-intent' && method === 'POST') {
      try {
        const body = await request.json();
        if (!body.sessionId || !body.customer || !body.customer.email) {
          throw new Error('Ongeldige aanvraag: contactgegevens ontbreken.');
        }

        const result = await recordPurchaseIntent(env, body);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 7. Admin Market Stats (GET /api/market-test/stats)
    if (pathname === '/api/market-test/stats' && method === 'GET') {
      if (!authenticateAdmin(request, env)) {
        return new Response(JSON.stringify({ error: 'Niet geautoriseerd' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const stats = await getMarketStats(env.DB);
        return new Response(JSON.stringify(stats), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // 8. Export Intents CSV (GET /api/market-test/export-intents.csv)
    if (pathname === '/api/market-test/export-intents.csv' && method === 'GET') {
      if (!authenticateAdmin(request, env)) {
        return new Response('Niet geautoriseerd', { status: 401 });
      }

      try {
        const csvContent = await exportIntentsCsv(env.DB);
        return new Response(csvContent, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="kundikamado-nl-intents.csv"'
          }
        });
      } catch (err) {
        return new Response('CSV export error: ' + err.message, { status: 500 });
      }
    }

    return new Response('Pagina niet gevonden', { status: 404 });
  }
};
