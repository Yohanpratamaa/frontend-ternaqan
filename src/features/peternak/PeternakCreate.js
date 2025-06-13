import React from "react";
import PeternakForm from "./PeternakForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./peternak.css";

const API_URL = process.env.REACT_APP_PET_API;

function PeternakCreate() {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation CreatePeternak($nama: String!, $alamat: String, $nohp: String, $username: String!) {
            createPeternak(nama: $nama, alamat: $alamat, nohp: $nohp, username: $username) {
              id
            }
          }
        `,
        variables: { ...data },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.createPeternak) {
          Swal.fire(
            "Berhasil!",
            "Data peternak berhasil ditambahkan.",
            "success"
          ).then(() => {
            navigate("/peternak");
          });
        } else {
          Swal.fire("Gagal!", "Gagal menambah peternak.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambah.", "error");
      });
  };

  return (
    <div className="peternak-container">
      <h2 className="peternak-title" style={{ textAlign: "center" }}>
        Tambah Peternak
      </h2>
      <PeternakForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/peternak")}
      />
    </div>
  );
}

export default PeternakCreate;
