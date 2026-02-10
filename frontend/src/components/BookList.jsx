import { useEffect, useState } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [department, setDepartment] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [department, keyword]);

  const fetchBooks = async () => {
    const { data } = await axios.get(
      `/api/books?department=${department}&keyword=${keyword}`
    );
    setBooks(data);
  };

  return (
    <div>
      <h2>SmartMart – College Bookstore</h2>

      <select onChange={(e) => setDepartment(e.target.value)}>
        <option value="">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="MECH">MECH</option>
        <option value="CIVIL">CIVIL</option>
        <option value="EEE">EEE</option>
      </select>

      <input
        type="text"
        placeholder="Search book name..."
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div>
        {books.map((book) => (
          <div key={book._id}>
            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p>{book.department}</p>
            <p>₹{book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
