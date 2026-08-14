/* =====================================================
   CONFIGURACIÓN
   ===================================================== */


/*
   PONÉ ACÁ LA URL DE TU CLOUDFLARE WORKER.

   Ejemplo:

   https://pokemon-estrategias.usuario.workers.dev

*/

const WORKER_URL =
    "https://dexterm-proxy.reaperfichasotros.workers.dev/";


/* =====================================================
   ELEMENTOS HTML
   ===================================================== */

const input =
    document.getElementById("pokemonInput");

const buscarBtn =
    document.getElementById("buscarBtn");

const resultados =
    document.getElementById("resultadosBusqueda");

const pokemonInfo =
    document.getElementById("pokemonInfo");

const pokemonImagen =
    document.getElementById("pokemonImagen");

const pokemonNumero =
    document.getElementById("pokemonNumero");

const pokemonNombre =
    document.getElementById("pokemonNombre");

const pokemonTipos =
    document.getElementById("pokemonTipos");

const estrategiasBtn =
    document.getElementById("estrategiasBtn");

const estrategiasContenido =
    document.getElementById("estrategiasContenido");

const estrategiasLista =
    document.getElementById("estrategiasLista");

const estado =
    document.getElementById("estado");

const flecha =
    document.getElementById("flecha");


/* =====================================================
   VARIABLES
   ===================================================== */

let listaPokemon = [];

let pokemonSeleccionado = null;


/* =====================================================
   CARGAR POKÉMON DESDE POKÉAPI
   ===================================================== */

async function cargarListaPokemon() {

    try {

        estadoInicial();

        const respuesta =
            await fetch(
                "https://pokeapi.co/api/v2/pokemon?limit=2000"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo consultar PokéAPI"
            );

        }


        const datos =
            await respuesta.json();


        listaPokemon =
            datos.results.map(
                (pokemon, index) => {

                    return {

                        id: index + 1,

                        nombre:
                            pokemon.name,

                        url:
                            pokemon.url

                    };

                }
            );


        console.log(
            "Pokémon cargados:",
            listaPokemon.length
        );


    } catch (error) {

        console.error(
            "Error cargando PokéAPI:",
            error
        );

    }

}


/* =====================================================
   BUSCADOR
   ===================================================== */

input.addEventListener(
    "input",
    buscarPokemon
);


buscarBtn.addEventListener(
    "click",
    ejecutarBusqueda
);


input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            ejecutarBusqueda();

        }

    }
);


/* =====================================================
   BÚSQUEDA EN TIEMPO REAL
   ===================================================== */

function buscarPokemon() {

    const texto =
        input.value
            .trim()
            .toLowerCase();


    if (!texto) {

        resultados.innerHTML = "";

        return;

    }


    let encontrados = [];


    /*
       Si escribe un número:
       3
       #3
       003
    */

    const numero =
        parseInt(
            texto.replace("#", "")
        );


    if (!isNaN(numero)) {

        encontrados =
            listaPokemon.filter(
                pokemon =>
                    pokemon.id === numero
            );

    }

    else {

        encontrados =
            listaPokemon.filter(
                pokemon =>
                    pokemon.nombre
                        .includes(texto)
            );

    }


    encontrados =
        encontrados.slice(0, 10);


    mostrarResultados(
        encontrados
    );

}


/* =====================================================
   EJECUTAR BÚSQUEDA
   ===================================================== */

function ejecutarBusqueda() {

    const texto =
        input.value
            .trim()
            .toLowerCase();


    if (!texto) {

        return;

    }


    const numero =
        parseInt(
            texto.replace("#", "")
        );


    let pokemon;


    if (!isNaN(numero)) {

        pokemon =
            listaPokemon.find(
                p => p.id === numero
            );

    }

    else {

        pokemon =
            listaPokemon.find(
                p => p.nombre === texto
            );

    }


    /*
       Si no encuentra coincidencia exacta,
       toma el primer resultado.
    */

    if (!pokemon) {

        const resultadosEncontrados =
            listaPokemon.filter(
                p =>
                    p.nombre.includes(texto)
            );


        pokemon =
            resultadosEncontrados[0];

    }


    if (pokemon) {

        seleccionarPokemon(
            pokemon
        );

    }

}


/* =====================================================
   MOSTRAR RESULTADOS
   ===================================================== */

