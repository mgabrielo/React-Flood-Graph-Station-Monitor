import "./App.css";
import Station from "./components/Station";
import { Container } from "@mui/material";

function App() {
  return (
    <Container maxWidth="lg" className="App" sx={{ justifyContent: "center" }}>
      <Station />
    </Container>
  );
}

export default App;
