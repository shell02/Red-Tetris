const PieceType = {
  I: 'I',
  J: 'J',
  L: 'L',
  O: 'O',
  S: 'S',
  T: 'T',
  Z: 'Z',
};

const RotationPhase = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

// positions = [
//   { x: 0, y: 0 },
//   { x: 0, y: 1 },
//   { x: 0, y: 2 },
//   { x: 0, y: 3 },
// ];

/**
 * Piece pattern at RotationPhase.UP:
 * I -> 1 2 3 4
 *
 * J -> 1
 *      2 3 4
 *
 * L ->     1
 *      2 3 4
 *
 * O -> 1 2
 *      3 4
 *
 * S ->   1 2
 *      3 4
 *
 * T ->   1
 *      2 3 4
 *
 * Z -> 1 2
 *        3 4
 */

class Piece {
  constructor(type, rotation, grid) {
    this.type = type;
    this.rotation = RotationPhase.UP;
    this.isMoving = false;

    this.positions = this.calculateInitialPositions(rotation, grid);
  }

  startMoving() {
    this.isMoving = true;
  }

  stopMoving() {
    this.isMoving = false;
  }

  gridBounds() {
    return this.positions.every(
      (position) => position.x >= 0
      && position.x < 10
      && position.y >= 0 && position < 20,
    );
  }

  place(grid) {
    const newGrid = grid;
    this.positions.forEach((position) => {
      if (position.y < 0) {
        return;
      }
      newGrid[position.x][position.y] = this.type;
    });
    return newGrid;
  }

  moveLeft(grid) {
    if (!this.isMoving || this.collides(grid, { x: -1, y: 0 })) {
      return;
    }
    this.positions = this.positions.map((position) => ({
      x: position.x - 1,
      y: position.y,
    }));
  }

  moveRight(grid) {
    if (!this.isMoving || this.collides(grid, { x: 1, y: 0 })) {
      return;
    }
    this.positions = this.positions.map((position) => ({
      x: position.x + 1,
      y: position.y,
    }));
  }

  moveDown(grid) {
    if (!this.isMoving || this.collides(grid, { x: 0, y: 1 })) {
      return;
    }
    this.positions = this.positions.map((position) => ({
      x: position.x,
      y: position.y + 1,
    }));
  }

  fallDown(grid) {
    while (!this.collides(grid, { x: 0, y: 1 })) {
      this.moveDown(grid);
    }
  }

  collides(grid, direction = { x: 0, y: 0 }) {
    return this.positions.some(
      (position) => position.x + direction.x < 0
      || position.x + direction.x >= 10
      || position.y + direction.y >= 20
      || grid[position.x + direction.x][position.y + direction.y] !== null,
    );
  }

  rotate(grid) {
    switch (this.type) {
      case PieceType.I:
        this.rotateI(grid);
        break;
      case PieceType.J:
        this.rotateJ(grid);
        break;
      case PieceType.L:
        this.rotateL(grid);
        break;
      case PieceType.S:
        this.rotateS(grid);
        break;
      case PieceType.T:
        this.rotateT(grid);
        break;
      case PieceType.Z:
        this.rotateZ(grid);
        break;
      default:
        break;
    }
  }

  rotateI(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y },
          { x: backUpPositions[0].x, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 2 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 2 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y = 1 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y },
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 2 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 2 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  rotateJ(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y + 2 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 2 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  rotateL(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y + 2 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 2 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  rotateS(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y + 2 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 2 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  rotateT(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  rotateZ(grid) {
    const backUpPositions = this.positions;
    switch (this.rotation) {
      case RotationPhase.UP:
        this.positions = [
          { x: backUpPositions[0].x + 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.RIGHT;
        }
        break;
      case RotationPhase.RIGHT:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y + 2 },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y + 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.DOWN;
        }
        break;
      case RotationPhase.DOWN:
        this.positions = [
          { x: backUpPositions[0].x - 2, y: backUpPositions[0].y },
          { x: backUpPositions[0].x - 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.LEFT;
        }
        break;
      case RotationPhase.LEFT:
        this.positions = [
          { x: backUpPositions[0].x, y: backUpPositions[0].y - 2 },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y - 1 },
          { x: backUpPositions[0].x, y: backUpPositions[0].y },
          { x: backUpPositions[0].x + 1, y: backUpPositions[0].y + 1 },
        ];
        if (this.collides(grid)) {
          this.positions = backUpPositions;
        } else {
          this.rotation = RotationPhase.UP;
        }
        break;
      default:
        break;
    }
  }

  calculateInitialPositions(rotation, grid) {
    switch (this.type) {
      case PieceType.I:
        this.positions = [
          { x: 3, y: -2 },
          { x: 4, y: -2 },
          { x: 5, y: -2 },
          { x: 6, y: -2 },
        ];
        break;
      case PieceType.J:
        this.positions = [
          { x: 4, y: -2 },
          { x: 4, y: -1 },
          { x: 5, y: -1 },
          { x: 6, y: -1 },
        ];
        break;
      case PieceType.L:
        this.positions = [
          { x: 6, y: -2 },
          { x: 4, y: -1 },
          { x: 5, y: -1 },
          { x: 6, y: -1 },
        ];
        break;
      case PieceType.O:
        this.positions = [
          { x: 4, y: -2 },
          { x: 5, y: -2 },
          { x: 4, y: -1 },
          { x: 5, y: -1 },
        ];
        break;
      case PieceType.S:
        this.positions = [
          { x: 5, y: -2 },
          { x: 6, y: -2 },
          { x: 4, y: -1 },
          { x: 5, y: -1 },
        ];
        break;
      case PieceType.T:
        this.positions = [
          { x: 5, y: -2 },
          { x: 4, y: -1 },
          { x: 5, y: -1 },
          { x: 6, y: -1 },
        ];
        break;
      case PieceType.Z:
        this.positions = [
          { x: 4, y: -2 },
          { x: 5, y: -2 },
          { x: 5, y: -1 },
          { x: 6, y: -1 },
        ];
        break;
      default:
        this.positions = [];
        break;
    }

    while (this.rotation !== rotation) {
      const backUpPositions = this.positions;
      this.rotate(grid);
      if (this.positions === backUpPositions) {
        this.isMoving = false;
        break;
      }
    }
  }
}

module.exports = {
  Piece,
  PieceType,
  RotationPhase,
};
