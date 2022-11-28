import { FC } from 'react';
import { Combobox, ComboboxOption, TextInput, ToggleWithIcon } from '../../elements/Forms';
import { useForm } from 'react-hook-form';
import { Product } from '../../types/types';


type IngredientTableProps = {
  ingredients: string[]
  products: Product[]
}

//
// <TableCell>Recipe Ingredient</TableCell>
// <TableCell>Grocy Product</TableCell>
// <TableCell>Quantity</TableCell>
// <TableCell>Use any unit</TableCell>
// <TableCell>Quantity Unit</TableCell>
// <TableCell>Create Product</TableCell>
// <TableCell>Confirm</TableCell>
// <TableCell>Ignore</TableCell>

const productMapper = (product: Product): ComboboxOption => ({key: product.id, label: product.name})

export const IngredientTable: FC<IngredientTableProps> = ({ingredients, products}) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Recipe Ingredient
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              Grocy Product
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
            >
              Quantity
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Use any unit
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Quantity Unit
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Create Product</span>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Ignore</span>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Confirm</span>
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
          {ingredients.map((ingredient) => (
            <IngredientTableRow ingredient={ingredient}/>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type IngredientTableRowProps = {
  ingredient: string
  products: Product[]
}

const IngredientTableRow: FC<IngredientTableRowProps> = ({ingredient, products}) => {

  type IngredientRowForm = {
    quantity: string
  }

  const quantity = ingredient.match(/^\d+/) || ""

  const {register} = useForm<IngredientRowForm>()

  return (
    <tr key={ingredient}>
      <td className='w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6'>
        {ingredient}
      </td>
      <td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
        <Combobox showLabel={false} label="Product" options={(products || []).map(productMapper)}/>
      </td>
      <td className='hidden px-3 py-4 text-sm text-gray-500 sm:table-cell'>
        <TextInput label="Quantity" showLabel={false} inputProps={register('quantity')}/>
      </td>
      <td className='px-3 py-4 text-sm text-gray-500'>
        <ToggleWithIcon />
      </td>
      <td className='px-3 py-4 text-sm text-gray-500'>
        {ingredient}
      </td>
      <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
        <a href='#' className='text-indigo-600 hover:text-indigo-900'>
          Create Product<span className='sr-only'>, {ingredient}</span>
        </a>
      </td>
      <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
        <a href='#' className='text-indigo-600 hover:text-indigo-900'>
          Confirm<span className='sr-only'>, {ingredient}</span>
        </a>
      </td>
      <td className='py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
        <a href='#' className='text-indigo-600 hover:text-indigo-900'>
          Ignore<span className='sr-only'>, {ingredient}</span>
        </a>
      </td>
    </tr>
  );
}
