/**
 * KundiKamado Netherlands - Cloudflare Worker
 * - Serves Dutch storefront & Admin Dashboard
 * - R2 Asset streaming with fallback proxy
 * - D1 Database integration for Funnel & Purchase Intent tracking
 * - Owner email alert dispatcher
 */

const HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"nl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>KundiKamado Nederland | Premium Keramische BBQ's All-Inclusive</title>\n  <meta name=\"description\" content=\"Ontdek KundiKamado in Nederland. Premium Mullite keramische kamado BBQ's met Air Hinge scharnier, Divide & Conquer systeem en All-Inclusive uitrusting. Gratis palletbezorging.\">\n  <link rel=\"icon\" type=\"image/png\" href=\"assets/favicon.png\">\n  <link rel=\"apple-touch-icon\" href=\"assets/apple-touch-icon.png\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <style>\n/* ==========================================================================\n   KundiKamado Netherlands - Premium Dark BBQ Design System\n   ========================================================================== */\n\n:root {\n  --bg-main: #0c0d10;\n  --bg-card: #15161c;\n  --bg-card-hover: #1c1d25;\n  --bg-card-light: #232530;\n  --bg-elevated: #282a36;\n  --border-color: #2b2d3a;\n  --border-active: #ff6b35;\n\n  --primary: #ff6b35;\n  --primary-hover: #ff5214;\n  --primary-light: rgba(255, 107, 53, 0.15);\n  --accent: #f7931e;\n  --accent-glow: rgba(247, 147, 30, 0.35);\n\n  --text-main: #f8fafc;\n  --text-muted: #94a3b8;\n  --text-dim: #64748b;\n  --success: #10b981;\n  --danger: #ef4444;\n\n  --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;\n  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;\n  --radius-sm: 6px;\n  --radius-md: 12px;\n  --radius-lg: 18px;\n  --radius-xl: 24px;\n  --shadow-main: 0 10px 30px -10px rgba(0, 0, 0, 0.5);\n  --shadow-glow: 0 0 25px rgba(255, 107, 53, 0.25);\n  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n*, *::before, *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  scroll-behavior: smooth;\n  font-size: 16px;\n}\n\nbody {\n  background-color: var(--bg-main);\n  color: var(--text-main);\n  font-family: var(--font-body);\n  line-height: 1.6;\n  -webkit-font-smoothing: antialiased;\n  overflow-x: hidden;\n}\n\n/* Typography */\nh1, h2, h3, h4, h5, h6 {\n  font-family: var(--font-heading);\n  color: var(--text-main);\n  font-weight: 700;\n  line-height: 1.25;\n}\n\np {\n  color: var(--text-muted);\n}\n\na {\n  color: var(--primary);\n  text-decoration: none;\n  transition: var(--transition);\n}\n\na:hover {\n  color: var(--primary-hover);\n}\n\n/* Container */\n.container {\n  width: 100%;\n  max-width: 1240px;\n  margin: 0 auto;\n  padding: 0 1.5rem;\n}\n\n/* Top Banner */\n.top-banner {\n  background: linear-gradient(90deg, #b91c1c 0%, #c2410c 50%, #ea580c 100%);\n  color: #ffffff;\n  padding: 0.6rem 0;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n\n.top-banner-content {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}\n\n.banner-badge {\n  background: rgba(0, 0, 0, 0.3);\n  padding: 0.2rem 0.6rem;\n  border-radius: 999px;\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  font-weight: 700;\n}\n\n/* Header */\n.site-header {\n  position: sticky;\n  top: 0;\n  z-index: 100;\n  background-color: rgba(12, 13, 16, 0.92);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid var(--border-color);\n  padding: 1rem 0;\n}\n\n.header-inner {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.brand-logo {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}\n\n.logo-img {\n  height: 42px;\n  width: auto;\n  object-fit: contain;\n}\n\n.brand-text {\n  font-family: var(--font-heading);\n  font-size: 1.45rem;\n  font-weight: 800;\n  letter-spacing: -0.02em;\n  color: #ffffff;\n}\n\n.brand-text span {\n  color: var(--primary);\n}\n\n.country-tag {\n  background: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--accent);\n  padding: 0.15rem 0.45rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  margin-left: 0.3rem;\n  vertical-align: middle;\n}\n\n.main-nav {\n  display: flex;\n  gap: 2rem;\n}\n\n.main-nav a {\n  color: var(--text-muted);\n  font-weight: 500;\n  font-size: 0.95rem;\n}\n\n.main-nav a:hover {\n  color: #ffffff;\n}\n\n.cart-trigger {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n  padding: 0.55rem 1.1rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  font-weight: 600;\n  font-size: 0.95rem;\n  transition: var(--transition);\n}\n\n.cart-trigger:hover {\n  border-color: var(--primary);\n  background-color: var(--bg-card-hover);\n}\n\n.cart-badge {\n  background-color: var(--primary);\n  color: #ffffff;\n  font-size: 0.75rem;\n  font-weight: 700;\n  padding: 0.15rem 0.5rem;\n  border-radius: 999px;\n}\n\n/* Buttons */\n.btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.6rem;\n  font-family: var(--font-heading);\n  font-weight: 600;\n  border-radius: var(--radius-md);\n  padding: 0.75rem 1.5rem;\n  cursor: pointer;\n  transition: var(--transition);\n  border: none;\n  text-align: center;\n  text-decoration: none;\n}\n\n.btn-primary {\n  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);\n  color: #ffffff;\n  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);\n}\n\n.btn-primary:hover:not(:disabled) {\n  background: linear-gradient(135deg, var(--primary-hover) 0%, var(--primary) 100%);\n  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5);\n  transform: translateY(-2px);\n  color: #ffffff;\n}\n\n.btn-secondary {\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n}\n\n.btn-secondary:hover:not(:disabled) {\n  border-color: var(--primary);\n  color: #ffffff;\n  transform: translateY(-2px);\n}\n\n.btn-outline {\n  background: transparent;\n  border: 1px solid var(--border-color);\n  color: var(--text-main);\n}\n\n.btn-outline:hover {\n  border-color: var(--primary);\n  color: var(--primary);\n}\n\n.btn-lg {\n  padding: 0.9rem 1.8rem;\n  font-size: 1.05rem;\n}\n\n.btn-xl {\n  padding: 1.1rem 2rem;\n  font-size: 1.15rem;\n  border-radius: var(--radius-lg);\n}\n\n.btn-block {\n  width: 100%;\n}\n\n.btn:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  transform: none !important;\n}\n\n/* Hero Section */\n.hero-section {\n  padding: 4.5rem 0 3.5rem;\n  background: radial-gradient(circle at 75% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 60%);\n  border-bottom: 1px solid var(--border-color);\n}\n\n.hero-grid {\n  display: grid;\n  grid-template-columns: 1.1fr 0.9fr;\n  gap: 3.5rem;\n  align-items: center;\n}\n\n.hero-label {\n  display: inline-block;\n  background: rgba(255, 107, 53, 0.12);\n  border: 1px solid rgba(255, 107, 53, 0.3);\n  color: var(--primary);\n  font-size: 0.85rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  padding: 0.35rem 0.85rem;\n  border-radius: 999px;\n  margin-bottom: 1.25rem;\n}\n\n.hero-title {\n  font-size: 3.25rem;\n  letter-spacing: -0.03em;\n  margin-bottom: 1.25rem;\n}\n\n.hero-title .highlight {\n  background: linear-gradient(135deg, var(--primary) 0%, #ff9e42 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n\n.hero-subtitle {\n  font-size: 1.15rem;\n  line-height: 1.7;\n  margin-bottom: 2rem;\n}\n\n.hero-usps {\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n  margin-bottom: 2.25rem;\n}\n\n.usp-pill {\n  color: #cbd5e1;\n  font-weight: 500;\n  font-size: 0.95rem;\n}\n\n.hero-cta-group {\n  display: flex;\n  gap: 1.25rem;\n  flex-wrap: wrap;\n}\n\n.hero-media {\n  position: relative;\n}\n\n.hero-image-wrap {\n  position: relative;\n  border-radius: var(--radius-xl);\n  overflow: hidden;\n  border: 1px solid var(--border-color);\n  box-shadow: var(--shadow-main);\n}\n\n.hero-main-img {\n  width: 100%;\n  height: auto;\n  display: block;\n  object-fit: cover;\n  transition: transform 0.6s ease;\n}\n\n.hero-main-img:hover {\n  transform: scale(1.03);\n}\n\n.hero-floating-badge {\n  position: absolute;\n  bottom: 1.5rem;\n  left: 1.5rem;\n  background: rgba(21, 22, 28, 0.88);\n  backdrop-filter: blur(12px);\n  border: 1px solid var(--border-color);\n  padding: 0.75rem 1.25rem;\n  border-radius: var(--radius-md);\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);\n}\n\n.badge-icon {\n  font-size: 1.5rem;\n}\n\n.badge-info strong {\n  display: block;\n  font-size: 1.15rem;\n  color: #ffffff;\n}\n\n.badge-info small {\n  color: var(--accent);\n  font-weight: 600;\n}\n\n/* Sections */\n.section {\n  padding: 5rem 0;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.section-header {\n  margin-bottom: 3rem;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.section-tag {\n  display: inline-block;\n  color: var(--primary);\n  text-transform: uppercase;\n  font-size: 0.8rem;\n  letter-spacing: 0.1em;\n  font-weight: 700;\n  margin-bottom: 0.5rem;\n}\n\n.section-title {\n  font-size: 2.35rem;\n  margin-bottom: 0.75rem;\n}\n\n.section-desc {\n  font-size: 1.05rem;\n  max-width: 650px;\n  margin: 0 auto;\n}\n\n/* Size Tabs */\n.size-tabs {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n  margin-bottom: 2.5rem;\n}\n\n.size-tab {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.25rem 1rem;\n  cursor: pointer;\n  transition: var(--transition);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.4rem;\n  position: relative;\n}\n\n.size-tab:hover {\n  background-color: var(--bg-card-hover);\n  border-color: #3b3d4f;\n}\n\n.size-tab.active {\n  background: linear-gradient(180deg, var(--bg-card-light) 0%, var(--bg-card) 100%);\n  border-color: var(--primary);\n  box-shadow: var(--shadow-glow);\n}\n\n.tab-title {\n  font-family: var(--font-heading);\n  font-size: 1.15rem;\n  font-weight: 700;\n  color: var(--text-main);\n}\n\n.tab-badge {\n  color: var(--accent);\n  font-weight: 700;\n  font-size: 1rem;\n}\n\n.popular-tag {\n  position: absolute;\n  top: -10px;\n  background: linear-gradient(90deg, #ea580c, #f97316);\n  color: #ffffff;\n  font-size: 0.7rem;\n  font-weight: 700;\n  padding: 0.2rem 0.6rem;\n  border-radius: 999px;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n\n/* Configurator Card */\n.config-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-xl);\n  padding: 2.5rem;\n  box-shadow: var(--shadow-main);\n}\n\n.config-grid {\n  display: grid;\n  grid-template-columns: 1fr 1.15fr;\n  gap: 3rem;\n}\n\n.main-preview-wrap {\n  position: relative;\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  background-color: #08080a;\n  border: 1px solid var(--border-color);\n  aspect-ratio: 1 / 1;\n}\n\n.config-img {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  display: block;\n}\n\n.config-status-badge {\n  position: absolute;\n  top: 1rem;\n  left: 1rem;\n  background: rgba(255, 107, 53, 0.9);\n  color: #ffffff;\n  font-size: 0.8rem;\n  font-weight: 700;\n  padding: 0.35rem 0.85rem;\n  border-radius: 999px;\n  box-shadow: 0 4px 10px rgba(0,0,0,0.3);\n}\n\n.gallery-thumbs {\n  display: flex;\n  gap: 0.75rem;\n  margin-top: 1rem;\n  overflow-x: auto;\n  padding-bottom: 0.5rem;\n}\n\n.thumb-item {\n  width: 70px;\n  height: 70px;\n  border-radius: var(--radius-sm);\n  border: 1px solid var(--border-color);\n  background-color: #08080a;\n  cursor: pointer;\n  overflow: hidden;\n  flex-shrink: 0;\n  opacity: 0.7;\n  transition: var(--transition);\n}\n\n.thumb-item:hover, .thumb-item.active {\n  opacity: 1;\n  border-color: var(--primary);\n}\n\n.thumb-item img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n/* Config Details */\n.model-header h3 {\n  font-size: 2rem;\n  margin-bottom: 0.5rem;\n}\n\n.model-pricing {\n  display: flex;\n  align-items: baseline;\n  gap: 1rem;\n  margin-bottom: 1.25rem;\n  flex-wrap: wrap;\n}\n\n.current-price {\n  font-family: var(--font-heading);\n  font-size: 2.25rem;\n  font-weight: 800;\n  color: var(--primary);\n}\n\n.original-price {\n  font-size: 1.25rem;\n  color: var(--text-dim);\n  text-decoration: line-through;\n}\n\n.vat-tag {\n  font-size: 0.85rem;\n  color: var(--text-muted);\n}\n\n.model-desc {\n  margin-bottom: 1.5rem;\n  line-height: 1.65;\n}\n\n.specs-mini-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 0.75rem;\n  margin-bottom: 1.75rem;\n  background-color: var(--bg-card-light);\n  padding: 1rem;\n  border-radius: var(--radius-md);\n  border: 1px solid var(--border-color);\n}\n\n.spec-box {\n  display: flex;\n  flex-direction: column;\n}\n\n.spec-label {\n  font-size: 0.75rem;\n  color: var(--text-dim);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n\n.spec-box strong {\n  font-size: 0.95rem;\n  color: var(--text-main);\n}\n\n/* Options */\n.option-block {\n  margin-bottom: 1.5rem;\n}\n\n.option-label {\n  display: block;\n  font-weight: 600;\n  font-size: 0.95rem;\n  margin-bottom: 0.6rem;\n}\n\n.selected-val {\n  color: var(--accent);\n  font-weight: 700;\n}\n\n.color-options {\n  display: flex;\n  gap: 0.85rem;\n}\n\n.color-dot {\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  border: 2px solid #333;\n  cursor: pointer;\n  transition: var(--transition);\n  position: relative;\n}\n\n.color-dot:hover {\n  transform: scale(1.15);\n}\n\n.color-dot.active {\n  border-color: #ffffff;\n  box-shadow: 0 0 0 3px var(--primary);\n}\n\n.texture-selector {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 0.85rem;\n}\n\n.texture-radio {\n  display: flex;\n  align-items: center;\n  gap: 0.6rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 0.75rem 1rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  font-size: 0.85rem;\n  transition: var(--transition);\n}\n\n.texture-radio.active {\n  border-color: var(--primary);\n  background-color: rgba(255, 107, 53, 0.08);\n}\n\n.texture-radio input {\n  accent-color: var(--primary);\n}\n\n.config-actions {\n  display: grid;\n  grid-template-columns: 1.3fr 0.9fr;\n  gap: 1rem;\n  margin-top: 2rem;\n  margin-bottom: 1rem;\n}\n\n.reassurance-text {\n  font-size: 0.8rem;\n  color: var(--text-dim);\n  text-align: center;\n}\n\n/* Included Grid */\n.included-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1.5rem;\n}\n\n.included-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.75rem 1.5rem;\n  transition: var(--transition);\n}\n\n.included-card:hover {\n  border-color: var(--primary);\n  transform: translateY(-4px);\n}\n\n.inc-icon {\n  font-size: 2rem;\n  margin-bottom: 1rem;\n}\n\n.included-card h4 {\n  font-size: 1.15rem;\n  margin-bottom: 0.5rem;\n}\n\n.included-card p {\n  font-size: 0.9rem;\n  line-height: 1.55;\n}\n\n/* Accessories Section */\n.accessories-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.75rem;\n}\n\n.acc-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  transition: var(--transition);\n}\n\n.acc-card:hover {\n  border-color: #4b4e63;\n  transform: translateY(-3px);\n}\n\n.acc-img-wrap {\n  height: 200px;\n  background-color: #0a0b0d;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  padding: 1rem;\n}\n\n.acc-img {\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n}\n\n.acc-size-badge {\n  position: absolute;\n  top: 0.75rem;\n  right: 0.75rem;\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: var(--accent);\n  font-size: 0.75rem;\n  font-weight: 700;\n  padding: 0.2rem 0.55rem;\n  border-radius: 999px;\n}\n\n.acc-body {\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n}\n\n.acc-title {\n  font-size: 1.15rem;\n  margin-bottom: 0.4rem;\n}\n\n.acc-desc {\n  font-size: 0.85rem;\n  margin-bottom: 1.25rem;\n  flex-grow: 1;\n}\n\n.acc-footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-top: auto;\n  border-top: 1px solid var(--border-color);\n  padding-top: 1rem;\n}\n\n.acc-price {\n  font-family: var(--font-heading);\n  font-size: 1.35rem;\n  font-weight: 800;\n  color: var(--primary);\n}\n\n/* Why Section */\n.why-grid {\n  display: grid;\n  grid-template-columns: 1.1fr 0.9fr;\n  gap: 3.5rem;\n  align-items: center;\n}\n\n.why-features {\n  margin-top: 2rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n\n.why-feat {\n  display: flex;\n  gap: 1.25rem;\n  align-items: flex-start;\n}\n\n.feat-bullet {\n  width: 38px;\n  height: 38px;\n  background: rgba(255, 107, 53, 0.15);\n  border: 1px solid var(--primary);\n  color: var(--primary);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-family: var(--font-heading);\n  flex-shrink: 0;\n}\n\n.why-feat h4 {\n  font-size: 1.1rem;\n  margin-bottom: 0.25rem;\n}\n\n.why-visual img {\n  width: 100%;\n  border-radius: var(--radius-xl);\n  border: 1px solid var(--border-color);\n  box-shadow: var(--shadow-main);\n}\n\n/* Reviews */\n.reviews-grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1.75rem;\n}\n\n.review-card {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 2rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.review-stars {\n  color: #fbbf24;\n  font-size: 1.25rem;\n  margin-bottom: 1rem;\n}\n\n.review-quote {\n  font-size: 0.95rem;\n  font-style: italic;\n  margin-bottom: 1.5rem;\n  flex-grow: 1;\n  color: #cbd5e1;\n}\n\n.review-author strong {\n  display: block;\n  color: #ffffff;\n}\n\n.review-author span {\n  font-size: 0.8rem;\n  color: var(--accent);\n}\n\n/* Cart Drawer */\n.cart-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.65);\n  backdrop-filter: blur(4px);\n  z-index: 200;\n  opacity: 0;\n  visibility: hidden;\n  transition: var(--transition);\n}\n\n.cart-backdrop.open {\n  opacity: 1;\n  visibility: visible;\n}\n\n.cart-drawer {\n  position: fixed;\n  top: 0;\n  right: -450px;\n  width: 100%;\n  max-width: 440px;\n  height: 100vh;\n  background-color: var(--bg-card);\n  border-left: 1px solid var(--border-color);\n  z-index: 201;\n  display: flex;\n  flex-direction: column;\n  transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);\n  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);\n}\n\n.cart-drawer.open {\n  right: 0;\n}\n\n.cart-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.close-btn {\n  background: none;\n  border: none;\n  color: var(--text-muted);\n  font-size: 2rem;\n  cursor: pointer;\n  line-height: 1;\n}\n\n.close-btn:hover {\n  color: #ffffff;\n}\n\n.cart-items {\n  flex-grow: 1;\n  overflow-y: auto;\n  padding: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.empty-cart-msg {\n  text-align: center;\n  color: var(--text-dim);\n  margin-top: 3rem;\n  font-size: 1.05rem;\n}\n\n.cart-item {\n  display: flex;\n  gap: 1rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 1rem;\n  border-radius: var(--radius-md);\n  position: relative;\n}\n\n.cart-item-img {\n  width: 65px;\n  height: 65px;\n  object-fit: contain;\n  background: #000;\n  border-radius: var(--radius-sm);\n}\n\n.cart-item-info {\n  flex-grow: 1;\n}\n\n.cart-item-title {\n  font-size: 0.95rem;\n  font-weight: 700;\n  margin-bottom: 0.2rem;\n}\n\n.cart-item-meta {\n  font-size: 0.75rem;\n  color: var(--text-dim);\n  margin-bottom: 0.5rem;\n}\n\n.cart-item-price {\n  font-weight: 700;\n  color: var(--primary);\n  font-size: 1rem;\n}\n\n.cart-item-qty {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  margin-top: 0.5rem;\n}\n\n.qty-btn {\n  width: 26px;\n  height: 26px;\n  background-color: var(--bg-elevated);\n  border: 1px solid var(--border-color);\n  color: #ffffff;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.qty-val {\n  font-size: 0.85rem;\n  font-weight: 600;\n}\n\n.remove-item-btn {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n  background: none;\n  border: none;\n  color: var(--text-dim);\n  cursor: pointer;\n  font-size: 1.1rem;\n}\n\n.remove-item-btn:hover {\n  color: var(--danger);\n}\n\n.cart-summary {\n  padding: 1.5rem;\n  border-top: 1px solid var(--border-color);\n  background-color: var(--bg-main);\n}\n\n.summary-row {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.6rem;\n  font-size: 0.95rem;\n}\n\n.text-free {\n  color: var(--success);\n  font-weight: 700;\n}\n\n.total-row {\n  border-top: 1px solid var(--border-color);\n  padding-top: 0.75rem;\n  margin-top: 0.75rem;\n  font-size: 1.2rem;\n  font-weight: 800;\n  color: #ffffff;\n}\n\n.total-row span:last-child {\n  color: var(--primary);\n}\n\n/* Modals */\n.modal-backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.75);\n  backdrop-filter: blur(6px);\n  z-index: 300;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1.5rem;\n  opacity: 0;\n  visibility: hidden;\n  transition: var(--transition);\n}\n\n.modal-backdrop.open {\n  opacity: 1;\n  visibility: visible;\n}\n\n.modal-dialog {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-xl);\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);\n  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n@keyframes modalIn {\n  from { transform: scale(0.95) translateY(10px); opacity: 0; }\n  to { transform: scale(1) translateY(0); opacity: 1; }\n}\n\n.checkout-modal {\n  max-width: 600px;\n}\n\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1.5rem;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.modal-body {\n  padding: 1.75rem;\n}\n\n.checkout-step-title {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: var(--accent);\n  margin-bottom: 1rem;\n  margin-top: 1.5rem;\n}\n\n.checkout-step-title:first-of-type {\n  margin-top: 0;\n}\n\n.form-group {\n  margin-bottom: 1rem;\n  display: flex;\n  flex-direction: column;\n}\n\n.form-group label {\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.35rem;\n  color: #cbd5e1;\n}\n\n.form-group input, .form-group select {\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  color: #ffffff;\n  padding: 0.75rem 1rem;\n  border-radius: var(--radius-md);\n  font-family: var(--font-body);\n  font-size: 0.95rem;\n  outline: none;\n  transition: var(--transition);\n}\n\n.form-group input:focus, .form-group select:focus {\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);\n}\n\n.form-row {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n\n.address-row .grow-2 { grid-column: span 2; }\n@media (min-width: 500px) {\n  .address-row {\n    grid-template-columns: 2fr 1fr;\n  }\n  .address-row .grow-2 { grid-column: auto; }\n}\n\n.payment-methods-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 0.75rem;\n  margin-bottom: 1.5rem;\n}\n\n.payment-opt {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  padding: 0.85rem 1.25rem;\n  border-radius: var(--radius-md);\n  cursor: pointer;\n  transition: var(--transition);\n}\n\n.payment-opt.active {\n  border-color: var(--primary);\n  background-color: rgba(255, 107, 53, 0.08);\n}\n\n.payment-opt input {\n  accent-color: var(--primary);\n}\n\n.payment-opt-info strong {\n  display: block;\n  font-size: 0.95rem;\n}\n\n.payment-opt-info small {\n  color: var(--text-dim);\n  font-size: 0.8rem;\n}\n\n.checkout-summary-box {\n  background-color: #0a0b0e;\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-md);\n  padding: 1.25rem;\n  margin-bottom: 1.5rem;\n}\n\n.summary-line {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n  font-size: 0.9rem;\n}\n\n.summary-line.total {\n  border-top: 1px solid var(--border-color);\n  padding-top: 0.75rem;\n  margin-top: 0.75rem;\n  font-size: 1.15rem;\n  font-weight: 800;\n  color: #ffffff;\n}\n\n.summary-line.total strong {\n  color: var(--primary);\n}\n\n.form-errors {\n  color: var(--danger);\n  font-size: 0.85rem;\n  margin-bottom: 1rem;\n}\n\n.checkout-notice {\n  display: block;\n  text-align: center;\n  color: var(--text-dim);\n  font-size: 0.8rem;\n  margin-top: 0.75rem;\n}\n\n/* Notice Modal (Demand Test) */\n.notice-modal {\n  max-width: 550px;\n  padding: 2.5rem 2rem;\n  text-align: center;\n}\n\n.notice-icon {\n  font-size: 3.5rem;\n  margin-bottom: 1rem;\n}\n\n.notice-title {\n  font-size: 1.85rem;\n  margin-bottom: 0.5rem;\n}\n\n.notice-badge {\n  display: inline-block;\n  background: var(--primary-light);\n  color: var(--primary);\n  border: 1px solid rgba(255, 107, 53, 0.3);\n  padding: 0.25rem 0.75rem;\n  border-radius: 999px;\n  font-size: 0.8rem;\n  font-weight: 700;\n  text-transform: uppercase;\n  margin-bottom: 1.25rem;\n}\n\n.notice-text {\n  font-size: 1rem;\n  line-height: 1.6;\n  margin-bottom: 1.75rem;\n}\n\n.notice-highlight-card {\n  background-color: var(--bg-card-light);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-lg);\n  padding: 1.25rem;\n  text-align: left;\n  margin-bottom: 1.75rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n.hl-item {\n  display: flex;\n  gap: 0.85rem;\n}\n\n.hl-icon {\n  color: var(--success);\n  font-weight: 800;\n  font-size: 1.2rem;\n  flex-shrink: 0;\n}\n\n.hl-item strong {\n  display: block;\n  font-size: 0.95rem;\n  color: #ffffff;\n  margin-bottom: 0.2rem;\n}\n\n.hl-item p {\n  font-size: 0.85rem;\n  line-height: 1.5;\n}\n\n.registered-summary {\n  background: #08090b;\n  border: 1px dashed var(--border-color);\n  border-radius: var(--radius-md);\n  padding: 1rem;\n  font-size: 0.85rem;\n  text-align: left;\n  margin-bottom: 1.75rem;\n}\n\n/* Footer */\n.site-footer {\n  background-color: #070709;\n  border-top: 1px solid var(--border-color);\n  padding: 4.5rem 0 2rem;\n}\n\n.footer-grid {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr 1.2fr 1fr;\n  gap: 3rem;\n  margin-bottom: 3rem;\n}\n\n.footer-logo {\n  margin-bottom: 1rem;\n}\n\n.footer-col h4 {\n  font-size: 1.05rem;\n  margin-bottom: 1.25rem;\n  color: #ffffff;\n}\n\n.footer-col ul {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 0.6rem;\n}\n\n.footer-col li, .footer-col a {\n  font-size: 0.9rem;\n  color: var(--text-muted);\n}\n\n.footer-col a:hover {\n  color: #ffffff;\n}\n\n.copyright {\n  margin-top: 1.5rem;\n  font-size: 0.8rem;\n  color: var(--text-dim);\n}\n\n.payment-badges {\n  display: flex;\n  gap: 0.5rem;\n  flex-wrap: wrap;\n  margin-bottom: 0.75rem;\n}\n\n.pay-badge {\n  background-color: var(--bg-card);\n  border: 1px solid var(--border-color);\n  padding: 0.3rem 0.6rem;\n  border-radius: 4px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  color: #cbd5e1;\n}\n\n.ssl-note {\n  color: var(--text-dim);\n  font-size: 0.75rem;\n}\n\n/* Responsive Breakpoints */\n@media (max-width: 1024px) {\n  .hero-grid {\n    grid-template-columns: 1fr;\n    gap: 2.5rem;\n  }\n  .config-grid {\n    grid-template-columns: 1fr;\n    gap: 2rem;\n  }\n  .included-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .accessories-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .footer-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .why-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n@media (max-width: 768px) {\n  .main-nav {\n    display: none;\n  }\n  .hero-title {\n    font-size: 2.5rem;\n  }\n  .size-tabs {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .specs-mini-grid {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  .texture-selector {\n    grid-template-columns: 1fr;\n  }\n  .config-actions {\n    grid-template-columns: 1fr;\n  }\n  .reviews-grid {\n    grid-template-columns: 1fr;\n  }\n  .accessories-grid {\n    grid-template-columns: 1fr;\n  }\n  .included-grid {\n    grid-template-columns: 1fr;\n  }\n  .footer-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n</style>\n</head>\n<body>\n  <!-- Top notification bar -->\n  <div class=\"top-banner\">\n    <div class=\"container top-banner-content\">\n      <span>🇳🇱 <strong>Nederlandse Marktintroductie</strong>: All-Inclusive Pakket + Gratis Palletlevering in heel Nederland!</span>\n      <span class=\"banner-badge\">Beperkte Oplage</span>\n    </div>\n  </div>\n\n  <!-- Header -->\n  <header class=\"site-header\">\n    <div class=\"container header-inner\">\n      <a href=\"/\" class=\"brand-logo\">\n        <img src=\"assets/logo.png\" alt=\"KundiKamado Logo\" class=\"logo-img\" onerror=\"this.src='assets/kk-logo.png'\">\n        <span class=\"brand-text\">Kundi<span>Kamado</span> <small class=\"country-tag\">NL</small></span>\n      </a>\n      <nav class=\"main-nav\">\n        <a href=\"#modellen\">Kamado Modellen</a>\n        <a href=\"#all-inclusive\">All-Inclusive Pakket</a>\n        <a href=\"#accessoires\">Accessoires</a>\n        <a href=\"#waarom-kundikamado\">Waarom KundiKamado?</a>\n        <a href=\"#reviews\">Ervaringen</a>\n      </nav>\n      <div class=\"header-actions\">\n        <button id=\"cartBtn\" class=\"cart-trigger\" aria-label=\"Winkelwagen openen\">\n          <span class=\"cart-icon\">🛒</span>\n          <span class=\"cart-text\">Winkelwagen</span>\n          <span id=\"cartCountBadge\" class=\"cart-badge\">0</span>\n        </button>\n      </div>\n    </div>\n  </header>\n\n  <!-- Hero Section -->\n  <section class=\"hero-section\">\n    <div class=\"container hero-grid\">\n      <div class=\"hero-content\">\n        <div class=\"hero-label\">🔥 Dé Nieuwe Standaard in Buiten Koken</div>\n        <h1 class=\"hero-title\">Keramisch Meesterschap.<br><span class=\"highlight\">All-Inclusive</span> Geleverd.</h1>\n        <p class=\"hero-subtitle\">\n          Geen verborgen kosten, geen losse accessoires bijkopen. KundiKamado levert de meest complete keramische barbecue van Nederland, vervaardigd uit zwaar Mullite keramiek met gepatenteerd Air Hinge scharnier.\n        </p>\n        <div class=\"hero-usps\">\n          <div class=\"usp-pill\">✓ Levenslange garantie op keramiek</div>\n          <div class=\"usp-pill\">✓ Compleet met onderstel & zijtafels</div>\n          <div class=\"usp-pill\">✓ Gratis verzekerde palletbezorging</div>\n        </div>\n        <div class=\"hero-cta-group\">\n          <a href=\"#modellen\" class=\"btn btn-primary btn-lg\">Kies Jouw Kamado</a>\n          <a href=\"#all-inclusive\" class=\"btn btn-outline btn-lg\">Bekijk Uitrusting</a>\n        </div>\n      </div>\n      <div class=\"hero-media\">\n        <div class=\"hero-image-wrap\">\n          <img src=\"assets/hero.webp\" alt=\"KundiKamado Premium BBQ\" class=\"hero-main-img\" onerror=\"this.src='assets/hero.jpg'\">\n          <div class=\"hero-floating-badge\">\n            <span class=\"badge-icon\">⭐</span>\n            <div class=\"badge-info\">\n              <strong>Vanaf €699,-</strong>\n              <small>Volledig compleet</small>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Model Selector & Configurator -->\n  <section id=\"modellen\" class=\"section models-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\">Formaten & Prijzen</span>\n        <h2 class=\"section-title\">Kies Jouw Perfecte KundiKamado</h2>\n        <p class=\"section-desc\">Selecteer een formaat, kleur en afwerking. Prijzen zijn inclusief 21% BTW en complete All-Inclusive uitrusting.</p>\n      </div>\n\n      <!-- Size Tabs -->\n      <div class=\"size-tabs\" id=\"sizeTabs\">\n        <button class=\"size-tab\" data-size=\"18\">\n          <span class=\"tab-title\">18″ Compact</span>\n          <span class=\"tab-badge\">€699</span>\n        </button>\n        <button class=\"size-tab\" data-size=\"21\">\n          <span class=\"tab-title\">21″ Veelzijdig</span>\n          <span class=\"tab-badge\">€889</span>\n        </button>\n        <button class=\"size-tab active\" data-size=\"23\">\n          <span class=\"popular-tag\">Meest Gekozen</span>\n          <span class=\"tab-title\">23″ Bestseller</span>\n          <span class=\"tab-badge\">€1.019</span>\n        </button>\n        <button class=\"size-tab\" data-size=\"27\">\n          <span class=\"tab-title\">27″ HoReCa Reus</span>\n          <span class=\"tab-badge\">€1.319</span>\n        </button>\n      </div>\n\n      <!-- Interactive Configurator Box -->\n      <div class=\"config-card\" id=\"configCard\">\n        <div class=\"config-grid\">\n          <!-- Gallery / Preview -->\n          <div class=\"config-gallery\">\n            <div class=\"main-preview-wrap\">\n              <img id=\"activeModelImg\" src=\"assets/kamado/kamado_23_front.jpg\" alt=\"KundiKamado 23 inch\" class=\"config-img\">\n              <span id=\"activeModelBadge\" class=\"config-status-badge\">🔥 Meest Gekozen</span>\n            </div>\n            <div class=\"gallery-thumbs\" id=\"galleryThumbs\">\n              <!-- Dynamically populated thumbs -->\n            </div>\n          </div>\n\n          <!-- Options & Details -->\n          <div class=\"config-details\">\n            <div class=\"model-header\">\n              <h3 id=\"activeModelName\">KundiKamado 23″ Bestseller</h3>\n              <div class=\"model-pricing\">\n                <span class=\"current-price\" id=\"activeModelPrice\">€1.019,-</span>\n                <span class=\"original-price\" id=\"activeModelOrigPrice\">€1.178,-</span>\n                <span class=\"vat-tag\">Inclusief 21% BTW & Verzending</span>\n              </div>\n            </div>\n\n            <p class=\"model-desc\" id=\"activeModelDesc\">\n              De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.\n            </p>\n\n            <!-- Specs Grid -->\n            <div class=\"specs-mini-grid\">\n              <div class=\"spec-box\">\n                <span class=\"spec-label\">Grillrooster</span>\n                <strong id=\"specGrate\">Ø 52.3 cm</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\">Buitendiameter</span>\n                <strong id=\"specBody\">59.5 cm</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\">Capaciteit</span>\n                <strong id=\"specPeople\">4–8 personen</strong>\n              </div>\n              <div class=\"spec-box\">\n                <span class=\"spec-label\">Gewicht</span>\n                <strong id=\"specWeight\">89 kg</strong>\n              </div>\n            </div>\n\n            <!-- Color Options -->\n            <div class=\"option-block\">\n              <label class=\"option-label\">Kies Kleur: <span id=\"selectedColorName\" class=\"selected-val\">Mat / Glans Zwart</span></label>\n              <div class=\"color-options\" id=\"colorOptions\">\n                <button class=\"color-dot active\" data-color-id=\"black\" data-color-name=\"Onyx Zwart\" style=\"background-color: #171717;\" title=\"Onyx Zwart\"></button>\n                <button class=\"color-dot\" data-color-id=\"red\" data-color-name=\"Robijn Rood\" style=\"background-color: #a82225;\" title=\"Robijn Rood\"></button>\n                <button class=\"color-dot\" data-color-id=\"green\" data-color-name=\"Bosgroen\" style=\"background-color: #246342;\" title=\"Bosgroen\"></button>\n                <button class=\"color-dot\" data-color-id=\"cream\" data-color-name=\"Parel Crème\" style=\"background-color: #eadfc8;\" title=\"Parel Crème\"></button>\n                <button class=\"color-dot\" data-color-id=\"blue\" data-color-name=\"Marine Blauw\" style=\"background-color: #2355ad;\" title=\"Marine Blauw\"></button>\n              </div>\n            </div>\n\n            <!-- Finish Texture -->\n            <div class=\"option-block\">\n              <label class=\"option-label\">Keramische Afwerking: <span id=\"selectedTextureName\" class=\"selected-val\">Bubble Glaze (Ambachtelijk reliëf)</span></label>\n              <div class=\"texture-selector\">\n                <label class=\"texture-radio active\">\n                  <input type=\"radio\" name=\"texture\" value=\"bubble\" checked>\n                  <span><strong>Bubble Glaze</strong> (Robuust, krasvast & klassiek)</span>\n                </label>\n                <label class=\"texture-radio\">\n                  <input type=\"radio\" name=\"texture\" value=\"shiny\">\n                  <span><strong>Hoogglans Glad</strong> (Strak modern design)</span>\n                </label>\n              </div>\n            </div>\n\n            <!-- Action Buttons -->\n            <div class=\"config-actions\">\n              <button id=\"addModelToCartBtn\" class=\"btn btn-primary btn-xl\">\n                <span>In Winkelwagen Leggen</span>\n                <strong id=\"addBtnPrice\">€1.019,-</strong>\n              </button>\n              <button id=\"directCheckoutBtn\" class=\"btn btn-secondary btn-xl\">\n                <span>Direct Bestellen</span>\n              </button>\n            </div>\n            <div class=\"reassurance-text\">\n              🔒 Veilig bestellen • Geen betaalverplichting bij marktvalidatie • Gratis thuisbezorgd\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- All-Inclusive Inbegrepen Pakket -->\n  <section id=\"all-inclusive\" class=\"section included-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\">Ongeëvenaarde Waarde</span>\n        <h2 class=\"section-title\">Wat zit er Standaard in het Pakket?</h2>\n        <p class=\"section-desc\">Bij andere merken betaal je honderden euro's extra voor accessoires. Bij KundiKamado is alles direct inbegrepen.</p>\n      </div>\n      <div class=\"included-grid\">\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">⚙️</div>\n          <h4>Air Hinge Veerscharnier</h4>\n          <p>Moeiteloos openen en sluiten. De zware deksel blijft op elke gewenste stand veilig zweven zonder dicht te klappen.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🥩</div>\n          <h4>Divide & Conquer Kooksysteem</h4>\n          <p>Tweedelig flexibel kooksysteem op verschillende hoogtes. Combineer tegelijkertijd direct grillen en indirect roken.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🛡️</div>\n          <h4>Gietijzeren Halve Maan Rooster</h4>\n          <p>Inclusief zwaar gietijzeren rooster voor sensationele grillstrepen en sublieme karamellisatie van je vlees.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🧹</div>\n          <h4>RVS Aslade & Schraper</h4>\n          <p>Gemakkelijk as verwijderen in een handomdraai zonder knoeien via de uitschuifbare RVS aslade.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🪵</div>\n          <h4>Rookhout Toevoerpoort</h4>\n          <p>Voeg houtsnippers of chunks toe tijdens lange rooksessies zonder het deksel te openen en warmte te verliezen.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🌧️</div>\n          <h4>Zware Weersbestendige Hoes</h4>\n          <p>Extra dikke, UV- en waterbestendige beschermhoes op maat, zodat jouw kamado in elk seizoen beschermd buiten staat.</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🛞</div>\n          <h4>Zwaar Rolbaar Onderstel</h4>\n          <p>Gepoedercoat stalen frame met 4 grote industriële zwenkwielen (waarvan 2 met stevige remvoet).</p>\n        </div>\n        <div class=\"included-card\">\n          <div class=\"inc-icon\">🎋</div>\n          <h4>Inklapbare Bamboe Zijtafels</h4>\n          <p>Stevige natuurlijke bamboe zijtafels met praktische haken voor je spatels, vleestangen en theedoeken.</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Size-Dependent Accessories Showcase -->\n  <section id=\"accessoires\" class=\"section accessories-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\">Maatwerk Accessoires</span>\n        <h2 class=\"section-title\">Optionele Uitbreidingen op Maat</h2>\n        <p class=\"section-desc\">\n          Prijzen en afmetingen van onderstaande accessoires passen zich automatisch aan op de geselecteerde <strong id=\"accSelectedSizeLabel\">23″ Kamado</strong>.\n        </p>\n      </div>\n\n      <div class=\"accessories-grid\" id=\"accessoriesGrid\">\n        <!-- Dynamically rendered accessories -->\n      </div>\n    </div>\n  </section>\n\n  <!-- Why KundiKamado -->\n  <section id=\"waarom-kundikamado\" class=\"section why-section\">\n    <div class=\"container\">\n      <div class=\"why-grid\">\n        <div class=\"why-text\">\n          <span class=\"section-tag\">Superieure Bouwkwaliteit</span>\n          <h2 class=\"section-title\">Ontwikkeld voor Echte BBQ Fanaten</h2>\n          <p>\n            KundiKamado is ontstaan uit één heldere filosofie: een compromisloze keramische barbecue bouwen met de allerbeste materialen, zónder de torenhoge marketingopslagen van gevestigde merken.\n          </p>\n          <div class=\"why-features\">\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">1</span>\n              <div>\n                <h4>Speciaal Mullite Keramiek</h4>\n                <p>Uitzonderlijk bestand tegen thermische schokken en temperaturen tot wel 1.000°C. Scheurt niet bij vrieskou of plotse hitte.</p>\n              </div>\n            </div>\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">2</span>\n              <div>\n                <h4>30% Zuiniger Houtskoolverbruik</h4>\n                <p>Dankzij de superieure thermische massa kook je met één lading kwaliteits-houtskool tot wel 24 uur continu op 110°C.</p>\n              </div>\n            </div>\n            <div class=\"why-feat\">\n              <span class=\"feat-bullet\">3</span>\n              <div>\n                <h4>Direct Contact & Persoonlijke Service</h4>\n                <p>Onze experts staan altijd voor je klaar met advies over recepten, onderhoud en techniek.</p>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"why-visual\">\n          <img src=\"assets/kamado/kamado_bbq_lifestyle.jpg\" alt=\"Kamado Lifestyle Grilling\" class=\"why-img\" onerror=\"this.src='assets/hero.jpg'\">\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Customer Reviews -->\n  <section id=\"reviews\" class=\"section reviews-section\">\n    <div class=\"container\">\n      <div class=\"section-header text-center\">\n        <span class=\"section-tag\">Beoordelingen</span>\n        <h2 class=\"section-title\">Wat Zeggen BBQ Liefhebbers?</h2>\n      </div>\n      <div class=\"reviews-grid\">\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\">\"De prijs-kwaliteitverhouding is ongeëvenaard. Je krijgt een kamado van topniveau met scharnier en divide & conquer waar je bij anderen honderden euro's meer voor betaalt.\"</p>\n          <div class=\"review-author\">\n            <strong>Jan van der Meer</strong>\n            <span>Utrecht • KundiKamado 23″</span>\n          </div>\n        </div>\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\">\"Het Air Hinge scharnier is een openbaring. De deksel van de 23 inch voelt vederlicht aan. Mijn vrouw kan hem nu ook gemakkelijk openen zonder angst.\"</p>\n          <div class=\"review-author\">\n            <strong>Mark de Jong</strong>\n            <span>Eindhoven • KundiKamado 23″</span>\n          </div>\n        </div>\n        <div class=\"review-card\">\n          <div class=\"review-stars\">★★★★★</div>\n          <p class=\"review-quote\">\"Fantastische temperatuurstabiliteit! Eerste brisket van 14 uur gemaakt zonder de schuiven aan te hoeven raken. De bubble glaze afwerking ziet er geweldig uit in de tuin.\"</p>\n          <div class=\"review-author\">\n            <strong>Sander Bakker</strong>\n            <span>Haarlem • KundiKamado 21″</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <!-- Cart Drawer (Offcanvas) -->\n  <div class=\"cart-backdrop\" id=\"cartBackdrop\"></div>\n  <aside class=\"cart-drawer\" id=\"cartDrawer\">\n    <div class=\"cart-header\">\n      <h3>Jouw Winkelwagen</h3>\n      <button id=\"closeCartBtn\" class=\"close-btn\" aria-label=\"Sluiten\">&times;</button>\n    </div>\n    <div class=\"cart-items\" id=\"cartItemsList\">\n      <!-- Items dynamically populated -->\n      <div class=\"empty-cart-msg\">Je winkelwagen is nog leeg.</div>\n    </div>\n    <div class=\"cart-summary\" id=\"cartSummary\">\n      <div class=\"summary-row\">\n        <span>Subtotaal:</span>\n        <span id=\"cartSubtotal\">€0,-</span>\n      </div>\n      <div class=\"summary-row\">\n        <span>Palletbezorging (Nederland):</span>\n        <span class=\"text-free\">GRATIS</span>\n      </div>\n      <div class=\"summary-row total-row\">\n        <span>Totaal (incl. BTW):</span>\n        <span id=\"cartTotal\">€0,-</span>\n      </div>\n      <button id=\"goToCheckoutBtn\" class=\"btn btn-primary btn-block btn-lg\" disabled>\n        Doorgaan naar Bestellen\n      </button>\n    </div>\n  </aside>\n\n  <!-- Checkout Modal -->\n  <div class=\"modal-backdrop\" id=\"checkoutModalBackdrop\">\n    <div class=\"modal-dialog checkout-modal\">\n      <div class=\"modal-header\">\n        <h3>Afrekenen & Gegevens</h3>\n        <button id=\"closeCheckoutBtn\" class=\"close-btn\" aria-label=\"Sluiten\">&times;</button>\n      </div>\n      <div class=\"modal-body\">\n        <form id=\"checkoutForm\" novalidate>\n          <div class=\"checkout-step-title\">1. Contactgegevens</div>\n          <div class=\"form-row\">\n            <div class=\"form-group\">\n              <label for=\"custEmail\">E-mailadres *</label>\n              <input type=\"email\" id=\"custEmail\" name=\"email\" placeholder=\"bijv. jan@example.nl\" required>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"custPhone\">Telefoonnummer *</label>\n              <input type=\"tel\" id=\"custPhone\" name=\"phone\" placeholder=\"bijv. 06 12345678\" required>\n            </div>\n          </div>\n\n          <div class=\"checkout-step-title\">2. Bezorgadres in Nederland</div>\n          <div class=\"form-group\">\n            <label for=\"custName\">Volledige Naam *</label>\n            <input type=\"text\" id=\"custName\" name=\"name\" placeholder=\"Voor- en achternaam\" required>\n          </div>\n          <div class=\"form-row address-row\">\n            <div class=\"form-group grow-2\">\n              <label for=\"custStreet\">Straatnaam *</label>\n              <input type=\"text\" id=\"custStreet\" name=\"street\" placeholder=\"bijv. Keizersgracht\" required>\n            </div>\n            <div class=\"form-group grow-1\">\n              <label for=\"custHouse\">Huisnummer *</label>\n              <input type=\"text\" id=\"custHouse\" name=\"house\" placeholder=\"bijv. 42A\" required>\n            </div>\n          </div>\n          <div class=\"form-row\">\n            <div class=\"form-group\">\n              <label for=\"custZip\">Postcode *</label>\n              <input type=\"text\" id=\"custZip\" name=\"zip\" placeholder=\"bijv. 1015 CR\" required>\n            </div>\n            <div class=\"form-group\">\n              <label for=\"custCity\">Woonplaats *</label>\n              <input type=\"text\" id=\"custCity\" name=\"city\" placeholder=\"bijv. Amsterdam\" required>\n            </div>\n          </div>\n\n          <div class=\"checkout-step-title\">3. Kies Betaalmethode</div>\n          <div class=\"payment-methods-grid\">\n            <label class=\"payment-opt active\">\n              <input type=\"radio\" name=\"payment_method\" value=\"ideal\" checked>\n              <div class=\"payment-opt-info\">\n                <strong>iDEAL</strong>\n                <small>Direct en veilig via jouw eigen bank</small>\n              </div>\n            </label>\n            <label class=\"payment-opt\">\n              <input type=\"radio\" name=\"payment_method\" value=\"creditcard\">\n              <div class=\"payment-opt-info\">\n                <strong>Creditcard</strong>\n                <small>Mastercard, Visa, American Express</small>\n              </div>\n            </label>\n            <label class=\"payment-opt\">\n              <input type=\"radio\" name=\"payment_method\" value=\"klarna\">\n              <div class=\"payment-opt-info\">\n                <strong>Klarna</strong>\n                <small>Achteraf betalen binnen 30 dagen</small>\n              </div>\n            </label>\n          </div>\n\n          <div class=\"checkout-summary-box\">\n            <div class=\"summary-line\">\n              <span>Gekozen artikelen:</span>\n              <strong id=\"checkoutItemsCount\">0 artikelen</strong>\n            </div>\n            <div class=\"summary-line\">\n              <span>Bezorging:</span>\n              <span class=\"text-free\">Gratis palletlevering</span>\n            </div>\n            <div class=\"summary-line total\">\n              <span>Totaalbedrag:</span>\n              <strong id=\"checkoutTotalAmount\">€0,-</strong>\n            </div>\n          </div>\n\n          <div class=\"form-errors\" id=\"formErrors\"></div>\n\n          <button type=\"submit\" id=\"submitIntentBtn\" class=\"btn btn-primary btn-block btn-xl\">\n            Doorgaan naar betaling\n          </button>\n          <small class=\"checkout-notice\">\n            Door te klikken bevestig je je interesse in het KundiKamado assortiment.\n          </small>\n        </form>\n      </div>\n    </div>\n  </div>\n\n  <!-- Market Test Demand Notice Modal -->\n  <div class=\"modal-backdrop\" id=\"intentNoticeBackdrop\">\n    <div class=\"modal-dialog notice-modal\">\n      <div class=\"notice-icon\">🎉</div>\n      <h2 class=\"notice-title\">Bedankt voor je enorme enthousiasme!</h2>\n      <div class=\"notice-badge\">KundiKamado Nederland • VIP Lancering</div>\n      <p class=\"notice-text\">\n        Wij voeren momenteel een <strong>exclusieve marktvalidatie</strong> uit in Nederland voor de KundiKamado collectie. Jouw gewenste samenstelling is zojuist succesvol als voorkeursreservering geregistreerd!\n      </p>\n\n      <div class=\"notice-highlight-card\">\n        <div class=\"hl-item\">\n          <span class=\"hl-icon\">✓</span>\n          <div>\n            <strong>Niets in rekening gebracht</strong>\n            <p>Er is op dit moment geen betaling uitgevoerd of geld afgeschreven.</p>\n          </div>\n        </div>\n        <div class=\"hl-item\">\n          <span class=\"hl-icon\">🎁</span>\n          <div>\n            <strong>10% VIP Introductiekorting gereserveerd</strong>\n            <p>Omdat je een van de eerste Nederlandse geïnteresseerden bent, ontvang je direct bericht zodra onze eerste container arriveert, inclusief 10% VIP korting en een gratis verrassingsaccessoire!</p>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"registered-summary\" id=\"registeredSummaryBox\">\n        <!-- Will display registered configuration -->\n      </div>\n\n      <button id=\"closeNoticeBtn\" class=\"btn btn-primary btn-block btn-lg\">\n        Begrepen, hou mij op de hoogte!\n      </button>\n    </div>\n  </div>\n\n  <!-- Footer -->\n  <footer class=\"site-footer\">\n    <div class=\"container footer-grid\">\n      <div class=\"footer-col\">\n        <div class=\"brand-logo footer-logo\">\n          <img src=\"assets/logo.png\" alt=\"KundiKamado Logo\" class=\"logo-img\" onerror=\"this.src='assets/kk-logo.png'\">\n          <span class=\"brand-text\">Kundi<span>Kamado</span></span>\n        </div>\n        <p>Dé all-inclusive keramische barbecue met levenslange garantie op het keramiek. Kwaliteit zonder concessies.</p>\n        <p class=\"copyright\">© 2026 KundiKamado Nederland. Alle rechten voorbehouden.</p>\n      </div>\n      <div class=\"footer-col\">\n        <h4>Snelle Links</h4>\n        <ul>\n          <li><a href=\"#modellen\">Kamado Modellen</a></li>\n          <li><a href=\"#all-inclusive\">Inbegrepen Pakket</a></li>\n          <li><a href=\"#accessoires\">Maatwerk Accessoires</a></li>\n          <li><a href=\"#waarom-kundikamado\">Onze Filosofie</a></li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <h4>Klantenservice</h4>\n        <ul>\n          <li>E-mail: <a href=\"mailto:info@kundikamado.hu\">info@kundikamado.hu</a></li>\n          <li>Verzending: Gratis palletlevering in heel Nederland</li>\n          <li>Garantie: Levenslang op keramiek, 5 jaar op scharnieren</li>\n          <li>Retourneren: 30 dagen bedenktermijn</li>\n        </ul>\n      </div>\n      <div class=\"footer-col\">\n        <h4>Veiligheid & Betaalmethoden</h4>\n        <div class=\"payment-badges\">\n          <span class=\"pay-badge\">iDEAL</span>\n          <span class=\"pay-badge\">Mastercard</span>\n          <span class=\"pay-badge\">VISA</span>\n          <span class=\"pay-badge\">Klarna</span>\n        </div>\n        <small class=\"ssl-note\">🔒 256-bit SSL Beveiligde Verbinding</small>\n      </div>\n    </div>\n  </footer>\n\n  <script>\n/**\n * KundiKamado Netherlands - Market Test Storefront Logic\n * - Size-dependent Kamado and accessory pricing\n * - Cart management in EUR\n * - Real-time market funnel tracking (visitor -> cart -> checkout -> purchase_intent)\n * - Abandoned cart telemetry\n * - Transparent demand validation notice flow\n */\n\n(function() {\n  'use strict';\n\n  // --- CATALOG DATA ---\n  const KAMADO_MODELS = {\n    '18': {\n      id: '18',\n      name: 'KundiKamado 18″ Compact',\n      modelCode: 'AU-18OR',\n      badge: 'Compact & Familie',\n      price: 699,\n      origPrice: 898,\n      grate: 'Ø 38.5 cm',\n      body: '45.0 cm (17.7″)',\n      people: '2–4 personen',\n      weight: '59.5 kg',\n      assembledSize: '118 × 65 × 116.5 cm',\n      desc: 'Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.',\n      image: 'images/kamado_18_front.jpg',\n      thumbs: [\n        'images/kamado_18_front.jpg',\n        'images/kamado_divide_open.jpg',\n        'images/kamado_detail_vent.jpg',\n        'images/kamado_detail_hinge.jpg',\n        'images/kamado_bbq_lifestyle.jpg'\n      ]\n    },\n    '21': {\n      id: '21',\n      name: 'KundiKamado 21″ Veelzijdig',\n      modelCode: 'AU-21OR',\n      badge: 'Veelzijdig & Familie+',\n      price: 889,\n      origPrice: 1108,\n      grate: 'Ø 47.5 cm',\n      body: '53.6 cm (21.1″)',\n      people: '4–6 personen',\n      weight: '75.0 kg',\n      assembledSize: '129.6 × 73 × 125.9 cm',\n      desc: 'Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.',\n      image: 'images/kamado_21_front.jpg',\n      thumbs: [\n        'images/kamado_21_front.jpg',\n        'images/kamado_divide_open.jpg',\n        'images/kamado_detail_vent.jpg',\n        'images/kamado_detail_hinge.jpg',\n        'images/kamado_bbq_lifestyle.jpg'\n      ]\n    },\n    '23': {\n      id: '23',\n      name: 'KundiKamado 23″ Bestseller',\n      modelCode: 'AU-23OR',\n      badge: '🔥 Bestseller / Meest Gekozen',\n      price: 1019,\n      origPrice: 1178,\n      grate: 'Ø 52.3 cm',\n      body: '59.5 cm (23.5″)',\n      people: '4–8 personen (Ideaal)',\n      weight: '89.0 kg',\n      assembledSize: '136 × 80 × 126.8 cm',\n      desc: 'De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.',\n      image: 'images/kamado_23_front.jpg',\n      thumbs: [\n        'images/kamado_23_front.jpg',\n        'images/kamado_divide_open.jpg',\n        'images/kamado_detail_vent.jpg',\n        'images/kamado_detail_hinge.jpg',\n        'images/kamado_bbq_lifestyle.jpg'\n      ]\n    },\n    '27': {\n      id: '27',\n      name: 'KundiKamado 27″ HoReCa Reus',\n      modelCode: 'AU-27OR',\n      badge: 'Reus / HoReCa & Heavy Duty',\n      price: 1319,\n      origPrice: 1410,\n      grate: 'Ø 57.5 cm',\n      body: '67.7 cm (26.6″)',\n      people: '6–12+ personen',\n      weight: '94.6 kg',\n      assembledSize: '144.7 × 89 × 131 cm',\n      desc: 'Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.',\n      image: 'images/kamado_27_front.jpg',\n      thumbs: [\n        'images/kamado_27_front.jpg',\n        'images/kamado_divide_open.jpg',\n        'images/kamado_detail_vent.jpg',\n        'images/kamado_detail_hinge.jpg',\n        'images/kamado_bbq_lifestyle.jpg'\n      ]\n    }\n  };\n\n  const ACCESSORIES = [\n    {\n      id: 'cover',\n      category: 'protection',\n      name: 'Premium All-Weather Beschermhoes',\n      isSizeDependent: true,\n      sizePrices: { '18': 39, '21': 45, '23': 49, '27': 59 },\n      desc: 'Zware kwaliteit waterdichte en UV-bestendige hoes, op maat gemaakt voor het gekozen formaat kamado.',\n      image: 'images/cover.webp'\n    },\n    {\n      id: 'rotisserie',\n      category: 'tools',\n      name: 'Draaispit / Rotisserie met motor',\n      isSizeDependent: true,\n      sizePrices: { '18': 139, '21': 159, '23': 159, '27': 189 },\n      desc: 'Spitring met krachtige 230V/batterij motor voor gelijkmatige rotatie en ultiem malse braadstukken.',\n      image: 'images/rotisserie.webp'\n    },\n    {\n      id: 'cast-iron-halfmoon',\n      category: 'cooking',\n      name: 'Gietijzeren Halve Maan Plancha / Rooster',\n      isSizeDependent: true,\n      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },\n      desc: 'Dubbelzijdig bruikbaar: één geribbelde zijde voor steaks, één gladde bakplaat voor smashburgers en groenten.',\n      image: 'images/divide.webp'\n    },\n    {\n      id: 'pizza-stone',\n      category: 'cooking',\n      name: 'Cordieriet Pizzasteen (Extra Dik)',\n      isSizeDependent: true,\n      sizePrices: { '18': 49, '21': 59, '23': 69, '27': 79 },\n      desc: 'Hittebestendig tot 400°C voor de ultieme krokante Napolitaanse pizzabodem op jouw kamado.',\n      image: 'images/pizza.webp'\n    },\n    {\n      id: 'electric-starter',\n      category: 'tools',\n      name: 'Elektrische Houtskoolaansteker (2000W)',\n      isSizeDependent: false,\n      price: 59,\n      desc: 'Binnen 60-90 seconden gloeiende houtskool met hete lucht, zonder vieze chemicaliën of geur.',\n      image: 'images/heat.webp'\n    },\n    {\n      id: 'bbq-gloves',\n      category: 'protection',\n      name: 'Hittebestendige BBQ Handschoenen (350°C)',\n      isSizeDependent: false,\n      price: 32,\n      desc: 'Hittebestendig siliconen met antislip profiel voor het veilig vastpakken van gloeiend hete roosters.',\n      image: 'images/cover.webp'\n    },\n    {\n      id: 'meat-claws',\n      category: 'tools',\n      name: 'Pulled Pork Vleesklauwen Set',\n      isSizeDependent: false,\n      price: 16,\n      desc: 'Oersterke voedselveilige klauwen om pulled pork en kipfilet binnen no-time professioneel te versnipperen.',\n      image: 'images/ash.webp'\n    },\n    {\n      id: 'grid-clip',\n      category: 'tools',\n      name: 'RVS Roostertang & Lifter',\n      isSizeDependent: false,\n      price: 14,\n      desc: 'Stevig hulpmiddel om hete grillroosters en gietijzeren pannen veilig uit de kamado te tillen.',\n      image: 'images/cast-iron.webp'\n    },\n    {\n      id: 'ash-collector-kit',\n      category: 'tools',\n      name: 'RVS Aslade & Schraper Kit',\n      isSizeDependent: false,\n      price: 22,\n      desc: 'Sluit naadloos aan op de luchtschuif onderin voor supersnel en stofvrij verwijderen van overgebleven as.',\n      image: 'images/ash.webp'\n    }\n  ];\n\n  // --- STATE ---\n  let currentSize = '23';\n  let currentColor = { id: 'black', name: 'Onyx Zwart' };\n  let currentTexture = { id: 'bubble', name: 'Bubble Glaze (Ambachtelijk reliëf)' };\n  let cart = [];\n\n  // Session token\n  function getSessionId() {\n    let sid = localStorage.getItem('kk_nl_session');\n    if (!sid) {\n      sid = 'nl_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);\n      localStorage.setItem('kk_nl_session', sid);\n    }\n    return sid;\n  }\n\n  const sessionId = getSessionId();\n\n  // --- TELEMETRY DISPATCHER ---\n  async function trackEvent(eventType, payload = {}) {\n    try {\n      await fetch('/api/market-test/track', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          sessionId,\n          eventType,\n          payload: { ...payload, timestamp: new Date().toISOString() }\n        })\n      });\n    } catch (e) {\n      console.warn('Telemetry event failed:', e);\n    }\n  }\n\n  async function syncCartTelemetry() {\n    try {\n      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);\n      await fetch('/api/market-test/cart-update', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          sessionId,\n          items: cart,\n          totalAmount,\n          lastStep: document.getElementById('checkoutModalBackdrop')?.classList.contains('open') ? 'checkout' : 'cart'\n        })\n      });\n    } catch (e) {\n      console.warn('Cart telemetry sync failed:', e);\n    }\n  }\n\n  // --- FORMATTERS ---\n  function formatEur(amount) {\n    return '€' + Number(amount).toLocaleString('nl-NL') + ',-';\n  }\n\n  // --- UI UPDATERS ---\n  function updateModelConfigurator() {\n    const model = KAMADO_MODELS[currentSize];\n    if (!model) return;\n\n    // Header & pricing\n    document.getElementById('activeModelName').textContent = model.name;\n    document.getElementById('activeModelPrice').textContent = formatEur(model.price);\n    document.getElementById('activeModelOrigPrice').textContent = formatEur(model.origPrice);\n    document.getElementById('activeModelDesc').textContent = model.desc;\n    document.getElementById('addBtnPrice').textContent = formatEur(model.price);\n\n    // Specs\n    document.getElementById('specGrate').textContent = model.grate;\n    document.getElementById('specBody').textContent = model.body;\n    document.getElementById('specPeople').textContent = model.people;\n    document.getElementById('specWeight').textContent = model.weight;\n\n    // Main image & thumbs\n    const activeImg = document.getElementById('activeModelImg');\n    activeImg.src = model.image;\n    document.getElementById('activeModelBadge').textContent = model.badge;\n\n    const thumbsContainer = document.getElementById('galleryThumbs');\n    thumbsContainer.innerHTML = '';\n    model.thumbs.forEach((src, idx) => {\n      const thumb = document.createElement('div');\n      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;\n      thumb.innerHTML = `<img src=\"${src}\" alt=\"Thumbnail ${idx + 1}\" onerror=\"this.src='assets/hero.jpg'\">`;\n      thumb.onclick = () => {\n        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));\n        thumb.classList.add('active');\n        activeImg.src = src;\n      };\n      thumbsContainer.appendChild(thumb);\n    });\n\n    // Update label in accessories section\n    const accLabel = document.getElementById('accSelectedSizeLabel');\n    if (accLabel) accLabel.textContent = `${currentSize}″ Kamado`;\n\n    // Re-render accessories with size-dependent prices\n    renderAccessories();\n  }\n\n  function renderAccessories() {\n    const grid = document.getElementById('accessoriesGrid');\n    if (!grid) return;\n\n    grid.innerHTML = '';\n    ACCESSORIES.forEach(acc => {\n      let price = acc.price;\n      let sizeBadge = '';\n\n      if (acc.isSizeDependent) {\n        price = acc.sizePrices[currentSize] || acc.sizePrices['23'];\n        sizeBadge = `<span class=\"acc-size-badge\">Maat ${currentSize}″</span>`;\n      }\n\n      const card = document.createElement('div');\n      card.className = 'acc-card';\n      card.innerHTML = `\n        <div class=\"acc-img-wrap\">\n          <img src=\"${acc.image}\" alt=\"${acc.name}\" class=\"acc-img\" onerror=\"this.src='assets/pizza.webp'\">\n          ${sizeBadge}\n        </div>\n        <div class=\"acc-body\">\n          <h4 class=\"acc-title\">${acc.name}</h4>\n          <p class=\"acc-desc\">${acc.desc}</p>\n          <div class=\"acc-footer\">\n            <div class=\"acc-price\">${formatEur(price)}</div>\n            <button class=\"btn btn-secondary add-acc-btn\" data-id=\"${acc.id}\">\n              + Toevoegen\n            </button>\n          </div>\n        </div>\n      `;\n\n      card.querySelector('.add-acc-btn').onclick = () => {\n        addAccessoryToCart(acc, price);\n      };\n\n      grid.appendChild(card);\n    });\n  }\n\n  // --- CART OPERATIONS ---\n  function loadCart() {\n    try {\n      const saved = localStorage.getItem('kk_nl_cart');\n      if (saved) cart = JSON.parse(saved);\n    } catch (e) {\n      cart = [];\n    }\n    updateCartUI();\n  }\n\n  function saveCart() {\n    try {\n      localStorage.setItem('kk_nl_cart', JSON.stringify(cart));\n    } catch (e) {}\n    updateCartUI();\n    syncCartTelemetry();\n  }\n\n  function addModelToCart() {\n    const model = KAMADO_MODELS[currentSize];\n    const cartItemId = `kamado_${currentSize}_${currentColor.id}_${currentTexture.id}`;\n\n    const existing = cart.find(item => item.id === cartItemId);\n    if (existing) {\n      existing.qty += 1;\n    } else {\n      cart.push({\n        id: cartItemId,\n        type: 'kamado',\n        modelId: currentSize,\n        name: model.name,\n        sizeInch: currentSize,\n        colorId: currentColor.id,\n        colorName: currentColor.name,\n        textureId: currentTexture.id,\n        textureName: currentTexture.name,\n        price: model.price,\n        image: model.image,\n        qty: 1\n      });\n    }\n\n    saveCart();\n    trackEvent('add_to_cart', {\n      type: 'kamado',\n      modelId: currentSize,\n      color: currentColor.id,\n      texture: currentTexture.id,\n      price: model.price\n    });\n    openCart();\n  }\n\n  function addAccessoryToCart(acc, price) {\n    const sizeSuffix = acc.isSizeDependent ? `_${currentSize}` : '';\n    const cartItemId = `acc_${acc.id}${sizeSuffix}`;\n\n    const existing = cart.find(item => item.id === cartItemId);\n    if (existing) {\n      existing.qty += 1;\n    } else {\n      cart.push({\n        id: cartItemId,\n        type: 'accessory',\n        rawId: acc.id,\n        name: acc.name,\n        sizeInch: acc.isSizeDependent ? currentSize : null,\n        price: price,\n        image: acc.image,\n        qty: 1\n      });\n    }\n\n    saveCart();\n    trackEvent('add_to_cart', {\n      type: 'accessory',\n      accessoryId: acc.id,\n      sizeInch: acc.isSizeDependent ? currentSize : null,\n      price: price\n    });\n    openCart();\n  }\n\n  function updateCartUI() {\n    const badge = document.getElementById('cartCountBadge');\n    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);\n    badge.textContent = totalCount;\n\n    const list = document.getElementById('cartItemsList');\n    if (!list) return;\n\n    if (cart.length === 0) {\n      list.innerHTML = '<div class=\"empty-cart-msg\">Je winkelwagen is nog leeg.</div>';\n      document.getElementById('cartSubtotal').textContent = '€0,-';\n      document.getElementById('cartTotal').textContent = '€0,-';\n      document.getElementById('goToCheckoutBtn').disabled = true;\n      return;\n    }\n\n    document.getElementById('goToCheckoutBtn').disabled = false;\n    list.innerHTML = '';\n\n    let subtotal = 0;\n    cart.forEach(item => {\n      const itemTotal = item.price * item.qty;\n      subtotal += itemTotal;\n\n      let metaText = '';\n      if (item.type === 'kamado') {\n        metaText = `${item.colorName} • ${item.textureName}`;\n      } else if (item.sizeInch) {\n        metaText = `Geschikt voor ${item.sizeInch}″ Kamado`;\n      }\n\n      const itemEl = document.createElement('div');\n      itemEl.className = 'cart-item';\n      itemEl.innerHTML = `\n        <img src=\"${item.image}\" alt=\"${item.name}\" class=\"cart-item-img\" onerror=\"this.src='assets/pizza.webp'\">\n        <div class=\"cart-item-info\">\n          <div class=\"cart-item-title\">${item.name}</div>\n          <div class=\"cart-item-meta\">${metaText}</div>\n          <div class=\"cart-item-price\">${formatEur(item.price)}</div>\n          <div class=\"cart-item-qty\">\n            <button class=\"qty-btn dec-btn\" data-id=\"${item.id}\">-</button>\n            <span class=\"qty-val\">${item.qty}</span>\n            <button class=\"qty-btn inc-btn\" data-id=\"${item.id}\">+</button>\n          </div>\n        </div>\n        <button class=\"remove-item-btn\" data-id=\"${item.id}\" aria-label=\"Verwijder artikel\">&times;</button>\n      `;\n\n      itemEl.querySelector('.dec-btn').onclick = () => {\n        if (item.qty > 1) {\n          item.qty -= 1;\n        } else {\n          cart = cart.filter(i => i.id !== item.id);\n        }\n        saveCart();\n      };\n\n      itemEl.querySelector('.inc-btn').onclick = () => {\n        item.qty += 1;\n        saveCart();\n      };\n\n      itemEl.querySelector('.remove-item-btn').onclick = () => {\n        cart = cart.filter(i => i.id !== item.id);\n        saveCart();\n      };\n\n      list.appendChild(itemEl);\n    });\n\n    document.getElementById('cartSubtotal').textContent = formatEur(subtotal);\n    document.getElementById('cartTotal').textContent = formatEur(subtotal);\n  }\n\n  function openCart() {\n    document.getElementById('cartBackdrop').classList.add('open');\n    document.getElementById('cartDrawer').classList.add('open');\n    trackEvent('open_cart', { totalItems: cart.reduce((s, i) => s + i.qty, 0) });\n  }\n\n  function closeCart() {\n    document.getElementById('cartBackdrop').classList.remove('open');\n    document.getElementById('cartDrawer').classList.remove('open');\n  }\n\n  // --- CHECKOUT OPERATIONS ---\n  function openCheckout() {\n    closeCart();\n    const modalBackdrop = document.getElementById('checkoutModalBackdrop');\n    modalBackdrop.classList.add('open');\n\n    // Update checkout totals\n    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);\n    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);\n    document.getElementById('checkoutItemsCount').textContent = `${totalCount} artikel(en)`;\n    document.getElementById('checkoutTotalAmount').textContent = formatEur(subtotal);\n    document.getElementById('formErrors').textContent = '';\n\n    trackEvent('checkout_start', { totalItems: totalCount, totalAmount: subtotal });\n    syncCartTelemetry();\n  }\n\n  function closeCheckout() {\n    document.getElementById('checkoutModalBackdrop').classList.remove('open');\n  }\n\n  // --- PURCHASE INTENT SUBMISSION ---\n  async function handleCheckoutSubmit(e) {\n    e.preventDefault();\n    const errorEl = document.getElementById('formErrors');\n    errorEl.textContent = '';\n\n    const email = document.getElementById('custEmail').value.trim();\n    const phone = document.getElementById('custPhone').value.trim();\n    const name = document.getElementById('custName').value.trim();\n    const street = document.getElementById('custStreet').value.trim();\n    const house = document.getElementById('custHouse').value.trim();\n    const zip = document.getElementById('custZip').value.trim();\n    const city = document.getElementById('custCity').value.trim();\n    const paymentMethod = document.querySelector('input[name=\"payment_method\"]:checked')?.value || 'ideal';\n\n    if (!email || !email.includes('@')) {\n      errorEl.textContent = 'Vul een geldig e-mailadres in.';\n      return;\n    }\n    if (!phone || phone.length < 8) {\n      errorEl.textContent = 'Vul een geldig telefoonnummer in.';\n      return;\n    }\n    if (!name || !street || !house || !zip || !city) {\n      errorEl.textContent = 'Vul alle verplichte adresvelden in.';\n      return;\n    }\n\n    const submitBtn = document.getElementById('submitIntentBtn');\n    submitBtn.disabled = true;\n    submitBtn.textContent = 'Bezig met verwerken...';\n\n    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);\n\n    // Identify primary Kamado in order if present\n    const primaryKamado = cart.find(item => item.type === 'kamado') || {};\n    const accessoriesOrdered = cart.filter(item => item.type === 'accessory');\n\n    const intentPayload = {\n      sessionId,\n      customer: {\n        email,\n        phone,\n        name,\n        street,\n        houseNumber: house,\n        postalCode: zip,\n        city,\n        country: 'NL'\n      },\n      paymentMethod,\n      modelId: primaryKamado.modelId || currentSize,\n      sizeInch: primaryKamado.sizeInch || currentSize,\n      colorId: primaryKamado.colorId || currentColor.id,\n      colorName: primaryKamado.colorName || currentColor.name,\n      texture: primaryKamado.textureName || currentTexture.name,\n      items: cart,\n      accessories: accessoriesOrdered,\n      subtotalEur: subtotal,\n      shippingFeeEur: 0,\n      totalAmountEur: subtotal\n    };\n\n    try {\n      const resp = await fetch('/api/market-test/purchase-intent', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(intentPayload)\n      });\n\n      const data = await resp.json();\n      if (!resp.ok) {\n        throw new Error(data.error || 'Fout bij het versturen.');\n      }\n\n      // Track the final purchase intent event\n      trackEvent('purchase_intent', {\n        intentId: data.intentId,\n        totalEur: subtotal,\n        email\n      });\n\n      // Show Demand Notice Modal\n      closeCheckout();\n      showIntentDemandNotice(intentPayload, data.intentId);\n\n      // Reset cart\n      cart = [];\n      saveCart();\n    } catch (err) {\n      errorEl.textContent = err.message || 'Er trad een onverwachte fout op. Probeer het opnieuw.';\n    } finally {\n      submitBtn.disabled = false;\n      submitBtn.textContent = 'Doorgaan naar betaling';\n    }\n  }\n\n  function showIntentDemandNotice(intentPayload, intentId) {\n    const summaryBox = document.getElementById('registeredSummaryBox');\n    let itemsListHtml = intentPayload.items.map(i => `<li><strong>${i.qty}x</strong> ${i.name} (${formatEur(i.price * i.qty)})</li>`).join('');\n\n    summaryBox.innerHTML = `\n      <div style=\"margin-bottom: 0.5rem;\"><strong>Referentienummer:</strong> NL-VIP-${intentId.substring(0, 8).toUpperCase()}</div>\n      <div style=\"margin-bottom: 0.5rem;\"><strong>Geregistreerd voor:</strong> ${intentPayload.customer.name} (${intentPayload.customer.email})</div>\n      <div style=\"margin-bottom: 0.5rem;\"><strong>Gekozen configuratie:</strong></div>\n      <ul style=\"padding-left: 1.25rem; margin-bottom: 0.5rem; color: #cbd5e1;\">${itemsListHtml}</ul>\n      <div><strong>Totaalwaarde:</strong> ${formatEur(intentPayload.totalAmountEur)} (Palletbezorging inbegrepen)</div>\n    `;\n\n    document.getElementById('intentNoticeBackdrop').classList.add('open');\n  }\n\n  // --- INITIALIZATION & EVENT LISTENERS ---\n  document.addEventListener('DOMContentLoaded', () => {\n    // 1. Initial page tracking\n    trackEvent('page_view', {\n      url: window.location.href,\n      referrer: document.referrer,\n      userAgent: navigator.userAgent\n    });\n\n    // 2. Load stored cart\n    loadCart();\n\n    // 3. Setup size tabs\n    document.querySelectorAll('.size-tab').forEach(tab => {\n      tab.addEventListener('click', () => {\n        document.querySelectorAll('.size-tab').forEach(t => t.classList.remove('active'));\n        tab.classList.add('active');\n        currentSize = tab.dataset.size;\n        updateModelConfigurator();\n        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });\n      });\n    });\n\n    // 4. Setup color dots\n    document.querySelectorAll('.color-dot').forEach(dot => {\n      dot.addEventListener('click', () => {\n        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));\n        dot.classList.add('active');\n        currentColor = {\n          id: dot.dataset.colorId,\n          name: dot.dataset.colorName\n        };\n        document.getElementById('selectedColorName').textContent = currentColor.name;\n        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });\n      });\n    });\n\n    // 5. Setup texture radio\n    document.querySelectorAll('input[name=\"texture\"]').forEach(radio => {\n      radio.addEventListener('change', (e) => {\n        document.querySelectorAll('.texture-radio').forEach(r => r.classList.remove('active'));\n        e.target.closest('.texture-radio').classList.add('active');\n        currentTexture = {\n          id: e.target.value,\n          name: e.target.value === 'bubble' ? 'Bubble Glaze (Ambachtelijk reliëf)' : 'Hoogglans Glad (Strak modern design)'\n        };\n        document.getElementById('selectedTextureName').textContent = currentTexture.name;\n        trackEvent('change_config', { size: currentSize, color: currentColor.id, texture: currentTexture.id });\n      });\n    });\n\n    // 6. Setup cart drawer triggers\n    document.getElementById('cartBtn').addEventListener('click', openCart);\n    document.getElementById('closeCartBtn').addEventListener('click', closeCart);\n    document.getElementById('cartBackdrop').addEventListener('click', closeCart);\n\n    // 7. Add to cart actions\n    document.getElementById('addModelToCartBtn').addEventListener('click', addModelToCart);\n    document.getElementById('directCheckoutBtn').addEventListener('click', () => {\n      addModelToCart();\n      openCheckout();\n    });\n\n    // 8. Checkout modal triggers\n    document.getElementById('goToCheckoutBtn').addEventListener('click', openCheckout);\n    document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckout);\n\n    // 9. Payment method switcher in checkout\n    document.querySelectorAll('.payment-opt').forEach(opt => {\n      opt.addEventListener('click', () => {\n        document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('active'));\n        opt.classList.add('active');\n      });\n    });\n\n    // 10. Checkout form submit\n    document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);\n\n    // 11. Demand notice close button\n    document.getElementById('closeNoticeBtn').addEventListener('click', () => {\n      document.getElementById('intentNoticeBackdrop').classList.remove('open');\n    });\n\n    // Initial render\n    updateModelConfigurator();\n  });\n})();\n\n</script>\n</body>\n</html>\n";
const ADMIN_HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"nl\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>KundiKamado NL | Marktvalidatie Dashboard</title>\n  <link rel=\"icon\" type=\"image/png\" href=\"/assets/favicon.png\">\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n  <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n  <style>\n    :root {\n      --bg: #0b0c10;\n      --card: #14161f;\n      --card-border: #232634;\n      --text: #f1f5f9;\n      --text-dim: #94a3b8;\n      --primary: #ff6b35;\n      --accent: #f7931e;\n      --success: #10b981;\n      --danger: #ef4444;\n      --warning: #f59e0b;\n      --font-head: 'Outfit', sans-serif;\n      --font-body: 'Inter', sans-serif;\n    }\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body {\n      background-color: var(--bg);\n      color: var(--text);\n      font-family: var(--font-body);\n      line-height: 1.5;\n      padding: 1.5rem;\n    }\n    h1, h2, h3, h4 { font-family: var(--font-head); color: #fff; }\n    .header-bar {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 2rem;\n      padding-bottom: 1rem;\n      border-bottom: 1px solid var(--card-border);\n      flex-wrap: wrap;\n      gap: 1rem;\n    }\n    .brand-area { display: flex; align-items: center; gap: 0.75rem; }\n    .brand-tag {\n      background: var(--primary);\n      color: #fff;\n      font-size: 0.75rem;\n      font-weight: 700;\n      padding: 0.2rem 0.5rem;\n      border-radius: 4px;\n      text-transform: uppercase;\n    }\n    .header-actions { display: flex; gap: 0.75rem; align-items: center; }\n    .btn {\n      background: var(--primary);\n      color: #fff;\n      border: none;\n      padding: 0.6rem 1.2rem;\n      border-radius: 6px;\n      font-family: var(--font-head);\n      font-weight: 600;\n      cursor: pointer;\n      font-size: 0.9rem;\n      transition: opacity 0.2s;\n      text-decoration: none;\n    }\n    .btn:hover { opacity: 0.9; }\n    .btn-secondary { background: #232634; color: var(--text); border: 1px solid #363a4f; }\n    .btn-secondary:hover { background: #2f3346; }\n\n    /* KPI Grid */\n    .kpi-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n      gap: 1.25rem;\n      margin-bottom: 2rem;\n    }\n    .kpi-card {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      padding: 1.25rem;\n      border-radius: 12px;\n    }\n    .kpi-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-dim); font-weight: 600; margin-bottom: 0.4rem; }\n    .kpi-value { font-size: 1.85rem; font-family: var(--font-head); font-weight: 800; color: #fff; }\n    .kpi-sub { font-size: 0.8rem; color: var(--accent); margin-top: 0.25rem; }\n\n    /* Funnel Section */\n    .section-box {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      border-radius: 12px;\n      padding: 1.5rem;\n      margin-bottom: 2rem;\n    }\n    .section-title { font-size: 1.2rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; }\n\n    .funnel-container {\n      display: grid;\n      grid-template-columns: repeat(4, 1fr);\n      gap: 1rem;\n      position: relative;\n    }\n    .funnel-step {\n      background: #1a1d29;\n      border: 1px solid var(--card-border);\n      border-radius: 8px;\n      padding: 1.25rem 1rem;\n      text-align: center;\n      position: relative;\n    }\n    .funnel-step.intent { border-color: var(--primary); background: rgba(255, 107, 53, 0.08); }\n    .step-name { font-size: 0.85rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.5rem; }\n    .step-count { font-size: 1.75rem; font-family: var(--font-head); font-weight: 800; color: #fff; }\n    .step-rate { font-size: 0.85rem; color: var(--success); font-weight: 600; margin-top: 0.25rem; }\n    .step-dropoff { font-size: 0.75rem; color: var(--danger); margin-top: 0.2rem; }\n\n    /* Split Grids */\n    .two-cols {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 1.5rem;\n      margin-bottom: 2rem;\n    }\n    @media (max-width: 900px) {\n      .two-cols { grid-template-columns: 1fr; }\n      .funnel-container { grid-template-columns: 1fr 1fr; }\n    }\n    @media (max-width: 600px) {\n      .funnel-container { grid-template-columns: 1fr; }\n    }\n\n    /* Tables */\n    .data-table {\n      width: 100%;\n      border-collapse: collapse;\n      font-size: 0.9rem;\n      text-align: left;\n    }\n    .data-table th {\n      background: #1a1c27;\n      padding: 0.75rem 1rem;\n      color: var(--text-dim);\n      font-weight: 600;\n      border-bottom: 1px solid var(--card-border);\n    }\n    .data-table td {\n      padding: 0.85rem 1rem;\n      border-bottom: 1px solid var(--card-border);\n      color: var(--text);\n    }\n    .data-table tr:hover td { background: #1c1f2d; }\n    .badge {\n      display: inline-block;\n      padding: 0.2rem 0.5rem;\n      border-radius: 4px;\n      font-size: 0.75rem;\n      font-weight: 700;\n    }\n    .badge-primary { background: rgba(255, 107, 53, 0.2); color: var(--primary); }\n    .badge-success { background: rgba(16, 185, 129, 0.2); color: var(--success); }\n    .badge-warning { background: rgba(245, 158, 11, 0.2); color: var(--warning); }\n\n    /* Tabs */\n    .tab-bar { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--card-border); margin-bottom: 1.25rem; }\n    .tab-btn {\n      background: none;\n      border: none;\n      color: var(--text-dim);\n      font-family: var(--font-head);\n      font-size: 1rem;\n      font-weight: 600;\n      padding: 0.75rem 1.25rem;\n      cursor: pointer;\n      border-bottom: 2px solid transparent;\n    }\n    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }\n\n    /* Auth modal */\n    .auth-overlay {\n      position: fixed;\n      inset: 0;\n      background: #0b0c10;\n      z-index: 1000;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 1.5rem;\n    }\n    .auth-card {\n      background: var(--card);\n      border: 1px solid var(--card-border);\n      border-radius: 12px;\n      padding: 2.5rem 2rem;\n      max-width: 420px;\n      width: 100%;\n      text-align: center;\n    }\n    .auth-card h2 { margin-bottom: 0.75rem; }\n    .auth-card p { font-size: 0.9rem; color: var(--text-dim); margin-bottom: 1.5rem; }\n    .auth-input {\n      width: 100%;\n      background: #0d0e14;\n      border: 1px solid var(--card-border);\n      color: #fff;\n      padding: 0.75rem 1rem;\n      border-radius: 6px;\n      font-size: 1rem;\n      margin-bottom: 1rem;\n      outline: none;\n    }\n    .auth-input:focus { border-color: var(--primary); }\n    .auth-error { color: var(--danger); font-size: 0.85rem; margin-bottom: 1rem; }\n  </style>\n</head>\n<body>\n\n  <!-- Password Overlay -->\n  <div id=\"authOverlay\" class=\"auth-overlay\" style=\"display: none;\">\n    <div class=\"auth-card\">\n      <h2>Beveiligde Toegang</h2>\n      <p>Voer het admin-wachtwoord in om het KundiKamado Nederland Marktvalidatie Dashboard te openen.</p>\n      <input type=\"password\" id=\"adminPwd\" class=\"auth-input\" placeholder=\"Wachtwoord...\" autofocus>\n      <div id=\"authError\" class=\"auth-error\"></div>\n      <button id=\"authBtn\" class=\"btn\" style=\"width: 100%;\">Inloggen</button>\n    </div>\n  </div>\n\n  <!-- Dashboard Container -->\n  <div id=\"dashboardContent\">\n    <div class=\"header-bar\">\n      <div class=\"brand-area\">\n        <h1>KundiKamado Nederland</h1>\n        <span class=\"brand-tag\">Markt-Test Dashboard</span>\n      </div>\n      <div class=\"header-actions\">\n        <button id=\"refreshBtn\" class=\"btn btn-secondary\">🔄 Verversen</button>\n        <button id=\"exportIntentsBtn\" class=\"btn\">📥 Exporteer Aankoopintenties (CSV)</button>\n        <button id=\"logoutBtn\" class=\"btn btn-secondary\">Uitloggen</button>\n      </div>\n    </div>\n\n    <!-- KPI Summary Row -->\n    <div class=\"kpi-grid\">\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Bezoekers</div>\n        <div class=\"kpi-value\" id=\"kpiVisitors\">0</div>\n        <div class=\"kpi-sub\">Unieke sessies</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Winkelwagens</div>\n        <div class=\"kpi-value\" id=\"kpiCarts\">0</div>\n        <div class=\"kpi-sub\" id=\"kpiCartRate\">0% conversie</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Checkouts Gestart</div>\n        <div class=\"kpi-value\" id=\"kpiCheckouts\">0</div>\n        <div class=\"kpi-sub\" id=\"kpiCheckoutRate\">0% conversie</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Aankoopintenties</div>\n        <div class=\"kpi-value\" id=\"kpiIntents\" style=\"color: var(--primary);\">0</div>\n        <div class=\"kpi-sub\" id=\"kpiIntentRate\">0% overall conversie</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Hypothetische Omzet</div>\n        <div class=\"kpi-value\" id=\"kpiRevenue\" style=\"color: var(--success);\">€0,-</div>\n        <div class=\"kpi-sub\" id=\"kpiAov\">Gem. order: €0,-</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Kamado Stuks</div>\n        <div class=\"kpi-value\" id=\"kpiKamadoUnits\">0</div>\n        <div class=\"kpi-sub\">Gevraagde units</div>\n      </div>\n      <div class=\"kpi-card\">\n        <div class=\"kpi-label\">Verlaten Carts</div>\n        <div class=\"kpi-value\" id=\"kpiAbandoned\">0</div>\n        <div class=\"kpi-sub\" id=\"kpiLostRevenue\">€0,- potentieel verlies</div>\n      </div>\n    </div>\n\n    <!-- Conversion Funnel Section -->\n    <div class=\"section-box\">\n      <div class=\"section-title\">\n        <span>Trechter Conversie (Funnel Visualizer)</span>\n        <small style=\"color: var(--text-dim); font-size: 0.85rem;\">Nederlandse vraagvalidatie ~1 maand</small>\n      </div>\n      <div class=\"funnel-container\">\n        <div class=\"funnel-step\">\n          <div class=\"step-name\">1. Bezoeker</div>\n          <div class=\"step-count\" id=\"funnelStep1\">0</div>\n          <div class=\"step-rate\">100%</div>\n          <div class=\"step-dropoff\">-</div>\n        </div>\n        <div class=\"funnel-step\">\n          <div class=\"step-name\">2. In Winkelwagen</div>\n          <div class=\"step-count\" id=\"funnelStep2\">0</div>\n          <div class=\"step-rate\" id=\"funnelRate2\">0%</div>\n          <div class=\"step-dropoff\" id=\"funnelDrop2\">-0% drop-off</div>\n        </div>\n        <div class=\"funnel-step\">\n          <div class=\"step-name\">3. Naar Kassa</div>\n          <div class=\"step-count\" id=\"funnelStep3\">0</div>\n          <div class=\"step-rate\" id=\"funnelRate3\">0%</div>\n          <div class=\"step-dropoff\" id=\"funnelDrop3\">-0% drop-off</div>\n        </div>\n        <div class=\"funnel-step intent\">\n          <div class=\"step-name\">4. Aankoopintentie</div>\n          <div class=\"step-count\" id=\"funnelStep4\">0</div>\n          <div class=\"step-rate\" id=\"funnelRate4\">0%</div>\n          <div class=\"step-dropoff\" id=\"funnelDrop4\">-0% drop-off</div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Popularity Breakdown -->\n    <div class=\"two-cols\">\n      <!-- Kamado Model / Size Popularity -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">Kamado Formaten Populariteit</div>\n        <table class=\"data-table\" id=\"modelsTable\">\n          <thead>\n            <tr>\n              <th>Formaat</th>\n              <th>Prijs</th>\n              <th>Aantal Intenties</th>\n              <th>Aandeel</th>\n              <th>Hypothetische Omzet</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Color & Finish Popularity -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">Kleuren & Afwerking Populariteit</div>\n        <table class=\"data-table\" id=\"colorsTable\">\n          <thead>\n            <tr>\n              <th>Kleur / Afwerking</th>\n              <th>Aantal Gekozen</th>\n              <th>Aandeel</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <div class=\"two-cols\">\n      <!-- Accessories Popularity & Attachment Rate -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">Accessoires Attachment Rate</div>\n        <table class=\"data-table\" id=\"accessoriesTable\">\n          <thead>\n            <tr>\n              <th>Accessoire</th>\n              <th>Aantal Verkocht</th>\n              <th>Attach Rate</th>\n              <th>Hypothetische Waarde</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Top Combinations Matrix -->\n      <div class=\"section-box\">\n        <div class=\"section-title\">Populairste Combinaties</div>\n        <table class=\"data-table\" id=\"combinationsTable\">\n          <thead>\n            <tr>\n              <th>Combinatie (Model + Kleur + Accessoires)</th>\n              <th>Aantal</th>\n              <th>Totale Waarde</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n\n    <!-- Daily / Weekly Timeline -->\n    <div class=\"section-box\">\n      <div class=\"section-title\">Dagelijkse & Wekelijkse Statistieken</div>\n      <table class=\"data-table\" id=\"timelineTable\">\n        <thead>\n          <tr>\n            <th>Datum</th>\n            <th>Bezoekers</th>\n            <th>Winkelwagens</th>\n            <th>Checkouts</th>\n            <th>Aankoopintenties</th>\n            <th>Conversie</th>\n            <th>Hypothetische Omzet</th>\n          </tr>\n        </thead>\n        <tbody>\n          <!-- Populated dynamically -->\n        </tbody>\n      </table>\n    </div>\n\n    <!-- Detailed Leads & Abandoned Feed -->\n    <div class=\"section-box\">\n      <div class=\"tab-bar\">\n        <button class=\"tab-btn active\" id=\"tabIntentsBtn\">Aankoopintenties (Leads)</button>\n        <button class=\"tab-btn\" id=\"tabAbandonedBtn\">Verlaten Winkelwagens</button>\n      </div>\n\n      <!-- Tab: Intents -->\n      <div id=\"tabIntentsContent\">\n        <table class=\"data-table\" id=\"intentsDetailTable\">\n          <thead>\n            <tr>\n              <th>Tijdstip</th>\n              <th>Klant</th>\n              <th>Woonplaats</th>\n              <th>Model & Formaat</th>\n              <th>Kleur & Afwerking</th>\n              <th>Accessoires</th>\n              <th>Totaalwaarde</th>\n              <th>Betaalintentie</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Tab: Abandoned -->\n      <div id=\"tabAbandonedContent\" style=\"display: none;\">\n        <table class=\"data-table\" id=\"abandonedDetailTable\">\n          <thead>\n            <tr>\n              <th>Laatste Activiteit</th>\n              <th>Sessie ID</th>\n              <th>Laatste Stap</th>\n              <th>Klant Contact</th>\n              <th>Gekozen Artikelen</th>\n              <th>Verlaten Bedrag</th>\n            </tr>\n          </thead>\n          <tbody>\n            <!-- Populated dynamically -->\n          </tbody>\n        </table>\n      </div>\n    </div>\n  </div>\n\n  <script src=\"/admin-test.js\"></script>\n</body>\n</html>\n";
const ADMIN_JS_CONTENT = "/**\n * KundiKamado Netherlands - Market Test Admin Dashboard Logic\n */\n\n(function() {\n  'use strict';\n\n  let adminToken = sessionStorage.getItem('kk_nl_admin_token') || '';\n\n  function formatEur(amount) {\n    return '€' + Number(amount || 0).toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ',-';\n  }\n\n  function formatPct(val) {\n    return (Number(val || 0) * 100).toFixed(1) + '%';\n  }\n\n  function formatDate(isoStr) {\n    if (!isoStr) return '-';\n    try {\n      const d = new Date(isoStr);\n      return d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });\n    } catch (e) {\n      return isoStr;\n    }\n  }\n\n  // --- AUTH CHECK ---\n  function showAuthOverlay() {\n    document.getElementById('authOverlay').style.display = 'flex';\n    document.getElementById('dashboardContent').style.display = 'none';\n  }\n\n  function hideAuthOverlay() {\n    document.getElementById('authOverlay').style.display = 'none';\n    document.getElementById('dashboardContent').style.display = 'block';\n  }\n\n  async function loadDashboardData() {\n    if (!adminToken) {\n      showAuthOverlay();\n      return;\n    }\n\n    try {\n      const resp = await fetch('/api/market-test/stats', {\n        headers: { 'Authorization': 'Bearer ' + adminToken }\n      });\n\n      if (resp.status === 401) {\n        sessionStorage.removeItem('kk_nl_admin_token');\n        adminToken = '';\n        showAuthOverlay();\n        document.getElementById('authError').textContent = 'Ongeldig wachtwoord.';\n        return;\n      }\n\n      if (!resp.ok) {\n        throw new Error('Fout bij ophalen statistieken.');\n      }\n\n      const data = await resp.json();\n      hideAuthOverlay();\n      renderDashboard(data);\n    } catch (err) {\n      console.error('Error loading dashboard:', err);\n      alert('Kon marktstatistieken niet inladen: ' + err.message);\n    }\n  }\n\n  function renderDashboard(data) {\n    const { overview, funnel, models, colors, accessories, combinations, timeline, intents, abandoned } = data;\n\n    // 1. KPI Cards\n    document.getElementById('kpiVisitors').textContent = overview.totalVisitors.toLocaleString('nl-NL');\n    document.getElementById('kpiCarts').textContent = overview.totalCarts.toLocaleString('nl-NL');\n    document.getElementById('kpiCartRate').textContent = `${formatPct(overview.cartConversionRate)} van bezoekers`;\n\n    document.getElementById('kpiCheckouts').textContent = overview.totalCheckouts.toLocaleString('nl-NL');\n    document.getElementById('kpiCheckoutRate').textContent = `${formatPct(overview.checkoutConversionRate)} van bezoekers`;\n\n    document.getElementById('kpiIntents').textContent = overview.totalIntents.toLocaleString('nl-NL');\n    document.getElementById('kpiIntentRate').textContent = `${formatPct(overview.overallConversionRate)} overall conversie`;\n\n    document.getElementById('kpiRevenue').textContent = formatEur(overview.hypotheticalRevenue);\n    document.getElementById('kpiAov').textContent = `Gem. order: ${formatEur(overview.averageOrderValue)}`;\n\n    document.getElementById('kpiKamadoUnits').textContent = overview.totalKamadoUnits.toLocaleString('nl-NL');\n\n    document.getElementById('kpiAbandoned').textContent = overview.totalAbandoned.toLocaleString('nl-NL');\n    document.getElementById('kpiLostRevenue').textContent = `${formatEur(overview.lostRevenue)} potentieel verlies`;\n\n    // 2. Funnel Visualizer\n    document.getElementById('funnelStep1').textContent = funnel.visitors;\n    document.getElementById('funnelStep2').textContent = funnel.carts;\n    document.getElementById('funnelRate2').textContent = formatPct(funnel.cartRate);\n    document.getElementById('funnelDrop2').textContent = `-${formatPct(funnel.cartDropoff)} drop-off`;\n\n    document.getElementById('funnelStep3').textContent = funnel.checkouts;\n    document.getElementById('funnelRate3').textContent = formatPct(funnel.checkoutRate);\n    document.getElementById('funnelDrop3').textContent = `-${formatPct(funnel.checkoutDropoff)} drop-off`;\n\n    document.getElementById('funnelStep4').textContent = funnel.intents;\n    document.getElementById('funnelRate4').textContent = formatPct(funnel.intentRate);\n    document.getElementById('funnelDrop4').textContent = `-${formatPct(funnel.intentDropoff)} drop-off`;\n\n    // 3. Models Table\n    const modelsTbody = document.querySelector('#modelsTable tbody');\n    modelsTbody.innerHTML = '';\n    models.forEach(m => {\n      const tr = document.createElement('tr');\n      tr.innerHTML = `\n        <td><strong>KundiKamado ${m.size}″</strong></td>\n        <td>${formatEur(m.price)}</td>\n        <td><span class=\"badge badge-primary\">${m.count} stuks</span></td>\n        <td>${formatPct(m.share)}</td>\n        <td><strong>${formatEur(m.revenue)}</strong></td>\n      `;\n      modelsTbody.appendChild(tr);\n    });\n\n    // 4. Colors Table\n    const colorsTbody = document.querySelector('#colorsTable tbody');\n    colorsTbody.innerHTML = '';\n    colors.forEach(c => {\n      const tr = document.createElement('tr');\n      tr.innerHTML = `\n        <td><strong>${c.name}</strong></td>\n        <td>${c.count} gekozen</td>\n        <td>${formatPct(c.share)}</td>\n      `;\n      colorsTbody.appendChild(tr);\n    });\n\n    // 5. Accessories Attachment Table\n    const accTbody = document.querySelector('#accessoriesTable tbody');\n    accTbody.innerHTML = '';\n    accessories.forEach(a => {\n      const tr = document.createElement('tr');\n      tr.innerHTML = `\n        <td><strong>${a.name}</strong></td>\n        <td>${a.count}x</td>\n        <td><span class=\"badge badge-success\">${formatPct(a.attachRate)}</span></td>\n        <td>${formatEur(a.revenue)}</td>\n      `;\n      accTbody.appendChild(tr);\n    });\n\n    // 6. Top Combinations Table\n    const combTbody = document.querySelector('#combinationsTable tbody');\n    combTbody.innerHTML = '';\n    combinations.forEach(cb => {\n      const tr = document.createElement('tr');\n      tr.innerHTML = `\n        <td>${cb.description}</td>\n        <td><span class=\"badge badge-primary\">${cb.count}x</span></td>\n        <td><strong>${formatEur(cb.totalValue)}</strong></td>\n      `;\n      combTbody.appendChild(tr);\n    });\n\n    // 7. Timeline Table\n    const timeTbody = document.querySelector('#timelineTable tbody');\n    timeTbody.innerHTML = '';\n    timeline.forEach(t => {\n      const tr = document.createElement('tr');\n      tr.innerHTML = `\n        <td><strong>${t.date}</strong></td>\n        <td>${t.visitors}</td>\n        <td>${t.carts}</td>\n        <td>${t.checkouts}</td>\n        <td><span class=\"badge badge-primary\">${t.intents}</span></td>\n        <td>${formatPct(t.conversionRate)}</td>\n        <td><strong>${formatEur(t.revenue)}</strong></td>\n      `;\n      timeTbody.appendChild(tr);\n    });\n\n    // 8. Detailed Intents Feed\n    const intentsTbody = document.querySelector('#intentsDetailTable tbody');\n    intentsTbody.innerHTML = '';\n    intents.forEach(item => {\n      const tr = document.createElement('tr');\n      let accStr = '-';\n      try {\n        const accArr = JSON.parse(item.accessories_json || '[]');\n        if (accArr.length) accStr = accArr.map(a => `${a.qty}x ${a.name}`).join(', ');\n      } catch (e) {}\n\n      tr.innerHTML = `\n        <td><small>${formatDate(item.created_at)}</small></td>\n        <td>\n          <strong>${item.name}</strong><br>\n          <small style=\"color: var(--text-dim);\">${item.email}<br>${item.phone}</small>\n        </td>\n        <td>${item.city} (${item.postal_code})</td>\n        <td><strong>${item.size_inch}″ Kamado</strong></td>\n        <td>${item.color_name}<br><small style=\"color: var(--text-dim);\">${item.texture}</small></td>\n        <td><small>${accStr}</small></td>\n        <td><strong style=\"color: var(--primary);\">${formatEur(item.total_amount_eur)}</strong></td>\n        <td><span class=\"badge badge-success\">${(item.payment_method_intent || 'ideal').toUpperCase()}</span></td>\n      `;\n      intentsTbody.appendChild(tr);\n    });\n\n    // 9. Detailed Abandoned Feed\n    const abTbody = document.querySelector('#abandonedDetailTable tbody');\n    abTbody.innerHTML = '';\n    abandoned.forEach(item => {\n      const tr = document.createElement('tr');\n      let itemsSummary = '';\n      try {\n        const itemsArr = JSON.parse(item.items_json || '[]');\n        itemsSummary = itemsArr.map(i => `${i.qty}x ${i.name}`).join(', ');\n      } catch (e) {\n        itemsSummary = '-';\n      }\n\n      tr.innerHTML = `\n        <td><small>${formatDate(item.updated_at)}</small></td>\n        <td><code>${item.session_id.substring(0, 10)}...</code></td>\n        <td><span class=\"badge badge-warning\">${item.last_step.toUpperCase()}</span></td>\n        <td>${item.email || '<em style=\"color: var(--text-dim);\">Onbekend</em>'}</td>\n        <td><small>${itemsSummary}</small></td>\n        <td><strong>${formatEur(item.total_amount_eur)}</strong></td>\n      `;\n      abTbody.appendChild(tr);\n    });\n  }\n\n  // --- EVENTS ---\n  document.addEventListener('DOMContentLoaded', () => {\n    // Auth login click\n    document.getElementById('authBtn').addEventListener('click', () => {\n      const pwd = document.getElementById('adminPwd').value;\n      if (!pwd) return;\n      adminToken = pwd;\n      sessionStorage.setItem('kk_nl_admin_token', pwd);\n      loadDashboardData();\n    });\n\n    document.getElementById('adminPwd').addEventListener('keydown', (e) => {\n      if (e.key === 'Enter') {\n        document.getElementById('authBtn').click();\n      }\n    });\n\n    // Logout\n    document.getElementById('logoutBtn').addEventListener('click', () => {\n      sessionStorage.removeItem('kk_nl_admin_token');\n      adminToken = '';\n      showAuthOverlay();\n    });\n\n    // Refresh\n    document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);\n\n    // CSV Export\n    document.getElementById('exportIntentsBtn').addEventListener('click', () => {\n      window.location.href = '/api/market-test/export-intents.csv?token=' + encodeURIComponent(adminToken);\n    });\n\n    // Tabs\n    const tabIntentsBtn = document.getElementById('tabIntentsBtn');\n    const tabAbandonedBtn = document.getElementById('tabAbandonedBtn');\n    const tabIntentsContent = document.getElementById('tabIntentsContent');\n    const tabAbandonedContent = document.getElementById('tabAbandonedContent');\n\n    tabIntentsBtn.addEventListener('click', () => {\n      tabIntentsBtn.classList.add('active');\n      tabAbandonedBtn.classList.remove('active');\n      tabIntentsContent.style.display = 'block';\n      tabAbandonedContent.style.display = 'none';\n    });\n\n    tabAbandonedBtn.addEventListener('click', () => {\n      tabAbandonedBtn.classList.add('active');\n      tabIntentsBtn.classList.remove('active');\n      tabIntentsContent.style.display = 'none';\n      tabAbandonedContent.style.display = 'block';\n    });\n\n    // Initial load\n    loadDashboardData();\n  });\n\n})();\n";

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
 */

