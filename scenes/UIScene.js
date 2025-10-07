class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }

    create() {
        this.gameScene = this.scene.get('GameScene');
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Adatta la posizione del testo di stato per mobile (in alto a destra)
        this.statusText = this.add.text(gameWidth - 20, 20, '', { 
            fontSize: '18px', 
            fill: '#000000', // Testo nero per leggibilità sullo sfondo chiaro
            fontStyle: 'bold', 
            align: 'right' 
        }).setOrigin(1, 0);

        // Il testo di interazione sopra i filosofi ([E] Parla)
        this.interactionText = this.add.text(gameWidth / 2, gameHeight * 0.75, '[E] Parla', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#000' 
        }).setOrigin(0.5).setVisible(false);
        
        // Dialog box adattata per essere più in basso e larga
        this.dialogBox = this.add.graphics().setVisible(false);
        this.dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(gameWidth * 0.05, gameHeight * 0.65, gameWidth * 0.9, gameHeight * 0.3, 16);
        this.dialogText = this.add.text(gameWidth * 0.08, gameHeight * 0.68, '', { 
            fontSize: '20px', 
            fill: '#fff', 
            wordWrap: { width: gameWidth * 0.84 } 
        }).setVisible(false);
        
        this.quizData = { /* ... non cambia ... */ };
        this.gameState = { completed: [] };
        this.updateStatusText();

        this.gameScene.events.on('interactionUpdate', (philosopher) => {
            if (!this.sys.game.isMobile) { // Solo per PC, il pulsante 'E' è gestito dalla GameScene per mobile
                if (philosopher && !this.gameState.completed.includes(philosopher.name)) { 
                    this.interactionText.setPosition(philosopher.x, philosopher.y - 50).setVisible(true); 
                } else { 
                    this.interactionText.setVisible(false); 
                }
            } else {
                this.interactionText.setVisible(false); // Nascondi sempre su mobile, useremo il pulsante "E" globale
            }
        });
        this.gameScene.events.on('startDialog', (philosopherName) => { this.startDialog(philosopherName); });

        // Evento di resize per adattare gli elementi quando la finestra cambia dimensione
        this.scale.on('resize', this.resize, this);
        this.resize({ width: gameWidth, height: gameHeight }); // Chiama resize una volta per inizializzare
    }

    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.main.setViewport(0, 0, width, height);

        // Riadatta tutti gli elementi della UI
        this.statusText.setPosition(width - 20, 20);
        this.interactionText.setPosition(width / 2, height * 0.75);
        
        this.dialogBox.clear(); // Ridisegna la dialog box
        this.dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(width * 0.05, height * 0.65, width * 0.9, height * 0.3, 16);
        this.dialogText.setPosition(width * 0.08, height * 0.68);
        this.dialogText.setWordWrapWidth(width * 0.84); // Aggiorna il word wrap

        // Riposiziona i pulsanti "Vero/Falso" se presenti
        if (this.answerButtons && this.answerButtons.length > 0) {
            this.answerButtons[0].setPosition(width * 0.25, height * 0.88); // Vero
            this.answerButtons[1].setPosition(width * 0.75, height * 0.88); // Falso
        }
    }

    typewriteText(text, onCompleteCallback) { /* ... non cambia ... */ }
    startDialog(philosopherName) { /* ... non cambia ... */ }

    showQuestion() { 
        const questionData = this.quizData[this.currentPhilosopher].questions[this.quizIndex];
        if (!questionData) { this.endQuiz(); return; }
        if (this.answerButtons) this.answerButtons.forEach(b => b.destroy());
        this.answerButtons = [];
        this.typewriteText(questionData.q, () => {
            // Posizioni dei pulsanti "Vero/Falso" adattate per mobile
            const gameWidth = this.sys.game.config.width;
            const gameHeight = this.sys.game.config.height;
            this.answerButtons = [
                this.createButton(gameWidth * 0.25, gameHeight * 0.88, 'Vero', true),
                this.createButton(gameWidth * 0.75, gameHeight * 0.88, 'Falso', false)
            ];
        });
    }

    createButton(x, y, text, answer) { /* ... non cambia ... */ }
    handleAnswer(playerAnswer) { /* ... non cambia ... */ }
    endQuiz() { /* ... non cambia ... */ }
    closeDialog() { /* ... non cambia ... */ }
    winGame() { /* ... non cambia ... */ }
    updateStatusText() { 
        const text = ['Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora'].map(p => {
            // Adatta il nome per lo status text in mobile, se troppo lungo
            const displayName = p.length > 8 && this.sys.game.isMobile ? p.substring(0, 5) + '.' : p.charAt(0).toUpperCase() + p.slice(1);
            return `${displayName}: ${this.gameState.completed.includes(p.toLowerCase()) ? '✓' : '✗'}`;
        }).join('\n');
        this.statusText.setText(text);
    }
}
