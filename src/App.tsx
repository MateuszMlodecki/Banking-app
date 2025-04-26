import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { ContextProvider } from 'context';
import { router } from 'Pages';
import { Loader } from 'components';
import './App.css';

const App = () => {
  return (
    <Suspense fallback={<Loader isLoading={true} />}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </Suspense>
  );
};

export default App;
