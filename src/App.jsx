import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Menu from "./Pages/Menu.jsx";
import About from "./Pages/About.jsx"
import Contacts from "./Pages/Contacts.jsx"
import Order from "./Pages/Order.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/order" element={<Order />} />
    </Routes>
  );
}

export default App;
