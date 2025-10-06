class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.sound.stopAll();
        this.sound.play('credits_music', { loop: true, volume: 0.5 });
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(0.4);

        const creditsText = [
            'Paideia',
            '(Alla scuola di atene)',
            '', '',
            'Un Progetto Realizzato Da:',
            '', '',
            'Christian Rongo',
            '[ Game Developer ]',
            '',
            'Francesco Maffettone',
            '[ Concept Creator ]',
            '',
            'Pasquale Muriello',
            '[ Art Designer ]',
            '', '', '',
            'Un Ringraziamento Speciale ai Pensatori:',
            '',
            'Platone', 'Aristotele', 'Diogene', 'Socrate', 'Pitagora',
            '', '', '',
            'Hanno partecipato al progetto anche:',
            '',
            'Panico Christian', 'Valerio D\'Alconzo', 'Palladino Gabriele', 'Daniele Napolitano',
            'Fusaro Mario', 'Zito Giovanni', 'Luca Lombardi', 'Manila Signore',
            'Adriano Gabriele', 'Alessandro de Falco', 'Testa Daniele',
            'Davide Sorrentino', 'Giuseppe Di Mauro', 'Marco Aprea',
            '', '', '',
            'Musiche:',
            '',
            '"On The Heavens" by Thoribass',
            '"Refuge of the Survivors" by Scott Buckley',
            '"The Introvert" by Michael Kobrin (from Pixabay)',
            '', '', '',
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO',
            'Classe 4B',
            '', '',
            'Grazie per aver giocato!',
        ];

        const creditsContainer = this.add.container(400, 600);
        const normalStyle = { fontSize: '28px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        const highlightStyle = { fontSize: '32px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif', align: 'center' };
        let currentY = 0;
        const lineSpacing = 45;

        creditsText.forEach(line => {
            let style = normalStyle;
            if (line === 'Christian Rongo' || line === '[ Game Developer ]') {
                style = highlightStyle;
            }
            const textLine = this.add.text(0, currentY, line, style).setOrigin(0.5);
            creditsContainer.add(textLine);
            currentY += lineSpacing;
        });

        this.tweens.add({
            targets: creditsContainer,
            y: -creditsContainer.height,
            // --- MODIFICATO: Durata ridotta per velocizzare lo scorrimento ---
            duration: 35000, 
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
