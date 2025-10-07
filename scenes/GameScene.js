class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Add the background image
        this.add.image(400, 300, 'game_bg').setDepth(-1);

        // --- INVISIBLE WALLS ---
        // Create a static physics group for the walls
        const walls = this.physics.add.staticGroup();

        // Top wall (under the arches)
        walls.create(400, 50, 'wall').setSize(800, 100).setVisible(false);
        // Left wall
        walls.create(50, 300, 'wall').setSize(100, 600).setVisible(false);
        // Right wall
        walls.create(750, 300, 'wall').setSize(100, 600).setVisible(false);

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.1);

        // Add collider between player and the invisible walls
        this.physics.add.collider(this.player, walls);

        this.philosophers = this.physics.add.group({
            collideWorldBounds: true,
        });

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

            // Add collider between philosophers and the invisible walls
            this.physics.add.collider(philosopher, walls);

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
        // ... (the rest of the update function does not need to change)
    }
}
