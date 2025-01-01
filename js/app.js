//Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

//Organizando los eventos
cargarEventListeners()
function cargarEventListeners() {
    //Agrega un curso al presionar el botón "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCursos);

    //Registra los datos de localStorage al cargar el documento 
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('articulosCarrito')) || [];
        carritoHTML();
    });
    
    //Elimina un curso del carrito al presionar en "X"
    carrito.addEventListener('click', eliminarCurso);

    //Vaciar el carrito al presionar "Vaciar carrito"
    vaciarCarrito.addEventListener('click', () => {
        //Resetea el carrito del arreglo original que se encuentra en memoria
        articulosCarrito = [];

        //Elimina los objetos visiblemente del HTML
        limpiarHTML();

        //Limpia el localStorage
        localStorage.clear();
    });
}


//Funciones
function agregarCursos(e) {
    e.preventDefault();
    
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado);
    } 

}
//Elimina un curso del carrito
function eliminarCurso(e) {
    const element = e.target.classList.contains('borrar-curso')
    if(element) {
        const cursoId = e.target.getAttribute('data-id');

        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        //Vuelvo a iterar sobre el carrito para mostrar el HTML actualizado, pero ahora sin los elementos borrados
        carritoHTML();
        
    }
    
}
//Lee el contenido del HTML ala que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {

    //Crear un objeto con el contenido del curso actual
    
    const infoCurso = {
        imagen : curso.querySelector('img').src,
        titulo : curso.querySelector('h4').textContent,
        maestro : curso.querySelector('p').textContent,
        precio : curso.querySelector('span').textContent,
        id : curso.querySelector('a').getAttribute('data-id'),
        cantidad : 1,
    }
    
    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(existe) {
        //Actualiza la cantidad de objetos duplicados
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                //Retorna los objetos que no son los duplicados
                return curso;
            }
        } );
        articulosCarrito = [...cursos];
    } else {
        //Agregando elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    
    carritoHTML();
}

//Muestra el carrito de compras en el HTML
function carritoHTML() {

    //Limpiar el HTML
    limpiarHTML()

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id } = curso
        const row = document.createElement('TR');
        row.innerHTML = `
            <td><img src="${imagen}" width="100">
            <td>${titulo}</>
            <td>${precio}</>
            <td>${cantidad}</>
            <td>
                <a href="#"         class="borrar-curso" data-id="${id}" > X </a> 
            <td/>
        `;

        //Agega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    })

    sincronizarStorage();
}

//Elimina los cursos del tbody
function limpiarHTML() {

    //Forma lenta
    //contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    } 
}

function sincronizarStorage() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito));
} 