async function sendPurchaseIntentNotification(env, intent) {
  const recipient = env.NOTIFY_EMAIL || 'info@kundikamado.hu';
  const totalFormatted = '€' + Number(intent.totalAmountEur || 0).toLocaleString('nl-NL') + ',-';

  let itemsHtml = (intent.items || []).map(item => {
    let meta = '';
    if (item.type === 'kamado') {
      meta = `<br><small style="color: #666;">Kleur: ${item.colorName || item.colorId} | Afwerking: ${item.textureName || item.textureId}</small>`;
    } else if (item.sizeInch) {
      meta = `<br><small style="color: #666;">Geschikt voor: ${item.sizeInch}″ Kamado</small>`;
    }
    return `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${item.qty}x</strong> ${item.name}${meta}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${Number(item.price * item.qty).toLocaleString('nl-NL')},-</td>
    </tr>`;
  }).join('');

  const subject = `🔥 Nieuwe Aankoopintentie (NL Markt-Test): ${intent.sizeInch}″ Kamado - ${totalFormatted} van ${intent.customer.name}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.5;">
      <div style="background-color: #0c0d10; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="color: #ff6b35; margin: 0;">KundiKamado Nederland</h2>
        <p style="color: #aaa; margin: 5px 0 0 0; font-size: 14px;">Nieuwe Aankoopintentie Geregistreerd (Marktvalidatie)</p>
      </div>

      <div style="padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px; background: #fafafa;">
        <div style="background: #fff; padding: 16px; border-radius: 6px; border-left: 4px solid #ff6b35; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #222;">Klantgegevens (Nederland)</h3>
          <p style="margin: 4px 0;"><strong>Naam:</strong> ${intent.customer.name}</p>
          <p style="margin: 4px 0;"><strong>E-mail:</strong> <a href="mailto:${intent.customer.email}">${intent.customer.email}</a></p>
          <p style="margin: 4px 0;"><strong>Telefoon:</strong> <a href="tel:${intent.customer.phone}">${intent.customer.phone}</a></p>
          <p style="margin: 4px 0;"><strong>Adres:</strong> ${intent.customer.street} ${intent.customer.houseNumber}, ${intent.customer.postalCode} ${intent.customer.city} (NL)</p>
          <p style="margin: 4px 0;"><strong>Gekozen Betaalmethode:</strong> ${(intent.paymentMethod || 'iDEAL').toUpperCase()}</p>
        </div>

        <h3 style="color: #222; margin-bottom: 10px;">Geselecteerde Configuratie & Artikelen</h3>
        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f0f0f0;">
              <th style="padding: 8px; text-align: left;">Artikel</th>
              <th style="padding: 8px; text-align: right;">Prijs</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td style="padding: 12px 8px; font-weight: bold; border-top: 2px solid #ddd;">Totaalbedrag (Hypothetisch):</td>
              <td style="padding: 12px 8px; font-weight: bold; text-align: right; border-top: 2px solid #ddd; color: #ff6b35; font-size: 16px;">${totalFormatted}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 12px; border-radius: 6px; font-size: 13px; color: #3730a3;">
          ℹ️ <strong>Herinnering Markt-Test:</strong> De klant heeft te zien gekregen dat het product binnenkort beschikbaar is in Nederland en dat er niets in rekening is gebracht. Deze lead is opgeslagen in het admin dashboard onder <code>/admin/market-test</code>.
        </div>
      </div>
    </div>
  `;

  // 1. Try internal/configured mail sender service
  const mailSenderUrl = env.MAIL_SENDER_URL || 'https://mail-sender.ferkomes.workers.dev';
  try {
    const res = await fetch(mailSenderUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipient,
        subject: subject,
        html: htmlBody,
        text: `Nieuwe aankoopintentie van ${intent.customer.name} (${intent.customer.email}): ${intent.sizeInch}″ Kamado - Totaal: ${totalFormatted}`
      })
    });
    if (res.ok) {
      return { success: true, method: 'mail-sender' };
    }
  } catch (err) {
    console.warn('Mail-sender service error:', err);
  }

  // 2. Fallback: MailChannels API (Cloudflare Worker standard)
  try {
    const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipient, name: 'KundiKamado Admin' }] }],
        from: { email: 'noreply@kundikamado.nl', name: 'KundiKamado NL Demand Test' },
        subject: subject,
        content: [{ type: 'text/html', value: htmlBody }]
      })
    });
    if (mcRes.ok) {
      return { success: true, method: 'mailchannels' };
    }
  } catch (err) {
    console.warn('MailChannels fallback error:', err);
  }

  return { success: false, error: 'Could not deliver email via configured gateways' };
}



