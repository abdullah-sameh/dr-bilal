import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Statics from "../../components/statics/Statics";
import { auth } from "../../firebase";
import { setUser } from "../../rtk/slices/userSlice";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        navigate("/");
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <div className="home">
        <Statics />
      </div>
    </>
  );
}
