class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        this.add.image(400, 300, 'platone').setScale(0.8).setAlpha(0.3);

        this.add.text(400, 200, 'La Scuola di Atene', {
            fontSize: '52px',
            fill: '#E0D6B3',
            fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setShadow(2, 2, '#000', 4);

        // --- BOTTONI DEL MENU ---
        this.startButton = this.add.text(400, 350, 'Inizia il Viaggio', {
            fontSize: '32px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        this.loreButton = this.add.text(400, 420, 'Lore', {
            fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Eventi per i pulsanti
        this.startButton.on('pointerover', () => this.startButton.setStyle({ fill: '#fff' }));
        this.startButton.on('pointerout', () => this.startButton.setStyle({ fill: '#c5a65a' }));
        this.startButton.on('pointerdown', () => this.startGame());

        this.loreButton.on('pointerover', () => this.loreButton.setStyle({ fill: '#fff' }));
        this.loreButton.on('pointerout', () => this.loreButton.setStyle({ fill: '#c5a65a' }));
        this.loreButton.on('pointerdown', () => this.showLore());

        // --- Elementi per la schermata LORE (inizialmente invisibili) ---
        this.createLoreScreen();

        // --- CODICE SEGRETO (KONAMI CODE) ---
        this.konamiCode = ['ARROWUP', 'ARROWUP', 'ARROWDOWN', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWLEFT', 'ARROWRIGHT', 'B', 'A'];
        this.inputKeys = [];
        this.input.keyboard.on('keydown', this.handleKonamiCode, this);
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene');
            this.scene.launch('UIScene');
        });
    }

    // --- Schermata Lore con le modifiche grafiche ---
    createLoreScreen() {
        this.loreGroup = this.add.group();

        // MODIFICATO: Sfondo chiaro (pergamena) invece che nero
        const bg = this.add.graphics().fillStyle(0xE0D6B3, 0.9).fillRect(50, 20, 700, 560);
        
        const image = this.add.image(400, 140, 'scuola_di_atene').setScale(0.3);

        const loreTextContent = [
            'L\'Affresco: La Scuola di Atene',
            '',
            'Opera di Raffaello Sanzio (1509-1511) situata nelle Stanze Vaticane, celebra la conoscenza e la filosofia classica, riunendo i più grandi pensatori dell\'antichità.',
            '',
            'Significato e Personaggi',
            'Al centro, Platone punta verso l\'alto (il mondo delle idee), mentre Aristotele indica il basso (il mondo terreno). Nel gioco incontri anche:',
            '• Socrate: maestro di Platone, con il profilo schiacciato.',
            '• Pitagora: in primo piano, intento a scrivere le sue teorie sui numeri.',
            '• Diogene: il cinico, sdraiato con indifferenza sugli scalini.'
        ];

        // MODIFICATO: Posizione (y: 260) e colore del testo (fill: '#000000')
        const text = this.add.text(400, 260, loreTextContent, {
            fontSize: '17px', fill: '#000000', align: 'center', wordWrap: { width: 650 }, lineSpacing: 8
        }).setOrigin(0.5, 0);

        // MODIFICATO: Colore del pulsante per adattarsi allo sfondo chiaro
        const closeButton = this.add.text(400, 550, '[ Chiudi ]', {
            fontSize: '24px', fill: '#333', fontFamily: '"Cinzel", serif'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeButton.on('pointerover', () => closeButton.setStyle({ fill: '#000' }));
        closeButton.on('pointerout', () => closeButton.setStyle({ fill: '#333' }));
        closeButton.on('pointerdown', () => this.hideLore());

        this.loreGroup.addMultiple([bg, image, text, closeButton]);
        this.loreGroup.setVisible(false);
    }
    
    showLore() {
        this.startButton.setVisible(false);
        this.loreButton.setVisible(false);
        this.loreGroup.setVisible(true);
    }

    hideLore() {
        this.loreGroup.setVisible(false);
        this.startButton.setVisible(true);
        this.loreButton.setVisible(true);
    }

    handleKonamiCode(event) {
        this.inputKeys.push(event.key.toUpperCase());
        if (this.inputKeys.length > this.konamiCode.length) {
            this.inputKeys.shift();
        }

        if (this.inputKeys.join('') === this.konamiCode.join('')) {
            console.log('Codice Segreto Attivato!');
            this.sound.stopAll();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CreditsScene');
            });
        }
    }
}
