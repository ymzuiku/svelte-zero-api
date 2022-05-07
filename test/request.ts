import { BadRequest, Accepted, Ok, InternalError, SvelteErrorResponse } from '../http'
import { API, f, querySpread } from '../lib'
import { RequestParams, ResponseBody } from '../lib/types'

// * 0. You have some product somewhere
class Product {
	id: string
	itemName: string
	price: number
	
	constructor(obj: { id: string, itemName: string, price: number }) {
		this.id = obj.id
		this.itemName = obj.itemName
		this.price = obj.price
	}

	static test = [
		new Product({ id: '0', itemName: 'Beer',   price: 5 }),
		new Product({ id: '1', itemName: 'Coffee', price: 3 }),
		new Product({ id: '2', itemName: 'Milk',   price: 2 }),
		new Product({ id: '3', itemName: 'Water',  price: 1 }),
		new Product({ id: '4', itemName: 'Cake',   price: 10 }),
		new Product({ id: '5', itemName: 'Pizza',  price: 15 }),
		new Product({ id: '6', itemName: 'Donut',  price: 5 })
	]

	// Simulated fetch from some database
	static async getAll(): Promise<Product[]> {
		return await new Promise(resolve => setTimeout(() => {
			resolve(this.test)
		}, 125))
	}
}



// * 1. The endpoint is defined

interface Get {
	query?: {
		itemName?: string,
		minPrice?: number,
		someObj?: {
			test: number,
			name: string
		}
	}
}

const get = async (requestEvent: API<Get>) => {
	const { searchParams } = requestEvent.url
	
	const { itemName, minPrice, someObj } = querySpread(searchParams)

	let products = await Product.getAll()
	if (!itemName && !minPrice)
		return Ok({ body: { documents: products } })

	if (itemName)
		products = products.filter(product => product.itemName.includes(itemName))
	if (minPrice)
		products = products.filter(product => product.price >= Number(minPrice))

	if (products.length > 1)
		return Ok({ body: { documents: products } })
	
	if (products.length == 1)
		return Accepted({ body: products[0] })
	
	return BadRequest({ error: 'Your message did not go through.' })
}

// * 2. Generated stuff

const _api = {
	products: f({ get })
}

import { createZeroApi } from '..'
// Creating API entry-point to routes and exporting it below
const api = createZeroApi<typeof _api>({
	// Deal with Error
	onError: async (err) => console.error('[API]', err),

	prependCallbacks: (prepend) => prepend.serverError(res => console.error(res.body))
});



// * 3. Usage

let products: ResponseBody<typeof api.products.get, 200>['documents']
let product: ResponseBody<typeof api.products.get, 202>

let params: RequestParams<typeof api.products.get> = {}

// Old - Unknown (bad - what if it's an error response that has a body?)
let productsV1 = (await api.products.get({})).body

// New

// With error handling
// import { errorCallback } from '$pages/root'
const errorCallback = (response: SvelteErrorResponse) => { /** Show UI element: Error */ }

// One-liner
let productsV2 = await api.products.get().$.accepted(r => r.body)

// Error handling
let productsV3 = await api.products.get()
	.error(errorCallback)
	.$.ok(r => r.body)

let response = await api.products.get().$.ok(r => r.body)

let error = await api.products.get().$.badRequest(r => r.body)