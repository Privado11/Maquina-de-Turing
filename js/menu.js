const modal = document.getElementById('modalMenu');
const items = document.querySelectorAll('.items');
const dropdownContent = document.querySelector('.dropdown-content');

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