function mostrarResultados(
    pokemons
) {

    resultados.innerHTML = "";


    if (
        pokemons.length === 0
    ) {

        resultados.innerHTML = `
            <div class="resultado">
                No encontramos ese Pokémon.
            </div>
        `;

        return;

    }


    pokemons.forEach(
        pokemon => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "resultado";


            div.innerHTML = `

                <span>
                    ${capitalizar(
                        pokemon.nombre
                    )}
                </span>

                <span class="resultado-numero">

                    #${String(
                        pokemon.id
                    ).padStart(3, "0")}

                </span>

            `;


            div.addEventListener(
                "click",
                () =>
                    seleccionarPokemon(
                        pokemon
                    )
            );


            resultados.appendChild(
                div
            );

        }
    );

}


/* =====================================================
   SELECCIONAR POKÉMON
   ===================================================== */

async function seleccionarPokemon(
    pokemon
) {

    pokemonSeleccionado =
        pokemon;


    input.value =
        capitalizar(
            pokemon.nombre
        );


    resultados.innerHTML =
        "";


    pokemonInfo.classList.remove(
        "oculto"
    );


    pokemonNombre.textContent =
        capitalizar(
            pokemon.nombre
        );


    pokemonNumero.textContent =
        `#${String(
            pokemon.id
        ).padStart(3, "0")}`;


    pokemonImagen.src =
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;


    pokemonImagen.alt =
        pokemon.nombre;


    /*
       Obtener tipos
    */

    try {

        const respuesta =
            await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
            );


        const datos =
            await respuesta.json();


        pokemonTipos.innerHTML =
            "";


        datos.types.forEach(
            tipo => {

                const span =
                    document.createElement(
                        "span"
                    );


                span.className =
                    "tipo";


                span.textContent =
                    capitalizar(
                        tipo.type.name
                    );


                pokemonTipos.appendChild(
                    span
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );

    }


    /*
       Limpiar estrategias
    */

    estrategiasLista.innerHTML =
        "";


    estado.textContent =
        "Abrí «Estrategias Pokémon» para cargarlas.";


    estrategiasContenido.classList.add(
        "oculto"
    );


    flecha.textContent =
        "▼";

}


/* =====================================================
   BOTÓN ESTRATEGIAS
   ===================================================== */

estrategiasBtn.addEventListener(
    "click",
    async () => {

        const oculto =
            estrategiasContenido
                .classList
                .contains("oculto");


        if (oculto) {

            estrategiasContenido
                .classList
                .remove("oculto");


            flecha.textContent =
                "▲";


            await cargarEstrategias();

        }

        else {

            estrategiasContenido
                .classList
                .add("oculto");


            flecha.textContent =
                "▼";

        }

    }
);


/* =====================================================
   CONSULTAR WORKER
   ===================================================== */

async function cargarEstrategias() {

    if (
        !pokemonSeleccionado
    ) {

        return;

    }


    estrategiasLista.innerHTML =
        "";


    estado.textContent =
        "⏳ Consultando estrategias...";


    try {

        const url =
            `${WORKER_URL.replace(/\/+$/, "")}/api/estrategias/${pokemonSeleccionado.id}`;


        const respuesta =
            await fetch(
                url
            );


        const datos =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "Error del Worker"
            );

        }


        estado.textContent =
            "";


        if (
            !datos.estrategias ||
            datos.estrategias.length === 0
        ) {

            estado.textContent =
                "No se encontraron estrategias.";

            return;

        }


        datos.estrategias.forEach(
            estrategia => {

                crearEstrategia(
                    estrategia
                );

            }
        );


    } catch (error) {

        console.error(
            error
        );


        estado.textContent =
            "❌ No se pudieron obtener las estrategias.";

    }

}


/* =====================================================
   CREAR ESTRATEGIA
   ===================================================== */

function crearEstrategia(
    estrategia
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "estrategia";


    const titulo =
        document.createElement(
            "div"
        );


    titulo.className =
        "estrategia-titulo";


    titulo.textContent =
        estrategia.titulo ||
        "Estrategia Pokémon";


    const contenido =
        document.createElement(
            "div"
        );


    contenido.className =
        "estrategia-contenido";


    contenido.innerHTML =
        estrategia.html;


    article.appendChild(
        titulo
    );


    article.appendChild(
        contenido
    );


    estrategiasLista.appendChild(
        article
    );

}


/* =====================================================
   UTILIDADES
   ===================================================== */

function capitalizar(
    texto
) {

    if (!texto) {

        return "";

    }


    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    );

}


/* =====================================================
   ESTADO INICIAL
   ===================================================== */

function estadoInicial() {

    estado.textContent =
        "";

}


/* =====================================================
   ARRANCAR
   ===================================================== */

cargarListaPokemon();
