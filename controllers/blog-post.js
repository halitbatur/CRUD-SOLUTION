// Start coding here

const BlogPostModel = require("../models/blog-post");

const getAllBlogPosts = async (_, res) => {
  // Simple find query to fetch all blog posts
  const blogPosts = await BlogPostModel.find();
  res.json(blogPosts);
};

const addBlogPost = async (req, res) => {
  const blogPostData = req.body;
  try {
    // Simple create query to create a new blog post with the request body
    const newBlogPost = await BlogPostModel.create(blogPostData);
    res.status(201).json(newBlogPost);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

const filterBlogPosts = async (req, res) => {
  const { tag, author } = req.query;

  if (!tag && !author) {
    res
      .status(400)
      .json({ message: "make sure you send a valid query parameter" });
  } else {
    const query = {};
    // Creating query object for MongoDB from request query params
    if (tag) query.tags = tag;
    if (author) query["author.name"] = author;

    /*
    Query object will look like:
    {
      tag: <tagname>,
      "author.name": <authorname>
    }
    */

    try {
      // Simple find query with created query object
      const blogPosts = await BlogPostModel.find(query);
      res.json(blogPosts);
    } catch (err) {
      res.status(422).json({ message: err.message });
    }
  }
};

const getOneBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    // Find by ID query
    const blogPost = await BlogPostModel.findById(id);
    if (!blogPost) {
      res.status(422).json({ message: "the post you are looking for wasn't found" });
    } else {
      res.json(blogPost);
    }
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    // Simple find by id and update query with $set operator works to update all blog details
    // Whole author object can also be updated by passing it in the request body
    const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
      id,
      {
        $set: req.body
      },
      {
        new: true,
      }
    );
    if (!updatedBlogPost) {
      res.status(422).json({ message: "the post you are trying to update wasn't found" });
    } else {
      res.json(updatedBlogPost);
    }
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

const removeBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    // Simple find by id and delete query
    const blogPost = await BlogPostModel.findByIdAndDelete(id);
    if (!blogPost) {
      res.status(422).json({ message: "the post you are trying to delete wasn't found" });
    } else {
      res.status(204).send();
    }
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

const updateLikes = async (req, res) => {
  const { id } = req.params;
  try {
    // find one and update query using $inc operator
    const blogPost = await BlogPostModel.findOneAndUpdate(
      { _id: id },
      { $inc: { likes: 1 } },
      { new: true}
    );

    if (!blogPost) {
      res
        .status(422)
        .json({ message: "The post you are looking for wasn't found" });
    } else {
      res.json({ likes: blogPost.likes });
    }
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

module.exports = {
  getAllBlogPosts,
  addBlogPost,
  filterBlogPosts,
  getOneBlogPost,
  updateBlogPost,
  removeBlogPost,
  updateLikes
};