import { toast } from "react-toastify";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

const toastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

function UserProfile() {
  // Client side protect

  // const router = useRouter();
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (!session && status !== "loading") {
  //     router.push("/auth");
  //   }
  // }, [session, status]);

  // if (status === "loading") return <p>loading...</p>;

  const changePasswordHandler = async (passwordData) => {
    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Something went wrong!", toastOptions);
      return;
    }

    toast.success(data.message, toastOptions);
  };

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
