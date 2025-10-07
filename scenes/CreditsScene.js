class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        // Ferma tutta la musica precedente
        this.sound.stopAll(); 
        // Riproduci la musica dei crediti
        this.sound.play('credits_music', { loop: true, volume: 0.5 }); 

        // --- Sfondo opaco e immagine "scuola_di_atene" ---
        // Aggiungi un rettangolo nero opaco per coprire completamente la scena precedente.
        // Questo va sotto l'immagine 'scuola_di_atene' se vuoi che l'immagine sia visibile.
        this.add.rectangle(400, 300, 800, 600, 0x000000, 1).setDepth(0); // Sfondo nero completamente opaco.

        // Aggiungi l'immagine 'scuola_di_atene' sopra lo sfondo nero.
        // Impostiamo alpha a 1 per renderla completamente visibile (o un valore inferiore se vuoi una velatura).
        // Se vuoi una velatura, potresti metterla a 0.6 o 0.7. Per ora la metto a 1.
        // Ho impostato un setDepth di 1 per essere sopra lo sfondo nero ma sotto il testo dei crediti.
        this.add.image(400, 300, 'scuola_di_atene').setScale(0.7).setAlpha(1).setDepth(1); 
        
        // --- Velatura scura sopra l'immagine (OPZIONALE, se vuoi il testo ancora più leggibile) ---
        // Se trovi che il testo sia difficile da leggere anche con l'immagine a alpha 1,
        // puoi aggiungere un altro rettangolo nero semi-trasparente sopra l'immagine.
        // this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5).setDepth(2); 
        
        const creditsText = [
            'Paideia',
            '(Alla scuola di atene)',
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
            'Hanno partecipato al progetto anche:',
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
            'Davide Sorrentino',
            'Giuseppe Di Mauro',
            'Marco Aprea',
            '',
            '',
            '',
            'Musiche:',
            '',
            '"On The Heavens" by Thoribass',
            '"Refuge of the Survivors" by Scott Buckley',
            '"The Introvert" by Michael Kobrin (from Pixabay)',
            '',
            '',
            '',
            'ITI E. BARSANTI - POMIGLIANO D\'ARCO',
            'Classe 4B',
            '',
            '',
            'Grazie per aver giocato!',
        ];

        const textObject = this.add.text(400, 600, creditsText, { 
            fontSize: '28px', 
            fill: '#E0D6B3', 
            fontFamily: '"Cinzel", serif', 
            align: 'center', 
            lineSpacing: 15 
        }).setOrigin(0.5, 0).setDepth(3); // Aumentato il setDepth per essere sopra gli sfondi

        this.tweens.add({ 
            targets: textObject, 
            y: -textObject.height, 
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
