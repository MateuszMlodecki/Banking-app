import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { AuthGuard, OnboardingGuard } from 'components';
import { Layout } from 'Layout';
import CardManagement from './UserPages/Cards/CardManagement/CardManagement';

const LandingPage = lazy(() => import('Layout/LandingPage/LandingPage'));
const Register = lazy(() => import('Pages/FormAuth/Register/Register'));
const Login = lazy(() => import('Pages/FormAuth/Login/Login'));
const StepperParent = lazy(() => import('Pages/ProfileDetails/StepperParent'));

const Overview = lazy(() => import('Pages/UserPages/Overview/Overview'));
const Transactions = lazy(() => import('Pages/UserPages/Transactions'));
const Reports = lazy(() => import('Pages/UserPages/Report/Report'));
const Payment = lazy(() => import('Pages/UserPages/Payment/Payment'));
const PageNotFound = lazy(() => import('Pages/PageNotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      {
        path: 'user/:id',
        element: <Layout />,
        children: [
          { path: 'profile', element: <StepperParent /> },

          {
            element: <OnboardingGuard />,
            children: [
              { path: 'dashboard', element: <Overview /> },
              { path: 'transactions', element: <Transactions /> },
              { path: 'reports', element: <Reports /> },
              { path: 'payments', element: <Payment /> },
              { path: 'cards', element: <CardManagement /> },
            ],
          },
        ],
      },
      { path: '*', element: <PageNotFound /> },
    ],
  },
]);
