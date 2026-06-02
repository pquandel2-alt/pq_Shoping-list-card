class ShoppingListCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
    this._loading = true;
    this._inputValue = '';
    this._lastState = null;
    this._entity = 'todo.zuhause';
  }

  setConfig(config) {
    this._config = config || {};
    this._entity = config.entity || 'todo.zuhause';
  }

  set hass(hass) {
    this._hass = hass;
    const entityState = hass.states[this._entity];
    if (entityState && entityState.state !== this._lastState) {
      this._lastState = entityState.state;
      this._fetchItems();
    }
  }

  async _fetchItems() {
    if (!this._hass) return;
    try {
      const result = await this._hass.callWS({
        type: 'todo/item/list',
        entity_id: this._entity,
      });
      this._items = result.items || [];
      this._loading = false;
      this._render();
    } catch (e) {
      console.error('Shopping List Card Fehler:', e);
      this._loading = false;
      this._render();
    }
  }

  // -------------------------------------------------------
  // Kategorie-Zuordnung – hier kannst du Produkte ergänzen
  // -------------------------------------------------------
  _getCategory(itemName) {
    const name = itemName.toLowerCase().trim();
    // Mengenangaben entfernen: "2x", "500g", "1l" etc.
    const clean = name.replace(/^\d+[\s]*[xXgGkKlLmM]+[\s]*/i, '').trim();

    const categories = {
      'Obst & Gemüse': [
        'apfel', 'äpfel', 'birne', 'birnen', 'banane', 'bananen',
        'orange', 'orangen', 'zitrone', 'zitronen', 'erdbeere', 'erdbeeren',
        'traube', 'trauben', 'tomate', 'tomaten', 'gurke', 'gurken',
        'paprika', 'karotte', 'karotten', 'möhre', 'möhren', 'zwiebel',
        'zwiebeln', 'knoblauch', 'salat', 'spinat', 'brokkoli',
        'blumenkohl', 'zucchini', 'aubergine', 'lauch', 'sellerie',
        'avocado', 'mango', 'ananas', 'kiwi', 'pfirsich', 'kirsche',
        'kirschen', 'heidelbeere', 'heidelbeeren', 'himbeere', 'himbeeren',
        'melone', 'wassermelone', 'champignon', 'champignons', 'pilze',
        'kartoffel', 'kartoffeln', 'süßkartoffel', 'feldsalat', 'rucola',
        'petersilie', 'basilikum', 'schnittlauch', 'ingwer', 'chili',
      ],
      'Molkerei': [
        'milch', 'butter', 'sahne', 'joghurt', 'quark', 'käse',
        'parmesan', 'mozzarella', 'gouda', 'frischkäse', 'schmand',
        'crème fraîche', 'creme fraiche', 'ei', 'eier', 'margarine',
        'kefir', 'buttermilch', 'skyr', 'mascarpone', 'ricotta',
        'brie', 'camembert', 'emmentaler', 'gruyère', 'feta',
      ],
      'Backwaren': [
        'brot', 'brötchen', 'toast', 'baguette', 'laugenstange',
        'croissant', 'brezel', 'mehl', 'hefe', 'backpulver',
        'kuchen', 'torte', 'muffin', 'bagel', 'wrap', 'tortilla',
        'weißbrot', 'vollkornbrot', 'ciabatta', 'focaccia',
      ],
      'Fleisch & Fisch': [
        'hackfleisch', 'hähnchen', 'hühnchen', 'rind', 'rindfleisch',
        'schwein', 'schweinefleisch', 'steak', 'schnitzel', 'wurst',
        'salami', 'schinken', 'speck', 'lachs', 'thunfisch', 'garnelen',
        'fisch', 'forelle', 'kabeljau', 'putenbrust', 'pute', 'chorizo',
        'bratwurst', 'leberwurst', 'mortadella', 'prosciutto',
        'lammfleisch', 'lamm', 'hackbraten', 'fleisch',
      ],
      'Getränke': [
        'wasser', 'mineralwasser', 'sprudel', 'saft', 'orangensaft',
        'apfelsaft', 'cola', 'limonade', 'bier', 'wein', 'sekt',
        'kaffee', 'tee', 'smoothie', 'nektar', 'eistee', 'energy',
        'espresso', 'cappuccino', 'kakao', 'multivitamin',
      ],
      'Tiefkühl': [
        'tiefkühl', 'tk-', 'erbsen tk', 'spinat tk', 'pizza',
        'pommes', 'fischstäbchen', 'eis', 'eiscreme', 'sorbet',
        'frozen', 'tiefgefroren',
      ],
      'Vorrat': [
        'nudeln', 'pasta', 'spaghetti', 'penne', 'fusilli', 'reis',
        'couscous', 'linsen', 'bohnen', 'kichererbsen', 'dosentomaten',
        'tomatenmark', 'olivenöl', 'sonnenblumenöl', 'öl', 'essig',
        'salz', 'pfeffer', 'zucker', 'honig', 'marmelade', 'nutella',
        'müsli', 'haferflocken', 'cornflakes', 'chips', 'nüsse',
        'mandeln', 'walnüsse', 'cashews', 'schokolade', 'kekse',
        'cracker', 'senf', 'ketchup', 'mayonnaise', 'sojasoße',
        'gewürze', 'zimt', 'paprika gewürz', 'curry', 'kurkuma',
        'meersalz', 'brühe', 'bouillon', 'kokosmilch', 'dosengemüse',
        'linsen rot', 'quinoa', 'bulgur', 'polenta', 'paniermehl',
        'speisestärke', 'vanille', 'kakaopulver', 'pudding',
      ],
      'Haushalt': [
        'spülmittel', 'waschmittel', 'toilettenpapier', 'klopapier',
        'küchenrolle', 'müllbeutel', 'geschirrspültabs', 'reiniger',
        'seife', 'shampoo', 'duschgel', 'zahnpasta', 'deo', 'deodorant',
        'wattepads', 'rasierer', 'schwamm', 'putzmittel', 'spülbürste',
        'alufolie', 'frischhaltefolie', 'backpapier', 'zipbeutel',
        'wattestäbchen', 'feuchttücher', 'taschentücher', 'lappen',
        'handbürste', 'weichspüler', 'entkalker', 'rohrreiniger',
        'fleckenentferner', 'glasreiniger', 'badreiniger', 'spüler',
        'geschirrspüler', 'tabs', 'capsules', 'bodymilk', 'lotion',
        'creme', 'lippenpflege', 'zahnbürste', 'mundspülung',
      ],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (clean.includes(keyword) || name.includes(keyword)) {
          return category;
        }
      }
    }
    return 'Sonstiges';
  }

  _getCategoryIcon(category) {
    const icons = {
      'Obst & Gemüse': '🥦',
      'Molkerei':       '🥛',
      'Backwaren':      '🍞',
      'Fleisch & Fisch':'🥩',
      'Getränke':       '🥤',
      'Tiefkühl':       '🧊',
      'Vorrat':         '🥫',
      'Haushalt':       '🧹',
      'Sonstiges':      '📦',
    };
    return icons[category] || '📦';
  }

  _getCategoryColor(category) {
    const colors = {
      'Obst & Gemüse': 'rgba(76, 175, 80, 0.25)',
      'Molkerei':       'rgba(33, 150, 243, 0.25)',
      'Backwaren':      'rgba(255, 193, 7, 0.25)',
      'Fleisch & Fisch':'rgba(244, 67, 54, 0.25)',
      'Getränke':       'rgba(0, 188, 212, 0.25)',
      'Tiefkühl':       'rgba(100, 181, 246, 0.25)',
      'Vorrat':         'rgba(255, 152, 0, 0.25)',
      'Haushalt':       'rgba(156, 39, 176, 0.25)',
      'Sonstiges':      'rgba(255, 255, 255, 0.08)',
    };
    return colors[category] || 'rgba(255,255,255,0.08)';
  }

  _groupByCategory(items) {
    const order = [
      'Obst & Gemüse', 'Molkerei', 'Backwaren', 'Fleisch & Fisch',
      'Getränke', 'Tiefkühl', 'Vorrat', 'Haushalt', 'Sonstiges',
    ];
    const grouped = {};
    order.forEach(cat => { grouped[cat] = []; });

    items
      .filter(i => i.status === 'needs_action')
      .forEach(item => {
        const cat = this._getCategory(item.summary);
        if (grouped[cat]) {
          grouped[cat].push(item);
        } else {
          grouped['Sonstiges'].push(item);
        }
      });

    return grouped;
  }

  async _addItem(name) {
    if (!name.trim()) return;
    await this._hass.callService('todo', 'add_item', {
      entity_id: this._entity,
      item: name.trim(),
    });
    this._inputValue = '';
    this._fetchItems();
  }

  async _completeItem(uid) {
    await this._hass.callService('todo', 'update_item', {
      entity_id: this._entity,
      item: uid,
      status: 'completed',
    });
    this._fetchItems();
  }

  _render() {
    if (!this.shadowRoot) return;

    const grouped   = this._groupByCategory(this._items);
    const totalItems = this._items.filter(i => i.status === 'needs_action').length;

    let categoriesHTML = '';
    for (const [category, items] of Object.entries(grouped)) {
      if (items.length === 0) continue;
      const color = this._getCategoryColor(category);

      categoriesHTML += `
        <div class="category">
          <div class="category-header">
            <span class="cat-icon">${this._getCategoryIcon(category)}</span>
            <span class="cat-name">${category}</span>
            <span class="cat-count">${items.length}</span>
          </div>
          <div class="category-items" style="border-color:${color.replace('0.25','0.4')}">
            ${items.map(item => `
              <div class="item">
                <div class="item-check" data-uid="${item.uid}"></div>
                <span class="item-name">${item.summary}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 16px;
          color: white;
          font-family: var(--primary-font-family, sans-serif);
          box-shadow: none;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .title {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255,255,255,0.95);
        }
        .total {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          padding: 2px 10px;
        }
        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        .input-field {
          flex: 1;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 9px 13px;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.3); }
        .input-field:focus { border-color: rgba(255,255,255,0.4); }
        .add-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: white;
          padding: 9px 16px;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          transition: background 0.2s;
        }
        .add-btn:hover { background: rgba(255,255,255,0.2); }
        .category { margin-bottom: 10px; }
        .category-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 4px;
          margin-bottom: 5px;
        }
        .cat-icon { font-size: 13px; }
        .cat-name {
          flex: 1;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .cat-count {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 1px 7px;
        }
        .category-items {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          overflow: hidden;
        }
        .item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        .item:last-child { border-bottom: none; }
        .item:active { background: rgba(255,255,255,0.05); }
        .item-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.25);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-check:hover {
          border-color: rgba(76,175,80,0.8);
          background: rgba(76,175,80,0.15);
        }
        .item-name {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          flex: 1;
        }
        .loading, .empty {
          text-align: center;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          padding: 24px;
        }
      </style>
      <ha-card>
        <div class="header">
          <span class="title">🛒 Einkaufsliste</span>
          <span class="total">${totalItems} Artikel</span>
        </div>
        <div class="input-row">
          <input class="input-field" id="newItem" placeholder="Artikel hinzufügen..." value="${this._inputValue}" />
          <button class="add-btn" id="addBtn">+</button>
        </div>
        ${this._loading ? '<div class="loading">Lade Liste...</div>' : ''}
        ${!this._loading && totalItems === 0 ? '<div class="empty">🎉 Einkaufsliste ist leer!</div>' : ''}
        ${categoriesHTML}
      </ha-card>
    `;

    // Event Listener – Artikel hinzufügen
    const input  = this.shadowRoot.getElementById('newItem');
    const addBtn = this.shadowRoot.getElementById('addBtn');

    if (addBtn) addBtn.addEventListener('click', () => this._addItem(input.value));
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') this._addItem(input.value);
      });
      input.addEventListener('input', e => {
        this._inputValue = e.target.value;
      });
    }

    // Event Listener – Artikel abhaken
    this.shadowRoot.querySelectorAll('.item-check').forEach(el => {
      el.addEventListener('click', () => this._completeItem(el.dataset.uid));
    });
  }

  connectedCallback() {
    if (this._hass) this._fetchItems();
  }

  getCardSize() { return 6; }

  static getStubConfig() {
    return { entity: 'todo.zuhause' };
  }
}

customElements.define('shopping-list-card', ShoppingListCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'shopping-list-card',
  name:        'Shopping List Card',
  description: 'Einkaufsliste mit automatischer Kategorie-Sortierung im Glasstil',
});
