import React, { useEffect, useState } from 'react'
import './Popular.css'
// import data_product from '../assets/data'
import Item from '../Item/Item'
const Popular = () => {


    const [popular,setPopular] = useState([]);

    useEffect(()=>{
       fetch('http://localhost:4000/popularinwomen')
       .then((response)=>response.json())
       .then((data)=>{setPopular(data)})
    },[])

    return (
        <div className='popular'>
            <h1>POPULAR in WOMEN</h1>
            <hr />
            <div className='popular-item'>
                {popular.map((item, index) => {
                    return <Item key={index} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>
        </div>
    )
}

export default Popular;