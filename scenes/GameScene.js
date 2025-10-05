class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#3d3d3d');
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);

        this.philosophers = this.physics.add.staticGroup();
        this.philosophers.create(150, 150, 'platone').setScale(0.2).setName('platone').refreshBody();
        this.philosophers.create(700, 500, 'aristotele').setScale(0.2).setName('aristotele').refreshBody();
        this.philosophers.create(650, 150, 'diogene').setScale(0.2).setName('diogene').refreshBody();
        this.philosophers.create(100, 500, 'socrate').setScale(0.2).setName('socrate').refreshBody();
        this.philosophers.create(400, 300, 'pitagora').setScale(0.2).setName('pitagora').refreshBody();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        // --- NUOVA LOGICA PER I PASSI ---
        // 1. Creiamo l'oggetto audio per i passi, ma non lo avviamo subito.
        //    Lo impostiamo in loop e a un volume basso.
        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
    }

    update() {
        if (this.dialogActive) {
            this.player.setVelocity(0);
            
            // Assicuriamoci che i passi si fermino anche se si apre un dialogo
            if (this.footstepsSound.isPlaying) {
                this.footstepsSound.stop();
            }
            return;
        }

        const speed = 200;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

        // --- LOGICA DI AVVIO/STOP DEI PASSI ---
        const isMoving = this.player.body.velocity.length() > 0;

        // Se il giocatore si sta muovendo E il suono dei passi non è già partito...
        if (isMoving && !this.footstepsSound.isPlaying) {
            // ...lo facciamo partire.
            this.footstepsSound.play();
        } 
        // Se invece il giocatore NON si sta muovendo E il suono dei passi è attivo...
        else if (!isMoving && this.footstepsSound.isPlaying) {
            // ...lo fermiamo immediatamente.
            this.footstepsSound.stop();
        }


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
