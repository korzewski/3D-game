import Babylon from 'babylonjs';
import Map from './classes/Map';
import Player from './classes/Player';

function init() {
    const canvas = document.getElementById('game');
    const engine = new Babylon.Engine(canvas);
    const scene = new Babylon.Scene(engine);
    scene.clearColor = new Babylon.Color3(0.1, 0.1, 0.1);
    scene.collisionsEnabled = true;
    // scene.debugLayer.show();

    window.addEventListener("resize", () => {
        engine.resize();
    });

    const map = new Map(scene);
    const player = new Player(scene, map);

    // scene.registerBeforeRender(() => {
    //     player.beforeRender();
    // });

    engine.runRenderLoop(() => {
        map.render();
        player.render();
        scene.render();
    });
};

init();
