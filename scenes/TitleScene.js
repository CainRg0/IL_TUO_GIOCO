class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        // --- MODIFICATO: Sostituiamo lo sfondo statico con il video ---
        const bgVideo = this.add.video(400, 300, 'menu_bg_video');
        bgVideo.play(true); // Il 'true' fa in modo che il video vada in loop
        bgVideo.setDepth(-2); // Lo mettiamo nel livello più basso

        // Manteniamo il busto di Platone al centro, sopra il video ma dietro al testo
        this.add.image(400, 300, 'platone').setScale(0.8).setAlpha(0.4).setDepth(-1);

        // Il resto del codice per testi e pulsanti non cambia
        this.add.text(400, 150, 'Paideia', { fontSize: '72px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setShadow(2, 2, '#000', 4);
        this.add.text(400, 230, '(Alla scuola di atene)', { fontSize: '36px', fill: '#E0D6B3', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setShadow(2, 2, '#000', 4);
        
        this.startButton = this.add.text(400, 350, 'Inizia il Viaggio', { fontSize: '32px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.loreButton = this.add.text(400, 420, 'Lore', { fontSize: '24px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.creditsButton = this.add.text(750, 560, 'Crediti', { fontSize: '18px', fill: '#c5a65a', fontFamily: '"Cinzel", serif' }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

        // ... (tutto il resto del file non cambia)
    }

    // ... (le altre funzioni come startGame, showLore, etc. restano uguali)
}
