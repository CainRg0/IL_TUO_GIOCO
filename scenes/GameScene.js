class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false;
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // this.physics.world.setBounds(...) NON viene usato.
        const walls = this.physics.add.staticGroup();

        // --- BARRIERE INVISIBILI (ANCORA VISIBILI PER L'ULTIMO CONTROLLO) ---
        // Ho ingrandito e riposizionato le barriere verdi per coprire l'intera area calpestabile
        // come si vede nello screenshot.
        
        // Barriera SUPERIORE (verde): copre la parte più alta del pavimento, dove incontra il muro/colonne di sfondo
        // Coordinate stimate dallo screenshot: inizia circa a y=180, larga quasi quanto lo schermo, alta poco.
        walls.create(400, 180).setSize(750, 40).setTint(0x00ff00).setVisible(true); 
        
        // Barriera INFERIORE (verde): copre il "marciapiede" in primo piano, non calpestabile
        // Coordinate stimate dallo screenshot: finisce circa a y=550, larga quasi quanto lo schermo, alta di più.
        walls.create(400, 550).setSize(750, 60).setTint(0x00ff00).setVisible(true); 
        
        // Barriera SINISTRA (verde): copre le statue e le colonne di sinistra
        // Coordinate stimate dallo screenshot: inizia circa a x=120, si estende in altezza.
        walls.create(120, 360).setSize(50, 400).setTint(0x00ff00).setVisible(true); 
        
        // Barriera DESTRA (verde): copre le statue e le colonne di destra
        // Coordinate stimate dallo screenshot: finisce circa a x=680, si estende in altezza.
        walls.create(680, 360).setSize(50, 400).setTint(0x00ff00).setVisible(true); 
        
        // --- FINE BARRIERE ---

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(400, 480, 'player'); 
        this.player.setScale(0.1);
        
        this.player.setCollideWorldBounds(false); 
        this.physics.add.collider(this.player, walls); 

        this.philosophers = this.physics.add.group(); 

        const philosopherData = [
            { key: 'platone', x: 250, y: 300, scale: 0.2 },
            { key: 'aristotele', x: 400, y: 400, scale: 0.2 }, // Spostato Aristotele un po' più al centro per dare spazio
            { key: 'diogene', x: 400, y: 250, scale: 0.2 }, // Spostato Diogene un po' più al centro
            { key: 'socrate', x: 200, y: 450, scale: 0.2 },
            { key: 'pitagora', x: 600, y: 450, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);

            const name = data.key.charAt(0).toUpperCase() + data.key.slice(1);
            const label = this.add.text(philosopher.x, philosopher.y - 45, name, {
                fontSize: '14px',
                fill: '#ffffff',
                fontFamily: '"Cinzel", serif',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            
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

        this.events.on('endDialog', () => {
            this.isPlayerBlocked = false; 
            this.philosophers.getChildren().forEach(p => p.setVelocity(0)); 
            this.movePhilosophers(); 
        });
    }

    movePhilosophers() {
        const speed = 30;
        this.philosophers.getChildren().forEach(philosopher => {
            if (this.scene.get('UIScene').currentPhilosopher === philosopher.name) {
                philosopher.setVelocity(0, 0); 
                return; 
            }
            const randNumber = Phaser.Math.Between(0, 8); 
            switch (randNumber) {
                case 0: philosopher.setVelocity(0, -speed); break; 
                case 1: philosopher.setVelocity(speed, 0); break;  
                case 2: philosopher.setVelocity(0, speed); break;  
                case 3: philosopher.setVelocity(-speed, 0); break; 
                case 4: philosopher.setVelocity(speed * 0.7, -speed * 0.7); break; 
                case 5: philosopher.setVelocity(speed * 0.7, speed * 0.7); break;  
                case 6: philosopher.setVelocity(-speed * 0.7, speed * 0.7); break; 
                case 7: philosopher.setVelocity(-speed * 0.7, -speed * 0.7); break; 
                default: philosopher.setVelocity(0, 0); break; 
            }
        });
    }

    update() {
        const playerSpeed = 200;
        this.player.setVelocity(0);

        if (!this.isPlayerBlocked) {
            if (this.cursors.left.isDown) this.player.setVelocityX(-playerSpeed);
            else if (this.cursors.right.isDown) this.player.setVelocityX(playerSpeed);
            if (this.cursors.up.isDown) this.player.setVelocityY(-playerSpeed);
            else if (this.cursors.down.isDown) this.player.setVelocityY(playerSpeed);
        }

        const isMoving = this.player.body.velocity.length() > 0 && !this.isPlayerBlocked;
        if (isMoving && this.footstepsSound.isPaused) {
            this.footstepsSound.resume();
        } 
        else if (!isMoving && !this.footstepsSound.isPaused) {
            this.footstepsSound.pause();
        }

        this.philosophers.getChildren().forEach(philosopher => {
            if (philosopher.nameLabel) {
                philosopher.nameLabel.setPosition(philosopher.x, philosopher.y - 45);
            }
        });

        let canInteractWith = null;
        for (const philosopher of this.philosophers.getChildren()) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, philosopher.x, philosopher.y);
            if (distance < 100) {
                canInteractWith = philosopher;
                break;
            }
        }
        
        this.events.emit('interactionUpdate', canInteractWith);

        if (canInteractWith && Phaser.Input.Keyboard.JustDown(this.interactKey) && !this.isPlayerBlocked) {
            this.isPlayerBlocked = true; 
            this.events.emit('startDialog', canInteractWith.name);
        }
    }
}
