export default function UsersList() {
  const users = [
    { id: 1, name: "Ali", email: "ali@gmail.com" },
    { id: 2, name: "Ahmed", email: "ahmed@gmail.com" }
  ];

  return (
    <div>
      <h2>Users</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
