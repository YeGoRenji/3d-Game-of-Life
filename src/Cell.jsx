import React, {
  useContext,
  useCallback,
  useRef,
  useState,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, Vector3 } from "three";
import { CellBoardContext } from "./CellBoardContext";
import { ColorContext } from "../components/ColorContext";

function Cell(props) {
  const { Life } = props;
  const { color } = useContext(ColorContext);
  const [hovered, setHovered] = useState(false);
  const lifeColor = new Color(color);
  const deadColor = new Color(0xcacaca);
  const initalY = props.position[1];
  const { board, setBoard } = useContext(CellBoardContext);
  const w = 5;
  const Amp = 1.5;
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
  const meshpm = useRef();
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const onloadAnimationIsFinished = t >= props.phase + (2 * Math.PI) / w;

    if (mesh.current !== null) {
      //the Onload Animation
      if (t >= props.phase && t <= props.phase + (2 * Math.PI) / w)
        mesh.current.position.y =
          initalY + Amp * Math.sin(w * (t - props.phase));

      //Animation for a cell to go Alive
      if (
        onloadAnimationIsFinished &&
        Life &&
        mesh.current.position !== vlive
      ) {
        mesh.current.position.y = mesh.current.position.lerp(vlive, 0.1).y;
      }

      //Animation for a cell to go Dead
      if (
        onloadAnimationIsFinished &&
        !Life &&
        mesh.current.position !== vInit
      ) {
        mesh.current.position.y = mesh.current.position.lerp(vInit, 0.1).y;
      }
    }

    // if (meshpm.current !== null) {
    //   //Color change to go Alive
    //   if (
    //     onloadAnimationIsFinished &&
    //     Life &&
    //     !meshpm.current.color.equals(lifeColor)
    //   ) {
    //     meshpm.current.color = meshpm.current.color.lerp(lifeColor, 0.1);
    //   }

    //   //Color change to go Dead
    //   if (
    //     onloadAnimationIsFinished &&
    //     !Life &&
    //     !meshpm.current.color.equals(deadColor)
    //   ) {
    //     meshpm.current.color = meshpm.current.color.lerp(deadColor, 0.1);
    //   }
    // }
    if (meshpm.current !== null && mesh.current !== null) {
      let percent = MathUtils.inverseLerp(vInit.y, vlive.y, mesh.current.position.y);
      percent = MathUtils.clamp(percent, 0, 1);
      meshpm.current.color = new Color(
        MathUtils.lerp(deadColor.r, lifeColor.r, percent),
        MathUtils.lerp(deadColor.g, lifeColor.g, percent),
        MathUtils.lerp(deadColor.b, lifeColor.b, percent)
      )
    }
    // }
    // if (mesh.current !== null) {
      // console.log(mesh.current.y, vInit.y, vlive.y, deadColor.getHex(), lifeColor.getHex())
      // console.log(MathUtils.mapLinear(mesh.current.position.y, vInit.y, vlive.y, deadColor.getHex(), lifeColor.getHex()))
      // console.clear()
    // }
  });
  const handleBoardUpdate = useCallback(
    (e) => {
      e.stopPropagation()
      const updatedBoard = [...board];
      updatedBoard[i][j] = Number(!updatedBoard[i][j]);
      setBoard(updatedBoard);
    },
    [board]
  );

  const checkHover = useCallback((e, state) => {
    e.stopPropagation()
    setHovered(state);
  });

  return (
    <mesh
      castShadow
      onClick={handleBoardUpdate}
      onPointerOver={(event) => checkHover(event, true)}
      onPointerOut={(event) => checkHover(event, false)}
      {...props} ref={mesh}>
      <boxGeometry attach="geometry" args={[1, 0.5, 1]} />
      <meshPhysicalMaterial emissive={hovered ? 0x707070 : 0x0}
        attach="material" ref={meshpm} />
    </mesh>
  );
}

export default Cell;
