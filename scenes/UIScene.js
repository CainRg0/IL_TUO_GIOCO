class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        this.gameScene = this.scene.get('GameScene');

        // Testo per lo stato
        this.statusText = this.add.text(780, 20, '', { fontSize: '18px', fill: '#fff', align: 'right' }).setOrigin(1, 0);

        // Testo per l'interazione [E]
        this.interactionText = this.add.text(400, 500, '[E] Parla', { fontSize: '20px', fill: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setVisible(false);

        // Elementi del dialogo (inizialmente invisibili)
        this.dialogBox = this.add.graphics().setVisible(false);
        this.dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(50, 400, 700, 180, 16);
        this.dialogText = this.add.text(80, 420, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 640 } }).setVisible(false);
        
        // Dati del quiz
        this.quizData = {
            platone: { intro: "Sono Platone. Credi che ciò che vedi sia la vera realtà? Mettiamo alla prova le tue certezze.", questions: [{ q: "La mia 'teoria delle idee' sostiene che il mondo sensibile sia la vera realtà.", a: false }, { q: "Ho scritto 'La Repubblica'.", a: true }, { q: "Ero il maestro di Aristotele.", a: true }] },
            aristotele: { intro: "Sono Aristotele. La conoscenza deriva dall'esperienza. Vediamo cosa ti ha insegnato la tua.", questions: [{ q: "Ho sostenuto che la virtù si trovi nel 'giusto mezzo'.", a: true }, { q: "Il mio maestro è stato Socrate.", a: false }, { q: "La logica è una mia invenzione.", a: true }] },
            diogene: { intro: "Sono Diogene. Spostati, mi fai ombra. Se proprio devi restare, rispondi.", questions: [{ q: "Vivevo in una botte per disprezzare i beni materiali.", a: true }, { q: "Cercavo l'uomo onesto con una lanterna in pieno giorno.", a: true }, { q: "Ho fondato la scuola degli Epicurei.", a: false }] }
        };

        this.gameState = { completed: [] };
        this.updateStatusText();

        // Eventi dalla scena di gioco
        this.gameScene.events.on('interactionUpdate', (philosopher) => {
            if (philosopher && !this.gameState.completed.includes(philosopher.name)) {
                this.interactionText.setPosition(philosopher.x, philosopher.y - 50).setVisible(true);
            } else {
                this.interactionText.setVisible(false);
            }
        });

        this.gameScene.events.on('startDialog', (philosopherName) => {
            this.startDialog(philosopherName);
        });
    }

    startDialog(philosopherName) {
        this.currentPhilosopher = philosopherName;
        this.quizIndex = 0;
        this.score = 0;

        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true).setText(this.quizData[philosopherName].intro + '\n(Clicca per continuare)');

        this.input.once('pointerdown', () => this.showQuestion());
    }

    showQuestion() {
        const questionData = this.quizData[this.currentPhilosopher].questions[this.quizIndex];
        if (!questionData) {
            this.endQuiz();
            return;
        }

        this.dialogText.setText(questionData.q);

        if (this.answerButtons) this.answerButtons.forEach(b => b.destroy());
        this.answerButtons = [
            this.createButton(250, 530, 'Vero', true),
            this.createButton(550, 530, 'Falso', false)
        ];
    }
    
    createButton(x, y, text, answer) {
        const button = this.add.text(x, y, text, { fontSize: '24px', fill: '#c5a65a', backgroundColor: '#111', padding: { x: 20, y: 10 }})
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        button.on('pointerdown', () => this.handleAnswer(answer));
        button.on('pointerover', () => button.setStyle({ fill: '#fff' }));
        button.on('pointerout', () => button.setStyle({ fill: '#c5a65a' }));
        return button;
    }

    handleAnswer(playerAnswer) {
        this.answerButtons.forEach(b => b.destroy());
        const correct = this.quizData[this.currentPhilosopher].questions[this.quizIndex].a === playerAnswer;
        if (correct) this.score++;
        
        this.dialogText.setText(correct ? 'Corretto.' : 'Sbagliato.');
        
        this.quizIndex++;
        this.time.delayedCall(1500, () => this.showQuestion());
    }

    endQuiz() {
        const total = this.quizData[this.currentPhilosopher].questions.length;
        let endMessage = `Hai risposto correttamente a ${this.score} su ${total} domande.\n`;

        if (this.score > 1) {
            endMessage += "Hai dimostrato la tua saggezza!";
            this.gameState.completed.push(this.currentPhilosopher);
        } else {
            endMessage += "La via per la conoscenza è ancora lunga. Riprova più tardi.";
        }
        
        this.dialogText.setText(endMessage);
        this.updateStatusText();

        if (this.gameState.completed.length === 3) {
            this.time.delayedCall(2000, () => this.winGame());
        } else {
            this.time.delayedCall(3000, () => this.closeDialog());
        }
    }
    
    closeDialog() {
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.gameScene.dialogActive = false;
    }
    
    winGame() {
        this.dialogText.setText('CONGRATULAZIONI!\nHai superato le prove di tutti i filosofi!');
    }

    updateStatusText() {
        const text = ['Platone', 'Aristotele', 'Diogene']
            .map(p => `${p}: ${this.gameState.completed.includes(p) ? '✓' : '✗'}`)
            .join('\n');
        this.statusText.setText(text);
    }
}
