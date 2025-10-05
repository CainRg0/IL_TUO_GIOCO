class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('boh', 'tiles');

        const pavimentoLayer = map.createLayer('pavimento', tileset, 0, 0);
        const varieLayer = map.createLayer('varie', tileset, 0, 0);
        const muriLayer = map.createLayer('muri', tileset, 0, 0);

        muriLayer.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(400, 500, 'player');
        this.player.setScale(1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, muriLayer);

        this.philosophers = this.physics.add.group({
            collideWorldBounds: true,
        });
        const philosopherData = [
            { key: 'platone', x: 220, y: 450 },
            { key: 'aristotele', x: 580, y: 450 },
            { key: 'diogene', x: 400, y: 480 },
            { key: 'socrate', x: 100, y: 500 },
            { key: 'pitagora', x: 700, y: 500, scale: 0.15 }
        ];
        philosopherData.forEach(data => {
            const philosopher = this.philosophers.create(data.x, data.y, data.key)
                .setScale(data.scale || 0.2)
                .setName(data.key);
            philosopher.body.setCircle(philosopher.width / 2 * 0.8);
            philosopher.body.setImmovable(true);
        });
        
        this.physics.add.collider(this.player, this.philosophers);
        this.physics.add.collider(this.philosophers, this.philosophers);
        this.physics.add.collider(this.philosophers, muriLayer);

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

    movePhilosophers() { /* ... non cambia ... */ }
    update() { /* ... non cambia ... */ }
}
