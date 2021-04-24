import React, { useCallback, useState } from "react";
import { FaPlay, FaPause, FaRedoAlt } from "react-icons/fa";
import { Button, Box, Flex, Grid, Text } from "@chakra-ui/react";

const GameUi = (props) => {
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
        <Button
          visibility="visible"
          margin="10px"
          w="50px"
          h="50px"
          colorScheme="orange"
          _focus={{ outline: "none" }}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <FaPause /> : <FaPlay />}
        </Button>
        <Button
          visibility="visible"
          margin="10px"
          w="50px"
          h="50px"
          colorScheme="orange"
          _focus={{ outline: "none" }}
          onClick={resetBoard}
        >
          <FaRedoAlt />
        </Button>
      </Box>
      <Box
        fontFamily="roboto"
        position="absolute"
        fontWeight="bold"
        right="5px"
        bottom="0"
        color="orange"
        visibility="visible"
      >
        BY YEGO
      </Box>
    </>
  );
};

const MenuUi = ({ setInGame }) => {
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
      <Flex justify="center" dir="rows">
        <Button
          fontFamily="roboto"
          my="40px"
          h="50px"
          w="100px"
          colorScheme="orange"
          onClick={() => setInGame(true)}
        >
          PLAY
        </Button>
      </Flex>
    </Grid>
  );
};
function Ui(props) {
  const [inGame, setInGame] = useState(false);
  return (
    <>
      <Flex
        visibility={inGame ? "hidden" : "visible"}
        bg={inGame ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.3)"}
        left="0"
        top="0"
        position="absolute"
        w="100%"
        h="100vh"
        justifyContent="center"
      >
        {inGame ? (
          <GameUi hooks={props.hooks} />
        ) : (
          <MenuUi setInGame={setInGame} />
        )}
      </Flex>
    </>
  );
}

export default Ui;
