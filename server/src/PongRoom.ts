import { Room, Client } from 'colyseus';
import { GameState, GameStatus } from './schema';
import { Physics, PaddleDirection } from './Physics';

export interface PaddleMoveMessage {
  newDirection: PaddleDirection,
}

export class PongRoom extends Room<GameState> {
  maxClients = 2;

  private physics!: Physics;
  private lpId!: string;
  private rpId!: string;

  onCreate(options: any) {
    console.info('PongRoom created', options);
    this.setState(new GameState());

    this.physics = new Physics(this.state.ball, this.state.leftPaddle, this.state.rightPaddle);
  }

  private update(deltaTime: number) {
    if (this.state.gameStatus !== GameStatus.PLAYING) return;

    if (this.physics.checkLeftWall()) {
      this.state.scoreboard.right += 1;
      this.state.ball.center();
      this.physics.setAngle(0);
    }
    if (this.physics.checkRightWall()) {
      this.state.scoreboard.left += 1;
      this.state.ball.center();
      this.physics.setAngle(Math.PI);
    }

    if (this.state.scoreboard.left >= 3 || this.state.scoreboard.right >= 3) {
      this.state.gameStatus = GameStatus.FINISHED;
      return;
    }

    this.physics.update(deltaTime);
  }

  onJoin(client: Client, options: any) {
    if (this.clients.length === 1) {
      this.lpId = client.id;
    } else if (this.clients.length === 2) {
      this.rpId = client.id;
      this.state.gameStatus = GameStatus.PLAYING;
      this.setSimulationInterval(deltaTime => this.update(deltaTime));
    }
  }

  // FIXME: strong typing of message is not enforced
  onMessage(client: Client, message: PaddleMoveMessage) {
    if (client.id === this.rpId)
      this.physics.setRightPaddleDirection(message.newDirection);

    if (client.id === this.lpId)
      this.physics.setLeftPaddleDirection(message.newDirection);
  }

  onLeave(client: Client, consented: boolean) {
    // if a player leaves the game is cancelled
    this.state.gameStatus = GameStatus.INTERRUPTED;
  }

  onDispose() {
    console.info('Disposing PongRoom');
  }

}
