import React, { useEffect, useState } from "react";
import UserForm from "./UserForm";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_ADMIN_API;

function UserEdit() {
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
          query GetAdmin($id: Int!) {
            admin(id: $id) {
              id
              transaction_id
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
        setInitialData(result.data.admin);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (data) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation UpdateAdmin($id: Int!, $transaction_id: Int, $nama: String, $alamat: String, $nohp: String, $username: String) {
            updateAdmin(id: $id, transaction_id: $transaction_id, nama: $nama, alamat: $alamat, nohp: $nohp, username: $username) {
              id
            }
          }
        `,
        variables: {
          ...data,
          id: Number(id),
          transaction_id: Number(data.transaction_id) || null,
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.updateAdmin) {
          Swal.fire("Berhasil!", "User berhasil diupdate.", "success").then(
            () => {
              navigate("/user/list");
            }
          );
        } else {
          Swal.fire("Gagal!", "Gagal mengupdate user.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat update.", "error");
      });
  };

  if (loading)
    return <div style={{ marginLeft: 320, padding: 20 }}>Loading...</div>;
  if (!initialData)
    return <div style={{ marginLeft: 320, padding: 20 }}>User not found</div>;

  return (
    <div className="user-container">
      <h2 className="userlist-title" style={{ textAlign: "center" }}>
        Edit Admin
      </h2>
      <UserForm
        onSubmit={handleSubmit}
        initialData={initialData}
        onCancel={() => navigate("/user/list")}
      />
    </div>
  );
}

export default UserEdit;
