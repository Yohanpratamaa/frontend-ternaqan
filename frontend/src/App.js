import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Product from "./features/product/Product";
import Transactions from "./features/transactions/Transactions";
import UserList from "./features/user/UserList";
import UserCreate from "./features/user/UserCreate";
import Dashboard from "./features/dashboard/dashboard";
import UserEdit from "./features/user/UserEdit";
import ProductCreate from "./features/product/ProductCreate";
import ProductEdit from "./features/product/ProductEdit";
import Peternak from "./features/peternak/Peternak";
import PeternakCreate from "./features/peternak/PeternakCreate";
import PeternakEdit from "./features/peternak/PeternakEdit";
import Sapi from "./features/product/Sapi";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sapi" element={<Sapi />} />
        <Route path="/product" element={<Product />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/user/list" element={<UserList />} />
        <Route path="/user/create" element={<UserCreate />} />
        <Route path="/user/edit/:id" element={<UserEdit />} />
        <Route path="/product/create" element={<ProductCreate />} />
        <Route path="/product/edit/:id" element={<ProductEdit />} />
        <Route path="/peternak" element={<Peternak />} />
        <Route path="/peternak/create" element={<PeternakCreate />} />
        <Route path="/peternak/edit/:id" element={<PeternakEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
