"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth , firestore } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event?.preventDefault();
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            if(user.emailVerified) {
                //retrieve data from local storage
                const registrationData = localStorage.getItem("registrationData");
                const {
                    firstName = "",
                    lastName = "",
                    gender = "",
                } = registrationData ? JSON.parse (registrationData) : {};

                //check if user data exists n forestore
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if(!userDoc.exists()) {
                    //save user data to firestore after email verification
                    await setDoc(doc(firestore, "users", user.uid), {
                        firstName,
                        lastName, 
                        gender,
                        email: user.email,
                    });
                }
                router.push("/congratulations");
            } else {
                setError("Please Verify your Email before Logging in");
            }
        } catch (error) { 
            if(error instanceof Error) {
                setError(error.message);
            } else {
                setError("An Unknown Error Occurred");
            } 
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-600 to-black justify-center items-center h-screen w-screen flex flex-col h-screen relative">
            <h2 className="text-4xl font-medium text-white mb-10"> WELCOME </h2>
            <div className="p-5 border border-gray-300 rounded">
            <form onSubmit={handleLogin} className="space-y-6 px-6 pb-4">
                <div className="mb-15 ">
                   <label
                   htmlFor = "email"
                   className="text-sm font-medium block mb-2 text-gray-300"
                   >
                     Email 
                   </label> 
                   <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                   />
                </div>
           
                <div className="mb-15">
                   <label
                   htmlFor = "password"
                   className="text-sm font-medium block mb-2 text-gray-300"
                   >
                     Password 
                   </label> 
                   <input
                   type="password"
                   id="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                   />
                </div>
            
                
            { error && <p className="text-red-500 text-sm">{error}</p>}
            <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                LOGIN
            </button>
            </form>
                <p className="text-sm font-medium text-gray-300 space-y-6 px-6 pb-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-700 hover:underline">
                    Register Here
                    </Link>
                </p>
            </div>
        </div>
    );   
};

export default LoginPage;