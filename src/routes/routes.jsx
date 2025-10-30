import Login from "../pages/auth/login";
import SetPassword from "../pages/auth/setpassword";
import Dashboard from "../pages/dashboard/dashboard";
import CreateForm from "../pages/forms/createform";
import ViewForms from "../pages/forms/viewForms";
import Onboarding from "../pages/onBoarding/onboard";


const routes = [
  {
    path: "/login",
    element: <Login />,
  },
    {
    path: "/set-password", // 👈 route for email invite links
    element: <SetPassword />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    header:true,
  },
   {
    path: "/onboard",
    element: <Onboarding />,
    header:true,
  },{
    path: "/create-form",
    element: <CreateForm />,
    header:true,
  },
  {
    path: "/view-form",
    element: <ViewForms />,
    header:true,
  },
];

export default routes;
