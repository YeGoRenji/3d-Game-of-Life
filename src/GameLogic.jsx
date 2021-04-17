const between = (a, x, b) => {
  if (x >= a && x < b) return true;
  return false;
};

const GetNeighbourNum = (celli, cellj, Table) => {
  let count = 0;
  for (let i = celli - 1; i < celli + 2; i++)
    for (let j = cellj - 1; j < cellj + 2; j++)
      if (i !== celli || j !== cellj)
        if (between(0, i, Table.length) && between(0, j, Table[0].length))
          if (Table[i][j]) count++;
  return count;
};

const GameLogic = (Table) => {
  let newTable = new Array(Table.length);
  for (let i = 0; i < Table.length; i++)
    newTable[i] = new Array(Table[0].length);

  for (let i = 0; i < Table.length; i++) {
    for (let j = 0; j < Table[0].length; j++) {
      const nghbrs = GetNeighbourNum(i, j, Table);
      if (Table[i][j]) {
        if (nghbrs === 2 || nghbrs === 3) newTable[i][j] = 1;
        else newTable[i][j] = 0;
      } else {
        if (nghbrs === 3) newTable[i][j] = 1;
        else newTable[i][j] = 0;
      }
    }
  }
  return newTable;
};

export default GameLogic;
