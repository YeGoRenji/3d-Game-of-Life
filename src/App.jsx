import React, { useState, useRef, useEffect } from "react";
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

const CELL_ROWS = 25;
const CELL_COLUMNS = 25;
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

const Scene = ({ colorHook, playing, board, setBoard }) => {
  const { color, setColor } = colorHook;
  useEffect(() => {
    const handle = setInterval(() => {
      if (playing) setBoard((curr) => GameLogic(curr));
    }, 500);

    return () => {
      clearInterval(handle);
    };
  }, [board, playing, setBoard]);

  const { scene } = useThree();
  scene.background = new THREE.Color(0x000000);
  const targetObj = new THREE.Object3D();
  scene.add(targetObj);
  targetObj.position.set((CELL_ROWS - 1) / 2, 0, (CELL_COLUMNS - 1) / 2);

  return (
    <>
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
        position={[(CELL_ROWS - 1) / 2, h, (CELL_COLUMNS - 1) / 2]}
        angle={Math.atan(
          (Math.max(CELL_ROWS, CELL_COLUMNS) * Math.sqrt(2)) / (2 * h) + 0.2
        )}
        penumbra={1}
      />
      <CellBoardContext.Provider value={{ board, setBoard }}>
        <ColorContext.Provider value={{ color, setColor }}>
          {[...Array(CELL_ROWS)].map((_, index) => {
            return [...Array(CELL_COLUMNS)].map((_, jndex) => {
              return (
                <Cell
                  phase={(index + jndex) / Math.max(CELL_ROWS, CELL_COLUMNS)}
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
        cellNum={{ cellRows: CELL_ROWS, cellColumns: CELL_COLUMNS }}
        target={targetObj}
      />
    </>
  );
};

function App() {
  const [color, setColor] = useState("#ff5722");
  const [playing, setPlaying] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [board, setBoard] = useState(
    [...Array(CELL_ROWS)].map(() => [...Array(CELL_COLUMNS)].fill(0))
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
              2 * Math.max(CELL_ROWS, CELL_COLUMNS),
              2 * Math.max(CELL_ROWS, CELL_COLUMNS),
              0,
            ],
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <fog attach="fog" args={["black", 50, 200]} />
          <Scene
            colorHook={{ color, setColor }}
            playing={playing}
            board={board}
            setBoard={setBoard}
          />
        </Canvas>

        <Ui
          inGame={{ inGame, setInGame }}
          hooks={{ playing, setPlaying, board, setBoard }}
        />
      </Box>
    </ColorContext.Provider>
  );
}

export default App;
