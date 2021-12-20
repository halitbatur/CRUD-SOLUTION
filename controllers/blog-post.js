// Start coding here

const BlogPostModel = require("../models/blog-post");

const getAllBlogPosts = async (_, res) => {
  try {
    // Simple find query to fetch all blog posts
    const blogPosts = await BlogPostModel.find();
    res.json(blogPosts);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

const addBlogPost = async (req, res) => {
  const blogPostData = req.body;
  try {
    // Simple create query to create a new blog post with the request body, assuming that all data is sent in the request body in correct format as required by model
    const newBlogPost = await BlogPostModel.create(blogPostData);
    // Note: We didn't use any validations before adding the blog post, as all necessary validations (required check, default values) are handled by our model
    res.status(201).json(newBlogPost);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

/* NOTE: This is an alternate solution to the above function
Although the above function works but it creates a new author ID for the same author across blog posts, so here is an alternate function which checks if the author is existing before creating a blog post and reuses the author ID
*/
const addBlogPostWithUniqueAuthorId = async (req, res) => {
  const blogPostData = req.body;
  try {
    // Check if this author already exists
    const existingAuthor = await BlogPostModel.findOne({"author.name": blogPostData.author.name}).select({"author._id": 1});
    // Save the existing author ID for the new blog post
    if (existingAuthor && existingAuthor.author)
      blogPostData.author._id = existingAuthor.author._id
    // Simple create query to create a new blog post
    const newBlogPost = await BlogPostModel.create(blogPostData);
    // Note: We didn't use any validations before adding the blog post, as all necessary validations (required check, default values) are handled by our model
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
    Depending on query params, the query object will look like:
    {
      tag: <tagname>
    }
    OR
    {
      "author.name": <authorname>
    }
    OR
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
      // This flag ensures MongoDB returns the new document after update operation is completed
      // Then we don't need to fetch the document again
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
    // can also use findByIdAndUpdate
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
  addBlogPostWithUniqueAuthorId,
  filterBlogPosts,
  getOneBlogPost,
  updateBlogPost,
  removeBlogPost,
  updateLikes
};