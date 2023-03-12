// This is the place where React code is bootstrapped (activated)
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { MainView } from './components/main-view/main-view.jsx';

// Import statement to indicate that you need to bundle `./index.scss`
import './index.scss';

const MovieMateApplication = function () {
  return (
    <>
      <ToastContainer />
      <MainView />
    </>
  );
};

// Finds the root of your app
const container = document.querySelector('#root');
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<MovieMateApplication />);
