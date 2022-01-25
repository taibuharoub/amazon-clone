const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { items, email } = req.body;
  // console.log(items, email);

  // transform data to stripe format/stripe requires the data in this format
  const transformedItems = items.map((item) => ({
    description: item.description,
    quantity: 1, // account for the quantity logic if u added any eg groups similar items together, for my case each item is separate
    price_data: {
      currency: "gbp",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
      },
    },
  }));

  // create a checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_rates: ["shr_1KLp2OC8lUyX22jBR79SVsjY"], // takes an array of shipping rates ids
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/cancel`,
    metadata: {
      email, //will allow us to push info from the stripe page into the correct place in firebase(db)
      images: JSON.stringify(items.map((item) => item.image)),
    },
  });

  res.status(200).json({ id: session.id });
};
