class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        // Ferma tutta la musica precedente
        this.sound.stopAll();
        // Riproduci la musica dei crediti
        this.sound.play('credits_music', { loop: true, volume: 0.5 });

        // --- Sfondo e velatura ---
        this.add.rectangle(400, 300, 800, 600, 0x000000, 1).setDepth(0);
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(1).setDepth(1);
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6).setDepth(2);

        // --- Stili per il testo ---
        // Stile principale per la maggior parte dei crediti
        const styleBig = {
            fontSize: '28px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 15
        };
        // Stile più piccolo SOLO per la sezione musiche
        const styleSmall = {
            fontSize: '22px', // <-- Dimensione ridotta
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif',
            align: 'center',
            lineSpacing: 12
        };

        // --- Creazione del Container ---
        // Il container raggruppa tutti gli oggetti di testo e verrà animato
        const container = this.add.container(400, 600).setDepth(3);

        // --- Definiamo i blocchi di testo ---
        const textParts = [
            {
                style: styleBig,
                content: [
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
                    'Hanno partecipato al progetto:',
                    '',
                    'Panico Christian', 'Valerio D\'Alconzo', 'Palladino Gabriele', 'Daniele Napolitano',
                    'Fusaro Mario', 'Zito Giovanni', 'Luca Lombardi', 'Manila Signore',
                    'Adriano Gabriele', 'Alessandro de Falco', 'Testa Daniele', 'Davide Sorrentino',
                    'Giuseppe Di Mauro', 'Marco Aprea',
                    '', '', ''
                ]
            },
            {
                style: styleSmall, // Applichiamo lo stile piccolo qui
                content: [
                    'Musiche:',
                    '',
                    '"De Caelo / On The Heavens" by Wutering waves, baitian',
                    '"Refuge of the Survivors" by Wutering waves, YUE.STEVEN',
                    '"The Introvert" by Michael Kobrin',
                    '"Preserve The True Colors" by Wutering waves, YUE.STEVEN',
                    '', ''
                ]
            },
            {
                style: styleBig, // Torniamo allo stile grande
                content: [
                    'ITI E. BARSANTI - POMIGLIANO D\'ARCO',
                    'Classe 4B',
                    '', '',
                    'Grazie per aver giocato!'
                ]
            }
        ];

        let currentY = 0; // Tiene traccia della posizione verticale per ogni blocco

        // Aggiungiamo ogni blocco di testo al container
        textParts.forEach(part => {
            const textObject = this.add.text(0, currentY, part.content, part.style)
                .setOrigin(0.5, 0); // Origine centrale (X) e in alto (Y)
            
            container.add(textObject); // Aggiungi il testo al container
            
            // Aggiorna la posizione per il blocco successivo
            currentY += textObject.height + 20; // Aggiungi l'altezza del blocco + un po' di spazio
        });

        // --- Animazione del Container ---
        this.tweens.add({
            targets: container,
            y: -container.height, // Anima l'intero container verso l'alto
            duration: 55000,
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
