/* =====================================================
   CONFIGURACIÓN
   ===================================================== */

const WORKER_URL =
    "https://dexterm-proxy.reaperfichasotros.workers.dev";


/* =====================================================
   COLORES DE LOS TIPOS
   ===================================================== */

const COLORES_TIPOS = {

    normal: "#a8a77a",

    fire: "#ee8130",

    water: "#6390f0",

    electric: "#f7d02c",

    grass: "#7ac74c",

    ice: "#96d9d6",

    fighting: "#c22e28",

    poison: "#a33ea1",

    ground: "#e2bf65",

    flying: "#a98ff3",

    psychic: "#f95587",

    bug: "#a6b91a",

    rock: "#b6a136",

    ghost: "#735797",

    dragon: "#6f35fc",

    dark: "#705746",

    steel: "#b7b7ce",

    fairy: "#d685ad"

};


/* =====================================================
   NOMBRES DE TIPOS EN ESPAÑOL
   ===================================================== */

const NOMBRES_TIPOS = {

    normal: "Normal",

    fire: "Fuego",

    water: "Agua",

    electric: "Eléctrico",

    grass: "Planta",

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

const shinyBtn =
    document.getElementById("shinyBtn");

const shinyTexto =
    document.getElementById("shinyTexto");

const gritoBtn =
    document.getElementById("gritoBtn");


/* =====================================================
   VARIABLES
   ===================================================== */

let listaPokemon = [];

let pokemonSeleccionado = null;

let pokemonEsShiny = false;

let pokemonSprites = null;


/* =====================================================
   AUDIO
   ===================================================== */

let audioContext = null;


function iniciarAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

}


/* sonido corto */

function sonido(tipo = "click") {

    try {

        iniciarAudio();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        const ahora =
            audioContext.currentTime;


        if (tipo === "click") {

            oscillator.frequency.setValueAtTime(
                420,
                ahora
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                700,
                ahora + 0.08
            );

        }


        if (tipo === "shiny") {

            oscillator.frequency.setValueAtTime(
                500,
                ahora
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                1200,
                ahora + 0.25
            );

        }


        if (tipo === "open") {

            oscillator.frequency.setValueAtTime(
                250,
                ahora
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                700,
                ahora + 0.18
            );

        }


        gain.gain.setValueAtTime(
            0.0001,
            ahora
        );

        gain.gain.exponentialRampToValueAtTime(
            0.08,
            ahora + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.25
        );


        oscillator.start(ahora);

        oscillator.stop(
            ahora + 0.27
        );

    }

    catch (error) {

        console.log(
            "Audio no disponible"
        );

    }

}


/* =====================================================
   CARGAR LISTA
   ===================================================== */

