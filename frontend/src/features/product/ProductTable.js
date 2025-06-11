import React from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";

function ProductTable({ products, onDelete }) {
  const navigate = useNavigate();

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Umur</th>
          <th>Berat</th>
          <th>Stok</th>
          <th>Harga</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {products.map((sapi) => (
          <tr key={sapi.id}>
            <td>{sapi.id}</td>
            <td>{sapi.umur} Tahun</td>
            <td>{sapi.berat} Kg</td>
            <td>{sapi.stok} Ekor</td>
            <td>Rp. {sapi.harga}</td>
            <td>
              <button
                onClick={() => navigate(`/product/edit/${sapi.id}`)}
                className="product-action-btn edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sapi.id)}
                className="product-action-btn delete"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
