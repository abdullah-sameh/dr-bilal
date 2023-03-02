import "./login.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../rtk/slices/userSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function Login() {
  const [resetForm, setResetForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const partInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        navigate("/home");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFormHandler = (e) => {
    e.preventDefault();
    let email = e.target[0]?.value;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "راجع الايميل لتغيير الباسورد",
          confirmButtonColor: "#207bffff",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeInUp",
          },
        });

        setResetForm(false);
      })
      .catch((e) => {
        if (e.message === "Firebase: Error (auth/user-not-found).") {
          Swal.fire({
            icon: "error",
            title: "الايميل غلط",
            confirmButtonColor: "#207bffff",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "فى مشكلة مش مفهومة ارجع للمطورين",
            confirmButtonColor: "#207bffff",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        }
      });
  };

  const loginHandler = (e) => {
    e.preventDefault();
    let email = e?.target[0]?.value;
    let password = e?.target[1]?.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        dispatch(setUser(userCred?.user));
        sessionStorage.setItem("user", userCred?.user?.uid);
        navigate("/home");
      })
      .catch((e) => {
        if (e.message === "Firebase: Error (auth/wrong-password).") {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "الباسورد غلط",
          });
        } else if (e.message === "Firebase: Error (auth/user-not-found).") {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "الايميل غلط",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "خطأ غير مفهوم يرجى التواصل مع المطورين",
          });
        }
      });
  };

  return (
    <div className="container-login">
      <motion.div
        whileInView={{ translateY: [400, 0] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="login"
      >
        <h1>أهلاً بِك في أراك</h1>
        <form onSubmit={loginHandler}>
          <label htmlFor="email">البريد الالكتروني</label>
          <input type="email" id="email" required />

          <label htmlFor="password">كلمة المرور</label>
          <input type="password" id="password" required />
          <div>
            <button type="submit">تسجيل الدخول</button>
            <p onClick={() => setResetForm(true)} className="forget-password">
              هل نسيت كلمة المرور؟
            </p>
          </div>
        </form>
      </motion.div>

      {resetForm && (
        <div className="reset-form">
          <motion.form
            whileInView={{ scale: [0, 1.1, 1] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onSubmit={resetFormHandler}
          >
            <h4 onClick={() => setResetForm(false)} className="close">
              X
            </h4>
            <label htmlFor="email">البريد الالكتروني</label>
            <input type="email" id="email" required />
            <div>
              <button type="submit">تأكيد</button>
            </div>
          </motion.form>
        </div>
      )}

      <Particles
        id="tsparticles"
        init={partInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: 2,
          },
          particles: {
            number: {
              value: 50,
              density: {
                enable: false,
                value_area: 500,
              },
            },
            color: {
              value: "#eeeeee",
            },
            shape: {
              type: "circle",
              options: {
                sides: 5,
              },
            },
            opacity: {
              value: 0.8,
              random: false,
              anim: {
                enable: false,
                speed: 0.1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 17,
              random: false,
              anim: {
                enable: true,
                speed: 50,
                size_min: 0.1,
                sync: false,
              },
            },
            rotate: {
              value: 0,
              random: true,
              direction: "top",
              animation: {
                enable: false,
                speed: 5,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
              distance: 600,
              color: "#eeeeee",
              opacity: 0.4,
              width: 0,
            },
            move: {
              enable: true,
              speed: 5,
              direction: "top",
              random: false,
              straight: true,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: false,
                mode: ["grab"],
              },
              onclick: {
                enable: false,
                mode: "bubble",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: {
                distance: 200,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        }}
      />
    </div>
  );
}
