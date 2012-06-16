<!DOCTYPE html>

<html>
<head>
    <title>Canvas Prime</title>
    <link rel="stylesheet" type="text/css" href="style/style.css" />
</head>

<body>
    <div id="container">
        <canvas id="canvas">
            Download Google Chrome to play this game now!
        </canvas>
    </div>
    
    <!-- Temporarliy added for demo purposes, remove later -->
    <aside id="debug">
        <nav id="debug-nav">
            <a class="nav-item" href="#" data-id="debug-stats">Stats</a>
            <a class="nav-item active" href="#" data-id="debug-graph">Graphs</a>
        </nav>
        
        <div id="debug-stats" class="debug-container">
            <span class="info">
                <p class="info-text">
                    These are detailed instructions on how the stats section works.
                </p>
            </span>
            
            <ul class="debug-list">
                <li id="stat-fps" class="stat">
                    <span class="stat-name">FPS:</span>
                    <span class="stat-total">61</span>
                    <span class="stat-range">(27 - 57)</span>
                </li>
                <li id="stat-entity" class="stat">
                    <span class="stat-name">Entity#:</span>
                    <span class="stat-total">3</span>
                    <span class="stat-range">(3 - 7)</span>
                </li>
                <li id="stat-collisions" class="stat">
                    <span class="stat-name">Collisions:</span>
                    <span class="stat-total">0.04</span>
                    <span class="stat-range">(0.02 - 0.10) ms</span>

                </li>
                <li id="stat-draw" class="stat">
                    <span class="stat-name">Draw:</span>
                    <span class="stat-total">0.07</span>
                    <span class="stat-range">(0.02 - 0.08) ms</span>

                </li>
                <li id="stat-update" class="stat">
                    <span class="stat-name">Update:</span>
                    <span class="stat-total">0.07</span>
                    <span class="stat-range">(0.02 - 0.08) ms</span>

                </li>
                <li id="stat-other" class="stat">
                    <span class="stat-name">Other:</span>
                    <span class="stat-total">0.07</span>
                    <span class="stat-range">(0.02 - 0.08) ms</span>
                </li>
                </li>
                <li id="stat-total" class="stat">
                    <span class="stat-name">Total:</span>
                    <span class="stat-total">0.07</span>
                    <span class="stat-range">(0.02 - 0.08) ms</span>
                </li>
            </ul>
        </div>
        
        <div id="debug-graph" class="debug-container active">
            <div class="graph">
                <h3 class="graph-title">FPS <span class="graph-range">(10 - 52)</span></h3>
                <div class="graph-data">
                    <span class="graph-line" height="30%"></span>
                    <span class="graph-line" height="60%"></span>
                    <span class="graph-line" height="100%"></span>
                    <span class="graph-line" height="0"></span>
                </div>
                
            </div>
        </div>
    </aside>
    
    <!-- Load dependencies -->
    <script type="text/javascript" src="js/depen/animation.js"></script>
    <script type="text/javascript" src="js/depen/class_init.js"></script>
    
    <!-- Load all files in development -->
    <?php include 'include/files.php'; ?>
    
    <!-- Execute logic from assembled engine -->
    <script type="text/javascript" src="js/setup.js"></script>
</body>

</html>


