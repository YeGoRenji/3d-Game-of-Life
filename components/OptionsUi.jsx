import { Box, Flex, Grid, Text } from "@chakra-ui/layout";
import React, { useContext } from "react";
import { CirclePicker } from "react-color";
import { ColorContext } from "./ColorContext";
import { isWhiteAccessible } from "./ColorFunctions";
import { MenuUiBtn } from "./MenuUiBtn";

function OptionsUi({ setInOptions }) {
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
  const { color, setColor } = useContext(ColorContext);
  const handleChange = (color, event) => {
    setColor(color.hex);
  };
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
      <Flex align="center" flexDirection="column">
        <Box
          fontWeight="bold"
          fontFamily="roboto"
          borderRadius="10px"
          textAlign="center"
          display="grid"
          alignItems="center"
          transition=".2s ease-in-out"
          color={isWhiteAccessible(color) ? "white" : "black"}
          my="20px"
          bg={color}
          h="50px"
          w="70px"
        >
          COLOR
        </Box>
        <CirclePicker colors={colors} color={color} onChange={handleChange} />
        <MenuUiBtn onClick={() => setInOptions(false)} mt="200px">
          RETURN
        </MenuUiBtn>
      </Flex>
    </Grid>
  );
}

export default OptionsUi;
