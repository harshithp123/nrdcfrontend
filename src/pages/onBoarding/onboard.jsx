import React, { useEffect, useState } from "react";
import SidebarLayout from "../../utils/sidebarlayout";
import api from "../../api/api";
import OnboardUserModal from "./modals/onboardusermodal";
import { useToast } from "../../utils/toastprovider";
import { Backdrop, CircularProgress } from "@mui/material";

const Onboarding = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  /** Fetch all onboarded users */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/onboard/users");
      if (res.status === 200 ) {
        setUsers(res.users ?? []);
        setPage(1);
      } else {
        showToast(res.data?.message || "Failed to fetch users ❌", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Network error ❌";
      showToast(msg, "error");
      console.error("fetchUsers error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch roles from dedicated /api/roles endpoint */
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/roles");
      if (res.status === 200 ) {
        setRoles(res.roles ?? []);
      } else {
        showToast(res.data?.message || "Failed to fetch roles ❌", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Failed to load roles ❌";
      showToast(msg, "error");
      console.error("fetchRoles error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Resend invite for a user */
  const handleResendInvite = async (email) => {
    setLoading(true);
    try {
      const res = await api.post("/api/onboard/resend-invite", { email });
      if (res.status === 200) {
        showToast(res.message || `Invite resent to ${email} ✅`, "success");
      } else {
        showToast(res.message || "Failed to resend invite ❌", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.message ||
        "Failed to resend invite ❌";
      showToast(msg, "error");
      console.error("handleResendInvite error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <SidebarLayout>
      {/* Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-6 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Onboarded Users
          </h2>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            + Onboard User
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border-b font-semibold">Name</th>
                <th className="p-3 border-b font-semibold">Email</th>
                <th className="p-3 border-b font-semibold">Role</th>
                <th className="p-3 border-b font-semibold">Status</th>
                <th className="p-3 border-b font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="p-3 border-b">{user.name}</td>
                    <td className="p-3 border-b text-gray-600">{user.email}</td>
                    <td className="p-3 border-b capitalize text-blue-700 font-medium">
                      {user.Role?.name}
                    </td>
                    <td className="p-3 border-b">
                      {user.is_active ? (
                        <span className="text-green-600 font-medium">
                          Active ✅
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending Password Setup ⚠️
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-b">
                      {!user.is_active && (
                        <button
                          onClick={() => handleResendInvite(user.email)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Resend Invite
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="flex justify-center mt-4 space-x-2 text-gray-700">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page{" "}
              <span className="font-semibold text-gray-900">{page}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        <OnboardUserModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          refreshUsers={fetchUsers}
          roles={roles}
        />
      </div>
    </SidebarLayout>
  );
};

export default Onboarding;
