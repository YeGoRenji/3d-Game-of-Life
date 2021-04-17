import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const CameraController = (props) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.target = props.target.position;
    controls.maxPolarAngle = Math.PI / 3;
    controls.minDistance = props.minZoom;
    controls.maxDistance = props.maxZoom;
    controls.update();
    return () => {
      controls.dispose();
    };
  }, [props.cellNum.cellRows, props.cellNum.cellColumns]);
  return null;
};

export default CameraController;
