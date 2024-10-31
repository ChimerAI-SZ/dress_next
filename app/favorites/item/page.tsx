'use client'

// 引用组件
import Header from '../components/Header'

const Customer = () => {
  const handleAddFavourites = () => {}

  return (
    <div>
      <Header name="Like" addBtnvisible={true} handleAddFavourites={handleAddFavourites} />
    </div>
  )
}

export default Customer
