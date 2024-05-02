const ItemList = ({ items }) => {
    return (
        <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Start date</th>
            <th>End Date</th>
        </tr>
        </thead>
        <tbody>
               
            {items.map((item) => (
             <tr>
             <td>{item.tournament_name}</td>
             <td>{item.start_date}</td>
             <td>{item.end_date}</td>
             </tr>
            ))}
            </tbody>
        </table>
    )
}




export default ItemList
