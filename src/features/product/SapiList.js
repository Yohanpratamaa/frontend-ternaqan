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

  return (
    <>
      <h2 className="product-title">Sapi List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
                  <td>{sapi.id}</td>
                  <td>{sapi.umur} Tahun</td>
                  <td>{formatNumber(sapi.berat)} Kg</td>
                  <td>{formatNumber(sapi.stok)} Ekor</td>
                  <td className="price-cell">{formatIDR(sapi.harga)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SapiList;
