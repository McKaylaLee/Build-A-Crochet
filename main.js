<script>
    let scene, camera, renderer, controls, currentEgg, ghostEgg;
    let isPlacementMode = false, dragTarget = null, isDragging = false;
    let groupHandles = [], groupRotHandles = [], groupGizmo;
    let startScale, mouseButton, startHandleDist = 1;
    let undoStack = [], redoStack = [];
    let currentSelection = [], isBoxSelecting = false, boxStart = new THREE.Vector2();
    let startGroupData = [], startMouseAngle = 0;
    let dragStartPoint = null, startPositions = [];
    
    const BASE_H = 20, BASE_R = 7;

    function init() {
        scene = new THREE.Scene(); 
        scene.background = new THREE.Color(0xffffff);
        
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
        camera.position.set(150, 150, 150);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
        
        const grid = new THREE.GridHelper(1000, 50, 0x666666, 0xcccccc);
        grid.position.y = -0.2; 
        scene.add(grid);
        
        scene.add(new THREE.AmbientLight(0xffffff, 1.2));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6); 
        dirLight.position.set(100, 200, 100); 
        scene.add(dirLight);
        
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };
        
        createGroupGizmo(); createGhost();
        
        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        
        captureState(); 
        animate();
    }
