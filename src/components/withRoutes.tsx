import React from 'react';
import { useLocation } from 'react-router-dom';

interface WithRouterProps {
  location: Location,
  children?: React.ReactNode,
}

/**
 * HOC component adding router to class components. Copied from https://reactrouter.com/docs/en/v6/faq#what-happened-to-withrouter-i-need-it.
 *
 * @param {*} Component Component in need of router.
 * @returns Component with "location" prop.
 */
export default function withRouter<T extends WithRouterProps>(Component: React.ComponentType<T>) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();

    return (
      <Component
        {...props}
        location={location.pathname}
      />
    );
  }

  return ComponentWithRouterProp;
}
