class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }

    create() {
        this.gameScene = this.scene.get('GameScene');

        // --- COLORE DEL TESTO MODIFICATO ---
        this.statusText = this.add.text(780, 20, '', {
            fontSize: '18px',
            fill: '#000000', // Colore nero
            fontStyle: 'bold', // Aggiunto grassetto per leggibilità
            align: 'right'
        }).setOrigin(1, 0);
        
        this.interactionText = this.add.text(400, 500, '[E] Parla', { fontSize: '20px', fill: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setVisible(false);
        this.dialogBox = this.add.graphics().setVisible(false);
        this.dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(50, 400, 700, 180, 16);
        this.dialogText = this.add.text(80, 420, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 640 } }).setVisible(false);
        
        this.quizData = {
            platone: { intro: "Sono Platone...", questions: [{ q: "...", a: false }, { q: "...", a: true }, { q: "...", a: true }] },
            aristotele: { intro: "Sono Aristotele...", questions: [{ q: "...", a: true }, { q: "...", a: false }, { q: "...", a: true }] },
            diogene: { intro: "Sono Diogene...", questions: [{ q: "...", a: true }, { q: "...", a: true }, { q: "...", a: false }] },
            socrate: { intro: "Sono Socrate...", questions: [{ q: "...", a: false }, { q: "...", a: true }, { q: "...", a: false }] },
            pitagora: { intro: "Sono Pitagora...", questions: [{ q: "...", a: true }, { q: "...", a: true }, { q: "...", a: false }] }
        };

        this.gameState = { completed: [] };
        this.updateStatusText();

        this.gameScene.events.on('interactionUpdate', (philosopher) => {
            if (philosopher && !this.gameState.completed.includes(philosopher.name)) {
                this.interactionText.setPosition(philosopher.x, philosopher.y - 50).setVisible(true);
            } else {
                this.interactionText.setVisible(false);
            }
        });
        this.gameScene.events.on('startDialog', (philosopherName) => { this.startDialog(philosopherName); });
    }

    typewriteText(text, onCompleteCallback) {
        const length = text.length;
        let i = 0;
        this.dialogText.setText('');
        if (this.typingEvent) this.typingEvent.remove();
        this.typingEvent = this.time.addEvent({
            callback: () => {
                this.dialogText.text += text[i];
                i++;
                if (i === length) { if (onCompleteCallback) onCompleteCallback(); }
            },
            repeat: length - 1, delay: 40
        });
    }

    startDialog(philosopherName) {
        this.currentPhilosopher = philosopherName;
        this.quizIndex = 0;
        this.score = 0;
        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
        const introText = this.quizData[philosopherName].intro + '\n(Clicca per continuare)';
        this.typewriteText(introText, () => { this.input.once('pointerdown', () => this.showQuestion()); });
    }

    showQuestion() {
        const questionData = this.quizData[this.currentPhilosopher].questions[this.quizIndex];
        if (!questionData) { this.endQuiz(); return; }
        if (this.answerButtons) this.answerButtons.forEach(b => b.destroy());
        this.answerButtons = [];
        this.typewriteText(questionData.q, () => {
            this.answerButtons = [
                this.createButton(250, 530, 'Vero', true),
                this.createButton(550, 530, 'Falso', false)
            ];
        });
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
        if (this.typingEvent) this.typingEvent.remove();
        this.answerButtons.forEach(b => b.destroy());
        const correct = this.quizData[this.currentPhilosopher].questions[this.quizIndex].a === playerAnswer;
        if (correct) {
            this.score++;
            this.dialogText.setText('Corretto.');
            this.sound.play('correct_sfx', { volume: 0.3 });
        } else {
            this.dialogText.setText('Sbagliato.');
            this.sound.play('wrong_sfx', { volume: 0.3 });
        }
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
        if (this.gameState.completed.length === 5) {
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
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.gameScene.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.stop('GameScene');
            this.scene.start('VictoryScene');
        });
    }

    updateStatusText() {
        const text = ['Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora'].map(p => `${p.charAt(0).toUpperCase() + p.slice(1)}: ${this.gameState.completed.includes(p.toLowerCase()) ? '✓' : '✗'}`).join('\n');
        this.statusText.setText(text);
    }
}
