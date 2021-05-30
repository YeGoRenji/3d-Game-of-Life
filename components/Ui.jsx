import React, { useCallback, useContext, useState } from "react";
import { FaPlay, FaStepForward, FaPause, FaRedoAlt } from "react-icons/fa";
import GameLogic from "../src/GameLogic";
import {
  Box,
  Flex,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import OptionsUi from "./OptionsUi";
import { MenuUiBtn } from "./MenuUiBtn";
import { GameUiBtn } from "./GameUiBtn";
import { ColorContext } from "./ColorContext";
import { isWhiteAccessible } from "./ColorFunctions";

const GameUi = (props) => {
  const { color } = useContext(ColorContext);
  const { speed, setSpeed, playing, setPlaying, board, setBoard } = props.hooks;
  const resetBoard = useCallback(() => {
    const updatedBoard = [...board];
    updatedBoard.map((a) => a.fill(0));
    setBoard(updatedBoard);
  }, []);
  return (
    <>
      <Box
        visibility="visible"
        borderRadius="10px"
        border="2px solid rgba(255,255,255,0.2)"
        display="flex"
        alignItems="center"
        position="absolute"
        bottom="10px"
      >
        {/* Play Button */}
        <GameUiBtn onClick={() => setPlaying(!playing)}>
          {playing ? <FaPause /> : <FaPlay />}
        </GameUiBtn>

        {/* Forward Button */}
        <GameUiBtn
          onClick={() => {
            if (!playing) setBoard((curr) => GameLogic(curr));
          }}
        >
          <FaStepForward />
        </GameUiBtn>
        {/* Redo Button */}
        <GameUiBtn onClick={resetBoard}>
          <FaRedoAlt />
        </GameUiBtn>
        {/* Speed Control Button */}
        <Slider
          minH="50"
          orientation="vertical"
          defaultValue={speed}
          min={200}
          max={1000}
          step={50}
          onChange={(val) => setSpeed(val)}
        >
          <SliderTrack>
            <SliderFilledTrack bg={color} />
          </SliderTrack>
          <SliderThumb _focus={{ outline: "none" }} />
        </Slider>
        <Box
          display="grid"
          margin="10px"
          fontWeight="bold"
          bg={color}
          h="50px"
          w="100px"
          borderRadius="10px"
          alignItems="center"
          textAlign="center"
          verticalAlign="center"
          color={isWhiteAccessible(color) ? "white" : "black"}
          fontFamily="Roboto"
        >
          {speed} ms
        </Box>
      </Box>
      <Box
        fontFamily="roboto"
        position="absolute"
        fontWeight="bold"
        right="5px"
        bottom="0"
        color={color}
        visibility="visible"
      >
        BY YEGO
      </Box>
    </>
  );
};

const MenuUi = ({ setInGame, setInOptions }) => {
  return (
    <Grid
      justifyContent="center"
      w="100%"
      h="100vh"
      gridTemplateRows="300px auto"
    >
      <Text
        textAlign="center"
        fontFamily="roboto"
        fontSize="30px"
        mt="50px"
        color="white"
      >
        WELCOME TO <br />
        3D GAME OF LIFE
      </Text>
      <Flex align="center" flexDirection="column">
        <MenuUiBtn onClick={() => setInGame(true)}>PLAY</MenuUiBtn>
        <MenuUiBtn onClick={() => setInOptions(true)}>OPTIONS</MenuUiBtn>
      </Flex>
    </Grid>
  );
};

function Ui(props) {
  const [inOptions, setInOptions] = useState(false);
  const { inGame, setInGame } = props.inGame;
  return (
    <Flex
      visibility={inGame ? "hidden" : "visible"}
      bg={inGame ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.3)"}
      left="0"
      top="0"
      position="absolute"
      transition=".5s ease-in-out"
      w="100%"
      h="100vh"
      justifyContent="center"
    >
      {inGame ? (
        <GameUi hooks={props.hooks} />
      ) : inOptions ? (
        <OptionsUi
          setBoard={props.hooks.setBoard}
          setInOptions={setInOptions}
        />
      ) : (
        <MenuUi setInGame={setInGame} setInOptions={setInOptions} />
      )}
    </Flex>
  );
}

export default Ui;
