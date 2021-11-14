var canvas;
import * as THREE from "/static/threejs/three.module.js";
import { OrbitControls } from "/static/threejs/OrbitControls.js";
import { TransformControls } from '/static/threejs/TransformControls.js';
import { STLLoader } from "/static/threejs/STLLoader.js";


let camera, scene, renderer;
let mesh;
let mouse = { x: 0, y: 0 };

//Marca si estamos añadiendo un nuevo elemento
let modoSeguirRaton = false;


iniciarAplicación();


function iniciarAplicación() {

    crearMenuColores();
    //crearMenuCuadros();
    crearMenuTipos();
    iniciarCanvas();
    asignarDroppableCanvas();
    asignarDraggableCuadros();
    animate();

}

function iniciarCanvas() {
    //iniciamos la camara y la escena
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new THREE.Scene();

    //ponemos color a lae escena
    scene.background = new THREE.Color(0xb5b6b6);





    //iniciamos el canvas para que se visualice
    renderer = new THREE.WebGLRenderer({ canvas: lienzo3D });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.9);

    window.addEventListener('resize', onWindowResize);

}

function eliminarCuadroNuevo() {
    eliminarMeshActual()

}
function crearCuadroNuevo(evento) {
    const texture = new THREE.TextureLoader().load('/static/crate.gif');

    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    mesh = new THREE.Mesh(geometry, material);
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

function cancelarCreacionNuevoCuadro() {
    if (modoNuevoElemento) {
        modoNuevoElemento = false;
        eliminarMeshActual();
    }
}




function onWindowResize() {

    camera.aspect = (window.innerWidth * 0.85) / (window.innerHeight * 0.9);
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.9);

}


function animate() {

    requestAnimationFrame(animate);
    /*if (modoSeguirRaton) {
        cuadroCambiarPosicion();
    }*/
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
        asignarDraggableCuadros();
    }
    
    

}
function añadirClickMenuColores(idTipo){
    let opcionesColores = $(".circulo");
    
    for (var i = 0; i < colores.length; i++){
        let color = colores[i];
        opcionesColores[i].onclick = function () {
            seleccionarOpcionColor(this, idTipo, color.pk);
        };
    }
}

function seleccionarOpcionColor(selectorColor, idTipo, idColor){
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
}



function asignarDraggableCuadros() {
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
            console.log("dejado");
            modoSeguirRaton = false;

        },

        over: function (event, ui) {
            modoSeguirRaton = true;
            crearCuadroNuevo(event)
            $(".ui-draggable-dragging").hide();

        },

        out: function () {
            eliminarCuadroNuevo()
            modoSeguirRaton = false;
            $(".ui-draggable-dragging").show();


        }

    });
}