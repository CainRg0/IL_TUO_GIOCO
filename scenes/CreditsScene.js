class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.sound.stopAll();
        this.sound.play('credits_music', { loop: true, volume: 0.5 });
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

        const creditsTextContent = [
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

        // Creiamo un "contenitore" che terrà tutte le nostre righe di testo.
        const creditsContainer = this.add.container(400, 600);

        // Definiamo gli stili per il testo
        const normalStyle = { fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        // Stile per il nome evidenziato (leggermente più grande, stesso colore)
        const highlightStyle = { fontSize: '32px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        const smallStyle = { fontSize: '20px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };

        let currentY = 0;
        const lineSpacing = 45; // Spazio tra le righe

        // Creiamo ogni riga di testo individualmente
        creditsTextContent.forEach(line => {
            let style = normalStyle;
            // Se la riga è una di quelle da evidenziare, usiamo lo stile speciale
            if (line === 'Christian Rongo' || line === '[ Game Developer ]') {
                style = highlightStyle;
            } else if (line.startsWith('"')) { // Se è un credito musicale
                style = smallStyle;
            }

            const textLine = this.add.text(0, currentY, line, style).setOrigin(0.5);
            creditsContainer.add(textLine); // Aggiungiamo la riga al contenitore

            currentY += lineSpacing; // Passiamo alla riga successiva
        });

        // Animazione di scorrimento
        this.tweens.add({
            targets: creditsContainer,
            y: -creditsContainer.height, // Facciamo scorrere il contenitore fino a farlo uscire
            duration: 45000, // Rallentato a 45 secondi
            ease: 'Linear',
            onComplete: () => {
                const restartButton = this.add.text(400, 550, '[ Torna al Menu Principale ]', {
                    fontSize: '24px',
                    fill: '#c5a65a',
                    fontFamily: '"Cinzel", serif'
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                restartButton.on('pointerover', () => restartButton.setStyle({ fill: '#FFFFFF' }));
                restartButton.on('pointerout', () => restartButton.setStyle({ fill: '#c5a65a' }));

                restartButton.on('pointerdown', () => {
                    this.sound.stopAll();
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        this.scene.start('TitleScene');
                    });
                });
            }
        });
    }
}
