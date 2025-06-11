import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./user.css";

const API_URL = "http://localhost:8000/";

function UserList({ onEdit }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdmins = () => {
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query {
            admins {
              id
              transaction_id
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
        setAdmins(result.data.admins);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin ingin menghapus user ini?",
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
                deleteAdmin(id: ${id})
              }
            `,
          }),
        })
          .then((res) => res.json())
          .then(() => {
            fetchAdmins();
            Swal.fire("Berhasil!", "User berhasil dihapus.", "success");
          })
          .catch(() => {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
          });
      }
    });
  };

  // EDIT
  const handleEdit = (admin) => {
    if (onEdit) onEdit(admin);
  };

  return (
    <div className="userlist-container">
      <h2 className="userlist-title">Admin List</h2>
      <button
        className="user-create"
        style={{ maxWidth: 220, marginBottom: 24 }}
        onClick={() => navigate("/user/create")}
      >
        + Tambah Admin
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="userlist-table-container">
          <UserTable
            admins={admins}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

export default UserList;
