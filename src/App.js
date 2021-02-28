import { Route } from "react-router"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from './pages/Register'
import { Main as UserMain } from './pages/user/Main'
import MakeOrder from "./pages/user/MakeOrder"
import { CheckOrder as UserCheckOrder } from "./pages/user/CheckOrder"
import { MyProfile as UserMyProfile } from './pages/user/MyProfile'
import { Main as AdminMain } from './pages/admin/Main'
import ManageMembers from "./pages/admin/ManageMembers"
import ManageProducts from "./pages/admin/ManageProducts"
import { CheckOrder as AdminCheckOrder} from "./pages/admin/CheckOrder"
import { MyProfile as AdminMyProfile } from "./pages/admin/MyProfile"


function App() {
    return (
        <>
            <Route exact path={"/"} component={Home} />
            <Route path={"/login"} component={Login} />
            <Route path={"/register"} component={Register} />
            <Route path={"/user/main"} component={UserMain} />
            <Route path={"/user/makeOrder"} component={MakeOrder} />
            <Route path={"/user/checkOrder"} component={UserCheckOrder}/>
            <Route path={"/user/myProfile"} component={UserMyProfile} />
            <Route path={"/admin/main"} component={AdminMain} />
            <Route path={"/admin/manageMembers"} component={ManageMembers} />
            <Route path={"/admin/manageProducts"} component={ManageProducts} />
            <Route path={"/admin/checkOrder"} component={AdminCheckOrder} />
            <Route path={"/admin/myProfile"} component={AdminMyProfile}/>
        </>
    )
}

export default App;
