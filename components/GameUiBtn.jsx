import React, { useContext } from "react";
import { Button } from "@chakra-ui/button";
import { ColorContext } from "./ColorContext";
import {
  hexToLightHex,
  hexToDimHex,
  isWhiteAccessible,
} from "./ColorFunctions";

export const GameUiBtn = (props) => {
  const { color } = useContext(ColorContext);
  return (
    <Button
      _active={{ bg: hexToLightHex(color, 0.1) }}
      _focus={{ outline: "none" }}
      _hover={{ bg: hexToDimHex(color, 0.1) }}
      color={isWhiteAccessible(color) ? "white" : "black"}
      visibility="visible"
      margin="10px"
      h="50px"
      w="50px"
      bg={color}
      {...props}
    >
      {props.children}
    </Button>
  );
};
