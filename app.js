// ============================================
// CONFIGURACIÓN Y DATOS
// ============================================

const defaultConfig = {
  salon_name: 'AchuNails',
  tagline: '🌸Hecho a medida para brindar belleza con precisión🌸'
};

let config = { ...defaultConfig };

// Técnicas disponibles
const techniques = [
    { id: 'semi-manos', name: 'Semipermanente Manos', price: 17500, hasLargo: false },
    { id: 'semi-pies', name: 'Semipermanente Pies', price: 18500, hasLargo: false },
    { id: 'kapping', name: 'Kapping Gel', price: 20500, hasLargo: false },
    { id: 'soft-gel', name: 'Soft Gel', price: 23000, hasLargo: false },
    { id: 'esculpidas', name: 'Esculpidas', price: 25500, hasLargo: false },
    { id: 'esculpidas-largas', name: 'Esculpidas Largas', price: 27000, hasLargo: true }
];

// Combos disponibles
const combos = [
  { id: 'combo-semi', name: 'Combo Semipermanente en Manos y Pies', price: 31000, hasLargo: false },
  { id: 'combo-kapping', name: 'Kapping Gel + Pies', price: 34000, hasLargo: false },
  { id: 'combo-soft', name: 'Soft Gel + Pies', price: 36500, hasLargo: false }
];

// Decoraciones disponibles (precio por uña)
const decorations = [
    { id: 'francesitas', name: 'Francesitas', price: 200, emoji: '🤍' },
  { id: 'espejo', name: 'Espejo', price: 500, emoji: '🪞' },
  { id: 'aurora', name: 'Aura', price: 500, emoji: '🌈' },
  { id: 'perla', name: 'Perlado', price: 500, emoji: '🦪' },
    { id: 'baby-boomer', name: 'Baby Boomer', price: 500, emoji: '🧚🏻‍♀️' },
    { id: 'strass', name: 'Strass', price: 400, emoji: '💎' },
  { id: 'carey', name: 'Carey', price: 1000, emoji: '🐆' },
  { id: 'blooming', name: 'Blooming', price: 200, emoji: '🌸' },
  { id: 'relieve', name: 'Relieve', price: 500, emoji: '🏔️' },
  { id: 'nail-art-simple', name: 'Nail Art Simple', price: 300, emoji: '🎨' },
  { id: 'nail-art-complejo', name: 'Nail Art Complicado', price: 1000, emoji: '🖼️' },
    { id: '3d', name: '3D', price: 1000, emoji: '💮' },
  { id: 'encapsulado', name: 'Encapsulado', price: 500, emoji: '💐' },


];

// Opciones de retirado
const retiradoOtro = [
  { id: 'otro-semi-reno', name: 'Con renovación, semipermanente', price: 2500 },
  { id: 'otro-seco-reno', name: 'Con renovación, en seco', price: 4000 },
  { id: 'otro-humedo-reno', name: 'Con renovación, en húmedo', price: 5500 },
  { id: 'otro-seco-sin', name: 'Sin renovación, en seco', price: 7000 },
  { id: 'otro-humedo-sin', name: 'Sin renovación, en húmedo', price: 10500 }
];

const retiradoPropio = [
  { id: 'propio-semi', name: 'Semipermanente', price: 5000 },
  { id: 'propio-seco', name: 'En seco', price: 6000 },
  { id: 'propio-humedo', name: 'En húmedo', price: 8000 }
];

const arreglos = [
  { id: 'arreglo-soft', name: 'Softgel', pricePerNail: 1000 },
  { id: 'arreglo-esc', name: 'Esculpida', pricePerNail: 1500 }
];

// Estado de la calculadora
let state = {
  selectedTechnique: null,
  selectedLargo: 3,
  decorationCounts: {},
  selectedRetiradoOtro: null,
  selectedRetiradoPropio: null,
  arregloCounts: { 'arreglo-soft': 0, 'arreglo-esc': 0 },
  paymentMethod: null // <-- ESTA LÍNEA ES NUEVA
};

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================

function formatPrice(price) {
  return '$' + price.toLocaleString('es-AR');
}

