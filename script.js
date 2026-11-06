document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initContactForm();
});
 
/* ---------- Carrusel ---------- */
 
// Arreglo de elementos que el carrusel recorre
const slidesData = [
  {
    img: 'imagenes/Monitoreo en tiempo real de rendimiento.jpeg',
    alt: 'Panel de monitoreo de una base de datos en producción',
    caption: 'Monitoreo en tiempo real de rendimiento'
  },
  {
    img: 'imagenes/Diagrama entidad-relación dibujado en una pizarra.jpeg',
    alt: 'Diagrama entidad-relación dibujado en una pizarra',
    caption: 'Modelado de esquemas a medida'
  },
  {
    img: 'imagenes/Migraciones sin tiempo de inactividad.jpeg',
    alt: 'Servidores en un centro de datos',
    caption: 'Migraciones sin tiempo de inactividad'
  }
];
 
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
 
  // Si la página no tiene carrusel (servicios, contacto), no hace nada
  if (!track || !prevBtn || !nextBtn) return;
 
  let current = 0;
  let timer = null;
 
  // Construye los slides a partir del arreglo (mismas clases que usa styles.css)
  track.innerHTML = slidesData
    .map(
      (s) => `
      <figure class="slide">
        <img src="${s.img}" alt="${s.alt}">
        <figcaption>${s.caption}</figcaption>
      </figure>`
    )
    .join('');
 
  function goTo(index) {
    // Navegación circular sobre la longitud del arreglo
    current = (index + slidesData.length) % slidesData.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }
 
  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => goTo(current + 1), 5000);
  }
 
  function stopAutoplay() {
    clearInterval(timer);
  }
 
  // Las flechas mueven el carrusel y reinician el contador del avance automático
  prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });
 
  goTo(0);
  startAutoplay();
}
 
/* ---------- Formulario de contacto ---------- */
 
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
 
  // Desactiva las burbujas nativas del navegador: validamos nosotros
  form.setAttribute('novalidate', '');
 
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');
  const servicio = document.getElementById('servicio');
  const mensaje = document.getElementById('mensaje');
  const campos = [nombre, email, telefono, servicio, mensaje];
 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^[+\d][\d\s()-]*$/;
 
  function showError(input, text) {
    clearError(input);
    input.classList.add('input-error');
    input.setAttribute('aria-invalid', 'true');
    const msg = document.createElement('small');
    msg.className = 'field-error';
    msg.setAttribute('role', 'alert');
    msg.textContent = text;
    input.insertAdjacentElement('afterend', msg);
  }
 
  function clearError(input) {
    input.classList.remove('input-error');
    input.removeAttribute('aria-invalid');
    const next = input.nextElementSibling;
    if (next && next.classList.contains('field-error')) next.remove();
  }
 
  // Cada regla devuelve un mensaje de error, o '' si el campo es válido
  const reglas = [
    [nombre, () => {
      const largo = nombre.value.length;
      if (largo < 2) return 'Ingresá tu nombre (mínimo 2 caracteres).';
      if (largo > 60) return 'El nombre no puede superar los 60 caracteres.';
      return '';
    }],
    [email, () =>
      !emailRegex.test(email.value.trim()) ? 'Ingresá un correo electrónico válido.' : ''],
    [telefono, () => {
      const valor = telefono.value.trim();
      const digitos = valor.replace(/\D/g, '').length;
      return !telefonoRegex.test(valor) || digitos < 8 || digitos > 15
        ? 'Ingresá un teléfono válido (entre 8 y 15 dígitos).'
        : '';
    }],
    [servicio, () =>
      servicio.value === '' ? 'Seleccioná un servicio de interés.' : ''],
    [mensaje, () => {
      const largo = mensaje.value.length;
      if (largo < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      if (largo > 500) return 'El mensaje no puede superar los 500 caracteres.';
      return '';
    }]
  ];
 
  // Elimina espacios sobrantes (al inicio, al final y repetidos en el medio)
  function normalizarCampos() {
    nombre.value = nombre.value.replace(/\s+/g, ' ').trim();
    email.value = email.value.trim();
    telefono.value = telefono.value.replace(/\s+/g, ' ').trim();
    mensaje.value = mensaje.value.trim();
  }
 
  // Devuelve el primer campo inválido (o null si todo está bien)
  function validate() {
    normalizarCampos();
    let primerInvalido = null;
 
    reglas.forEach(([input, regla]) => {
      const error = regla();
      if (error) {
        showError(input, error);
        if (!primerInvalido) primerInvalido = input;
      } else {
        clearError(input);
      }
    });
 
    return primerInvalido;
  }
 
  // Crea con createElement un resumen de los datos enviados y lo agrega a la página
  function mostrarResumen(datos) {
    const anterior = document.getElementById('form-summary');
    if (anterior) anterior.remove();
 
    const resumen = document.createElement('section');
    resumen.id = 'form-summary';
    resumen.className = 'form-summary';
    resumen.setAttribute('role', 'status');
 
    const titulo = document.createElement('h3');
    titulo.textContent = `¡Gracias, ${datos.nombre}! Recibimos tu consulta`;
    resumen.appendChild(titulo);
 
    const lista = document.createElement('dl');
    const filas = [
      ['Nombre', datos.nombre],
      ['Correo electrónico', datos.email],
      ['Teléfono', datos.telefono],
      ['Servicio de interés', datos.servicio],
      ['Mensaje', datos.mensaje]
    ];
    filas.forEach(([etiqueta, valor]) => {
      const dt = document.createElement('dt');
      dt.textContent = etiqueta;
      const dd = document.createElement('dd');
      dd.textContent = valor;
      lista.append(dt, dd);
    });
    resumen.appendChild(lista);
 
    const cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'btn-secondary';
    cerrar.textContent = 'Cerrar resumen';
    cerrar.addEventListener('click', () => resumen.remove());
    resumen.appendChild(cerrar);
 
    form.insertAdjacentElement('afterend', resumen);
  }
 
  // Limpia el error apenas el usuario vuelve a escribir o cambia la opción
  campos.forEach((input) => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
  });
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
 
    const primerInvalido = validate();
    if (primerInvalido) {
      primerInvalido.focus();
      return;
    }
 
    const datos = {
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      servicio: servicio.options[servicio.selectedIndex].textContent,
      mensaje: mensaje.value
    };
 
    mostrarResumen(datos);
    form.reset(); // el formulario queda listo para un nuevo envío
  });
}