import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./product.css";

const API_URL = "http://localhost:8001/";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            sapis {
              id
              umur
              berat
              stok
              harga
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setProducts(result.data.sapis || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus sapi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation {
                deleteSapi(id: ${id})
              }
            `,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            fetchProducts();
            Swal.fire("Berhasil!", "Data sapi berhasil dihapus.", "success");
          })
          .catch(() => {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
          });
      }
    });
  };

  return (
    <>
      <h2 className="product-title">Sapi List</h2>
      <button
        className="product-form-btn"
        style={{ maxWidth: 220, marginBottom: 24 }}
        onClick={() => navigate("/product/create")}
      >
        + Tambah Sapi
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="product-table-container">
          <ProductTable products={products} onDelete={handleDelete} />
        </div>
      )}
    </>
  );
}

export default ProductList;
