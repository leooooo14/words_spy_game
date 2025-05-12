document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 15;
    const MIN_SPIES = 1;
    const DEFAULT_PLAYER_NAMES = [
        "Player 1", "Player 2", "Player 3", "Player 4", "Player 5", 
        "Player 6", "Player 7", "Player 8", "Player 9", "Player 10",
        "Player 11", "Player 12", "Player 13", "Player 14", "Player 15"
    ];
    
    // Game state
    const gameState = {
        players: DEFAULT_PLAYER_NAMES.slice(0, 3),
        numPlayers: 3,
        numSpies: 1,
        spyIndices: [],
        currentPlayerIndex: 0,
        selectedTopics: ["geography", "filmtv", "disney"],
        topicWords: {
            geography: [
                "Mount Everest", "Nile River", "Amazon Rainforest", 
                "Great Barrier Reef", "Grand Canyon", "Sahara Desert", 
                "Venice", "Great Wall of China", "Machu Picchu", "Eiffel Tower"
            ],
            filmtv: [
                "Star Wars", "Game of Thrones", "Titanic", 
                "Breaking Bad", "The Matrix", "Stranger Things", 
                "Jurassic Park", "Harry Potter", "The Simpsons", "Avengers"
            ],
            disney: [
                "Mickey Mouse", "Lion King", "Frozen", 
                "Finding Nemo", "Toy Story", "Aladdin", 
                "Beauty and the Beast", "Moana", "The Little Mermaid", "Inside Out"
            ]
        },
        topicNames: {
            geography: "Geografia",
            filmtv: "Film e TV",
            disney: "Disney e Pixar"
        },
        currentWord: "",
        currentTopic: "",
        usedWords: [],
        timer: {
            minutes: 10,
            seconds: 0,
            interval: null,
            isRunning: false
        }
    };
    
    // DOM Elements - Screens
    const screens = {
        playerSetup: document.getElementById('playerSetupScreen'),
        playerPass: document.getElementById('playerPassScreen'),
        playerRole: document.getElementById('playerRoleScreen'),
        gamePlay: document.getElementById('gamePlayScreen'),
        gameEnd: document.getElementById('gameEndScreen')
    };
    
    // DOM Elements - Player Setup
    const p_decreaseBtn = document.getElementById('p_decreaseBtn');
    const p_increaseBtn = document.getElementById('p_increaseBtn');
    const playerCount = document.getElementById('playerCount');
    const playerFields = document.getElementById('playerFields');
    const s_decreaseBtn = document.getElementById('s_decreaseBtn');
    const s_increaseBtn = document.getElementById('s_increaseBtn');
    const spiesCount = document.getElementById('spiesCount');
    const startGameBtn = document.getElementById('startGameBtn');
    
    // DOM Elements - Player Pass
    const currentPlayerName = document.getElementById('currentPlayerName');
    const readyBtn = document.getElementById('readyBtn');
    
    // DOM Elements - Player Role
    const citizenRole = document.getElementById('citizenRole');
    const spyRole = document.getElementById('spyRole');
    const wordDisplay = document.getElementById('wordDisplay');
    const topicDisplay = document.getElementById('topicDisplay');
    const topicDisplaySpy = document.getElementById('topicDisplaySpy');
    const otherSpiesContainer = document.getElementById('otherSpiesContainer');
    const gotItBtn = document.getElementById('gotItBtn');
    
    // DOM Elements - Game Play
    const timerDisplay = document.getElementById('timerDisplay');
    const timerBtn = document.getElementById('timerBtn');
    const revealSpiesBtn = document.getElementById('revealSpiesBtn');
    
    // DOM Elements - Game End
    const finalWordDisplay = document.getElementById('finalWordDisplay');
    const finalTopicDisplay = document.getElementById('finalTopicDisplay');
    const spyListDisplay = document.getElementById('spyListDisplay');
    const newGameBtn = document.getElementById('newGameBtn');
    
    // Create background particles
    createParticles();
    
    // Initialize player fields
    updatePlayerFields();
    
    // Event Listeners - Player Setup
    p_decreaseBtn.addEventListener('click', function() {
        if (gameState.numPlayers > MIN_PLAYERS) {
            gameState.numPlayers--;
            playerCount.textContent = gameState.numPlayers;
            playerCount.classList.add('pulse');
            setTimeout(() => playerCount.classList.remove('pulse'), 300);
            updatePlayerFields();
            
            // Adjust spies if needed
            if (gameState.numSpies > Math.floor(gameState.numPlayers / 2)) {
                gameState.numSpies = Math.floor(gameState.numPlayers / 2);
                spiesCount.textContent = gameState.numSpies;
            }
        }
    });
    
    p_increaseBtn.addEventListener('click', function() {
        if (gameState.numPlayers < MAX_PLAYERS) {
            gameState.numPlayers++;
            playerCount.textContent = gameState.numPlayers;
            playerCount.classList.add('pulse');
            setTimeout(() => playerCount.classList.remove('pulse'), 300);
            updatePlayerFields();
        }
    });
    
    s_decreaseBtn.addEventListener('click', function() {
        if (gameState.numSpies > MIN_SPIES) {
            gameState.numSpies--;
            spiesCount.textContent = gameState.numSpies;
            spiesCount.classList.add('pulse');
            setTimeout(() => spiesCount.classList.remove('pulse'), 300);
        }
    });
    
    s_increaseBtn.addEventListener('click', function() {
        // Make sure there are more non-spies than spies
        if (gameState.numSpies < Math.floor(gameState.numPlayers / 2)) {
            gameState.numSpies++;
            spiesCount.textContent = gameState.numSpies;
            spiesCount.classList.add('pulse');
            setTimeout(() => spiesCount.classList.remove('pulse'), 300);
        }
    });
    
    // Event Listeners - Start Game
    startGameBtn.addEventListener('click', function() {
        // Check if at least one topic is selected
        const selectedTopics = [];
        document.querySelectorAll('.topic-checkbox:checked').forEach(checkbox => {
            selectedTopics.push(checkbox.value);
        });
        
        if (selectedTopics.length === 0) {
            alert('Please select at least one topic.');
            return;
        }
        
        // Update selected topics
        gameState.selectedTopics = selectedTopics;
        
        // Update player names
        document.querySelectorAll('.player-input').forEach((input, index) => {
            gameState.players[index] = input.value || `Player ${index + 1}`;
        });
        
        // Prepare the game
        prepareGame();
        
        // Start with the player pass screen
        gameState.currentPlayerIndex = 0;
        startPlayerPass();
    });
    
    // Event Listeners - Player Pass
    readyBtn.addEventListener('click', function() {
        showScreen('playerRole');
        showPlayerRole();
    });
    
    // Event Listeners - Player Role
    gotItBtn.addEventListener('click', function() {
        // Move to the next player or to the game play
        gameState.currentPlayerIndex++;
        
        if (gameState.currentPlayerIndex < gameState.numPlayers) {
            // More players to reveal
            startPlayerPass();
        } else {
            // All players have seen their roles
            showScreen('gamePlay');
            resetTimer();
        }
    });
    
    // Event Listeners - Game Play
    timerBtn.addEventListener('click', function() {
        if (gameState.timer.isRunning) {
            // Stop the timer
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
            timerBtn.textContent = 'Start Timer';
        } else {
            // Start the timer
            gameState.timer.interval = setInterval(updateTimer, 1000);
            gameState.timer.isRunning = true;
            timerBtn.textContent = 'Stop Timer';
        }
    });
    
    revealSpiesBtn.addEventListener('click', function() {
        // Stop the timer if it's running
        if (gameState.timer.isRunning) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
        }
        
        // Show the game end screen
        showGameEnd();
    });
    
    // Event Listeners - Game End
    newGameBtn.addEventListener('click', function() {
        // Reset the game and show the player setup screen
        resetGame();
        showScreen('playerSetup');
    });
    
    function updatePlayerFields() {
        // Clear existing fields
        playerFields.innerHTML = '';
        
        // Add fields for each player
        for (let i = 0; i < gameState.numPlayers; i++) {
            const playerField = document.createElement('div');
            playerField.className = 'player-field';
            
            const playerLabel = document.createElement('div');
            playerLabel.className = 'player-label';
            playerLabel.textContent = `${i + 1}:`;
            
            const playerInput = document.createElement('input');
            playerInput.type = 'text';
            playerInput.className = 'player-input';
            playerInput.value = gameState.players[i] || `Player ${i + 1}`;
            playerInput.maxLength = 15;
            playerInput.dataset.playerIndex = i;
            
            // Update player name when input changes
            playerInput.addEventListener('input', function() {
                const index = parseInt(this.dataset.playerIndex);
                gameState.players[index] = this.value;
            });
            
            playerField.appendChild(playerLabel);
            playerField.appendChild(playerInput);
            playerFields.appendChild(playerField);
        }
    }
    
    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        screens[screenName].classList.add('active');
    }
    
    function prepareGame() {
        // Assign spy roles
        gameState.spyIndices = [];
        
        // Randomly select spies
        while (gameState.spyIndices.length < gameState.numSpies) {
            const randomIndex = Math.floor(Math.random() * gameState.numPlayers);
            if (!gameState.spyIndices.includes(randomIndex)) {
                gameState.spyIndices.push(randomIndex);
            }
        }
        
        // Select a random word
        selectRandomWord();
    }
    
    function selectRandomWord() {
        // Get all words from selected topics
        let allWords = [];
        gameState.selectedTopics.forEach(topic => {
            allWords = allWords.concat(gameState.topicWords[topic]);
        });
        
        // Filter out used words
        let availableWords = allWords.filter(word => !gameState.usedWords.includes(word));
        
        // If all words have been used, reset the used words array
        if (availableWords.length === 0) {
            gameState.usedWords = [];
            availableWords = allWords;
        }
        
        // Select a random word
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords[randomIndex];
        
        // Determine which topic this word belongs to
        let wordTopic = "";
        for (const topic of gameState.selectedTopics) {
            if (gameState.topicWords[topic].includes(word)) {
                wordTopic = topic;
                break;
            }
        }
        
        // Update game state
        gameState.currentWord = word;
        gameState.currentTopic = wordTopic;
        gameState.usedWords.push(word);
    }
    
    function startPlayerPass() {
        // Show the player pass screen
        showScreen('playerPass');
        
        // Update the player name
        currentPlayerName.textContent = gameState.players[gameState.currentPlayerIndex];
    }
    
    function showPlayerRole() {
        // Hide both role divs initially
        citizenRole.style.display = 'none';
        spyRole.style.display = 'none';
        
        // Check if the current player is a spy
        const isSpy = gameState.spyIndices.includes(gameState.currentPlayerIndex);
        
        if (isSpy) {
            // Show spy role
            spyRole.style.display = 'block';
            topicDisplaySpy.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;
            
            // Check if there are multiple spies
            if (gameState.spyIndices.length > 1) {
                otherSpiesContainer.style.display = 'block';
                otherSpiesContainer.innerHTML = '<p>The other spies are:</p>';
                
                // Get other spy indices (all spies except current player)
                const otherSpyIndices = gameState.spyIndices.filter(index => index !== gameState.currentPlayerIndex);
                
                // Create elements for each other spy
                otherSpyIndices.forEach(spyIndex => {
                    const spyName = gameState.players[spyIndex];
                    const spyElement = document.createElement('span');
                    spyElement.className = 'other-spy-name';
                    spyElement.textContent = spyName;
                    otherSpiesContainer.appendChild(spyElement);
                });
            } else {
                // If only one spy, hide the container
                otherSpiesContainer.style.display = 'none';
            }
        } else {
            // Show citizen role with the word
            citizenRole.style.display = 'block';
            wordDisplay.textContent = gameState.currentWord;
            topicDisplay.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;
        }
    }
    
    function resetTimer() {
        // Reset timer values
        gameState.timer.minutes = 10;
        gameState.timer.seconds = 0;
        gameState.timer.isRunning = false;
        
        // Update display
        timerDisplay.textContent = '10:00';
        timerBtn.textContent = 'Start Timer';
        
        // Clear any existing intervals
        if (gameState.timer.interval) {
            clearInterval(gameState.timer.interval);
        }
    }
    
    function updateTimer() {
        // Decrease seconds
        gameState.timer.seconds--;
        
        // Handle minute change
        if (gameState.timer.seconds < 0) {
            gameState.timer.minutes--;
            gameState.timer.seconds = 59;
        }
        
        // Check if timer is done
        if (gameState.timer.minutes < 0) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
            timerBtn.textContent = 'Time\'s Up!';
            timerBtn.disabled = true;
            return;
        }
        
        // Update display
        const minutesStr = gameState.timer.minutes.toString().padStart(2, '0');
        const secondsStr = gameState.timer.seconds.toString().padStart(2, '0');
        timerDisplay.textContent = `${minutesStr}:${secondsStr}`;
    }
    
    function showGameEnd() {
        // Show the game end screen
        showScreen('gameEnd');
        
        // Display the word and topic
        finalWordDisplay.textContent = gameState.currentWord;
        finalTopicDisplay.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;
        
        // Show the spies
        spyListDisplay.innerHTML = '';
        spyListDisplay.style.display = 'block';
        
        if (gameState.spyIndices.length > 0) {
            gameState.spyIndices.forEach(spyIndex => {
                const spyName = gameState.players[spyIndex];
                const spyElement = document.createElement('div');
                spyElement.textContent = spyName;
                spyListDisplay.appendChild(spyElement);
            });
        } else {
            spyListDisplay.textContent = 'No spies in this game!';
        }
    }
    
    function resetGame() {
        // Reset game state
        gameState.currentPlayerIndex = 0;
        gameState.spyIndices = [];
        
        // Stop timer if running
        if (gameState.timer.isRunning) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
        }
        
        // Re-enable timer button
        timerBtn.disabled = false;
    }
    
    function createParticles() {
        // Create floating background particles
        // Reduce number on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const numParticles = isMobile ? 15 : 30;
        const colors = [
            '#4682b4', '#dc143c', '#32cd32', 
            '#ffa500', '#8a2be2', '#1e90ff'
        ];
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = 5 + Math.random() * (isMobile ? 10 : 15);
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Set translate variables for animation
            const translateX = -40 + Math.random() * 80;
            const translateY = -40 + Math.random() * 80;
            
            // Set styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.setProperty('--translate-x', `${translateX}px`);
            particle.style.setProperty('--translate-y', `${translateY}px`);
            
            // Set animation
            const animationDuration = 5 + Math.random() * 10;
            particle.style.animation = `floatParticle ${animationDuration}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Add to document
            document.body.appendChild(particle);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Remove all existing particles
            document.querySelectorAll('.particle').forEach(el => el.remove());
            // Create new particles appropriate for the new size
            createParticles();
        });
    }
});
