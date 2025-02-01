let score = 0;
        let speed = 4;
        let gameInterval;
        let moveInterval;
        let speedIncreaseInterval;
        let isGameOver = false;
        let highScore = localStorage.getItem('highScore') || 0;
        let isMovingRight = true;
        
        // T-Rex animation handler
        document.getElementById('trex').addEventListener('animationend', () => {
            const trex = document.getElementById('trex');
            trex.classList.remove('running', 'running-reverse');
            isMovingRight = !isMovingRight;
            trex.classList.add(isMovingRight ? 'running' : 'running-reverse');
        });

        function showInstructions() {
            document.getElementById('instructions-modal').style.display = 'block';
        }

        function closeInstructions() {
            document.getElementById('instructions-modal').style.display = 'none';
        }

        function createFallingObject() {
            const object = document.createElement('div');
            object.className = 'falling-object';
            const maxX = window.innerWidth - 120;
            object.style.left = `${Math.random() * maxX}px`;
            object.style.top = '-100px';

            object.addEventListener('click', () => {
                if (!isGameOver) {
                    score += 5;
                    document.getElementById('score-board').textContent = `Score: ${score}`;
                    object.remove();
                }
            });

            document.getElementById('game-container').appendChild(object);
        }

        function moveObjects() {
            const objects = document.getElementsByClassName('falling-object');
            for (let object of objects) {
                const currentTop = parseFloat(object.style.top);
                object.style.top = `${currentTop + speed}px`;

                if (currentTop > window.innerHeight - 100) {
                    endGame();
                    return;
                }
            }
        }

        function increaseSpeed() {
            speed += 2;
            console.log(`Speed increased to: ${speed}px/frame`);
        }

        function endGame() {
            isGameOver = true;
            clearInterval(gameInterval);
            clearInterval(moveInterval);
            clearInterval(speedIncreaseInterval);
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
               // document.getElementById('high-score').textContent = highScore;
            }
            
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('final-score').textContent = score;
            document.getElementById('end-high-score').textContent = highScore;
            document.getElementById('trex').classList.remove('running', 'running-reverse');
            document.getElementById('trex').style.display = 'none';

        }

        function startGame() {
            // Reset game state
            isGameOver = false;
            score = 0;
            speed = 4;
            isMovingRight = true;

            
            // Show game container
            document.getElementById('start-menu').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('trex').style.display = 'block';
            document.getElementById('score-board').textContent = 'Score: 0';
           
            // Start T-Rex animation
            const trex = document.getElementById('trex');
            trex.classList.add('running');
            trex.style.transform = 'scaleX(1)';
            
            // Clear existing objects
            const objects = document.getElementsByClassName('falling-object');
            while(objects.length > 0) objects[0].remove();
      
            
            // Start game loops
            gameInterval = setInterval(createFallingObject, 1000);
            moveInterval = setInterval(moveObjects, 30);
            speedIncreaseInterval = setInterval(increaseSpeed, 15000);
        }

        // Initialize game
        document.getElementById('high-score').textContent = highScore;
        document.getElementById('game-container').style.display = 'none';
