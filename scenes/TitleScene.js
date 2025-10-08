class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const bgVideo = this.add.video(400, 300, 'menu_bg_video');
        bgVideo.play(true);
        bgVideo.setDepth(-2);

        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.9);
        panel.fillRoundedRect(175, 80, 450, 450, 15);
        panel.setDepth(-1);

        this.add.image(400, 320, 'platone').setScale(0.8).setAlpha(0.5).setDepth(0);
        
        this.menuMusic = this.sound.add('menu_music', { loop: true, volume: 0.5 });
        this.menuMusic.play();

        this.add.text(400, 130, 'Paideia', { fontSize: '72px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setShadow(2, 2, '#000', 4).setDepth(1);
        this.add.text(400, 210, 'Alla Scuola di Atene', { fontSize: '36px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setShadow(2, 2, '#000', 4).setDepth(1);
        
        this.startButton = this.add.text(400, 350, 'Inizia il Viaggio', { fontSize: '32px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
        this.loreButton = this.add.text(400, 420, 'Lore', { fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
        this.creditsButton = this.add.text(750, 560, 'Crediti', { fontSize: '18px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).setDepth(1);

        this.startButton.on('pointerdown', () => this.startGame());
        this.loreButton.on('pointerdown', () => this.showLore());
        this.creditsButton.on('pointerdown', () => this.showCredits());
        
        [this.startButton, this.loreButton, this.creditsButton].forEach(button => {
            button.on('pointerover', () => button.setStyle({ fill: '#FFFFFF' }));
            button.on('pointerout', () => button.setStyle({ fill: '#c5a65a' }));
        });

        this.narratorSound = this.sound.add('narrator');
        this.createLoreScreen();

        this.konamiCode = ['ARROWUP', 'ARROWUP', 'ARROWDOWN', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWLEFT', 'ARROWRIGHT', 'B', 'A'];
        this.inputKeys = [];
        this.input.keyboard.on('keydown', this.handleKonamiCode, this);
    }

    startGame() { 
        this.sound.stopAll();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('IntroScene');
        });
    }
    showCredits() { 
        this.sound.stopAll();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('CreditsScene');
        });
    }
    showVictory() { 
        this.sound.stopAll();
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('VictoryScene');
        });
    }

    // --- FUNZIONE createLoreScreen CORRETTA CON setDepth ALTO ---
    createLoreScreen() {
        this.loreGroup = this.add.group();

        // Ogni elemento della lore deve avere un setDepth molto alto per essere in primo piano
        const bg = this.add.graphics().fillStyle(0xE0D6B3, 1).fillRect(0, 0, 800, 600).setDepth(999);
        const image = this.add.image(240, 300, 'scuola_di_atene').setScale(0.4).setDepth(999);
        
        const title = this.add.text(570, 70, 'Paideia - Alla Scuola di Atene', {
            fontSize: '32px',
            fill: '#000000',
            fontFamily: '"Cinzel", serif',
            align: 'center'
        }).setOrigin(0.5, 0).setDepth(999); // setDepth alto

        const loreTextContent = [
            'Opera di Raffaello Sanzio (1509-1511), celebra la conoscenza e la filosofia classica.', '',
            'Significato e Personaggi',
            'Al centro, Platone punta verso l\'alto (il mondo delle idee), mentre Aristotele indica il basso (il mondo terreno).', '',
            'Nel gioco incontri:',
            '• Socrate: maestro di Platone',
            '• Pitagora: intento a scrivere le sue teorie',
            '• Diogene: il cinico, sdraiato sugli scalini'
        ];
        const text = this.add.text(570, 150, loreTextContent, { 
            fontSize: '18px', 
            fill: '#000000', 
            fontStyle: 'bold', 
            align: 'center', 
            wordWrap: { width: 380 }, 
            lineSpacing: 10 
        }).setOrigin(0.5, 0).setDepth(999); // setDepth alto

        const closeButton = this.add.text(240, 560, '[ Chiudi ]', { 
            fontSize: '24px', 
            fill: '#333', 
            fontFamily: '"Cinzel", serif' 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(999); // setDepth alto
        
        closeButton.on('pointerover', () => closeButton.setStyle({ fill: '#000' }));
        closeButton.on('pointerout', () => closeButton.setStyle({ fill: '#333' }));
        closeButton.on('pointerdown', () => this.hideLore());

        this.loreGroup.addMultiple([bg, image, title, text, closeButton]);
        this.loreGroup.setVisible(false);
    }
    
    showLore() {
        // Nascondi gli elementi del menu principale
        this.startButton.setVisible(false);
        this.loreButton.setVisible(false);
        this.creditsButton.setVisible(false);
        
        // Rendi visibile il gruppo della lore
        this.loreGroup.setVisible(true);

        if (this.menuMusic.isPlaying) this.menuMusic.pause();
        if (this.sound.context.state === 'suspended') { this.sound.context.resume(); }
        this.narratorSound.play();
    }

    hideLore() {
        // Nascondi il gruppo della lore
        this.loreGroup.setVisible(false);

        // Rendi visibili gli elementi del menu principale
        this.startButton.setVisible(true);
        this.loreButton.setVisible(true);
        this.creditsButton.setVisible(true);

        if (this.narratorSound && this.narratorSound.isPlaying) {
            this.narratorSound.stop();
        }
        if (this.menuMusic.isPaused) this.menuMusic.resume();
    }

    handleKonamiCode(event) {
        this.inputKeys.push(event.key.toUpperCase());
        if (this.inputKeys.length > this.konamiCode.length) this.inputKeys.shift();
        if (this.inputKeys.join('') === this.konamiCode.join('')) {
            this.showVictory();
        }
    }
}
