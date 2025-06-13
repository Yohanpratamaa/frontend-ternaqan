import React, { useEffect, useState } from "react";
import "./product.css";

const API_URL = process.env.REACT_APP_SAPI_API;

const SapiList = () => {
  const [sapis, setSapis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk format harga ke IDR
  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi format number dengan separator
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchSapis = () => {
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
        setSapis(result.data.sapis || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSapis();
  }, []);

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

  if (sapis.length === 0) {
    return (
      <div className="product-container">
        <h2 className="product-title">Sapi List</h2>
        <div className="product-empty">
          <h3>Tidak ada data sapi</h3>
          <p>Belum ada data sapi yang tersedia dalam sistem.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h2 className="product-title">Sapi List</h2>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Umur</th>
              <th>Berat</th>
              <th>Stok</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            {sapis.map((sapi) => (
              <tr key={sapi.id}>
                <td>
                  <strong>{sapi.id}</strong>
                </td>
                <td>{sapi.umur} Bulan</td>
                <td>{formatNumber(sapi.berat)} Kg</td>
                <td>{formatNumber(sapi.stok)} Ekor</td>
                <td className="price-cell">{formatIDR(sapi.harga)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SapiList;
