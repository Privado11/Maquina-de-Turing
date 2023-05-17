const modal = document.getElementById('modalMenu');
const historial = document.getElementById('history');
historial.addEventListener("click", openModal);
const items = document.querySelectorAll('.items');
const dropdownContent = document.querySelector('.dropdown-content');
const texto = document.getElementById('texto');
const cerrarModal = document.getElementById('botonModal');
cerrarModal.addEventListener("click", closedModal);
const recorrido = document.getElementById('recorrido');
recorrido.addEventListener("click", enviarDatos);
const diagrama = document.getElementById('diagram');
diagram.addEventListener('click', function() {
  window.open('https://drive.google.com/file/d/1TEIeiVHYte1jU-F2T5TTyLtrT-jkHR46/view?usp=sharing', '_blank');
});

loadTranslation('es');
 
function loadTranslation(lang) {
    fetch(`idiomas/${lang}.txt`)
      .then(response => response.text())
      .then(data => {
        const translations = data.split('\n');
        translations.forEach(translation => {
        const [key, value] = translation.trim().split(/\s*=\s*/);
        const element = document.getElementById(key);
        const elements = [element];
          elements.forEach(element => {
            element.textContent = value;
          });
        }); 
    })
}
  
items.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.dataset.lang;
        loadTranslation(lang);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let rango = document.getElementById("formRango");
    let valor = document.getElementById("valorRango");
    valor.innerHTML = rango.value;
});

function mostrarValorRango() {
  let rango = document.getElementById("formRango");
  let valor = document.getElementById("valorRango");
  valor.textContent = rango.value;
}

function openModal() {
  let modal = document.getElementById("myModal");
  modal.style.display = "block";
  obtenerDatos(); 
}

function closedModal() {
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
}

const Palabra={
  'Palabra':'',
  'Estado': ''
}

texto.addEventListener('input',(valor)=>guardarPalabra(valor))

function guardarPalabra(valor){
  const palabra = valor.target.value;
  const nuevaPalabra = palabra.replace(/b/g, "a");
  Palabra.Palabra = palabra;
  Palabra.Estado = nuevaPalabra;  
}

function enviarDatos(){
  fetch('https://desingkuro.pythonanywhere.com/Palabras_recibidas', {
    method: 'POST',
    body: JSON.stringify(Palabra),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.text())
  .then(data => console.log(data))
}

function obtenerDatos() {
  let table = document.getElementById("tabla-datos");
  let rowCount = table.rows.length;
  for (var i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
  }
  
  fetch('https://desingkuro.pythonanywhere.com/Palabras')
    .then(response => response.json())
    .then(data => {
        const tabla = document.getElementById("tabla-datos");
        data.forEach((fila) => {
          const nuevaFila = tabla.insertRow();
          fila.forEach((datos) => {
              const nuevaCelda = nuevaFila.insertCell();
              nuevaCelda.textContent = datos;
          });
      });
    });  
}

