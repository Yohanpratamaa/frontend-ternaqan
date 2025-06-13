import React, { useEffect, useState } from "react";
import PeternakForm from "./PeternakForm";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./peternak.css";

const API_URL = process.env.REACT_APP_PET_API;

function PeternakEdit() {
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
          query GetPeternak($id: Int!) {
            peternak(id: $id) {
              id
              nama
              alamat
              nohp
              username
            }
          }
        `,
        variables: { id: Number(id) },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setInitialData(result.data.peternak);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (data) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdatePeternak($id: Int!, $nama: String, $alamat: String, $nohp: String, $username: String) {
            updatePeternak(id: $id, nama: $nama, alamat: $alamat, nohp: $nohp, username: $username) {
              id
            }
          }
        `,
        variables: {
          ...data,
          id: Number(id),
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.updatePeternak) {
          Swal.fire(
            "Berhasil!",
            "Data peternak berhasil diupdate.",
            "success"
          ).then(() => {
            navigate("/peternak");
          });
        } else {
          Swal.fire("Gagal!", "Gagal mengupdate peternak.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat update.", "error");
      });
  };

  if (loading)
    return <div style={{ marginLeft: 320, padding: 20 }}>Loading...</div>;
  if (!initialData)
    return (
      <div style={{ marginLeft: 320, padding: 20 }}>Peternak not found</div>
    );

  return (
    <div className="peternak-container">
      <h2 className="peternak-title" style={{ textAlign: "center" }}>
        Edit Peternak
      </h2>
      <PeternakForm
        onSubmit={handleSubmit}
        initialData={initialData}
        onCancel={() => navigate("/peternak")}
      />
    </div>
  );
}

export default PeternakEdit;
