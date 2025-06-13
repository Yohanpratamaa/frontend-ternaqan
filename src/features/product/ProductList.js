import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./product.css";

const API_URL = process.env.REACT_APP_SAPI_API;

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

  if (loading) {
    return (
      <div className="product-container">
        <h2 className="product-title">Sapi List</h2>

        {/* PERBAIKAN: Loading state yang lebih baik */}
        <div className="product-loading-wrapper">
          <div className="product-loading-content">
            <div className="product-loading-spinner"></div>
            <div className="product-loading-text">Memuat data sapi...</div>
            <div className="product-loading-subtext">Mohon tunggu sebentar</div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-container">
        <h2 className="product-title">Sapi List</h2>
        <button
          className="product-create"
          onClick={() => navigate("/product/create")}
        >
          + Tambah Sapi
        </button>
        <div className="product-empty">
          <h3>Tidak ada data sapi</h3>
          <p>
            Belum ada data sapi yang tercatat dalam sistem. Silakan tambah data
            sapi baru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h2 className="product-title">Sapi List</h2>
      <button
        className="product-create"
        onClick={() => navigate("/product/create")}
      >
        + Tambah Sapi
      </button>
      <div className="product-table-container">
        <ProductTable products={products} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default ProductList;
