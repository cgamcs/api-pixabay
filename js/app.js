const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

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

    buscarImagenes(terminoBusqueda)
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

function buscarImagenes(termino) {
    const key = '51107069-5acf2a92e7bc8ed91b2ba2566'
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}`

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarImagenes(resultado.hits))
}

function mostrarImagenes(imagenes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

    // Iterrar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen
        
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white rounded-lg">
                    <img class="w-full rounded-lg" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="font-normal">Me gusta</span></p>
                        <p class="font-bold mb-5">${views} <span class="font-normal">Veces vista</span></p>
                        
                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="underline">
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `
    })
}