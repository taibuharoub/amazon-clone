import { async } from "@firebase/util";
import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/Header";

function Signin({ providers }) {
  return (
    <>
      {/* <Header /> */}
      <div
        className="flex flex-col items-center justify-center
       min-h-screen py-2 -mt-56 px-14 text-center"
      >
        <div>
          <img className="w-80" src="https://links.papareact.com/ocw" alt="" />
          <p className="font-xs italic">
            This is not a Real app, it is for educational purposesonly
          </p>
        </div>
        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 bg-red-500 rounded-lg text-white"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default Signin;
