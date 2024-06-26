import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image, setImage] = useState(false);

    const [productDetails, setProductDetails] = useState({
        name: "",
        old_price: "",
        new_price: "",
        category: "women",
        description_short: "",
        description_long: "",
        image: "",
    })

    // const imageHandler = (event) => {
    //     setImage(event.target.files[0])
    // }

    const changeHandler = (event) => {
        setProductDetails({ ...productDetails, [event.target.name]: event.target.value });
    }

    const Add_Product = async () => {
        let responseData;
        let product = productDetails;

          await fetch('https://trendy-cart-backend.vercel.app/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
                credentials: 'include',
            }).then((response) => response.json()).then((data) => {

                data.success ? alert(`Product Added`) : alert("Failed");

            })

        

        // let formData = new FormData();
        // formData.append('product', image);
        // //Connection String
        // await fetch('https://trendy-cart-backend.vercel.app/upload', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //     },
        //     body: formData,
        //     credentials: 'include',
        // }).then((response) => response.json()).then((data) => {
        //     responseData = data;
        // })

        // if (responseData.success) {
        //     product.image = responseData.image_url;
        //     console.log(product);
        //      //Connection String
        //     await fetch('https://trendy-cart-backend.vercel.app/addproduct', {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(product),
        //         credentials: 'include',
        //     }).then((response) => response.json()).then((data) => {

        //         data.success ? alert(`Product Added`) : alert("Failed");
        //     })
        // }

    }

    return (
        <div className='add-product'>
            <div className='addproduct-itemfield'>
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
            </div>
            <div className='addproduct-price'>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type Here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type Here' />
                </div>

            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select name="category" value={productDetails.category} onChange={changeHandler} className='add-product-selector' >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Short Description</p>
                <textarea value={productDetails.description_short} onChange={changeHandler} name='description_short' placeholder='Type Here' />

                <p>Long Description</p>
                <textarea value={productDetails.description_long} onChange={changeHandler} name='description_long' placeholder='Type Here' />
            </div>
            <div className="addproduct-itemfield">
                <label > URL
{/*                     Logic to view the Image in the Upload Area Section */}
{/*                     <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumnail-img' /> */}
                </label>
                <input value={productDetails.image} onChange={changeHandler} type="text" name='image' placeholder='Type Here' id='file-input'  />
            </div>
            <button onClick={() => Add_Product()} className='addproduct-btn'>ADD</button>
        </div>
    )
}

export default AddProduct
