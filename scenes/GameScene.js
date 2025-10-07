class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        this.gameScene = this.scene.get('GameScene'); // Ottieni un riferimento alla GameScene
        this.gameScene.dialogActive = false; // Inizializza lo stato del dialogo nella GameScene

        // Testo per lo stato del gioco (es. "Filosofi trovati: 0/5")
        this.statusText = this.add.text(20, 20, '', { 
            fontSize: '18px', 
            fill: '#000000', 
            fontStyle: 'bold', 
            fontFamily: '"Cinzel", serif' 
        });

        // Testo per l'interazione ([E] Parla)
        this.interactionText = this.add.text(400, 450, '[E] Parla', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#000', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(0.5).setVisible(false);
        
        // Pannello del dialogo (più scuro e grande)
        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x000000, 0.8)
                      .fillRect(50, 400, 700, 180) // x, y, width, height
                      .setVisible(false);

        // Testo del dialogo
        this.dialogText = this.add.text(70, 420, '', { 
            fontSize: '20px', 
            fill: '#fff', 
            wordWrap: { width: 660 },
            fontFamily: '"Cinzel", serif' 
        }).setVisible(false);

        // Pulsante per chiudere il dialogo o per la risposta
        this.dialogButton = this.add.text(680, 550, 'Continua', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#333333', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setVisible(false);

        // Eventi del pulsante per cambio colore al passaggio del mouse
        this.dialogButton.on('pointerover', () => this.dialogButton.setStyle({ fill: '#ffff99' }));
        this.dialogButton.on('pointerout', () => this.dialogButton.setStyle({ fill: '#ffffff' }));

        // Dati dei quiz
        this.quizData = {
            platone: {
                question: "Platone: Qual è l'essenza della realtà?",
                options: ["Le Idee eterne", "La materia in continuo mutamento", "Le sensazioni individuali"],
                correct: "Le Idee eterne",
                dialog: "Ah, il mondo delle idee... la vera essenza della realtà è lì, oltre i sensi. Hai capito bene, giovane studente."
            },
            aristotele: {
                question: "Aristotele: Cosa si intende per 'entelechia'?",
                options: ["Il puro atto", "Il fine immanente di ogni cosa", "La negazione della materia"],
                correct: "Il fine immanente di ogni cosa",
                dialog: "Esatto! L'entelechia è il principio che porta ogni essere a realizzare la propria forma perfetta. La tua mente è acuta."
            },
            diogene: {
                question: "Diogene: Qual è il fondamento della felicità secondo me?",
                options: ["La ricchezza materiale", "Il piacere sensoriale", "L'autosufficienza e l'indipendenza"],
                correct: "L'autosufficienza e l'indipendenza",
                dialog: "Non c'è nulla di più vero! La vera libertà sta nel non desiderare nulla, nell'essere padroni di se stessi. Ben detto!"
            },
            socrate: {
                question: "Socrate: Qual è il principio fondamentale del mio pensiero?",
                options: ["Conosci te stesso", "La materia è eterna", "Il dubbio universale"],
                correct: "Conosci te stesso",
                dialog: "Saggezza pura! La conoscenza di sé è la chiave per una vita virtuosa. La tua anima ha sete di sapere."
            },
            pitagora: {
                question: "Pitagora: Qual è l'elemento fondamentale dell'universo?",
                options: ["L'acqua", "Il fuoco", "Il numero"],
                correct: "Il numero",
                dialog: "Magnifico! L'intero cosmo è un'armonia di numeri e proporzioni. Hai colto il segreto dell'universo."
            }
        };

        // Stato del gioco
        this.gameState = { 
            completed: [], // Filosofi con cui si è già interagito
            score: 0 
        };
        this.currentPhilosopher = null; // Il filosofo con cui si sta interagendo
        this.dialogState = 'dialog'; // 'dialog', 'quiz', 'result', 'end'

        this.updateStatusText();

        // Eventi dalla GameScene
        this.gameScene.events.on('interactionUpdate', (philosopher) => {
            // Mostra/nascondi il testo di interazione solo se non c'è un dialogo attivo
            if (!this.gameScene.dialogActive && philosopher && !this.gameState.completed.includes(philosopher.name)) { 
                this.interactionText.setPosition(philosopher.x, philosopher.y - 50).setVisible(true); 
            } else { 
                this.interactionText.setVisible(false); 
            }
        });
        this.gameScene.events.on('startDialog', (philosopherName) => { 
            if (!this.gameScene.dialogActive) { // Evita dialoghi multipli
                this.startDialog(philosopherName); 
            }
        });
    }

    updateStatusText() {
        this.statusText.setText(`Filosofi Trovati: ${this.gameState.completed.length}/5\nRisposte Corrette: ${this.gameState.score}`);
    }

    startDialog(philosopherName) {
        this.gameScene.dialogActive = true; // Blocca il movimento del giocatore
        this.currentPhilosopher = philosopherName;
        this.dialogState = 'dialog';

        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
        this.dialogButton.setVisible(true).setText('Continua'); // Reset testo del pulsante
        this.interactionText.setVisible(false); // Nascondi il testo "[E] Parla"

        // Rimuovi eventuali risposte quiz precedenti
        if (this.optionsButtons) {
            this.optionsButtons.forEach(btn => btn.destroy());
            this.optionsButtons = null;
        }

        const initialDialog = `Ciao! Sono ${philosopherName}. Sei pronto a mettere alla prova la tua saggezza?`;
        this.typewriteText(initialDialog);

        this.dialogButton.off('pointerdown'); // Rimuovi listener precedenti
        this.dialogButton.on('pointerdown', () => this.nextDialog());
    }

    nextDialog() {
        if (this.dialogState === 'dialog') {
            this.showQuiz();
        } else if (this.dialogState === 'quiz') {
            // Questo non dovrebbe essere chiamato, le risposte gestiscono lo stato quiz
        } else if (this.dialogState === 'result') {
            this.endDialog();
        } else if (this.dialogState === 'end') {
            // Fine del dialogo, chiudi tutto
            this.endDialog();
        }
    }

    showQuiz() {
        this.dialogState = 'quiz';
        this.dialogButton.setVisible(false); // Nascondi il pulsante Continua durante il quiz
        const quiz = this.quizData[this.currentPhilosopher];
        this.typewriteText(quiz.question);

        this.optionsButtons = [];
        let yOffset = 460;
        quiz.options.forEach(option => {
            const optionBtn = this.add.text(70, yOffset, `- ${option}`, {
                fontSize: '18px', 
                fill: '#fff', 
                backgroundColor: '#1a1a1a', 
                padding: { x: 10, y: 5 },
                wordWrap: { width: 660 },
                fontFamily: '"Cinzel", serif'
            }).setInteractive({ useHandCursor: true });

            optionBtn.on('pointerover', () => optionBtn.setStyle({ fill: '#ffff99', backgroundColor: '#4a4a4a' }));
            optionBtn.on('pointerout', () => optionBtn.setStyle({ fill: '#ffffff', backgroundColor: '#1a1a1a' }));
            optionBtn.on('pointerdown', () => this.checkAnswer(option, quiz.correct, quiz.dialog));
            this.optionsButtons.push(optionBtn);
            yOffset += optionBtn.height + 5; // Spazio tra le opzioni
        });
    }

    checkAnswer(selectedOption, correctAnswer, dialogOnCorrect) {
        this.dialogState = 'result';
        // Disabilita tutti i pulsanti delle opzioni
        this.optionsButtons.forEach(btn => {
            btn.disableInteractive();
            btn.setStyle({ fill: '#888888', backgroundColor: '#1a1a1a' }); // Colore grigio
        });

        this.dialogButton.setVisible(true).setText('Continua'); // Mostra pulsante continua
        this.dialogButton.off('pointerdown');
        this.dialogButton.on('pointerdown', () => this.endDialog());

        if (selectedOption === correctAnswer) {
            this.gameState.score++;
            this.sound.play('correct_sfx');
            this.typewriteText("Corretto!\n" + dialogOnCorrect);
        } else {
            this.sound.play('wrong_sfx');
            this.typewriteText("Sbagliato. La risposta corretta era: " + correctAnswer);
        }
        this.updateStatusText();
    }

    endDialog() {
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.dialogButton.setVisible(false);
        
        if (this.optionsButtons) {
            this.optionsButtons.forEach(btn => btn.destroy());
            this.optionsButtons = null;
        }

        // Segna il filosofo come completato SOLO se è stata data una risposta (corretta o sbagliata)
        if (!this.gameState.completed.includes(this.currentPhilosopher) && this.dialogState === 'result') {
            this.gameState.completed.push(this.currentPhilosopher);
            this.updateStatusText();
        }

        this.currentPhilosopher = null;
        this.gameScene.dialogActive = false; // Sblocca il movimento del giocatore
        this.dialogState = 'end'; // Reset dello stato del dialogo

        if (this.gameState.completed.length === 5) {
            this.time.delayedCall(500, () => {
                this.scene.start('VictoryScene', { finalScore: this.gameState.score });
                this.gameScene.sound.get('bgm').stop();
                this.gameScene.footstepsSound.stop();
            });
        }
    }

    typewriteText(text) {
        this.dialogText.setText('');
        let i = 0;
        this.time.addEvent({
            callback: () => {
                this.dialogText.setText(text.substring(0, i));
                i++;
            },
            repeat: text.length - 1,
            delay: 30, // Velocità di scrittura
            callbackScope: this
        });
    }
}
