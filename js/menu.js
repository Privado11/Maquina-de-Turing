//Command para cambio de idioma
class ChangeLanguageCommand {
  constructor(lang) {
    this.lang = lang;
  }

  execute() {
    loadTranslation(this.lang);
    highlightLanguage(this.lang);
  }
}

// Función que crea y ejecuta el Command 
function changeLanguage(lang) {
  const command = new ChangeLanguageCommand(lang);
  command.execute();
}

document.addEventListener("DOMContentLoaded", function() {
  var rango = document.getElementById("formRango");
  var valor = document.getElementById("valorRango");
  valor.innerHTML = rango.value;
});

function mostrarValorRango() {
  var rango = document.getElementById("formRango");
  var valor = document.getElementById("valorRango");
  valor.textContent = rango.value;
}

loadTranslation('es');

const items = document.querySelectorAll('.items');
const dropdownContent = document.querySelector('.dropdown-content');

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
    .catch(error => console.error(error));
}

function highlightLanguage(lang) {
  items.forEach(item => {
    item.classList.remove('active');
  });
  const item = document.querySelector(`.items[data-lang="${lang}"]`);
  item.classList.add('active');
}

document.getElementById('idioma').addEventListener('click', function() {
  dropdownContent.classList.toggle('show');
});

items.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const lang = this.dataset.lang;
    changeLanguage(lang);
  });
});
