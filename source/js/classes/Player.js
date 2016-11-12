import Babylon from 'babylonjs';

const keysPressed = {
    left: false,
    up: false,
    right: false,
    down: false,
    turnLeft: false,
    turnRight: false
};

const moveSpeed = 8;
const rotationSpeed = 0.04;
const gravity = 0;

export default class Player {
    constructor(scene, map) {
        initKeyboard();

        this.map = map;

        this.camera = new Babylon.FreeCamera('camera', new Babylon.Vector3.Zero(), scene);
        this.camera.setTarget(Babylon.Vector3.Zero());

        this.light = new Babylon.PointLight('light', new Babylon.Vector3.Zero(), scene);
        this.light.rotation = new Babylon.Vector3(0, 1, 0);
        this.light.intensity = 0.2;

        this.playerMesh = new Babylon.Mesh.CreateSphere('playerMesh', 5, 2, scene);
        this.playerMesh.position = new Babylon.Vector3(4, 2, 4);
    }

    // beforeRender() {
        // if(this.map.worldIsReady) {
        //     this.map.wallMeshes.forEach(wall => {
        //         if(this.playerMesh.intersectsMesh(wall, false)) {
        //             console.log('collision');
        //         }
        //     });
        // }
    // }

    render() {
        this.updateMove();

        // this.camera.position = new Babylon.Vector3(this.playerMesh.position.x, this.playerMesh.position.y, this.playerMesh.position.z - 5);
        this.camera.position = this.playerMesh.position;
        this.camera.rotation = this.playerMesh.rotation;
        this.light.position = new Babylon.Vector3(this.playerMesh.position.x, this.playerMesh.position.y - 5, this.playerMesh.position.z);
    }

    updateMove() {
        const forwardVector = new Babylon.Vector3(parseFloat(Math.sin(this.playerMesh.rotation.y)) / moveSpeed, gravity, parseFloat(Math.cos(this.playerMesh.rotation.y)) / moveSpeed);

        if(keysPressed.right) {
            this.playerMesh.moveWithCollisions(new Babylon.Vector3(0.1, 0, 0));
        } else if(keysPressed.left) {
            this.playerMesh.moveWithCollisions(new Babylon.Vector3(-0.1, 0, 0));
        }

        if(keysPressed.up) {
            this.playerMesh.moveWithCollisions(forwardVector);
        } else if(keysPressed.down) {
            const backwardVector = forwardVector.negate();
            this.playerMesh.moveWithCollisions(backwardVector);
        }

        if(keysPressed.turnRight) {
            this.playerMesh.rotation.y += rotationSpeed;
        } else if(keysPressed.turnLeft) {
            this.playerMesh.rotation.y -= rotationSpeed;
        }
    }
}

function initKeyboard() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            keysPressed.right = true;
        } else if(e.keyCode == 37) {
            keysPressed.left = true;
        }

        if(e.keyCode == 38) {
            keysPressed.up = true;
        } else if(e.keyCode == 40) {
            keysPressed.down = true;
        }

        if(e.keyCode == 65) {
            keysPressed.turnLeft = true;
        } else if(e.keyCode == 68) {
            keysPressed.turnRight = true;
        }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            keysPressed.right = false;
        } else if(e.keyCode == 37) {
            keysPressed.left = false;
        }

        if(e.keyCode == 38) {
            keysPressed.up = false;
        } else if(e.keyCode == 40) {
            keysPressed.down = false;
        }

        if(e.keyCode == 65) {
            keysPressed.turnLeft = false;
        } else if(e.keyCode == 68) {
            keysPressed.turnRight = false;
        }
    }
}
