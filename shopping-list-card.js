// Shopping List Card v2.0.0
class ShoppingListCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
    this._loading = true;
    this._inputValue = '';
    this._qtyValue = '';
    this._unitValue = '–';
    this._editingUid = null;
    this._editQty = '';
    this._editUnit = '–';
    this._lastState = null;
    this._entity = 'todo.zuhause';
    this._theme = 'glass';
  }

  setConfig(config) {
    this._config = config || {};
    this._entity = config.entity || 'todo.zuhause';
    this._theme  = config.theme  || 'glass';
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
  // Themes
  // -------------------------------------------------------
  _getThemeCSS() {
    const themes = {

      // Glassmorphism
      glass: `
        ha-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 16px;
          color: white;
          box-shadow: none;
        }
        .title { color: rgba(255,255,255,0.95); }
        .total {
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .input-field, .input-qty, .input-unit {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
        }
        .input-field::placeholder, .input-qty::placeholder { color: rgba(255,255,255,0.3); }
        .input-field:focus, .input-qty:focus, .input-unit:focus { border-color: rgba(255,255,255,0.4); }
        .input-unit option { background: #1a1a2e; color: white; }
        .add-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
        }
        .add-btn:hover { background: rgba(255,255,255,0.2); }
        .qty-badge {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.65);
        }
        .cat-name { color: rgba(255,255,255,0.45); }
        .cat-count { color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.07); }
        .category-items { border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; }
        .item { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .item:active { background: rgba(255,255,255,0.05); }
        .item-check { border: 2px solid rgba(255,255,255,0.25); color: white; }
        .item-check:hover { border-color: rgba(76,175,80,0.8); background: rgba(76,175,80,0.15); }
        .item-name { color: rgba(255,255,255,0.85); }
        .done-section { border-top: 1px solid rgba(255,255,255,0.08); }
        .done-title { color: rgba(255,255,255,0.35); }
        .delete-btn {
          background: rgba(244,67,54,0.12);
          border: 1px solid rgba(244,67,54,0.4);
          color: rgba(244,67,54,0.85);
        }
        .delete-btn:hover { background: rgba(244,67,54,0.25); }
        .done-items { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; }
        .done-check { border-color: rgba(76,175,80,0.5); background: rgba(76,175,80,0.15); color: rgba(76,175,80,0.9); }
        .done-check:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.1); color: white; }
        .done-name { text-decoration: line-through; color: rgba(255,255,255,0.4); }
        .loading, .empty { color: rgba(255,255,255,0.4); }
        .edit-pen { color: rgba(255,255,255,0.5); }
        .edit-pen:hover { color: rgba(255,255,255,0.9); }
        .edit-save { background: rgba(76,175,80,0.2); border: 1px solid rgba(76,175,80,0.45); color: rgba(76,175,80,0.95); }
        .edit-cancel { background: rgba(244,67,54,0.1); border: 1px solid rgba(244,67,54,0.35); color: rgba(244,67,54,0.85); }
      `,

      // Klassisches HA
      classic: `
        ha-card {
          background: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          border: 1px solid var(--divider-color, #e0e0e0);
          padding: 16px;
          color: var(--primary-text-color, #212121);
          box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
        }
        .title { color: var(--primary-text-color, #212121); }
        .total {
          color: var(--secondary-text-color, #727272);
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, #e0e0e0);
        }
        .input-field, .input-qty, .input-unit {
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, #e0e0e0);
          color: var(--primary-text-color, #212121);
        }
        .input-field::placeholder, .input-qty::placeholder { color: var(--secondary-text-color, #727272); }
        .input-field:focus, .input-qty:focus, .input-unit:focus { border-color: var(--primary-color, #03a9f4); }
        .add-btn {
          background: var(--primary-color, #03a9f4);
          border: none;
          color: white;
        }
        .add-btn:hover { opacity: 0.85; }
        .qty-badge {
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, #e0e0e0);
          color: var(--secondary-text-color, #727272);
        }
        .cat-name { color: var(--secondary-text-color, #727272); }
        .cat-count { color: var(--secondary-text-color, #727272); background: var(--secondary-background-color, #f5f5f5); }
        .category-items { border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; }
        .item { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
        .item:active { background: var(--secondary-background-color, #f5f5f5); }
        .item-check { border: 2px solid var(--divider-color, #bdbdbd); color: transparent; }
        .item-check:hover { border-color: var(--primary-color, #03a9f4); background: rgba(3,169,244,0.1); }
        .item-name { color: var(--primary-text-color, #212121); }
        .done-section { border-top: 1px solid var(--divider-color, #e0e0e0); }
        .done-title { color: var(--secondary-text-color, #727272); }
        .delete-btn {
          background: rgba(244,67,54,0.08);
          border: 1px solid rgba(244,67,54,0.3);
          color: #f44336;
        }
        .delete-btn:hover { background: rgba(244,67,54,0.15); }
        .done-items { background: var(--secondary-background-color, #f5f5f5); border: 1px solid var(--divider-color, #e0e0e0); border-radius: 8px; }
        .done-check { border-color: #4caf50; background: rgba(76,175,80,0.1); color: #4caf50; }
        .done-name { text-decoration: line-through; color: var(--secondary-text-color, #727272); }
        .loading, .empty { color: var(--secondary-text-color, #727272); }
        .edit-pen { color: var(--secondary-text-color, #9e9e9e); }
        .edit-pen:hover { color: var(--primary-text-color, #212121); }
        .edit-save { background: rgba(76,175,80,0.1); border: 1px solid #4caf50; color: #388e3c; }
        .edit-cancel { background: rgba(244,67,54,0.08); border: 1px solid #f44336; color: #d32f2f; }
      `,

      // Dark
      dark: `
        ha-card {
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 16px;
          color: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .title { color: rgba(255,255,255,0.92); }
        .total {
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .input-field, .input-qty, .input-unit {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
        .input-field::placeholder, .input-qty::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus, .input-qty:focus, .input-unit:focus { border-color: rgba(99,102,241,0.8); }
        .input-unit option { background: #1a1a2e; color: white; }
        .add-btn {
          background: rgba(99,102,241,0.3);
          border: 1px solid rgba(99,102,241,0.5);
          color: white;
        }
        .add-btn:hover { background: rgba(99,102,241,0.5); }
        .qty-badge {
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: rgba(255,255,255,0.65);
        }
        .cat-name { color: rgba(255,255,255,0.4); }
        .cat-count { color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
        .category-items { border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; background: rgba(0,0,0,0.2); }
        .item { border-bottom: 1px solid rgba(255,255,255,0.04); }
        .item:active { background: rgba(255,255,255,0.04); }
        .item-check { border: 2px solid rgba(255,255,255,0.2); color: white; }
        .item-check:hover { border-color: rgba(99,102,241,0.8); background: rgba(99,102,241,0.2); }
        .item-name { color: rgba(255,255,255,0.82); }
        .done-section { border-top: 1px solid rgba(255,255,255,0.06); }
        .done-title { color: rgba(255,255,255,0.3); }
        .delete-btn {
          background: rgba(244,67,54,0.1);
          border: 1px solid rgba(244,67,54,0.35);
          color: rgba(244,67,54,0.8);
        }
        .delete-btn:hover { background: rgba(244,67,54,0.2); }
        .done-items { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; }
        .done-check { border-color: rgba(76,175,80,0.5); background: rgba(76,175,80,0.12); color: rgba(76,175,80,0.8); }
        .done-check:hover { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.08); }
        .done-name { text-decoration: line-through; color: rgba(255,255,255,0.3); }
        .loading, .empty { color: rgba(255,255,255,0.35); }
        .edit-pen { color: rgba(99,102,241,0.5); }
        .edit-pen:hover { color: rgba(99,102,241,0.95); }
        .edit-save { background: rgba(76,175,80,0.15); border: 1px solid rgba(76,175,80,0.4); color: rgba(76,175,80,0.9); }
        .edit-cancel { background: rgba(244,67,54,0.1); border: 1px solid rgba(244,67,54,0.35); color: rgba(244,67,54,0.8); }
      `,

      // Minimal
      minimal: `
        ha-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 8px 0;
          color: var(--primary-text-color, #212121);
          box-shadow: none;
        }
        .title { color: var(--primary-text-color, #212121); font-size: 16px; }
        .total {
          color: var(--secondary-text-color, #727272);
          background: transparent;
          border: 1px solid var(--divider-color, #e0e0e0);
        }
        .input-field, .input-qty {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 0;
          color: var(--primary-text-color, #212121);
          padding: 6px 0;
        }
        .input-unit {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 0;
          color: var(--primary-text-color, #212121);
          padding: 6px 2px;
        }
        .input-field::placeholder, .input-qty::placeholder { color: var(--secondary-text-color, #727272); }
        .input-field:focus, .input-qty:focus { border-bottom-color: var(--primary-color, #03a9f4); }
        .add-btn {
          background: transparent;
          border: none;
          color: var(--primary-color, #03a9f4);
          font-size: 24px;
          padding: 0 8px;
        }
        .qty-badge {
          background: transparent;
          border: 1px solid var(--divider-color, #e0e0e0);
          color: var(--secondary-text-color, #727272);
        }
        .cat-name { color: var(--secondary-text-color, #727272); letter-spacing: 1px; }
        .cat-count { color: var(--secondary-text-color, #727272); background: transparent; border: none; }
        .category-items { border: none; border-radius: 0; }
        .item { border-bottom: 1px solid var(--divider-color, #e0e0e0); padding: 10px 0; }
        .item:active { background: transparent; }
        .item-check { border: 1.5px solid var(--secondary-text-color, #bdbdbd); color: transparent; border-radius: 4px; }
        .item-check:hover { border-color: var(--primary-color, #03a9f4); }
        .item-name { color: var(--primary-text-color, #212121); }
        .done-section { border-top: 1px solid var(--divider-color, #e0e0e0); }
        .done-title { color: var(--secondary-text-color, #727272); }
        .delete-btn {
          background: transparent;
          border: none;
          color: #f44336;
          font-size: 12px;
          padding: 0;
        }
        .done-items { background: transparent; border: none; }
        .done-check { border-color: #4caf50; background: transparent; color: #4caf50; border-radius: 4px; }
        .done-name { text-decoration: line-through; color: var(--secondary-text-color, #727272); }
        .loading, .empty { color: var(--secondary-text-color, #727272); }
        .edit-pen { color: var(--secondary-text-color, #9e9e9e); }
        .edit-pen:hover { color: var(--primary-color, #03a9f4); }
        .edit-save { background: transparent; border: none; color: #4caf50; }
        .edit-cancel { background: transparent; border: none; color: #f44336; }
      `,
    };

    return themes[this._theme] || themes['glass'];
  }

  // -------------------------------------------------------
  // Keyword-Matching: Wortgrenzen für kurze Keywords (≤3 Zeichen)
  // verhindert False Positives in zusammengesetzten Wörtern
  // -------------------------------------------------------
  _matchesKeyword(text, keyword) {
    if (keyword.length <= 3) {
      const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?<![a-zäöüß])${esc}(?![a-zäöüß])`, 'i').test(text);
    }
    return text.includes(keyword);
  }

  // -------------------------------------------------------
  // Kategorie-Zuordnung
  // Priorität: Fleisch → Molkerei → Backwaren → Getränke →
  //            Haushalt → Vorrat → Obst&Gemüse → Tiefkühl → Sonstiges
  // -------------------------------------------------------
  _getCategory(itemName) {
    const name  = itemName.toLowerCase().trim();
    const clean = name.replace(/^\d+[\s]*[xXgGkKlLmM]+[\s]*/i, '').trim();

    const categories = {
      'Fleisch & Fisch': [
        'hackfleisch','hack','hähnchen','hähnchenbrust','hühnchen','rind','rindfleisch',
        'schwein','schweinefleisch','steak','rumpsteak','schnitzel','wurst','würstchen',
        'wiener','salami','schinken','kochschinken','speck','bacon','lachs',
        'räucherlachs','thunfisch','garnelen','shrimps','fisch','forelle','kabeljau',
        'seelachs','scholle','hering','matjes','makrele','putenbrust','pute','chorizo',
        'bratwurst','currywurst','leberwurst','mettwurst','mortadella','prosciutto',
        'fleisch','gulasch','geschnetzeltes','frikadelle','frikadellen','cevapcici',
        'lammfleisch','lamm','ente','gans','kalbfleisch','kalb','leberkäse','aufschnitt',
        'mett','sülze','blutwurst','krakauer','nackensteak','filet','rinderfilet',
        'schweinefilet','hähnchenschenkel','chicken wings','garnele','tintenfisch',
        'pangasius','dorade','sardinen','surimi','fischstäbchen','schlemmerfilet',
        'fischfilet','lachsfilet','thunfischdose','thunfisch dose',
      ],
      'Molkerei': [
        'milch','vollmilch','frischmilch','hafermilch','sojamilch','mandelmilch',
        'butter','sahne','schlagsahne','kaffeesahne','joghurt','naturjoghurt',
        'griechischer joghurt','quark','speisequark','käse','parmesan','mozzarella',
        'gouda','frischkäse','schmand','crème fraîche','creme fraiche','eier',
        'margarine','kefir','buttermilch','skyr','mascarpone','ricotta','brie',
        'camembert','emmentaler','feta','harzer','bergkäse','butterkäse','hüttenkäse',
        'körniger frischkäse','schnittkäse','reibekäse','raclette','halloumi',
        'ziegenkäse','schafskäse','crème double','pflanzendrink','kokosjoghurt',
        'sahnequark','milchreis','vanillesoße','sour cream','sauerrahm',
        'ayran','lassi','kondensmilch','cremefine','kaffeeobers','schlagobers',
      ],
      'Backwaren': [
        'brot','brötchen','semmel','toast','toastbrot','baguette','laugenstange',
        'laugenbrezel','croissant','brezel','mehl','weizenmehl','dinkelmehl','hefe',
        'trockenhefe','backpulver','natron','kuchen','torte','muffin','bagel','wrap',
        'tortilla','weißbrot','vollkornbrot','graubrot','roggenbrot','dinkelbrot',
        'ciabatta','focaccia','knäckebrot','zwieback','pumpernickel','milchbrötchen',
        'rosinenbrötchen','franzbrötchen','donut','berliner','krapfen','plätzchen',
        'lebkuchen','waffeln','pfannkuchen','crêpe','sandwich','burger buns','pita',
        'naan','vanillezucker','puderzucker','marzipan','kuvertüre','backaroma',
        'laugengebäck','sonntagsbrötchen','brezeln','hefezopf',
      ],
      'Getränke': [
        'wasser','mineralwasser','stilles wasser','sprudel','sprudelwasser',
        'leitungswasser','tafelwasser',
        'orangensaft','apfelsaft','traubensaft','multivitaminsaft','saft',
        'cola','fanta','sprite','limonade','spezi','brause',
        'bier','pils','weizenbier','radler','malzbier',
        'wein','rotwein','weißwein','rosé','sekt','prosecco','champagner',
        'kaffee','kaffeebohnen','filterkaffee','espresso','cappuccino','milchkaffee','latte',
        'tee','grüner tee','schwarzer tee','kräutertee',
        'smoothie','nektar','eistee','energy','energydrink',
        'kakao','trinkschokolade','multivitamin','schorle','apfelschorle',
        'tonic','ginger ale','vitaminwasser','gin','wodka','rum','whisky','likör','aperol',
      ],
      'Haushalt': [
        'spülmittel','waschmittel','colorwaschmittel','vollwaschmittel','toilettenpapier',
        'klopapier','küchenrolle','küchentücher','müllbeutel','mülltüten',
        'geschirrspültabs','spülmaschinentabs','klarspüler','spülmaschinensalz',
        'reiniger','allzweckreiniger','seife','handseife','flüssigseife','shampoo',
        'duschgel','zahnpasta','deodorant','wattepads','rasierer','rasierklingen',
        'rasierschaum','schwamm','spülschwamm','putzmittel','spülbürste','alufolie',
        'frischhaltefolie','backpapier','butterbrotpapier','zipbeutel','gefrierbeutel',
        'wattestäbchen','feuchttücher','taschentücher','kosmetiktücher','lappen',
        'mikrofasertuch','weichspüler','entkalker','fleckenentferner','glasreiniger',
        'badreiniger','wc-reiniger','klobürste','bodylotion','bodymilk','lotion',
        'handcreme','gesichtscreme','zahnbürste','zahnseide','mundspülung',
        'haarspülung','conditioner','haargel','haarspray','sonnencreme','windeln',
        'damenbinden','tampons','batterien','glühbirne','kerzen',
        'streichhölzer','feuerzeug','staubsaugerbeutel','wäscheparfüm','essigreiniger',
        'scheuermilch','desinfektionsmittel','handdesinfektion',
        'hundefutter','katzenfutter','katzenstreu','blumenerde','vogelfutter',
        'spülhandschuhe','putztücher','schwammtuch','geschirrtuch','servietten',
        'grillkohle','deo',
      ],
      'Vorrat': [
        // Zusammengesetzte Formen zuerst – verhindert False Positives in Obst&Gemüse
        'tomatensoße','tomatensauce','tomatensuppe','tomatencremesuppe',
        'kartoffelsuppe','kartoffelpüree','kartoffelknödel','kartoffelklöße','kartoffelgratin',
        'hühnersuppe','linsensuppe','erbsensuppe','gemüsesuppe','nudelsuppe',
        'pflanzenöl','speiseöl','frittieröl',
        // Reguläre Vorrats-Keywords
        'nudeln','pasta','spaghetti','penne','fusilli','makkaroni','lasagne',
        'tortellini','gnocchi','reis','basmatireis','jasminreis','risottoreis',
        'couscous','linsen','rote linsen','bohnen','kidneybohnen','kichererbsen',
        'dosentomaten','passierte tomaten','tomatenmark','olivenöl','sonnenblumenöl',
        'rapsöl','kokosöl','essig','balsamico','salz','pfeffer','zucker',
        'brauner zucker','honig','agavendicksaft','marmelade','konfitüre','nutella',
        'nuss-nougat-creme','erdnussbutter','müsli','granola','haferflocken',
        'cornflakes','porridge','chips','tortilla chips','nüsse','erdnüsse','mandeln',
        'walnüsse','cashews','haselnüsse','pistazien','rosinen','trockenfrüchte',
        'schokolade','schokoriegel','kekse','butterkekse','cracker','salzstangen',
        'senf','ketchup','mayonnaise','remoulade','sojasoße','sweet chili','pesto',
        'gewürze','zimt','curry','kurkuma','paprikapulver','oregano','muskat',
        'meersalz','brühe','gemüsebrühe','bouillon','fond','kokosmilch','quinoa',
        'bulgur','polenta','paniermehl','semmelbrösel','speisestärke','vanille',
        'kakaopulver','pudding','puddingpulver','tortenguss','gelatine','reiswaffeln',
        'knabberzeug','popcorn','marshmallows','gummibärchen','bonbons','riegel',
        'ahornsirup','dosenmais','dosenananas','sauerkraut',
        'gewürzgurken','oliven glas','antipasti','kapern','tahin','hummus',
        'wok sauce','sojasauce','fischsauce','oystersauce','currypaste',
      ],
      'Obst & Gemüse': [
        'apfel','äpfel','birne','birnen','banane','bananen','orange','orangen',
        'zitrone','zitronen','limette','limetten','erdbeere','erdbeeren','traube',
        'trauben','tomate','tomaten','cherrytomate','gurke','gurken','paprika',
        'karotte','karotten','möhre','möhren','zwiebel','zwiebeln','frühlingszwiebel',
        'knoblauch','salat','kopfsalat','eisbergsalat','spinat','brokkoli','blumenkohl',
        'zucchini','aubergine','lauch','porree','sellerie','avocado','mango','ananas',
        'kiwi','pfirsich','nektarine','aprikose','aprikosen','pflaume','pflaumen',
        'kirsche','kirschen','heidelbeere','heidelbeeren','himbeere','himbeeren',
        'brombeere','brombeeren','johannisbeere','melone','wassermelone','honigmelone',
        'blaubeere','blaubeeren','pfifferling','pfifferlinge','steinpilz','steinpilze',
        'marone','maronen','austernpilz','austernpilze','zuckererbsen',
        'champignon','champignons','pilze','pilz','kartoffel','kartoffeln',
        'süßkartoffel','feldsalat','rucola','petersilie','basilikum','schnittlauch',
        'koriander','dill','minze','rosmarin','thymian','ingwer','chili','radieschen',
        'rettich','rote bete','rote beete','kürbis','mais','erbsen','bohnen grün',
        'spargel','fenchel','kohlrabi','rosenkohl','grünkohl','weißkohl','rotkohl',
        'chinakohl','pak choi','staudensellerie','pastinake','rote zwiebel',
        'schalotte','schalotten','knollensellerie','endivie','mangold','artischocke',
        'granatapfel','feige','feigen','dattel','datteln','clementine','clementinen',
        'mandarine','mandarinen','grapefruit','pomelo','papaya','maracuja','litschi',
        'physalis','sprossen','keimlinge','kresse','olive','oliven','zitronengras',
      ],
      'Tiefkühl': [
        'tiefkühl','tiefkühlpizza','tiefkühlgemüse','tiefkühlkost','tiefkühlbeeren',
        'tiefgefroren','tk-beeren','tk-obst','tk-gemüse','tk-fisch','tk-spinat',
        'pommes','eis','eiscreme','sorbet',
        'rahmspinat','blätterteig','beerenmischung','baguette tk',
        'frühlingsrollen','chicken nuggets','gemüsemischung','kräuterbutter',
        'eis am stiel','magnum','cornetto','edamame','schlemmerfilet tk',
        'spinat tk','erbsen tk',
      ],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (this._matchesKeyword(clean, keyword) || this._matchesKeyword(name, keyword)) return category;
      }
    }
    return 'Sonstiges';
  }

  _getCategoryIcon(category) {
    const icons = {
      'Obst & Gemüse':  '🥦',
      'Molkerei':        '🥛',
      'Backwaren':       '🍞',
      'Fleisch & Fisch': '🥩',
      'Getränke':        '🥤',
      'Tiefkühl':        '🧊',
      'Vorrat':          '🥫',
      'Haushalt':        '🧹',
      'Sonstiges':       '📦',
    };
    return icons[category] || '📦';
  }

  _getCategoryColor(category) {
    const colors = {
      'Obst & Gemüse':  'rgba(76,175,80,0.3)',
      'Molkerei':        'rgba(33,150,243,0.3)',
      'Backwaren':       'rgba(255,193,7,0.3)',
      'Fleisch & Fisch': 'rgba(244,67,54,0.3)',
      'Getränke':        'rgba(0,188,212,0.3)',
      'Tiefkühl':        'rgba(100,181,246,0.3)',
      'Vorrat':          'rgba(255,152,0,0.3)',
      'Haushalt':        'rgba(156,39,176,0.3)',
      'Sonstiges':       'rgba(255,255,255,0.1)',
    };
    return colors[category] || 'rgba(255,255,255,0.1)';
  }

  _groupByCategory(items) {
    const order = [
      'Fleisch & Fisch','Molkerei','Backwaren','Getränke',
      'Haushalt','Vorrat','Obst & Gemüse','Tiefkühl','Sonstiges',
    ];
    const grouped = {};
    order.forEach(cat => { grouped[cat] = []; });
    items
      .filter(i => i.status === 'needs_action')
      .forEach(item => {
        const cat = this._getCategory(item.summary);
        if (grouped[cat]) grouped[cat].push(item);
        else grouped['Sonstiges'].push(item);
      });
    return grouped;
  }

  async _addItem(name, qty, unit) {
    if (!name.trim()) return;
    const description = (qty && String(qty).trim() && unit && unit !== '–')
      ? `${qty} ${unit}`
      : '';
    await this._hass.callService('todo', 'add_item', {
      entity_id: this._entity,
      item: name.trim(),
      ...(description ? { description } : {}),
    });
    this._inputValue = '';
    this._qtyValue = '';
    this._unitValue = '–';
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

  async _uncompleteItem(uid) {
    await this._hass.callService('todo', 'update_item', {
      entity_id: this._entity,
      item: uid,
      status: 'needs_action',
    });
    this._fetchItems();
  }

  async _deleteCompleted() {
    await this._hass.callService('todo', 'remove_completed_items', {
      entity_id: this._entity,
    });
    this._fetchItems();
  }

  _parseDescription(desc) {
    if (!desc) return { qty: '', unit: '–' };
    const known = ['Stk','g','kg','ml','l','Pkg'];
    const parts = desc.trim().split(/\s+/);
    if (parts.length >= 2 && known.includes(parts[parts.length - 1])) {
      return { qty: parts.slice(0, -1).join(' '), unit: parts[parts.length - 1] };
    }
    return { qty: desc, unit: '–' };
  }

  _startEdit(uid, desc) {
    const { qty, unit } = this._parseDescription(desc);
    this._editingUid = uid;
    this._editQty = qty;
    this._editUnit = unit;
    this._render();
  }

  async _saveEdit(uid) {
    const qty = this._editQty;
    const unit = this._editUnit;
    const description = (qty && String(qty).trim() && unit && unit !== '–')
      ? `${qty} ${unit}`
      : '';
    await this._hass.callService('todo', 'update_item', {
      entity_id: this._entity,
      item: uid,
      description,
    });
    this._editingUid = null;
    this._editQty = '';
    this._editUnit = '–';
    this._fetchItems();
  }

  _cancelEdit() {
    this._editingUid = null;
    this._editQty = '';
    this._editUnit = '–';
    this._render();
  }

  _renderItem(item, isDone) {
    const action = isDone ? 'uncomplete' : 'complete';
    const checkClass = isDone ? 'item-check done-check' : 'item-check';
    const nameClass  = isDone ? 'item-name done-name'   : 'item-name';
    const checkContent = isDone ? '✓' : '';
    const checkEl = `<div class="${checkClass}" data-uid="${item.uid}" data-action="${action}">${checkContent}</div>`;
    const nameEl  = `<span class="${nameClass}">${item.summary}</span>`;

    if (this._editingUid === item.uid) {
      const units = ['–','Stk','g','kg','ml','l','Pkg'];
      const unitOpts = units.map(u =>
        `<option value="${u}" ${u === this._editUnit ? 'selected' : ''}>${u}</option>`
      ).join('');
      return `
        <div class="item${isDone ? ' done-item' : ''}">
          ${checkEl}
          ${nameEl}
          <input class="edit-qty input-qty" data-uid="${item.uid}" type="number" min="0.1" step="0.5" value="${this._editQty}" placeholder="Menge" />
          <select class="edit-unit input-unit" data-uid="${item.uid}">${unitOpts}</select>
          <button class="edit-save" data-uid="${item.uid}">✓</button>
          <button class="edit-cancel">✗</button>
        </div>
      `;
    }

    const badge = item.description
      ? `<span class="qty-badge">${item.description}</span>`
      : '';
    const desc = (item.description || '').replace(/"/g, '&quot;');
    return `
      <div class="item${isDone ? ' done-item' : ''}">
        ${checkEl}
        ${nameEl}
        ${badge}
        <button class="edit-pen" data-uid="${item.uid}" data-desc="${desc}" title="Menge bearbeiten">✏</button>
      </div>
    `;
  }

  _render() {
    if (!this.shadowRoot) return;

    const grouped     = this._groupByCategory(this._items);
    const activeItems = this._items.filter(i => i.status === 'needs_action');
    const doneItems   = this._items.filter(i => i.status === 'completed');
    const totalActive = activeItems.length;

    const units = ['–','Stk','g','kg','ml','l','Pkg'];
    const unitOptions = units.map(u =>
      `<option value="${u}" ${u === this._unitValue ? 'selected' : ''}>${u}</option>`
    ).join('');

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
          <div class="category-items" style="border-color:${color}">
            ${items.map(item => this._renderItem(item, false)).join('')}
          </div>
        </div>
      `;
    }

    let doneHTML = '';
    if (doneItems.length > 0) {
      doneHTML = `
        <div class="done-section">
          <div class="done-header">
            <span class="done-title">✓ Erledigt (${doneItems.length})</span>
            <button class="delete-btn" id="deleteCompleted">🗑 Löschen</button>
          </div>
          <div class="done-items">
            ${doneItems.map(item => this._renderItem(item, true)).join('')}
          </div>
        </div>
      `;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { font-family: var(--primary-font-family, sans-serif); }
        .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
        .title { font-size:15px; font-weight:600; }
        .total { font-size:11px; border-radius:20px; padding:2px 10px; }
        .input-row { display:flex; gap:6px; margin-bottom:14px; align-items:center; }
        .input-field { flex:1; min-width:0; border-radius:12px; padding:9px 13px; font-size:13px; outline:none; transition:border-color 0.2s; }
        .input-qty { width:58px; flex-shrink:0; border-radius:12px; padding:9px 8px; font-size:13px; outline:none; text-align:center; transition:border-color 0.2s; }
        .input-unit { flex-shrink:0; border-radius:12px; padding:9px 6px; font-size:12px; outline:none; cursor:pointer; transition:border-color 0.2s; }
        .add-btn { flex-shrink:0; border-radius:12px; padding:9px 14px; cursor:pointer; font-size:20px; line-height:1; transition:all 0.2s; }
        .category { margin-bottom:10px; }
        .category-header { display:flex; align-items:center; gap:6px; padding:0 4px; margin-bottom:5px; }
        .cat-icon { font-size:13px; }
        .cat-name { flex:1; font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; }
        .cat-count { font-size:10px; border-radius:10px; padding:1px 7px; }
        .item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-bottom-width:1px; border-bottom-style:solid; transition:background 0.15s; }
        .item:last-child { border-bottom:none; }
        .item-check { width:20px; height:20px; border-radius:50%; cursor:pointer; flex-shrink:0; transition:all 0.2s; display:flex; align-items:center; justify-content:center; font-size:11px; }
        .item-name { font-size:13px; flex:1; min-width:0; }
        .qty-badge { font-size:10px; padding:2px 8px; border-radius:10px; white-space:nowrap; flex-shrink:0; }
        .done-section { margin-top:14px; padding-top:12px; border-top-width:1px; border-top-style:solid; }
        .done-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px; }
        .done-title { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
        .delete-btn { border-radius:10px; font-size:11px; padding:4px 10px; cursor:pointer; transition:background 0.2s; }
        .done-item { opacity:0.55; }
        .loading, .empty { text-align:center; font-size:13px; padding:24px; }
        .edit-pen { background:none; border:none; cursor:pointer; font-size:12px; padding:2px 4px; flex-shrink:0; opacity:0.35; transition:opacity 0.2s; line-height:1; }
        .edit-pen:hover { opacity:1; }
        .edit-save, .edit-cancel { border-radius:8px; padding:3px 8px; cursor:pointer; font-size:13px; flex-shrink:0; font-weight:600; transition:all 0.2s; }
        /* Theme-spezifisches CSS */
        ${this._getThemeCSS()}
      </style>
      <ha-card>
        <div class="header">
          <span class="title">🛒 Einkaufsliste</span>
          <span class="total">${totalActive} Artikel</span>
        </div>
        <div class="input-row">
          <input class="input-field" id="newItem" placeholder="Artikel hinzufügen..." value="${this._inputValue}" />
          <input class="input-qty" id="newQty" type="number" min="0.1" step="0.5" placeholder="Menge" value="${this._qtyValue}" />
          <select class="input-unit" id="newUnit">${unitOptions}</select>
          <button class="add-btn" id="addBtn">+</button>
        </div>
        ${this._loading ? '<div class="loading">Lade Liste...</div>' : ''}
        ${!this._loading && totalActive === 0 && doneItems.length === 0 ? '<div class="empty">🎉 Einkaufsliste ist leer!</div>' : ''}
        ${categoriesHTML}
        ${doneHTML}
      </ha-card>
    `;

    const input     = this.shadowRoot.getElementById('newItem');
    const qtyInput  = this.shadowRoot.getElementById('newQty');
    const unitSelect = this.shadowRoot.getElementById('newUnit');
    const addBtn    = this.shadowRoot.getElementById('addBtn');

    const doAdd = () => this._addItem(input.value, qtyInput.value, unitSelect.value);

    if (addBtn)   addBtn.addEventListener('click', doAdd);
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
      input.addEventListener('input',   e => { this._inputValue = e.target.value; });
    }
    if (qtyInput)   qtyInput.addEventListener('input',    e => { this._qtyValue   = e.target.value; });
    if (unitSelect) unitSelect.addEventListener('change', e => { this._unitValue  = e.target.value; });

    const deleteBtn = this.shadowRoot.getElementById('deleteCompleted');
    if (deleteBtn) deleteBtn.addEventListener('click', () => this._deleteCompleted());

    this.shadowRoot.querySelectorAll('.item-check').forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.action === 'complete') this._completeItem(el.dataset.uid);
        else this._uncompleteItem(el.dataset.uid);
      });
    });

    this.shadowRoot.querySelectorAll('.edit-pen').forEach(btn => {
      btn.addEventListener('click', () => this._startEdit(btn.dataset.uid, btn.dataset.desc));
    });
    this.shadowRoot.querySelectorAll('.edit-save').forEach(btn => {
      btn.addEventListener('click', () => this._saveEdit(btn.dataset.uid));
    });
    this.shadowRoot.querySelectorAll('.edit-cancel').forEach(btn => {
      btn.addEventListener('click', () => this._cancelEdit());
    });
    this.shadowRoot.querySelectorAll('.edit-qty').forEach(input => {
      input.addEventListener('input', e => { this._editQty = e.target.value; });
    });
    this.shadowRoot.querySelectorAll('.edit-unit').forEach(sel => {
      sel.addEventListener('change', e => { this._editUnit = e.target.value; });
    });
  }

  connectedCallback() {
    if (this._hass) this._fetchItems();
  }

  getCardSize() { return 6; }

  static getConfigElement() {
    return document.createElement('shopping-list-card-editor');
  }

  static getStubConfig() {
    return { entity: 'todo.zuhause', theme: 'glass' };
  }
}

customElements.define('shopping-list-card', ShoppingListCard);

// -----------------------------------------------------------
// Visueller Editor
// -----------------------------------------------------------
class ShoppingListCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) this._render();
  }

  _todoEntities() {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter(e => e.startsWith('todo.'))
      .sort();
  }

  _emitChange(key, value) {
    this._config = { ...this._config, [key]: value };
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    }));
  }

  _render() {
    if (!this.shadowRoot) return;
    this._rendered = true;

    const entities = this._todoEntities();
    const curEntity = this._config.entity || 'todo.zuhause';
    const curTheme  = this._config.theme  || 'glass';

    const themes = [
      { value: 'glass',   label: 'Glas (Glasmorphism)' },
      { value: 'classic', label: 'Klassisch (Home Assistant)' },
      { value: 'dark',    label: 'Dunkel' },
      { value: 'minimal', label: 'Minimalistisch' },
    ];

    this.shadowRoot.innerHTML = `
      <style>
        .editor { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 13px; font-weight: 500; color: var(--primary-text-color, #212121); }
        .hint { font-size: 11px; color: var(--secondary-text-color, #727272); }
        select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--divider-color, #e0e0e0);
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #212121);
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }
        select:focus { border-color: var(--primary-color, #03a9f4); }
        .preview-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
        .preview-chip {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid var(--divider-color, #e0e0e0);
          cursor: pointer;
          color: var(--secondary-text-color, #727272);
        }
        .preview-chip.active {
          background: var(--primary-color, #03a9f4);
          color: white;
          border-color: var(--primary-color, #03a9f4);
        }
      </style>
      <div class="editor">
        <div class="field">
          <label>Todo-Liste</label>
          <select id="entitySelect">
            ${entities.length === 0
              ? `<option value="${curEntity}">${curEntity}</option>`
              : entities.map(e => `
                  <option value="${e}" ${e === curEntity ? 'selected' : ''}>
                    ${this._hass.states[e].attributes.friendly_name || e}
                  </option>
                `).join('')}
          </select>
          <span class="hint">Welche Einkaufsliste soll angezeigt werden?</span>
        </div>

        <div class="field">
          <label>Design</label>
          <select id="themeSelect">
            ${themes.map(t => `
              <option value="${t.value}" ${t.value === curTheme ? 'selected' : ''}>${t.label}</option>
            `).join('')}
          </select>
          <div class="preview-row">
            ${themes.map(t => `
              <span class="preview-chip ${t.value === curTheme ? 'active' : ''}" data-theme="${t.value}">${t.label.split(' ')[0]}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const entitySelect = this.shadowRoot.getElementById('entitySelect');
    const themeSelect  = this.shadowRoot.getElementById('themeSelect');

    entitySelect.addEventListener('change', e => this._emitChange('entity', e.target.value));
    themeSelect.addEventListener('change',  e => {
      this._emitChange('theme', e.target.value);
      this._render();
    });

    this.shadowRoot.querySelectorAll('.preview-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this._emitChange('theme', chip.dataset.theme);
        this._render();
      });
    });
  }
}

customElements.define('shopping-list-card-editor', ShoppingListCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type:        'shopping-list-card',
  name:        'Shopping List Card',
  description: 'Einkaufsliste mit Mengenangaben und automatischer Kategorie-Sortierung – 4 Themes',
  preview:     true,
  documentationURL: 'https://github.com/pquandel2-alt/Shoping-list-card-',
});
