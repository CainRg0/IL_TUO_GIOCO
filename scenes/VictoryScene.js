class VictoryScene extends Phaser.Scene { // Nome della classe corretto: VictoryScene
    constructor() {
        super('VictoryScene'); // Chiave della scena corretta: VictoryScene
    }

    create() {
        // --- AGGIUNTO: Sfondo semi-trasparente nero per rendere opaca la scena sottostante ---
        this.add.rectangle(400, 300, 800, 600, 0x000000, 1).setDepth(0); // Colore nero, completamente opaco.
        
        // Testo di congratulazioni
        this.add.text(400, 200, 'CONGRATULAZIONI!', {
            fontSize: '48px',
            fill: '#ffd700', // Oro
            fontFamily: '"Cinzel", serif',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(1); 

        this.add.text(400, 280, 'HAI DIMOSTRATO LA TUA SAGGEZZA SUPERANDO LE PROVE DI TUTTI I PENSATORI.', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: '"Cinzel", serif',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5).setDepth(1);

        this.add.text(400, 400, '(Clicca per continuare ai titoli di coda)', {
            fontSize: '18px',
            fill: '#aaaaaa',
            fontFamily: '"Cinzel", serif',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1);

        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                // Ferma la musica di sottofondo se è ancora in riproduzione
                if (this.sound.get('bgm') && this.sound.get('bgm').isPlaying) {
                    this.sound.get('bgm').stop();
                }
                this.scene.start('CreditsScene'); // Avvia la CreditsScene
            });
        });
    }
}
