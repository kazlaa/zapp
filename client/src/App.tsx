import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ProductsList } from "./components/ProductList";
import { ProductUploadForm } from "./components/ProductUploadForm";
import { Product } from "./components/Product";

import "./App.css";
import { ProductForm } from "./components/ProductForm";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <Router>
      <div>
        <header>
          <NavBar />
        </header>
        <Routes>
          <Route path="/products" Component={ProductsList} />
          <Route path="/product/:sku" Component={Product} />
          <Route path="/productform/:sku" Component={ProductForm} />
          <Route path="/upload" Component={ProductUploadForm} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
