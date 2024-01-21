import ListProduct from '@/components/ListProduct';
import React from 'react'

interface ProductByCategoryPageProps {
  params: {
    categoryId: string;
  }
}

const ProductByCategoryPage = (props: ProductByCategoryPageProps) => {
  return (
    <ListProduct categoryId={props.params.categoryId} />
  )
}

export default ProductByCategoryPage