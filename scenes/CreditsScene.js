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
            'Christian Rongo', // Nome da evidenziare
            '[ Game Developer ]', // Ruolo da evidenziare
            '',
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

        // --- NUOVA LOGICA PER CREARE I CREDITI RIGA PER RIGA ---

        // 1. Creiamo un "contenitore" che terrà tutte le nostre righe di testo.
        //    Sarà il contenitore a scorrere, non più un singolo blocco di testo.
        const creditsContainer = this.add.container(400, 600);

        // 2. Definiamo gli stili per il testo
        const normalStyle = { fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        // Stile leggermente diverso per il nome da evidenziare (più chiaro)
        const highlightStyle = { fontSize: '28px', fill: '#FFFFFF', fontFamily: '"Cinzel", serif', align: 'center' };

        let currentY = 0;
        const lineSpacing = 43; // Spazio tra le righe (aumentato un po' per compensare)

        // 3. Creiamo ogni riga di testo individualmente
        creditsTextContent.forEach(line => {
            let style = normalStyle;
            // Se la riga è una di quelle da evidenziare, usiamo lo stile speciale
            if (line === 'Christian Rongo' || line === '[ Game Developer ]') {
                style = highlightStyle;
            }

            const textLine = this.add.text(0, currentY, line, style).setOrigin(0.5);
            creditsContainer.add(textLine); // Aggiungiamo la riga al contenitore

            currentY += lineSpacing; // Passiamo alla riga successiva
        });

        // 4. Applichiamo l'animazione di scorrimento al contenitore
        this.tweens.add({
            targets: creditsContainer,
            y: -creditsContainer.height, // Facciamo scorrere il contenitore fino a farlo uscire
            duration: 60000,
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
