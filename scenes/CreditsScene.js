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

        // Creiamo un oggetto testo unendo tutte le righe
        // MODIFICATO: La coordinata Y è stata aumentata per far partire il testo da più in basso
        const textObject = this.add.text(400, 800, creditsText, {
            fontSize: '28px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Animazione (tween) per far scorrere il testo verso l'alto
        this.tweens.add({
            targets: textObject,
            y: - (textObject.height / 2), // Fa scorrere il testo fino a farlo uscire dallo schermo
            duration: 30000, // Durata dello scorrimento in millisecondi (30 secondi)
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