function renderTechniques() {
  const container = document.getElementById('techniques-container');
  if(!container) return;
  container.innerHTML = techniques.map(tech => `
    <div onclick="selectTechnique('${tech.id}')" 
         class="technique-card cursor-pointer p-4 rounded-2xl border-2 border-baby-pink hover:border-glam-pink transition-all ${state.selectedTechnique === tech.id ? 'selected-card' : 'bg-white/50'}"
         data-technique="${tech.id}">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-deep-pink">${tech.name}</h3>
          ${tech.hasLargo ? '<p class="text-xs text-deep-pink/60">Desde - Selecciona el largo</p>' : ''}
        </div>
        <span class="text-lg font-bold text-glam-pink">${formatPrice(tech.price)}</span>
      </div>
    </div>
  `).join('');
}

function renderCombos() {
  const container = document.getElementById('combos-container');
  if(!container) return; 
  container.innerHTML = combos.map(combo => `
    <div onclick="selectTechnique('${combo.id}')" 
         class="technique-card cursor-pointer p-4 rounded-2xl border-2 border-baby-pink hover:border-glam-pink transition-all ${state.selectedTechnique === combo.id ? 'selected-card' : 'bg-white/50'}"
         data-technique="${combo.id}">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-deep-pink">${combo.name}</h3>
        </div>
        <span class="text-lg font-bold text-glam-pink">${formatPrice(combo.price)}</span>
      </div>
    </div>
  `).join('');
}

function renderDecorations() {
  const container = document.getElementById('decorations-container');
  if(!container) return;
  container.innerHTML = decorations.map(dec => {
    const count = state.decorationCounts[dec.id] || 0;
    const isAllSelected = count === 10;
    return `
      <div class="bg-white/70 p-3 rounded-xl border border-baby-pink flex flex-col justify-between h-full">
        
        <div class="flex items-start justify-between mb-3 flex-wrap gap-1">
          <span class="text-sm font-medium text-deep-pink leading-tight">${dec.emoji} ${dec.name}</span>
          <span class="text-xs font-semibold text-glam-pink whitespace-nowrap">${formatPrice(dec.price)}/uña</span>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
          
          <div class="flex items-center justify-center space-x-4 w-full sm:w-auto">
            <button onclick="updateDecoration('${dec.id}', -1)" class="w-8 h-8 rounded-full bg-baby-pink text-deep-pink font-bold hover:bg-rose-gold hover:text-white transition-all flex items-center justify-center text-lg">-</button>
            <span class="w-6 text-center font-semibold text-deep-pink text-lg">${count}</span>
            <button onclick="updateDecoration('${dec.id}', 1)" class="w-8 h-8 rounded-full bg-baby-pink text-deep-pink font-bold hover:bg-rose-gold hover:text-white transition-all flex items-center justify-center text-lg">+</button>
          </div>
          
          <button onclick="selectAllNails('${dec.id}')" 
                  class="w-full sm:w-auto text-xs font-semibold px-4 py-2 rounded-full transition-all ${isAllSelected ? 'bg-glam-pink text-white shadow-md' : 'bg-soft-pink text-deep-pink border border-baby-pink hover:bg-baby-pink'}">
            ${isAllSelected ? '✓ 10 uñas (-15%)' : 'Todas'}
          </button>
          
        </div>
      </div>
    `;
  }).join('');
}

function renderRetiradoOtro() {
  const container = document.getElementById('retirado-otro-container');
  if(!container) return;
  container.innerHTML = retiradoOtro.map(opt => `
    <div onclick="selectRetiradoOtro('${opt.id}')" 
         class="cursor-pointer p-3 rounded-xl border-2 transition-all ${state.selectedRetiradoOtro === opt.id ? 'selected-card' : 'border-baby-pink bg-white/50 hover:border-rose-gold'}"
         data-retirado-otro="${opt.id}">
      <div class="flex justify-between items-center">
        <span class="text-sm text-deep-pink">${opt.name}</span>
        <span class="font-semibold text-glam-pink">${formatPrice(opt.price)}</span>
      </div>
    </div>
  `).join('');
}

function renderRetiradoPropio() {
  const container = document.getElementById('retirado-propio-container');
  if(!container) return;
  container.innerHTML = retiradoPropio.map(opt => `
    <div onclick="selectRetiradoPropio('${opt.id}')" 
         class="cursor-pointer p-3 rounded-xl border-2 transition-all ${state.selectedRetiradoPropio === opt.id ? 'selected-card' : 'border-baby-pink bg-white/50 hover:border-rose-gold'}"
         data-retirado-propio="${opt.id}">
      <div class="flex justify-between items-center">
        <span class="text-sm text-deep-pink">${opt.name}</span>
        <span class="font-semibold text-glam-pink">${formatPrice(opt.price)}</span>
      </div>
    </div>
  `).join('');
}

