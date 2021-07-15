import { useState } from "react"

export default function Account(props) {

    // Holds the state of the form to make it controlled.
    let [form, setForm] = useState({"email":"", "password":"", "confirm_password":""});

    // Handle the changing of any part of the form.
    function handleInput(e){
        console.log(form)
        setForm({     
            ...form,       
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="container-fluid page">
            <div className="d-flex align-items-center flex-column container center_chunk py-5">

                <h1>{props.user.name}</h1>

                <form className="py-2">
                    <div className="form-group mb-2">
                        <label for="Email">Email address</label>
                        <input type="email" value={form.email} onChange={handleInput} className="form-control" name="email" id="Email" placeholder={props.user.email}/>
                    </div>

                    <div className="form-group mb-2">
                        <label for="Password">Password</label>
                        <input type="password" value={form.password} onChange={handleInput} className="form-control" name="password" id="Password" placeholder="sample_password"/>
                    </div>

                    <div className="form-group mb-2">
                        <label for="ConfirmPassword">Confirm Password</label>
                        <input type="password" value={form.confirm_password} onChange={handleInput} className="form-control" name="confirm_password" id="ConfirmPassword" placeholder="sample_password"/>
                    </div>

                    <button type="submit" className="btn btn-danger w-100">Change Details </button>
                </form>

            </div>
        </div>
    )
}