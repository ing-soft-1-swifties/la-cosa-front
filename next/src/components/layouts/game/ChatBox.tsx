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
import { FC, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChatMessageType } from "@/store/gameSlice";
import { RootState } from "@/store/store";
import { sendPlayerMessage } from "@/src/business/game/chat";

type ChatBoxProps = {};
const ChatBox: FC<ChatBoxProps> = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true,
  });
  const [onChatTab, setOnChatTab] = useState(true);
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

  const logMessages = useMemo(() => {
    return allMessages.filter(
      (chatMessage) => chatMessage.type == ChatMessageType.GAME_MESSAGE
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
    sendPlayerMessage(message);
  };

  return (
    <>
      {isOpen ? (
        <Box
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
          <Flex align="flex-end" justify="flex-end" mr="6">
            <Button
              onClick={() => {
                setOnChatTab(true);
              }}
              bg={
                onChatTab ? "rgba(100, 100, 100, 0.6)" : "rgba(50, 50, 50, 0.6)"
              }
              _hover={{
                bg: "rgba(150, 150, 150, 0.6)",
              }}
              borderRadius="none"
              size="sm"
              borderTopLeftRadius="lg"
              color="white"
              fontWeight="500"
              px={6}
              data-testid="chatbox_tab_chat"
            >
              Chat
            </Button>
            <Button
              onClick={() => {
                setOnChatTab(false);
              }}
              bg={
                onChatTab ? "rgba(50, 50, 50, 0.6)" : "rgba(100, 100, 100, 0.6)"
              }
              _hover={{
                bg: "rgba(150, 150, 150, 0.6)",
              }}
              borderRadius="none"
              size="sm"
              borderTopRightRadius="lg"
              color="white"
              fontWeight="500"
              px={6}
              data-testid="chatbox_tab_logs"
            >
              Logs
            </Button>
          </Flex>
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
                  {onChatTab
                    ? chatMessages.map((chatMessage, index) => {
                        return (
                          <ListItem key={index} color="rgba(200, 200, 200)">
                            <ChatMessageLine
                              sender={chatMessage.player_name ?? "Error"}
                              message={chatMessage.message}
                            />
                          </ListItem>
                        );
                      })
                    : logMessages.map((chatMessage, index) => {
                        return (
                          <ListItem key={index} color="rgba(200, 200, 200)">
                            <ChatMessageLine
                              sender="Juego"
                              message={chatMessage.message}
                            />
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
                <Flex
                  pb="2"
                  px="4"
                  align="center"
                  justify="center"
                  columnGap="4"
                >
                  <Input
                    ref={inputRef}
                    flex="1"
                    height="2rem"
                    flexBasis="2rem"
                    type="text"
                    color="white"
                    data-testid="chatbox_input"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    bg="white"
                    data-testid="chatbox_send_message_button"
                  >
                    Enviar
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={onOpen}
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
      )}
    </>
  );
};

type ChatMessageLineProps = {
  sender?: string;
  message: string;
};
const ChatMessageLine: FC<ChatMessageLineProps> = ({ sender, message }) => {
  return (
    <>
      {sender && (
        <Text
          as="span"
          color="white"
          fontWeight="500"
          mr="1"
          textDecor="underline"
          textUnderlineOffset="2px"
        >
          {sender}:
        </Text>
      )}
      {message}
    </>
  );
};

export default ChatBox;
