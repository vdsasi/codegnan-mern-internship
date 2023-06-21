import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  Stack,
  Center,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import moment from "moment";
import { User } from "../../types";
import React, { FormEvent, useState } from "react";
import image from "../../assets/checklist.png";
import { Event } from "../../types";

type Props = {
  user: User;
  logout: () => void;
  handleEventCreation: (event: Event) => void;
};

const Navbar: React.FC<Props> = ({ user, logout, handleEventCreation }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [event, setEvent] = useState<Event>({
    title: "",
    start: new Date(),
    end: new Date(),
  });

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      const parsedDate = moment(value).toDate();

      setEvent((prevVal) => ({
        ...prevVal,
        [name]: parsedDate,
      }));
    } else {
      setEvent((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();

    handleEventCreation(event);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Your task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleCreate}>
              <Flex direction="column" alignItems="center" mt={4}>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Start</FormLabel>
                  <Input
                    type="datetime-local"
                    name="start"
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>End</FormLabel>
                  <Input
                    type="datetime-local"
                    name="end"
                    onChange={handleChange}
                  />
                </FormControl>

                <Button mt={4} colorScheme="teal" type="submit">
                  Create Event
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box px={4} bg="orange.100">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          
          <img src={image} height={40} width={40} />

          <Flex alignItems={"center"} gap={5}>
            <Button onClick={onOpen}>Add Task</Button>
            <Stack direction={"row"} spacing={7}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    src={"https://avatars.dicebear.com/api/male/username.svg"}
                  />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{user.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
