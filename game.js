const WIDTH = 800
const HEIGHT = 600

let sprites = {}
let lastControls = { left: false, right: false, up: false }
let cursors

class Game extends Phaser.Scene {
  preload() {
    this.load.image("sky", "assets/sky.png")
    this.load.image("ground", "assets/platform.png")
    this.load.spritesheet("dude", "assets/personnageframe1.png", {
      frameWidth: 320,
      frameHeight: 480,
    })
    this.load.image("heart", "assets/vie1.png")
  }

  create() {
    this.add.image(400, 300, "sky")

    cursors = this.input.keyboard.createCursorKeys()

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
    })
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    Rune.initClient({
      onChange: ({ game }) => {
        this.renderWorld(game)
      },
    })
  }

  renderWorld(game) {
    // joueurs
    for (const playerId in game.players) {
      const p = game.players[playerId]

      if (!sprites[playerId]) {
        sprites[playerId] = this.add
          .sprite(p.x, p.y, "dude")
          .setScale(0.12)
      }

      const s = sprites[playerId]
      s.x = p.x
      s.y = p.y

      if (p.controls.left) s.anims.play("left", true)
      else if (p.controls.right) s.anims.play("right", true)
      else s.anims.play("turn", true)

      // vies
      if (!s.hearts) {
        s.hearts = []
        for (let i = 0; i < 3; i++) {
          s.hearts.push(
            this.add.image(
              playerId === Rune.playerId ? 40 + i * 40 : WIDTH - 120 + i * 40,
              40,
              "heart"
            ).setScale(0.02)
          )
        }
      }

      s.hearts.forEach((h, i) => {
        h.setVisible(i < p.lives)
      })
    }
  }

  update() {
    const controls = {
      left: cursors.left.isDown,
      right: cursors.right.isDown,
      up: cursors.up.isDown,
    }

    if (
      controls.left !== lastControls.left ||
      controls.right !== lastControls.right ||
      controls.up !== lastControls.up
    ) {
      lastControls = controls
      Rune.actions.controls(controls)
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  scene: Game,
})

