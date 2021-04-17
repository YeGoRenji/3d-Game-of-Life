import React, { useState, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Cell from "./Cell";
import { Button, Box, Flex } from "@chakra-ui/react";
import CameraController from "./CameraController";
import "./style.css";
import { FaPlay, FaPause } from "react-icons/fa";
import * as THREE from "three";
import GameLogic from "./GameLogic";
import { CellBoardContext } from "./CellBoardContext";

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

const Scene = ({ playing }) => {
  const [board, setBoard] = useState(
    [...Array(CELL_ROWS)].map(() => [...Array(CELL_COLUMNS)].fill(0))
  );

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
  const [playing, setPlaying] = useState(false);
  return (
    <>
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
          <Scene playing={playing} />
        </Canvas>
        <Flex justifyContent="center">
          <Button
            position="absolute"
            w="50px"
            h="50px"
            bottom="10px"
            colorScheme="orange"
            _focus={{ outline: "none" }}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <FaPause /> : <FaPlay />}
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export default App;
