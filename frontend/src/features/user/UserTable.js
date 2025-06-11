import React from "react";
import { useNavigate } from "react-router-dom";

function UserTable({ admins, onDelete }) {
  const navigate = useNavigate();

  return (
    <table className="userlist-table">
      <thead style={{ background: "#1976d2", color: "#fff" }}>
        <tr>
          <th>ID</th>
          <th>Transaction ID</th>
          <th>Nama</th>
          <th>Alamat</th>
          <th>No HP</th>
          <th>Username</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td>{admin.id}</td>
            <td>{admin.transaction_id}</td>
            <td>{admin.nama}</td>
            <td>{admin.alamat}</td>
            <td>{admin.nohp}</td>
            <td>{admin.username}</td>
            <td>
              <button
                onClick={() => navigate(`/user/edit/${admin.id}`)}
                className="userlist-action-btn edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(admin.id)}
                className="userlist-action-btn delete"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
