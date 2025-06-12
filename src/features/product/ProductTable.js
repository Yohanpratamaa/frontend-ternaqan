import React from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";

function ProductTable({ products, onDelete }) {
  const navigate = useNavigate();

  // Fungsi untuk format harga ke IDR
  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Alternatif fungsi format manual dengan separator
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
            <td>{formatNumber(sapi.berat)} Kg</td>
            <td>{formatNumber(sapi.stok)} Ekor</td>
            <td className="price-cell">{formatIDR(sapi.harga)}</td>
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
