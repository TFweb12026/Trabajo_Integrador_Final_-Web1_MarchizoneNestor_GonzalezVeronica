
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initContactForm();
});
 
/* ---------- Carrusel ---------- */
 
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const carousel = document.getElementById('carousel');
 
  // Si la página no tiene carrusel (servicios, contacto), no hace nada
  if (!track || !prevBtn || !nextBtn) return;
 
  const slides = track.children;
  let current = 0;
  let timer = null;
 
  function goTo(index) {
    // Navegación circular: del último vuelve al primero y viceversa
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }
 
  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), 5000);
  }
 
  function stopAutoplay() {
    clearInterval(timer);
  }
 
  prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
 
  // Pausa el avance automático mientras el mouse está encima
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
 
  startAutoplay();
}
 
/* ---------- Formulario de contacto ---------- */
 
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
 
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  function showError(input, text) {
    clearError(input);
    input.style.borderColor = '#e5675b';
    const msg = document.createElement('small');
    msg.className = 'field-error';
    msg.style.cssText = 'color:#e5675b;display:block;margin-top:4px;font-size:0.85rem;';
    msg.textContent = text;
    input.insertAdjacentElement('afterend', msg);
  }
 
  function clearError(input) {
    input.style.borderColor = '';
    const next = input.nextElementSibling;
    if (next && next.classList.contains('field-error')) next.remove();
  }
 
  function validate() {
    let valid = true;
 
    if (nombre.value.trim().length < 2) {
      showError(nombre, 'Ingresá tu nombre (mínimo 2 caracteres).');
      valid = false;
    } else clearError(nombre);
 
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Ingresá un correo electrónico válido.');
      valid = false;
    } else clearError(email);
 
    if (mensaje.value.trim().length < 10) {
      showError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
      valid = false;
    } else clearError(mensaje);
 
    return valid;
  }
 
  // Limpia el error apenas el usuario vuelve a escribir
  [nombre, email, mensaje].forEach(input =>
    input.addEventListener('input', () => clearError(input))
  );
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
 
    const datos = {
      nombre: nombre.value.trim(),
      email: email.value.trim(),
      mensaje: mensaje.value.trim()
    };
    console.log('Formulario enviado:', datos);
 
    // Mensaje de confirmación
    const ok = document.createElement('p');
    ok.style.cssText =
      'margin-top:20px;padding:14px 18px;border:1px solid #5B8C87;' +
      'border-radius:4px;color:#5B8C87;font-family:var(--font-mono);';
    ok.textContent = `¡Gracias, ${datos.nombre}! Recibimos tu mensaje y te responderemos pronto.`;
    form.insertAdjacentElement('afterend', ok);
 
    form.reset();
    setTimeout(() => ok.remove(), 6000);
  });
}
 