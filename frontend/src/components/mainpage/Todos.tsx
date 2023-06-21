import { useState, useEffect, memo } from "react";
import { format } from "date-fns";
import { Event, User } from "../../types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

import Navbar from "./Navbar";
import { Dispatch } from "redux";
import { LOGOUT } from "../../actions/Types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

type Props = {
  user: User;
  logout: () => void;
  loading: boolean;
};

const Todos: React.FC<Props> = memo(({ user, logout }) => {
  const [updatedStart, setUpdatedStart] = useState<Date | null>(null);
  const [updatedEnd, setUpdatedEnd] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (events.length !== 0) {
      return;
    }
    fetch("http://localhost:5000/protected/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(
          data.map((element: Event) => ({
            title: element.title,
            start: new Date(element.start),
            end: new Date(element.end),
          }))
        );
      });
  }, []);

  const handleLogout = () => {
    logout();
    if (!localStorage.getItem("access")) {
      navigate("/");
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleEventCreation = async (event: Event) => {
    await fetch("http://localhost:5000/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify({ task: event }), // Closing parenthesis added here
    })
      .then(() => {
        setEvents((prevEvents) => [...prevEvents, event]);
      }).catch(() => {

      })
  };

  const handleUpdateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (name === "start") {
      setUpdatedStart(new Date(value));
    } else if (name === "end") {
      setUpdatedEnd(new Date(value));
    }
  };

  const handleEventClickDelete = async () => {
    if (selectedEvent) {
      await fetch("http://localhost:5000/tasks/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ task: selectedEvent }),
      })
        .then(() => {
          const filteredEvents = events.filter(
            (event) => event.title !== selectedEvent.title
          );

          setEvents(filteredEvents);
          setSelectedEvent(null);
          closeModal();
        })
        .catch(() => {
        });
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setUpdatedStart(event.start);
    setUpdatedEnd(event.end);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateClick = () => {
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEventUpdate = async () => {
    if (selectedEvent && updatedStart && updatedEnd) {
      try {
        await fetch(`http://localhost:5000/tasks/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            task: {
              title: selectedEvent.title,
              start: updatedStart, 
              end: updatedEnd
            }
          }),
        })
          .then((res) => res.json())
          .then(() => {
            const updatedEvents = events.map((event) =>
              event.title === selectedEvent.title
                ? { ...event, start: updatedStart, end: updatedEnd }
                : event
            );

            setEvents(updatedEvents);
            setSelectedEvent(null);
            setIsUpdateModalOpen(false);
          });
      } catch (error) {

      }
    }
  };

  const handleEventDelete = () => {

    handleEventClickDelete(); 
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Flex direction="column">
        <Navbar
          user={user}
          logout={handleLogout}
          handleEventCreation={handleEventCreation}
        />

        <Flex
          wrap="wrap"
          direction={{ base: "column", sm: "row" }}
          gap={4}
          mt={4}
          mx={{ sm: "2" }}
        >
          {events.length !== 0 ? events.map((event: Event) => (
            <Box
              key={event.title}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              width={{ base: "100%", md: "300px" }}
              mb={4}
              boxShadow="md"
              bgGradient="linear(to-r, teal.400, teal.600)"
              color="teal.900"
              _hover={{ cursor: "pointer", transform: "scale(1.05)" }}
              transition="transform 0.3s ease-in-out"
              onClick={() => handleEventClick(event)}
            >
              <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                {event.title}
              </Text>

              <Text fontSize="sm" fontWeight="bold" mb={1} color="teal.100">
                Start:
              </Text>
              <Text color="teal.100">
                {format(event.start, "MM/dd/yyyy, hh:mm:ss a")}
              </Text>
              <Text fontSize="sm" fontWeight="bold" mt={2} color="teal.100">
                End:
              </Text>
              <Text color="teal.100">
                {format(event.end, "MM/dd/yyyy, hh:mm:ss a")}
              </Text>

              <Flex mt={4} justifyContent="space-between">
                {/* Update Icon */}
                <EditIcon
                  color="white"
                  boxSize={6}
                  cursor="pointer"
                  onClick={handleUpdateClick}
                />
                {/* Delete Icon */}
                <DeleteIcon
                  color="white"
                  boxSize={6}
                  cursor="pointer"
                  onClick={handleDeleteClick}
                />
              </Flex>
            </Box>
          )) : <Text>No Todo Items to display. Add Your Task</Text>}
        </Flex>
      </Flex>

      <Modal isOpen={isUpdateModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <>
                <FormControl>
                  <FormLabel>Start</FormLabel>
                  <Input
                    type="datetime-local"
                    name="start"
                    value={format(updatedStart, "yyyy-MM-dd'T'HH:mm")}
                    onChange={handleUpdateInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End</FormLabel>
                  <Input
                    type="datetime-local"
                    name="end"
                    value={format(updatedEnd, "yyyy-MM-dd'T'HH:mm")}
                    onChange={handleUpdateInputChange}
                  />
                </FormControl>

                <Button mt={4} colorScheme="blue" onClick={handleEventUpdate}>
                  Update Event
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {selectedEvent.title}
                </Text>
                <Text fontSize="sm" fontWeight="bold" mb={1}>
                  Start:
                </Text>
                <Text>
                  {format(selectedEvent.start, "MM/dd/yyyy, hh:mm:ss a")}
                </Text>
                <Text fontSize="sm" fontWeight="bold" mt={2}>
                  End:
                </Text>
                <Text>
                  {format(selectedEvent.end, "MM/dd/yyyy, hh:mm:ss a")}
                </Text>
              </>
            )}

            <FormControl my={5}>
              <FormLabel color="gray.700">
                Are you sure you want to delete this task
              </FormLabel>
              <Button colorScheme="red" onClick={handleEventDelete}>
                Delete Event
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user,
    loading: state.auth.loading,
    authenticated: state.auth.authenticated,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    logout: () => {
      dispatch({
        type: LOGOUT,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
