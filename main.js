Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: 
        `<div class="product">
                
            <div class="product-image text-center">
                <img v-bind:src="image" :alt="product">
            </div>

            <div class="product-info">
                <h1><a v-bind:href="productUrl" target="_blank">{{title}}</a></h1>
                <p>{{description}}</p>
                <p v-if="inStock">In Stock</p>
                <!-- <p v-else-if="inStock">Almost sold out!</p> -->
                <p v-else :class="{textDecoration: !inStock}">Out of Stock</p>
                <!-- <span v-if="onSale">{{sale}}</span> -->
                <span>{{sale}}</span>
                <p>User is premium: {{premium}}</p>
                <p>Shipping: {{shipping}}</p>
                
                <product-details :details="details"></product-details>
                
                <div v-for="(variant, index) of variants" class="color-box" 
                    :key="variant.id" 
                    :style="variant.style" 
                    @click="updateProduct(index)">
                </div>
                
                <div class="clear-both"></div>
                <div class="size-box" v-for="size of sizes" :key="size">
                    <p>{{size}}</p>
                </div>
                
                <div class="clear-both"></div>            
                <div>
                    <button v-on:click="addCartEmit" 
                    :disabled="!inStock" 
                    :class="{disabledButton: !inStock}">Add to Cart</button>

                    <button v-on:click="removeCartEmit"
                    :disabled="isCartEmpty" 
                    :class="{disabledButton: isCartEmpty}">Remove from Cart</button>
                </div>
            </div>
            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no review(s) yet.</p>

                <ul>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>Rating {{review.rating}}</p>
                        <p>{{review.review}}</p>
                        <p>{{review.recommend}}</p>
                    </li>
                </ul>

                <product-review @review-submitted="addReview" ></product-review>
            </div>
        </div>
        `,
    data () {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            productUrl: 'https://google.com',
            description: 'A pair of warm, fuzzy socks',
            //image: './assets/vmSocks-green-onWhite.jpg',
            selectedVariant: 0,
            //inventory: 100,
            onSale: false,
            details: ['80%  cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    id: 1001,
                    color: 'green',
                    image: './assets/vmSocks-green-onWhite.jpg',
                    style: {
                        'background-color': 'green'
                    },
                    quantity: 10
                },
                {
                    id: 1002,
                    color: 'blue',
                    image: './assets/vmSocks-blue-onWhite.jpg',
                    style: {
                        'background-color': 'blue'
                    },
                    quantity: 0
                }
            ],
            sizes: ['L', 'M'],
            reviews: []
        }
    },
    methods: {
        addCartEmit: function() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id)
        },
        removeCartEmit() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].id)
        },
        updateProduct: function(index) {
            this.selectedVariant = index
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return [this.brand, this.product].join(' ')
        },
        image() {
            return this.variants[this.selectedVariant].image
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity
        },
        sale() {
            const title = this.title;
            if (this.onSale) {
                return title + 'are on sale!'
            }
            return title + 'are not on sale!'
        },
        shipping() {
            if (this.premium) return 'Free';
            return 5.99
        },
        isCartEmpty() {
            return this.$parent.cart <= 0
        }
    }
});

Vue.component('product-details', {
    props: {
      details: {
        type: Array,
        required: true
      }
    },
    template: 
    `
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul> 
    `
});

Vue.component('product-review', {
    template: 
    `
       <form class="review-form" @submit.prevent="onSubmit">
            <p class="error" v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" required>
            </p>
            
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review" required></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating" required>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p> 

            <p>Would you recommended this product?</p>
            <label>
                Yes
                <input type="radio" value="Yes" name="recommend" v-model="recommend"/>
            </label>
            <label>
                No
                <input type="radio" value="No" name="recommend" v-model="recommend"/>
            </label>

            <p>
                <input type="submit" value="Submit" >  
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommend: null
        }
    },
    methods: {
        onSubmit() {

            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
        
                this.$emit('review-submitted', productReview);
                this.name = this.review = this.rating = this.recommend = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
});


var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
})