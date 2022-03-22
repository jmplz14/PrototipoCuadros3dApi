var canvas;
import * as THREE from "/static/threejs/three.module.js";
import { OrbitControls } from "/static/threejs/OrbitControls.js";
import { TransformControls } from '/static/threejs/TransformControls.js';
import { STLLoader } from "/static/threejs/STLLoader.js";


let camera, scene, renderer, texture, materialTextura;
let mesh;
let loader;
let mouse = { x: 0, y: 0 };
let arrayCuadros = [];
let modelosSTL = [];
let totalFicherosSTL = 0;
//Marca si estamos añadiendo un nuevo elemento
let modoSeguirRaton = false;


iniciarAplicación();


function iniciarAplicación() {

    crearMenuColores();
    //crearMenuCuadros();
    crearMenuTipos();
    iniciarCanvas();
    asignarDroppableCanvas();
    //asignarDraggableCuadros();
    animate();

}






function onWindowResize() {

    camera.aspect = (window.innerWidth * 0.85) / (window.innerHeight * 0.9);
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.9);

}


function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

/*function crearMenuCuadros() {
    cuadros.forEach(cuadro => crearOpcionCuadro(cuadro));
}*/

function crearOpcionCuadro(cuadro) {
    var padre = $("#selectorColores");

    var divCuadro = document.createElement("div");
    divCuadro.className = "cuadro";

    var imgCuadro = document.createElement("img");
    imgCuadro.setAttribute("data-cuadro", cuadro.pk);
    imgCuadro.src = "static/imagenes/" + cuadro.fields.img

    var spanMedidas = document.createElement("span");
    spanMedidas.textContent = cuadro.fields.altoTotal + "cm x " + cuadro.fields.anchoTotal + "cm";

    divCuadro.append(imgCuadro);
    divCuadro.append(spanMedidas);
    padre.append(divCuadro)

}

function crearMenuTipos() {
    tiposCuadros.forEach(tipoCuadro => crearOpcionTipo(tipoCuadro));
    $(".icono").first().trigger("click");


}

function crearOpcionTipo(tipoCuadro) {
    console.log(tipoCuadro.pk)
    var padre = $("#menuIconos");

    var divTipo = document.createElement("div");
    divTipo.className = "icono";

    divTipo.onclick = function () {
        seleccionarOpciónTipo(this, tipoCuadro.pk);
    };

    var spanTipo = document.createElement("span");
    spanTipo.className = "material-icons";
    spanTipo.textContent = tipoCuadro.fields.icono;

    divTipo.append(spanTipo);
    padre.append(divTipo);

}

function seleccionarOpciónTipo(tipoElemento, idTipo) {

    if (!$(tipoElemento).hasClass('iconoSeleccionado')) {
        $(".icono").removeClass("iconoSeleccionado");
        $(tipoElemento).addClass('iconoSeleccionado');
        añadirClickMenuColores(idTipo);

        $(".circuloSeleccionado").trigger("click");
        //$(".circulo").removeClass("circuloSeleccionado");
        //añadirClickMenuColores(idTipo);

    }



}
function añadirClickMenuColores(idTipo) {
    let opcionesColores = $(".circulo");

    for (var i = 0; i < colores.length; i++) {
        let color = colores[i];
        opcionesColores[i].onclick = function () {
            seleccionarOpcionColor(this, idTipo, color.pk);
        };
    }
}

function seleccionarOpcionColor(selectorColor, idTipo, idColor) {
    $(".circulo").removeClass("circuloSeleccionado");
    $(selectorColor).addClass('circuloSeleccionado');
    filtrarCuadros(idTipo, idColor);

}
function crearMenuColores() {
    colores.forEach(color => crearOpcionColor(color));
    $(".circulo").first().addClass("circuloSeleccionado");
}



function crearOpcionColor(color) {
    var padre = $("#circulosColores");

    var circuloColor = document.createElement("span");
    circuloColor.className = "circulo";
    circuloColor.setAttribute("style", "background-color:" + color.fields.codigo + ";")
    padre.append(circuloColor);
    //<span class="circulo" style="background-color:{{color.codigo}}"></span>
}


function vaciarMenuCuadros() {
    $(".cuadro").remove();
}
function filtrarCuadros(idTipo, idColor) {

    vaciarMenuCuadros();
    for (var i = 0; i < cuadros.length; i++) {
        if (cuadros[i].fields.idTipo === idTipo && cuadros[i].fields.idColor === idColor) {
            crearOpcionCuadro(cuadros[i]);
        }
    }
    asignarDraggableCuadros();
}


