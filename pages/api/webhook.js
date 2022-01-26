import { buffer } from "micro";
import * as admin from "firebase-admin";

import serviceAccount from "../../permissions.json";

// secure a connection to Firebase from backend
// initialzie app with service account and also guard against multiple initializations
const app = !admin.apps.length
  ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  : admin.app();

// establish connection to stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  // console.log("Fulfilling order", session);

  // save the order in the orders collection, will use the email we added to
  // the session metadata to find the user
  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100, // convert to gbp from pennies
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`);
    });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === "POST") {
    // we want to consume the req as a buffer
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    // sig => signature
    const sig = req.headers["stripe-signature"];

    let event;
    // verify the signature, the event posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("ERROR", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // fulfill order
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

// can configure each endpoint with a config file
// when handling a webhook, we don't want a bodyParser, we want to consume the
// req as a buffer/stream rather than a parsed object
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true, // means this is being resolved by stripe
  },
};
