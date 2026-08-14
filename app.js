/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

const WORKER_URL =
    "https://dexterm-proxy.reaperfichasotros.workers.dev";


/* =====================================================
   COLORES / TIPOS
   ===================================================== */

const COLORES_TIPO = {

    normal: ["#9fa0a6", "#d7d8dc"],
    fuego: ["#ff512f", "#f09819"],
    agua: ["#2196f3", "#21cbf3"],
    planta: ["#43a047", "#8bc34a"],
    electrico: ["#f7b733", "#fcff00"],
    hielo: ["#36d1dc", "#5b86e5"],
    lucha: ["#d32f2f", "#ff7043"],
    veneno: ["#8e44ad", "#c039a8"],
    tierra: ["#a97945", "#d4a574"],
    volador: ["#667eea", "#a8c0ff"],
    psiquico: ["#ec407a", "#f06292"],
    bicho: ["#689f38", "#aed581"],
    roca: ["#795548", "#a1887f"],
    fantasma: ["#4527a0", "#7e57c2"],
    dragon: ["#3949ab", "#7986cb"],
    oscuro: ["#212121", "#616161"],
    acero: ["#607d8b", "#90a4ae"],
    hada: ["#ec77ab", "#f3a4d5"]

};


/* =====================================================
   TIPOS EN ESPAÑOL
   ===================================================== */

const TIPOS_ES = {

    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    grass: "Planta",
    electric: "Eléctrico",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"

};


/* =====================================================
   ELEMENTOS
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

let pokemonActualDatos = null;

let shinyActivo = false;


/* =====================================================
   AGREGAR BOTÓN SHINY
   ===================================================== */

const controlesPokemon =
    document.createElement("div");

controlesPokemon.className =
    "controles-pokemon";

const shinyBtn =
    document.createElement("button");

shinyBtn.className =
    "boton-icono";

shinyBtn.innerHTML =
    "⭐ <span>Shiny</span>";

shinyBtn.title =
    "Cambiar a versión Shiny";

shinyBtn.addEventListener(
    "click",
    cambiarShiny
);

controlesPokemon.appendChild(
    shinyBtn
);


/* =====================================================
   BOTÓN GRITO
   ===================================================== */

const gritoBtn =
    document.createElement("button");

gritoBtn.className =
    "boton-icono";

gritoBtn.innerHTML =
    "🔊 <span>Grito</span>";

gritoBtn.title =
    "Escuchar grito del Pokémon";

gritoBtn.addEventListener(
    "click",
    reproducirGrito
);

controlesPokemon.appendChild(
    gritoBtn
);


/*
   Lo ponemos debajo de los tipos.
*/

pokemonTipos.parentElement.appendChild(
    controlesPokemon
);


/* =====================================================
   CARGAR LISTA
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
                (pokemon, index) => ({

                    id:
                        index + 1,

                    nombre:
                        pokemon.name,

                    url:
                        pokemon.url

                })
            );

    } catch (error) {

        console.error(
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
   BÚSQUEDA
   ===================================================== */

function buscarPokemon() {

    const texto =
        input.value
            .trim()
            .toLowerCase();

    if (!texto) {

        resultados.innerHTML =
            "";

        return;

    }

    let encontrados = [];

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

    } else {

        encontrados =
            listaPokemon.filter(
                pokemon =>
                    pokemon.nombre
                        .includes(texto)
            );

    }

    mostrarResultados(
        encontrados.slice(0, 10)
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
                p =>
                    p.id === numero
            );

    } else {

        pokemon =
            listaPokemon.find(
                p =>
                    p.nombre === texto
            );

    }

    if (!pokemon) {

        pokemon =
            listaPokemon.find(
                p =>
                    p.nombre.includes(texto)
            );

    }

    if (pokemon) {

        seleccionarPokemon(
            pokemon
        );

    }

}


/* =====================================================
   RESULTADOS
   ===================================================== */

