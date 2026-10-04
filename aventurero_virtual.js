// ===== Configuración inicial =====
const CLAVE = "aventureroVirtual"; // clave con la que se guarda en localStorage
let datos = { nombre: "", completadas: {} }; // forma: { completadas: { buceo: true } }
// ===== Referencias a elementos del HTML =====
const inputNombre = document.getElementById("nombre");
const saludo = document.getElementById("saludo");
const tarjetas = document.querySelectorAll(".tarjeta");
const textoProgreso = document.getElementById("textoProgreso");
const relleno = document.getElementById("relleno");
// ===== Funciones de localStorage =====
// Lee los datos guardados (si existen) al abrir o refrescar la página
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
      if (guardado) datos = JSON.parse(guardado); // convierte el texto en objeto
    } catch (error) {
        console.error("No se pudieron leer los datos:", error);
    }
}
// Guarda el objeto "datos" como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
// ===== Funciones que actualizan la pantalla =====
// Estas funciones solo leen "datos" y cambian lo que se ve
// No guardan nada: eso lo hacen los eventos
// Así cada función tiene una sola tarea
// Muestra el saludo según el nombre guardado
function pintarSaludo() {
    inputNombre.value = datos.nombre;
    saludo.textContent = datos.nombre ? "¡Buena suerte, " + datos.nombre + "!" : "";
}
// Dibuja una tarjeta según esté completada o no
function pintarTarjeta(tarjeta) {
    const hecha = Boolean(datos.completadas[tarjeta.dataset.id]);
    tarjeta.classList.toggle("completada", hecha); // marca la tarjeta
    tarjeta.querySelector(".btn-completar").textContent = hecha ? "Aventura completada" : "Completar aventura";
}
// Suma los puntos de las aventuras completadas y calcula el nivel
function pintarProgreso() {
    let puntos = 0, total = 0;
    tarjetas.forEach(function (tarjeta) {
        const valor = Number(tarjeta.dataset.puntos); // data-puntos del HTML
        total += valor;
        if (datos.completadas[tarjeta.dataset.id]) puntos += valor;
    });
    const nivel = puntos >= 30 ? "Gran aventurero" : puntos >= 10 ? "Explorador" : "Novato";
    relleno.style.width = (puntos / total) * 100 + "%";
    textoProgreso.textContent = puntos + " de " + total + " puntos. Nivel: " + nivel;
}
// Redibuja toda la página
function pintarTodo() {
    pintarSaludo();
    tarjetas.forEach(pintarTarjeta);
    pintarProgreso();
}
// ===== Eventos =====
// Cada evento cambia los datos, los guarda y redibuja
// Así lo que ves siempre coincide con lo guardado
// Los eventos solo reaccionan a lo que hace la persona
// Al escribir el nombre, se guarda al instante
inputNombre.addEventListener("input", function () {
    datos.nombre = inputNombre.value.trim();
    guardarDatos();
    pintarSaludo();
});
// Eventos de cada tarjeta: el botón completa o desmarca la aventura
tarjetas.forEach(function (tarjeta) {
    tarjeta.querySelector(".btn-completar").addEventListener("click", function () {
        const id = tarjeta.dataset.id;
        datos.completadas[id] = !datos.completadas[id]; // cambia entre true y false
        guardarDatos();
        pintarTarjeta(tarjeta);
        pintarProgreso();
    });
});
// Botón de reinicio: pide confirmación y borra todo
document.getElementById("btnReiniciar").addEventListener("click", function () {
    if (confirm("¿Seguro que quieres borrar todos los datos?")) {
        localStorage.removeItem(CLAVE);
        datos = { nombre: "", completadas: {} };
        pintarTodo();
    }
});
// ===== Inicio de la app =====
// Primero leer, después dibujar: el orden importa
// Sin leer antes, se verían los datos vacíos
cargarDatos(); // primero se leen los datos guardados
pintarTodo();  // luego se dibuja la pantalla con esos datos