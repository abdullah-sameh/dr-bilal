
export default function Login() {
  return (
    <div className="login">
      <h1>أهلاً بِك في أراك</h1>
      <form>
        <label htmlFor="email">البريد الالكتروني</label>
        <input type="email" id="email" />

        <label htmlFor="password">كلمة المرور</label>
        <input type="password" id="password" />

        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  )
}
