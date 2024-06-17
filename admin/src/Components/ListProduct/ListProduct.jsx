import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const Listproduct = () => {


  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((response) => response.json())
      .then((data) => { setAllProducts(data) })
  }


  const remove_product = async (removeid,removename) => {
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: removeid }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.success?alert(`Product : ${removename} has been successfully removed`):alert("Failed to Remove the Product");
      })

    await fetchInfo();
  }



  useEffect(() => {
    fetchInfo();
  }, [])






  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p className='listproduct-product-description'>Short Description</p>
        <p className='listproduct-product-description'>Long Description</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div key={index} className='listproduct-format-main listproduct-format'>
                <img src={product.image} alt="" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>{product.old_price}</p>
                <p>{product.new_price}</p>
                <p>{product.category}</p>
                <p className='listproduct-product-description'>{product.description_short}</p>
                <p className='listproduct-product-description'>{product.description_long}</p>
                <img onClick={() => { remove_product(product.id,product.name) }} className='listproduct-remove-icon' src={cross_icon} alt="" />
              </div>
              <hr />
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Listproduct