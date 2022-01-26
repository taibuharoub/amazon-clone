import moment from "moment";
import { getSession, useSession } from "next-auth/react";
import Header from "../components/Header";
import Order from "../components/Order";
import db from "../firebase";

function Orders({ orders }) {
  const { data: session } = useSession();
  // console.log(orders);
  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {/* {orders?.map((order) => (
            <Order key={order.id} />
          ))} */}
          {orders?.map(
            ({ id, amount, amountShipping, images, timestamp, items }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                images={images}
                timestamp={timestamp}
                items={items}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  // Get the users logged in credentials
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  // Get the users orders
  // Firebase db
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  // console.log(stripeOrders);

  // Stripe Orders, go thru every single firebase document and get the
  // coressponding stripe info, go into the collection of users, go into the
  // document for the session.user.email, go into the collection of orders and
  // order them by timestamp in descending, and get the data from the document
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      // items: await stripe.checkout.sessions.listLineItems(order.id, {
      //   limit: 100,
      // }).data, below items are comig from stripe(comes into a session and gives me the items)
      items: (
        await stripe.checkout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  );

  // orders without fetching items from stripe
  /* const orders = stripeOrders.docs.map((order) => ({
    id: order.id,
    amount: order.data().amount,
    amountShipping: order.data().amount_shipping,
    images: order.data().images,
    timestamp: moment(order.data().timestamp.toDate()).unix(),
  })); */

  return {
    props: {
      orders,
      session,
    },
  };
}
