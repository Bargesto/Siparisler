import { useState } from 'react'
import { Product, Order } from '../types'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)

  const handleOrder = () => {
    if (!selectedSize || !instagramUsername) {
      alert('Lütfen beden ve Instagram kullanıcı adınızı giriniz')
      return
    }

    const order: Order = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      instagramUsername,
      orderDate: new Date().toISOString(),
    }

    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Update stock
    const products = JSON.parse(localStorage.getItem('products') || '[]')
    const updatedProducts = products.map((p: Product) => {
      if (p.id === product.id) {
        return {
          ...p,
          sizes: p.sizes.map(s => {
            if (s.name === selectedSize) {
              return { ...s, stock: s.stock - 1 }
            }
            return s
          })
        }
      }
      return p
    })
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    alert('Siparişiniz alınmıştır!')
    setIsOrdering(false)
    setSelectedSize('')
    setInstagramUsername('')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-lg font-bold text-gray-900 mb-2">
          {product.price.toLocaleString('tr-TR')} ₺
        </p>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mevcut Bedenler:</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <span 
                key={size.name}
                className="text-sm bg-gray-100 px-2 py-1 rounded"
              >
                {size.name} ({size.stock})
              </span>
            ))}
          </div>
        </div>

        {!isOrdering ? (
          <button
            onClick={() => setIsOrdering(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Sipariş Ver
          </button>
        ) : (
          <div className="space-y-3">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Beden Seçin</option>
              {product.sizes.map((size) => (
                <option key={size.name} value={size.name} disabled={size.stock === 0}>
                  {size.name} ({size.stock} adet)
                </option>
              ))}
            </select>
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              placeholder="Instagram kullanıcı adınız"
              className="w-full border rounded-lg p-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleOrder}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Onayla
              </button>
              <button
                onClick={() => setIsOrdering(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard