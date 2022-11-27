import { FC, useEffect } from 'react';
import { Logo } from '../../elements/elements';
import { useAuth } from '../../contexts/Auth';
import { useForm } from 'react-hook-form';

export const LoginPage: FC = () => {

  const {login} = useAuth()

  const {register, handleSubmit, getValues, formState} = useForm()

  type LoginFormInputs = {
    username: string
    password: string
  }

  useEffect(() => {
    console.log(formState.isValid)
  }, [formState])

  const submitAction = () => {
    const vals = getValues()

    console.log(vals);

    const user = vals.username
    const pw = vals.password

    return login(user, pw)
  }

  return(
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Logo
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit(submitAction)} >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      {...register('username', {required: true})}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      {...register('password', {required: true})}
                    />
                  </div>
                </div>


                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign in
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </>

  )
}
