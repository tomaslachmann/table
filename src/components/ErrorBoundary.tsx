import React from 'react';
import AccessDeniedError from '../errors/AccessDeniedError';
import HttpStatusError from '../errors/HttpStatusError';
import NetworkError from '../errors/NetworkError';
import withRouter from './withRoutes';

function ErrorContent({ titleKey, textKey = '', children }: { titleKey: string, textKey: string, children: JSX.Element | JSX.Element[] | null }) {

  return(
    <div className='dark:bg-gray-800 bg-white shadow-md rounded-xl px-40 dark:text-slate-300 box-border py-10'>
      <div className="text-center mb-3 dark:text-slate-100 text-4xl font-bold">
        <h1>{titleKey}</h1>
      </div>
      <div className="container">
        <div className='text-lg text-center mx-auto'>
          <div role="alert" className={'alert alert-danger ' + (children ? 'mb-4' : 'mb-0')}>

            <h2 className="alert-heading">{titleKey}</h2>

            <p className="small mb-0">{textKey}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

type State = {
  error?: Error;
  hasError: boolean;
};

type Props = {
  children: React.ReactNode;
  location: any;
};

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any, errorInfo: any) {
    return { hasError: true, error, errorInfo };
  }

  componentDidCatch(error: Error): void {
    this.setState({ error, hasError: true });
  }

  componentDidUpdate(prevProps: any) {
    if (this.props?.location !== prevProps?.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    if (!this.state.hasError) {
      this.setState({ error: undefined });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.state.error instanceof HttpStatusError) {
      const titleKey = `status: ${this.state.error.httpStatus}`;
      const textKey = `message: ${this.state.error.httpStatus}`;

      return <ErrorContent titleKey={titleKey} textKey={textKey} children={null} />;

    } else if (this.state.error instanceof NetworkError) {
      const titleKey = 'Something went wrong!';
      const textKey = 'Try again later.';

      return <ErrorContent titleKey={titleKey} textKey={textKey} children={null} />;

    } else if (this.state.error instanceof AccessDeniedError) {
      const titleKey = 'Access denied!';
      const textKey = 'Try contact support.';

      return <ErrorContent titleKey={titleKey} textKey={textKey} children={null} />;

    } else {
      const titleKey = 'Something went wrong!';
      const textKey = 'Try again later.';

      return <ErrorContent titleKey={titleKey} textKey={textKey} children={null} />;
    }
  }
}
//@ts-ignore
export default withRouter(ErrorBoundary);
