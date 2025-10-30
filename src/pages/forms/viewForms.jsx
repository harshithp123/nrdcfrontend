import React, { useEffect, useState } from "react";
import { IconButton, CircularProgress, Tooltip } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import SidebarLayout from "../../utils/sidebarlayout";
import ConfirmDialog from "./deletemodal";
import api from "../../api/api";
import { useToast } from "../../utils/toastprovider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const ViewForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  /** Fetch all forms from API */
  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/forms`);

      if (res?.status === 200 && Array.isArray(res.forms)) {
        setForms(res.forms);
        showToast("Forms fetched successfully ✅", "success");
      } else {
        setForms([]);
        showToast("No forms found or invalid response ❌", "warning");
      }
    } catch (err) {
      console.error("Error fetching forms:", err);
      showToast("Failed to fetch forms ❌", "error");
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  /** Delete confirmation */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await api.delete(`/api/forms/${deleteTarget.id}`);
      if (res?.status === 200) {
        showToast("Form deleted successfully ✅", "success");
        setDeleteTarget(null);
        fetchForms();
      } else {
        showToast("Failed to delete form ❌", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting form ❌", "error");
    }
  };

  /** Edit handler */
  const handleEdit = (id) => {
    navigate(`/create-form?id=${id}&mode=edit`);
  };

  /** View handler */
  const handleView = (id) => {
    navigate(`/create-form?id=${id}&mode=view`);
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
   <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📋 Submitted Forms
          </motion.h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <CircularProgress />
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                No forms found 🚫
              </motion.p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {forms.map((form, idx) => (
                <motion.div
                  key={form.id}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 p-5 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex space-x-1">
                    <Tooltip title="View Form" arrow>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(form.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Form" arrow>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleEdit(form.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Form" arrow>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          setDeleteTarget({
                            id: form.id,
                            name: form.form_data?.receivedFrom || "this form",
                          })
                        }
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>

                  {/* Content */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {form.form_data?.receivedFrom || "Unknown"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {form.User?.name} ({form.User?.email})
                  </p>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium">📍 Location:</span>{" "}
                      {form.form_data?.location || "-"}
                    </p>
                    <p>
                      <span className="font-medium">🗓 Report Date:</span>{" "}
                      {dayjs(form.form_data?.reportDate).format("DD MMM YYYY")}
                    </p>
                    <p>
                      <span className="font-medium">💰 Chargeable:</span> ₹
                      {form.form_data?.chargeableValue || 0} + GST{" "}
                      {form.form_data?.gst || 0}
                    </p>
                    <p>
                      <span className="font-medium">🧾 Total:</span> ₹
                      {form.form_data?.total || 0}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          form.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {form.status}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 border-t pt-2 text-xs text-gray-500">
                    <p>
                      🕒 Created:{" "}
                      {dayjs(form.created_at).format("DD MMM YYYY, hh:mm A")}
                    </p>
                    <p>
                      🧪 Samples:{" "}
                      {form.form_data?.samples?.join(", ") || "No samples"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Form"
        message={`Are you sure you want to delete ${deleteTarget?.name}'s form? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </SidebarLayout>
  );
};

export default ViewForms;
