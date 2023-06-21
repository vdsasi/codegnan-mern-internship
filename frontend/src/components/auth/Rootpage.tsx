import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Mainpage from "../mainpage/MainPage";
import NotFound from "../NotFound/NotFound";

type Props = {};

const Rootpage: React.FC<Props> = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/dashboard" element={<Mainpage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Rootpage;
