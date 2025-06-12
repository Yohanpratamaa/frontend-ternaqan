import React, { useEffect, useState } from "react";
import PeternakTable from "./PeternakTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./peternak.css";

const API_URL = process.env.REACT_APP_PET_API;

function PeternakList() {
  const [peternaks, setPeternaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPeternaks = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            peternaks {
              id
              nama
              alamat
              nohp
              username
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPeternaks(result.data.peternaks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPeternaks();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus peternak ini?",
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
                deletePeternak(id: ${id})
              }
            `,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            fetchPeternaks();
            Swal.fire(
              "Berhasil!",
              "Data peternak berhasil dihapus.",
              "success"
            );
          })
          .catch(() => {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
          });
      }
    });
  };

  return (
    <>
      <h2 className="peternak-title">Peternak List</h2>
      <button
        className="peternak-form-btn"
        style={{ maxWidth: 220, marginBottom: 24 }}
        onClick={() => navigate("/peternak/create")}
      >
        + Tambah Peternak
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="peternak-table-container">
          <PeternakTable peternaks={peternaks} onDelete={handleDelete} />
        </div>
      )}
    </>
  );
}

export default PeternakList;
