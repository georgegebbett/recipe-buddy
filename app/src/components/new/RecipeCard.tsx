import { FC } from 'react';
import { Recipe } from '../../types/types';
import { Link } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useApiFetch } from '../../hooks/useApiClient';
import { fetchWithOK } from '../../lib/fetch';
import { useFromTaskEither } from '../../hooks/useAsync';

type RecipeCardProps = {
  recipe: Recipe
}

export const RecipeCard: FC<RecipeCardProps> = ({recipe}) => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
    <div className="px-4 py-5 sm:px-6">
      {recipe.name}
  </div>
  <div className="px-4 py-5 sm:p-6">
    <img
      src={recipe.imageUrl}
    />
  </div>
    <div className="px-4 py-4 sm:px-6">
    {/*<Link to={`/recipes/${recipe._id}`}>Add to Grocy</Link>*/}
    {/*<button>Delete</button>*/}


    </div>
  </div>
)
}


export const RecipeCard2: FC<RecipeCardProps>  = ({ recipe }) => {

  const api = useApiFetch(fetchWithOK)
  const {status, execute} = useFromTaskEither(api)

  const handleDelete = (id: string) => execute(`recipes/${id}`, {method: "DELETE"})

  return (

        <li
          key={recipe._id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={recipe.imageUrl} alt="" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{recipe.name}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              {/*<dd className="text-sm text-gray-500">{person.title}</dd>*/}
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                {/*<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">*/}
                {/*  {person.role}*/}
                {/*</span>*/}
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  to={`/recipes/${recipe._id}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Add to Grocy</span>
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </li>

  )
}

