import productModel from '../models/productModel.js';

// GET books (with department filter)
export const getBooks = async (req, res) => {
  try {
    const { department, keyword } = req.query;

    const andFilters = [];

    if (department) {
      andFilters.push({ $or: [{ department }, { category: department }] });
    }

    if (keyword) {
      andFilters.push({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { author: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      });
    }

    const filter = andFilters.length ? { $and: andFilters } : {};

    const books = await productModel.find(filter);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await productModel.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
