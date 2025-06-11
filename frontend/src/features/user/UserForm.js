import React, { useState, useEffect } from "react";
import "./userForm.css";

function UserForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState({
    transaction_id: "",
    nama: "",
    alamat: "",
    nohp: "",
    username: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      transaction_id: "",
      nama: "",
      alamat: "",
      nohp: "",
      username: "",
    });
  };

  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit} className="user-form">
        <div className="user-form-fields">
          <label className="user-form-label" htmlFor="transaction_id">
            Transaction ID
          </label>
          <input
            id="transaction_id"
            name="transaction_id"
            placeholder="Transaction ID"
            value={form.transaction_id}
            onChange={handleChange}
            className="user-form-input"
            type="number"
          />
          <label className="user-form-label" htmlFor="nama">
            Nama
          </label>
          <input
            id="nama"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="user-form-input"
            required
          />
          <label className="user-form-label" htmlFor="alamat">
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            placeholder="Alamat"
            value={form.alamat}
            onChange={handleChange}
            className="user-form-input"
          />
          <label className="user-form-label" htmlFor="nohp">
            No HP
          </label>
          <input
            id="nohp"
            name="nohp"
            placeholder="No HP"
            value={form.nohp}
            onChange={handleChange}
            className="user-form-input"
          />
          <label className="user-form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="user-form-input"
            required
          />
          <button className="user-form-btn" type="submit">
            {initialData ? "Update" : "Create"}
          </button>
            <button
              type="button"
              onClick={onCancel}
              className="user-form-btn cancel"
            >
              Cancel
            </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
