document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 15;
    const MIN_SPIES = 1;
    const DEFAULT_PLAYER_NAMES = [
        "Player1", "Player2", "Player3", "Player4", "Player5", 
        "Player6", "Player7", "Player8", "Player9", "Player10",
        "Player11", "Player12", "Player13", "Player14", "Player15"
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
            geography: [],
            filmtv: [],
            disney: []
        },
        topicNames: {
            geography: "Geografia",
            filmtv: "Film e TV",
            disney: "Disney e Pixar"
        },
        currentRound: 1,
        currentTopic: "",
        currentWord: "",
        usedWords: [],
        isLoading: true
    };
    
    // DOM Elements - Screens
    const screens = {
        playerSetup: document.getElementById('playerSetupScreen'),
        topicSelection: document.getElementById('topicSelectionScreen'),
        spyReveal: document.getElementById('spyRevealScreen'),
        gameTurn: document.getElementById('gameTurnScreen')
    };
    
    // DOM Elements - Loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    const fileInputArea = document.getElementById('fileInputArea');
    // const loadFilesBtn = document.getElementById('loadFilesBtn');
    
    // DOM Elements - Player Setup
    const p_decreaseBtn = document.getElementById('p_decreaseBtn');
    const p_increaseBtn = document.getElementById('p_increaseBtn');
    const playerCount = document.getElementById('playerCount');
    const playerFields = document.getElementById('playerFields');
    const s_decreaseBtn = document.getElementById('s_decreaseBtn');
    const s_increaseBtn = document.getElementById('s_increaseBtn');
    const spiesCount = document.getElementById('spiesCount');
    const toTopicsBtn = document.getElementById('toTopicsBtn');
    
    // DOM Elements - Topic Selection
    const topicsContainer = document.getElementById('topicsContainer');
    const backToPlayersBtn = document.getElementById('backToPlayersBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    
    // DOM Elements - Spy Reveal
    const revealPlayerName = document.getElementById('revealPlayerName');
    const showRoleBtn = document.getElementById('showRoleBtn');
    const roleInfo = document.getElementById('roleInfo');
    const revealRole = document.getElementById('revealRole');
    const secretWordSection = document.getElementById('secretWordSection');
    const revealSecretWord = document.getElementById('revealSecretWord');
    const nextPlayerBtn = document.getElementById('nextPlayerBtn');
    const startTurnBtn = document.getElementById('startTurnBtn');
    
    // DOM Elements - Game Turn
    const turnInfo = document.getElementById('turnInfo');
    const selectedTopic = document.getElementById('selectedTopic');
    const selectedWord = document.getElementById('selectedWord');
    const newWordBtn = document.getElementById('newWordBtn');
    const endGameBtn = document.getElementById('endGameBtn');
    
    // File upload elements (for local development)
    const geographyFile = document.getElementById('geographyFile');
    const filmtvFile = document.getElementById('filmtvFile');
    const disneyFile = document.getElementById('disneyFile');
    
    // Initialize the game
    initGame();
    
    // Create background particles
    createParticles();
    
    // Event Listeners - File Upload (for local development)
    if (loadFilesBtn) {
        loadFilesBtn.addEventListener('click', function() {
            loadWordsFromFiles()
                .then(() => {
                    fileInputArea.style.display = 'none';
                    showScreen('playerSetup');
                    hideLoading();
                })
                .catch(error => {
                    console.error('Error loading files:', error);
                    alert('Error loading word files. Please try again.');
                });
        });
    }
    
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
    
    toTopicsBtn.addEventListener('click', function() {
        showScreen('topicSelection');
    });
    
    // Event Listeners - Topic Selection
    backToPlayersBtn.addEventListener('click', function() {
        showScreen('playerSetup');
    });
    

    startGameBtn.addEventListener('click', function() {
        // Get selected topics
        gameState.selectedTopics = [];
        document.querySelectorAll('.topic-checkbox:checked').forEach(checkbox => {
            gameState.selectedTopics.push(checkbox.value);
        });
        
        if (gameState.selectedTopics.length === 0) {
            alert('Please select at least one topic.');
            return;
        }
        
        // Prepare for the game
        prepareGame();
        
        // Start with the spy reveal
        showScreen('spyReveal');
        startSpyReveal();
    });
    
    // Starting the game
    // Event Listeners - Topic Selection
    startGameBtn.addEventListener('click', function() {
        // Get selected topics
        gameState.selectedTopics = [];
        document.querySelectorAll('.topic-checkbox:checked').forEach(checkbox => {
            gameState.selectedTopics.push(checkbox.value);
        });
        
        if (gameState.selectedTopics.length === 0) {
            alert('Please select at least one topic.');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Load only the selected topic files
        loadSelectedTopics(gameState.selectedTopics)
            .then(() => {
                // Prepare for the game
                prepareGame();
                
                // Hide loading overlay
                hideLoading();
                
                // Start with the spy reveal
                showScreen('spyReveal');
                startSpyReveal();
            })
            .catch(error => {
                console.error('Error loading topic files:', error);
                alert('Error loading topic files. Please try again.');
                hideLoading();
            });
    });

    // Function to load selected topics
    function loadSelectedTopics(selectedTopics) {
        // Show loading overlay
        document.getElementById('loadingOverlay').style.display = 'flex';
        
        // Create an array of fetch promises for each selected topic
        const fetchPromises = selectedTopics.map(topic => {
            const fileMap = {
                'geography': 'data/geografia.txt',
                'filmtv': 'data/filmtv.txt',
                'disney': 'data/disney.txt'
            };
            
            return fetch(fileMap[topic])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${fileMap[topic]}`);
                    }
                    return response.text();
                })
                .then(text => {
                    // Parse the text file (one word per line)
                    const words = text.split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0);
                    
                    return { topic, words };
                });
        });
        
        // Process all fetch results
        return Promise.all(fetchPromises)
            .then(results => {
                // Initialize topic words object
                gameState.topicWords = {
                    geography: [],
                    filmtv: [],
                    disney: []
                };
                
                // Fill with the loaded words
                results.forEach(result => {
                    gameState.topicWords[result.topic] = result.words;
                });
                
                // Hide loading overlay
                document.getElementById('loadingOverlay').style.display = 'none';
            })
            .catch(error => {
                console.error('Error loading word files:', error);
                alert('Error loading word files. Please try again.');
                document.getElementById('loadingOverlay').style.display = 'none';
            });
    }


    // Event Listeners - Spy Reveal
    showRoleBtn.addEventListener('click', function() {
        roleInfo.style.display = 'block';
        showRoleBtn.style.display = 'none';
        
        // Show the appropriate buttons
        if (gameState.currentPlayerIndex < gameState.numPlayers - 1) {
            nextPlayerBtn.style.display = 'block';
        } else {
            startTurnBtn.style.display = 'block';
        }
    });
    
    nextPlayerBtn.addEventListener('click', function() {
        gameState.currentPlayerIndex++;
        showSpyReveal();
        
        // Reset the reveal screen
        roleInfo.style.display = 'none';
        showRoleBtn.style.display = 'block';
        nextPlayerBtn.style.display = 'none';
        startTurnBtn.style.display = 'none';
    });
    
    startTurnBtn.addEventListener('click', function() {
        showScreen('gameTurn');
        startGameTurn();
    });
    
    // Event Listeners - Game Turn
    newWordBtn.addEventListener('click', function() {
        selectRandomWord();
    });
    
    endGameBtn.addEventListener('click', function() {
        // Reset the game
        gameState.currentRound++;
        gameState.currentPlayerIndex = 0;
        gameState.spyIndices = [];
        gameState.usedWords = [];
        
        // Go back to topic selection for a new round
        showScreen('topicSelection');
    });
    
    // Helper Functions
    function initGame() {
        // Check if we're in development mode
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isDev && fileInputArea) {
            // Show file input in development mode
            fileInputArea.style.display = 'block';
        } else {
            // In production, load words from server
            loadWordsFromServer()
                .then(() => {
                    showScreen('playerSetup');
                    hideLoading();
                })
                .catch(error => {
                    console.error('Error loading words from server:', error);
                    alert('Error loading words. Please refresh the page to try again.');
                });
        }
        
        // Initialize player fields
        updatePlayerFields();
    }
    
    function loadWordsFromServer() {
        return new Promise((resolve, reject) => {
            // Define file URLs
            const fileUrls = {
                geography: 'geografia.txt',
                filmtv: 'filmtv.txt',
                disney: 'disney.txt'
            };
            
            // Load all files
            const promises = Object.entries(fileUrls).map(([topic, url]) => {
                return fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load ${url}: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(text => {
                        // Parse the text file (one word per line)
                        gameState.topicWords[topic] = text.split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0);
                    });
            });
            
            // Wait for all files to load
            Promise.all(promises)
                .then(() => {
                    gameState.isLoading = false;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    function loadWordsFromFiles() {
        return new Promise((resolve, reject) => {
            // Check if files are selected
            if (!geographyFile.files[0] || !filmtvFile.files[0] || !disneyFile.files[0]) {
                reject(new Error('Please select all three word files.'));
                return;
            }
            
            // Read files
            const fileReaders = [
                { file: geographyFile.files[0], topic: 'geography' },
                { file: filmtvFile.files[0], topic: 'filmtv' },
                { file: disneyFile.files[0], topic: 'disney' }
            ].map(item => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Parse the text file (one word per line)
                        gameState.topicWords[item.topic] = e.target.result.split('\n')
                            .map(line => line.trim())
                            .filter(line => line.length > 0);
                        resolve();
                    };
                    
                    reader.onerror = function() {
                        reject(new Error(`Error reading ${item.file.name}`));
                    };
                    
                    reader.readAsText(item.file);
                });
            });
            
            // Wait for all files to be read
            Promise.all(fileReaders)
                .then(() => {
                    gameState.isLoading = false;
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
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
            playerInput.value = gameState.players[i] || `Player${i + 1}`;
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
        
        // Reset player reveal index
        gameState.currentPlayerIndex = 0;
        
        // Select a random word from selected topics
        selectRandomWord();
    }
    
    function selectRandomWord() {
        // Get all words from selected topics
        let allWords = [];
        gameState.selectedTopics.forEach(topic => {
            allWords = allWords.concat(gameState.topicWords[topic]);
        });
        
        // Filter out used words
        const availableWords = allWords.filter(word => !gameState.usedWords.includes(word));
        
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
        
        // Update display if we're on the game turn screen
        if (screens.gameTurn.classList.contains('active')) {
            selectedWord.textContent = word;
            selectedTopic.textContent = gameState.topicNames[wordTopic];
            
            // Reset animation
            selectedWord.style.animation = 'none';
            setTimeout(() => {
                selectedWord.style.animation = 'pulse 1s ease-in-out';
            }, 10);
        }
    }
    
    function startSpyReveal() {
        gameState.currentPlayerIndex = 0;
        showSpyReveal();
    }
    
    function showSpyReveal() {
        // Update player name
        revealPlayerName.textContent = gameState.players[gameState.currentPlayerIndex];
        
        // Reset the role display
        roleInfo.style.display = 'none';
        showRoleBtn.style.display = 'block';
        nextPlayerBtn.style.display = 'none';
        startTurnBtn.style.display = 'none';
        
        // Set up the role information
        const isSpy = gameState.spyIndices.includes(gameState.currentPlayerIndex);
        
        if (isSpy) {
            revealRole.textContent = "SPIA";
            revealRole.className = "reveal-role role-spy";
            secretWordSection.style.display = 'none';
        } else {
            revealRole.textContent = "GIOCATORE";
            revealRole.className = "reveal-role role-player";
            secretWordSection.style.display = 'block';
            revealSecretWord.textContent = gameState.currentWord;
        }
    }
    
    function startGameTurn() {
        // Update display
        turnInfo.textContent = `Round ${gameState.currentRound}`;
        selectedTopic.textContent = gameState.topicNames[gameState.currentTopic];
        selectedWord.textContent = gameState.currentWord;
    }
    
    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the selected screen
        screens[screenName].classList.add('active');
    }
    
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
    
    function createParticles() {
        // Create floating background particles
        const numParticles = 50;
        const colors = [
            '#4682b4', '#dc143c', '#32cd32', 
            '#ffa500', '#8a2be2', '#1e90ff'
        ];
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = 5 + Math.random() * 15;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Set translate variables for animation
            const translateX = -50 + Math.random() * 100;
            const translateY = -50 + Math.random() * 100;
            
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
    }
});