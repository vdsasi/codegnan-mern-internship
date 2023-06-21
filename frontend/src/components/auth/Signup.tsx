import {
  Flex,
  Grid,
  GridItem,
  VStack,
  Heading,
  Text,
  FormControl,
  Input,
  FormHelperText,
  Center,
  InputGroup,
  InputRightElement,
  Button,
  ButtonGroup,
  Alert,
  AlertDescription,
  AlertIcon,
  SlideFade,
} from "@chakra-ui/react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { SignupCredentials } from "../../types";
import { signin_user } from "../../actions/AuthActions";
import { useDispatch } from "react-redux";
import { SIGNUP_ERROR_RESET } from "../../actions/Types";
import { Link } from "react-router-dom";

type Props = {
  signuperror: null | string;
  signupmessage: null | string;
  signupErrorReset: () => void;
};

const Signup: React.FC<Props> = ({ signuperror, signupErrorReset }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);

  const [details, setDetails] = useState<SignupCredentials>({
    email: "",
    name: "",
    password: "",
  });

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer: any;

    if (signuperror != null && !showAlert) {
      setShowAlert(true);
      timer = setTimeout(() => {
        setShowAlert(false);
        signupErrorReset();
      }, 3000); 
    }

    return () => {
      clearTimeout(timer);
    };
  }, [signuperror]);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setDetails((prevDetails: SignupCredentials) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch<any>(signin_user(details));
  };

  return (
    <Flex h="100vh" align="center" justify="center">
      <Grid
        templateRows="repeat(3,1fr)"
        width={{ base: "95%", md: "70%", xl: "55%" }}
        height="60%"
        bg="gray.200"
        borderRadius={15}
      >
        <GridItem>
          <VStack align="center" justify="center" height="100%" mb={2}>
            <Heading>Signup Your Account</Heading>
            <Text>Register with your credentials</Text>

            {signuperror && (
              <SlideFade in={showAlert} offsetY="-20px">
                {signuperror === "signup success" ? (
                  <Alert status="success" width="110%">
                    <AlertIcon />
                    <AlertDescription>{signuperror}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert status="error" width="110%">
                    <AlertIcon />
                    <AlertDescription>{signuperror}</AlertDescription>
                  </Alert>
                )}
              </SlideFade>
            )}
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
            <FormControl width={{ base: "95%", md: "80%" }}>
              <Input
                type="text"
                name="name"
                variant="filled"
                placeholder="Enter name"
                onChange={handleUpdate}
              />
            </FormControl>
            <Center width={{ base: "95%", md: "80%" }}>
              <FormControl>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    variant="filled"
                    name="password"
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
                width="160%"
                size="md"
                marginTop={5}
                borderRadius={9}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <Link to="/">
                <Button
                  colorScheme="green"
                  width="120%"
                  size="md"
                  marginTop={5}
                  borderRadius={9}
                >
                  Login
                </Button>
              </Link>
            </ButtonGroup>
          </Center>
        </GridItem>
      </Grid>
    </Flex>
  );
};

const mapStateToProps = (state: any) => {
  return {
    signuperror: state.auth.signuperror,
    signupmessage: state.auth.signupmessage,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    signupErrorReset: () => {
      dispatch({
        type: SIGNUP_ERROR_RESET,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
