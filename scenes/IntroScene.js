class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        // Avvia la musica dell'introduzione
        this.sound.play('intro_music', { loop: true, volume: 0.6 });

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500);

        const dialogBox = this.add.graphics();
        dialogBox.fillStyle(0x000000, 0.8).fillRoundedRect(50, 380, 700, 200, 16);
        this.dialogText = this.add.text(80, 400, '', { fontSize: '20px', fill: '#fff', wordWrap: { width: 640 } });

        // Definiamo i due testi separatamente
        this.introPart1 = 'Benvenuto, giovane pensatore.\n\nIl tuo viaggio nella conoscenza sta per iniziare. Supera le prove dei grandi maestri del passato per dimostrare la tua saggezza.\n\n(Clicca per continuare)';
        this.introPart2 = 'COMANDI:\n' +
                          '- Usa le FRECCE DIREZIONALI per muoverti.\n' +
                          '- Avvicinati a un filosofo e premi [E] per interagire.\n\n' +
                          '(Clicca per iniziare)';

        // Avviamo la prima parte del testo
        this.typewriteText(this.introPart1, () => {
            // Quando il primo testo è finito, aspetta un clic per mostrare la seconda parte
            this.input.once('pointerdown', () => {
                this.typewriteText(this.introPart2, () => {
                    // Quando il secondo testo è finito, aspetta un clic per iniziare il gioco
                    this.input.once('pointerdown', () => {
                        this.sound.stopAll(); // Ferma la musica dell'intro
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                            this.scene.start('GameScene');
                            this.scene.launch('UIScene');
                        });
                    });
                });
            });
        });
    }

    typewriteText(text, onComplete) {
        const length = text.length;
        let i = 0;
        this.dialogText.setText('');

        // Se c'è un'animazione di testo in corso, la fermiamo
        if (this.typingEvent) {
            this.typingEvent.remove();
        }
        
        this.typingEvent = this.time.addEvent({
            callback: () => {
                this.dialogText.text += text[i];
                i++;
                if (i === length) {
                    if (onComplete) {
                        onComplete(); // Chiama la funzione di callback quando ha finito
                    }
                }
            },
            repeat: length - 1,
            delay: 40,
        });
    }
}
