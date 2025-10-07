class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.sound.stopAll();
        this.sound.play('credits_music', { loop: true, volume: 0.5 });
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

        const creditsText = [
            'Paideia', '(Alla scuola di atene)', '', '',
            'Un Progetto Realizzato Da:', '', '',
            'Christian Rongo', '[ Game Developer ]', '',
            'Francesco Maffettone', '[ Concept Creator ]', '',
            'Pasquale Muriello', '[ Art Designer ]', '', '', '',
            'Un Ringraziamento Speciale ai Pensatori:', '',
            'Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora', '', '', '',
            'Hanno partecipato al progetto anche:', '',
            'Panico Christian', 'Valerio D\'Alconzo', 'Palladino Gabriele', 'Daniele Napolitano',
            'Fusaro Mario', 'Zito Giovanni', 'Luca Lombardi', 'Manila Signore',
            'Adriano Gabriele', 'Alessandro de Falco', 'Testa Daniele',
            'Davide Sorrentino', 'Giuseppe Di Mauro', 'Marco Aprea', '', '', '',
            'Musiche:', '',
            '"On The Heavens" by Thoribass',
            '"Refuge of the Survivors" by Scott Buckley',
            '"The Introvert" by Michael Kobrin (from Pixabay)', '', '', '',
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO', 'Classe 4B', '', '',
            'Grazie per aver giocato!',
        ];

        // Creiamo il testo con l'origine in alto al centro (0.5, 0)
        // e lo posizioniamo con il suo bordo superiore appena sotto lo schermo (y: 600)
        const textObject = this.add.text(400, 600, creditsText, {
            fontSize: '28px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5, 0);

        // Animazione (tween) per far scorrere il testo verso l'alto
        this.tweens.add({
            targets: textObject,
            // L'obiettivo è far arrivare il bordo superiore del testo
            // fino a una posizione sopra lo schermo pari all'altezza del testo stesso
            y: -textObject.height,
            // MODIFICATO: Durata ridotta a 25 secondi per velocizzare lo scorrimento
            duration: 55000,
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


