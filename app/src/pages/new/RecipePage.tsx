import { FC, useEffect } from 'react';
import { useApiFetch } from '../../hooks/useApiClient';
import { fetchAndCast, fetchParsedJSON } from '../../lib/fetch';
import { Recipe } from '../../types/types';
import { useFromTaskEither } from '../../hooks/useAsync';
import { pipe } from 'fp-ts/lib/function';
import { refreshFold } from '@nll/datum/DatumEither';
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import { RecipeEmptyState } from '../../components/new/RecipeEmptyState';
import { RecipeCard, RecipeCard2 } from '../../components/new/RecipeCard';

export const RecipePage: FC = () => {

  const api = useApiFetch(fetchAndCast<Recipe[]>())
  const {status, execute} = useFromTaskEither(api)

  useEffect(() => {execute('recipes')}, [])

  return pipe(
    status,
    refreshFold(
      () => null,
      () => null,
      () => null,
      (a) => <RecipeHandler recipes={a}/>,
    )
  )

}

const RecipeHandler: FC<{recipes: Recipe[]}> = ({ recipes }) => {
  return pipe(
    recipes,
    O.fromPredicate(A.isNonEmpty),
    O.fold(
      () => <RecipeEmptyState/>,
      a => <RecipeDisplay recipes={a}/>
    )
  )
}

const RecipeDisplay: FC<{recipes: NEA.NonEmptyArray<Recipe>}> = ({recipes}) => {
  return (
    <>
      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      {recipes.map(a => <RecipeCard2 recipe={a}/>)}
      </ul>
    </>
  )
}
