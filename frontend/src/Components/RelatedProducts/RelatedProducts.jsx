import React from 'react'
import './RelatedProducts.css'
// import data_product from '../assets/data'
import { useState,useEffect } from 'react'
import Item from '../Item/Item'

const RelatedProducts = () => {
  const [relatedProduct,setRealatedProducts] = useState([]);

  useEffect(()=>{
       //Connection String
     fetch('https://trendy-cart-backend.vercel.app/relatedproducts')
     .then((response)=>response.json())
     .then((data)=>{setRealatedProducts(data)})
  },[])

  return (
    <div className='relatedproducts'>
          <h1>Related Products</h1>
          <hr />
          <div className='relatedproducts-item'>
             {relatedProduct.map((item,index)=>{
                    return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price ={item.old_price} />
             })}
          </div>
    </div>
  )
}

export default RelatedProducts
