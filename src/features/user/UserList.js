import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./user.css";

const API_URL = process.env.REACT_APP_ADMIN_API;

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
        setAdmins(result.data.admins || []);
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

  if (loading) {
    return (
      <div className="userlist-container">
        <h2 className="userlist-title">Admin List</h2>

        {/* PERBAIKAN: Loading state yang lebih baik */}
        <div className="userlist-loading-wrapper">
          <div className="userlist-loading-content">
            <div className="userlist-loading-spinner"></div>
            <div className="userlist-loading-text">Memuat data admin...</div>
            <div className="userlist-loading-subtext">
              Mohon tunggu sebentar
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="userlist-container">
        <h2 className="userlist-title">Admin List</h2>
        <button
          className="user-create"
          onClick={() => navigate("/user/create")}
        >
          + Tambah Admin
        </button>
        <div className="userlist-empty">
          <h3>Tidak ada data admin</h3>
          <p>
            Belum ada admin yang terdaftar dalam sistem. Silakan tambah admin
            baru.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="userlist-container">
      <h2 className="userlist-title">Admin List</h2>
      <button className="user-create" onClick={() => navigate("/user/create")}>
        + Tambah Admin
      </button>
      <div className="userlist-table-container">
        <UserTable
          admins={admins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default UserList;
