import prismadb from '@/lib/prismadb'
import React from 'react'
import { ProductForm } from './components/product-form';

const ProductPage = async ({
    params
}: {
    params: Promise<{ productId: string, storeId: string }> 
}) => {
    const { productId, storeId} = await params;
    
    const product = await prismadb.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: true,
        }
    });

    const categories = await prismadb.category.findMany({
        where: {
            storeId
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId
        }
    });

    const colors = await prismadb.color.findMany({
        where: {
            storeId
        }
    });

    const serializedProduct = product
    ? {
            ...product,
            price: parseFloat(product.price.toString()),
    }
    : null;

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm 
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                    initialData={serializedProduct} />
            </div>
        </div>
    )
}

export default ProductPage;