import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  SlideFade,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Dispatch } from "redux";
import { Dimensions, LoginCredentials, User } from "../../types";
import { load_user, login_user } from "../../actions/AuthActions";
import { useDispatch, connect } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";

const Loader = () => {
  return <div>Loading...</div>; // You can replace this with your desired loading animation or message
};

type Props = {
  user: User | null;
  loginerror: null | string;
  loginErrorReset: () => void;
};

const Login: React.FC<Props> = ({ user, loginerror, loginErrorReset }) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });
  const [details, setDetails] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch<any>(login_user(details));
      if (localStorage.getItem("access")) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setDetails((prevDetails: LoginCredentials) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useLayoutEffect(() => {
    function updateDimensions() {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const LoadingUserAlreadyLoggedIn = async () => {
      if (localStorage.getItem("access")) {
        try {
          console.log("Loading even not required");
          await dispatch<any>(load_user());
          setLoading(false);
          navigate("/dashboard");
        } catch (error) {}
      }
    };
    LoadingUserAlreadyLoggedIn();
  }, []);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (loginerror != null && !showAlert) {
      setShowAlert(true);
      timer = setTimeout(() => {
        setShowAlert(false);
        loginErrorReset();
      }, 2000); // Close the alert after 3 seconds (adjust the delay as needed)
    }

    return () => {
      clearTimeout(timer);
    };
  }, [loginerror]);

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Grid
      height={dimensions.height}
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(3,1fr)",
      }}
    >
      <GridItem colSpan={2} w="100%" h="100%" bg="white" color="black">
        <Flex h="100%" align="center" justify="center">
          <Grid
            templateRows="repeat(3,1fr)"
            width={{ base: "95%", md: "70%", xl: "55%" }}
            height="60%"
            bg="gray.200"
            borderRadius={15}
          >
            <GridItem>
              <VStack align="center" justify="center" height="100%" mb={2}>
                <Heading>Login to Your Account</Heading>
                <Text>Login with your credentials</Text>

                <SlideFade in={showAlert} offsetY="-20px">
                  <Alert status="error" width="110%">
                    <AlertIcon />
                    <AlertDescription>{loginerror}</AlertDescription>
                  </Alert>
                </SlideFade>
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="center" justify="center" spacing={4} height="100%">
                <FormControl width={{ base: "95%", md: "80%" }}>
                  <Input
                    type="email"
                    name="email"
                    variant="filled"
                    placeholder="Enter Email"
                    onChange={handleUpdate}
                  />
                  <FormHelperText>We'll never share your email.</FormHelperText>
                </FormControl>
                <Center width={{ base: "95%", md: "80%" }}>
                  <FormControl>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        name="password"
                        variant="filled"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        onChange={handleUpdate}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Center>
              </VStack>
            </GridItem>
            <GridItem>
              <Center>
                <ButtonGroup width={160}>
                  <Button
                    colorScheme="green"
                    width="130%"
                    size="md"
                    marginTop={5}
                    borderRadius={9}
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                  <Button
                    colorScheme="green"
                    width="160%"
                    size="md"
                    marginTop={5}
                    borderRadius={9}
                    display={{ base: "unset", md: "none" }}
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </ButtonGroup>
              </Center>
            </GridItem>
          </Grid>
        </Flex>
      </GridItem>
      <GridItem
        display={{ base: "none", md: "unset" }}
        w="100%"
        h="100%"
        bg="gray.500"
      >
        <Flex
          h="100%"
          align="center"
          justify="center"
          backgroundColor="green.400"
          color="white"
        >
          <VStack spacing={10} width="50%">
            <Heading textAlign="start">New Here?</Heading>
            <Center>
              <Text fontSize={20}>
                sign up for the todolist application for managing your daily
                tasks
              </Text>
            </Center>
            <Link to="/signup">
              <Button background="white" width="130%" size="md" borderRadius={9}>
                Sign Up
              </Button>
            </Link>
          </VStack>
        </Flex>
      </GridItem>
    </Grid>
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.auth.user,
    isopen: state.auth.isopen,
    loginerror: state.auth.loginerror,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loginErrorReset: () => {
      dispatch({
        type: "LOGIN_ERROR_RESET",
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