function renderArreglos() {
  const container = document.getElementById('arreglo-container');
  if(!container) return;
  container.innerHTML = arreglos.map(arr => `
    <div class="p-3 rounded-xl border-2 border-baby-pink bg-white/50">
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm text-deep-pink">${arr.name}</span>
          <span class="text-xs text-deep-pink/60 ml-2">(${formatPrice(arr.pricePerNail)}/uña)</span>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="updateArreglo('${arr.id}', -1)" class="w-8 h-8 rounded-full bg-baby-pink text-deep-pink font-bold hover:bg-rose-gold hover:text-white transition-all">-</button>
          <span class="w-6 text-center font-semibold text-deep-pink">${state.arregloCounts[arr.id]}</span>
          <button onclick="updateArreglo('${arr.id}', 1)" class="w-8 h-8 rounded-full bg-baby-pink text-deep-pink font-bold hover:bg-rose-gold hover:text-white transition-all">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function buildSummaryItems() {
  let items = [];
  let total = 0;

  if (state.selectedTechnique) {
    const tech = [...techniques, ...combos].find(t => t.id === state.selectedTechnique);
    if(tech) {
      let techPrice = tech.price;
      let techName = tech.name;
      
      if (tech.hasLargo && state.selectedLargo > 3) {
        const extraLargo = (state.selectedLargo - 3) * 1500;
        techPrice += extraLargo;
        techName += ` (Largo Nº${state.selectedLargo})`;
      }
      
      items.push({ name: techName, price: techPrice, type: 'technique' });
      total += techPrice;
    }
  }

  Object.entries(state.decorationCounts).forEach(([id, count]) => {
    if (count > 0) {
      const dec = decorations.find(d => d.id === id);
      let decPrice = dec.price * count;
      let discountApplied = false;
      
      if (count === 10) {
        decPrice = Math.round(decPrice * 0.85);
        discountApplied = true;
      }
      
      items.push({ 
        name: `${dec.name} (${count} uñas)${discountApplied ? ' - 15% dto.' : ''}`, 
        price: decPrice, 
        type: 'decoration' 
      });
      total += decPrice;
    }
  });

  if (state.selectedRetiradoOtro) {
    const ret = retiradoOtro.find(r => r.id === state.selectedRetiradoOtro);
    items.push({ name: `Retirado otro salón: ${ret.name}`, price: ret.price, type: 'extra' });
    total += ret.price;
  }

  if (state.selectedRetiradoPropio) {
    const ret = retiradoPropio.find(r => r.id === state.selectedRetiradoPropio);
    items.push({ name: `Retirado propio: ${ret.name}`, price: ret.price, type: 'extra' });
    total += ret.price;
  }

  Object.entries(state.arregloCounts).forEach(([id, count]) => {
    if (count > 0) {
      const arr = arreglos.find(a => a.id === id);
      const arrPrice = arr.pricePerNail * count;
      items.push({ name: `Arreglo ${arr.name} (${count} uñas)`, price: arrPrice, type: 'extra' });
      total += arrPrice;
    }
  });

  return { items, total };
}

function renderSummary() {
  const container = document.getElementById('summary-content');
  if(!container) return;
  const { items, total } = buildSummaryItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-deep-pink/60">
        <p class="text-4xl mb-4">💅🏻</p>
        <p>No has seleccionado ningún servicio todavía.</p>
        <p class="text-sm">¡Vuelve atrás y elige tu técnica favorita!</p>
      </div>
    `;
  } else {
    const typeLabels = { technique: '💅🏻 Técnica', decoration: '✨ Decoración', extra: '💎 Extra' };
    container.innerHTML = items.map(item => `
      <div class="flex justify-between items-center p-3 rounded-xl bg-white/60 border border-baby-pink">
        <div>
          <span class="text-xs text-deep-pink/60">${typeLabels[item.type]}</span>
          <p class="font-medium text-deep-pink">${item.name}</p>
        </div>
        <span class="font-bold text-glam-pink">${formatPrice(item.price)}</span>
      </div>
    `).join('');
  }

  document.getElementById('total-price').textContent = formatPrice(total);
}

