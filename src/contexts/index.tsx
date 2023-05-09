import AuthenticationProvider from './Authentication';
import DarkModeProvider from './Theme';

export * from './Authentication';
export * from './Theme';

interface ContextProps {
  children: React.ReactNode;
}


function CombinedContext({ children }: ContextProps){
  return(
    <DarkModeProvider>
      <AuthenticationProvider>
        { children }
      </AuthenticationProvider>
    </DarkModeProvider>
  );
}

export default CombinedContext;