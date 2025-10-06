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
            // Il resto del testo non verrà visualizzato
            'Un Ringraziamento Speciale ai Pensatori:', '',
            'Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora', '', '', '',
            'Hanno partecipato al progetto anche:', '',
            'Panico Christian', 'Valerio D\'Alconzo', 'Palladino Gabriele', 'Daniele Napolitano',
            'Fusaro Mario', 'Zito Giovanni', 'Luca Lombardi', 'Manila Signore',
            'Adriano Gabriele', 'Alessandro de Falco', 'Testa Daniele',
            'Davide Sorrentino', 'Giuseppe Di Mauro', 'Marco Aprea', '', '', '',
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO', 'Classe 4B', '', '',
            'Grazie per aver giocato!',
        ];

        const creditsContainer = this.add.container(400, 600);
        const normalStyle = { fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        const highlightStyle = { fontSize: '32px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        let currentY = 0;
        const lineSpacing = 45;
        let targetLineY = 0; // Variabile per salvare la posizione della riga di Pasquale

        creditsTextContent.forEach(line => {
            let style = normalStyle;
            if (line === 'Christian Rongo' || line === '[ Game Developer ]') {
                style = highlightStyle;
            }

            const textLine = this.add.text(0, currentY, line, style).setOrigin(0.5);
            creditsContainer.add(textLine);

            // Se troviamo la riga '[ Art Designer ]', salviamo la sua posizione
            if (line === '[ Art Designer ]') {
                targetLineY = currentY;
            }

            currentY += lineSpacing;
        });

        // Calcoliamo la posizione finale del contenitore per centrare la riga target
        const finalY = -targetLineY + (this.sys.game.config.height / 2);

        this.tweens.add({
            targets: creditsContainer,
            y: finalY,
            // --- MODIFICATO: Durata ridotta drasticamente per velocizzare ---
            duration: 15000, // 15 secondi, puoi abbassare ancora se vuoi
            ease: 'Linear',
            onComplete: () => {
                // Aspetta 3 secondi sulla scritta prima di tornare al menu
                this.time.delayedCall(3000, () => {
                    this.sound.stopAll();
                    this.scene.start('TitleScene');
                });
            }
        });
    }
}
