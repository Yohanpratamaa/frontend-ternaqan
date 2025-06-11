import React, { useState, useEffect } from "react";
import "./product.css";

function ProductForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState({
    umur: "",
    berat: "",
    stok: "",
    harga: "",
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
      umur: "",
      berat: "",
      stok: "",
      harga: "",
    });
  };

  return (
    <div className="product-form-container">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="product-form-fields">
          <label className="product-form-label" htmlFor="umur">
            Umur
          </label>
          <input
            id="umur"
            name="umur"
            placeholder="Umur"
            value={form.umur}
            onChange={handleChange}
            className="product-form-input"
            type="number"
            required
          />
          <label className="product-form-label" htmlFor="berat">
            Berat
          </label>
          <input
            id="berat"
            name="berat"
            placeholder="Berat"
            value={form.berat}
            onChange={handleChange}
            className="product-form-input"
            type="number"
            required
          />
          <label className="product-form-label" htmlFor="stok">
            Stok
          </label>
          <input
            id="stok"
            name="stok"
            placeholder="Stok"
            value={form.stok}
            onChange={handleChange}
            className="product-form-input"
            type="number"
            required
          />
          <label className="product-form-label" htmlFor="harga">
            Harga
          </label>
          <input
            id="harga"
            name="harga"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
            className="product-form-input"
            type="number"
            required
          />
          <button className="product-form-btn" type="submit">
            {initialData ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="product-form-btn cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
