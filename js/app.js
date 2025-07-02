const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const paginacionDiv = document.querySelector('#paginacion')

const  registrosPorPagina = 30
let totalPaginas
let iterador
let paginaActual = 1

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault()

    const terminoBusqueda = document.querySelector('#termino').value

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda')
        return
    }

    buscarImagenes()
}

function mostrarAlerta(mensaje) {
    const existeAlerta = DocumentFragment.querySelector('.bg-red-100')

    if(!existeAlerta) {
        const alerta = document.createElement('P')
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center')

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>    
        `

        formulario.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function buscarImagenes() {
    const termino = document.querySelector('#termino').value

    const key = '51107069-5acf2a92e7bc8ed91b2ba2566'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits)
            console.log(totalPaginas)
            mostrarImagenes(resultado.hits)
        })
}

// Generador que va a registrar la cantidad de elementos de acuredo a las paginas
function *crearPaginador(total) {
    for(let i = 1; i <= total; i++) {
        yield i
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina))
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    // Iterrar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen
        
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("break-inside-avoid", "mb-4", "bg-white", "rounded-lg", "overflow-hidden", "shadow");

        tarjeta.innerHTML = `
            <img class="w-full rounded-t-lg" src="${previewURL}" />
            <div class="p-4">
                <p class="font-bold">${likes} <span class="font-normal">Me gusta</span></p>
                <p class="font-bold mb-5">${views} <span class="font-normal">Veces vista</span></p>
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="underline">
                    Ver Imagen
                </a>
            </div>
        `;

        resultado.appendChild(tarjeta);
    })

    // Limpiar anterior paginador
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    imprimirPaginador()
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas)

    while(true) {
        const { value, done } = iterador.next()

        if(done) return

        // Caso contrario, genera un boton por cada elemento del generador
        const boton = document.createElement('A')
        boton.href = '#'
        boton.dataset.pagina = value
        boton.textContent = value
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-10', 'uppercase', 'rounded')

        boton.onclick = () => {
            paginaActual = value

            buscarImagenes()
        }

        paginacionDiv.appendChild(boton)
    }
}