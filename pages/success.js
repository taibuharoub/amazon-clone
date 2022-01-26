import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Header from "../components/Header";
function Success() {
  const router = useRouter();
  return (
    <div className="bg-gray-100 h-screen">
      <Header />

      <main className="max-w-screen-lg mx-auto">
        {/* flex-col will useup the full width of the container */}
        <div className="flex flex-col p-10 bg-white">
          <div className="flex items-center space-x-2 mb-5">
            <CheckCircleIcon className="text-green-500 h-10" />
            <h1 className="text-3xl">
              Thank you, your order has been confirmed!
            </h1>
          </div>
          <p>
            Thank you for shopping with us, We&apos;ll send a confirmation once
            your items has shipped, if you would like to check the status of
            order(s) please press the link below.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="custom-button mt-8"
          >
            Go to my orders
          </button>
        </div>
      </main>
    </div>
  );
}

export default Success;
