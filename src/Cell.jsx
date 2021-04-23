import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Vector3 } from "three";
import { CellBoardContext } from "./CellBoardContext";

const lifeColor = new Color(0xfa5003);
const deadColor = new Color(0xcacaca);

function Cell(props) {
  const initalY = props.position[1];
  const meshpm = useRef();
  const mesh = useRef();
  const { board, setBoard } = useContext(CellBoardContext);
  const [Life, setLife] = useState(false);
  const w = 5;
  const Amp = 2 / 3;
  const i = props.position[0],
    j = props.position[2];
  const vInit = new Vector3(
    props.position[0],
    props.position[1],
    props.position[2]
  );
  const vlive = new Vector3(
    props.position[0],
    props.position[1] + 0.5,
    props.position[2]
  );
  useEffect(() => {
    setLife(board[i][j]);
  }, [board[i][j]]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const onloadAnimationIsFinished = t >= props.phase + (2 * Math.PI) / w;
    // the Onload Animation
    if (t >= props.phase && t <= props.phase + (2 * Math.PI) / w)
      mesh.current.position.y = initalY + Amp * Math.sin(w * (t - props.phase));

    //Animation for a cell to go Alive
    if (onloadAnimationIsFinished && Life && mesh.current.position !== vlive) {
      mesh.current.position.y = mesh.current.position.lerp(vlive, 0.1).y;
    }

    //Animation for a cell to go Dead
    if (onloadAnimationIsFinished && !Life && mesh.current.position !== vInit) {
      mesh.current.position.y = mesh.current.position.lerp(vInit, 0.1).y;
    }

    //Color change to go Alive
    if (
      onloadAnimationIsFinished &&
      Life &&
      !meshpm.current.color.equals(lifeColor)
    ) {
      meshpm.current.color = meshpm.current.color.lerp(lifeColor, 0.1);
    }

    //Color change to go Dead
    if (
      onloadAnimationIsFinished &&
      !Life &&
      !meshpm.current.color.equals(deadColor)
    ) {
      meshpm.current.color = meshpm.current.color.lerp(deadColor, 0.1);
    }
  });
  const handleBoardUpdate = useCallback(
    (e) => {
      if (e.intersections[0].object.uuid === e.object.uuid) {
        const updatedBoard = [...board];
        updatedBoard[i][j] = Number(!updatedBoard[i][j]);
        setBoard(updatedBoard);
      }
    },
    [board]
  );
  return (
    <mesh castShadow onClick={handleBoardUpdate} {...props} ref={mesh}>
      <boxBufferGeometry attach="geometry" args={[1, 0.5, 1]} />
      <meshPhysicalMaterial attach="material" ref={meshpm} />
    </mesh>
  );
}

export default Cell;
