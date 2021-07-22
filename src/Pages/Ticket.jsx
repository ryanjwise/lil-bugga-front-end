import Table from "../Components/Table"
import TableSideProjects from "../Components/TableSideProjects"
import {useState, useEffect, useContext} from 'react'
import CreateEntryModal from "./../Components/CreateEntryModal"
import Button from "react-bootstrap/Button"
import { useParams, useLocation, useHistory } from "react-router-dom"
import axios from 'axios'
import { UserContext } from "../Components/UserProvider"

function myRole(id, usersArray){
    return usersArray.reduce((a,i) => i[0] === id ? i[1] : a, -1)
}

// Map projects to array format.
function mapTickets(tickets){
    return tickets.reduce((out, row) => {
        return out.concat([[
            row.subject, 
            row.body, 
            new Date(row.created_at).toString('YYYY-MM-dd').split(" ").slice(0,4).join(" "), 
            row.user_id
        ]])
    }, [])
}

export default function ProjectTickets() {
    // Important variables
    const {prefix, user } = useContext(UserContext)
    const [createEntryModalShow, setCreateEntryModalShow] = useState(false);
    const [entries, setEntries] = useState([]);
    const [ticketData, setTicketData] = useState({});
    const [refresh, setRefresh] = useState(false);
    const {id, tid} = useParams();
    let location = useLocation();
    const history = useHistory();

    // On page load, try to load entires else redirect.
    useEffect(()=>{
        if(user.jwt){
            axios.get(`${prefix}projects/${id}/tickets/${tid}`, {headers: {"Authorization": `Bearer ${user.jwt}`}})
            .then(res => {
                setTicketData(res.data)
                return res.data.entries
            })
            .then(body => {
                setEntries([["Subject", "Body", "Created At", "User Id"], ...mapTickets(body)])
            })
            .catch(err => {
                console.log("Project wasn't found!");
            })
        }
    }, [location.pathname, refresh, id, tid, prefix, user])

    // Method to reload the entries on upload.
    function handleEntry(){
        setRefresh(!refresh)
    }

    // Method to delete a ticket, but only if admin.
    function handleDelete(e){
        e.preventDefault();
        axios.delete(`${prefix}projects/${id}/tickets/${tid}`, {headers: {"Authorization": `Bearer ${user.jwt}`}})
        .then(res => {
            console.log("Ticket Deleted!")
            history.push(`/project/${id}`)
        })
        .catch(err => {
            console.log("Project wasn't found!");
        })
    }
    
    return (
        // Page with Side Bar
        <div className="page d-flex with_side_panel p-0 m-0 outer" id="">

            {/* Side Bar */}
            <TableSideProjects/>

            {/* Page adjacent to Side Bar */}
            <div className="d-flex page m-0 p-2 align-items-center">
                <div className="whole_chunk">
                    <h1 className="text-center">Ticket: {ticketData.id}</h1>
                    <h4 className="text-center">Info on the first entry</h4>
                    <Button className="btn btn-primary rounded-0" variant="primary" onClick={() => setCreateEntryModalShow(true)}>
                        Create Entry
                    </Button>
                    <CreateEntryModal
                        show={createEntryModalShow}
                        onHide={() => {
                            handleEntry();
                            setCreateEntryModalShow(false)
                        }}
                    />
                    <div className="scrollable-wrapper rounded-0">
                        {entries.length > 1 && <Table content={entries}/>}
                    </div>
                    <button className="btn btn-danger w-100 rounded-0" variant="primary" onClick={handleDelete}>
                        Delete Ticket
                    </button>
                </div>
            </div>
        </div>
    )
}