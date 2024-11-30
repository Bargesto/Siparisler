import { useState, useEffect } from 'react'
import { Product, Order } from '../types'
import { Download, Plus, Trash } from 'lucide-react'
import * as XLSX from 'xlsx'

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    image: '',
    price: 0,
    sizes: [{ name: '', stock: 0 }]
  })

  useEffect(() => {
    const storedProducts = localStorage.getItem('products')
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  const handleAddSize = () => {
    setNewProduct({
      ...newProduct,
      sizes: [...newProduct.sizes, { name: '', stock: 0 }]
    })
  }

  const handleRemoveSize = (index: number) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.filter((_, i) => i !== index)
    })
  }

  const handleSizeChange = (index: number, field: 'name' | 'stock', value: string | number) => {
    const updatedSizes = newProduct.sizes.map((size, i) => {
      if (i === index) {
        return { ...size, [field]: value }
      }
      return size
    })
    setNewProduct({ ...newProduct, sizes: updatedSizes })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const productToSave = {
      ...newProduct,
      id: Date.now().toString()
    }
    const updatedProducts = [...products, productToSave]
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
    setNewProduct({
      id: '',
      name: '',
      image: '',
      price: 0,
      sizes: [{ name: '', stock: 0 }]
    })
  }

  const exportOrders = () => {
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]')
    const ws = XLSX.utils.json_to_sheet(orders)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Siparişler')
    XLSX.writeFile(wb, 'siparisler.xlsx')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={exportOrders}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Download size={20} />
          Siparişleri İndir
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Adı
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görsel URL
            </label>
            <input
              type="url"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat
            </label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              className="w-full border rounded-lg p-2"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedenler ve Stok
            </label>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                  placeholder="Beden"
                  className="flex-1 border rounded-lg p-2"
                  required
                />
                <input
                  type="number"
                  value={size.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', Number(e.target.value))}
                  placeholder="Stok"
                  className="flex-1 border rounded-lg p-2"
                  required
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSize}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus size={20} />
              Beden Ekle
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Ürünü Kaydet
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminPanel