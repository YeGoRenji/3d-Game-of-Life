import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Cell from "./Cell";
import { Box } from "@chakra-ui/react";
import CameraController from "./CameraController";
import "./style.css";
import * as THREE from "three";
import GameLogic from "./GameLogic";
import { CellBoardContext } from "./CellBoardContext";
import Ui from "../components/Ui";
import { ColorContext } from "../components/ColorContext";
import { CellDimContext } from "./CellDimContext";

// const CELL_ROWS = 30;
// const CELL_COLUMNS = 5;
const MAXZOOM = 50;
const MINZOOM = 10;
const h = 30;

// const earlyBoard = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
// // Mirror Flip !
// for (let i = 0; i < earlyBoard.length; i++) {
//   earlyBoard[i] = earlyBoard[i].reverse();
// }

const Plane = (props) => {
  const mesh = useRef();
  return (
    <mesh receiveShadow {...props} ref={mesh}>
      <planeBufferGeometry
        attach="geometry"
        args={[props.width, props.height]}
      />
      <meshPhongMaterial attach="material" color={props.color} />
    </mesh>
  );
};

const Scene = ({ speed, colorHook, playing, board, setBoard }) => {
  const { color, setColor } = colorHook;
  const { cellDim } = useContext(CellDimContext);
  useEffect(() => {
    const handle = setInterval(() => {
      if (playing) setBoard((curr) => GameLogic(curr));
    }, speed);

    return () => {
      clearInterval(handle);
    };
  }, [board, playing, setBoard]);

  const { scene } = useThree();
  scene.background = new THREE.Color(0x000000);
  const targetObj = new THREE.Object3D();
  scene.add(targetObj);
  targetObj.position.set((cellDim.h - 1) / 2, 0, (cellDim.w - 1) / 2);
  return (
    <>
      <fog attach="fog" args={["black", 50, 200]} />
      <ambientLight intensity={0.2} />
      <Plane
        color="white"
        width={500}
        height={500}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <spotLight
        castShadow
        intensity={0.5}
        target={targetObj}
        position={[(cellDim.h - 1) / 2, h, (cellDim.w - 1) / 2]}
        angle={Math.atan(
          (Math.max(cellDim.h, cellDim.w) * Math.sqrt(2)) / (2 * h) + 0.2
        )}
        penumbra={1}
      />
      <CellBoardContext.Provider value={{ board, setBoard }}>
        <ColorContext.Provider value={{ color, setColor }}>
          {board.map((row, index) => {
            return row.map((_, jndex) => {
              return (
                <Cell
                  Life={board[index][jndex]}
                  phase={(index + jndex) / Math.max(cellDim.h, cellDim.w)}
                  key={[index, jndex]}
                  position={[index, 2, jndex]}
                />
              );
            });
          })}
        </ColorContext.Provider>
      </CellBoardContext.Provider>
      <CameraController
        maxZoom={MAXZOOM}
        minZoom={MINZOOM}
        cellNum={{ cellRows: cellDim.h, cellColumns: cellDim.w }}
        target={targetObj}
      />
    </>
  );
};

function App() {
  const [speed, setSpeed] = useState(500);
  const [color, setColor] = useState("#ff5722");
  const [playing, setPlaying] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [cellDim, setCellDim] = useState({ w: 25, h: 25 });
  const [board, setBoard] = useState(
    [...Array(cellDim.h)].map(() => [...Array(cellDim.w)].fill(0))
  );
  document.addEventListener("keyup", (e) => {
    if (e.code === "Escape" && inGame) setInGame(false);
  });

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      <Box h="100vh">
        <Canvas
          camera={{
            position: [
              2 * Math.max(cellDim.h, cellDim.w),
              2 * Math.max(cellDim.h, cellDim.w),
              0,
            ],
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <CellDimContext.Provider value={{ cellDim, setCellDim }}>
            <Scene
              speed={speed}
              colorHook={{ color, setColor }}
              playing={playing}
              board={board}
              setBoard={setBoard}
            />
          </CellDimContext.Provider>
        </Canvas>
        <CellDimContext.Provider value={{ cellDim, setCellDim }}>
          <Ui
            inGame={{ inGame, setInGame }}
            hooks={{ speed, setSpeed, playing, setPlaying, board, setBoard }}
          />
        </CellDimContext.Provider>
      </Box>
    </ColorContext.Provider>
  );
}

export default App;
