class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isPlayerBlocked = false;
    }

    create() {
        this.add.image(400, 300, 'game_bg').setDepth(-1);
        
        // --- Rimuoviamo i limiti del mondo fisico ---
        // this.physics.world.setBounds(...) NON viene più usato per le collisioni del player.

        const walls = this.physics.add.staticGroup();

        // --- BARRIERE INVISIBILI (ORA VISIBILI PER DEBUGGING) ---
        // Queste barriere ora sono visualizzate in VERDE per aiutarti a capire dove si trovano.
        // Il player colliderà solo con queste. I filosofi le ignoreranno.
        // Ho prov provato a dare coordinate che massimizzano lo spazio centrale.
        
        // Barriera SUPERIORE (verde)
        // Coincide con il bordo superiore dell'area del pavimento visibile.
        walls.create(400, 190).setSize(420, 20).setTint(0x00ff00).setVisible(true); // x, y, width, height
        
        // Barriera INFERIORE (verde)
        // Coincide con il bordo inferiore dell'area del pavimento giocabile (prima del "marciapiede").
        walls.create(400, 520).setSize(420, 20).setTint(0x00ff00).setVisible(true); 
        
        // Barriera SINISTRA (verde)
        // Coincide con il bordo sinistro dell'area giocabile (colonna interna sinistra).
        walls.create(190, 350).setSize(20, 330).setTint(0x00ff00).setVisible(true); 
        
        // Barriera DESTRA (verde)
        // Coincide con il bordo destro dell'area giocabile (colonna interna destra).
        walls.create(610, 350).setSize(20, 330).setTint(0x00ff00).setVisible(true); 
        
        // --- FINE BARRIERE ---

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(400, 480, 'player'); 
        this.player.setScale(0.1);
        
        // --- IL PLAYER ORA COLLIDE SOLO CON LE NOSTRE "walls" STATICHE ---
        this.player.setCollideWorldBounds(false); // Rimuovi il blocco con i limiti del mondo
        this.physics.add.collider(this.player, walls); // Fai collidere il player con le nostre barriere verdi

        this.philosophers = this.physics.add.group(); // I filosofi non hanno limiti del mondo o collisioni con walls

        const philosopherData = [
            { key: 'platone', x: 250, y: 300, scale: 0.2 },
            { key: 'aristotele', x: 550, y: 300, scale: 0.2 },
            { key: 'diogene', x: 400, y: 330, scale: 0.2 },
            { key: 'socrate', x: 200, y: 400, scale: 0.2 },
            { key: 'pitagora', x: 600, y: 400, scale: 0.15 }
        ];

        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale)
                .setName(data.key);
            
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
            // I filosofi non collidono con le 'walls', né con i 'world.bounds'.
            // Sono liberi di vagare ovunque nel canvas 800x600.

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
            // I filosofi si muovono casualmente nell'intera area 800x600 del canvas.
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
