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
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO', 'Classe 4B', '', '',
            'Grazie per aver giocato!',
        ];

        const creditsContainer = this.add.container(400, 600);
        const normalStyle = { fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        const highlightStyle = { fontSize: '32px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        let currentY = 0;
        const lineSpacing = 45;
        
        let targetLineObject = null; // Variabile per salvare l'oggetto di testo target

        creditsTextContent.forEach(line => {
            let style = normalStyle;
            if (line === 'Christian Rongo' || line === '[ Game Developer ]') {
                style = highlightStyle;
            }
            const textLine = this.add.text(0, currentY, line, style).setOrigin(0.5);
            creditsContainer.add(textLine);

            // Se troviamo la riga '[ Art Designer ]', salviamo l'oggetto di testo
            if (line === '[ Art Designer ]') {
                targetLineObject = textLine;
            }

            currentY += lineSpacing;
        });

        // --- NUOVA LOGICA DI ANIMAZIONE E STOP ---
        this.isStopping = false; // Una variabile per assicurarci di fermarci una sola volta

        this.tweens.add({
            targets: creditsContainer,
            y: -creditsContainer.height, // L'obiettivo è sempre scorrere tutto il testo
            duration: 25000, // Velocità a 25 secondi
            ease: 'Linear',
            
            // Aggiungiamo un controllo ad ogni frame dell'animazione
            onUpdate: (tween) => {
                if (!targetLineObject || this.isStopping) {
                    return; // Se non abbiamo un target o ci stiamo già fermando, non fare nulla
                }

                // Calcoliamo la posizione Y "reale" del nostro testo target
                const targetWorldY = creditsContainer.y + targetLineObject.y;

                // Se la posizione del testo supera il centro dello schermo...
                if (targetWorldY <= 300) {
                    this.isStopping = true; // Marchiamo che ci stiamo fermando
                    tween.pause(); // Mettiamo in pausa lo scorrimento

                    // Aspettiamo 3 secondi, poi torniamo al menu
                    this.time.delayedCall(3000, () => {
                        this.sound.stopAll();
                        this.scene.start('TitleScene');
                    });
                }
            },

            onComplete: () => {
                // Se i crediti finiscono normalmente (nel caso il target non venga trovato)
                this.time.delayedCall(2000, () => {
                    this.sound.stopAll();
                    this.scene.start('TitleScene');
                });
            }
        });
    }
}
