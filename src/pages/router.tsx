import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { AuthGuard, OnboardingGuard } from 'components';
import { Layout } from 'Layout';

const LandingPage = lazy(() => import('Layout').then(module => ({ default: module.LandingPage })));
const Register = lazy(() => import('Pages').then(module => ({ default: module.Register })));
const Login = lazy(() => import('Pages').then(module => ({ default: module.Login })));
const StepperParent = lazy(() =>
  import('Pages').then(module => ({
    default: module.StepperParent,
  })),
);
const Overview = lazy(() => import('Pages').then(module => ({ default: module.Overview })));
const Transactions = lazy(() => import('Pages').then(module => ({ default: module.Transactions })));
const Reports = lazy(() => import('Pages').then(module => ({ default: module.Reports })));
const Payment = lazy(() => import('Pages').then(module => ({ default: module.Payment })));
const PageNotFound = lazy(() => import('Pages').then(module => ({ default: module.PageNotFound })));

export const router = createBrowserRouter([
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
              { path: '/user/:id/dashboard', element: <Overview /> },
              { path: '/user/:id/transactions', element: <Transactions /> },
              { path: '/user/:id/reports', element: <Reports /> },
              { path: '/user/:id/payments', element: <Payment /> },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]);