//Funciones que tiene que ver con el canvas


function asignarDraggableCuadros(elemento) {
    //.cuadro>img
    $(".cuadro>img").draggable({
        helper: "clone",
        zIndex: 10000,
        tolerance: "pointer",
        scroll: false,
        start: function (event, ui) {
            $(this).draggable('instance').offset.click = {
                left: Math.floor(ui.helper.width() / 2),
                top: Math.floor(ui.helper.height() / 2)
            };
        },
        drag: function (event, ui) {
            if (modoSeguirRaton) {
                cuadroCambiarPosicion(event)

            }
        },
    });
}

function asignarDroppableCanvas() {
    $('#lienzo3D').droppable({
        drop: function (event, ui) {
            modoSeguirRaton = false;

        },

        over: function (event, ui) {
            modoSeguirRaton = true;
            dibujarCuadroEnLienzo(event, ui.helper.attr("data-cuadro"))
            $(".ui-draggable-dragging").hide();

        },

        out: function () {
            eliminarCuadroNuevo()
            modoSeguirRaton = false;
            $(".ui-draggable-dragging").show();

        }

    });
}

function eliminarCuadroNuevo() {
    eliminarMeshActual()

}

function buscarCuadro(idCuadro) {

    let numCuadros = cuadros.length;
    let i = 0;
    //alert(numCuadros)
    let cuadroEncontraso = false;
    let cuadroActual;
    while (i < numCuadros && !cuadroEncontraso) {
        //alert(cuadros[i].pk + " " + idCuadro);

        if (cuadros[i].pk == idCuadro) {

            cuadroActual = cuadros[i];
            cuadroEncontraso = true;
        }

        i++;
    }

    return cuadroActual;
}

function buscarFicheroSTL(idCuadro) {

    let numFicheros = modelosSTL.length;
    let i = 0;
    //alert(numCuadros)
    let modeloEncontrado = false;
    let modeloActual;
    while (i < numFicheros && !modeloEncontrado) {
        //alert(cuadros[i].pk + " " + idCuadro);

        if (modelosSTL[i][0] == idCuadro) {
            modeloActual = modelosSTL[i][1].clone();
            modeloEncontrado = true;
        }

        i++;
    }

    return modeloActual;
}



function dibujarCuadroEnLienzo(evento, idCuadro) {

    let cuadroActual = buscarCuadro(idCuadro);

    mesh = buscarFicheroSTL(idCuadro);
    cuadroCambiarPosicion(evento);
    scene.add(mesh);
    mesh.position.z = -5



}

function cuadroCambiarPosicion(evento) {
    mouse.x = (evento.clientX / (window.innerWidth * 0.85)) * 2 - 1;
    mouse.y = - (evento.clientY / (window.innerHeight * 0.9)) * 2 + 1;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    console.log(pos);
    mesh.position.copy(pos);
}

function eliminarMeshActual() {
    scene.remove(mesh);
    /*mesh.geometry.dispose();
    mesh.material.dispose();
    mesh = undefined;*/
}



function iniciarCanvas() {
    //iniciamos la camara y la escena
    texture = new THREE.TextureLoader().load("static/crate.gif");
    materialTextura = new THREE.MeshLambertMaterial({ color: 0x704f15 });
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new THREE.Scene();

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);

    scene.add(light)
    loader = new STLLoader();
    cargarFicherosSTL();
    //ponemos color a lae escena
    scene.background = new THREE.Color(0xb5b6b6);

    //iniciamos el canvas para que se visualice
    renderer = new THREE.WebGLRenderer({ canvas: lienzo3D });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.9);

    window.addEventListener('resize', onWindowResize);

}

function cargarSTL(cuadro) {

    loader.load("static/ficheros3D/" + cuadro.fields.fichero3D, (model) => {

        //var material = new THREE.MeshBasicMaterial({map: texture});

        var modelo = new THREE.Mesh(model, materialTextura);
        modelosSTL.push([cuadro.pk, modelo]);
        //mesh = modelo;
        totalFicherosSTL++;
        //scene.add(modelo);
    });



}

function cargarFicherosSTL() {
    cuadros.forEach(cuadro => cargarSTL(cuadro));

}

function cancelarCreacionNuevoCuadro() {
    if (modoNuevoElemento) {
        modoNuevoElemento = false;
        eliminarMeshActual();
    }
}