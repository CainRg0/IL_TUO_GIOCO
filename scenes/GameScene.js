class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Sfondo
        this.cameras.main.setBackgroundColor('#3d3d3d');

        // Giocatore
        this.player = this.physics.add.sprite(30, 120, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.8); // Aggiusta la scala se necessario

        // Filosofi (come oggetti fisici statici)
        this.philosophers = this.physics.add.staticGroup();
        this.philosophers.create(250, 150, 'platone').setScale(0.2).setName('platone').refreshBody();
        this.philosophers.create(450, 450, 'aristotele').setScale(0.2).setName('aristotele').refreshBody();
        this.philosophers.create(650, 250, 'diogene').setScale(0.2).setName('diogene').refreshBody();
        
        // Controlli
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Musica
        this.sound.play('bgm', { loop: true, volume: 0.4 });
    }

    update() {
        if (this.dialogActive) {
            this.player.setVelocity(0);
            return;
        }

        // Movimento
        const speed = 200;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

        // Interazione
        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 70) {
                canInteractWith = philosopher;
                break;
            }
        }
        
        this.events.emit('interactionUpdate', canInteractWith);

        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.dialogActive = true;
            this.events.emit('startDialog', canInteractWith.name);
        }
    }

}
