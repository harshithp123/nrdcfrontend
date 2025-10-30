import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SidebarLayout from "../../utils/sidebarlayout";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { useToast } from "../../utils/toastprovider";
import { Backdrop, CircularProgress } from "@mui/material";

const CreateForm = () => {
  const user = useSelector((state) => state.auth.user);
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id");
  const mode = searchParams.get("mode") || "create";
const navigate =useNavigate()
  const [loading, setLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(mode === "view");

  const [formData, setFormData] = useState({
    receivedFrom: "",
    location: "",
    contactNumber: "",
    samples: [],
    otherSample: "",
    analysis: [],
    reportDate: "",
    chargeableValue: "",
    gst: "",
    total: "",
    advancePaid: "",
    balanceDue: "",
    modeOfPayment: "",
    receiverName: "",
    customerSignature: "",
  });

  const sampleOptions = [
    "Limestone / Dolomite",
    "Iron Ore",
    "Bauxite",
    "Laterite",
    "Quartz",
    "Clay",
    "Feldspar",
    "Water",
  ];

  const analysisOptions = [
    "Loi",
    "Sio₂",
    "Cao",
    "Mgo",
    "Fe₂O₃",
    "Al₂O₃",
    "Na₂O",
    "K₂O",
    "Cl",
    "P₂O₅",
    "Ti₂O",
    "Iron as Fe",
    "Potability/Construction",
  ];

  /** Role-based permissions */
  const canEditField = (field) => {
console.log(user)

    if (isViewMode) return false;
    if (!user?.role_id) return false;

    const sampleFields = ["samples", "otherSample", "analysis", "reportDate"];

    // user_id == 2 → only edit those fields
    if (user.role_id === 2) return sampleFields.includes(field);
    // user_id == 1 → edit everything else
    if (user.role_id === 1) return !sampleFields.includes(field);

    // Default → allow everything
    return true;
  };

  /** Input handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const updated = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  /** Fetch form by ID */
  const fetchFormById = async () => {
    if (!formId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/forms/${formId}`);
      if (res?.status === 200 && res?.form?.form_data) {
        setFormData(res.form.form_data);
        showToast("Form data loaded successfully ✅", "success");
      } else {
        showToast("Invalid form data ❌", "warning");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch form ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Save or Update form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      showToast("User not authenticated ❌", "error");
      return;
    }

    const payload =
      mode === "edit"
        ? {
            form_data: formData,
            status: "approved",
          }
        : {
            user_id: user.id,
            form_data: formData,
          };

    try {
      setLoading(true);
      let res;

      if (mode === "edit") {
        res = await api.put(`/api/forms/${formId}`, payload);
      } else {
        res = await api.post(`/api/forms`, payload);
      }

      if (res?.status === 200) {
        showToast(
          mode === "edit"
            ? "Form updated successfully ✅"
            : "Form created successfully ✅",
          "success"
        );
        setTimeout(() => navigate("/view-forms"), 1000);

      } else {
        showToast("Failed to save form ❌", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error submitting form ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId && (mode === "view" || mode === "edit")) {
      fetchFormById();
    }
  }, [formId, mode]);

  return (
    <SidebarLayout>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="bg-gray-50 min-h-screen p-6 flex flex-col items-center">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-8">
          <div className="text-center border-b pb-4 mb-6">
            <img src={logo} alt="logo" className="w-16 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-gray-900">
              NATURAL RESOURCES DEVELOPMENT COOPERATIVE SOCIETY LTD.
            </h2>
            <p className="text-sm text-gray-700 font-semibold">
              Chemical Analysis Division
            </p>
            <p className="text-xs text-gray-600">
              3-6-269, 4th Floor, Reliable Business Chambers, Himayatnagar,
              Hyderabad - 500029
            </p>
            <p className="text-xs text-gray-600">
              Office: 040-23224277, 23252853 | Lab: 48570338
            </p>
            <h3 className="text-md font-semibold mt-3">
              {mode === "view"
                ? "VIEW SAMPLE ACKNOWLEDGMENT"
                : mode === "edit"
                ? "EDIT SAMPLE ACKNOWLEDGMENT"
                : "SAMPLE ACKNOWLEDGMENT"}
            </h3>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* LEFT SECTION */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="font-medium text-gray-900">
                  Sample(s) Received From
                </label>
                <input
                  type="text"
                  name="receivedFrom"
                  value={formData.receivedFrom}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("receivedFrom")}
                  required
                />
              </div>

              <div>
                <label className="font-medium text-gray-900">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("location")}
                />
              </div>

              <div>
                <label className="font-medium text-gray-900">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("contactNumber")}
                />
              </div>

              {/* Nature of the Sample */}
              <div>
                <p className="font-medium text-gray-900 mb-2">
                  Nature of the Sample
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sampleOptions.map((s) => (
                    <label
                      key={s}
                      className="flex items-center space-x-2 text-gray-900 font-medium"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600 h-4 w-4"
                        checked={formData.samples.includes(s)}
                        onChange={() => handleCheckboxChange("samples", s)}
                        disabled={!canEditField("samples")}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
                <textarea
                  name="otherSample"
                  placeholder="Add Others"
                  value={formData.otherSample}
                  onChange={handleChange}
                  className="mt-3 w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("otherSample")}
                ></textarea>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex flex-col space-y-4">
              <div>
                <p className="font-medium text-gray-900 mb-2">
                  Type of Analysis
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {analysisOptions.map((a) => (
                    <label
                      key={a}
                      className="flex items-center space-x-2 text-gray-900 font-medium"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600 h-4 w-4"
                        checked={formData.analysis.includes(a)}
                        onChange={() => handleCheckboxChange("analysis", a)}
                        disabled={!canEditField("analysis")}
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-900">
                  Report Due on
                </label>
                <input
                  type="date"
                  name="reportDate"
                  value={formData.reportDate}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("reportDate")}
                />
              </div>

              {/* Remaining editable for user_id == 1 */}
              <div className="flex flex-wrap gap-2 items-center">
                <label className="font-medium text-gray-900">
                  Chargeable Value
                </label>
                <input
                  type="number"
                  name="chargeableValue"
                  value={formData.chargeableValue}
                  onChange={handleChange}
                  className="w-24 border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("chargeableValue")}
                />
                <span className="text-gray-900 font-medium">+ GST</span>
                <input
                  type="number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  className="w-24 border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("gst")}
                />
                <span className="text-gray-900 font-medium">=</span>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  className="w-24 border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("total")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-900">
                    Advance Paid
                  </label>
                  <input
                    type="number"
                    name="advancePaid"
                    value={formData.advancePaid}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-gray-800"
                    disabled={!canEditField("advancePaid")}
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-900">
                    Balance Due
                  </label>
                  <input
                    type="number"
                    name="balanceDue"
                    value={formData.balanceDue}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-gray-800"
                    disabled={!canEditField("balanceDue")}
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-gray-900">
                  Mode of Payment
                </label>
                <input
                  type="text"
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-gray-800"
                  disabled={!canEditField("modeOfPayment")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-900">
                    Receiver Name
                  </label>
                  <input
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-gray-800"
                    disabled={!canEditField("receiverName")}
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-900">
                    Customer Signature
                  </label>
                  <input
                    type="text"
                    name="customerSignature"
                    value={formData.customerSignature}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-gray-800"
                    disabled={!canEditField("customerSignature")}
                  />
                </div>
              </div>
            </div>

            {mode !== "view" && (
              <div className="col-span-2 flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
                >
                  {loading
                    ? "Saving..."
                    : mode === "edit"
                    ? "Update Form"
                    : "Save Form"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default CreateForm;
