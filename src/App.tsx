import { BrowserRouter as Router } from "react-router-dom";
import { Root } from "@/components";
import "./App.scss";

function App() {
  return (
    <>
      <Router>
        <Root></Root>
      </Router>
    </>
  );
}

export default App;
