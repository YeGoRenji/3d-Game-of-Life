import React, { useContext } from "react";
import { Button } from "@chakra-ui/button";
import { ColorContext } from "./ColorContext";
import {
  hexToLightHex,
  hexToDimHex,
  isWhiteAccessible,
} from "./ColorFunctions";

export const MenuUiBtn = (props) => {
  const { color } = useContext(ColorContext);
  return (
    <Button
      _active={{ bg: hexToLightHex(color, 0.1) }}
      _focus={{ outline: "none" }}
      _hover={{ bg: hexToDimHex(color, 0.1) }}
      fontFamily="roboto"
      color={isWhiteAccessible(color) ? "white" : "black"}
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
