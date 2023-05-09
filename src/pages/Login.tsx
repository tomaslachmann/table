import { useState, useEffect } from 'react';
import { useAuthenticationContext } from '../contexts/Authentication';
import { ButtonVariant, UserPrompt } from '../types';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Modal from '../components/Modal';
import { users } from '../data';
import Button from '../components/Button';

export default function Login(){
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuthenticationContext();

  const [ user, setUser ] = useState<UserPrompt>({});
  const [ isOpen, setOpen ] = useState(false);

  useEffect(() => {
    if(isAuthenticated()){
      navigate('/home');
    }
  }, [ isAuthenticated, navigate ]);

  function handleEmail(val: string | number){
    const email = String(val);
    setUser({ ...user, email });
  }

  function handlePassword(val: string | number){
    const password = String(val);
    setUser({ ...user, password });
  }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    signIn(user);
  }

  return(
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
      {
        isOpen && <Modal setOpen={setOpen}>
          {
            users.map(user => {
              return(
                <div key={user.uuid} className="dark:text-gray-300">
                  <p>email: {user.email}</p>
                  <p>password: {user.password}</p>
                  <p>role: {user.role}</p>
                </div>
              )
            })
          }
        </Modal>
      }
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="text-2x font-bold mb-2 text-gray-900 md:text-2xl dark:text-gray-300">Builtmind</h1>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-700 dark:border-gray-600">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-gray-300">
                  Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6 dark:bg-gray-700" action="#" onSubmit={handleSubmit}>
              <FormInput<string> value={user.email} wrapperClassName='relative w-full' id='emlljk' placeHolder='email' onChange={handleEmail} type='email' label='email' />
              <FormInput<string> value={user.password} wrapperClassName='relative w-full' id='pswdlkj' placeHolder='password' onChange={handlePassword} type='password' label='password' />
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-sky-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-sky-600 dark:ring-offset-gray-800" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <button onClick={() => setOpen(true)} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</button>
              </div>
              <Button style={{ width: '100%' }} type={ButtonVariant.success}><p className="w-full text-center">Sign in</p></Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}