import {
  Box,
  useDisclosure,
  Text,
  Input,
  Flex,
  Button,
  ListItem,
  OrderedList,
} from "@chakra-ui/react";
import { FC, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { ChatMessageType, addChatMessage } from "@/store/gameSlice";
import { RootState, store } from "@/store/store";

type ChatBoxProps = {};
const ChatBox: FC<ChatBoxProps> = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const allMessages = useSelector(
    (state: RootState) => state.game.chat.messages
  );

  const chatMessages = useMemo(() => {
    return allMessages.filter(
      (chatMessage) => chatMessage.type == ChatMessageType.PLAYER_MESSAGE
    );
  }, [allMessages]);

  const handleChatMessageSubmit = () => {
    const element = inputRef.current;
    if (element == null) return;
    const message = element.value;
    element.value = "";
    if (chatBoxRef.current != null)
      chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight;
    if (message == null || message == "" || message.trim() == "") return;
    // sendPlayerMessage(message);
    store.dispatch(
      addChatMessage({
        type: ChatMessageType.PLAYER_MESSAGE,
        player_name: "Spername",
        message: message,
      })
    );
  };

  return (
    <>
      <Box
        onClick={onOpen}
        display={isOpen ? "none" : "block"}
        pos="absolute"
        left="0"
        top="50%"
        transform="auto"
        translateY="-50%"
        translateX="-7"
        _hover={{
          translateX: 0,
        }}
        transitionDuration="300ms"
        bg="white"
        pl="12"
        pr="6"
        py="2"
        borderRightRadius="2xl"
        cursor="pointer"
        zIndex={10}
      >
        <Text fontWeight="bold">Abrir Chat</Text>
      </Box>
      <Box
        display={isOpen ? "block" : "none"}
        pos="absolute"
        left="0"
        top="50%"
        transform="auto"
        translateY="-75%"
        w="25rem"
        zIndex={10}
      >
        <Button
          onClick={onClose}
          transitionDuration="300ms"
          bg="white"
          borderRightRadius="2xl"
          borderLeftRadius="none"
          cursor="pointer"
          fontWeight="bold"
          mb="4"
        >
          Cerrar Chat
        </Button>
        <Box h="30vh" borderRightRadius="2xl" bg="rgba(100, 100, 100, 0.6)">
          <Flex flexDir="column" h="full">
            <Box
              ref={chatBoxRef}
              flex="1"
              overflowY="auto"
              overflowX="hidden"
              className="base-scrollbar"
              mt={4}
              pl={3}
              pr={4}
              mb={3}
              ml={2}
              mr={4}
            >
              <OrderedList maxW="100%" listStyleType="none" m="0">
                {chatMessages.map((chatMessage, index) => {
                  return (
                    <ListItem key={index} color="rgba(200, 200, 200)">
                      <Text as="span" color="white" fontWeight="500" mr="1">
                        {chatMessage.player_name}:
                      </Text>
                      {chatMessage.message}
                    </ListItem>
                  );
                })}
              </OrderedList>
            </Box>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleChatMessageSubmit();
              }}
              action="/"
            >
              <Flex pb="2" px="4" align="center" justify="center" columnGap="4">
                <Input
                  ref={inputRef}
                  flex="1"
                  height="2rem"
                  flexBasis="2rem"
                  type="text"
                  color="white"
                />
                <Button type="submit" size="sm" bg="white">
                  Enviar
                </Button>
              </Flex>
            </form>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default ChatBox;
