import { Client, Room } from "colyseus.js";
import { PaddleMoveMessage } from '../../server/src/PongRoom';
import { GameState } from "../../server/src/schema";
import { render, resizeCanvas } from "./render";
import { PaddleDirection } from "../../server/src/Physics";

let state: GameState;

async function main() {
  const client = new Client("ws://localhost:2567");
  let room: Room<GameState>;
  try {
    room = await client.joinOrCreate('pong', {}, GameState);
    console.log(room.sessionId, "joined", room.name);
  } catch (e) {
    console.log("JOIN ERROR", e);
  }

  state = room.state; // set initial state
  room.onStateChange((s) => { // set state on every update
    state = s;
  });

  window.addEventListener('resize', () => resizeCanvas());
  resizeCanvas();

  renderLoop(); // start render loop

  // input handling
  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        room.send({ newDirection: PaddleDirection.UP } as PaddleMoveMessage)
        break;
      case 'ArrowDown':
        room.send({ newDirection: PaddleDirection.DOWN } as PaddleMoveMessage)
        break;
    }
  });

  document.addEventListener('keyup', e => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        room.send({ newDirection: PaddleDirection.STOP } as PaddleMoveMessage);
    }
  });
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  render(state);
}

main();
