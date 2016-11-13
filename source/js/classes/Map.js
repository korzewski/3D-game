import Babylon from 'babylonjs';

const squareSize = 4;
const textureScale = 5;

export default class Map {
    constructor(scene) {
        this.scene = scene;

        this.wallsMaterial = new Babylon.StandardMaterial('material', this.scene);
        this.wallsMaterial.emissiveColor = new Babylon.Color3(0.5, 0.5, 0.5);
        this.wallsMaterial.diffuseTexture = new Babylon.Texture('../extra/img/texture1.png', this.scene);
        this.wallsMaterial.diffuseTexture.uScale = textureScale;
        this.wallsMaterial.diffuseTexture.vScale = textureScale;

        this.floorMaterial = new Babylon.StandardMaterial('material', this.scene);
        this.floorMaterial.emissiveColor = new Babylon.Color3(0.3, 0.3, 0.3);
        this.floorMaterial.diffuseTexture = new Babylon.Texture('../extra/img/texture2.png', this.scene);
        this.floorMaterial.diffuseTexture.uScale = textureScale;
        this.floorMaterial.diffuseTexture.vScale = textureScale;

        this.loadLevel('level1');
    }

    render() {
        // this.box.rotation.y += 0.01;
        // this.box.rotation.z += 0.01;
    }

    loadLevel(levelName) {
        const levelData = {};

        fetch(`../../extra/maps/${levelName}.json`).then(function(response) { 
            return response.json();
        }).then((data) => {
            levelData.width = data.width;
            levelData.height = data.height;
            levelData.layers = {};

            data.layers.forEach(layer => {
                let layerData = [];

                for(let i = 0; i < levelData.width; i++) {
                    for(let j = 0; j < levelData.height; j++) {
                        if(layer.data[i * levelData.width + j] !== 0) {
                            layerData.push({x: j, y: i});
                        }
                    }
                }

                levelData.layers[layer.name] = layerData;
            });

            this.generateWorld(levelData);
        });
    }

    generateWorld(levelData) {
        this.floorMeshes = [];
        levelData.layers.floor.forEach(floorData => {
            const floorMesh = Babylon.Mesh.CreateGround('ground', squareSize, squareSize, 1, this.scene);
            floorMesh.material = this.floorMaterial;
            floorMesh.position.x = floorData.x * squareSize;
            floorMesh.position.z = floorData.y * squareSize;
            floorMesh.checkCollisions = true;

            this.floorMeshes[this.floorMeshes.length] = floorMesh;
        });

        this.wallMeshes = [];
        levelData.layers.walls.forEach(wallData => {
            const wallMesh = Babylon.Mesh.CreateBox('box', squareSize + 0.02, this.scene);
            wallMesh.material = this.wallsMaterial;
            wallMesh.position.x = wallData.x * squareSize;
            wallMesh.position.z = wallData.y * squareSize;
            wallMesh.position.y = squareSize/2 + 0.02;
            wallMesh.checkCollisions = true;

            this.wallMeshes[this.wallMeshes.length] = wallMesh;
        });

        this.worldIsReady = true;
    }
}
