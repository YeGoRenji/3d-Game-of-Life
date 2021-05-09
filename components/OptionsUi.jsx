import { Flex, Grid, Text } from "@chakra-ui/layout";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/number-input";
import { Tooltip } from "@chakra-ui/tooltip";
import React, { useContext, useRef } from "react";
import { CirclePicker } from "react-color";
import { CellDimContext } from "../src/CellDimContext";
import { ColorContext } from "./ColorContext";
import { MenuUiBtn } from "./MenuUiBtn";

const SIZE_MIN = 1;
const SIZE_MAX = 100;

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
            min={SIZE_MIN}
            max={SIZE_MAX}
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
            min={SIZE_MIN}
            max={SIZE_MAX}
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
              const width = Number(
                wfield.current.value !== "" ? wfield.current.value : SIZE_MIN
              );
              const height = Number(
                hfield.current.value !== "" ? hfield.current.value : SIZE_MIN
              );
              setCellDim({
                w: width,
                h: height,
              });
              setBoard((currBoard) =>
                [...Array(height)].map((_, index) =>
                  [...Array(width)].map((_, jndex) =>
                    currBoard[index] !== undefined ? currBoard[index][jndex] : 0
                  )
                )
              );
            }}
          >
            <Tooltip
              hasArrow
              bg="gray.600"
              label={
                wfield.current &&
                (Number(wfield.current.value) >= 50 ||
                Number(hfield.current.value) >= 50
                  ? "50 plus size may result in bad performence"
                  : "")
              }
            >
              Save
            </Tooltip>
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