// ============================================
// FUNCIONES DE INTERACCIÓN
// ============================================

function selectTechnique(id) {
  state.selectedTechnique = id;
  const tech = [...techniques, ...combos].find(t => t.id === id);
  
  document.querySelectorAll('.technique-card').forEach(card => {
    card.classList.remove('selected-card');
    card.classList.add('bg-white/50');
  });
  
  const selectedCard = document.querySelector(`[data-technique="${id}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected-card');
    selectedCard.classList.remove('bg-white/50');
  }
  
  const largoSelector = document.getElementById('largo-selector');
  if (tech && tech.hasLargo) {
    largoSelector.classList.remove('hidden');
    selectLargo(3);
  } else if (largoSelector) {
    largoSelector.classList.add('hidden');
    state.selectedLargo = 3;
  }
}

function selectLargo(largo) {
  state.selectedLargo = largo;
  document.querySelectorAll('.largo-btn').forEach(btn => {
    if (parseInt(btn.dataset.largo) === largo) {
      btn.classList.add('bg-glam-pink', 'text-white', 'border-glam-pink');
      btn.classList.remove('border-rose-gold');
    } else {
      btn.classList.remove('bg-glam-pink', 'text-white', 'border-glam-pink');
      btn.classList.add('border-rose-gold');
    }
  });
}

function updateDecoration(id, delta) {
  const current = state.decorationCounts[id] || 0;
  const newVal = Math.max(0, Math.min(10, current + delta));
  state.decorationCounts[id] = newVal;
  renderDecorations();
}

function selectAllNails(id) {
  const current = state.decorationCounts[id] || 0;
  state.decorationCounts[id] = current === 10 ? 0 : 10;
  renderDecorations();
}

function selectRetiradoOtro(id) {
  state.selectedRetiradoOtro = state.selectedRetiradoOtro === id ? null : id;
  renderRetiradoOtro();
}

function selectRetiradoPropio(id) {
  state.selectedRetiradoPropio = state.selectedRetiradoPropio === id ? null : id;
  renderRetiradoPropio();
}

function updateArreglo(id, delta) {
  const current = state.arregloCounts[id] || 0;
  state.arregloCounts[id] = Math.max(0, Math.min(10, current + delta));
  renderArreglos();
}

function goToStep(step) {
  document.querySelectorAll('.step-content').forEach(s => s.classList.add('hidden'));
  document.getElementById(`step-${step}`).classList.remove('hidden');
  
  document.querySelectorAll('.step-indicator').forEach(ind => {
    const indicatorStep = parseInt(ind.dataset.step);
    const circle = ind.querySelector('span');
    if (indicatorStep === step) {
      ind.classList.add('bg-glam-pink', 'text-white');
      circle.classList.add('bg-white', 'text-glam-pink');
    } else if (indicatorStep < step) {
      ind.classList.add('bg-baby-pink', 'text-deep-pink');
      ind.classList.remove('bg-glam-pink', 'text-white');
      circle.classList.remove('bg-white', 'text-glam-pink');
      circle.classList.add('bg-rose-gold', 'text-white');
    } else {
      ind.classList.remove('bg-glam-pink', 'text-white', 'bg-baby-pink');
      circle.classList.remove('bg-white', 'text-glam-pink', 'bg-rose-gold', 'text-white');
      circle.classList.add('bg-soft-pink', 'text-deep-pink');
    }
  });
  
  if (step === 4) {
    renderSummary();
  }
}

function resetCalculator() {
  state = {
    selectedTechnique: null,
    selectedLargo: 3,
    decorationCounts: {},
    selectedRetiradoOtro: null,
    selectedRetiradoPropio: null,
    arregloCounts: { 'arreglo-soft': 0, 'arreglo-esc': 0 },
    paymentMethod: null
  };
  const btnEfectivo = document.getElementById('btn-efectivo');
  const btnTransferencia = document.getElementById('btn-transferencia');
  if(btnEfectivo && btnTransferencia) {
     const defaultClass = "flex-1 bg-white text-[#ff7ba3] border-2 border-[#ff7ba3] font-semibold py-3 rounded-xl shadow-sm transition-all cursor-pointer";
     btnEfectivo.className = defaultClass;
     btnTransferencia.className = defaultClass;
  }
  renderAll();
  goToStep(1);
}

function renderAll() {
  renderTechniques();
  renderCombos();
  renderDecorations();
  renderRetiradoOtro();
  renderRetiradoPropio();
  renderArreglos();
}

function seleccionarPago(metodo) {
  state.paymentMethod = metodo;

  const btnEfectivo = document.getElementById('btn-efectivo');
  const btnTransferencia = document.getElementById('btn-transferencia');

  // (botones desmarcados)
  const defaultClass = "flex-1 bg-white text-[#ff7ba3] border-2 border-[#ff7ba3] font-semibold py-3 rounded-xl shadow-sm transition-all cursor-pointer";
  btnEfectivo.className = defaultClass;
  btnTransferencia.className = defaultClass;

  // (botón pintado de rosa)
  const activeClass = "flex-1 bg-[#ff7ba3] text-white font-semibold py-3 rounded-xl shadow-sm transition-all cursor-pointer";

  if (metodo === 'Efectivo') {
    btnEfectivo.className = activeClass;
  } else if (metodo === 'Transferencia') {
    btnTransferencia.className = activeClass;
  }
}


function toggleCombos() {
  const container = document.getElementById('combos-container');
  const icon = document.getElementById('combo-icon');
  
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } 
  else {
    container.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}
// ============================================
// REGISTRAR EN GOOGLE SHEETS
// ============================================

async function registrarServicio() {
  const { items, total } = buildSummaryItems();
  
  if (items.length === 0) {
    alert('No hay servicios para registrar.');
    return;
  }

  if (!state.paymentMethod) {
    alert('Por favor selecciona el Método de Pago antes de registrar el servicio.');
    return;
  }

  const detalleServicios = items.map(item => item.name).join(' + ');

  // Armamos el paquetito de datos para enviar
  const datos = {
    servicio: detalleServicios,
    metodoPago: state.paymentMethod,
    precio: total
  };


  const botonGuardar = document.querySelector('button[onclick="registrarServicio()"]');
  const textoOriginal = botonGuardar.innerHTML;
  botonGuardar.innerHTML = '⏳ Guardando...';
  botonGuardar.disabled = true;

  try {

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxozs243V7Z2fPm6KF_5J4gFunyf1uSErb5mNiqr3l0NPFZRrz4WZ_o6qNa_kWIkD-z/exec';

    await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    });

    alert('¡Servicio registrado con éxito en tu planilla!');
    resetCalculator();

  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Hubo un error al guardar. Revisa tu conexión.');
  } finally {
    botonGuardar.innerHTML = textoOriginal;
    botonGuardar.disabled = false;
  }
}
// ============================================
// COMPARTIR COMO IMAGEN
// ============================================

async function shareAsImage() {
  const { items, total } = buildSummaryItems();
  
  if (items.length === 0) {
    alert('Por favor selecciona al menos un servicio antes de compartir.');
    return;
  }

  if (!state.paymentMethod) {
    alert('Por favor selecciona el Método de Pago (Efectivo o Transferencia) antes de compartir el resumen.');
    return;
  }

  document.getElementById('export-salon-name').textContent = config.salon_name || 'AchuNails';
  document.getElementById('export-tagline').textContent = config.tagline || '✨ Tu destino glam para uñas perfectas ✨';
  
  const exportItemsContainer = document.getElementById('export-items');
  const typeLabels = { technique: '💅🏻', decoration: '✨', extra: '💎' };
  exportItemsContainer.innerHTML = items.map(item => `
    <div class="export-item">
      <span>${typeLabels[item.type]} ${item.name}</span>
      <span>${formatPrice(item.price)}</span>
    </div>
  `).join('');
  
  document.getElementById('export-total-price').textContent = formatPrice(total);
  
  // Imprime el método de pago en el ticket
  document.getElementById('export-payment-method-text').textContent = state.paymentMethod === 'Efectivo' ? '💵 Efectivo' : '📱 Transferencia';

  try {
    const element = document.getElementById('summary-image-export');
    element.classList.remove('hidden'); 
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    });
    element.classList.add('hidden'); 

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AchuNails-Cotizacion-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } catch (err) {
    console.error('Error al generar imagen:', err);
    alert('No se pudo generar la imagen. Intenta de nuevo.');
  }
}

// Inicializamos la app
renderAll();
goToStep(1);