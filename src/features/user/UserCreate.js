import React from "react";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./userForm.css";

const API_URL = process.env.REACT_APP_ADMIN_API;

function UserCreate() {
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation CreateAdmin($transaction_id: Int, $nama: String!, $alamat: String, $nohp: String, $username: String!) {
            createAdmin(transaction_id: $transaction_id, nama: $nama, alamat: $alamat, nohp: $nohp, username: $username) {
              id
            }
          }
        `,
        variables: {
          ...data,
          transaction_id: Number(data.transaction_id) || null,
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.createAdmin) {
          Swal.fire("Berhasil!", "User berhasil ditambahkan.", "success").then(
            () => {
              navigate("/user/list");
            }
          );
        } else {
          Swal.fire("Gagal!", "Gagal menambah user.", "error");
        }
      })
      .catch(() => {
        Swal.fire("Gagal!", "Terjadi kesalahan saat menambah.", "error");
      });
  };

  return (
    <div className="user-container">
      <h2 className="user-title">Create Admin</h2>
      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/user/list")}
      />
    </div>
  );
}

export default UserCreate;
