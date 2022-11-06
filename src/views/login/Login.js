import LoginForm from "./LoginForm"
import Header from "./Header"
import Footer from "./Footer"
import './Login.css'

export default function Login() {


    return (
            <div>
                <Header />
                <div id = 'img-login '>
                <LoginForm  />
                </div>
                <Footer />
            </div>
    )
}