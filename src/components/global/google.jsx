export const googleSignIn = async (credential,isVendor) => {

  try {
    console.log("Attempting Google sign-in with credential");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ credential ,isVendor}),
    });
    

    const data = await response.json();
    // console.log("Google sign-in response:", data);

    if (!response.ok) throw new Error(data.message || "Google sign-in failed");

    console.log("Authentication successful");

    return data;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};
