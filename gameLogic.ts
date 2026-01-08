type Controls = { left: boolean; right: boolean; up: boolean }

type Player = {
  x: number
  y: number
  vx: number
  vy: number
  lives: number
  controls: Controls
}

interface GameState {
  players: Record<PlayerId, Player>
  gameOver: boolean
}

type Actions = {
  controls: (c: Controls) => void
}

declare const Rune: RuneClient<GameState, Actions>

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,

  setup: (playerIds) => {
    const players: any = {}

    playerIds.forEach((id, i) => {
      players[id] = {
        x: 100 + i * 500,
        y: 400,
        vx: 0,
        vy: 0,
        lives: 3,
        controls: { left: false, right: false, up: false },
      }
    })

    return { players, gameOver: false }
  },

  actions: {
    controls: (controls, { game, playerId }) => {
      game.players[playerId].controls = controls
    },
  },

  update: ({ game }) => {
    if (game.gameOver) return

    for (const id in game.players) {
      const p = game.players[id]

      // déplacements
      p.vx = p.controls.left ? -4 : p.controls.right ? 4 : 0
      if (p.controls.up && p.y >= 400) p.vy = -10

      p.vy += 0.5 // gravité
      p.x += p.vx
      p.y += p.vy

      if (p.y > 400) {
        p.y = 400
        p.vy = 0
      }

      // mort si tombe
      if (p.y > 600) {
        p.lives--
        p.x = 400
        p.y = 0

        if (p.lives <= 0) {
          game.gameOver = true
          Rune.gameOver({ reason: `${id} a perdu` })
        }
      }
    }
  },
})
