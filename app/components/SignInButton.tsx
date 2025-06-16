"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
export default function SignInButton() {
  const { data: session } = useSession();
  const [showOptions, setShowOptions] = useState(false);

  return session ? (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign out
      </button>
    </div>
  ) : (
    <>
      {showOptions ? (
        <div className="inset-0 z-50 fixed  bg-black bg-opacity-70 flex flex-col justify-center items-center ">
          <button
            onClick={() => signIn("github")}
            className="cursor-pointer px-4 py-2 rounded bg-gray-400"
          >
            Sign in with Github
          </button>
          <button
            onClick={() => signIn("google")}
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowOptions(true)}
          className="cursor-pointer px-4 py-2  bg-black text-white rounded"
        >
          Sign in
        </button>
      )}
    </>
  );
}
