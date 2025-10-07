class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.currentPhilosopher = null; // Il filosofo con cui si sta interagendo (nome)
        this.currentQuestionIndex = 0; // Nuova variabile per tenere traccia della domanda corrente
        this.dialogState = 'dialog'; 
        this.questionsAnsweredCount = 0; // Contatore globale di quiz risolti correttamente
    }

    create() {
        this.gameScene = this.scene.get('GameScene'); 
        
        this.statusText = this.add.text(20, 20, '', { 
            fontSize: '18px', 
            fill: '#ffffff', 
            fontStyle: 'bold', 
            fontFamily: '"Cinzel", serif' 
        });

        this.interactionText = this.add.text(400, 450, '[E] Parla', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#000', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(0.5).setVisible(false);
        
        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x000000, 0.8)
                      .fillRect(50, 400, 700, 180) 
                      .setVisible(false);

        this.dialogText = this.add.text(70, 420, '', { 
            fontSize: '20px', 
            fill: '#fff', 
            wordWrap: { width: 660 },
            fontFamily: '"Cinzel", serif' 
        }).setVisible(false);

        this.dialogButton = this.add.text(680, 550, 'Continua', { 
            fontSize: '20px', 
            fill: '#fff', 
            backgroundColor: '#333333', 
            padding: { x: 10, y: 5 },
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(1, 1).setInteractive({ useHandCursor: true }).setVisible(false);

        this.dialogButton.on('pointerover', () => this.dialogButton.setStyle({ fill: '#ffff99' }));
        this.dialogButton.on('pointerout', () => this.dialogButton.setStyle({ fill: '#ffffff' }));

        // --- MODIFICA CHIAVE: STRUTTURA DATI DEI QUIZ CON PIU' DOMANDE ---
        this.quizData = {
            platone: {
                initialDialog: "Ciao! Sono Platone. Sei pronto a mettere alla prova la tua saggezza?",
                questions: [
                    {
                        question: "Qual è l'essenza della realtà?",
                        options: ["Le Idee eterne", "La materia in continuo mutamento", "Le sensazioni individuali"],
                        correct: "Le Idee eterne",
                        dialogOnCorrect: "Ah, il mondo delle idee... la vera essenza della realtà è lì, oltre i sensi. Hai capito bene, giovane studente."
                    },
                    {
                        question: "Cosa intendeva Platone con 'Mito della Caverna'?",
                        options: ["Una spiegazione dell'origine del fuoco", "Un'allegoria sulla conoscenza e l'ignoranza", "Una storia per bambini"],
                        correct: "Un'allegoria sulla conoscenza e l'ignoranza",
                        dialogOnCorrect: "Eccellente! Il mito della caverna è la mia metafora per il percorso della conoscenza che porta dalla percezione sensibile all'intellegibile."
                    },
                    {
                        question: "Qual è la forma di governo ideale secondo Platone?",
                        options: ["Democrazia", "Tirannia", "Repubblica governata dai filosofi-re"],
                        correct: "Repubblica governata dai filosofi-re",
                        dialogOnCorrect: "Perfetto! Solo i filosofi, con la loro saggezza e conoscenza del Bene, possono guidare la polis verso la giustizia."
                    }
                ]
            },
            aristotele: {
                initialDialog: "Ciao! Sono Aristotele. Sei pronto a mettere alla prova la tua saggezza?",
                questions: [
                    {
                        question: "Cosa si intende per 'entelechia'?",
                        options: ["Il puro atto", "Il fine immanente di ogni cosa", "La negazione della materia"],
                        correct: "Il fine immanente di ogni cosa",
                        dialogOnCorrect: "Esatto! L'entelechia è il principio che porta ogni essere a realizzare la propria forma perfetta. La tua mente è acuta."
                    },
                    {
                        question: "Qual è il rapporto tra materia e forma?",
                        options: ["Sono la stessa cosa", "La forma è la disposizione della materia", "La materia è superiore alla forma"],
                        correct: "La forma è la disposizione della materia",
                        dialogOnCorrect: "Hai colto nel segno! Ogni cosa è un sinolo di materia e forma, inseparabili nella sostanza individuale."
                    },
                    {
                        question: "Cos'è la 'giusta misura' (mesotes) per Aristotele?",
                        options: ["Un eccesso di virtù", "La virtù che sta a metà tra due estremi", "La mancanza di coraggio"],
                        correct: "La virtù che sta a metà tra due estremi",
                        dialogOnCorrect: "Sì! La virtù risiede nella medietà, evitando eccessi e difetti. È la via della saggezza pratica."
                    }
                ]
            },
            diogene: {
                initialDialog: "Ciao! Sono Diogene. Sei pronto a mettere alla prova la tua saggezza?",
                questions: [
                    {
                        question: "Qual è il fondamento della felicità secondo me?",
                        options: ["La ricchezza materiale", "Il piacere sensoriale", "L'autosufficienza e l'indipendenza"],
                        correct: "L'autosufficienza e l'indipendenza",
                        dialogOnCorrect: "Non c'è nulla di più vero! La vera libertà sta nel non desiderare nulla, nell'essere padroni di se stessi. Ben detto!"
                    },
                    {
                        question: "Cosa dissi ad Alessandro Magno quando mi chiese cosa desideravo?",
                        options: ["Oro e gioielli", "Che si spostasse, perché mi toglieva il sole", "Un posto a corte"],
                        correct: "Che si spostasse, perché mi toglieva il sole",
                        dialogOnCorrect: "Ah ah! Un vero filosofo non ha bisogno di nulla, nemmeno dell'ombra di un re. La tua indipendenza è lodevole."
                    },
                    {
                        question: "Perché vivevo in una botte?",
                        options: ["Per sfuggire ai creditori", "Per dimostrare il disprezzo per le convenzioni sociali", "Per praticare l'agricoltura"],
                        correct: "Per dimostrare il disprezzo per le convenzioni sociali",
                        dialogOnCorrect: "Esatto! Per vivere in accordo con la natura, rifiutando gli agi e le ipocrisie della società. Ottima osservazione!"
                    }
                ]
            },
            socrate: {
                initialDialog: "Ciao! Sono Socrate. Sei pronto a mettere alla prova la tua saggezza?",
                questions: [
                    {
                        question: "Qual è il principio fondamentale del mio pensiero?",
                        options: ["Conosci te stesso", "La materia è eterna", "Il dubbio universale"],
                        correct: "Conosci te stesso",
                        dialogOnCorrect: "Saggezza pura! La conoscenza di sé è la chiave per una vita virtuosa. La tua anima ha sete di sapere."
                    },
                    {
                        question: "Cos'è la 'maieutica'?",
                        options: ["L'arte di scolpire", "L'arte di far partorire le idee", "Un tipo di retorica persuasiva"],
                        correct: "L'arte di far partorire le idee",
                        dialogOnCorrect: "Benissimo! Con il dialogo e le domande, aiuto gli altri a tirar fuori la verità che è già in loro. Hai compreso il mio metodo."
                    },
                    {
                        question: "Perché sono stato condannato a morte?",
                        options: ["Per furto", "Per corruzione dei giovani e empietà", "Per aver attaccato il governo"],
                        correct: "Per corruzione dei giovani e empietà",
                        dialogOnCorrect: "Purtroppo sì. La mia ricerca della verità e l'invito al pensiero critico non furono ben visti da tutti. Ma la verità trionfa sempre."
                    }
                ]
            },
            pitagora: {
                initialDialog: "Ciao! Sono Pitagora. Sei pronto a mettere alla prova la tua saggezza?",
                questions: [
                    {
                        question: "Qual è l'elemento fondamentale dell'universo?",
                        options: ["L'acqua", "Il fuoco", "Il numero"],
                        correct: "Il numero",
                        dialogOnCorrect: "Magnifico! L'intero cosmo è un'armonia di numeri e proporzioni. Hai colto il segreto dell'universo."
                    },
                    {
                        question: "Quale importante teorema geometrico è attribuito a me?",
                        options: ["Il teorema di Talete", "Il teorema di Euclide", "Il teorema di Pitagora"],
                        correct: "Il teorema di Pitagora",
                        dialogOnCorrect: "Certo! La relazione tra i lati di un triangolo rettangolo, una delle pietre angolari della geometria. Eccellente."
                    },
                    {
                        question: "La mia scuola era anche una comunità basata su cosa?",
                        options: ["Il commercio", "Regole etiche, religiose e scientifiche", "L'arte drammatica"],
                        correct: "Regole etiche, religiose e scientifiche",
                        dialogOnCorrect: "Perfetto! Non solo filosofia e matematica, ma anche uno stile di vita e una ricerca della purificazione dell'anima. La tua conoscenza è vasta."
                    }
                ]
            }
        };

        this.gameState = { 
            completed: [], // Mantiene i nomi dei filosofi le cui 3 domande sono state completate
            score: 0 
        };
        // this.currentPhilosopher e this.currentQuestionIndex sono già dichiarati nel costruttore
        // this.dialogState è già dichiarato nel costruttore
        // this.questionsAnsweredCount è già dichiarato nel costruttore

        this.updateStatusText();

        this.gameScene.events.on('interactionUpdate', (philosopher) => {
            // Mostra/nascondi il testo di interazione solo se il giocatore non è bloccato e il filosofo non è già completato
            if (!this.gameScene.isPlayerBlocked && philosopher && !this.gameState.completed.includes(philosopher.name)) { 
                this.interactionText.setPosition(philosopher.x, philosopher.y - 50).setVisible(true); 
            } else { 
                this.interactionText.setVisible(false); 
            }
        });
        this.gameScene.events.on('startDialog', (philosopherName) => { 
            this.startDialog(philosopherName); 
        });
    }

    updateStatusText() {
        this.statusText.setText(`Quiz Risolti: ${this.questionsAnsweredCount}/15\nRispondi a tutti i filosofi per vincere!`);
    }

    startDialog(philosopherName) {
        this.currentPhilosopher = philosopherName;
        // Resetta l'indice della domanda solo se è una nuova conversazione con questo filosofo
        if (!this.gameState.completed.includes(philosopherName)) {
            this.currentQuestionIndex = 0; 
        } else {
            // Se il filosofo è già completato, non fare nulla o mostra un messaggio "già completato"
            // Per ora, semplicemente termina il dialogo
            this.gameScene.events.emit('endDialog'); // Sblocca il giocatore
            return;
        }


        this.dialogState = 'dialog';

        const philosopherSprite = this.gameScene.philosophers.getChildren().find(p => p.name === philosopherName);
        if (philosopherSprite) {
            philosopherSprite.setVelocity(0, 0); 
        }

        this.dialogBox.setVisible(true);
        this.dialogText.setVisible(true);
        this.dialogButton.setVisible(true).setText('Continua'); 
        this.interactionText.setVisible(false); 

        if (this.optionsButtons) {
            this.optionsButtons.forEach(btn => btn.destroy());
            this.optionsButtons = null;
        }

        // Mostra il dialogo iniziale del filosofo
        this.typewriteText(this.quizData[this.currentPhilosopher].initialDialog);

        this.dialogButton.off('pointerdown'); 
        this.dialogButton.on('pointerdown', () => this.nextDialog());
    }

    nextDialog() {
        // Se siamo nel dialogo iniziale o nella risposta all'ultima domanda
        if (this.dialogState === 'dialog' || this.dialogState === 'result') {
            if (this.currentQuestionIndex < this.quizData[this.currentPhilosopher].questions.length) {
                // Se ci sono ancora domande, mostra la prossima
                this.showQuiz(this.currentPhilosopher, this.currentQuestionIndex);
            } else {
                // Tutte le domande per questo filosofo sono state risposte
                this.endPhilosopherDialog();
            }
        }
    }

    showQuiz(philosopherName, questionIndex) {
        this.dialogState = 'quiz';
        this.dialogButton.setVisible(false); 
        const currentQuiz = this.quizData[philosopherName].questions[questionIndex];
        this.typewriteText(currentQuiz.question);

        if (this.optionsButtons) {
            this.optionsButtons.forEach(btn => btn.destroy());
            this.optionsButtons = null;
        }

        this.optionsButtons = [];
        let yOffset = 460;
        currentQuiz.options.forEach(option => {
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
            optionBtn.on('pointerdown', () => this.checkAnswer(option, currentQuiz.correct, currentQuiz.dialogOnCorrect));
            this.optionsButtons.push(optionBtn);
            yOffset += optionBtn.height + 5; 
        });
    }

    checkAnswer(selectedOption, correctAnswer, dialogOnCorrect) {
        this.dialogState = 'result';
        this.optionsButtons.forEach(btn => {
            btn.disableInteractive();
            btn.setStyle({ fill: '#888888', backgroundColor: '#1a1a1a' }); 
        });

        this.dialogButton.setVisible(true).setText('Continua'); 
        this.dialogButton.off('pointerdown');
        this.dialogButton.on('pointerdown', () => this.nextDialog()); // Dopo la risposta, si va alla prossima domanda o si conclude

        if (selectedOption === correctAnswer) {
            this.gameState.score++;
            this.questionsAnsweredCount++; // Incrementa il contatore globale delle domande risposte
            this.sound.play('correct_sfx');
            this.typewriteText("Corretto!\n" + dialogOnCorrect);
        } else {
            this.sound.play('wrong_sfx');
            this.typewriteText("Sbagliato. La risposta corretta era: " + correctAnswer);
        }
        this.currentQuestionIndex++; // Incrementa l'indice della domanda per la prossima volta
        this.updateStatusText();
    }

    endPhilosopherDialog() {
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.dialogButton.setVisible(false);
        
        if (this.optionsButtons) {
            this.optionsButtons.forEach(btn => btn.destroy());
            this.optionsButtons = null;
        }

        // Segna il filosofo come completato solo se tutte le sue domande sono state poste
        if (!this.gameState.completed.includes(this.currentPhilosopher)) {
            this.gameState.completed.push(this.currentPhilosopher);
        }

        this.currentPhilosopher = null;
        this.gameScene.events.emit('endDialog'); // Sblocca il giocatore nella GameScene
        this.dialogState = 'end'; 

        if (this.gameState.completed.length === 5) { // Controlla se tutti e 5 i filosofi sono stati completati
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
        if (this._typewritingEvent) {
            this._typewritingEvent.remove();
        }
        this._typewritingEvent = this.time.addEvent({
            callback: () => {
                this.dialogText.setText(text.substring(0, i));
                i++;
            },
            repeat: text.length - 1,
            delay: 30, 
            callbackScope: this
        });
    }
}