/**
 * Market Test Tracking, D1 Database Storage, and Metrics Aggregator
 */



async function ensureTables(db) {
  if (!db) return;
  // Safety idempotent creation
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_sessions (
      session_id TEXT PRIMARY KEY,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      created_at TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      reached_cart INTEGER DEFAULT 0,
      reached_checkout INTEGER DEFAULT 0,
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
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      street TEXT NOT NULL,
      house_number TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT DEFAULT 'NL',
      payment_method_intent TEXT,
      model_id TEXT,
      size_inch TEXT,
      color_id TEXT,
      color_name TEXT,
      texture TEXT,
      items_json TEXT NOT NULL,
      accessories_json TEXT,
      subtotal_eur REAL NOT NULL,
      shipping_fee_eur REAL NOT NULL DEFAULT 0,
      total_amount_eur REAL NOT NULL,
      customer_notes TEXT,
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
      phone TEXT,
      items_json TEXT NOT NULL,
      total_amount_eur REAL NOT NULL,
      last_step TEXT NOT NULL DEFAULT 'cart',
      converted_to_intent INTEGER DEFAULT 0
    );
  `).run();
}

async function trackEvent(db, { sessionId, eventType, payload = {}, ip = '', userAgent = '', referer = '' }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  // 1. Session upsert
  const reachedCart = eventType === 'add_to_cart' || eventType === 'open_cart' ? 1 : 0;
  const reachedCheckout = eventType === 'checkout_start' ? 1 : 0;
  const reachedIntent = eventType === 'purchase_intent' ? 1 : 0;

  await db.prepare(`
    INSERT INTO market_sessions (session_id, ip_hash, user_agent, referer, created_at, last_active_at, reached_cart, reached_checkout, reached_intent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      last_active_at = excluded.last_active_at,
      reached_cart = MAX(market_sessions.reached_cart, excluded.reached_cart),
      reached_checkout = MAX(market_sessions.reached_checkout, excluded.reached_checkout),
      reached_intent = MAX(market_sessions.reached_intent, excluded.reached_intent)
  `).bind(sessionId, ip, userAgent, referer, now, now, reachedCart, reachedCheckout, reachedIntent).run();

  // 2. Record individual event
  await db.prepare(`
    INSERT INTO market_events (session_id, event_type, payload_json, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, eventType, JSON.stringify(payload), now).run();
}

async function updateCart(db, { sessionId, items = [], totalAmount = 0, lastStep = 'cart', email = null, name = null, phone = null }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const isCheckout = lastStep === 'checkout';

  // Mark session reached flags
  await db.prepare(`
    UPDATE market_sessions
    SET last_active_at = ?,
        reached_cart = 1,
        reached_checkout = CASE WHEN ? = 1 THEN 1 ELSE reached_checkout END
    WHERE session_id = ?
  `).bind(now, isCheckout ? 1 : 0, sessionId).run();

  // Upsert into abandoned_carts
  if (items && items.length > 0) {
    await db.prepare(`
      INSERT INTO abandoned_carts (session_id, updated_at, email, name, phone, items_json, total_amount_eur, last_step, converted_to_intent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(session_id) DO UPDATE SET
        updated_at = excluded.updated_at,
        email = COALESCE(excluded.email, abandoned_carts.email),
        name = COALESCE(excluded.name, abandoned_carts.name),
        phone = COALESCE(excluded.phone, abandoned_carts.phone),
        items_json = excluded.items_json,
        total_amount_eur = excluded.total_amount_eur,
        last_step = excluded.last_step
      WHERE abandoned_carts.converted_to_intent = 0
    `).bind(sessionId, now, email, name, phone, JSON.stringify(items), totalAmount, lastStep).run();
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

  // 1. Insert into purchase_intents
  await db.prepare(`
    INSERT INTO purchase_intents (
      id, session_id, created_at, email, name, phone,
      street, house_number, postal_code, city, country,
      payment_method_intent, model_id, size_inch, color_id, color_name, texture,
      items_json, accessories_json, subtotal_eur, shipping_fee_eur, total_amount_eur,
      customer_notes, notification_sent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, 0
    )
  `).bind(
    intentId,
    intentData.sessionId,
    now,
    cust.email || '',
    cust.name || '',
    cust.phone || '',
    cust.street || '',
    cust.houseNumber || '',
    cust.postalCode || '',
    cust.city || '',
    cust.country || 'NL',
    intentData.paymentMethod || 'ideal',
    intentData.modelId || '',
    intentData.sizeInch || '',
    intentData.colorId || '',
    intentData.colorName || '',
    intentData.texture || '',
    JSON.stringify(items),
    JSON.stringify(accessories),
    intentData.subtotalEur || intentData.totalAmountEur || 0,
    intentData.shippingFeeEur || 0,
    intentData.totalAmountEur || 0,
    intentData.notes || ''
  ).run();

  // 2. Update session flags
  await db.prepare(`
    UPDATE market_sessions
    SET reached_cart = 1,
        reached_checkout = 1,
        reached_intent = 1,
        last_active_at = ?
    WHERE session_id = ?
  `).bind(now, intentData.sessionId).run();

  // 3. Mark abandoned cart converted
  await db.prepare(`
    UPDATE abandoned_carts
    SET converted_to_intent = 1,
        email = ?,
        name = ?,
        phone = ?
    WHERE session_id = ?
  `).bind(cust.email, cust.name, cust.phone, intentData.sessionId).run();

  // 4. Send email notification asynchronously
  try {
    const notifyResult = await sendPurchaseIntentNotification(env, {
      id: intentId,
      ...intentData
    });
    if (notifyResult.success) {
      await db.prepare(`UPDATE purchase_intents SET notification_sent = 1 WHERE id = ?`).bind(intentId).run();
    }
  } catch (err) {
    console.error('Failed to notify owner for intent:', err);
    await db.prepare(`UPDATE purchase_intents SET notification_error = ? WHERE id = ?`).bind(err.message, intentId).run();
  }

  return { ok: true, intentId };
}

async function getMarketStats(db) {
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  // 1. Session & Funnel counts
  const sessionRow = await db.prepare(`
    SELECT
      COUNT(*) AS total_visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) AS total_carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) AS total_checkouts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) AS total_intents
    FROM market_sessions
  `).first() || {};

  const totalVisitors = Number(sessionRow.total_visitors || 0);
  const totalCarts = Number(sessionRow.total_carts || 0);
  const totalCheckouts = Number(sessionRow.total_checkouts || 0);
  const totalIntents = Number(sessionRow.total_intents || 0);

  // Funnel calculations
  const cartRate = totalVisitors > 0 ? totalCarts / totalVisitors : 0;
  const cartDropoff = totalVisitors > 0 ? (totalVisitors - totalCarts) / totalVisitors : 0;

  const checkoutRate = totalCarts > 0 ? totalCheckouts / totalCarts : 0;
  const checkoutDropoff = totalCarts > 0 ? (totalCarts - totalCheckouts) / totalCarts : 0;

  const intentRate = totalCheckouts > 0 ? totalIntents / totalCheckouts : 0;
  const intentDropoff = totalCheckouts > 0 ? (totalCheckouts - totalIntents) / totalCheckouts : 0;

  const overallConversionRate = totalVisitors > 0 ? totalIntents / totalVisitors : 0;

  // 2. Revenue & Units from purchase_intents
  const revRow = await db.prepare(`
    SELECT
      COUNT(*) AS intent_count,
      COALESCE(SUM(total_amount_eur), 0) AS total_revenue
    FROM purchase_intents
  `).first() || {};

  const hypotheticalRevenue = Number(revRow.total_revenue || 0);
  const intentCount = Number(revRow.intent_count || 0);
  const averageOrderValue = intentCount > 0 ? hypotheticalRevenue / intentCount : 0;

  // 3. Abandoned carts
  const abRow = await db.prepare(`
    SELECT
      COUNT(*) AS ab_count,
      COALESCE(SUM(total_amount_eur), 0) AS lost_revenue
    FROM abandoned_carts
    WHERE converted_to_intent = 0
  `).first() || {};

  const totalAbandoned = Number(abRow.ab_count || 0);
  const lostRevenue = Number(abRow.lost_revenue || 0);

  // 4. Model / Size breakdown
  const modelStats = [
    { size: '18', price: 699, count: 0, revenue: 0, share: 0 },
    { size: '21', price: 889, count: 0, revenue: 0, share: 0 },
    { size: '23', price: 1019, count: 0, revenue: 0, share: 0 },
    { size: '27', price: 1319, count: 0, revenue: 0, share: 0 }
  ];

  const modelRows = await db.prepare(`
    SELECT size_inch, COUNT(*) as cnt
    FROM purchase_intents
    WHERE size_inch IS NOT NULL AND size_inch != ''
    GROUP BY size_inch
  `).all();

  let totalKamadoUnits = 0;
  (modelRows.results || []).forEach(r => {
    const found = modelStats.find(m => m.size === String(r.size_inch));
    if (found) {
      found.count = Number(r.cnt);
      found.revenue = found.count * found.price;
      totalKamadoUnits += found.count;
    }
  });

  modelStats.forEach(m => {
    m.share = totalKamadoUnits > 0 ? m.count / totalKamadoUnits : 0;
  });

  // 5. Colors & Finish breakdown
  const colorRows = await db.prepare(`
    SELECT color_name, texture, COUNT(*) as cnt
    FROM purchase_intents
    WHERE color_name IS NOT NULL AND color_name != ''
    GROUP BY color_name, texture
    ORDER BY cnt DESC
  `).all();

  const colors = (colorRows.results || []).map(r => ({
    name: `${r.color_name} (${r.texture})`,
    count: Number(r.cnt),
    share: totalKamadoUnits > 0 ? Number(r.cnt) / totalKamadoUnits : 0
  }));

  // 6. Accessories attachment stats
  const allIntents = await db.prepare(`SELECT items_json, accessories_json, size_inch FROM purchase_intents`).all();
  const accMap = new Map();

  (allIntents.results || []).forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      items.forEach(item => {
        if (item.type === 'accessory') {
          const accKey = item.name;
          const current = accMap.get(accKey) || { name: accKey, count: 0, revenue: 0 };
          current.count += item.qty || 1;
          current.revenue += (item.price || 0) * (item.qty || 1);
          accMap.set(accKey, current);
        }
      });
    } catch (e) {}
  });

  const accessories = Array.from(accMap.values()).map(a => ({
    ...a,
    attachRate: totalKamadoUnits > 0 ? a.count / totalKamadoUnits : 0
  })).sort((a, b) => b.count - a.count);

  // 7. Combinations matrix
  const combMap = new Map();
  (allIntents.results || []).forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      const kamado = items.find(i => i.type === 'kamado');
      if (kamado) {
        const accNames = items.filter(i => i.type === 'accessory').map(i => i.name).sort().join(' + ');
        const combKey = `${kamado.sizeInch}″ (${kamado.colorName} / ${kamado.textureName})` + (accNames ? ` + ${accNames}` : ' (Alleen Kamado)');
        const curr = combMap.get(combKey) || { description: combKey, count: 0, totalValue: 0 };
        curr.count += 1;
        curr.totalValue += items.reduce((s, i) => s + (i.price * i.qty), 0);
        combMap.set(combKey, curr);
      }
    } catch (e) {}
  });

  const combinations = Array.from(combMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // 8. Timeline (Daily)
  const timelineRows = await db.prepare(`
    SELECT
      substr(created_at, 1, 10) as day,
      COUNT(DISTINCT session_id) as visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) as carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) as checkouts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) as intents
    FROM market_sessions
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30
  `).all();

  // Join day revenue from purchase_intents
  const dailyRevRows = await db.prepare(`
    SELECT substr(created_at, 1, 10) as day, SUM(total_amount_eur) as rev
    FROM purchase_intents
    GROUP BY day
  `).all();
  const dailyRevMap = new Map((dailyRevRows.results || []).map(r => [r.day, Number(r.rev)]));

  const timeline = (timelineRows.results || []).map(t => {
    const v = Number(t.visitors || 0);
    const i = Number(t.intents || 0);
    return {
      date: t.day,
      visitors: v,
      carts: Number(t.carts || 0),
      checkouts: Number(t.checkouts || 0),
      intents: i,
      conversionRate: v > 0 ? i / v : 0,
      revenue: dailyRevMap.get(t.day) || 0
    };
  });

  // 9. Recent Intents (up to 50)
  const recentIntents = await db.prepare(`
    SELECT * FROM purchase_intents ORDER BY created_at DESC LIMIT 50
  `).all();

  // 10. Recent Abandoned (up to 50)
  const recentAbandoned = await db.prepare(`
    SELECT * FROM abandoned_carts WHERE converted_to_intent = 0 ORDER BY updated_at DESC LIMIT 50
  `).all();

  return {
    overview: {
      totalVisitors,
      totalCarts,
      cartConversionRate: cartRate,
      totalCheckouts,
      checkoutConversionRate: checkoutRate,
      totalIntents,
      overallConversionRate,
      hypotheticalRevenue,
      averageOrderValue,
      totalKamadoUnits,
      totalAbandoned,
      lostRevenue
    },
    funnel: {
      visitors: totalVisitors,
      carts: totalCarts,
      cartRate,
      cartDropoff,
      checkouts: totalCheckouts,
      checkoutRate,
      checkoutDropoff,
      intents: totalIntents,
      intentRate,
      intentDropoff
    },
    models: modelStats,
    colors,
    accessories,
    combinations,
    timeline,
    intents: recentIntents.results || [],
    abandoned: recentAbandoned.results || []
  };
}

