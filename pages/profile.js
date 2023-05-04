import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import UserProfile from "@/components/profile/user-profile";

function ProfilePage() {
  return <UserProfile />;
}

export default ProfilePage;

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: {
        email: session.user.email,
      },
    },
  };
}
