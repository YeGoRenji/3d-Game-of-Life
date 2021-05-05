import React, { useCallback, useContext, useState } from "react";
import { FaPlay, FaStepForward, FaPause, FaRedoAlt } from "react-icons/fa";
import GameLogic from "../src/GameLogic";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import OptionsUi from "./OptionsUi";
import { MenuUiBtn } from "./MenuUiBtn";
import { GameUiBtn } from "./GameUiBtn";
import { ColorContext } from "./ColorContext";

const GameUi = (props) => {
  const { color } = useContext(ColorContext);
  const { playing, setPlaying, board, setBoard } = props.hooks;
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
        position="absolute"
        bottom="10px"
      >
        <GameUiBtn onClick={() => setPlaying(!playing)}>
          {playing ? <FaPause /> : <FaPlay />}
        </GameUiBtn>

        <GameUiBtn
          onClick={() => {
            if (!playing) setBoard((curr) => GameLogic(curr));
          }}
        >
          <FaStepForward />
        </GameUiBtn>

        <GameUiBtn onClick={resetBoard}>
          <FaRedoAlt />
        </GameUiBtn>
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
        <OptionsUi setInOptions={setInOptions} />
      ) : (
        <MenuUi setInGame={setInGame} setInOptions={setInOptions} />
      )}
    </Flex>
  );
}

export default Ui;
