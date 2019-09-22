function showModal(event) {
  var modalId = event.target.getAttribute('data-target');
  var modal = document.getElementById(modalId);
  modal.classList.add('is-active');
}

function hideModal(event) {
  var modal = event.target.parentElement;
  modal.classList.remove('is-active');
}

var elements = document.getElementsByClassName('toggle-modal');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', showModal);
}

elements = document.getElementsByClassName('modal-background');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', hideModal);
}

elements = document.getElementsByClassName('modal-close');
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', hideModal);
}
