import { Outlet } from 'react-router-dom';
import { DefaultHeader } from '@/components/layout/DefaultHeader';
import { DefaultFooter } from '@/components/layout/DefaultFooter';

export function DefaultLayout() {
  return (
    <div id="wrap">
      <DefaultHeader />
      <Outlet />
      <DefaultFooter />
    </div>
  );
}
