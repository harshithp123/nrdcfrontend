// src/components/OnboardUserModal.jsx
import React, { useState } from "react";


import BackdropModal from "../../../utils/backdrop";
import { useToast } from "../../../utils/toastprovider";
import api from "../../../api/api";


const OnboardUserModal = ({ open, onClose, refreshUsers, roles }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", role_id: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/admin/create-user", form);
      if(res.status==200){
           showToast(res.message, "success");
      }else{
           showToast(res.message, "info");

      }
   
      refreshUsers(); // refresh table
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to onboard user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackdropModal open={open} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4 text-center">Onboard User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </BackdropModal>
  );
};

export default OnboardUserModal;
