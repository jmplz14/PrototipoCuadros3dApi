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


init();
animate();

function init() {
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
    /*$('.cuadro').mousedown(function (evento) {
        inicioCreacionNuevoCuadro(evento);
    });*/
    /*$('.cuadro').draggable({
        helper: "clone", function(evento) {
            //inicioCreacionNuevoCuadro(evento);
        });*/

    $(".cuadro>img").draggable({
        helper: "clone",
        zIndex:10000,
        tolerance: "pointer",
        scroll: false,
        start: function(event, ui){
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
    $('#lienzo3D').droppable({
        drop: function (event, ui) {
            console.log("dejado");
            modoSeguirRaton = false;
            
        },

        over: function (event,ui) {
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
    alert("Hola")
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

