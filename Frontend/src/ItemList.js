const ItemList = ({ items }) => {
    return (
        <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start date</th>
            <th>End Date</th>
        </tr>
        </thead>
        <tbody>
               
            {items.map((item) => (
             <tr>
             <td>{item.tournament_name}</td>
             <td>{item.Type}</td>
             <td>{item.Region}</td>
             </tr>
            ))}
            </tbody>
        </table>
    )
}




export default ItemList
