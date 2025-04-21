import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Register } from './pages/FormAuth/Register/Register';
import { Login } from './pages/FormAuth/Login/Login';
import { LandingPage } from './Layout/LandingPage/LandingPage';
import { StepperParent } from './pages/UserDetails/StepperParent';
import { Layout } from './Layout/UserLayout/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Transactions } from './pages/UserPages/Transactions';
import { Reports } from './pages/UserPages/Report';
import { Payment } from './pages/UserPages/Payment';
import { OnboardingGuard } from './components/onboardingGuard';
import { Suspense } from 'react';
import { ContextProvider } from './context/index';
//https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },

      {
        path: '/user/:id',
        element: <Layout />,
        children: [
          {
            path: '/user/:id/profile',
            element: <StepperParent />,
          },
          {
            path: '/user/:id',
            element: <OnboardingGuard />,
            children: [
              { path: '/user/:id/dashboard', element: <div> dashboarrd</div> },
              { path: '/user/:id/transactions', element: <Transactions /> },
              { path: '/user/:id/reports', element: <Reports /> },
              { path: '/user/:id/payments', element: <Payment /> },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
]);
const App = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </Suspense>
  );
};

export default App;
