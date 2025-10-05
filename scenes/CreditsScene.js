class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        // Ferma la musica del gioco precedente
        this.sound.stopAll();
        // Avvia la musica dei titoli di coda
        this.sound.play('credits_music', { loop: true, volume: 0.5 });

        // Aggiunge l'immagine di sfondo
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

        // Testo completo dei crediti
        const creditsText = [
            'La Scuola di Atene',
            '',
            '',
            'Un Progetto Realizzato Da:',
            '',
            '',
            'Christian Rongo',
            '[ Game Developer ]',
            '',
            'Francesco Maffettone',
            '[ Concept Creator ]',
            '',
            'Pasquale Muriello',
            '[ Art Designer ]',
            '',
            '',
            '',
            'Un Ringraziamento Speciale ai Pensatori:',
            '',
            'Platone',
            'Aristotele',
            'Diogene',
            'Socrate',
            'Pitagora',
            '',
            '',
            '',
            'Hanno partecipato al gruppo:',
            '',
            'Panico Christian',
            'Valerio D\'Alconzo',
            'Palladino Gabriele',
            'Daniele Napolitano',
            'Fusaro Mario',
            'Zito Giovanni',
            'Luca Lombardi',
            'Manila Signore',
            'Adriano Gabriele',
            'Alessandro de Falco',
            'Testa Daniele',
            '',
            '',
            'Grazie per aver giocato!',
        ];

        // --- LA MODIFICA È QUI ---
        // Prima creiamo il testo a una posizione temporanea (y=0) solo per poter misurare la sua altezza
        const textObject = this.add.text(400, 0, creditsText, {
            fontSize: '28px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Ora che conosciamo la sua altezza, impostiamo la sua coordinata Y di partenza
        // in modo che la cima del testo sia esattamente alla base dello schermo.
        // (altezza dello schermo + metà dell'altezza del testo)
        textObject.y = 600 + (textObject.height / 2);


        // Animazione (tween) per far scorrere il testo verso l'alto
        this.tweens.add({
            targets: textObject,
            y: - (textObject.height / 2), // L'obiettivo finale non cambia: deve uscire tutto dallo schermo
            duration: 30000, 
            ease: 'Linear',
            onComplete: () => {
                // Quando i crediti sono finiti, torna al menu principale dopo 2 secondi
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
                    this.scene.start('TitleScene');
                });
            }
        });
    }
}
