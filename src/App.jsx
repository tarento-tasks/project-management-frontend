

import { RecoilRoot } from 'recoil';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <RecoilRoot>
      <AppRoutes />
    </RecoilRoot>
  );
};

export default App;