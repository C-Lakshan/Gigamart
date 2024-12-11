import React from 'react'
import SectionHedding from './SectionsHeading/SectionHeading'
import Card from '../Card/Card';
//import Jeans from '../../assets/img/jeans.jpg'
import Carousel from 'react-multi-carousel';
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css';


const items = [{
    'title':'Asus ROG Strix G16 G614JIR- i9',
    imagePath:require('../../assets/img/Asus ROG Strix G16 G614JIR- i9.webp')
},{
    'title':'Lenovo IdeaPad Slim 3 15IRH8 – i7',
    imagePath:require('../../assets/img/Lenovo IdeaPad Slim 3 15IRH8 – i7.webp')
},{
    'title':'Hp Victus fb2132Ax Gaming – Ryzen 7',
    imagePath:require('../../assets/img/Hp Victus fb2132Ax Gaming – Ryzen 7.jpg')
},{
    'title':'Lenovo IdeaPad Slim 3 15IRH8 – i5',
    imagePath:require('../../assets/img/Lenovo IdeaPad Slim 3 15IRH8 – i5.webp')
},
{
    'title':'Lenovo IdeaPad 1 15IGL7 – Intel Celeron',
    imagePath:require('../../assets/img/Lenovo IdeaPad 1 15IGL7 – Intel Celeron.webp')
},
{
    'title':'Asus TUF A15 Gaming FA507NUR – Ryzen 7',
    imagePath:require('../../assets/img/Asus TUF A15 Gaming FA507NUR – Ryzen 7.jpg')
},
{
    'title':'Asus Vivobook Pro 15 Creator Q543MJ – Ultra9',
    imagePath:require('../../assets/img/Asus Vivobook Pro 15 Creator Q543MJ – Ultra9.webp')
},
{
    'title':'Lenovo Legion 9 Gaming 16IRX9 – i9',
    imagePath:require('../../assets/img/Lenovo Legion 9 Gaming 16IRX9 – i9.jpg')
},
{
    'title':'HP 15 fd0333TU – i5',
    imagePath:require('../../assets/img/HP 15 fd0333TU – i5.webp')
}
];

const NewArrivals = () => {
  return (
    <>
    <SectionHedding title={'New Arrivals'} />
    <Carousel
        responsive={responsive}
        autoPlay={false}
        swipeable={true}
        draggable={false}
        showDots={false}
        infinite={false}
        partialVisible={false}
        itemClass={'react-slider-custom-item'}
        className='px-8'
    >
            {items && items?.map((item,index)=> <Card key={item?.title +index} title={item.title} imagePath={item.imagePath}/>)}
        </Carousel>
    </>
  )
} 

export default NewArrivals