async function cargarListaPokemon() {

    try {

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

                        id:
                            index + 1,

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


    }

    catch (error) {

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
   BUSQUEDA
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
   EJECUTAR
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


    if (!pokemon) {

        pokemon =
            listaPokemon.find(
                p =>
                    p.nombre.includes(texto)
            );

    }


    if (pokemon) {

        sonido("click");

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

    resultados.innerHTML = "";


    if (
        pokemons.length === 0
    ) {

        resultados.innerHTML = `

            <div class="resultado">

                <span>
                    No encontramos ese Pokémon.
                </span>

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
                () => {

                    sonido("click");

                    seleccionarPokemon(
                        pokemon
                    );

                }
            );


            resultados.appendChild(
                div
            );

        }
    );

}


/* =====================================================
   SELECCIONAR POKEMON
   ===================================================== */

async function seleccionarPokemon(
    pokemon
) {

    pokemonSeleccionado =
        pokemon;


    pokemonEsShiny =
        false;


    shinyBtn.classList.remove(
        "activo"
    );


    shinyTexto.textContent =
        "SHINY";


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


    /*
       ===============================================
       CARGAR DATOS DE POKEAPI
       ===============================================
    */

    try {

        const respuesta =
            await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el Pokémon"
            );

        }


        const datos =
            await respuesta.json();


        pokemonSprites =
            datos.sprites;


        /*
           ==========================================
           SPRITE
           ==========================================
        */

        ponerSprite(
            datos
        );


        /*
           ==========================================
           TIPOS
           ==========================================
        */

        mostrarTipos(
            datos.types
        );


    }

    catch (error) {

        console.error(
            error
        );

        pokemonImagen.src =
            obtenerSpriteFallback(
                pokemon
            );

    }


    /*
       ===============================================
       LIMPIAR ESTRATEGIAS
       ===============================================
    */

    estrategiasLista.innerHTML =
        "";


    estado.textContent =
        "Abrí «Estrategias» para cargarlas.";


    estrategiasContenido.classList.add(
        "oculto"
    );


    flecha.textContent =
        "▼";

}


/* =====================================================
   SPRITES
   ===================================================== */

function ponerSprite(
    datos
) {

    const id =
        datos.id;


    /*
       Primero intentamos GIF animado
       de PokéAPI / Black & White.

       Existe para muchos Pokémon
       hasta generaciones anteriores.
    */

    const animated =
        datos.sprites
            ?.versions
            ?.["generation-v"]
            ?.["black-white"]
            ?.animated
            ?.front_default;


    const animatedShiny =
        datos.sprites
            ?.versions
            ?.["generation-v"]
            ?.["black-white"]
            ?.animated
            ?.front_shiny;


    /*
       Sprite estático bonito
    */

    const normal =
        obtenerSpritePokemonDB(
            datos
        );


    const shiny =
        obtenerSpriteShinyPokemonDB(
            datos
        );


    pokemonSprites = {

        animated:
            animated || null,

        animatedShiny:
            animatedShiny || null,

        normal:
            normal,

        shiny:
            shiny,

        pokeapiNormal:
            datos.sprites.front_default,

        pokeapiShiny:
            datos.sprites.front_shiny

    };


    /*
       Para Pokémon con GIF:
       usamos animación.

       Para los demás:
       usamos PokémonDB.

       Si falla:
       PokeAPI.
    */

    pokemonImagen.onerror =
        () => {

            pokemonImagen.onerror =
                null;

            pokemonImagen.src =
                pokemonSprites.pokeapiNormal;

        };


    pokemonImagen.src =
        animated ||
        normal ||
        datos.sprites.front_default;

}


/* =====================================================
   POKEMONDB
   ===================================================== */

function obtenerSpritePokemonDB(
    datos
) {

    const nombre =
        datos.name;


    /*
       Gen 9
    */

    if (datos.id >= 906) {

        return `https://img.pokemondb.net/sprites/scarlet-violet/normal/${nombre}.png`;

    }


    /*
       Gen 8
    */

    if (datos.id >= 810) {

        return `https://img.pokemondb.net/sprites/sword-shield/normal/${nombre}.png`;

    }


    /*
       Gen 7
    */

    return `https://img.pokemondb.net/sprites/sun-moon/normal/${nombre}.png`;

}


/* =====================================================
   SHINY POKEMONDB
   ===================================================== */

function obtenerSpriteShinyPokemonDB(
    datos
) {

    const nombre =
        datos.name;


    if (datos.id >= 906) {

        return `https://img.pokemondb.net/sprites/scarlet-violet/shiny/${nombre}.png`;

    }


    if (datos.id >= 810) {

        return `https://img.pokemondb.net/sprites/sword-shield/shiny/${nombre}.png`;

    }


    return `https://img.pokemondb.net/sprites/sun-moon/shiny/${nombre}.png`;

}


/* =====================================================
   GRITO POKÉMON
   ===================================================== */

gritoBtn.addEventListener(
    "click",
    () => {

        if (
            !pokemonSeleccionado
        ) {

            return;

        }


        sonido("click");


        const id =
            pokemonSeleccionado.id;


        /*
           Gritos de PokéAPI.
        */

        const grito =
            new Audio(
                `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`
            );


        grito.volume =
            0.8;


        grito.play()
            .catch(
                error => {

                    console.log(
                        "No se pudo reproducir el grito:",
                        error
                    );

                }
            );

    }
);


/* =====================================================
   FALLBACK
   ===================================================== */

function obtenerSpriteFallback(
    pokemon
) {

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

}


/* =====================================================
   SHINY
   ===================================================== */

shinyBtn.addEventListener(
    "click",
    () => {

        if (
            !pokemonSeleccionado ||
            !pokemonSprites
        ) {

            return;

        }


        pokemonEsShiny =
            !pokemonEsShiny;


        shinyBtn.classList.toggle(
            "activo",
            pokemonEsShiny
        );


        shinyTexto.textContent =
            pokemonEsShiny
                ? "NORMAL"
                : "SHINY";


        sonido("shiny");


        /*
           Animado shiny
        */

        if (
            pokemonEsShiny &&
            pokemonSprites.animatedShiny
        ) {

            cambiarSprite(
                pokemonSprites.animatedShiny
            );

            return;

        }


        /*
           Normal animado
        */

        if (
            !pokemonEsShiny &&
            pokemonSprites.animated
        ) {

            cambiarSprite(
                pokemonSprites.animated
            );

            return;

        }


        /*
           Shiny estático
        */

        if (
            pokemonEsShiny &&
            pokemonSprites.shiny
        ) {

            cambiarSprite(
                pokemonSprites.shiny
            );

            return;

        }


        /*
           Normal estático
        */

        if (
            !pokemonEsShiny &&
            pokemonSprites.normal
        ) {

            cambiarSprite(
                pokemonSprites.normal
            );

            return;

        }


        /*
           Último fallback
        */

        cambiarSprite(

            pokemonEsShiny
                ? pokemonSprites.pokeapiShiny
                : pokemonSprites.pokeapiNormal

        );

    }
);


/* =====================================================
   CAMBIAR SPRITE
   ===================================================== */

function cambiarSprite(
    url
) {

    pokemonImagen.style.animation =
        "none";


    /*
       forzar reinicio
    */

    void pokemonImagen.offsetWidth;


    pokemonImagen.style.animation =
        "spriteEntrada 0.5s ease";


    pokemonImagen.onerror =
        () => {

            pokemonImagen.onerror =
                null;

            pokemonImagen.src =
                pokemonEsShiny
                    ? pokemonSprites.pokeapiShiny
                    : pokemonSprites.pokeapiNormal;

        };


    pokemonImagen.src =
        url;

}


/* =====================================================
   TIPOS
   ===================================================== */

function mostrarTipos(
    tipos
) {

    pokemonTipos.innerHTML = "";


    tipos.forEach(
        tipo => {

            const nombre =
                tipo.type.name;


            const span =
                document.createElement(
                    "span"
                );


            span.className =
                "tipo";


            span.textContent =
                NOMBRES_TIPOS[nombre] ||
                capitalizar(nombre);


            const color =
                COLORES_TIPOS[nombre] ||
                "#64748b";


            span.style.setProperty(
                "--tipo-color",
                color
            );


            pokemonTipos.appendChild(
                span
            );

        }
    );

}


/* =====================================================
   BOTON ESTRATEGIAS
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


            sonido("open");


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
        "⏳ CONSULTANDO BASE TÁCTICA...";


    try {

        const url =
            `${WORKER_URL.replace(/\/+$/, "")}/api/estrategias/${pokemonSeleccionado.id}`;


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


    }

    catch (error) {

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


    /*
       Insertamos el HTML que viene
       del Worker.
    */

    contenido.innerHTML =
        estrategia.html || "";


    /*
       ==============================================
       LIMPIAR HTML DE POKÉXPERTO
       ==============================================
    */

    limpiarContenidoPokexperto(
        contenido
    );


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
   LIMPIAR CONTENIDO DE POKÉXPERTO
   ===================================================== */

function limpiarContenidoPokexperto(
    contenedor
) {

    /*
       --------------------------------------------------
       1. CONVERTIR ICONOS DE TIPOS
       --------------------------------------------------
    */

    const imagenes =
        Array.from(
            contenedor.querySelectorAll("img")
        );


    imagenes.forEach(
        img => {

            const texto =
                (
                    img.alt ||
                    img.title ||
                    img.getAttribute("data-tooltip") ||
                    ""
                )
                .trim()
                .toLowerCase();


            /*
               Buscamos si la imagen representa
               un tipo Pokémon.
            */

            const tipo =
                detectarTipo(
                    texto,
                    img.src
                );


            if (tipo) {

                const span =
                    crearTipoEstrategia(
                        tipo
                    );


                img.replaceWith(
                    span
                );

                return;

            }


            /*
               ------------------------------------------------
               Imágenes normales
               ------------------------------------------------

               Las dejamos, pero quitamos tamaños
               absurdos que pueda traer Pokéxperto.
            */

            img.removeAttribute(
                "width"
            );

            img.removeAttribute(
                "height"
            );


            img.style.maxWidth =
                "100%";

            img.style.height =
                "auto";

        }
    );


    /*
       --------------------------------------------------
       2. LIMPIAR ESTILOS INLINE
       --------------------------------------------------
    */

    contenedor
        .querySelectorAll(
            "[style]"
        )
        .forEach(
            elemento => {

                elemento.style.maxWidth =
                    "100%";

                elemento.style.boxSizing =
                    "border-box";

            }
        );


    /*
       --------------------------------------------------
       3. TABLAS
       --------------------------------------------------
    */

    contenedor
        .querySelectorAll("table")
        .forEach(
            tabla => {

                tabla.removeAttribute(
                    "width"
                );


                tabla.style.maxWidth =
                    "100%";

            }
        );


    /*
       --------------------------------------------------
       4. LINKS
       --------------------------------------------------
    */

    contenedor
        .querySelectorAll("a")
        .forEach(
            enlace => {

                enlace.target =
                    "_blank";

                enlace.rel =
                    "noopener noreferrer";

            }
        );

}


/* =====================================================
   DETECTAR TIPO
   ===================================================== */

function detectarTipo(
    texto,
    src
) {

    const datos =
        `${texto} ${src}`.toLowerCase();


    const tipos =
        Object.keys(
            COLORES_TIPOS
        );


    for (
        const tipo of tipos
    ) {

        /*
           Buscamos palabras como:

           planta
           fire
           fuego
           tipo-planta
           type/grass
           etc.
        */

        const español =
            NOMBRES_TIPOS[tipo]
                ?.toLowerCase();


        if (
            datos.includes(tipo) ||
            (
                español &&
                datos.includes(español)
            )
        ) {

            return tipo;

        }

    }


    return null;

}


/* =====================================================
   CREAR TIPO PARA ESTRATEGIA
   ===================================================== */

function crearTipoEstrategia(
    tipo
) {

    const span =
        document.createElement(
            "span"
        );


    span.className =
        "estrategia-tipo";


    span.textContent =
        NOMBRES_TIPOS[tipo] ||
        capitalizar(tipo);


    span.style.setProperty(
        "--tipo-color",
        COLORES_TIPOS[tipo] ||
        "#64748b"
    );


    return span;

}


/* =====================================================
   CAPITALIZAR
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
   ARRANCAR
   ===================================================== */

cargarListaPokemon();
