import { Flex, Grid, Text } from "@chakra-ui/layout";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/number-input";
import React, { useContext, useRef } from "react";
import { CirclePicker } from "react-color";
import { CellBoardContext } from "../src/CellBoardContext";
import { CellDimContext } from "../src/CellDimContext";
import { ColorContext } from "./ColorContext";
import { MenuUiBtn } from "./MenuUiBtn";
function OptionsUi({ setBoard, setInOptions }) {
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#f7df1e",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
  ];
  const { cellDim, setCellDim } = useContext(CellDimContext);
  const { color, setColor } = useContext(ColorContext);
  const handleChange = (color) => {
    setColor(color.hex);
  };
  const wfield = useRef();
  const hfield = useRef();
  return (
    <Grid
      justifyContent="center"
      w="100%"
      h="100vh"
      gridTemplateRows="200px auto"
    >
      <Text
        textAlign="center"
        fontFamily="roboto"
        fontSize="30px"
        mt="50px"
        color="white"
      >
        OPTIONS
      </Text>
      <Grid justifyItems="center" gridTemplateRows="50px auto auto">
        <Flex align="center">
          <Text
            textAlign="center"
            fontFamily="roboto"
            fontSize="20px"
            color="white"
          >
            Board:
          </Text>
          <NumberInput
            color="white"
            mx="5px"
            h="40px"
            w="80px"
            defaultValue={cellDim.w}
            min={5}
            max={40}
          >
            <NumberInputField
              _focus={{ border: `2px solid ${color}` }}
              ref={wfield}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <NumberInput
            color="white"
            mx="5px"
            h="40px"
            w="80px"
            defaultValue={cellDim.h}
            min={5}
            max={40}
          >
            <NumberInputField
              _focus={{ border: `2px solid ${color}` }}
              ref={hfield}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <MenuUiBtn
            mx="5px"
            w="50px"
            h="40px"
            onClick={() => {
              setCellDim({
                w: Number(wfield.current.value),
                h: Number(hfield.current.value),
              });
              setBoard((currBoard) =>
                [...Array(Number(hfield.current.value))].map((_, index) =>
                  [...Array(Number(wfield.current.value))].map((_, jndex) =>
                    currBoard[index] !== undefined ? currBoard[index][jndex] : 0
                  )
                )
              );
            }}
          >
            Save
          </MenuUiBtn>
        </Flex>
        <Flex mt="50px" align="center" flexDirection="column">
          <CirclePicker colors={colors} color={color} onChange={handleChange} />
        </Flex>
        <MenuUiBtn onClick={() => setInOptions(false)}>RETURN</MenuUiBtn>
      </Grid>
    </Grid>
  );
}

export default OptionsUi;
