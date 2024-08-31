import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const Header = ({ searchQuery }) => {
  const [datas, setDatas] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/notes`, {
          params: { searchQuery } // Ensure searchQuery is passed correctly
        });
        
        setDatas(res.data); // Set the data from the response
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function
  }, [searchQuery]); // Re-run effect when searchQuery changes

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      setDatas(datas.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/notes/${editingNote.id}`, {
        title: editTitle,
        content: editContent,
      });
      // Update state with the edited note
      setDatas(
        datas.map((item) =>
          item.id === editingNote.id
            ? { ...item, title: editTitle, content: editContent }
            : item
        )
      );
      setEditingNote(null); // Close the edit form
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap w-full h-screen">
        {datas.map((item) => (
          <div
            key={item.id}
            className="flex flex-col w-64 h-56 m-10 text-center border-2 border-black border-solid shadow-2xl justify-evenly"
          >
            <h2>Content Owner: {item.user_name}</h2>
            <h1 className="text-2xl font-bold text-black">{item.title}</h1>
            <p className="font-bold text-black">{item.content}</p>
            <div className="flex justify-around text-2xl">
              <CiEdit
                onClick={() => handleEdit(item)} // Open edit form for the selected note
                className="cursor-pointer"
              />
              <MdDelete
                onClick={() => handleDelete(item.id)} // Use a function reference
                className="cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="p-8 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-2xl font-bold">Edit Note</h2>
            <div className="mb-4">
              <label
                htmlFor="editTitle"
                className="block mb-2 font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                placeholder="Enter note title"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="editContent"
                className="block mb-2 font-semibold text-gray-700"
              >
                Content
              </label>
              <textarea
                id="editContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                placeholder="Enter note content"
                required
              />
            </div>
            <button
              onClick={handleUpdate}
              className="w-full py-2 text-white transition-colors duration-300 rounded-lg bg-cyan-600 hover:bg-cyan-700"
            >
              Update
            </button>
            <button
              onClick={() => setEditingNote(null)}
              className="w-full py-2 mt-4 text-white transition-colors duration-300 bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
