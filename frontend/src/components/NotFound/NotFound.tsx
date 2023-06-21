import { Flex, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bg="teal.500"
    >
      <Heading size="2xl" color="white" mb={4}>
        404 Page Not Found
      </Heading>
      <Text color="white" fontSize="xl" mb={8}>
        Oops! The page you are looking for does not exist.
      </Text>
      <Button
        as={Link}
        to="/"
        colorScheme="teal"
        size="lg"
        fontWeight="bold"
        px={8}
      >
        Go to Home
      </Button>
    </Flex>
  );
};

export default NotFound;