async function exportIntentsCsv(db) {
  if (!db) return '';
  await ensureTables(db);
  const rows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();

  const headers = [
    'ID', 'Aangemaakt Op', 'Naam', 'E-mail', 'Telefoon', 'Straat', 'Huisnummer',
    'Postcode', 'Woonplaats', 'Land', 'Betaalmethode', 'Model Formaat', 'Kleur',
    'Afwerking', 'Accessoires', 'Totaal EUR', 'Melding Verzonden'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [headers.join(',')];

  (rows.results || []).forEach(r => {
    let accSummary = '';
    try {
      const accList = JSON.parse(r.accessories_json || '[]');
      accSummary = accList.map(a => `${a.qty}x ${a.name}`).join('; ');
    } catch (e) {}

    lines.push([
      escapeCsv(r.id),
      escapeCsv(r.created_at),
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.street),
      escapeCsv(r.house_number),
      escapeCsv(r.postal_code),
      escapeCsv(r.city),
      escapeCsv(r.country),
      escapeCsv(r.payment_method_intent),
      escapeCsv(r.size_inch ? `${r.size_inch} inch` : ''),
      escapeCsv(r.color_name),
      escapeCsv(r.texture),
      escapeCsv(accSummary),
      escapeCsv(r.total_amount_eur),
      escapeCsv(r.notification_sent ? 'Ja' : 'Nee')
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

    // 3. Asset & Image Serving (R2 with proxy fallback)
    if (pathname.startsWith('/assets/') || pathname.startsWith('/images/')) {
      let r2Key = pathname.replace(/^\/(assets|images)\//, '');
      if (r2Key.startsWith('/')) r2Key = r2Key.substring(1);

      // Try R2 bucket binding ASSETS if bound
      if (env && env.ASSETS && typeof env.ASSETS.get === 'function') {
        try {
          const object = await env.ASSETS.get(r2Key);
          if (object) {
            const ext = r2Key.split('.').pop().toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set('Content-Type', contentType);
            headers.set('Access-Control-Allow-Origin', '*');
            headers.set('Cache-Control', 'public, max-age=31536000, immutable');
            return new Response(object.body, { headers });
          }
        } catch (r2Err) {
          console.warn('R2 read error:', r2Key, r2Err);
        }
      }

      // Fallback: Proxy to active KundiKamado assets CDN
      try {
        const proxyUrl = 'https://kundikamado.ferkomes.workers.dev' + pathname;
        const proxyResp = await fetch(proxyUrl);
        if (proxyResp.ok) {
          const proxyHeaders = new Headers(proxyResp.headers);
          proxyHeaders.set('Access-Control-Allow-Origin', '*');
          proxyHeaders.set('Cache-Control', 'public, max-age=86400');
          return new Response(proxyResp.body, { status: 200, headers: proxyHeaders });
        }
      } catch (proxyErr) {
        console.warn('Asset proxy error:', proxyErr);
      }

      return new Response('Asset not found', { status: 404 });
    }

    // 4. API: Funnel Telemetry (POST /api/market-test/track)
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

    // 5. API: Cart Update / Abandoned Cart (POST /api/market-test/cart-update)
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

    // 6. API: Purchase Intent (POST /api/market-test/purchase-intent)
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

    // 7. API: Admin Market Stats (GET /api/market-test/stats)
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

    // 8. API: Export Intents CSV (GET /api/market-test/export-intents.csv)
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
