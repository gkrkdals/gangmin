import React from "react"
import { Link } from "react-router-dom"

export default class Content extends React.PureComponent {

    handleClick = (e) => {
        switch(e.target.id) {
            case 'toManagingMembers':
                break

            case 'toAddingProducts':
                break

            case 'toCheckingReceived':
        }
    }

    render() {
        return (
            <>
                <div className={"container"} style={{ marginTop: "200px"}}>
                    <div className={"row justify-content-center"}>

                        <aside className="col-sm-4">
                            <div className="card contentSize">
                                <article className="card-body">
                                    <h4 className="card-title titleSize text-center mb-4 mt-1">Manage Members</h4>
                                    <hr/>

                                    <p className={"pSize"}>
                                        You can manually change a specific user's status or make the account withdraw.
                                    </p>

                                    <div className="form-group">
                                        <Link to={"/admin/manageMembers"}>
                                            <button type="submit" id={"toManagingMembers"} className="btn btn-primary btn-block" onClick={this.handleClick}>Go</button>
                                        </Link>
                                    </div>

                                </article>
                            </div>
                        </aside>

                        <aside className="col-sm-4">
                            <div className="card contentSize">
                                <article className="card-body">
                                    <h4 className="card-title titleSize text-center mb-4 mt-1">Manage Products</h4>
                                    <hr/>

                                    <p className={"pSize"}>
                                        You can add, edit or delete a product's information.
                                    </p>

                                    <div className="form-group">
                                        <Link to={"/admin/manageProducts"}>
                                            <button type="submit" id={"toAddingProducts"}  className="btn btn-primary btn-block" onClick={this.handleClick}>Go</button>
                                        </Link>
                                    </div>
                                </article>
                            </div>
                        </aside>

                        <aside className="col-sm-4">
                            <div className="card contentSize">
                                <article className="card-body">
                                    <h4 className="card-title titleSize text-center mb-4 mt-1">Check Received Orders</h4>
                                    <hr/>

                                    <p className={"pSize"}>
                                        You can check, edit or delete received orders
                                    </p>

                                    <div className="form-group">
                                        <Link to={"/admin/checkOrder"}>
                                            <button type="submit" id={"toCheckingReceived"}  className="btn btn-primary btn-block" onClick={this.handleClick}>Go</button>
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