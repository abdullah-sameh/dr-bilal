import './login.css'
import { Link } from "react-router-dom"

export default function Login() {
  return (
    <div className="container-login">
      <div className="login">
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
      </div>
    </div>
  )
}
