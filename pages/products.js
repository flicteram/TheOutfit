import {useState} from 'react'
import styles from '../styles/Products.module.css'
import Product from '../Components/Product'
import FilterOption from '../Components/FilterOption'

export async function getStaticProps() {
    const res = await fetch(`https://www.theoutfit.ro/test-react/`)
    const data = await res.json()
  
    return {
      props: { data:data }
    }
  }


export default function Products({data}){
    const [price,setPrice]=useState('')
    
    const brands = [...new Set(data.map(item=>item.brand))]
    const category = [...new Set(data.map(item=>item.category))]

    const sizesStock = data.reduce((acc,currentVal)=>{
        if(currentVal.availableStock.length&&!acc.includes(...currentVal.availableStock.map(item=>item.size))){
            acc.push(...currentVal.availableStock.map(item=>item.size))
        }
        else if(currentVal.warehouseStock.length&&!acc.includes(currentVal.warehouseStock.map(item=>item.size))){
            acc.push(...currentVal.warehouseStock.map(item=>item.size))
        }
        return acc
    },[])

    const allSizes = [...new Set(sizesStock)]

    const [checkedBrand,setCheckedBrand]=useState(new Array(brands.length).fill(false))
    const [checkedCategory,setCheckedCategory]=useState(new Array(category.length).fill(false))
    const [checkedSize,setCheckedSize]=useState(new Array(allSizes.length).fill(false))

    const [brandsArray,setBrandsArray]=useState([])
    const [categoryArray,setCategoryArray]=useState([])
    const [sizeArray,setSizeArray]=useState([])


    if(price==='crescator'){
        data.sort((a,b)=>a.price-b.price)
    }
    else if(price==='descrescator'){
        data.sort((a,b)=>b.price-a.price)
    }
    
    function handleOnChange(position,checked,setCheckBoxState,setArrayState,initialArray){
        const updated = checked.map((item, index) =>
            index === position ? !item : item
          );
        setCheckBoxState(updated)
        setArrayState(updated.reduce((acc,currentVal,index)=>{
            if(currentVal===true){
                acc.push(initialArray[index])
            }
            return acc
        },[]))
    }

    function displayData(){
        if(brandsArray.length&&categoryArray.length&&sizeArray.length){
            return data.filter(item=>
                item.availableStock.some(item2=>sizeArray.includes(item2.size)
                    &&
                    brandsArray.includes(item.brand)
                    &&
                    categoryArray.includes(item.category)
                )
                ||
                item.warehouseStock.some(item2=>sizeArray.includes(item2.size)
                    &&
                    brandsArray.includes(item.brand)
                    &&
                    categoryArray.includes(item.category))
            )
        }
        else if(brandsArray.length&&categoryArray.length&&!sizeArray.length){
            return data.filter(item=>
                brandsArray.includes(item.brand)
                &&
                categoryArray.includes(item.category))
        }
        else if(brandsArray.length&&!categoryArray.length&&sizeArray.length){
            return data.filter(item=>
                item.availableStock.some(item2=>
                    sizeArray.includes(item2.size)
                    &&
                    brandsArray.includes(item.brand))
                ||
                item.warehouseStock.some(item2=>
                    sizeArray.includes(item2.size)
                    &&
                    brandsArray.includes(item.brand))
            )
        }
        else if(!brandsArray.length&&categoryArray.length&&sizeArray.length){
            return data.filter(item=>
                item.availableStock.some(item2=>
                    sizeArray.includes(item2.size)
                    &&
                    categoryArray.includes(item.category))
                ||
                item.warehouseStock.some(item2=>
                    sizeArray.includes(item2.size)
                    &&
                    categoryArray.includes(item.category))
            )
        }
        else if(brandsArray.length||categoryArray.length||sizeArray.length){
            return data.filter(item=>
                brandsArray.includes(item.brand)
                ||
                categoryArray.includes(item.category)
                ||
                item.availableStock.some(item2=>sizeArray.includes(item2.size))
                ||
                item.warehouseStock.some(item2=>sizeArray.includes(item2.size))
            )
        }
        else{
            return data
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.containerInner}>
            <select value={price} onChange={(e)=>setPrice(e.target.value)} className={styles.select}>
                <option value="" hidden>Filtreaza dupa pret</option>
                <option value='crescator'>Pret crescator</option>
                <option value='descrescator'>Pret descrescator</option>
            </select>
                <div>
                    <h4 className={styles.filterAfter}>Filtreaza dupa brand:</h4>
                    {brands.map((item,indexBrand)=>
                        <FilterOption
                            key={item}
                            value={item}
                            name={item}
                            checked={checkedBrand[indexBrand]}
                            onChange={()=>handleOnChange(indexBrand,checkedBrand,setCheckedBrand,setBrandsArray,brands)}
                        />
                    )}
                </div>
                <div>
                    <h4 className={styles.filterAfter}>Filtreaza dupa tip:</h4>
                    {category.map((item,indexCategory)=>
                        <FilterOption
                            key={item}
                            value={item}
                            name={item}
                            checked={checkedCategory[indexCategory]}
                            onChange={()=>handleOnChange(indexCategory,checkedCategory,setCheckedCategory,setCategoryArray,category)}
                        />)}
                </div>
                <div>
                    <h4 className={styles.filterAfter}>Filtreaza dupa marime:</h4>
                    {allSizes.map((item,indexSize)=>
                        <FilterOption
                            key={item}
                            value={item}
                            name={item}
                            checked={checkedSize[indexSize]}
                            onChange={()=>handleOnChange(indexSize,checkedSize,setCheckedSize,setSizeArray,allSizes)}
                        />
                    )}
                </div>
            </div>
            <Product data={displayData()} length={data.length}/>
        </div>
    )
}