import "./login.css";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

export default function Login() {
  const partInit = async (main) => {
    await loadFull(main);
  };
  return (
    <div className="container-login">
      <motion.div
        whileInView={{ translateY: [400, 0] }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="login"
      >
        <h1>أهلاً بِك في أراك</h1>
        <form>
          <label htmlFor="email">البريد الالكتروني</label>
          <input type="email" id="email" />

          <label htmlFor="password">كلمة المرور</label>
          <input type="password" id="password" />

          <div>
            <Link to="/home" type="submit">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </motion.div>
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
