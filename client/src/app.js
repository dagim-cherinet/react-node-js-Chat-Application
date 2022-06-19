import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Join from "./components/Join/Join.js";
import Chat from "./components/Chat/Chat.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/Chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};
export default App;
