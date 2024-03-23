// Función para mostrar el botón de carga
function aparecerBotonCarga() {
  document.getElementById("botonCarga").classList.remove('visually-hidden');
}

// Función para ocultar el botón de carga
function desaparecerBotonCarga() {
  document.getElementById("botonCarga").classList.add('visually-hidden');
}

function Borrarlocalstorage() {
  localStorage.clear()
}
// Función para obtener los datos del servidor
async function obtenerDatosDelServidor() {
  aparecerBotonCarga();

  try {
    const response = await fetch('https://reqres.in/api/users?delay=3');
    const data = await response.json();
    // Almacenar los datos en el almacenamiento local
    localStorage.setItem('userData', JSON.stringify(data));
    // Almacenar la fecha y hora de la solicitud
    localStorage.setItem('lastRequestTime', new Date().getTime());
    // Mostrar los datos en el DOM
    mostrarDatosEnDOM(data);
  } catch (error) {
    console.error('Error al obtener datos del servidor:', error);
  }

  desaparecerBotonCarga();
}

// Función para mostrar los datos en el DOM
function mostrarDatosEnDOM(data) {
  const userDataDiv = document.getElementById('userData');
  userDataDiv.innerHTML = '';
  data.data.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.innerHTML = `
      <img src="${user.avatar}" alt="${user.first_name} ${user.last_name}">
      <p>${user.first_name} ${user.last_name}</p>
      <p>Email: ${user.email}</p>
    `;
    userDataDiv.appendChild(userDiv);
  });
}

// Función para verificar si han pasado más de 1 minuto desde la última solicitud
function verificarTiempoTranscurrido() {
  const lastRequestTime = parseInt(localStorage.getItem('lastRequestTime'));
  if (lastRequestTime) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - lastRequestTime;
    // Si han pasado menos de 1 minuto, leer datos del almacenamiento local
    if (elapsedTime < 60000) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        mostrarDatosEnDOM(userData);
        return;
      }
    }
  }
  // Si han pasado más de 1 minuto o no hay datos en el almacenamiento local, hacer una nueva solicitud al servidor
  obtenerDatosDelServidor();
}

// Evento del botón que despliega la información
document.addEventListener("DOMContentLoaded", function() {
  // Seleccionar el botón por su ID
  const obtenerDatosBtn = document.getElementById("obtenerDatosBtn");
  // Agregar un event listener de clic al botón
  obtenerDatosBtn.addEventListener("click", function() {
    // Llamar a la función verificarTiempoTranscurrido al hacer clic en el botón
    verificarTiempoTranscurrido();
  });
});
