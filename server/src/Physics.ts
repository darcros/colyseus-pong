import { Ball, Paddle, GameDimensions, GameState } from "./schema";
import { toRadians, map } from "./util";

export enum PaddleDirection {
  UP = 0,
  DOWN,
  STOP,
}

interface PhysicsOptions {
  ballSpeed: number;
  paddleSpeed: number;
  ballAngle: number;
}

export class Physics {
  // game components
  private ball: Ball;
  private lp: Paddle;
  private rp: Paddle;

  private lpDirection = PaddleDirection.STOP;
  private rpDirection = PaddleDirection.STOP;
  paddleSpeed: number;

  // ball angle and speed
  private angle: number = 0; // initialized to 0 but immediately updated by setAngle() in constructor() 
  private ballSpeed: number;

  // vertical and horizontal speed, updated by setAngle()
  private xSpeed: number = 0;
  private ySpeed: number = 0;

  constructor(
    ball: Ball,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    options?: PhysicsOptions,
  ) {
    const {
      ballSpeed = 0.5,
      ballAngle = 0,
      paddleSpeed = 0.3,
    } = options || {};

    this.ball = ball;
    this.lp = leftPaddle;
    this.rp = rightPaddle;

    this.ballSpeed = ballSpeed;
    this.paddleSpeed = paddleSpeed;

    this.setAngle(toRadians(ballAngle));
  }

  public setAngle(angle: number) {
    this.angle = angle;
    this.xSpeed = this.ballSpeed * Math.cos(angle);
    this.ySpeed = this.ballSpeed * Math.sin(angle);
  }

  public getAngle() {
    return this.angle;
  }

  public setLeftPaddleDirection(direction: PaddleDirection) {
    this.lpDirection = direction;
  }

  public getLeftPaddleDirection() {
    return this.lpDirection;
  }

  public setRightPaddleDirection(direction: PaddleDirection) {
    this.rpDirection = direction;
  }

  public getRightPaddleDirection() {
    return this.rpDirection;
  }

  private leftPaddleCollision() {
    if (this.ball.y - Ball.radius < this.lp.y + Paddle.height / 2 &&
      this.ball.y + Ball.radius > this.lp.y - Paddle.height / 2 &&
      this.ball.x - Ball.radius < this.lp.x + Paddle.width / 2) {

      if (this.ball.x > this.lp.x) {
        const diff = this.ball.y - (this.lp.y - Paddle.height / 2);
        const rad = toRadians(45);
        const angle = map(diff, 0, Paddle.height, -rad, rad);
        this.setAngle(angle);
        this.ball.x = this.lp.x + Paddle.width / 2 + Ball.radius;
      }

    }
  }

  private rightPaddleCollision() {
    if (this.ball.y - Ball.radius < this.rp.y + Paddle.height / 2 &&
      this.ball.y + Ball.radius > this.rp.y - Paddle.height / 2 &&
      this.ball.x + Ball.radius > this.rp.x - Paddle.width / 2) {

      if (this.ball.x < this.rp.x) {
        const diff = this.ball.y - (this.rp.y - Paddle.height / 2);
        const angle = map(diff, 0, Paddle.height, toRadians(225), toRadians(135));
        this.setAngle(angle);
        this.ball.x = this.rp.x - Paddle.width / 2 - Ball.radius;
      }
    }
  }

  private topBottomCollision() {
    if (this.ball.y < 0 + Ball.radius || this.ball.y > GameDimensions.height - Ball.radius) {
      this.ySpeed = -this.ySpeed;
    }
  }

  public checkRightWall() {
    if (this.ball.x - Ball.radius > GameDimensions.width) {
      return true;
    }

    return false;
  }

  public checkLeftWall() {
    if (this.ball.x + Ball.radius < 0) {
      return true;
    }

    return false;
  }

  private movePaddle(paddle: Paddle, direction: PaddleDirection, deltaTime: number) {
    switch (direction) {
      case PaddleDirection.UP:
        const minY = Paddle.height / 2;
        paddle.y = Math.max(minY, paddle.y - this.paddleSpeed * deltaTime);
        break;

      case PaddleDirection.DOWN:
        const maxY = GameDimensions.height - Paddle.height / 2;
        paddle.y = Math.min(maxY, paddle.y + this.paddleSpeed * deltaTime);
        break;
    }
  }



  public update(deltaTime: number) {
    this.leftPaddleCollision();
    this.rightPaddleCollision();
    this.topBottomCollision();

    this.ball.x += this.xSpeed * deltaTime;
    this.ball.y += this.ySpeed * deltaTime;

    this.movePaddle(this.lp, this.lpDirection, deltaTime);
    this.movePaddle(this.rp, this.rpDirection, deltaTime);
  }
}
