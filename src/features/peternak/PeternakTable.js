import React from "react";
import { useNavigate } from "react-router-dom";
import "./peternak.css";

function PeternakTable({ peternaks, onDelete }) {
  const navigate = useNavigate();

  return (
    <table className="peternak-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
          <th>Alamat</th>
          <th>No HP</th>
          <th>Username</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {peternaks.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nama}</td>
            <td>{p.alamat}</td>
            <td>{p.nohp}</td>
            <td>{p.username}</td>
            <td>
              <button
                onClick={() => navigate(`/peternak/edit/${p.id}`)}
                className="peternak-action-btn edit"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="peternak-action-btn delete"
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

export default PeternakTable;
