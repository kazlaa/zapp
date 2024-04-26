import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ProductsList } from "./components/ProductList";
import { ProductUploadForm } from "./components/ProductUploadForm";
import { Product } from "./components/Product";
import { NavBar } from "./components/NavBar";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div>
        <header>
          <NavBar />
        </header>
        <Routes>
          <Route path="/products" Component={ProductsList} />
          <Route path="/product/" Component={Product} />
          <Route path="/product/:sku" Component={Product} />
          <Route path="/upload" Component={ProductUploadForm} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
