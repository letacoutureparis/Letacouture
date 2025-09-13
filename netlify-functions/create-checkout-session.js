// netlify-functions/create-checkout-session.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Clé sécurisée

exports.handler = async function(event, context) {
const { price, name, image } = JSON.parse(event.body);

try {
const session = await stripe.checkout.sessions.create({
payment_method_types: ['card'],
line_items: [{
price_data: {
currency: 'eur',
product_data: {
name: name,
images: [image],
},
unit_amount: price * 100, // Convertir en centimes
},
quantity: 1,
}],
mode: 'payment',
success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: process.env.CANCEL_URL,
});

return {
statusCode: 200,
body: JSON.stringify({ id: session.id }),
};
} catch (error) {
return {
statusCode: 500,
body: JSON.stringify({ error: error.message }),
};
}
};
