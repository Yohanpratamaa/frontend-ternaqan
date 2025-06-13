import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./product.css";

const API_URL = process.env.REACT_APP_SAPI_API;

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query GetSapi($id: Int!) {
            sapi(id: $id) {
              id
              umur
              berat
              stok
              harga
            }
          }
        `,
        variables: { id: Number(id) },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setInitialData(result.data.sapi);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (data) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdateSapi($id: Int!, $umur: Int, $berat: Float, $stok: Int, $harga: Float) {
            updateSapi(id: $id, umur: $umur, berat: $berat, stok: $stok, harga: $harga) {
              id
            }
          }
        `,
        variables: {
          id: Number(id),
          umur: Number(data.umur),
          berat: Number(data.berat),
          stok: Number(data.stok),
          harga: Number(data.harga),
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.updateSapi) {
          Swal.fire(
            "Berhasil!",
            "Data sapi berhasil diupdate.",
            "success"
          ).then(() => {
            navigate("/product");
          });
        } else {
          Swal.fire("Gagal!", "Gagal mengupdate sapi.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat update.", "error");
      });
  };

  if (loading)
    return <div style={{ marginLeft: 320, padding: 20 }}>Loading...</div>;
  if (!initialData)
    return <div style={{ marginLeft: 320, padding: 20 }}>Sapi not found</div>;

  return (
    <div className="product-container">
      <h2 className="product-title" style={{ textAlign: "center" }}>
        Edit Sapi
      </h2>
      <ProductForm
        onSubmit={handleSubmit}
        initialData={initialData}
        onCancel={() => navigate("/product")}
      />
    </div>
  );
}

export default ProductEdit;
