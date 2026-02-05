import { createSlice } from '@reduxjs/toolkit';

const CART_NAME = 'DDONG_QUICK_CART_ONE';

export type CartItem = {
	uniqueId: string;
	id: string;
	_id: string;
	name: string;
	price: number;
	unitPrice: number;
	vat: number;
	image?: string;
	qty: number;
	// Variation-specific fields
	selectedSize?: string;
	selectedColor?: string;
	variationId?: string;
	variantStock?: number;
	variantName?: string;
	variantId?: string;
};

export type Address = {
	name: string;
	phone: string;
	email: string;
	street: string;
	city: string;
	country?: string;
	state?: string;
	postalCode: string;
};

type State = {
	cartItems: CartItem[];
	totalItems?: number;
	subTotal: number;
	total: number;
	tax: number;
	isLoading: boolean;
	vat: number;
	shipping: number;
	discount: number;
	user: string;
	address: any;
	isAddressSet: boolean;
	toggleCart: boolean;
};

const tax = 0;

const initialState: State = {
	cartItems: [],
	totalItems: 0,
	subTotal: 0,
	total: 0,
	tax: tax,
	isLoading: false,
	vat: 0,
	shipping: 0,
	discount: 0,
	user: 'guest',
	address: {},
	isAddressSet: false,
	toggleCart: false,
};

// Helper function to save state to local storage
const saveStateToNowLocalStorage = (state: typeof initialState) => {
	typeof window !== 'undefined' && localStorage.setItem(CART_NAME, JSON.stringify(state));
};

// Helper function to calculate totals
const calculateNowTotals = (state: State) => {
	state.subTotal = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		return total + cartItem.price * cartItem.qty;
	}, 0);

	state.vat = state.cartItems.reduce((total: number, cartItem: CartItem) => {
		if (cartItem.vat) {
			return total + ((cartItem.price * cartItem.vat) / 100) * cartItem.qty;
		}
		return total; // Fixed to remove unnecessary else block
	}, 0);

	state.total = state.subTotal + state.vat + state.shipping - state.discount;
	state.totalItems = state.cartItems.reduce((total, item) => total + item.qty, 0);
};

