import { FC } from 'react';
import { EmptyState } from '../../elements/EmptyState';

export const RecipeEmptyState: FC = () => {

  return <EmptyState
    heading="No recipes"
    text="There are no recipes, why not import one?"
    buttonText="Import recipe"
    onClick={() => undefined}
  />
}
