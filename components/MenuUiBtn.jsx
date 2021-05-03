import React, { useContext } from "react";
import { Button } from "@chakra-ui/button";
import { ColorContext } from "./ColorContext";

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function hexToLightHex(hex, per) {
  const p = per;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    r: Math.floor(
      parseInt(result[1], 16) + p * (255 - parseInt(result[1], 16))
    ),
    g: Math.floor(
      parseInt(result[2], 16) + p * (255 - parseInt(result[2], 16))
    ),
    b: Math.floor(
      parseInt(result[3], 16) + p * (255 - parseInt(result[3], 16))
    ),
  };
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
}

function hexToDimHex(hex, per) {
  const p = per;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb = {
    r: Math.floor(parseInt(result[1], 16) - p * parseInt(result[1], 16)),
    g: Math.floor(parseInt(result[2], 16) - p * parseInt(result[2], 16)),
    b: Math.floor(parseInt(result[3], 16) - p * parseInt(result[3], 16)),
  };
  return (
    "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  );
}

export const MenuUiBtn = (props) => {
  const { color } = useContext(ColorContext);
  return (
    <Button
      _active={{ bg: hexToLightHex(color, 0.1) }}
      _focus={{ outline: "none" }}
      _hover={{ bg: hexToDimHex(color, 0.1) }}
      fontFamily="roboto"
      color={color === "#f7df1e" ? "black" : "white"}
      my="10px"
      h="50px"
      w="100px"
      bg={color}
      {...props}
    >
      {props.children}
    </Button>
  );
};
