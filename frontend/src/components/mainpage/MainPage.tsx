import React, { memo, useEffect, useState } from "react";
import { User } from "../../types";
import { connect, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { LOGOUT } from "../../actions/Types";
import { load_user } from "../../actions/AuthActions";
import { Navigate, useNavigate } from "react-router-dom";
import Todos from "./Todos";
import { Center, Skeleton, Spinner } from "@chakra-ui/react";

type Props = {
  user: User | null;
  logout: () => void;
};

const Loader = () => {
  return (
    <>
      <Skeleton height="15vh" />
      <Center mt={40}>
        <Spinner size={{ base: "sm", md: "lg" }} />
      </Center>
    </>
  );
};

const Mainpage: React.FC<Props> = memo(({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("access")) {
        if (!user) {
          await dispatch<any>(load_user());
        }
        navigate("/dashboard");
        setLoading(false);
      } else {
        navigate("/");
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {user && (
        <>
          <Todos />
        </>
      )}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Mainpage);
