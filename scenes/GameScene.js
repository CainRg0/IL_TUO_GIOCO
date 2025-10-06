class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#3d3d3d');
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.1);

        this.philosophers = this.physics.add.group({
            collideWorldBounds: true,
        });
        
        // --- NUOVO: Gruppo per le etichette con i nomi ---
        this.nameLabels = this.add.group();

        const philosopherData = [
            { key: 'platone', x: 150, y: 150, scale: 0.2 },
            { key: 'aristotele', x: 700, y: 500, scale: 0.2 },
            { key: 'diogene', x: 650, y: 150, scale: 0.2 },
            { key: 'socrate', x: 100, y: 500, scale: 0.2 },
            { key: 'pitagora', x: 400, y: 300, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);

            // --- NUOVO: Creiamo l'etichetta con il nome sopra il filosofo ---
            const name = data.key.charAt(0).toUpperCase() + data.key.slice(1); // Mette la prima lettera maiuscola
            const label = this.add.text(philosopher.x, philosopher.y - 30, name, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: '"Cinzel", serif',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            
            // Colleghiamo l'etichetta al filosofo per poterla aggiornare
            philosopher.nameLabel = label;
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', { loop: true, volume: 0.4 });
        }

        this.footstepsSound = this.sound.add('footsteps', { loop: true, volume: 0.3 });
        this.footstepsSound.play();
        this.footstepsSound.pause();

        this.time.addEvent({
            delay: 3000,
            callback: this.movePhilosophers,
            callbackScope: this,
            loop: true
        });
    }

    movePhilosophers() {
        if (this.dialogActive) return;
        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            const randNumber = Phaser.Math.Between(0, 5);
            switch (randNumber) {
                case 0: philosopher.setVelocity(0, -speed); break;
                case 1: philosopher.setVelocity(speed, 0); break;
                case 2: philosopher.setVelocity(0, speed); break;
                case 3: philosopher.setVelocity(-speed, 0); break;
                default: philosopher.setVelocity(0, 0); break;
            }
        });
    }

    update() {
        // --- NUOVO: Aggiorniamo la posizione delle etichette per farle seguire i personaggi ---
        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 35);
            }
        });

        if (this.dialogActive) {
            this.player.setVelocity(0);
            this.philosophers.setVelocity(0, 0);
            if (!this.footstepsSound.isPaused) this.footstepsSound.pause();
            return;
        }

        const playerSpeed = 200;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);

        const isMoving = this.player.body.velocity.length() > 0;
        if (isMoving && this.footstepsSound.isPaused) this.footstepsSound.resume();
        else if (!isMoving && !this.footstepsSound.isPaused) this.footstepsSound.pause();

        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            // --- MODIFICATO: Aumentata la distanza per l'interazione da 70 a 100 ---
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 100) {
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
