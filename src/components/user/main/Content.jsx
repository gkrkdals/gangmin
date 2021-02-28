import React from "react"
import { Link } from "react-router-dom"

export default class Content extends React.PureComponent {

    render() {
        return (
            <>
                <div className={"container"} style={{ marginTop: "150px"}}>
                    <div className={"row justify-content-center"}>

                        <aside className="col-sm-4">
                            <div className="card contentSize">
                                <article className="card-body">
                                    <h4 className="card-title titleSize text-center mb-4 mt-1">Search Items/<br/>Make an Order</h4>
                                    <hr/>

                                    <p className={"pSize"}>
                                        You can search for available items, or select and order items.
                                    </p>

                                    <div className="form-group">
                                        <Link to={"/user/makeOrder"}>
                                            <button type="submit" id={"toMakingOrder"} className="btn btn-primary btn-block" >Go</button>
                                        </Link>
                                    </div>

                                </article>
                            </div>

                        </aside>

                        <aside className="col-sm-4">
                            <div className="card contentSize">
                                <article className="card-body">
                                    <h4 className="card-title titleSize text-center mb-4 mt-1">Check your orders</h4>
                                    <hr/>

                                    <p className={"pSize"}>
                                        You can check your orders you've made and cancel an order.
                                    </p>

                                    <div className="form-group">
                                        <Link to={"/user/checkOrder"}>
                                            <button type="submit" id={"toCheckingOrder"}  className="btn btn-primary btn-block">Go</button>
                                        </Link>
                                    </div>
                                </article>
                            </div>

                        </aside>
                    </div>
                </div>
            </>
        )
    }
}