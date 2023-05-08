const botonModal = document.getElementById('botonInsertar');
const modal = document.getElementById('modalMenu');

function activarModal(){
    console.log('si');
    modal.classList.toggle('Ocultar');
}
iniciarRecorrido.addEventListener('click',()=>{
    modal.classList.toggle('Ocultar');

})
botonModal.addEventListener('click',activarModal);
