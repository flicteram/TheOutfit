import styles from '../styles/Product.module.css'
import {useState} from 'react'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Product({data,length}){
    const [numberPosts,setNumberPosts]=useState(16)
    const [hasMore,setHasMore]=useState(true)

    function getMorePosts(){
        if(length>numberPosts){
            setNumberPosts(numberPosts+=16)
        }
        else if(length<numberPosts){
            setHasMore(false)
         }
    }

    return (
        <InfiniteScroll
        dataLength={data.slice(0,numberPosts).length}
        next={getMorePosts}
        hasMore={hasMore}
        >
        <div className={styles.container}>
        {data.slice(0,numberPosts).map((item,index)=>(
            <div key={item.productId} className={styles.productContainer}>
                <Image priority={index<17?true:false} src={item.imageURL} width={'90px'} height={'100%'} layout='responsive'/>
                <h3 className={styles.productName}>{item.name}</h3>
                <ul className={styles.sizes}>
                    {!item.availableStock.length&&!item.warehouseStock.length
                    ?
                    <p>OUT OF STOCK!</p>
                    :
                    [...new Set([...item.availableStock.map(item=>item.size),...item.warehouseStock.map(item=>item.size)])].map(item=>
                    <li key={item} className={styles.size}>{item}</li>)}
                </ul>
                <p className={styles.price}>{`${item.price} lei`}</p>
            </div>
        )
        )}
        </div>
        </InfiniteScroll>
    
    )

}

