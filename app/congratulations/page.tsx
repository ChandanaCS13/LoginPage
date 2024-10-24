"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth , firestore } from "@/firebase/firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const CongratulationPage = () => {
    const [user, setUser] = useState<User |null>(null);
    const [userName, setUserName] = useState<string |null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async(user) => {
        if(user) {
            setUser(user);
            const userDoc =await getDoc(doc(firestore, "users", user.uid));
            if(userDoc.exists()) {
                const userData = userDoc.data();
                setUserName(`${userData.firstName} ${userData.lastName}`);
            }
        } else {
            router.push("/login");
        }
        setLoading(false);
    });


    return () => unsubscribe();
}, [router]);

const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push("/login");
    } catch(error) {
        console.error("Logout Error:",error);
    }
};

const handleChangePassword = () => {
    router.push("/changepassword");
};

if(loading) {
    return<p> Loading...</p>
}

return (
    <div className="min-h-screen bg-gray-100 bg-gradient-to-b from-gray-600 to-black">
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xL mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="text-white text-xl"> 
                        <h1>DashBoard </h1>
                 </div>
                    </div>
                </div>
            </div>
        </nav>
        <main className="flex flex-col items-center justify-center flex-grow mt-10">
            {userName && (
                <h1 className="text-4xl font-bold mb-6 ml-10">
                    WELCOME , {userName}!
                    <h1 className="text-4xl font-bold mt-6 ml-10"> CONGRATULATIONS </h1>
                </h1>
            )}
            <div className="space-x-4">
                <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Logout
                </button>
                <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Change Password
                </button>
            </div>
        </main>
    </div>
);
};

export default CongratulationPage;