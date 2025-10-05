class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.sound.stopAll();
        this.sound.play('credits_music', { loop: true, volume: 0.5 });
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

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

        // --- LA MODIFICA DEFINITIVA È QUI ---

        // 1. Creiamo il testo, ma con l'origine (il punto di riferimento) impostata in ALTO al centro.
        //    E lo posizioniamo con il suo bordo superiore esattamente alla fine dello schermo (y: 600).
        const textObject = this.add.text(400, 600, creditsText, {
            fontSize: '28px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5, 0); // Origine: 0.5 sull'asse X (centro), 0 sull'asse Y (CIMA)

        // 2. Animiamo la sua posizione Y (il bordo superiore) fino a farla arrivare a -altezza totale.
        //    Questo assicura che tutto il testo scorra e scompaia in alto.
        this.tweens.add({
            targets: textObject,
            y: -textObject.height,
            duration: 30000, 
            ease: 'Linear',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
                    this.scene.start('TitleScene');
                });
            }
        });
    }
}
