import { GameState, GameDimensions, Ball, Paddle, Scoreboard, GameStatus } from "../../server/src/schema";

const canvas = document.getElementById('rendering-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

function drawTextCenter(text: string) {
  ctx.fillText(text, GameDimensions.width / 2, GameDimensions.height / 2);
}

function drawHalfwayLine() {
  ctx.beginPath();
  ctx.setLineDash([17, 30]);
  ctx.moveTo(GameDimensions.width / 2, 0);
  ctx.lineTo(GameDimensions.width / 2, GameDimensions.height);
  ctx.stroke();

  // reset line for next drawing function
  ctx.setLineDash([]);
}

function renderBall(ball: Ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, Ball.radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function renderPaddle(paddle: Paddle) {
  ctx.fillRect(paddle.x - Paddle.width / 2, paddle.y - Paddle.height / 2, Paddle.width, Paddle.height);
}

function renderScoreboard(scoreboard: Scoreboard) {
  ctx.fillText(scoreboard.left.toString(), GameDimensions.width * (1 / 4), 100);
  ctx.fillText(scoreboard.right.toString(), GameDimensions.width * (3 / 4), 100);
}

export function render(state: GameState) {
  // Clear screen
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, GameDimensions.width, GameDimensions.height);

  // Rendering styles
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 10;
  ctx.font = '100px Monospace';
  ctx.textAlign = "center";

  switch (state.gameStatus) {
    case GameStatus.WAITING:
      drawTextCenter('Waiting for opponent...');
      break;

    case GameStatus.PLAYING:
      // Draw
      drawHalfwayLine();
      renderBall(state.ball);
      renderPaddle(state.leftPaddle);
      renderPaddle(state.rightPaddle);
      renderScoreboard(state.scoreboard);
      break;

    case GameStatus.FINISHED:
      renderScoreboard(state.scoreboard);
      drawTextCenter('Game finished');
      break;

    case GameStatus.INTERRUPTED:
      drawTextCenter('Opponent left');
      break;
  }
}

export function resizeCanvas() {
  const scale = Math.min(window.innerWidth / GameDimensions.width, window.innerHeight / GameDimensions.height);
  ctx.canvas.width = GameDimensions.width * scale;
  ctx.canvas.height = GameDimensions.height * scale;
  ctx.scale(scale, scale);
}
