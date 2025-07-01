import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ConfirmModal from "../components/ConfirmModal";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Nemate pristup.");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.user_id || decoded.id);
    }
    fetchUsers();
  }, []);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      } else {
        console.error("Greška prilikom brisanja.");
      }
    } catch (err) {
      console.error("Greška:", err);
    } finally {
      setIsModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-6">
          Popis registriranih korisnika
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900">
            <thead>
              <tr>
                <th className="px-4 py-3 border-b text-left text-sm text-sky-400 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 border-b text-left text-sm text-sky-400 uppercase">
                  Ime i Prezime
                </th>
                <th className="px-4 py-3 border-b text-left text-sm text-sky-400 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 border-b text-left text-sm text-sky-400 uppercase">
                  Admin
                </th>
                <th className="px-4 py-3 border-b text-left text-sm text-sky-400 uppercase">
                  Akcija
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border-b border-gray-700">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {user.is_admin ? "Da" : "Ne"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-3 rounded cursor-pointer"
                      >
                        Ukloni
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={`Potvrda brisanja korisnika`}
      >
        Jeste li sigurni da želite obrisati korisnika {userToDelete?.first_name}{" "}
        {userToDelete?.last_name}?
      </ConfirmModal>
    </>
  );
}

export default UserList;