export const buyNowSlice = createSlice({
	name: 'buyNow',
	initialState:
		typeof window !== 'undefined' && localStorage.getItem(CART_NAME)
			? JSON.parse(localStorage.getItem(CART_NAME)!)
			: initialState,
	reducers: {
		calculateNowCartTotals: (state, action) => {
			const { subTotal = 0, total = 0, vat = 0, discount = 0, shipping = 0 } = action.payload;
			state.subTotal = subTotal;
			state.total = total;
			state.vat = vat;
			state.total = total;
			state.total = total;
			state.discount = discount;
			state.shipping = shipping;
			saveStateToNowLocalStorage(state);
		},

		addToNowCart: (state, action) => {
			const { item, qty = 1 } = action.payload;
			if (qty <= 0) return;

			// Create unique ID based on product and variation
			const baseId = item?._id || item?.id;
			const variationPart =
				item.variationId || `${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
			const uniqueId = `${baseId}-${variationPart}`;

			// Check stock if variation has stock info
			const availableStock = item.variantStock || item.stock || Infinity;
			if (availableStock < qty) {
				console.warn('Insufficient stock for item:', item.name);
				return;
			}

			const existItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (existItem) {
				const updatedQty = Number(existItem.qty) + Number(qty);

				// Check stock for updated quantity
				if (availableStock < updatedQty) {
					console.warn('Insufficient stock for updated quantity:', item.name);
					return;
				}

				const updatedPrice = existItem.unitPrice * updatedQty;

				state.cartItems = state.cartItems.map((stateItem: CartItem) =>
					stateItem.uniqueId === uniqueId
						? {
								...stateItem,
								qty: updatedQty,
								price: updatedPrice,
						  }
						: stateItem
				);
			} else {
				const newItem: CartItem = {
					uniqueId: uniqueId,
					_id: item._id || item.id,
					id: item.id || item._id,
					name: item.name,
					price: item.price * qty,
					unitPrice: item.price,
					vat: item.vat || 0,
					qty: qty,
					image: item.image,
					// Variation-specific fields
					selectedSize: item.selectedSize,
					selectedColor: item.selectedColor,
					variationId: item.variationId,
					variantStock: item.variantStock || item.stock,
					variantName:
						item.selectedSize && item.selectedColor
							? `${item.selectedSize} / ${item.selectedColor}`
							: item.selectedSize || item.selectedColor || '',
					variantId: item.variationId,
				};

				state.cartItems = [...state.cartItems, newItem];
			}

			state.toggleCart = true; // Show cart when item is added
			calculateNowTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToNowLocalStorage({ toggleCart: false, ...stt });
		},

		setNowAddress: (state, action) => {
			state.address = action.payload;
			state.isAddressSet = true;
		},

		setNowToggleCart: (state, action) => {
			state.toggleCart = action.payload;
		},

		removeNowAddress: state => {
			state.address = {};
			state.isAddressSet = false;
		},

		deleteOneFromNowCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);

			if (findItem) {
				if (findItem.qty > 1) {
					state.cartItems = state.cartItems.map((stateItem: CartItem) =>
						stateItem.uniqueId === uniqueId
							? {
									...stateItem,
									qty: stateItem.qty - 1,
									price: stateItem.unitPrice * (stateItem.qty - 1),
							  }
							: stateItem
					);
				} else {
					// Remove item if qty is 1
					state.cartItems = state.cartItems.filter(
						(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
					);
				}

				if (state.cartItems.length === 0) {
					state.totalItems = 0;
					state.subTotal = 0;
					state.total = 0;
					state.vat = 0;
					state.shipping = 0;
					state.discount = 0;
				}
			}

			calculateNowTotals(state);
			const { toggleCart, ...stt } = state;
			saveStateToNowLocalStorage({ toggleCart: false, ...stt });
		},
		/******  674052a1-d31f-48f3-80e2-5814cfb5bbd3  *******/

		deleteSingleItemNowFromCart: (state, action) => {
			const uniqueId = action.payload; // Now expects uniqueId instead of just _id
			const findItem = state.cartItems.find(
				(stateItem: CartItem) => stateItem.uniqueId === uniqueId
			);
			if (findItem) {
				state.cartItems = state.cartItems.filter(
					(stateItem: CartItem) => stateItem.uniqueId !== uniqueId
				);
			}
			if (state.cartItems.length === 0) {
				state.totalItems = 0;
				state.subTotal = 0;
				state.total = 0;
				state.vat = 0;
				state.shipping = 0;
				state.discount = 0;
			}
			calculateNowTotals(state);
			saveStateToNowLocalStorage(state);
		},

		deleteAllFromNowCart: state => {
			state.cartItems = [];
			state.totalItems = 0;
			state.subTotal = 0;
			state.total = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
			state.user = 'guest';

			saveStateToNowLocalStorage(state);
		},

		updateNowUser: (state, action) => {
			state.user = action.payload;
		},

		resetNowCart: state => {
			state.cartItems = [];
			state.totalItems = 0;
			state.subTotal = 0;
			state.total = 0;
			state.vat = 0;
			state.shipping = 0;
			state.discount = 0;
			state.user = 'guest';
			state.address = {};
			state.isAddressSet = false;

			saveStateToNowLocalStorage(state);
		},
		setNowCartLoading: (state, action) => {
			state.isLoading = action.payload;
		},
	},
});

export const {
	addToNowCart,
	deleteOneFromNowCart,
	deleteAllFromNowCart,
	deleteSingleItemNowFromCart,
	resetNowCart,
	setNowCartLoading,
	calculateNowCartTotals,
	updateNowUser,
	setNowAddress,
	removeNowAddress,
	setNowToggleCart,
} = buyNowSlice.actions;

export default buyNowSlice.reducer;