function mostrarResultados(
    pokemons
) {

    resultados.innerHTML =
        "";

    if (!pokemons.length) {

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

    shinyActivo =
        false;

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

    cargarSprite();

    try {

        const respuesta =
            await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
            );

        const datos =
            await respuesta.json();

        pokemonActualDatos =
            datos;

        mostrarTipos(
            datos.types
        );

    } catch (error) {

        console.error(
            error
        );

    }

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
   SPRITE
   ===================================================== */

function cargarSprite() {

    if (!pokemonSeleccionado) {
        return;
    }

    const id =
        pokemonSeleccionado.id;

    let generacion;

    if (id <= 151) {

        generacion = "sun-moon";

    } else if (id <= 251) {

        generacion = "sun-moon";

    } else if (id <= 386) {

        generacion = "sun-moon";

    } else if (id <= 493) {

        generacion = "sun-moon";

    } else if (id <= 649) {

        generacion = "sun-moon";

    } else if (id <= 721) {

        generacion = "sun-moon";

    } else if (id <= 809) {

        generacion = "sun-moon";

    } else if (id <= 905) {

        generacion = "sword-shield";

    } else {

        generacion = "scarlet-violet";

    }

    const nombre =
        pokemonSeleccionado.nombre;

    const shiny =
        shinyActivo
            ? "shiny/"
            : "";

    const sprite =
        `https://img.pokemondb.net/sprites/${generacion}/${shiny}normal/${nombre}.png`;

    pokemonImagen.src =
        sprite;

    pokemonImagen.alt =
        nombre;

    pokemonImagen.onerror =
        () => {

            pokemonImagen.onerror =
                null;

            /*
               Fallback PokéAPI
            */

            const fallback =
                shinyActivo
                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            pokemonImagen.src =
                fallback;

        };

}


/* =====================================================
   SHINY
   ===================================================== */

function cambiarShiny() {

    shinyActivo =
        !shinyActivo;

    cargarSprite();

    shinyBtn.classList.toggle(
        "activo",
        shinyActivo
    );

}


/* =====================================================
   TIPOS
   ===================================================== */

function mostrarTipos(
    tipos
) {

    pokemonTipos.innerHTML =
        "";

    tipos.forEach(
        tipo => {

            const nombreOriginal =
                tipo.type.name;

            const nombreES =
                TIPOS_ES[
                    nombreOriginal
                ] ||
                capitalizar(
                    nombreOriginal
                );

            const tipoNormalizado =
                nombreOriginal
                    .replace(
                        "dark",
                        "oscuro"
                    )
                    .replace(
                        "fire",
                        "fuego"
                    )
                    .replace(
                        "water",
                        "agua"
                    )
                    .replace(
                        "grass",
                        "planta"
                    )
                    .replace(
                        "electric",
                        "electrico"
                    )
                    .replace(
                        "ice",
                        "hielo"
                    )
                    .replace(
                        "fighting",
                        "lucha"
                    )
                    .replace(
                        "poison",
                        "veneno"
                    )
                    .replace(
                        "ground",
                        "tierra"
                    )
                    .replace(
                        "flying",
                        "volador"
                    )
                    .replace(
                        "psychic",
                        "psiquico"
                    )
                    .replace(
                        "bug",
                        "bicho"
                    )
                    .replace(
                        "rock",
                        "roca"
                    )
                    .replace(
                        "ghost",
                        "fantasma"
                    )
                    .replace(
                        "dragon",
                        "dragon"
                    )
                    .replace(
                        "steel",
                        "acero"
                    )
                    .replace(
                        "fairy",
                        "hada"
                    )
                    .replace(
                        "normal",
                        "normal"
                    );

            const colores =
                COLORES_TIPO[
                    tipoNormalizado
                ] ||
                ["#555", "#888"];

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "tipo";

            span.textContent =
                nombreES;

            span.style.setProperty(
                "--tipo1",
                colores[0]
            );

            span.style.setProperty(
                "--tipo2",
                colores[1]
            );

            pokemonTipos.appendChild(
                span
            );

        }
    );

}


/* =====================================================
   GRITO
   ===================================================== */

function reproducirGrito() {

    if (!pokemonSeleccionado) {
        return;
    }

    const id =
        pokemonSeleccionado.id;

    /*
       Primero intentamos el grito moderno
       de PokeAPI.
    */

    const urls = [

        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`,

        `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${id}.ogg`

    ];

    reproducirAudio(
        urls,
        0
    );

}


function reproducirAudio(
    urls,
    indice
) {

    if (
        indice >= urls.length
    ) {

        console.warn(
            "No se encontró el grito."
        );

        return;

    }

    const audio =
        new Audio(
            urls[indice]
        );

    audio.volume =
        0.8;

    audio.play().catch(
        () => {

            reproducirAudio(
                urls,
                indice + 1
            );

        }
    );

}


/* =====================================================
   ESTRATEGIAS
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

        } else {

            estrategiasContenido
                .classList
                .add("oculto");

            flecha.textContent =
                "▼";

        }

    }
);


/* =====================================================
   CARGAR ESTRATEGIAS
   ===================================================== */

async function cargarEstrategias() {

    if (!pokemonSeleccionado) {
        return;
    }

    estrategiasLista.innerHTML =
        "";

    estado.textContent =
        "⏳ Consultando estrategias...";

    try {

        const url =
            `${WORKER_URL}/api/estrategias/${pokemonSeleccionado.id}`;

        const respuesta =
            await fetch(url);

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
            !datos.estrategias.length
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


function estadoInicial() {

    estado.textContent =
        "";

}


/* =====================================================
   INICIO
   ===================================================== */

cargarListaPokemon();
